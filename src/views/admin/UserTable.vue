<template>
  <el-table :data="users" v-loading="loading" style="width: 100%">
    <el-table-column prop="username" label="姓名" width="180" />
    <el-table-column prop="email" label="邮箱" width="220"/>
    
    <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                {{ scope.row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
        </template>
    </el-table-column>
    <el-table-column prop="registrationTs" label="注册时间" :formatter="formatDateTime" />

    <el-table-column label="操作" width="180" fixed="right">
      <template #default="scope">
        <el-button size="small" @click="$emit('edit', scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="$emit('delete', scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import type { User } from '@/api/types';

defineProps<{
  users: User[];
  loading: boolean;
}>();

defineEmits<{
  (e: 'edit', user: User): void
  (e: 'delete', user: User): void
}>();

const formatDateTime = (row: User, column: any, cellValue: string) => {
  if (!cellValue) return '';
  return new Date(cellValue).toLocaleString();
};
</script>