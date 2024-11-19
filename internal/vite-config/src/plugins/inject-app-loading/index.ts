import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readPackageJSON } from '@xpress/node-utils';

import { type PluginOption } from 'vite';

/**
 * Vite插件：注入应用加载动画
 * 该插件用于在应用启动时显示loading动画，主要功能：
 * 1. 支持自定义loading模板
 * 2. 自动适配深色模式
 * 3. 统一管理多个应用的loading样式，避免重复配置
 *
 * @param isBuild - 是否为生产环境构建
 * @param env - 环境变量配置对象
 * @param loadingTemplate - loading模板文件名，默认为'loading.html'
 * @returns Vite插件配置
 */
async function viteInjectAppLoadingPlugin(
  isBuild: boolean,
  env: Record<string, any> = {},
  loadingTemplate = 'loading.html',
): Promise<PluginOption | undefined> {
  // 获取loading模板的HTML内容
  const loadingHtml = await getLoadingRawByHtmlTemplate(loadingTemplate);

  // 读取项目package.json中的版本号
  const { version } = await readPackageJSON(process.cwd());

  // 根据环境确定缓存标识
  const envRaw = isBuild ? 'prod' : 'dev';

  // 构建主题缓存的key，格式：{命名空间}-{版本}-{环境}-preferences-theme
  const cacheName = `'${env.VITE_APP_NAMESPACE}-${version}-${envRaw}-preferences-theme'`;

  /**
   * 注入的主题检测脚本
   * 该脚本会在页面加载时立即执行，用于：
   * 1. 从localStorage读取已保存的主题设置
   * 2. 根据主题设置动态切换loading页面的暗色模式
   */
  const injectScript = `
  <script data-app-loading="inject-js">
  var theme = localStorage.getItem(${cacheName});
  document.documentElement.classList.toggle('dark', /dark/.test(theme));
</script>
`;

  // 如果没有获取到loading模板，则不注册插件
  if (!loadingHtml) {
    return;
  }

  // 返回Vite插件配置
  return {
    enforce: 'pre', // 确保在其他插件之前执行
    name: 'vite:inject-app-loading',
    transformIndexHtml: {
      handler(html) {
        // 在body标签后注入loading内容和主题检测脚本
        const re = /<body\s*>/;
        html = html.replace(re, `<body>${injectScript}${loadingHtml}`);
        return html;
      },
      order: 'pre', // HTML转换的优先级
    },
  };
}

/**
 * 获取loading模板的HTML内容
 * 查找顺序：
 * 1. 首先查找项目根目录下的自定义模板
 * 2. 如果未找到，则使用插件默认提供的模板
 *
 * @param loadingTemplate - loading模板文件名
 * @returns Promise<string> 返回模板的HTML内容
 */
async function getLoadingRawByHtmlTemplate(loadingTemplate: string) {
  // 首先尝试在项目根目录查找自定义的loading模板
  let appLoadingPath = join(process.cwd(), loadingTemplate);
  console.log('appLoadingPath', appLoadingPath);

  // 如果项目根目录没有自定义模板，则使用插件默认的模板
  if (!fs.existsSync(appLoadingPath)) {
    // 获取当前文件所在目录
    const __dirname = fileURLToPath(new URL('.', import.meta.url));
    // 使用默认的loading模板
    appLoadingPath = join(__dirname, './default-loading.html');
  }

  // 读取并返回模板内容
  return await fsp.readFile(appLoadingPath, 'utf8');
}

export { viteInjectAppLoadingPlugin };
