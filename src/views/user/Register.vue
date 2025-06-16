<template>
    <div class="register-container">
        <div class="register-panel">
            <div class="register-form-section">
                <div class="form-wrapper">
                    <h2 class="form-title">注册 MikuNetDisk 账号</h2>
                    <p class="form-subtitle">开启您的云端之旅</p>

                    <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-position="top"
                        @keyup.enter="handleRegister(registerFormRef)">
                        <el-form-item prop="username" label="用户名">
                            <el-input v-model="registerForm.username" placeholder="设置您的用户名" :prefix-icon="User"
                                size="large" />
                        </el-form-item>

                        <el-form-item prop="email" label="邮箱">
                            <el-input v-model="registerForm.email" placeholder="请输入您的邮箱" :prefix-icon="Message"
                                size="large" />
                        </el-form-item>

                        <el-form-item prop="password" label="密码">
                            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"
                                show-password :prefix-icon="Lock" size="large" />
                        </el-form-item>

                        <el-form-item prop="confirmPassword" label="确认密码">
                            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码"
                                show-password :prefix-icon="Lock" size="large" />
                        </el-form-item>

                        <el-form-item>
                            <el-button class="register-button" type="primary" size="large" :loading="loading"
                                @click="handleRegister(registerFormRef)">
                                立即注册
                            </el-button>
                        </el-form-item>
                    </el-form>

                    <div class="extra-links">
                        <span>已有账户？</span>
                        <el-link type="primary" @click="goToLogin">直接登录</el-link>
                    </div>
                </div>
            </div>
             <div class="register-image-section">
                 <img src="/glow.jpg" alt="Register Illustration" />
             </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { User, Lock, Message } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { adminStore } from '@/stores/admin';
import CryptoJS from 'crypto-js';

const registerFormRef = ref<FormInstance>();
const loading = ref(false);
const router = useRouter();
const userStore = adminStore();

const registerForm = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
});

const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== registerForm.password) {
        callback(new Error("两次输入的密码不一致!"));
    } else {
        callback();
    }
};

const registerRules = reactive<FormRules>({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    ],
    confirmPassword: [{ validator: validatePass, trigger: 'blur' }],
});

const handleRegister = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            try {
                // 使用 SHA-256 加密密码
                const hashedPassword = CryptoJS.SHA256(registerForm.password).toString();

                await userStore.selfRegisterUser({
                    username: registerForm.username,
                    email: registerForm.email,
                    password: hashedPassword,
                    needHash: false
                });

                // 注册成功后跳转到登录页
                router.push('/login');
            } catch (e: any) {
                console.error('注册失败:', e);
            } finally {
                loading.value = false;
            }
        } else {
            ElMessage.error('请检查输入项！');
        }
    });
};

const goToLogin = () => {
    router.push('/login');
};
</script>

<style scoped>
/* 样式与登录页类似，可以复用或调整 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 128px);
  background-color: #f7f8fa;
  padding: 40px 20px;
}
.register-panel {
  display: flex;
  width: 100%;
  max-width: 960px;
  min-height: 550px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.register-image-section {
  flex: 1;
  display: none;
}
.register-image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.register-form-section {
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
.register-button {
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
  justify-content: center;
  align-items: center;
}

@media (min-width: 768px) {
  .register-image-section {
    display: block;
  }
}
</style>