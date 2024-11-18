import type { PluginOption } from 'vite';

import type {
  AppcationPluginOptions,
  CommonPluginOptions,
  ConditionPlugin,
  LibraryPluginOptions,
} from '../typing';

import { join } from 'node:path';

import { getPackage } from '@xpress/node-utils';

import react from '@vitejs/plugin-react';
import i18next from 'i18next';
import i18nextHttpBackend from 'i18next-http-backend';
import { visualizer as viteVisualizerPlugin } from 'rollup-plugin-visualizer';
import viteTurboConsolePlugin from 'unplugin-turbo-console/vite';
import viteCompressPlugin from 'vite-plugin-compression';
import viteDtsPlugin from 'vite-plugin-dts';
import { createHtmlPlugin as viteHtmlPlugin } from 'vite-plugin-html';
import { viteMockServe as viteMockPlugin } from 'vite-plugin-mock';

import { viteExtraAppConfigPlugin } from './extra-app-config';
import { viteInjectAppLoadingPlugin } from './inject-app-loading';

/**
 * 获取条件成立的 vite 插件
 * @param conditionPlugins
 */
async function getConditionEstablishedPlugins(
  conditionPlugins: ConditionPlugin[],
) {
  const plugins: PluginOption[] = [];
  for (const conditionPlugin of conditionPlugins) {
    if (conditionPlugin.condition) {
      const realPlugins = await conditionPlugin.plugins();
      plugins.push(...realPlugins);
    }
  }
  return plugins.flat();
}

/**
 * 根据条件获取通用的vite插件
 */
async function getCommonConditionPlugins(
  options: CommonPluginOptions,
): Promise<ConditionPlugin[]> {
  const { isBuild, visualizer } = options;
  return [
    {
      condition: true,
      plugins: () => [
        react({
          babel: {
            plugins: [['@babel/plugin-transform-react-jsx']],
          },
        }),
      ],
    },
    {
      condition: isBuild && !!visualizer,
      plugins: () => [<PluginOption>viteVisualizerPlugin({
          filename: './node_modules/.cache/visualizer/stats.html',
          gzipSize: true,
          open: true,
        })],
    },
  ];
}

/**
 * 根据条件获取应用类型的vite插件
 */
async function getApplicationConditionPlugins(
  options: AppcationPluginOptions,
): Promise<PluginOption[]> {
  // 单独取，否则commonOptions拿不到
  const isBuild = options.isBuild;

  const {
    compress,
    compressTypes,
    extraAppConfig,
    html,
    i18n,
    injectAppLoading,
    mock,
    turboConsole,
    ...commonOptions
  } = options;

  const commonPlugins = await getCommonConditionPlugins(commonOptions);

  return await getConditionEstablishedPlugins([
    ...commonPlugins,
    {
      condition: i18n,
      plugins: async () => {
        const pkg = await getPackage('@vben/locales');
        const include = `${join(pkg?.dir ?? '', isBuild ? 'dist' : 'src', 'langs')}/*.json`;
        return [
          {
            config() {
              i18next.use(i18nextHttpBackend).init({
                backend: {
                  loadPath: include,
                },
              });
            },
            name: 'vite-plugin-i18n',
          },
        ];
      },
    },
    {
      condition: injectAppLoading,
      plugins: async () => [await viteInjectAppLoadingPlugin()],
    },
    {
      condition: isBuild && !!compress,
      plugins: () => {
        const compressPlugins: PluginOption[] = [];
        if (compressTypes?.includes('brotli')) {
          compressPlugins.push(
            viteCompressPlugin({ deleteOriginFile: false, ext: '.br' }),
          );
        }
        if (compressTypes?.includes('gzip')) {
          compressPlugins.push(
            viteCompressPlugin({ deleteOriginFile: false, ext: '.gz' }),
          );
        }
        return compressPlugins;
      },
    },
    {
      condition: !!html,
      plugins: () => [viteHtmlPlugin({ minify: true })],
    },
    {
      condition: isBuild && extraAppConfig,
      plugins: async () => [
        await viteExtraAppConfigPlugin({ isBuild: true, root: process.cwd() }),
      ],
    },
    {
      condition: !isBuild && !!turboConsole,
      plugins: () => [viteTurboConsolePlugin()],
    },
    {
      condition: !!mock,
      plugins: () => [
        viteMockPlugin({
          enable: true,
          ignore: /^_/,
          mockPath: 'mock',
        }),
      ],
    },
  ]);
}

/**
 * 根据条件获取库类型的vite插件
 */
async function getLibraryConditionPlugins(
  options: LibraryPluginOptions,
): Promise<PluginOption[]> {
  // 单独取，否则commonOptions拿不到
  const isBuild = options.isBuild;
  const { dts, ...commonOptions } = options;
  const commonPlugins = await getCommonConditionPlugins(commonOptions);
  return await getConditionEstablishedPlugins([
    ...commonPlugins,
    {
      condition: isBuild && !!dts,
      plugins: () => [viteDtsPlugin({ logLevel: 'error' })],
    },
  ]);
}

export {
  getApplicationConditionPlugins,
  getLibraryConditionPlugins,
  viteCompressPlugin,
  viteDtsPlugin,
  viteHtmlPlugin,
  viteMockPlugin,
  viteTurboConsolePlugin,
  viteVisualizerPlugin,
};
