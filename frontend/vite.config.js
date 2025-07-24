import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@reports': path.resolve(__dirname, './src/reports'),
      '@tests': path.resolve(__dirname, './src/tests'),
    },
  },
  // ✨ Added server proxy configuration
  server: {
    proxy: {
      // This tells Vite to forward any request that starts with /api
      // to your backend server running on http://localhost:8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Recommended for http targets
      },
    },
  },
})
