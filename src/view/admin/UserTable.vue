<template>
  <el-table :data="users" style="width: 100%">
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="email" label="邮箱" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 编辑弹窗 -->
  <el-dialog v-model="dialogVisible" title="编辑用户">
    <el-form :model="currentUser">
      <el-form-item label="姓名">
        <el-input v-model="currentUser.name" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="currentUser.email" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveUser">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';

const users = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' }
]);

const dialogVisible = ref(false);
const currentUser = ref({});

const handleEdit = (user) => {
  currentUser.value = { ...user };
  dialogVisible.value = true;
};

const saveUser = () => {
  const index = users.value.findIndex(u => u.id === currentUser.value.id);
  if (index >= 0) users.value.splice(index, 1, currentUser.value);
  dialogVisible.value = false;
};

const handleDelete = (user) => {
  users.value = users.value.filter(u => u.id !== user.id);
};
</script>