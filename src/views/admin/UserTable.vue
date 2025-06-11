<template>
  <el-table :data="users" style="width: 100%">
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="email" label="邮箱" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="$emit('edit', scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="$emit('delete', scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

</template>

<script setup lang="ts">
import type { User } from '@/api/admin';

// 1. 使用 defineProps 定义从父组件接收的数据。
defineProps<{
  users: User[]
}>();

// 2. 使用 defineEmits 定义组件可以向父组件触发的事件。
defineEmits<{
  (e: 'edit', user: User): void
  (e: 'delete', user: User): void
}>();

// 3. 所有本地的状态（users, dialogVisible, currentUser）和逻辑（handleEdit, handleDelete, saveUser）都已被移除。
</script>