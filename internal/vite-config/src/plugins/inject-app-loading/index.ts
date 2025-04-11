import type { PluginOption } from 'vite';

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readPackageJSON } from '@xpress/node-utils';

/**
 * 用于生成将loading样式注入到项目中
 * 为多app提供loading样式，无需在每个 app -> index.html单独引入
 */
async function viteInjectAppLoadingPlugin(
  isBuild: boolean,
  env: Record<string, any> = {},
  loadingTemplate = 'loading.html',
): Promise<PluginOption | undefined> {
  const loadingHtml = await getLoadingRawByHtmlTemplate(loadingTemplate);
  const { version } = await readPackageJSON(process.cwd());
  const envRaw = isBuild ? 'prod' : 'dev';
  const cacheName = `'${env.VITE_APP_NAMESPACE}-${version}-${envRaw}-preferences-theme'`;

  const injectScript = `
  <script data-app-loading="inject-js">
    (function() {
      var theme = localStorage.getItem(${cacheName});
      document.documentElement.classList.toggle('dark', /dark/.test(theme));

      // 等待CSS变量设置完成后显示loading
      function showLoading() {
        var loading = document.querySelector('#__app-loading__');
        if (loading) {
          var style = getComputedStyle(document.documentElement);
          if (style.getPropertyValue('--primary')) {
            loading.style.visibility = 'visible';
          } else {
            requestAnimationFrame(showLoading);
          }
        }
      }
      requestAnimationFrame(showLoading);
    })();
  </script>
`;

  // 修改loading的初始样式，默认隐藏
  const modifiedLoadingHtml = loadingHtml.replace(
    'class="loading"',
    'class="loading" style="visibility: hidden;"',
  );

  if (!loadingHtml) {
    return;
  }

  return {
    enforce: 'pre',
    name: 'vite:inject-app-loading',
    transformIndexHtml: {
      handler(html) {
        const re = /<body\s*>/;
        return html.replace(re, `<body>${injectScript}${modifiedLoadingHtml}`);
      },
      order: 'pre',
    },
  };
}

/**
 * 用于获取loading的html模板
 */
async function getLoadingRawByHtmlTemplate(loadingTemplate: string) {
  // 支持在app内自定义loading模板，模版参考default-loading.html即可
  let appLoadingPath = join(process.cwd(), loadingTemplate);

  if (!fs.existsSync(appLoadingPath)) {
    const __dirname = fileURLToPath(new URL('.', import.meta.url));
    appLoadingPath = join(__dirname, './default-loading.html');
  }

  return await fsp.readFile(appLoadingPath, 'utf8');
}

export { viteInjectAppLoadingPlugin };
