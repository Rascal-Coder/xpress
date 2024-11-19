import { defineConfig } from '@xpress/vite-config';

export default defineConfig(async () => {
  return {
    application: {
      loadingTemplate: 'loadingTemplate/default-loading-antd.html',
    },
    vite: {
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
});
