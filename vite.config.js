import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/discord': {
        target: 'https://discord.com/api/v10',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/discord/, ''),
      }
    }
  }
})
