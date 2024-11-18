import { defineConfig } from '@xpress/vite-config';

export default defineConfig({
  appcation: {
    compress: false,
    compressTypes: ['brotli', 'gzip'],
    visualizer: false,
  },
  vite: {
    server: {
      proxy: {
        '/xpress-api': {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/vben-api/, ''),
          target: 'http://localhost:3000',
          ws: true,
        },
      },
    },
  },
});
