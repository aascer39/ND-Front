// src/api/types.ts
// 存放各种借口
/**
 * 用户信息接口
 */
export interface User {
    userId: number;
    username: string;
    email: string;
    status: string;
    avatarUrl: string | null;
    registrationTs: string;
    lastLoginTs: string;
    storageQuotaBytes: number;
    usedStorageBytes: number;
    lastPasswordUpdateTs: string | null;
    role: string; // 添加 role 字段
}

/**
 * 登录表单数据接口
 */
export interface LoginData {
    username: string;
    password: string;
}

/**
 * 用户分页查询参数接口
 */
export interface UserPageQuery {
    current?: number;
    size?: number;
    nameKeyword?: string;
    status?: string; // 使用 null 或 undefined 表示不按此字段筛选
    // [新增] 排序字段
    sortField?: string;
    // [新增] 排序顺序 ('asc' 或 'desc')
    sortOrder?: String
}

/**
 * 分页接口通用返回结构
 */
export interface PaginatedUsers {
    records: User[]; // 当前页的记录列表
    total: number;   // 总记录数
    // 根据您后端分页接口返回的实际结构进行调整
}

/**
 * 用户注册数据接口
 */
export interface RegisterData {
    username: string;
    password: string;
    email: string;
    // 是否使用哈希密码
    needHash: boolean; 
}

/**
 *管理员添加用户接口
 */
export interface adminAddUserData {
    username: string;
    email: string;
}

/**
 * 登录成功后的 API 响应数据结构
 */
export interface LoginResponse {
    tokenName: string;
    tokenValue: string;
    loginId: number;
    username: string;
    status: string;
    loginType: string;
    loginDeviceType: string;
    lastLoginTs: string;
}
