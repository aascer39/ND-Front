import { createRouter, createWebHistory, type Router } from 'vue-router'
import { AppRouteRecordRaw } from "@/router/router";
import { adminStore } from '@/stores/admin';

const adminRoutes: AppRouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    redirect: '/admin/home-page',
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
      },
      {
        path: 'file-management',
        name: 'FileManagement',
        component: () => import('@/views/UnderConstruction.vue'),
        meta: { title: '文件管理', icon: 'Folder' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/admin/Settings.vue'),
        meta: { title: '设置', icon: 'Setting' }
      },
      {
        path: 'helpDoc',
        name: 'helpDoc',
        component: () => import('@/views/admin/helpDoc.vue'),
        meta: { title: '帮助文档', icon: 'QuestionFilled' }
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
      {
        path: 'app-download', // 定义URL路径
        name: 'AppDownload',
        component: () => import('@/views/public/AppDownload.vue'),
        meta: { title: '应用下载' }
      },
      {
        path: '/UnderConstruction',
        name: 'UnderConstruction',
        component: () => import('@/views/UnderConstruction.vue'),
        meta: { title: '建设中' }
      },
      {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () => import('@/views/admin/Login.vue'),
        meta: { hidden: true }
      }
    ]
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

// // 全局路由前置守卫
// router.beforeEach(async (to, from, next) => {
//   const userStore = adminStore();
//   const token = userStore.token;

//   if (token) {
//     // 如果有 token，但 store 中没有用户信息，则尝试获取
//     if (!userStore.userInfo.userId) {
//       try {
//         await userStore.fetchUserInfo();
//         next(); // 获取成功，正常放行
//       } catch (error) {
//         // 获取失败，此时 fetchUserInfo 内部已处理登出和重定向
//         // 为保险起见，可以再次重定向
//         next(`/admin/login?redirect=${to.path}`);
//       }
//     } else {
//       next(); // 如果已有用户信息，直接放行
//     }
//   } else {
//     // 没有 token 的情况
//     if (to.meta.requiresAuth) {
//       // 目标页需要登录，重定向到登录页
//       next(`/admin/login?redirect=${to.path}`);
//     } else {
//       next(); // 不需要登录，直接放行
//     }
//   }
// });

export default router