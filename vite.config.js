import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path';
import sri from './sri.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    {
      enforce: "post",
      ...sri({ publicPath: "/" })
    }
  ],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
      $components: path.resolve('./src/lib/components')
    }
  },
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
