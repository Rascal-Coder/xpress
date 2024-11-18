import {
  colors,
  generatorContentHash,
  readPackageJSON,
} from '@xpress/node-utils';

import { type PluginOption } from 'vite';

import { getEnvConfig } from '../utils/env';

interface PluginOptions {
  isBuild: boolean;
  root: string;
}

const GLOBAL_CONFIG_FILE_NAME = '_app.config.js';
const XPRESS_ADMIN_PRO_APP_CONF = '_XPRESS_ADMIN_PRO_APP_CONF_';

/**
 * 用于将配置文件抽离出来并注入到项目中
 * @returns
 */

async function viteExtraAppConfigPlugin({
  isBuild,
  root,
}: PluginOptions): Promise<PluginOption | undefined> {
  let publicPath: string;
  let source: string;

  if (!isBuild) {
    return;
  }

  const { version = '' } = await readPackageJSON(root);

  return {
    async configResolved(config) {
      publicPath = config.base;
      source = await getConfigSource();
    },
    async generateBundle() {
      try {
        this.emitFile({
          fileName: GLOBAL_CONFIG_FILE_NAME,
          source,
          type: 'asset',
        });

        console.log(colors.cyan(`✨configuration file is build successfully!`));
      } catch (error) {
        console.log(
          colors.red(
            `configuration file configuration file failed to package:\n${error}`,
          ),
        );
      }
    },
    name: 'vite:extra-app-config',
    async transformIndexHtml(html) {
      publicPath = publicPath.endsWith('/') ? publicPath : `${publicPath}/`;
      const hash = `v=${version}-${generatorContentHash(source, 8)}`;

      const appConfigSrc = `${publicPath}${GLOBAL_CONFIG_FILE_NAME}?${hash}`;

      return {
        html,
        tags: [
          {
            attrs: {
              src: appConfigSrc,
            },
            tag: 'script',
          },
        ],
      };
    },
  };
}

async function getConfigSource() {
  const config = await getEnvConfig();
  const windowVariable = `window.${XPRESS_ADMIN_PRO_APP_CONF}`;
  // 确保变量不会被修改
  let source = `${windowVariable}=${JSON.stringify(config)};`;
  source += `
    Object.freeze(${windowVariable});
    Object.defineProperty(window, "${XPRESS_ADMIN_PRO_APP_CONF}", {
      configurable: false,
      writable: false,
    });
  `.replaceAll(/\s/g, '');
  return source;
}

export { viteExtraAppConfigPlugin };
