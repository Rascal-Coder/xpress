import type {
  RouteFile,
  RouteFileType,
  RouteParams,
  RouteTreeNode,
  XpressRouterNamePathEntry,
  XpressRouterNamePathMap,
} from '../types';

import { PAGE_DIR } from '../constants';

/**
 * 获取路由文件类型
 *
 * @param glob - glob 路径
 * @returns 路由文件类型
 */
export function getRouteFileType(glob: string): RouteFileType {
  if (glob.includes('layout')) return 'layout';
  if (glob.includes('error')) return 'error';
  if (glob.includes('loading')) return 'loading';
  if (glob.includes('not-found')) return 'not-found';
  return 'page';
}

/**
 * 将 glob 路径转换为路由路径
 *
 * @param glob - glob 路径
 * @returns 路由路径
 */
export function globToRoutePath(glob: string): string {
  const pageDir = PAGE_DIR.split('/').pop() || '';
  return glob
    .replace(/\.[^.]+$/, '') // 移除扩展名
    .replace(/^\(*([^)]+)\)*/, '$1') // 移除分组括号
    .replaceAll(/\[([^\]]+)\]/g, ':$1') // 转换动态参数
    .replaceAll(/\$(\w+)/g, ':$1?') // 转换查询参数
    .replace(new RegExp(`^${pageDir}/`), '/') // 将 pageDir 替换为根路径
    .replace(/\/index$/, ''); // 移除 index 后缀
}

/**
 * 解析路由参数
 *
 * @param glob - glob 路径
 * @returns 路由参数信息
 */
export function parseRouteParams(glob: string): RouteParams {
  const params: RouteParams = {};

  // 解析动态参数 [param]
  const dynamicParams = glob.match(/\[([^\]]+)\]/g)?.map((p) => p.slice(1, -1));
  if (dynamicParams?.length) {
    params.dynamic = dynamicParams;
  }

  // 解析可选参数 [[param]]
  const optionalParams = glob
    .match(/\[\[([^\]]+)\]\]/g)
    ?.map((p) => p.slice(2, -2));
  if (optionalParams?.length) {
    params.optional = optionalParams;
  }

  // 解析查询参数 $param
  const queryParams = glob.match(/\$([^/.]+)/g)?.map((p) => p.slice(1));
  if (queryParams?.length) {
    params.query = queryParams;
  }

  // 解析分组 (group)
  const group = glob.match(/\(([^)]+)\)/)?.[1];
  if (group) {
    params.group = group;
  }

  return params;
}

/**
 * 将 glob 路径转换为路由文件信息
 *
 * @param glob - glob 路径
 * @returns 路由文件信息
 */
export function transformGlobToRouteFile(glob: string): RouteFile {
  return {
    importPath: glob,
    params: parseRouteParams(glob),
    path: glob,
    routePath: globToRoutePath(glob),
    type: getRouteFileType(glob),
  };
}

/**
 * 将路由文件信息转换为路由映射表
 *
 * @param files - 路由文件信息数组
 * @returns 路由名称到路径的映射表
 */
export function transformFilesToMaps(
  files: RouteFile[],
): XpressRouterNamePathMap {
  const maps = new Map<string, string>();
  const pageDir = PAGE_DIR.split('/').pop() || '';

  files.forEach((file) => {
    // 移除文件扩展名和特殊字符
    const routeName = file.path
      .replace(/\.[^.]+$/, '') // 移除扩展名
      .replace(/^\(*([^)]+)\)*/, '$1') // 移除分组括号
      .replaceAll(/\[([^\]]+)\]/g, ':$1') // 转换动态参数
      .replaceAll(/\$(\w+)/g, ':$1?') // 转换查询参数
      .replace(new RegExp(`^${pageDir}/`), ''); // 移除 pageDir 前缀

    // 生成路由路径
    const routePath = file.path
      .replace(/\.[^.]+$/, '') // 移除扩展名
      .replace(/^\(*([^)]+)\)*/, '$1') // 移除分组括号
      .replaceAll(/\[([^\]]+)\]/g, ':$1') // 转换动态参数
      .replaceAll(/\$(\w+)/g, ':$1?') // 转换查询参数
      .replace(new RegExp(`^${pageDir}/`), '/') // 将 pageDir 替换为根路径
      .replace(/\/index$/, ''); // 移除 index 后缀

    maps.set(routeName, routePath);
  });

  return maps;
}

/**
 * 将路由映射表转换为路由条目数组
 *
 * @param maps - 路由映射表
 * @returns 路由条目数组，按路由名称排序
 */
export function transformMapsToEntries(
  maps: XpressRouterNamePathMap,
): XpressRouterNamePathEntry[] {
  return [...maps.entries()].sort(([a], [b]) => a.localeCompare(b));
}

/**
 * 将路由条目数组转换为路由树
 *
 * @param entries - 路由条目数组
 * @returns 路由树数组
 */
export function transformEntriesToTrees(
  entries: XpressRouterNamePathEntry[],
): RouteTreeNode[] {
  const trees: RouteTreeNode[] = [];

  entries.forEach(([name, path]) => {
    const segments = name.split('/').filter(Boolean);
    let currentLevel: RouteTreeNode[] = trees;

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      const existingNode = currentLevel.find((node) => node.name === segment);

      if (existingNode) {
        if (isLast) {
          existingNode.path = path;
        }
        existingNode.children = existingNode.children || [];
        currentLevel = existingNode.children;
      } else {
        const newNode: RouteTreeNode = {
          name: segment,
          path: isLast ? path : '',
          children: [],
        };
        currentLevel.push(newNode);
        currentLevel = newNode.children || [];
      }
    });
  });

  return trees;
}
