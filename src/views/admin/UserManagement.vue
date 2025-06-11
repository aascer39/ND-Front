<template>
  <div class="user-management">
    <h2>用户管理</h2>
    <el-button type="primary" @click="handleAdd">新增用户</el-button>

    <UserTable :users="users" @edit="handleEdit" @delete="handleDelete" class="user-table" />
  </div>

  <UserFormDialog v-model:visible="dialogVisible" :is-edit="isEditMode" :user-data="currentUser" @save="handleSave" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/admin";
import type { User } from "@/api/types";
import { storeToRefs } from "pinia";
import { ElMessageBox } from "element-plus";

// 1. 引入新旧组件
import UserTable from './UserTable.vue';
import UserFormDialog from '@/components/UserFormDialog.vue'; // 确保路径正确

// 2. 状态管理保持不变
const userStore = useUserStore();
const { users } = storeToRefs(userStore);

// 3. 父组件仍然负责管理“是否显示弹窗”和“当前操作的是哪个用户”的状态
const dialogVisible = ref(false);
const isEditMode = ref(false);
const currentUser = ref<User | null>(null);

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
const handleSave = (userData: User) => {
  if (isEditMode.value) {
    userStore.updateUser(userData);
  } else {
    userStore.addUser(userData);
  }
};

const handleDelete = (user: User) => {
  ElMessageBox.confirm(`确定要删除用户 ${user.username} 吗?`, "警告", { 
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    userStore.deleteUser(user.userId); // [修正] 从 user.id 改为 user.userId
  });
};

</script>

<style scoped>
.user-table {
  margin-top: 20px;
}
</style>