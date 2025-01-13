import type { ElegantRouterTree } from '../core';
import type {
  ElegantConstRoute,
  ElegantReactRouterOption,
  RouteConstExport,
} from '../types';

import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { generateCode, loadFile } from 'magicast';
import { parse } from 'recast/parsers/typescript.js';

import {
  FIRST_LEVEL_ROUTE_COMPONENT_SPLIT,
  LAYOUT_PREFIX,
  VIEW_PREFIX,
} from '../constants';
import { PAGE_DEGREE_SPLITTER } from '../core';
import { formatCode } from '../shared/prettier';
import { createPrefixCommentOfGenFile } from './comment';
import { log } from './log';

/**
 * 生成路由常量文件
 *
 * @param tree - 路由树数组
 * @param options - 路由配置选项
 * @description 根据提供的路由树和配置选项，生成对应的路由常量文件
 */
export async function genConstFile(
  tree: ElegantRouterTree[],
  options: ElegantReactRouterOption,
) {
  const { constDir, cwd } = options;

  const routesFilePath = path.posix.join(cwd, constDir);

  const code = await getConstCode(tree, options);

  await writeFile(routesFilePath, code, 'utf8');
}

/**
 * 获取路由常量代码
 *
 * @param trees - 路由树数组
 * @param options - 路由配置选项
 * @returns 返回生成的路由配置代码字符串
 * @description
 * 处理路由树并生成配置代码，包括：
 * 1. 检查并创建空的路由配置文件
 * 2. 转换路由树为常量配置
 * 3. 合并新旧路由配置
 * 4. 格式化生成的代码
 */
async function getConstCode(
  trees: ElegantRouterTree[],
  options: ElegantReactRouterOption,
) {
  const { constDir, cwd } = options;
  const routeFilePath = path.posix.join(cwd, constDir);

  const existFile = existsSync(routeFilePath);

  if (!existFile) {
    const code = await createEmptyRouteConst();
    await writeFile(routeFilePath, code, 'utf8');
  }

  const md = await loadFile<RouteConstExport>(routeFilePath, {
    parser: { parse },
  });

  const autoRoutes = trees.map((item) =>
    transformRouteTreeToElegantConstRoute(item, options),
  );

  const oldRoutes = structuredClone(
    md.exports.generatedRoutes,
  ) as ElegantConstRoute[];

  const updated = await getUpdatedRouteConst(oldRoutes, autoRoutes, options);

  md.exports.generatedRoutes = updated as any;

  let { code } = generateCode(md);

  code = transformComponent(code);

  const formattedCode = await formatCode(code);

  const removedEmptyLineCode = formattedCode.replaceAll(',\n\n', `,\n`);

  return removedEmptyLineCode;
}

/**
 * 创建空的路由常量文件
 *
 * @returns 返回初始化的路由配置代码字符串
 * @description 生成一个包含必要导入和空路由数组的基础配置文件
 */
async function createEmptyRouteConst() {
  const prefixComment = createPrefixCommentOfGenFile();

  const code = `${prefixComment}

import type { GeneratedRoute } from '@xpress-router/types';

export const generatedRoutes: GeneratedRoute[] = [];

`;

  return code;
}

/**
 * 更新路由常量配置
 *
 * @param oldConst - 现有的路由配置数组
 * @param newConst - 新生成的路由配置数组
 * @param options - 路由配置选项
 * @returns 返回更新后的路由配置数组
 * @description
 * 合并新旧路由配置，保持用户自定义配置的同时更新必要的路由信息
 * 支持从单独的配置文件中读取路由信息
 */
async function getUpdatedRouteConst(
  oldConst: ElegantConstRoute[],
  newConst: ElegantConstRoute[],
  options: ElegantReactRouterOption,
) {
  const oldRouteMap = getElegantConstRouteMap(oldConst);

  const updated = await Promise.all(
    newConst.map(async (item) => {
      const oldRoute = oldRouteMap.get(item.name);
      let config = {} as ElegantConstRoute;
      if (options.routeInfoByFile) {
        const configFile = `${item.name.split('_').join('/')}/${options.routeInfoFileName}`;

        const { cwd, pageDir } = options;
        const routeFilePath = path.posix.join(cwd, pageDir, configFile);

        try {
          const md = await loadFile<RouteConstExport>(routeFilePath, {
            parser: { parse },
          });
          config = structuredClone(md.exports as unknown as ElegantConstRoute);
        } catch (error: any) {
          log(
            `Note that no file related to routing information is created in this file:` +
              ` ${error.path}`,
            'info',
            options.log,
          );
        }
      }

      if (!oldRoute) {
        if (options.routeInfoByFile) {
          Object.assign(item, config);
        }
        return item;
      }

      const {
        component,
        meta,
        name,
        path: routePath,
        children,
        ...rest
      } = item;

      const updatedRoute = { ...oldRoute, path: routePath };

      const isFirstLevel =
        !name.includes(PAGE_DEGREE_SPLITTER) && !children?.length;

      if (config.layout || oldRoute.layout) {
        const layout = config.layout || oldRoute.layout;

        updatedRoute.component = `layout.${layout}`;
      } else if (oldRoute.component && component) {
        if (isFirstLevel) {
          const { layoutName: oldLayoutName } = resolveFirstLevelRouteComponent(
            oldRoute.component,
          );
          const { layoutName: newLayoutName } =
            resolveFirstLevelRouteComponent(component);
          const hasLayout = Boolean(options.layouts[oldLayoutName]);

          const layoutName = hasLayout ? oldLayoutName : newLayoutName;
          const viewName = item.name;

          updatedRoute.component = getFirstLevelRouteComponent(
            viewName,
            layoutName,
          );
        } else {
          const isView = oldRoute.component.startsWith(VIEW_PREFIX);
          const isLayout = oldRoute.component.startsWith(LAYOUT_PREFIX);
          const layoutName = oldRoute.component.replace(LAYOUT_PREFIX, '');
          const hasLayout = Boolean(options.layouts[layoutName]);

          if (isView || (isLayout && !hasLayout)) {
            updatedRoute.component = component;
          }
        }
      }

      mergeObject(updatedRoute, rest);
      if (!updatedRoute.meta && meta) {
        updatedRoute.meta = meta;
      }
      if (updatedRoute.meta && meta) {
        mergeObject(updatedRoute.meta, meta);
      }
      if (options.routeInfoByFile) {
        Object.assign(updatedRoute, config);
      }

      if (children?.length) {
        updatedRoute.children = await getUpdatedRouteConst(
          oldRoute?.children || [],
          children,
          options,
        );
      }

      return updatedRoute;
    }),
  );

  return updated;
}

/**
 * 合并对象属性
 *
 * @param target - 目标对象
 * @param source - 源对象
 * @description 将源对象中目标对象没有的属性合并到目标对象中
 */
function mergeObject<T extends Record<string, unknown>>(target: T, source: T) {
  const keys = Object.keys(source) as (keyof T)[];

  keys.forEach((key) => {
    if (!target[key]) {
      Object.assign(target, { [key]: source[key] });
    }
  });
}

/**
 * 获取路由常量映射
 *
 * @param constRoutes - 路由常量数组
 * @returns 返回以路由名称为键的Map对象
 * @description 将路由数组转换为便于查找的Map结构，支持递归处理嵌套路由
 */
function getElegantConstRouteMap(constRoutes: ElegantConstRoute[]) {
  const routeMap = new Map<string, ElegantConstRoute>();

  function recursiveGetElegantConstRoute(routes: ElegantConstRoute[]) {
    routes.forEach((item) => {
      const { name, children } = item;

      routeMap.set(name, item);

      if (children?.length) {
        recursiveGetElegantConstRoute(children);
      }
    });
  }

  recursiveGetElegantConstRoute(constRoutes);

  return routeMap;
}

/**
 * 转换路由树为常量配置
 *
 * @param tree - 路由树节点
 * @param options - 路由配置选项
 * @returns 返回转换后的路由常量配置
 * @description
 * 将路由树节点转换为标准的路由配置格式，包括：
 * 1. 处理布局组件
 * 2. 设置路由元信息
 * 3. 处理子路由
 */
function transformRouteTreeToElegantConstRoute(
  tree: ElegantRouterTree,
  options: ElegantReactRouterOption,
) {
  const { defaultLayout, onRouteMetaGen } = options;
  const { routeName, routePath, children = [] } = tree;

  const layoutComponent = `${LAYOUT_PREFIX}${defaultLayout}`;
  const firstLevelRouteComponent = getFirstLevelRouteComponent(
    routeName,
    defaultLayout,
  );

  const hasChildren = children.length > 0;

  const route: ElegantConstRoute = {
    component: hasChildren ? layoutComponent : firstLevelRouteComponent,
    name: routeName,
    path: routePath,
  };

  route.meta = onRouteMetaGen(routeName);

  if (hasChildren) {
    route.children = children.map((item) =>
      recursiveGetElegantConstRouteByChildTree(item, options),
    );
  }

  return route;
}

/**
 * 递归处理子路由树
 *
 * @param childTree - 子路由树节点
 * @param options - 路由配置选项
 * @returns 返回处理后的子路由配置
 * @description 递归处理子路由树，生成对应的路由配置
 */
function recursiveGetElegantConstRouteByChildTree(
  childTree: ElegantRouterTree,
  options: ElegantReactRouterOption,
): ElegantConstRoute {
  const { onRouteMetaGen } = options;
  const { routeName, routePath, children = [] } = childTree;

  const viewComponent = `${VIEW_PREFIX}${routeName}`;

  const hasChildren = children.length > 0;

  const route: ElegantConstRoute = {
    name: routeName,
    path: routePath,
  };

  if (hasChildren) {
    route.meta = onRouteMetaGen(routeName);
    const routeChildren = children.map((item) =>
      recursiveGetElegantConstRouteByChildTree(item, options),
    );
    route.children = routeChildren;
  } else {
    route.component = viewComponent;
    route.meta = onRouteMetaGen(routeName);
  }

  return route;
}

/**
 * 生成一级路由组件名称
 *
 * @param routeName - 路由名称
 * @param layoutName - 布局名称
 * @returns 返回完整的组件名称
 * @description 根据路由名称和布局名称生成标准格式的组件名称
 */
function getFirstLevelRouteComponent(routeName: string, layoutName: string) {
  const routeComponent = `${LAYOUT_PREFIX}${layoutName}${FIRST_LEVEL_ROUTE_COMPONENT_SPLIT}${VIEW_PREFIX}${routeName}`;

  return routeComponent;
}

/**
 * 解析一级路由组件
 *
 * @param component - 组件名称字符串
 * @returns 返回解析后的布局名称和视图名称
 * @description 将组件字符串解析为布局和视图两部分
 */
function resolveFirstLevelRouteComponent(component: string) {
  const [layout = '', view = ''] = component.split(
    FIRST_LEVEL_ROUTE_COMPONENT_SPLIT,
  );

  return {
    layoutName: layout.replace(LAYOUT_PREFIX, ''),
    viewName: view.replace(VIEW_PREFIX, ''),
  };
}

/**
 * 转换组件字符串格式
 *
 * @param routeJson - 路由配置JSON字符串
 * @returns 返回处理后的配置字符串
 * @description 将组件字符串转换为正确的代码格式，移除多余的引号
 */
function transformComponent(routeJson: string) {
  const COMPONENT_REG = /"component":\s*"(.*?)"/g;
  const result = routeJson.replaceAll(COMPONENT_REG, (match) => {
    const [component = '', viewOrLayout = ''] = match.split(':');

    return `${component}: ${viewOrLayout.replaceAll('"', '')}`;
  });

  return result;
}
