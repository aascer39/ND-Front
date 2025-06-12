<template>
  <div class="login-container">
    <el-row type="flex" justify="center" align="middle" style="height: 100vh">
      <el-col :xs="22" :sm="16" :md="12" :lg="8" :xl="6">
        <el-card class="login-card" shadow="always">
          <template #header>
            <div class="card-header">
              <h2>用户登录 (TypeScript)</h2>
            </div>
          </template>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-width="0px"
            @keyup.enter="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名 (admin)"
                :prefix-icon="User"
                size="large"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码 (123456)"
                show-password
                :prefix-icon="Lock"
                size="large"
              />
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                style="width: 100%"
                size="large"
                :loading="loading"
                @click="handleLogin(loginFormRef)"
              >
                登 录
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
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
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
  ],
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
</script>

<style scoped>
.login-container {
  background-color: #f0f2f5;
  background-image: url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg");
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}

.login-card {
  border-radius: 12px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}
</style>