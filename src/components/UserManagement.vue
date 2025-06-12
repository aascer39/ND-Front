<template>
  <div class="user-management">
    <el-card class="search-card" shadow="never">
      <el-form :model="searchQuery" inline class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchQuery.nameKeyword" placeholder="按姓名关键字搜索" clearable @keyup.enter="handleSearch" />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="searchQuery.status" @change="handleSearch">
            <el-radio-button :label="undefined">全部</el-radio-button>
            <el-radio-button :label="1">正常</el-radio-button>
            <el-radio-button :label="0">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="action-bar">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增用户</el-button>
    </div>

    <UserTable :users="users" :loading="listLoading" @edit="handleEdit" @delete="handleDelete" class="user-table" />

    <div class="pagination-container" v-if="pagination.total > 0">
      <el-pagination :current-page="pagination.currentPage" :page-size="pagination.pageSize" :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>

  <UserFormDialog v-model:visible="dialogVisible" :is-edit="isEditMode" :user-data="currentUser" @save="handleSave" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { adminStore } from "@/stores/admin";
import type { User, RegisterData } from "@/api/types";
import { storeToRefs } from "pinia";
import { ElMessageBox } from "element-plus";
import { Search, Refresh, Plus } from "@element-plus/icons-vue";

// 组件导入
import UserTable from '@/views/admin/UserTable.vue';
import UserFormDialog from '@/components/UserFormDialog.vue';

// 1. 使用 storeToRefs 从 store 中获取响应式状态
const userStore = adminStore();
const { users, pagination, searchQuery, listLoading } = storeToRefs(userStore);

// 对话框状态管理 (保持不变)
const dialogVisible = ref(false);
const isEditMode = ref(false);
const currentUser = ref<User | null>(null);

// 组件挂载时获取初始数据
onMounted(() => {
  userStore.fetchUsers();
});

// 2. 定义搜索和重置处理函数
const handleSearch = () => {
  userStore.fetchUsers({ current: 1 });
};

const handleReset = () => {
  userStore.resetSearchQuery();
};

// 3. 定义分页事件处理函数
const handleSizeChange = (newSize: number) => {
  userStore.fetchUsers({ current: 1, size: newSize });
};

const handleCurrentChange = (newPage: number) => {
  userStore.fetchUsers({ current: newPage });
};

// CRUD 处理函数 (保持不变)
const handleAdd = () => {
  isEditMode.value = false;
  currentUser.value = null;
  dialogVisible.value = true;
};

const handleEdit = (user: User) => {
  isEditMode.value = true;
  currentUser.value = { ...user };
  dialogVisible.value = true;
};

const handleSave = (userData: Partial<User> | RegisterData) => {
  if (isEditMode.value) {
    if ('userId' in userData && typeof userData.userId === 'number') {
      userStore.updateUser(userData as User);
    } else {
      console.error('编辑用户时缺少 userId');
    }
  } else {
    if ('username' in userData && 'password' in userData && 'email' in userData) {
      userStore.addUser(userData as RegisterData);
    } else {
      console.error('用于创建的用户数据不正确');
    }
  }
};

const handleDelete = (user: User) => {
  ElMessageBox.confirm(`您确定要删除用户 ${user.username} 吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    if (user.userId) {
      userStore.deleteUser(user.userId);
    }
  });
};
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form .el-form-item {
  margin-bottom: 0;
  margin-right: 20px;
  /* 给表单项之间增加一些间距 */
}

.action-bar {
  margin-bottom: 20px;
}

.user-table {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
}
</style>