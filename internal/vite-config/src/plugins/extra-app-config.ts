/**
 * @description Vite插件：应用配置文件处理
 *
 * 主要功能：
 * 1. 将应用配置抽离成独立的JS文件（_app.config.js）
 * 2. 在构建时将配置文件注入到项目中
 * 3. 配置内容会被注入到全局变量 window._XPRESS_ADMIN_PRO_APP_CONF_ 中
 * 4. 通过 Object.freeze 确保配置不被运行时修改
 *
 * 工作流程：
 * 1. 仅在生产构建（isBuild=true）时生效
 * 2. 读取环境配置和package.json中的版本信息
 * 3. 生成带有版本号和内容哈希的配置文件
 * 4. 将配置文件的script标签注入到HTML中
 *
 * 使用场景：
 * - 需要在不同环境使用不同配置
 * - 配置需要在运行时动态加载
 * - 需要对配置进行版本控制和缓存管理
 */

import type { PluginOption } from 'vite';

import {
  colors,
  generatorContentHash,
  readPackageJSON,
} from '@xpress/node-utils';

import { loadEnv } from '../utils/env';

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
      publicPath = ensureTrailingSlash(config.base);
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
      const hash = `v=${version}-${generatorContentHash(source, 8)}`;

      const appConfigSrc = `${publicPath}${GLOBAL_CONFIG_FILE_NAME}?${hash}`;

      return {
        html,
        tags: [{ attrs: { src: appConfigSrc }, tag: 'script' }],
      };
    },
  };
}

async function getConfigSource() {
  const config = await loadEnv();
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

function ensureTrailingSlash(path: string) {
  return path.endsWith('/') ? path : `${path}/`;
}

export { viteExtraAppConfigPlugin };
