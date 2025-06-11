import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { codeInspectorPlugin } from "code-inspector-plugin";
import * as path from "node:path";

// 处理 code-inspector-plugin 的 TS 类型
type CodeInspectorPlugin = (options: { bundler: 'vite' | 'webpack' }) => any

export default defineConfig({
  plugins: [
    vue(),
    (codeInspectorPlugin as unknown as CodeInspectorPlugin)({
      bundler: 'vite'
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts'
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/MikuNetDisk',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})