import type { UserConfig } from 'vite';

import type { DefineAppcationOptions } from '../typing';

import { resolve } from 'node:path';

import { defineConfig, mergeConfig } from 'vite';

import { getApplicationConditionPlugins } from '../plugins';
import { getCommonConfig } from './common';

function defineApplicationConfig(options: DefineAppcationOptions = {}) {
  return defineConfig(async ({ command, mode }) => {
    const { appcation = {}, vite = {} } = options;
    const root = process.cwd();
    const isBuild = command === 'build';
    // const env = loadEnv(mode, root);

    const plugins = await getApplicationConditionPlugins({
      compress: false,
      compressTypes: ['brotli', 'gzip'],
      devtools: true,
      extraAppConfig: true,
      html: true,
      i18n: true,
      injectAppLoading: true,
      isBuild,
      mock: true,
      mode,
      turboConsole: false,
      ...appcation,
    });

    const applicationConfig: UserConfig = {
      // },
      build: {
        rollupOptions: {
          output: {
            assetFileNames: '[ext]/[name]-[hash].[ext]',
            chunkFileNames: 'js/[name]-[hash].mjs',
            entryFileNames: 'jse/index-[name]-[hash].mjs',
          },
        },
        target: 'es2015',
      },
      //     },
      esbuild: {
        drop: isBuild
          ? [
              // 'console',
              'debugger',
            ]
          : [],
        legalComments: 'none',
      },
      plugins,
      resolve: {
        alias: [
          {
            find: /@\//,
            replacement: `${resolve(root, '.', 'src')}/`,
          },
        ],
      },
      server: {
        host: true,
        warmup: {
          // 预热文件
          clientFiles: ['./index.html', './src/{views}/*'],
        },
      },
    };

    const mergedConfig = mergeConfig(
      await getCommonConfig(),
      applicationConfig,
    );
    return mergeConfig(mergedConfig, vite);
  });
}

export { defineApplicationConfig };
