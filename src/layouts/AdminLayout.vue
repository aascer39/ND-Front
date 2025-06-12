<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="sidebar-logo">Admin Panel</div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        router
      >
        <el-menu-item index="/admin/home-page">
          <el-icon><icon-menu /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div>面包屑导航 (可后续添加)</div>
        <div class="right-menu">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userInfo.username || '管理员' }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
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
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { adminStore } from '@/stores/admin';
import { storeToRefs } from 'pinia';
import {
  Menu as IconMenu,
  ArrowDown,
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus';

// 1. 获取 store 和 router 实例
const userStore = adminStore();
const router = useRouter();
const route = useRoute();

// 2. 从 store 中获取响应式的 userInfo
const { userInfo } = storeToRefs(userStore);

// 计算属性，用于高亮当前菜单项
const activeMenu = computed(() => {
  const { path } = route;
  return path;
});

// 3. 定义登出逻辑
const handleLogout = () => {
  ElMessageBox.confirm('您确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 调用 store 中的 logout action
    userStore.logout();
    // 跳转回登录页
    router.push('/admin/login');
  }).catch(() => {
    // 用户取消操作，无需处理
  });
};

// 4. 处理下拉菜单的命令
const handleCommand = (command: string | number | object) => {
  if (command === 'logout') {
    handleLogout();
  } else if (command === 'profile') {
    // 可以跳转到个人中心页
    router.push('/admin/profile'); // 假设有这个页面
  }
};
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
  color: #fff;
}
.sidebar-logo {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
}
.el-menu {
    border-right: none;
    background-color: #304156;
}
.el-menu-item {
    color: #bfcbd9;
}
.el-menu-item:hover, .el-menu-item.is-active {
    background-color: #263445 !important;
    color: #409EFF !important;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>