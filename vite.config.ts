import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/leetcode-240-search-a-2d-matrix-ii/',
  server: {
    port: 61305
  },
  preview: {
    port: 61305
  }
})
