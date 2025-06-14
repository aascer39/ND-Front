import { createRouter, createWebHistory, type Router } from 'vue-router'
import { AppRouteRecordRaw } from "@/router/router";

const adminRoutes: AppRouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'home-page',
        name: 'AdminHomePage',
        component: () => import('@/views/admin/HomePage.vue'),
        meta: { title: '管理员首页', icon: 'Home' }
      },
      {
        path: 'user-management',
        name: 'UserManagement',
        component: () => import('@/components/UserManagement.vue'),
        meta: { title: '用户管理', icon: 'User' }
      }
    ]
  }
];

// 公共路由
const publicRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/public/Home.vue'),
        meta: { title: 'MikuNetDisk - 自由安全的云盘' }
      },
      {
        path: 'login',
        name: 'UserLogin',
        component: () => import('@/views/user/Login.vue'),
        meta: { title: '用户登录' }
      },
      // [!code focus start]
      // 新增：用户注册页面的路由
      {
        path: 'register',
        name: 'UserRegister',
        component: () => import('@/views/user/Register.vue'),
        meta: { title: '用户注册' }
      },
      // [!code focus end]
      // [!code focus start]
      // 新增：应用下载页面的路由
      {
        path: 'app-download', // 定义URL路径
        name: 'AppDownload',
        component: () => import('@/views/public/AppDownload.vue'),
        meta: { title: '应用下载' }
      }
      // [!code focus end]
    ]
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/Login.vue'),
    meta: { hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { hidden: true }
  }
];

const routes: AppRouteRecordRaw[] = [
  ...adminRoutes,
  ...publicRoutes
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes
});

export default router