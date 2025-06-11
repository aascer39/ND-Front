<template>
    <el-dialog :model-value="visible" :title="dialogTitle" width="500px" @close="handleClose"
        :close-on-click-modal="false">
        <el-form :model="formData" :rules="formRules" ref="formRef" label-width="80px">
            <el-form-item label="姓名" prop="username">
                <el-input v-model="formData.username" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="formData.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item v-if="!isEdit" label="密码" prop="password">
                <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { User, RegisterData } from '@/api/types';

// 1. Props 定义 (保持不变)
const props = defineProps<{
    visible: boolean;
    isEdit: boolean;
    userData?: User | null;
}>();

// 2. Emits 定义 (修正了 save 事件的类型)
const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'save', data: Partial<User> | RegisterData): void; // 类型更精确
}>();

// 3. 本地状态
const formRef = ref<FormInstance | null>(null);

// [修正] 表单数据结构与 API 类型对齐
type FormData = Pick<User, 'username' | 'email'> & { password?: string };
const createEmptyForm = (): FormData => ({
    username: '',
    email: '',
    password: '',
});
const formData = ref<FormData>(createEmptyForm());

// 4. 计算属性 (保持不变)
const dialogTitle = computed(() => (props.isEdit ? '编辑用户' : '新增用户'));

// 5. [新增] 表单验证规则
const formRules = computed<FormRules>(() => ({
    username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] },
    ],
    password: [
        { required: !props.isEdit, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    ],
}));


// 6. [优化] 监听器逻辑
watch(
    () => props.visible,
    (newVal) => {
        // 弹窗打开时，根据模式填充或重置表单
        if (newVal) {
            if (props.isEdit && props.userData) {
                // 编辑模式：只填充表单需要的字段
                formData.value = {
                    username: props.userData.username,
                    email: props.userData.email,
                };
            } else {
                // 新增模式：重置表单
                // 使用 nextTick 确保表单在弹窗动画后被清空校验状态
                formRef.value?.resetFields();
                formData.value = createEmptyForm();
            }
        }
    }
);

// 7. [优化] 事件处理函数
const handleClose = () => {
    emit('update:visible', false);
};

const handleSubmit = async () => {
    if (!formRef.value) return;

    // [新增] 触发全表单验证
    await formRef.value.validate((valid) => {
        if (valid) {
            // 验证通过
            const dataToSave = { ...formData.value };
            if (props.isEdit) {
                // 编辑模式下，附加上 userId
                emit('save', { userId: props.userData!.userId, ...dataToSave });
            } else {
                // 新增模式，直接传递表单数据
                emit('save', dataToSave);
            }
            handleClose();
        } else {
            // 验证失败
            console.log('表单验证失败!');
        }
    });
};
</script>