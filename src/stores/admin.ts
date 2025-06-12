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

export const useUserStore = defineStore('user', {
    state: () => ({
        // 初始化时，先检查 localStorage，再检查 sessionStorage
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
            status: null as number | null,
            emailDomain: '',
        },
        listLoading: false,
    }),

    actions: {
        // 修改 login action，增加 rememberMe 参数
        async login(loginData: LoginData, rememberMe: boolean) {
            try {
                // API 响应是一个包含 token 的对象
                const response: LoginResponse = await adminLogin(loginData);
                const token = response.tokenValue; // 提取 token 值
                this.token = token;

                // 根据 rememberMe 的值决定如何存储 token
                if (rememberMe) {
                    localStorage.setItem('token', token);
                } else {
                    sessionStorage.setItem('token', token);
                }

                // 2. 直接用登录响应的数据填充 userInfo
                // 注意字段的映射，例如 loginId -> userId
                this.userInfo = {
                    userId: response.loginId,
                    username: response.username,
                    status: response.status,
                    lastLoginTs: response.lastLoginTs,
                    // 其他在 User 接口中但登录响应没有的字段会是 undefined
                };

                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        },

        // 更新 logout action
        async logout() {
            try {
                await adminLogout();
                this.token = null;
                this.userInfo = {};
                localStorage.removeItem('token');
                sessionStorage.removeItem('token'); // 同时从 sessionStorage 中移除
                ElMessage.success('用户登出成功！');
            } catch (error) {
                console.error("Failed to logout:", error);
            }
        },

        async fetchUsers(query: Partial<UserPageQuery> = {}) {
            this.listLoading = true;
            const isNewSearch = query.current === undefined;
            const params: UserPageQuery = {
                current: isNewSearch ? 1 : (query.current || this.pagination.currentPage),
                size: query.size || this.pagination.pageSize,
            };
            if (this.searchQuery.nameKeyword) params.nameKeyword = this.searchQuery.nameKeyword;
            if (this.searchQuery.status !== null) params.status = this.searchQuery.status;
            if (this.searchQuery.emailDomain) params.emailDomain = this.searchQuery.emailDomain;

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
            this.searchQuery = { nameKeyword: '', status: null, emailDomain: '' };
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
                // 确保 userData 中包含 id 字段
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