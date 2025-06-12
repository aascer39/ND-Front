<template>
  <el-table :data="users" v-loading="loading" style="width: 100%" @sort-change="handleSortChange">
    <el-table-column prop="username" label="姓名" width="150" fixed sortable="custom" />
    <el-table-column prop="email" label="邮箱" width="220" sortable="custom" />

    <el-table-column prop="status" label="状态" width="100" align="center" sortable="custom">
      <template #default="scope">
        <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
          {{ scope.row.status === 'active' ? '正常' : '禁用' }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="活跃度" width="120" align="center">
      <template #default="scope">
        <el-tag :type="getActivityStatus(scope.row.lastLoginTs).type" effect="light">
          {{ getActivityStatus(scope.row.lastLoginTs).text }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="空间占用" width="200">
      <template #default="scope">
        <div v-if="scope.row.storageQuotaBytes > 0">
          <el-progress :text-inside="true" :stroke-width="20" :percentage="calculatePercentage(scope.row)"
            :color="getCustomColor(calculatePercentage(scope.row))" />
        </div>
        <span v-else>无限制</span>
      </template>
    </el-table-column>

    <el-table-column prop="storageQuotaBytes" label="分配空间" width="120" :formatter="formatBytes" align="right" />
    <el-table-column prop="usedStorageBytes" label="已用空间" width="120" :formatter="formatBytes" align="right" />
    <el-table-column prop="registrationTs" label="注册时间" :formatter="formatDateTime" width="180" sortable="custom" />
    <el-table-column prop="lastLoginTs" label="最后登录" :formatter="formatDateTime" width="180" sortable="custom" />

    <el-table-column label="操作" width="120" fixed="right" align="center">
      <template #default="scope">
        <el-dropdown @command="handleCommand($event, scope.row)" trigger="click">
          <el-button type="primary" link>
            更多操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="edit" :icon="Edit">
                编辑用户
              </el-dropdown-item>
              <el-dropdown-item command="reset_password" :icon="Key" disabled>
                重置密码
              </el-dropdown-item>
              <el-dropdown-item command="delete" :icon="Delete" divided style="color: #f56c6c;">
                删除用户
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import type { User } from '@/api/types';
import { ArrowDown, Edit, Delete, Key } from '@element-plus/icons-vue';
import { adminStore } from '@/stores/admin';

defineProps<{
  users: User[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'edit', user: User): void
  (e: 'delete', user: User): void
}>();

const handleCommand = (command: string, user: User) => {
  switch (command) {
    case 'edit':
      emit('edit', user);
      break;
    case 'delete':
      emit('delete', user);
      break;
    case 'reset_password':
      // 这里可以实现重置密码的逻辑
      console.log('TODO: Reset password for user:', user.username);
      break;
  }
};

/**
 * 将表格的排序变化委托给 Pinia Store 处理
 */
const userStore = adminStore();

const handleSortChange = ({ prop, order }: { prop: string, order: 'ascending' | 'descending' | null }) => {
  if (prop) {
    userStore.setSort({ prop, order });
  }
};

/**
 * 根据最后登录时间计算用户活跃度状态
 */
const getActivityStatus = (lastLoginTs: string | null): { type: 'success' | 'warning' | 'danger' | 'info', text: string } => {
  if (!lastLoginTs) {
    return { type: 'info', text: '新用户' };
  }

  const now = new Date();
  const lastLoginDate = new Date(lastLoginTs);
  const diffTime = now.getTime() - lastLoginDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays <= 30) {
    return { type: 'success', text: '活跃' };
  }
  if (diffDays <= 182) {
    return { type: 'warning', text: '不活跃' };
  }
  return { type: 'danger', text: '沉寂' };
};

/**
 * 格式化字节大小为可读格式 (KB, MB, GB)
 */
const formatBytes = (row: User, column: any, cellValue: number): string => {
  if (cellValue === null || cellValue === undefined) return 'N/A';
  if (cellValue === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(cellValue) / Math.log(k));

  return `${parseFloat((cellValue / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 格式化日期时间字符串
 */
const formatDateTime = (row: User, column: any, cellValue: string): string => {
  if (!cellValue) return '';
  return new Date(cellValue).toLocaleString();
};

/**
 * 计算存储占用百分比
 */
const calculatePercentage = (row: User): number => {
  if (!row.storageQuotaBytes) {
    return 0;
  }
  const percentage = (row.usedStorageBytes / row.storageQuotaBytes) * 100;
  return parseFloat(percentage.toFixed(2));
};

/**
 * 根据百分比返回进度条的颜色
 */
const getCustomColor = (percentage: number): string => {
  if (percentage > 90) {
    return '#f56c6c'; // 红色
  }
  if (percentage > 80) {
    return '#e6a23c'; // 橙色
  }
  if (percentage > 60) {
    return '#f4b800'; // 黄色
  }
  return '#67c23a'; // 绿色
};
</script>

<style scoped>
/* 可以在这里添加样式，例如让红色的删除选项更醒目 */
.el-dropdown-menu__item--divided {
  margin-top: 6px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>