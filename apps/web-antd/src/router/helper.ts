import type { ComponentType } from 'react';

import {
  generateRoutesByFrontend,
  type RouteConfig,
} from '@xpress-core/router';
// import { mapTree } from '@xpress-core/shared/utils';

import { routes } from './routes';

const forbiddenComponent = () => import('#/pages/noAccess');
// TODO: 测试前端路由
const testFrontendRoutes = await generateRoutesByFrontend(
  routes,
  ['admin'],
  forbiddenComponent,
);
// TODO:后端返回路由
const mockRoutes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/',
    component: 'layout',
    flatten: true,
    children: [
      {
        path: 'home',
        meta: {
          title: '概览',
          badgeType: 'dot',
        },
        defaultPath: 'analysis',
        children: [
          {
            path: 'analysis',
            component: '/dashboard/analysis/index',
            meta: {
              menuVisibleWithForbidden: true,
              title: '分析页',
            },
          },
          {
            path: 'workbench',
            component: '/dashboard/workbench/index',
            meta: {
              title: '工作台',
            },
          },
        ],
      },
      {
        path: 'settings',
        meta: {
          title: '设置',
        },
        component: '/settings/index',
      },
      {
        path: 'nest',
        component: '/pages/nest/index',
        meta: {
          title: '嵌套路由',
        },
        defaultPath: 'nest1',
        children: [
          {
            path: 'nest1',
            component: '/nest/nest1/index',
            meta: {
              title: '菜单1',
            },
          },
          {
            path: 'nest2',
            component: '/nest/nest2/index',
            meta: {
              title: '菜单2',
            },
            defaultPath: 'nest2-1',
            children: [
              {
                path: 'nest2-1',
                component: '/nest/nest2/nest2-1/index',
                meta: {
                  title: '菜单2-1',
                },
              },
              {
                path: 'nest2-2',
                component: '/nest/nest2/nest2-2/nest2-2-2/index',
                meta: {
                  title: '菜单2-2',
                },
                defaultPath: 'nest2-2-1',
                children: [
                  {
                    path: 'nest2-2-1',
                    component: '/nest/nest2/nest2-1/nest2-2-1/index',
                    meta: {
                      title: '菜单2-2-1',
                    },
                  },
                  {
                    path: 'nest2-2-2',
                    component: '/nest/nest2/nest2-2/nest2-2-2/index',
                    meta: {
                      title: '菜单2-2-2',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'error-page',
        meta: {
          title: '错误页',
        },
        defaultPath: '403',
        children: [
          {
            path: '403',
            component: '/noAccess/index',
            meta: {
              title: '403',
            },
          },
          {
            path: '404',
            component: '/notFound/index',
            meta: {
              title: '404',
            },
          },
        ],
      },
    ],
  },
];
type ComponentRecordType = Record<
  string,
  () => Promise<{ default: ComponentType }>
>;

type RouteRecordStringComponent<T = string> = {
  children?: RouteRecordStringComponent<T>[];
  component?: T;
  redirect?: string;
} & Omit<RouteConfig, 'children' | 'component' | 'meta' | 'redirect'>;

interface TreeConfigOptions {
  // 子属性的名称，默认为'children'
  childProps: string;
}
const pageMap: ComponentRecordType = import.meta.glob<{
  default: ComponentType;
}>('../pages/**/*.tsx', { import: 'default' });
const normalizePageMap: ComponentRecordType = {};
for (const [key, value] of Object.entries(pageMap)) {
  normalizePageMap[normalizeViewPath(key)] = value;
}

const layoutMap: ComponentRecordType = {
  layout: () => import('#/layout'),
};
const testBackendRoutes = convertRoutes(
  mockRoutes,
  layoutMap,
  normalizePageMap,
);

function normalizeViewPath(path: string): string {
  // 去除相对路径前缀
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '');

  // 确保路径以 '/' 开头
  const viewPath = normalizedPath.startsWith('/')
    ? normalizedPath
    : `/${normalizedPath}`;
  return viewPath.replace(/^\/pages/, '');
}

function mapTree<T, V extends Record<string, any>>(
  tree: T[],
  mapper: (node: T) => V,
  options?: TreeConfigOptions,
): V[] {
  const { childProps } = options || {
    childProps: 'children',
  };
  return tree.map((node) => {
    const mapperNode: Record<string, any> = mapper(node);
    if (mapperNode[childProps]) {
      mapperNode[childProps] = mapTree(mapperNode[childProps], mapper, options);
    }
    return mapperNode as V;
  });
}

function convertRoutes(
  routes: RouteRecordStringComponent[],
  layoutMap: ComponentRecordType,
  pageMap: ComponentRecordType,
): RouteConfig[] {
  return mapTree(routes, (node) => {
    const route = node as unknown as RouteConfig;
    const { component } = node;

    // layout转换
    if (component && layoutMap[component]) {
      route.component = layoutMap[component];
      // 页面组件转换
    } else if (component) {
      const normalizePath = normalizeViewPath(component);

      route.component =
        pageMap[
          normalizePath.endsWith('.tsx')
            ? normalizePath
            : `${normalizePath}.tsx`
        ];
    }

    return route;
  });
}
// TODO:根据后端返回路由生成真实的前端路由
export { testBackendRoutes, testFrontendRoutes };
