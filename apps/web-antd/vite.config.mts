import { defineConfig } from '@xpress/vite-config';
// import XpressReactRouter from '@xpress-core/file-router/vite';

import { reactRouter } from '@react-router/dev/vite';

// export function setupElegantRouter() {
//   return XpressReactRouter();
// }
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(async () => {
  return {
    application: {
      // // 通过loadingTemplate配置自定义的loading页面，替换默认的全局加载动画
      // injectAppLoading: false,
      // // loadingTemplate: 'default-loading-antd.html',
    },
    vite: {
      optimizeDeps: {
        exclude: ['react-router-dom'],
        include: ['react-router', '@react-router/node'],
      },
      // plugins: [setupElegantRouter()],
      plugins: [tsconfigPaths(), reactRouter()],
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
