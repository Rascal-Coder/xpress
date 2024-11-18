import type { UserConfig } from 'vite';

import type { DefineApplicationOptions } from '../typing';

import { defineConfig, loadEnv, mergeConfig } from 'vite';

import { defaultImportmapOptions, getDefaultPwaOptions } from '../options';
import { loadApplicationPlugins } from '../plugins';
import { loadAndConvertEnv } from '../utils/env';
import { getCommonConfig } from './common';

function defineApplicationConfig(userConfigPromise?: DefineApplicationOptions) {
  return defineConfig(async (config) => {
    const options = await userConfigPromise?.(config);
    const { appTitle, base, port, ...envConfig } = await loadAndConvertEnv();
    const { command, mode } = config;
    const { application = {}, vite = {} } = options || {};
    const root = process.cwd();
    const isBuild = command === 'build';
    const env = loadEnv(mode, root);

    const plugins = await loadApplicationPlugins({
      archiver: true,
      archiverPluginOptions: {},
      compress: false,
      compressTypes: ['brotli', 'gzip'],
      env,
      extraAppConfig: true,
      html: true,
      importmapOptions: defaultImportmapOptions,
      injectAppLoading: true,
      injectMetadata: true,
      isBuild,
      mode,
      nitroMock: !isBuild,
      nitroMockOptions: {},
      print: !isBuild,
      printInfoMap: {
        Xprees: 'https://github.com/Rascal-Coder/xpress',
      },
      pwa: true,
      pwaOptions: getDefaultPwaOptions(appTitle),
      ...envConfig,
      ...application,
    });

    const applicationConfig: UserConfig = {
      base,
      build: {
        rollupOptions: {
          output: {
            // 设置构建后静态资源文件的命名方式
            assetFileNames: '[ext]/[name]-[hash].[ext]',
            // 设置构建后代码块文件的命名方式
            chunkFileNames: 'js/[name]-[hash].js',
            // 设置构建后入口文件的命名方式
            entryFileNames: 'jse/index-[name]-[hash].js',
          },
        },
        // 设置构建目标为 ES2015
        target: 'es2015',
      },
      esbuild: {
        // 在构建时删除的代码
        drop: isBuild
          ? [
              // 'console', // 注释掉 console 的删除
              'debugger',
            ]
          : [],
        // 移除注释
        legalComments: 'none',
      },
      plugins,
      server: {
        // 允许局域网访问
        host: true,
        port,
        warmup: {
          // 预热文件列表，提升开发服务器首次启动速度
          clientFiles: [],
        },
      },
    };

    const mergedCommonConfig = mergeConfig(
      await getCommonConfig(),
      applicationConfig,
    );
    return mergeConfig(mergedCommonConfig, vite);
  });
}

export { defineApplicationConfig };
