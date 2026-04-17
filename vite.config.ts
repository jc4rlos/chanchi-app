import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'vendor-react'
          }
          if (
            id.includes('@tanstack/react-router') ||
            id.includes('@tanstack/router-core') ||
            id.includes('@tanstack/history')
          ) {
            return 'vendor-router'
          }
          if (
            id.includes('@tanstack/react-query') ||
            id.includes('@tanstack/query-core')
          ) {
            return 'vendor-query'
          }
          if (id.includes('@tanstack/react-table')) {
            return 'vendor-table'
          }
          if (id.includes('@supabase/')) {
            return 'vendor-supabase'
          }
          if (id.includes('recharts') || id.includes('/node_modules/d3-')) {
            return 'vendor-charts'
          }
          if (id.includes('@radix-ui/')) {
            return 'vendor-radix'
          }
          if (id.includes('/node_modules/lucide-react/')) {
            return 'vendor-icons'
          }
          if (
            id.includes('/node_modules/zod/') ||
            id.includes('/node_modules/react-hook-form/') ||
            id.includes('@hookform/')
          ) {
            return 'vendor-forms'
          }
        },
      },
    },
  },
})
