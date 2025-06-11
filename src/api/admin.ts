import apiClient from '@/utils/request'; // 引入封装好的 axios 实例
import type { User, LoginData, PaginatedUsers, RegisterData, UserPageQuery } from './types'; // 假设类型统一放在 types.ts 中

/**
 * 管理员登录 API
 * @param data 包含用户名和密码的登录信息
 * @returns {Promise<string>} 返回一个 Promise，成功时解析为 Token 字符串
 */
export const adminLogin = (data: LoginData): Promise<string> => {
    return apiClient({
        url: '/admin/session',
        method: 'post',
        data,
    });
};
/**
 * 获取当前登录的管理员信息
 * @returns {Promise<User>}
 */
export const getUserInfo = (): Promise<User> => {
    return apiClient({
        url: '/admin/info', // 假设这是获取用户信息的API
        method: 'get',
    });
};

/**
 * 获取用户列表（支持分页和筛选）
 * @param params 包含分页信息和筛选条件的对象
 * @returns {Promise<PaginatedUsers>} 返回一个 Promise，成功时解析为分页的用户数据
 */
export const getUserList = (params: UserPageQuery): Promise<PaginatedUsers> => {
    return apiClient({
        url: '/admin/page',
        method: 'get',
        params, // GET 请求会将 params 对象转换为 URL 查询字符串
    });
};

/**
 * 注册新用户
 * 注意：根据您的文档，这是一个 GET 请求
 * @param data 包含用户名、密码和邮箱的注册信息
 * @returns {Promise<any>}
 */
export const registerUser = (data: RegisterData): Promise<any> => {
    return apiClient({
        url: '/users/register',
        method: 'get',
        params: data,
    });
};

/**
 * 更新用户信息
 * 注意：根据您的文档，路径是固定的 /users/updateUser
 * @param data 包含用户ID和需要更新的字段的对象
 * @returns {Promise<User>} 返回更新后的用户信息
 */
export const updateUser = (data: Partial<User> & { id: number }): Promise<User> => {
    return apiClient({
        url: '/users/updateUser',
        method: 'put',
        data,
    });
};

/**
 * [推荐] 根据ID删除指定用户 (管理员操作)
 * @param userId 需要被删除的用户的ID
 * @returns {Promise<void>}
 */
export const deleteUserById = (userId: number): Promise<void> => {
    return apiClient({
        // URL遵循RESTful风格，清晰地指向要操作的资源
        url: `/admin/users/${userId}`,
        // 使用 DELETE 方法，这是删除操作的标准HTTP动词
        method: 'delete',
    });
};