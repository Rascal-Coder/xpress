import type { ElegantRouterFile } from '../core';
import type { ElegantReactRouterOption } from '../types';

import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { ensureFile } from '../shared/fs';
import { createPrefixCommentOfGenFile } from './comment';

function getImportsCode(
  files: ElegantRouterFile[],
  options: ElegantReactRouterOption,
) {
  const layoutFiles = getLayoutFile(options);

  const preCode = createPrefixCommentOfGenFile();

  let importCode = `import type { LazyRouteFunction, RouteObject } from "react-router-dom";
import type { LastLevelRouteKey, RouteLayout } from "@xpress-router/types";
type CustomRouteObject = Omit<RouteObject, 'Component'|'index'> & {
  Component?: React.ComponentType<any>|null;
};
`;

  let exportLayoutCode = `export const layouts: Record<RouteLayout, LazyRouteFunction<CustomRouteObject>> = {`;

  layoutFiles.forEach((file) => {
    const { importPath, layoutName } = file;
    if (!importPath || !layoutName) return;

    const isLazy = options.layoutLazyImport(layoutName);

    if (isLazy) {
      exportLayoutCode += `\n  ${layoutName}: () => import("${importPath}"),`;
    } else {
      const importKey = `${layoutName.charAt(0).toUpperCase()}${layoutName.slice(1)}Layout`;
      importCode += `import ${importKey} from "${importPath}";\n`;
      exportLayoutCode += `\n  ${layoutName}: ${importKey},`;
    }
  });

  importCode += '\n';
  exportLayoutCode += '\n};\n';

  let exportCode = `export const pages: Record<LastLevelRouteKey, LazyRouteFunction<CustomRouteObject>> = {`;

  files.forEach((file) => {
    const isLazy = options.lazyImport(file.routeName);

    const key = file.routeName.includes('-')
      ? `"${file.routeName}"`
      : file.routeName;

    if (isLazy) {
      exportCode += `\n  ${key}: () => import("${file.importPath}"),`;
    } else {
      const importKey = getImportKey(file.routeName);
      importCode += `import ${importKey} from "${file.importPath}";\n`;

      exportCode += `\n  ${key}${key === importKey ? '' : `: ${importKey}`},`;
    }
  });

  exportCode += '\n};\n';

  return `${preCode}\n\n${importCode}${exportLayoutCode}\n${exportCode}`;
}

function getImportKey(name: string) {
  const NUM_REG = /^\d+$/;
  const SHORT_WITH_NUM_OR_CHAR_REG = /-[0-9|a-z]/gi;

  let key = name;

  if (NUM_REG.test(name)) {
    key = `_${name}`;
  }

  key = key.replaceAll(SHORT_WITH_NUM_OR_CHAR_REG, (match) => {
    let remain = match.replace('-', '').toUpperCase();
    if (NUM_REG.test(remain)) {
      remain = `_${remain}`;
    }
    return remain;
  });

  return key;
}

export async function genImportsFile(
  files: ElegantRouterFile[],
  options: ElegantReactRouterOption,
) {
  if (files.length === 0) return;

  const importsPath = path.posix.join(options.cwd, options.importsDir);

  await ensureFile(importsPath);

  const code = getImportsCode(files, options);

  await writeFile(importsPath, code);
}

export function getLayoutFile(options: ElegantReactRouterOption) {
  const { alias, layouts } = options;

  const layoutKeys = Object.keys(layouts);

  const files: {
    importPath: string;
    layoutName: string;
  }[] = layoutKeys
    .map((key) => {
      const layoutPath = layouts[key];
      if (!layoutPath) return null;

      let importPath = layoutPath;

      for (const [a, dir] of Object.entries(alias)) {
        if (importPath.startsWith(dir)) {
          importPath = importPath.replace(dir, a);
          break;
        }
      }

      return {
        importPath,
        layoutName: key,
      };
    })
    .filter(
      (item): item is { importPath: string; layoutName: string } =>
        item !== null,
    );

  return files;
}
