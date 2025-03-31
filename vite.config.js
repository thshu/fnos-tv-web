import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://fnos.xn--1jqw64a7tu.cn:81/v/api',  // 后端的地址
        changeOrigin: true,  // 设置为 true，代理请求会将 Origin 头部改为目标地址
        rewrite: (path) => path.replace(/^\/api/, ''),  // 可选：重写路径，去掉 /api 前缀
      }
    }
  }
})
