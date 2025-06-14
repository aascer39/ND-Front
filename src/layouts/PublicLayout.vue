<template>
  <el-container class="public-layout-container">
    <el-header class="page-header">
      <div class="header-content">
        <div class="logo-container" @click="goToHome">
          <img src="/初音图片.jpg" alt="MikuNetDisk Logo" class="logo-img" />
          <span class="logo-text">MikuNetDisk</span>
        </div>

        <el-menu :default-active="activeMenu" mode="horizontal" class="nav-menu" :ellipsis="false" router>
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/app-download">应用下载</el-menu-item>
        </el-menu>

        <div class="right-menu">
          <el-button type="default" round @click="goToLogin">登录</el-button>
          <el-button type="primary" round @click="goToRegister">立即注册</el-button>
        </div>
      </div>
    </el-header>

    <el-main class="page-main">
      <router-view />
    </el-main>

    <el-footer class="page-footer">
      <p>&copy; 2025 MikuNetDisk. All Rights Reserved.</p>
      <div class="footer-links">
        <a href="https://github.com/aascer39">关于我们</a>
        <a href="#">服务条款</a>
        <a href="#">隐私政策</a>
      </div>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter, type Router } from 'vue-router';

// 获取 router 实例，其类型由 vue-router 自动推断
const router: Router = useRouter();

// 获取当前路由信息 route，其类型由 vue-router 自动推断
const route = useRoute();

// activeMenu 的类型被 TypeScript 自动推断为 ComputedRef<string>
// 它会根据当前路由路径动态更新，用于高亮导航菜单
const activeMenu = computed(() => {
  // route.path 的类型是 string
  const { path } = route;
  return path;
});

// 定义跳转到首页的函数
const goToHome = (): void => {
  router.push('/');
}

// 定义跳转到登录页的函数
const goToLogin = (): void => {
  router.push('/login');
};

// 定义跳转到注册页的函数
const goToRegister = (): void => {
  // 假设 /register 路由存在
  router.push('/register');
};
</script>

<style scoped>
.public-layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f8fa;
  /* A light background for the page */
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #ffffff;
  border-bottom: 1px solid var(--el-border-color-lighter);
  height: 64px;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo-img {
  height: 32px;
  width: 32px;
  margin-right: 12px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.nav-menu {
  flex-grow: 1;
  justify-content: center;
  border-bottom: none;
  background-color: transparent;
  margin: 0 50px;
}

.el-menu--horizontal>.el-menu-item {
  color: #606266;
  font-size: 15px;
}

.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal>.el-menu-item.is-active {
  background-color: transparent;
  color: var(--el-color-primary);
  border-bottom-color: var(--el-color-primary);
}

.right-menu {
  display: flex;
  align-items: center;
  gap: 16px;
  /* Spacing between buttons */
}

.page-main {
  flex-grow: 1;
  padding-top: 84px;
  /* Header height + some spacing */
  padding-bottom: 40px;
}

.page-footer {
  background-color: #ffffff;
  color: #909399;
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid var(--el-border-color-lighter);
  font-size: 14px;
}

.footer-links {
  margin-top: 8px;
}

.footer-links a {
  color: #909399;
  text-decoration: none;
  margin: 0 10px;
}

.footer-links a:hover {
  color: var(--el-color-primary);
}
</style>