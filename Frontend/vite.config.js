import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Backend address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove the `/api` part when forwarding to backend
      },
    },
  },
})
