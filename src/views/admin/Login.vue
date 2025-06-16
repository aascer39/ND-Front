<template>
  <div class="admin-login-container">
    <div class="login-panel">
      <div class="login-image-section">
        <img src="/glow.jpg" alt="Admin Panel Illustration" />
      </div>

      <div class="login-form-section">
        <div class="form-wrapper">
          <div class="form-header">
            <img src="/public/初音图片.jpg" alt="Logo" class="logo" />
            <h2 class="form-title">后台管理系统</h2>
            <p class="form-subtitle">请使用您的管理员凭据登录</p>
          </div>

          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top"
            @keyup.enter="handleLogin(loginFormRef)">
            <el-form-item prop="username" label="管理员账户">
              <el-input v-model="loginForm.username" placeholder="请输入管理员用户名" :prefix-icon="User" size="large" />
            </el-form-item>

            <el-form-item prop="password" label="密码">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password
                :prefix-icon="Lock" size="large" />
            </el-form-item>

            <el-form-item class="options-item">
              <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
              <el-link type="primary" :underline="false">无法登录？</el-link>
            </el-form-item>

            <el-form-item>
              <el-button class="login-button" type="primary" size="large" :loading="loading"
                @click="handleLogin(loginFormRef)">
                登 录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// <script> 部分与您之前的代码完全相同，此处省略以保持简洁。
// 您可以继续使用您已有的 <script setup> 代码。
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { adminStore } from "@/stores/admin";

const loginFormRef = ref<FormInstance>();
const loading = ref<boolean>(false);
const loginForm = reactive({
  username: "",
  password: "",
  rememberMe: false,
});

const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
  ],
});

const router = useRouter();
const userStore = adminStore();

const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await userStore.login(
          {
            username: loginForm.username,
            password: loginForm.password,
          },
          loginForm.rememberMe
        );
        ElMessage.success("登录成功！");
        router.push("/admin/home-page");
      } catch (e: any) {
        console.error("登录失败:", e);
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
/* 整体容器，使其撑满视口 */
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  /* 与您其他组件风格一致的淡灰色背景 */
}

/* 登录面板，采用您习惯的双栏布局 */
.login-panel {
  display: flex;
  width: 100%;
  max-width: 900px;
  /* 宽度可根据喜好调整 */
  min-height: 580px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  /* 柔和的阴影 */
  overflow: hidden;
}

/* 左侧图片区域 */
.login-image-section {
  flex: 1;
  display: none;
  /* 默认在小屏幕上隐藏 */
}

.login-image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 图片覆盖整个区域，不变形 */
}

/* 右侧表单区域 */
.login-form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.form-wrapper {
  width: 100%;
  max-width: 340px;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 12px;
}

.form-title {
  font-size: 26px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.form-subtitle {
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}

/* 表单项标签和间距，遵循您的风格 */
:deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
}

.el-form-item {
  margin-bottom: 22px;
}

/* 辅助选项行 */
.options-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  font-size: 16px;
  padding: 18px 20px;
  transition: all 0.2s ease-in-out;
}

.login-button:hover {
  /* 微妙的悬停效果 */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);
}

/* 响应式设计，与您其他页面保持一致 */
@media (min-width: 992px) {
  .login-image-section {
    display: block;
    /* 在大屏幕上显示图片 */
  }
}
</style>