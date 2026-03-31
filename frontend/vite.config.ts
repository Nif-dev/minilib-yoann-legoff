//% frontend/vite.config.ts
//? Configuration de Vite serveur dev + proxy API (loadEnv pour .env VITE_*)

import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig(({ mode }) => {
  // Charge VITE_* depuis .env(.mode)
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  
  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      port: env.VITE_PORT ? Number.parseInt(env.VITE_PORT) : 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true
        }
      }
    }
  }
})