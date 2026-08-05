import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

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
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
