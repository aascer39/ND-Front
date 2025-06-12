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

// // 用户界面路由
// const userRoutes: AppRouteRecordRaw[] = [
//     {
//         path: '/',
//         component: () => import('@/layouts/UserLayout.vue'), // 可自定义布局
//         meta: { requiresAuth: true, role: 'user' },
//         children: [
//             {
//                 path: 'home',
//                 name: 'UserHome',
//                 component: () => import('@/views/user/Home.vue'),
//                 meta: { title: '用户首页', icon: 'Home' }
//             },
//             // 你可以继续添加更多用户页面
//         ]
//     }
// ];

// 公共路由
const publicRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: 'redirect',
    redirect: '/admin/login',
    meta: { hidden: true }
  },
  {
    path: '/admin/login',
    name: 'Login',
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
  // ...userRoutes,
  ...publicRoutes
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes
});

export default router