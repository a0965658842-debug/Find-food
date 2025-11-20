import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // 設定 GitHub Pages 的 Repository 名稱路徑
    base: '/Find-food/',
    define: {
      // 讓前端程式碼可以讀取 process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env': {}
    }
  }
})