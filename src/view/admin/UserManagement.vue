<template>
  <div class="user-management">
    <h2>用户管理</h2>
    <el-button type="primary" @click="handleAdd">新增用户</el-button>

    <UserTable
        :users="users"
        @edit="handleEdit"
        @delete="handleDelete"
        class="user-table"
    />
  </div>

  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form :model="currentUser" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="currentUser.name" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="currentUser.email" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// 1. 导入所有需要的模块和函数
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import type { User } from '@/api/admin'; // 假设 User 类型在 api/user.ts 中
import { storeToRefs } from 'pinia';
import { ElMessageBox } from 'element-plus';
import UserTable from './UserTable.vue';

// 2. 正确调用 useUserStore()
const userStore = useUserStore();
// 3. 使用 storeToRefs 保持响应性
const { users } = storeToRefs(userStore);

// --- 对话框和表单所需的状态 ---
const dialogVisible = ref(false);
const isEditMode = ref(false);
const createEmptyUser = (): Omit<User, 'id'> & { id?: number } => ({ name: '', email: '' });
const currentUser = ref(createEmptyUser());

const dialogTitle = computed(() => isEditMode.value ? '编辑用户' : '新增用户');

// 4. 在组件挂载时，调用 action 从服务器获取用户列表
onMounted(() => {
  userStore.fetchUsers();
});

// --- 完整的业务逻辑函数 ---

// 打开“新增用户”对话框
const handleAdd = () => {
  isEditMode.value = false;
  currentUser.value = createEmptyUser();
  dialogVisible.value = true;
};

// 打开“编辑用户”对话框
const handleEdit = (user: User) => {
  isEditMode.value = true;
  currentUser.value = { ...user }; // 复制用户数据以避免直接修改
  dialogVisible.value = true;
};

// 保存（新增或更新）
const handleSave = () => {
  if (isEditMode.value) {
    userStore.updateUser(currentUser.value as User);
  } else {
    userStore.addUser(currentUser.value as Omit<User, 'id'>);
  }
  dialogVisible.value = false;
};

// 删除用户
const handleDelete = (user: User) => {
  ElMessageBox.confirm(
      `确定要删除用户 ${user.name} 吗?`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    userStore.deleteUser(user.id);
  }).catch(() => {
    // 用户取消了操作
  });
};
</script>

<style scoped>
.user-table {
  margin-top: 20px;
}
</style>