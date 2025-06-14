// src/stores/admin.ts

import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import CryptoJS from 'crypto-js';
import {
    adminLogin,
    getUserList,
    registerUser,
    updateUser,
    deleteUserById,
    adminLogout,
    adminAddUser,
    banUserById,
    unbanUserById,
    resetUserPassword
} from '@/api/admin';
import type { User, LoginData, RegisterData, UserPageQuery, LoginResponse, adminAddUserData } from '@/api/types';

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
            status: undefined as string | undefined,
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

        // [!code focus start]
        /**
         * 管理员添加用户，只传 username 和 email
         * @param userData 
         */
        async adminAddUser(userData: adminAddUserData) {
            try {
                await adminAddUser(userData); // 调用 adminAddUser API
                ElMessage.success('新增用户成功，用户的随机密码通过邮箱发送给了用户！');
                await this.fetchUsers({ current: 1 });
            } catch (error) {
                console.error("Failed to add user:", error);
            }
        },
        // [!code focus end]

        // [!code focus start]
        /**
         * 用户自行注册，密码由前端加密
         * @param userData 包含 username, email, password (加密后)
         */
        async selfRegisterUser(userData: RegisterData) {
            try {
                await registerUser(userData);
                ElMessage.success('注册成功！请登录。');
                return Promise.resolve(); // 返回成功状态
            } catch (error) {
                console.error("Failed to register user:", error);
                return Promise.reject(error); // 返回失败状态
            }
        },

        async updateUser(userData: Partial<User>) {
            try {
                // 检查正确的属性名：userId
                if (!userData.userId) {
                    throw new Error('用户数据缺少 userId 字段，无法更新');
                }
                await updateUser(userData as Partial<User> & { userId: number });
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
        /**
         * [新增] 封禁用户 Action
         * @param userId 
         */
        async banUser(userId: number) {
            try {
                await banUserById(userId); // 调用新的 banUserById API
                ElMessage.success('封禁用户成功！');
                // 操作成功后，重新获取用户列表以刷新界面
                await this.fetchUsers();
            } catch (error) {
                console.error("Failed to ban user:", error);
                // 错误消息已由 request.ts 中的拦截器统一处理
            }
        },

        /**
         * [新增] 解封用户 Action
         * @param userId 
         */
        async unbanUser(userId: number) {
            try {
                await unbanUserById(userId); // 调用新的 unbanUserById API
                ElMessage.success('解封用户成功！');
                await this.fetchUsers();
            } catch (error) {
                console.error("Failed to unban user:", error);
            }
        },
        async resetPassword(userId: number) {
            try {
                await resetUserPassword(userId);
                ElMessage.success('重置密码成功！');
                // 操作成功后，重新获取用户列表以刷新界面
                await this.fetchUsers();
            } catch (error) {
                console.error("重置密码失败", error);
            }
        }
    },
});