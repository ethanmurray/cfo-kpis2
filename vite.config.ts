import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { apiPlugin } from './src/server/viteApiPlugin'

// When VITE_PUBLIC_CLIENTS is set, inject boolean constants per client so
// Rollup/terser can tree-shake entire config objects from the production bundle.
const publicClients = process.env.VITE_PUBLIC_CLIENTS?.split(',') ?? null

export default defineConfig({
  plugins: [apiPlugin(), react()],
  define: {
    __INCLUDE_NTRS__: JSON.stringify(!publicClients || publicClients.includes('ntrs')),
    __INCLUDE_BNS__: JSON.stringify(!publicClients || publicClients.includes('bns')),
    __INCLUDE_ACME__: JSON.stringify(!publicClients || publicClients.includes('acme')),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
