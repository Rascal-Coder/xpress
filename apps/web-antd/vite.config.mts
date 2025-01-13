import { defineConfig } from '@xpress/vite-config';
import ElegantReactRouter from '@xpress-core/file-router/vite';

interface RouteMeta extends Record<number | string, unknown> {}

export function setupElegantRouter() {
  return ElegantReactRouter({
    customRoutes: {
      names: [
        'exception_403',
        'exception_404',
        'exception_500',
        'document_project',
        'document_project-link',
        'document_react',
        'document_vite',
        'document_unocss',
        'document_proComponents',
        'document_antd',
        'logout',
      ],
    },
    layouts: {
      base: 'src/layouts/base-layout/index.tsx',
      blank: 'src/layouts/blank-layout/index.tsx',
    },
    log: false,
    onRouteMetaGen(routeName) {
      const key = routeName as any;

      const constantRoutes: any[] = ['login', '403', '404', '500'];

      const meta: Partial<RouteMeta> = {
        i18nKey: `route.${key}` as any,
        title: key,
      };

      if (constantRoutes.includes(key)) {
        meta.constant = true;
      }

      return meta;
    },
  });
}

export default defineConfig(async () => {
  return {
    application: {
      // 通过loadingTemplate配置自定义的loading页面，替换默认的全局加载动画
      injectAppLoading: false,
      // loadingTemplate: 'default-loading-antd.html',
    },
    vite: {
      // plugins: [setupElegantRouter()],
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
