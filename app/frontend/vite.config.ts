import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import 'dotenv/config'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [react(), VitePWA()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
      port: Number(process.env.VITE_PORT) || undefined,
      host: Boolean(process.env.VITE_HOST) || undefined,
      strictPort: true,
    },
  })
}
