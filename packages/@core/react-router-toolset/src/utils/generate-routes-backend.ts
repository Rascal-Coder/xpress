import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  RouteConfig,
  RouteRecordStringComponent,
} from '../types';

import { mapTree } from '@xpress-core/shared/utils';

function normalizeViewPath(path: string): string {
  // 去除相对路径前缀
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '');

  // 确保路径以 '/' 开头
  const viewPath = normalizedPath.startsWith('/')
    ? normalizedPath
    : `/${normalizedPath}`;
  return viewPath.replace(/^\/pages/, '');
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

async function generateRoutesByBackend(
  options: GenerateMenuAndRoutesOptions,
): Promise<RouteConfig[]> {
  const { fetchMenuListAsync, layoutMap = {}, pageMap = {} } = options;

  try {
    const menuRoutes = await fetchMenuListAsync?.();
    if (!menuRoutes) {
      return [];
    }

    const normalizePageMap: ComponentRecordType = {};

    for (const [key, value] of Object.entries(pageMap)) {
      normalizePageMap[normalizeViewPath(key)] = value;
    }

    const routes = convertRoutes(menuRoutes, layoutMap, normalizePageMap);

    return routes;
  } catch (error) {
    console.error(error);
    return [];
  }
}
export { generateRoutesByBackend };
