<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="sidebar-logo" @click="router.push('/admin/home-page')">
        <img src="/初音图片.jpg" alt="Logo" class="logo-img" />
        <span class="logo-text">Miku Admin</span>
      </div>
      <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" router>
        <el-menu-item index="/admin/home-page">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/admin/user-management">
          <el-icon>
            <User />
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/file-management">
          <el-icon>
            <User />
          </el-icon>
          <span>文件管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/settings">
          <el-icon>
            <User />
          </el-icon>
          <span>系统设置</span>
        </el-menu-item>
        <el-menu-item index="/admin/helpDoc">
          <el-icon>
            <User />
          </el-icon>
          <span>帮助文档</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index" @click="navigateTo(breadcrumb)">
            {{ breadcrumb.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="right-menu">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userInfo.username || '管理员' }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute, type RouteLocationNormalizedLoaded } from 'vue-router';
import { adminStore } from '@/stores/admin';
import { storeToRefs } from 'pinia';
import {
  // [!code focus start]
  ArrowDown,
  HomeFilled, // 新增：导入“首页”图标
  User        // 新增：导入“用户”图标
  // [!code focus end]
} from '@element-plus/icons-vue'
import { ElMessageBox, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus';

// 1. 获取 store 和 router 实例
const userStore = adminStore();
const router = useRouter();
const route = useRoute();

// 定义面包屑数据类型
type BreadcrumbItem = {
  path: string;
  title: string;
};

// 面包屑导航数据
const breadcrumbs = ref<BreadcrumbItem[]>([]);

// 在路由变化时更新面包屑导航
const updateBreadcrumbs = () => {
  const matched: BreadcrumbItem[] = [];
  let currentRoute: RouteLocationNormalizedLoaded = route as RouteLocationNormalizedLoaded;

  // 循环查找所有父级路由
  while (currentRoute.path !== '/') {
    if (currentRoute.meta && currentRoute.meta.title) {
      matched.unshift({
        path: currentRoute.path,
        title: currentRoute.meta.title as string
      });
    }

    // 如果有重定向到子路由，则处理子路由
    if (currentRoute.redirectedFrom) {
      currentRoute = currentRoute.redirectedFrom as RouteLocationNormalizedLoaded;
    } else {
      break;
    }
  }

  // 添加首页链接作为第一个面包屑
  matched.unshift({
    path: '/admin',
    title: '首页'
  });

  breadcrumbs.value = matched;
};

// 计算属性，用于高亮当前菜单项
const activeMenu = computed(() => {
  const { path } = route;
  return path;
});

// 监听路由变化并更新面包屑
import { watch } from 'vue';
watch(
  () => route.path,
  () => {
    updateBreadcrumbs();
  },
  { immediate: true }
);

// 点击面包屑导航时跳转到相应页面
const navigateTo = (breadcrumb: BreadcrumbItem) => {
  if (breadcrumb.path) {
    router.push(breadcrumb.path);
  }
};

// 2. 从 store 中获取响应式的 userInfo
const { userInfo } = storeToRefs(userStore);

// 3. 定义登出逻辑
const handleLogout = () => {
  ElMessageBox.confirm('您确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 调用 store 中的 logout action
    userStore.logout();
    // 跳转回公共页
    router.push('/');
  }).catch(() => {
    // 用户取消操作，无需处理
  });
};

// 4. 处理下拉菜单的命令
const handleCommand = (command: string | number | object) => {
  if (command === 'logout') {
    handleLogout();
  }
};
</script>

<style scoped>
/* --- 整体布局 --- */
.layout-container {
  height: 100vh;
}

/* --- 侧边栏美化 (el-aside) --- */
.el-aside {
  /* 统一侧边栏背景为一个专业且护眼的深蓝灰色 */
  background-color: #2b303b;
  color: #fff;
  /* 添加右侧阴影以创建立体感 */
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.15);
  /* 平滑过渡效果，为将来可能的折叠功能做准备 */
  transition: width 0.3s ease;
  z-index: 10;
  /* 确保侧边栏在最上层 */
}

.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  /* 增加一个细微的下边框来分隔Logo和菜单 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-logo .logo-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
}

/* --- 菜单美化 (el-menu) --- */
.el-menu {
  /* 让菜单背景透明，继承侧边栏的颜色 */
  background-color: transparent;
  border-right: none;
}

.el-menu-item {
  color: #a4a6ac;
  /* 默认文字颜色，更柔和 */
  font-weight: 500;
  font-size: 15px;
  /* 增加内边距，让菜单项不那么拥挤 */
  padding-left: 25px !important;
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* 菜单项悬停状态 */
.el-menu-item:hover {
  /* 悬停时改变背景色，同时确保文字为亮白色，解决文字消失问题 */
  background-color: #343a46 !important;
  color: #ffffff !important;
}

/* 菜单项激活状态 */
.el-menu-item.is-active {
  background-color: var(--el-color-primary) !important;
  /* 使用Element Plus的主题蓝 */
  color: #ffffff !important;
}

.el-menu-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: #ffffff;
  /* 激活时左侧有白色高亮条 */
}

/* --- 顶部栏美化 (el-header) --- */
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 移除旧边框，使用更现代的阴影 */
  border-bottom: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 0 20px;
  height: 60px;
}

/* --- 面包屑导航 --- */
.el-breadcrumb {
  cursor: default;
}

/* --- 右侧用户菜单 --- */
.right-menu {
  padding: 5px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.right-menu:hover {
  background-color: #f5f7fa;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #333;
  /* 下拉菜单文字颜色 */
}

.el-icon--right {
  margin-left: 8px;
}

/* --- 主内容区美化 (el-main) --- */
.el-main {
  /* 使用柔和的浅灰色作为主内容区背景，突出内容 */
  background-color: #f4f7f9;
  padding: 20px;
}
</style>