import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import {
  adminLogin,
  getUserInfo, 
  getUserList,
  registerUser,
  updateUser,
  deleteUserById,
} from '@/api/admin';
import type { User, LoginData, RegisterData, UserPageQuery } from '@/api/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null as string | null,
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
    async login(loginData: LoginData) {
      try {
        const token = await adminLogin(loginData);
        this.token = token;
        localStorage.setItem('token', token);
        await this.fetchUserInfo();
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async fetchUserInfo() {
      if (!this.token) return;
      try {
        const userInfo = await getUserInfo();
        this.userInfo = userInfo;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        this.logout();
      }
    },

    logout() {
      this.token = null;
      this.userInfo = {};
      localStorage.removeItem('token');
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
        await updateUser(userData);
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