import type { FC, ReactNode } from 'react';
import type { LoaderFunction } from 'react-router-dom';

import type { LoadingProps } from './components/Loading';

import {
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useMetaContext } from './context';

export { MetaRouterProvider as XRouterProvider } from './provider';

/**
 * 路由元数据类型
 * @interface RouteMeta
 * @property {boolean | 'auto'} [loading] - 路由级别的加载状态控制
 * @public
 */
export interface RouteMeta {
  [key: string]: any;
  loading?: 'auto' | boolean;
}

/**
 * 路由配置类型
 * @interface RouteConfig
 * @property {RouteConfig[]} [children] - 子路由配置
 * @property {ReactNode} [element] - 路由组件
 * @property {LoaderFunction} [loader] - 数据加载函数
 * @property {RouteMeta} [meta] - 路由元数据
 * @property {string} path - 路由路径
 * @public
 */
export interface RouteConfig {
  children?: RouteConfig[];
  element?: ReactNode;
  loader?: LoaderFunction;
  meta?: RouteMeta;
  path: string;
}

/**
 * 路由模式类型
 * @type RouterMode
 * @public
 */
export type RouterMode = 'browser' | 'hash' | 'memory';

/**
 * 路由选项类型
 * @interface RouterOptions
 * @property {boolean} [loading] - 全局加载状态控制
 * @property {FC<LoadingProps>} [loadingComponent] - 自定义加载组件
 * @property {RouterMode} [mode='browser'] - 路由模式
 */
export interface RouterOptions {
  loading?: boolean;
  loadingComponent?: FC<LoadingProps>;
  mode?: RouterMode;
}

/**
 * 加载数据类型
 * @template T - 数据类型
 */
export type LoaderData<T> = {
  data: T;
  error?: Error;
};

/**
 * 扩展的 useLoaderData hook
 * @template T - 数据类型
 * @returns {LoaderData<T>} 加载的数据
 */
export function useRouteLoader<T>() {
  const data = useLoaderData() as LoaderData<T>;
  return data;
}

/**
 * 自定义路由 hook，提供 meta 信息和加载状态
 * @returns {object} 路由相关的状态和方法
 * @public
 */
export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { currentRoute, isLoading } = useMetaContext();

  return {
    isLoading,
    location,
    meta: currentRoute?.meta || {},
    navigate,
    params,
    pathname: location.pathname,
    query: new URLSearchParams(location.search),
  };
}

export * from 'react-router-dom';

/**
 * 创建路由实例
 * @param {RouteConfig[]} routes - 路由配置
 * @param {RouterMode} [mode] - 路由模式
 * @returns {RemixRouter} 路由实例
 * @public
 */
export function createRouter(
  routes: RouteConfig[],
  mode: RouterMode = 'browser',
) {
  switch (mode) {
    case 'hash': {
      return createHashRouter(routes);
    }
    case 'memory': {
      return createMemoryRouter(routes);
    }
    default: {
      return createBrowserRouter(routes);
    }
  }
}
