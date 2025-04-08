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
      '/fnos': {
        target: 'https://fnos.xn--1jqw64a7tu.cn:444',  // 后端的地址
        changeOrigin: true,  // 设置为 true，代理请求会将 Origin 头部改为目标地址
        rewrite: (path) => path.replace(/^\/fnos/, ''),  // 可选：重写路径，去掉 /api 前缀
      }
    }
  }
})
