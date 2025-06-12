<template>
  <div class="user-management">
    <h2>用户管理</h2>
    <el-button type="primary" @click="handleAdd">新增用户</el-button>

    <UserTable :users="users" :loading="userStore.listLoading" @edit="handleEdit" @delete="handleDelete" class="user-table" />
  </div>

  <UserFormDialog v-model:visible="dialogVisible" :is-edit="isEditMode" :user-data="currentUser" @save="handleSave" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/admin";
import type { User } from "@/api/types";
import type { RegisterData } from "@/api/types";
import { storeToRefs } from "pinia";
import { ElMessageBox } from "element-plus";

// 1. 引入新旧组件
import UserTable from '@/views/admin/UserTable.vue';
import UserFormDialog from '@/components/UserFormDialog.vue'; 

// 2. 状态管理保持不变
const userStore = useUserStore();
const { users } = storeToRefs(userStore);

// 3. 父组件仍然负责管理“是否显示弹窗”和“当前操作的是哪个用户”的状态
const dialogVisible = ref(false);
const isEditMode = ref(false);
const currentUser = ref<User | null>(null);

// 进入页面生命周期钩子会立即执行，获取数据
onMounted(() => {
  userStore.fetchUsers();
});

// 4. 事件处理函数变得更简洁
const handleAdd = () => {
  isEditMode.value = false;
  currentUser.value = null; // 新增时没有当前用户
  dialogVisible.value = true;
};

const handleEdit = (user: User) => {
  isEditMode.value = true;
  currentUser.value = { ...user };
  dialogVisible.value = true;
};

// handleSave 现在监听子组件的 emit 事件
const handleSave = (userData: Partial<User> | RegisterData) => {
  if (isEditMode.value) {
    // 只有在编辑模式下，userData 应该有 userId
    if ('userId' in userData && typeof userData.userId === 'number') {
      userStore.updateUser(userData as User);
    } else {
      // 可以根据实际需求提示错误或处理异常
      console.error('编辑用户时缺少 userId');
    }
  } else {
    // 只在 userData 是 RegisterData 时调用 addUser
    if ('username' in userData && 'password' in userData && 'email' in userData) {
      userStore.addUser(userData as RegisterData);
    } else {
      console.error('新增用户时 userData 类型不正确');
    }
  }
};

const handleDelete = (user: User) => {
  ElMessageBox.confirm(`确定要删除用户 ${user.username} 吗?`, "警告", { 
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    userStore.deleteUser(user.userId); 
  });
};

</script>

<style scoped>
.user-table {
  margin-top: 20px;
}
</style>