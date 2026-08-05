import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/app': resolve(__dirname, 'src/app'),
      '@/shared': resolve(__dirname, 'src/shared'),
      '@/features': resolve(__dirname, 'src/features'),
      '@/core': resolve(__dirname, 'src/core'),
      '@/assets': resolve(__dirname, 'src/assets'),
    },
  },
})
