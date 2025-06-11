import { createRouter, createWebHistory, type Router } from 'vue-router'
import type { AppRouteRecordRaw } from '@/types/router'

const routes: AppRouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/users',
        meta: { hidden: true }
    },
    {
        path: '/users',
        name: 'UserManagement',
        component: () => import('@/views/UserManagement.vue'),
        meta: { title: '用户管理', icon: 'User', requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: { hidden: true }
    },
    // 404 路由需放在最后
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue')
    }
]

const router: Router = createRouter({
    history: createWebHistory(),
    routes
})

// 类型安全的路由守卫
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token')

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
        next()
    }
})

export default router