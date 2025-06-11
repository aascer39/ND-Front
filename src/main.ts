import { createApp } from 'vue';
import App from './App.vue';

// 1. 导入 Pinia 和 Router
import { createPinia } from 'pinia';
import router from './router'; // 从你的 router/index.ts 文件导入

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 2. 创建 Pinia 实例
const pinia = createPinia();
const app = createApp(App);

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 3. 在挂载应用前，使用插件
app.use(pinia); // 注册 Pinia
app.use(router); // 注册 Router
app.use(ElementPlus);

// 4. 最后挂载应用
app.mount('#app');