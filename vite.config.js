import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'S3',
    emptyOutDir: true
  },
  server: {
    host: '0.0.0.0',
    port: 7002,
    hmr: {
      clientPort: 443,
      host: 'quickstart.' + process.env.HELLO_DOMAIN
    }
  }
})
