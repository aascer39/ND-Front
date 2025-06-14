<template>
  <div class="login-container">
    <div class="login-panel">
      <div class="login-image-section">
        <img src="/TheBirthofGramophoneLuka.jpg" alt="Login Illustration" />
      </div>
      <div class="login-form-section">
        <div class="form-wrapper">
          <h2 class="form-title">登录 MikuNetDisk</h2>
          <p class="form-subtitle">欢迎回来，继续您的云端之旅</p>

          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top"
            @keyup.enter="handleLogin(loginFormRef)">
            <el-form-item prop="username" label="用户名">
              <el-input v-model="loginForm.username" placeholder="请输入您的用户名 (admin)" :prefix-icon="User" size="large" />
            </el-form-item>

            <el-form-item prop="password" label="密码">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入您的密码 (123456)" show-password
                :prefix-icon="Lock" size="large" />
            </el-form-item>

            <el-form-item class="options-item">
              <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </el-form-item>

            <el-form-item>
              <el-button class="login-button" type="primary" size="large" :loading="loading"
                @click="handleLogin(loginFormRef)">
                立即登录
              </el-button>
            </el-form-item>
          </el-form>

          <div class="extra-links">
            <span>还没有账户？</span>
            <el-link type="primary" @click="goToRegister">立即注册</el-link>
            <el-divider direction="vertical" />
            <el-link type="info" @click="goToAdminLogin">管理员登录</el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
// 导入你的 store
import { adminStore } from "@/stores/admin";

// 表单 DOM 引用
const loginFormRef = ref<FormInstance>();

// 加载状态
const loading = ref<boolean>(false);

// 登录表单的响应式数据
const loginForm = reactive({
  username: "",
  password: "",
  rememberMe: false, // 这是“记住我”复选框绑定的值
});

// 表单验证规则
const loginRules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

// 路由实例
const router = useRouter();
// 获取 store 实例
const userStore = adminStore();

// 登录处理函数
const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  // 使用 await 等待 validate 方法的 Promise 结果
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // 调用 store 的 login action，并传入表单数据和 rememberMe 标志
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
        // 请求拦截器已经处理了错误消息的显示
        console.error("登录失败:", e);
      } finally {
        loading.value = false;
      }
    } else {
      ElMessage.error("请检查输入项！");
    }
  });
};

const goToRegister = () => {
  router.push("/register"); // 假设注册路由是 /register
};

// [!code focus start]
/**
 * 新增：跳转到管理员登录页
 */
const goToAdminLogin = () => {
  // 根据路由配置，管理员登录页的路径是 /admin/login
  router.push('/admin/login');
};
// [!code focus end]
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 128px);
  /* 减去页头页脚高度 */
  background-color: #f7f8fa;
  padding: 40px 20px;
}

.login-panel {
  display: flex;
  width: 100%;
  max-width: 960px;
  min-height: 550px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.login-image-section {
  flex: 1;
  display: none;
  /* 在中小型屏幕上隐藏 */
}

.login-image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.form-wrapper {
  width: 100%;
  max-width: 360px;
}

.form-title {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
  text-align: center;
}

.form-subtitle {
  font-size: 16px;
  color: #909399;
  margin-bottom: 32px;
  text-align: center;
}

.options-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.login-button {
  width: 100%;
  font-size: 16px;
  padding: 18px 20px;
}

.extra-links {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #606266;
  display: flex;
  /* 新增 */
  justify-content: center;
  /* 新增 */
  align-items: center;
  /* 新增 */
}

.extra-links .el-link {
  vertical-align: baseline;
}

/* [!code focus start] */
.extra-links .el-divider {
  margin: 0 12px;
  height: 1em;
  /* 确保分割线高度合适 */
}

/* [!code focus end] */

/* Responsive adjustments */
@media (min-width: 768px) {
  .login-image-section {
    display: block;
    /* 在大于768px的屏幕上显示图片 */
  }
}

@media (max-width: 767px) {
  .login-panel {
    flex-direction: column;
  }

  .login-form-section {
    padding: 30px 20px;
  }
}
</style>