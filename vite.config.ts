import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import {codeInspectorPlugin} from "code-inspector-plugin";
import { resolve } from 'path'

// 处理 code-inspector-plugin 的 TS 类型
type CodeInspectorPlugin = (options: { bundler: 'vite' | 'webpack' }) => any

export default defineConfig({
  plugins: [
    vue(),
    // 类型安全的插件调用
    (codeInspectorPlugin as unknown as CodeInspectorPlugin)({
      bundler: 'vite'
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router'], // 自动导入常用 API
      dts: 'src/auto-imports.d.ts' // 生成类型文件
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts' // 生成组件类型
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})