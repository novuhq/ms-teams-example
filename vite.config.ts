import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/novu': {
          target: env.VITE_NOVU_API_URL || 'https://api.novu.co',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/novu/, ''),
        },
      },
    },
  }
})
