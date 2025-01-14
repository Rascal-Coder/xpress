import type {
  RouteFile,
  RouteTreeNode,
  XpressRouterNamePathEntry,
  XpressRouterOption,
} from '../file-core/types';

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { PAGE_DIR } from '../file-core';
import { ensureFile } from '../shared/fs';

/**
 * 获取别名导入路径
 */
function getAliasImportPath(path: string) {
  return `${PAGE_DIR}/${path}`;
}

/**
 * 生成路由类型定义文件
 */
export async function genDtsFile(
  files: RouteFile[],
  entries: XpressRouterNamePathEntry[],
  options: XpressRouterOption,
) {
  const { cwd } = options;
  const dtsPath = join(cwd, 'src/types/routes.d.ts');
  await ensureFile(dtsPath);

  const dtsContent = `// 此文件由 xpress-router 自动生成，请勿手动修改
import type { RouteObject } from 'react-router-dom';
import type { FC } from 'react';

export interface RouteParams {
${files
  .map((file) => {
    const params = file.params;
    if (!params.dynamic && !params.optional && !params.query) return '';
    const routeName = file.path.replace(/\.[^.]+$/, '');
    return `  '${routeName}': {
    ${params.dynamic ? `dynamic: ${JSON.stringify(params.dynamic)};` : ''}
    ${params.optional ? `optional: ${JSON.stringify(params.optional)};` : ''}
    ${params.query ? `query: ${JSON.stringify(params.query)};` : ''}
  };`;
  })
  .filter(Boolean)
  .join('\n')}
}

export interface RouteConfig extends RouteObject {
  path: string;
  name: string;
  element: FC | null;
  children?: RouteConfig[];
}

export type RouteKey = ${entries.map(([name]) => `'${name}'`).join(' | ')};
`;

  await writeFile(dtsPath, dtsContent);
}

/**
 * 处理路由路径，移除括号
 */
function processRoutePath(path: string) {
  return path.replaceAll(/\(([^)]+)\)\//g, '$1/');
}

/**
 * 生成路由导入文件
 */
export async function genImportsFile(
  files: RouteFile[],
  options: XpressRouterOption,
) {
  const { cwd } = options;
  const importPath = join(cwd, 'src/routes/imports.ts');
  await ensureFile(importPath);

  const importContent = `// 此文件由 xpress-router 自动生成，请勿手动修改
import type { RouteConfig } from '${Object.keys(options.alias)[0]}/types/routes';

${files
  .map(
    (file, index) =>
      `import Component${index} from '${getAliasImportPath(file.importPath.replace(/\.[^.]+$/, ''))}';`,
  )
  .join('\n')}

export const routeComponents = {
${files
  .map(
    (file, index) =>
      `  '${processRoutePath(file.path.replace(/\.[^.]+$/, ''))}': Component${index},`,
  )
  .join('\n')}
} as const;
`;

  await writeFile(importPath, importContent);
}

/**
 * 生成路由常量文件
 */
export async function genConstFile(
  trees: RouteTreeNode[],
  options: XpressRouterOption,
) {
  const { cwd } = options;
  const constPath = join(cwd, 'src/routes/const.ts');
  await ensureFile(constPath);

  function stringifyNode(node: RouteTreeNode): string {
    const children = node.children?.length
      ? `
    children: [${node.children.map((child) => stringifyNode(child)).join(',')}
    ],`
      : '';

    const componentPath = node.path
      ? node.path
          .replace(/\.[^.]+$/, '')
          .replaceAll(/:\w+\?/g, (match) =>
            match.replace(':', '$').replace('?', ''),
          )
          .replaceAll(/:\w+/g, (match) => `${match.replace(':', '[')}]`)
      : '';

    const element = componentPath
      ? `element: routeComponents['${componentPath}'],`
      : `element: null,`;

    return `
    {
      path: '${node.path}',
      name: '${node.name}',
      ${element}${children}
    }`;
  }

  const constContent = `// 此文件由 xpress-router 自动生成，请勿手动修改
import type { RouteConfig } from '${Object.keys(options.alias)[0]}/types/routes';
import { routeComponents } from './imports';

export const routes: RouteConfig[] = [${trees.map((node) => stringifyNode(node)).join(',')}
];
`;

  await writeFile(constPath, constContent);
}

/**
 * 生成路由转换文件
 */
export async function genTransformFile(
  options: XpressRouterOption,
  entries: XpressRouterNamePathEntry[],
) {
  const { cwd } = options;
  const transformPath = join(cwd, 'src/routes/transform.ts');
  await ensureFile(transformPath);

  const transformContent = `// 此文件由 xpress-router 自动生成，请勿手动修改
import type { RouteKey } from '${Object.keys(options.alias)[0]}/types/routes';

const routeMap = new Map<RouteKey, string>([
${entries.map(([name, path]) => `  ['${name}', '${path}'],`).join('\n')}
]);

export function getRoutePath(key: RouteKey): string {
  const path = routeMap.get(key);
  if (!path) {
    throw new Error(\`Route key "\${key}" not found\`);
  }
  return path;
}
`;

  await writeFile(transformPath, transformContent);
}
