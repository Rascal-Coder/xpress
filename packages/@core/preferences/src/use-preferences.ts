import { diff } from '@xpress-core/shared/utils';

import { useMemo } from 'react';

import { preferencesManager } from './preferences';
import { isDarkTheme } from './update-css-variables';

function usePreferences() {
  const preferences = preferencesManager.getPreferences();
  const initialPreferences = preferencesManager.getInitialPreferences();
  /**
   * @zh_CN 计算偏好设置的变化
   */
  const diffPreference = useMemo(() => {
    return diff(initialPreferences, preferences);
  }, [initialPreferences, preferences]);

  const appPreferences = useMemo(() => preferences.app, [preferences]);

  const shortcutKeysPreferences = useMemo(
    () => preferences.shortcutKeys,
    [preferences],
  );

  /**
   * @zh_CN 判断是否为暗黑模式
   * @param  preferences - 当前偏好设置对象，它的主题值将被用来判断是否为暗黑模式。
   * @returns 如果主题为暗黑模式，返回 true，否则返回 false。
   */
  const isDark = useMemo(() => {
    return isDarkTheme(preferences.theme.mode);
  }, [preferences]);

  const locale = useMemo(() => {
    return preferences.app.locale;
  }, [preferences]);

  const isMobile = useMemo(() => {
    return appPreferences.isMobile;
  }, [appPreferences]);

  const theme = useMemo(() => {
    return isDark ? 'dark' : 'light';
  }, [isDark]);

  /**
   * @zh_CN 布局方式
   */
  const layout = useMemo(() => {
    return isMobile ? 'sidebar-nav' : appPreferences.layout;
  }, [isMobile, appPreferences]);

  /**
   * @zh_CN 是否显示顶栏
   */
  const isShowHeaderNav = useMemo(() => {
    return preferences.header.enable;
  }, [preferences]);

  /**
   * @zh_CN 是否全屏显示content，不需要侧边、底部、顶部、tab区域
   */
  const isFullContent = useMemo(() => {
    return appPreferences.layout === 'full-content';
  }, [appPreferences]);

  /**
   * @zh_CN 是否侧边导航模式
   */
  const isSideNav = useMemo(() => {
    return appPreferences.layout === 'sidebar-nav';
  }, [appPreferences]);

  /**
   * @zh_CN 是否侧边混合模式
   */
  const isSideMixedNav = useMemo(() => {
    return appPreferences.layout === 'sidebar-mixed-nav';
  }, [appPreferences]);

  /**
   * @zh_CN 是否为头部导航模式
   */
  const isHeaderNav = useMemo(() => {
    return appPreferences.layout === 'header-nav';
  }, [appPreferences]);

  const isHeaderMixedNav = useMemo(() => {
    return appPreferences.layout === 'header-mixed-nav';
  }, [appPreferences]);
  /**
   * @zh_CN 是否为混合导航模式
   */
  const isMixedNav = useMemo(() => {
    return appPreferences.layout === 'mixed-nav';
  }, [appPreferences]);

  /**
   * @zh_CN 是否包含侧边导航模式
   */
  const isSideMode = useMemo(() => {
    return isMixedNav || isSideMixedNav || isSideNav;
  }, [isMixedNav, isSideMixedNav, isSideNav]);

  const sidebarCollapsed = useMemo(() => {
    return preferences.sidebar.collapsed;
  }, [preferences]);

  /**
   * @zh_CN 是否开启keep-alive
   * 在tabs可见以及开启keep-alive的情况下才开启
   */
  const keepAlive = useMemo(() => {
    return preferences.tabbar.enable && preferences.tabbar.keepAlive;
  }, [preferences]);

  /**
   * @zh_CN 登录注册页面布局是否为左侧
   */
  const authPanelLeft = useMemo(() => {
    return appPreferences.authPageLayout === 'panel-left';
  }, [appPreferences]);

  /**
   * @zh_CN 登录注册页面布局是否为左侧
   */
  const authPanelRight = useMemo(() => {
    return appPreferences.authPageLayout === 'panel-right';
  }, [appPreferences]);

  /**
   * @zh_CN 登录注册页面布局是否为中间
   */
  const authPanelCenter = useMemo(() => {
    return appPreferences.authPageLayout === 'panel-center';
  }, [appPreferences]);

  /**
   * @zh_CN 内容是否已经最大化
   * 排除 full-content模式
   */
  const contentIsMaximize = useMemo(() => {
    const headerIsHidden = preferences.header.hidden;
    const sidebarIsHidden = preferences.sidebar.hidden;
    return headerIsHidden && sidebarIsHidden && !isFullContent;
  }, [preferences, isFullContent]);

  /**
   * @zh_CN 是否启用全局搜索快捷键
   */
  const globalSearchShortcutKey = useMemo(() => {
    const { enable, globalSearch } = shortcutKeysPreferences;
    return enable && globalSearch;
  }, [shortcutKeysPreferences]);

  /**
   * @zh_CN 是否启用全局注销快捷键
   */
  const globalLogoutShortcutKey = useMemo(() => {
    const { enable, globalLogout } = shortcutKeysPreferences;
    return enable && globalLogout;
  }, [shortcutKeysPreferences]);

  const globalLockScreenShortcutKey = useMemo(() => {
    const { enable, globalLockScreen } = shortcutKeysPreferences;
    return enable && globalLockScreen;
  }, [shortcutKeysPreferences]);

  /**
   * @zh_CN 偏好设置按钮位置
   */
  const preferencesButtonPosition = useMemo(() => {
    const { enablePreferences, preferencesButtonPosition } = preferences.app;

    // 如果没有启用偏好设置按钮
    if (!enablePreferences) {
      return {
        fixed: false,
        header: false,
      };
    }

    const { header, sidebar } = preferences;
    const headerHidden = header.hidden;
    const sidebarHidden = sidebar.hidden;

    const contentIsMaximize = headerHidden && sidebarHidden;

    const isHeaderPosition = preferencesButtonPosition === 'header';

    // 如果设置了固定位置
    if (preferencesButtonPosition !== 'auto') {
      return {
        fixed: preferencesButtonPosition === 'fixed',
        header: isHeaderPosition,
      };
    }

    // 如果是全屏模式或者没有固定在顶部，
    const fixed =
      contentIsMaximize || isFullContent || isMobile || !isShowHeaderNav;

    return {
      fixed,
      header: !fixed,
    };
  }, [preferences, isFullContent, isMobile, isShowHeaderNav]);

  return {
    authPanelCenter,
    authPanelLeft,
    authPanelRight,
    contentIsMaximize,
    diffPreference,
    globalLockScreenShortcutKey,
    globalLogoutShortcutKey,
    globalSearchShortcutKey,
    isDark,
    isFullContent,
    isHeaderMixedNav,
    isHeaderNav,
    isMixedNav,
    isMobile,
    isSideMixedNav,
    isSideMode,
    isSideNav,
    keepAlive,
    layout,
    locale,
    preferencesButtonPosition,
    sidebarCollapsed,
    theme,
  };
}

export { usePreferences };
