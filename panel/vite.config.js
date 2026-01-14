import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      '5173-i2htniqk04l1fsw75vzgi-de59bda9.sandbox.novita.ai',
      '.sandbox.novita.ai'
    ]
  }
})
