import type { ElegantRouterOption } from '../core';
import type { ElegantReactRouterOption } from '../types';

/**
 * create the plugin options
 *
 * @param options the plugin options
 */
export function createPluginOptions(
  erOptions: ElegantRouterOption,
  options?: Partial<ElegantReactRouterOption>,
) {
  const DTS_DIR = 'src/types/elegant-router.d.ts';
  const IMPORT_DIR = 'src/router/elegant/imports.ts';
  const CONST_DIR = 'src/router/elegant/routes.ts';
  const ROUTE_INFO_FILENAME = 'config.ts';
  const TRANSFORM_DIR = 'src/router/elegant/transform.ts';
  const CUSTOM_ROUTES_MAP: Record<string, string> = {
    'not-found': '*',
    root: '/',
  };
  const DEFAULT_LAYOUTS: Record<string, string> = {
    base: 'src/layouts/base-layout/index.tsx',
    blank: 'src/layouts/blank-layout/index.tsx',
  };

  const opts: ElegantReactRouterOption = {
    constDir: CONST_DIR,
    customRoutes: {
      map: {},
      names: [],
    },
    defaultLayout: 'base',
    dtsDir: DTS_DIR,
    importsDir: IMPORT_DIR,
    layoutLazyImport: (_name) => true,
    layouts: DEFAULT_LAYOUTS,
    lazyImport: (_name) => true,
    onRouteMetaGen: (name) => ({
      title: name,
    }),
    routeInfoByFile: true,
    routeInfoFileName: ROUTE_INFO_FILENAME,
    transformDir: TRANSFORM_DIR,
    ...erOptions,
    ...options,
  };

  opts.customRoutes.map = {
    ...CUSTOM_ROUTES_MAP,
    ...opts.customRoutes.map,
  };

  if (!opts.layouts[opts.defaultLayout]) {
    opts.defaultLayout = Object.keys(opts.layouts)[0] || 'base';
  }

  return opts;
}
