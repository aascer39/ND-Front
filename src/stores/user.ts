import { defineStore } from 'pinia';
// 导入我们刚刚创建的 API 函数和 User 类型
import * as userApi from '@/api/admin';
import type { User } from '@/api/admin';

interface UserState {
    users: User[];
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        users: [] // 初始状态为空，将通过 API 获取
    }),
    actions: {
        // 从服务器获取用户并更新 state
        async fetchUsers() {
            try {
                // 调用 API 函数
                const userList = await userApi.getUsers();
                // 用返回的数据更新 state
                this.users = userList;
            } catch (error) {
                console.error('Failed to fetch users:', error);
                // 这里可以添加错误处理逻辑，比如显示一个通知
            }
        },

        // 新增用户
        async addUser(newUser: Omit<User, 'id'>) {
            try {
                // 调用 API 新增用户
                const createdUser = await userApi.addUser(newUser);
                // 将后端返回的新用户添加到当前列表的末尾
                this.users.push(createdUser);
            } catch (error) {
                console.error('Failed to add user:', error);
            }
        },

        // 更新用户
        async updateUser(userToUpdate: User) {
            try {
                await userApi.updateUser(userToUpdate);
                // 更新成功后，在前端列表中找到并更新该用户
                const index = this.users.findIndex(u => u.id === userToUpdate.id);
                if (index !== -1) {
                    this.users[index] = userToUpdate;
                }
            } catch (error) {
                console.error('Failed to update user:', error);
            }
        },

        // 删除用户
        async deleteUser(userId: number) {
            try {
                await userApi.deleteUser(userId);
                // 删除成功后，从前端列表中移除该用户
                this.users = this.users.filter(u => u.id !== userId);
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    }
});