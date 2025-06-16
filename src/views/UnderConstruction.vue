<template>
    <div class="construction-container">
        <el-result icon="info" title="功能开发中" sub-title="我们正在努力开发中，敬请期待...">
            <template #icon>
                <el-icon :size="64">
                    <Tools />
                </el-icon>
            </template>
            <template #extra>
                <el-button type="primary" @click="goBack">返回上一页</el-button>
            </template>
        </el-result>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { Tools } from '@element-plus/icons-vue';

const router = useRouter();

const goBack = () => {
    router.back();
};
</script>

<style scoped>
.construction-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: #ffffff;
}
</style>