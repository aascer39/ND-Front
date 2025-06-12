// src/utils/request.ts

import axios from "axios";
import { ElMessage } from 'element-plus';
import { adminStore } from '@/stores/admin';
import router from '@/router'; // 导入 router 实例

const instance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,
});

// 请求拦截器 (保持不变)
instance.interceptors.request.use(
  config => {
    // 动态获取 user store
    const userStore = adminStore();
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


// 响应拦截器 (增强)
instance.interceptors.response.use(
  /**
   * 正常响应处理
   */
  response => {
    const res = response.data;
    // 后端我们统一的响应格式是 { code, message, data }
    // 如果 code 不是 200, 就判定为错误。
    if (res.code !== 200) {
      // 特别处理 401 未授权错误
      if (res.code === 401) {
        // 1. 提示用户
        ElMessage({
          message: res.message || '会话已过期，请重新登录',
          type: 'error',
          duration: 3 * 1000
        });
        // 2. 调用 store 的 logout 方法清空本地 token
        const userStore = adminStore();
        userStore.logout();
        // 3. 跳转到登录页
        router.push('/admin/login');
      } else {
        // 处理其他业务错误
        ElMessage({
          message: res.message || '请求错误',
          type: 'error',
          duration: 5 * 1000
        });
      }

      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      // code 为 200, 直接返回后端接口的 data 部分
      return res.data;
    }
  },
  /**
   * 网络层错误处理 (例如 500, 502 等)
   */
  error => {
    console.error('响应错误: ' + error);
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default instance;