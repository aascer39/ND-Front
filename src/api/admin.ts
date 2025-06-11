import axios from 'axios';

export interface User {
    id: number;
    name: string;
    email: string;
}

// 创建一个 axios 实例，可以进行一些全局配置，如基础URL
const apiClient = axios.create({
    baseURL: '/api', // 你的后端 API 基础路径
    timeout: 1000,
});

export const getUsers = async (): Promise<User[]> => {
    // axios.get<User[]> 表示我们期望返回的数据是 User 数组类型
    const response = await apiClient.get<User[]>('/users');
    return response.data;
};

export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await apiClient.post<User>('/users', user);
    return response.data;
};

export const updateUser = async (user: User): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${user.id}`, user);
    return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
};