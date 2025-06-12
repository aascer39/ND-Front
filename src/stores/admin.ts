// src/stores/admin.ts

import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import {
    adminLogin,
    getUserList,
    registerUser,
    updateUser,
    deleteUserById,
    adminLogout
} from '@/api/admin';
import type { User, LoginData, RegisterData, UserPageQuery, LoginResponse } from '@/api/types';

export const adminStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || sessionStorage.getItem('token') || null as string | null,
        userInfo: {} as Partial<User>,
        users: [] as User[],
        pagination: {
            currentPage: 1,
            pageSize: 10,
            total: 0,
        },
        searchQuery: {
            nameKeyword: '',
            status: undefined as number | undefined,
            emailDomain: '',
        },
        // [已修正] 恢复为单个排序对象，以匹配后端能力
        sort: {
            prop: 'registrationTs',
            order: 'descending' as 'ascending' | 'descending' | null
        },
        listLoading: false,
    }),

    actions: {
        async login(loginData: LoginData, rememberMe: boolean) {
            try {
                const response: LoginResponse = await adminLogin(loginData);
                const token = response.tokenValue;
                this.token = token;

                if (rememberMe) {
                    localStorage.setItem('token', token);
                } else {
                    sessionStorage.setItem('token', token);
                }

                this.userInfo = {
                    userId: response.loginId,
                    username: response.username,
                    status: response.status,
                    lastLoginTs: response.lastLoginTs,
                };

                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        },

        async logout() {
            try {
                await adminLogout();
                this.token = null;
                this.userInfo = {};
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                ElMessage.success('用户登出成功！');
            } catch (error) {
                console.error("Failed to logout:", error);
            }
        },

        // [已修正] 创建一个专门的 action 来处理单列排序
        setSort(sortInfo: { prop: string, order: 'ascending' | 'descending' | null }) {
            this.sort.prop = sortInfo.prop;
            this.sort.order = sortInfo.order;
            this.fetchUsers(); // 更新排序后立即重新获取数据
        },

        async fetchUsers(query: Partial<UserPageQuery> = {}) {
            this.listLoading = true;
            const params: UserPageQuery = {
                current: query.current || this.pagination.currentPage,
                size: query.size || this.pagination.pageSize,
            };
            if (this.searchQuery.nameKeyword) params.nameKeyword = this.searchQuery.nameKeyword;
            if (this.searchQuery.status !== undefined) params.status = this.searchQuery.status;

            // [已修正] 使用单一的 sort 对象来生成正确的排序参数
            if (this.sort.prop && this.sort.order) {
                params.sortField = this.sort.prop.replace(/([A-Z])/g, "_$1").toLowerCase();
                params.sortOrder = this.sort.order === 'ascending' ? 'asc' : 'desc';
            }

            try {
                const response = await getUserList(params);
                this.users = response.records;
                this.pagination.total = response.total;
                this.pagination.currentPage = params.current!;
                this.pagination.pageSize = params.size!;
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                this.listLoading = false;
            }
        },

        resetSearchQuery() {
            this.searchQuery = { nameKeyword: '', status: undefined, emailDomain: '' };
            // [已修正] 重置为默认的单列排序
            this.sort = { prop: 'registrationTs', order: 'descending' };
            this.fetchUsers({ current: 1 });
        },

        async addUser(userData: RegisterData) {
            try {
                await registerUser(userData);
                ElMessage.success('新增用户成功！');
                await this.fetchUsers({ current: 1 });
            } catch (error) {
                console.error("Failed to add user:", error);
            }
        },

        async updateUser(userData: User) {
            try {
                if (!('id' in userData) || userData.id === undefined || userData.id === null) {
                    throw new Error('用户数据缺少 id 字段，无法更新');
                }
                await updateUser({ ...userData, id: Number(userData.id) });
                ElMessage.success('更新用户成功！');
                await this.fetchUsers();
            } catch (error) {
                console.error("Failed to update user:", error);
            }
        },

        async deleteUser(userId: number) {
            try {
                await deleteUserById(userId);
                ElMessage.success('删除用户成功！');
                if (this.users.length === 1 && this.pagination.currentPage > 1) {
                    await this.fetchUsers({ current: this.pagination.currentPage - 1 });
                } else {
                    await this.fetchUsers();
                }
            } catch (error) {
                console.error("Failed to delete user:", error);
            }
        },
    },
});