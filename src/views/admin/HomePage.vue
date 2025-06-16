<template>
  <div class="homepage-content">
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="(stat, index) in stats" :key="index">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon" :style="{ color: stat.color }">
            <component :is="stat.icon" />
          </div>
          <div class="stat-details">
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-value">{{ stat.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="section-title">快捷操作</div>
    <el-row :gutter="25">
      <el-col :span="12" v-for="(card, index) in dashboardCards" :key="index">
        <el-card class="dashboard-card" @click="navigateTo(card.path)"
          :style="{ '--card-theme-color': cardColors[index] }">
          <div class="card-icon">
            <component :is="card.icon" />
          </div>
          <div class="card-title">{{ card.title }}</div>
          <div class="card-description">{{ card.description }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { HomeFilled, Document, User, Setting, Folder, Cpu, Coin, TrendCharts } from '@element-plus/icons-vue';
import type { DefineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { adminStore } from "@/stores/admin";

const userStore = adminStore();
const { pagination } = storeToRefs(userStore);

type IconComponent = DefineComponent<{}, {}, any>;
const router = useRouter();

// [!code focus start]
// 2. 将 stats 从 ref 改为 computed
const stats = computed(() => [
  // 在 computed 的 getter 函数中，每当 pagination.value.total 变化，这里就会重新计算
  { title: '总用户数', value: pagination.value?.total ?? 0, icon: User, color: '#409EFF' },
  { title: '文件总数', value: '25,433', icon: Folder, color: '#67C23A' },
  { title: '已用空间', value: '152.4 GB', icon: Coin, color: '#E6A23C' },
  { title: '系统负载', value: '15 %', icon: Cpu, color: '#F56C6C' },
]);
// [!code focus end]

// --- 功能快捷入口卡片数据 (这部分无需改动) ---
const cardColors = ref([
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
]);

const dashboardCards = ref([
  {
    title: '用户管理',
    description: '管理平台用户信息',
    icon: User,
    path: '/admin/user-management'
  },
  {
    title: '文件管理',
    description: '查看和管理服务器文件',
    icon: Document,
    path: '/admin/file-management'
  },
  {
    title: '系统设置',
    description: '配置系统参数和权限',
    icon: Setting,
    path: '/admin/settings'
  },
  {
    title: '帮助文档',
    description: '查看系统使用指南',
    // 建议将帮助文档的图标也修改一下，比如 QuestionFilled
    icon: HomeFilled,
    path: '/admin/helpDoc'
  }
]);

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.homepage-content {
  padding: 24px;
  background-color: #f9fafb;
  height: 100%;
}

/* --- 统计卡片样式 (无改动) --- */
.stat-row {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0;
}

.stat-icon {
  font-size: 48px;
  margin-right: 20px;
  flex-shrink: 0;
}

.stat-details {
  display: flex;
  flex-direction: column;
}

.stat-title {
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

/* [!code focus start] */
/* --- 主要功能卡片样式（已修正） --- */
.dashboard-card {
  cursor: pointer;
  transition: all 0.3s ease;
  /* 移除固定高度，改用最小高度 */
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 垂直方向从顶部开始排列 */
  justify-content: flex-start;
  /* 使用内边距控制空间，而不是flex居中 */
  padding: 24px;
  text-align: center;
  margin-bottom: 24px;
  border-radius: 12px;
  background: #ffffff;
  border: 2px solid transparent;
}

.dashboard-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-color: var(--card-theme-color);
}

.card-icon {
  font-size: 42px;
  margin-bottom: 15px;
  color: var(--card-theme-color);
  transition: color 0.3s ease;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
}

.card-description {
  color: #777;
  font-size: 13px;
  line-height: 1.5;
  /* 让描述文本可以占据剩余空间 */
  flex-grow: 1;
}

/* [!code focus end] */
</style>