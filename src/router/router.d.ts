import {RouteMeta, RouteRecordRaw} from 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title?: string
        requiresAuth?: boolean
        icon?: string // 用于菜单图标
    }
}

export type AppRouteRecordRaw = RouteRecordRaw & {
    meta: RouteMeta
    children?: AppRouteRecordRaw[]
}