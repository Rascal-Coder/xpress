import type { RouteConfig, RouterOptions } from './index';

import { useLayoutEffect, useMemo, useState } from 'react';
import {
  RouterProvider as BaseRouterProvider,
  useLocation,
} from 'react-router-dom';

import { DefaultLoading } from './components/Loading';
import { MetaContext } from './context';
import { createRouter } from './index';

/**
 * 查找当前路由配置
 * @param {RouteConfig[]} routes - 路由配置数组
 * @param {string} pathname - 当前路径
 * @returns {RouteConfig | undefined} 匹配的路由配置
 * @internal
 */
function findRouteByPath(
  routes: RouteConfig[],
  pathname: string,
): RouteConfig | undefined {
  for (const route of routes) {
    if (route.path === pathname) {
      return route;
    }
    if (route.children) {
      const found = findRouteByPath(route.children, pathname);
      if (found) return found;
    }
  }
  return undefined;
}

// 记住滚动位置
const scrollPositions = new Map<string, number>();

function saveScrollPosition(location: string) {
  scrollPositions.set(location, window.scrollY);
}

function restoreScrollPosition(location: string) {
  const position = scrollPositions.get(location) || 0;
  window.scrollTo(0, position);
}

/**
 * Provider 组件的属性类型
 * @interface MetaRouterProviderProps
 * @property {RouterOptions} [options] - 路由选项
 * @property {RouteConfig[]} routes - 路由配置
 * @public
 */
export interface MetaRouterProviderProps {
  options?: RouterOptions;
  routes: RouteConfig[];
}

/**
 * 扩展的路由 Provider 组件
 * 提供路由元信息、加载状态和滚动位置管理
 * @param {MetaRouterProviderProps} props
 * @public
 */
export function MetaRouterProvider({
  options = {
    loading: true,
    mode: 'browser',
  },
  routes,
}: MetaRouterProviderProps) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const currentRoute = useMemo(
    () => findRouteByPath(routes, location.pathname),
    [routes, location.pathname],
  );

  // 如果没有提供 router，根据 mode 创建一个
  const routerInstance = useMemo(
    () => createRouter(routes, options.mode),
    [routes, options.mode],
  );

  // 根据配置决定是否显示 loading
  const shouldShowLoading = useMemo(() => {
    // 路由级配置优先
    if (currentRoute?.meta?.loading !== undefined) {
      return (
        currentRoute.meta.loading === true ||
        (currentRoute.meta.loading === 'auto' && options.loading !== false)
      );
    }
    // 全局配置
    return options.loading !== false;
  }, [currentRoute, options.loading]);

  useLayoutEffect(() => {
    if (!shouldShowLoading) return;

    saveScrollPosition(location.key);
    setIsLoading(true);

    const timer = requestAnimationFrame(() => {
      setIsLoading(false);
      restoreScrollPosition(location.key);
    });

    return () => cancelAnimationFrame(timer);
  }, [location, shouldShowLoading]);

  const contextValue = useMemo(
    () => ({
      currentRoute,
      isLoading,
      routes,
    }),
    [routes, currentRoute, isLoading],
  );

  const LoadingComponent = options.loadingComponent || DefaultLoading;

  return (
    <MetaContext.Provider value={contextValue}>
      <LoadingComponent spinning={isLoading} />
      <BaseRouterProvider router={routerInstance} />
    </MetaContext.Provider>
  );
}
