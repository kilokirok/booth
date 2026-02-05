import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 경로를 상대 경로로 고정하여 GitHub Pages의 경로 문제를 해결합니다.
  base: './', 
})