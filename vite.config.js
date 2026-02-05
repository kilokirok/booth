import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/booth/', // GitHub 저장소 이름이 booth이므로 이 설정이 필수입니다.
})