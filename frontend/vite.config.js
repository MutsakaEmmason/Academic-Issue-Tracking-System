// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/static/', // CRITICAL: This makes Vite generate paths like /static/assets/index-XXXXX.js
  build: {
    outDir: 'dist', // Ensure this is 'dist'
  }
})
