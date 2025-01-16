import { defineConfig } from '@xpress/vite-config';

import { reactRouter } from '@react-router/dev/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [reactRouter()],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
}, 'application');
