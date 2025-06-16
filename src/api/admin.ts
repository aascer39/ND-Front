import apiClient from '@/utils/request'; // 引入封装好的 axios 实例
import type { User, LoginData, PaginatedUsers, RegisterData, UserPageQuery, LoginResponse, adminAddUserData } from './types'; // 假设类型统一放在 types.ts 中

/**
 * 管理员登录 API
 * @param data 包含用户名和密码的登录信息
 * @returns {Promise<LoginResponse>} 成功时解析为包含Token信息的对象
 */
// 2. 更新函数的返回类型
export const adminLogin = (data: LoginData): Promise<LoginResponse> => {
    return apiClient({
        url: '/admin/session',
        method: 'post',
        data,
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
 * 注意：根据您的文档，这是一个 post 请求
 * @param data 包含用户名、密码和邮箱的注册信息
 * @returns {Promise<any>}
 */
export const registerUser = (data: RegisterData): Promise<any> => {
    return apiClient({
        url: '/users/register',
        method: 'post',
        // [!code focus start]
        // 遵循 RESTful 实践，POST 请求的数据应放在 data 中
        data,
        // [!code focus end]
    });
};

/**
 * 管理员注册新用户
 * 注意：根据您的文档，这是一个 post 请求
 * @param data 包含用户名、密码和邮箱的注册信息
 * @returns {Promise<any>}
 */
export const adminAddUser = (data: adminAddUserData): Promise<any> => {
    return apiClient({
        url: '/admin/addUser',
        method: 'post',
        // [!code focus start]
        // 遵循 RESTful 实践，POST 请求的数据应放在 data 中
        data,
        // [!code focus end]
    });
};

/**
 * 更新用户信息
 * 注意：根据您的文档，路径是固定的 /users/updateUser
 * @param data 包含用户ID和需要更新的字段的对象
 * @returns {Promise<User>} 返回更新后的用户信息
 */
export const updateUser = (data: Partial<User> & { userId: number }): Promise<User> => {
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
        url: `/users/deleteUser/${userId}`,
        // 使用 DELETE 方法，这是删除操作的标准HTTP动词
        method: 'delete',
    });
};

/**
 * [新增] 管理员登出 API
 * @returns {Promise<void>}
 */
export const adminLogout = (): Promise<void> => {
    return apiClient({
        url: '/admin/logout',
        method: 'post',
    });
};

/**
 * [新增] 封禁指定用户 (管理员操作)
 * @param userId 需要被封禁的用户的ID
 * @returns {Promise<void>}
 */
export const banUserById = (userId: number): Promise<void> => {
    return apiClient({
        // 请根据您的后端API实际情况修改URL
        url: `/admin/suspendUser/${userId}`,
        method: 'patch',
    });
};

/**
 * [新增] 解封指定用户 (管理员操作)
 * @param userId 需要被解封的用户的ID
 * @returns {Promise<void>}
 */
export const unbanUserById = (userId: number): Promise<void> => {
    return apiClient({
        url: `/admin/unsuspendUser/${userId}`,
        method: 'patch',
    });
};
/**
 * [新增] 重置指定指定用户密码 (管理员操作)
 * @param userId 需要被重置的用户的ID
 * @returns {Promise<void>}
 */
export const resetUserPassword = (userId: number): Promise<void> => {
    return apiClient({
        url: `/admin/resetPassword/${userId}`,
        method: 'patch',
    });
};
/**
 * [新增] 根据管理员ID获取其详细信息
 * @param adminId 管理员的用户ID
 * @returns {Promise<User>} 成功时解析为完整的用户信息对象
 */
export const getAdminInfoById = (adminId: number): Promise<User> => {
    return apiClient({
        url: `/admin/getAdminInfo/${adminId}`, // 使用您提供的接口地址
        method: 'get',
    });
};