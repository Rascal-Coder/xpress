import '@xpress/styles';
import {
  PreferenceManager,
  type Preferences,
  updateCSSVariables,
} from '@xpress-core/preferences';

import { overridesPreferences } from './preferences';

async function initPreferencesAndCSS(
  preferenceManager: PreferenceManager,
  namespace: string,
): Promise<Preferences> {
  return new Promise((resolve) => {
    const initialPreferences = preferenceManager.initPreferences({
      namespace,
      overrides: overridesPreferences,
    });
    updateCSSVariables(initialPreferences);
    resolve(initialPreferences);
  });
}

async function initApplication() {
  const preferenceManager = new PreferenceManager();
  const env = import.meta.env.PROD ? 'prod' : 'dev';
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;

  // 使用新的Promise函数
  const initialPreferences = await initPreferencesAndCSS(
    preferenceManager,
    namespace,
  );

  const { bootstrap } = await import('./bootstrap');
  bootstrap({
    initialPreferences,
    preferenceManager,
  });

  // 移除并销毁loading
  unmountGlobalLoading();
}

initApplication();

// TODO: 移除全局loading需要抽离到@xpress/utils中去
function unmountGlobalLoading() {
  // 查找全局 loading 元素
  const loadingElement = document.querySelector('#__app-loading__');

  if (loadingElement) {
    // 添加隐藏类，触发过渡动画
    loadingElement.classList.add('hidden');

    // 查找所有需要移除的注入 loading 元素
    const injectLoadingElements = document.querySelectorAll(
      '[data-app-loading^="inject"]',
    );

    // 当过渡动画结束时，移除 loading 元素和所有注入的 loading 元素
    loadingElement.addEventListener(
      'transitionend',
      () => {
        loadingElement.remove(); // 移除 loading 元素
        injectLoadingElements.forEach((el) => el.remove()); // 移除所有注入的 loading 元素
      },
      { once: true },
    ); // 确保事件只触发一次
  }
}
