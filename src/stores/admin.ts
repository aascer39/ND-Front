// src/stores/admin.ts

import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
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
    resetUserPassword,
    getAdminInfoById
} from '@/api/admin';
import type {
    User,
    LoginData,
    RegisterData,
    UserPageQuery,
    LoginResponse,
    adminAddUserData
} from '@/api/types';

// 定义在 localStorage 中存储的键
const USER_INFO_KEY = 'user-info';
const TOKEN_KEY = 'token';

export const adminStore = defineStore('user', {
    state: () => ({
        // [关键修复] token 和 userInfo 都从 localStorage 初始化
        token: localStorage.getItem(TOKEN_KEY) || null,
        userInfo: JSON.parse(localStorage.getItem(USER_INFO_KEY) || '{}') as Partial<User>,
        
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

                // 将完整的用户信息对象存入 state
                this.userInfo = {
                    userId: response.loginId,
                    role: response.loginType,
                    username: response.username,
                    status: response.status,
                    lastLoginTs: response.lastLoginTs,
                };
                
                // [关键修复] 根据 rememberMe 选择 localStorage 或 sessionStorage
                const storage = rememberMe ? localStorage : sessionStorage;

                // 将 token 和 userInfo 对象都存入选择的 storage
                storage.setItem(TOKEN_KEY, token);
                storage.setItem(USER_INFO_KEY, JSON.stringify(this.userInfo));

                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        },

        async logout() {
            try {
                if (this.token) {
                    await adminLogout();
                }
            } catch (error) {
                console.error("Backend logout failed, proceeding with frontend cleanup:", error);
            } finally {
                // [关键修复] 清理 state 和所有本地存储
                this.token = null;
                this.userInfo = {};
                localStorage.removeItem(TOKEN_KEY);
                sessionStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_INFO_KEY);
                sessionStorage.removeItem(USER_INFO_KEY);

                ElMessage.success('登出成功！');
            }
        },
        

        // [新增] 获取当前登录用户信息 (用于刷新页面后恢复状态)
        async fetchCurrentUserInfo() {
            // 如果 state 中已经有 userId，说明状态是完整的，无需重新获取
            if (this.userInfo.userId) {
                return Promise.resolve();
            }
            // 如果 state 中没有用户信息但有 token，说明可能刚刷新页面，需要根据 token 去后端获取
            if (this.token) {
                try {
                    // 这里假设你有一个通过 token 获取用户信息的接口
                    // 如果没有，可以沿用之前的 getAdminInfoById，但需要 loginId
                    // const info = await getInfoByToken(); 
                    // this.userInfo = info;

                    // 注意：如果刷新后没有保留 loginId，则无法调用 getAdminInfoById
                    // 所以最好的做法是在登录时把整个 userInfo 对象存起来
                    // 此函数现在主要用作一个“守卫”，确保状态一致性
                    console.log("State restored from localStorage. User:", this.userInfo.username);

                } catch (error) {
                    console.error("Failed to fetch user info by token, logging out.", error);
                    // 获取信息失败（如token失效），则执行登出
                    await this.logout();
                    return Promise.reject(error);
                }
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
            this.sort = { prop: 'registrationTs', order: 'descending' };
            this.fetchUsers({ current: 1 });
        },

        async adminAddUser(userData: adminAddUserData) {
            try {
                await adminAddUser(userData);
                ElMessage.success('新增用户成功，用户的随机密码通过邮箱发送给了用户！');
                await this.fetchUsers({ current: 1 });
            } catch (error) {
                console.error("Failed to add user:", error);
            }
        },

        async selfRegisterUser(userData: RegisterData) {
            try {
                await registerUser(userData);
                ElMessage.success('注册成功！请登录。');
                return Promise.resolve();
            } catch (error) {
                console.error("Failed to register user:", error);
                return Promise.reject(error);
            }
        },

        async updateUser(userData: Partial<User>) {
            try {
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

        // 保留了 fetchUserInfo，但现在它的主要作用是校验，因为信息已从 localStorage 恢复
        async fetchUserInfo() {
            if (!this.userInfo.userId) {
                await this.logout();
                return Promise.reject(new Error("User ID is missing, logging out."));
            }
            try {
                const userInfoData = await getAdminInfoById(this.userInfo.userId);
                this.userInfo = userInfoData; // 可选：用后端最新数据覆盖本地数据
            } catch (error) {
                await this.logout();
                return Promise.reject(error);
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

        async banUser(userId: number) {
            try {
                await banUserById(userId);

                ElMessage.success('封禁用户成功！');
                await this.fetchUsers();
            } catch (error) {
                console.error("Failed to ban user:", error);
            }
        },

        async unbanUser(userId: number) {
            try {
                await unbanUserById(userId);
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
                await this.fetchUsers();
            } catch (error) {
                console.error("重置密码失败", error);
            }
        }
    },
});