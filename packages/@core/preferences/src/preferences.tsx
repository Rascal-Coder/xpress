import type { DeepPartial } from '@xpress-core/typings';

import type { InitialOptions, Preferences } from './types';

import {
  breakpointsTailwind,
  useBreakpoints,
  useMediaQuery,
} from '@xpress-core/hooks';
import { StorageManager } from '@xpress-core/shared/cache';
import { diff, isMacOs, merge } from '@xpress-core/shared/utils';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { defaultPreferences } from './config';
import { isDarkTheme, updateCSSVariables } from './update-css-variables';

const STORAGE_KEY = 'preferences';
const STORAGE_KEY_LOCALE = `${STORAGE_KEY}-locale`;
const STORAGE_KEY_THEME = `${STORAGE_KEY}-theme`;

class PreferenceManager {
  private initialPreferences: Preferences = defaultPreferences;
  private isInitialized: boolean = false;
  private state: Preferences = this.loadPreferences();
  public cache: null | StorageManager = null;

  constructor() {
    this.cache = new StorageManager();
  }

  private initPlatform() {
    const dom = document.documentElement;
    dom.dataset.platform = isMacOs() ? 'macOs' : 'window';
  }

  private loadCachedPreferences() {
    return this.cache?.getItem<Preferences>(STORAGE_KEY);
  }

  private loadPreferences(): Preferences {
    return this.loadCachedPreferences() || { ...defaultPreferences };
  }

  private updateColorMode(preference: Preferences) {
    if (preference.app) {
      const { colorGrayMode, colorWeakMode } = preference.app;
      const dom = document.documentElement;
      const COLOR_WEAK = 'invert-mode';
      const COLOR_GRAY = 'grayscale-mode';

      colorWeakMode
        ? dom.classList.add(COLOR_WEAK)
        : dom.classList.remove(COLOR_WEAK);
      colorGrayMode
        ? dom.classList.add(COLOR_GRAY)
        : dom.classList.remove(COLOR_GRAY);
    }
  }

  public clearCache() {
    [STORAGE_KEY, STORAGE_KEY_LOCALE, STORAGE_KEY_THEME].forEach((key) => {
      this.cache?.removeItem(key);
    });
  }

  public getInitialPreferences() {
    return this.initialPreferences;
  }

  public getPreferences() {
    return this.state;
  }

  public handleUpdates(
    updates: DeepPartial<Preferences>,
    currentState: Preferences,
  ) {
    const themeUpdates = updates.theme || {};
    const appUpdates = updates.app || {};

    if (themeUpdates && Object.keys(themeUpdates).length > 0) {
      updateCSSVariables(currentState);
    }

    if (
      Reflect.has(appUpdates, 'colorGrayMode') ||
      Reflect.has(appUpdates, 'colorWeakMode')
    ) {
      this.updateColorMode(currentState);
    }
  }

  public initPreferences({ namespace, overrides }: InitialOptions) {
    if (this.isInitialized) {
      return this.state;
    }

    this.cache = new StorageManager({ prefix: namespace });
    this.initialPreferences = merge({}, overrides, defaultPreferences);
    const mergedPreference = merge(
      {},
      this.loadCachedPreferences() || {},
      this.initialPreferences,
    );

    this.initPlatform();
    this.isInitialized = true;
    return mergedPreference;
  }

  public savePreferences(preference: Preferences) {
    this.state = preference;
    this.cache?.setItem(STORAGE_KEY, preference);
    this.cache?.setItem(STORAGE_KEY_LOCALE, preference.app.locale);
    this.cache?.setItem(STORAGE_KEY_THEME, preference.theme.mode);
  }
}

// 创建Context
interface PreferencesContextType {
  clearCache: () => void;
  getInitialPreferences: () => Preferences;
  preferences: Preferences;
  resetPreferences: () => void;
  updatePreferences: (updates: DeepPartial<Preferences>) => void;
}

const PreferencesContext = createContext<null | PreferencesContextType>(null);

// Provider组件
interface PreferencesProviderProps {
  children: React.ReactNode;
  options: InitialOptions;
}

export function PreferencesProvider({
  options,
  children,
}: PreferencesProviderProps) {
  const preferenceManager = useRef(new PreferenceManager());
  // 初始化
  const getInitialState = () => {
    const initialPreferences =
      preferenceManager.current.initPreferences(options);
    updateCSSVariables(initialPreferences);
    return initialPreferences;
  };

  const [preferences, setPreferences] = useState<Preferences>(getInitialState);

  const updatePreferences = useCallback((updates: DeepPartial<Preferences>) => {
    setPreferences((prev) => {
      const mergedState = merge({}, updates, prev);
      preferenceManager.current.handleUpdates(updates, mergedState);
      preferenceManager.current.savePreferences(mergedState);
      return mergedState;
    });
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
    preferenceManager.current.savePreferences(defaultPreferences);
    [STORAGE_KEY, STORAGE_KEY_THEME, STORAGE_KEY_LOCALE].forEach(() => {
      preferenceManager.current.clearCache();
    });
  }, []);

  const clearCache = useCallback(() => {
    preferenceManager.current.clearCache();
  }, []);

  const getInitialPreferences = useCallback(() => {
    return defaultPreferences;
  }, []);

  // 监听系统主题变化
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  // 监听移动端断点
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isMobile = breakpoints.smaller('md');

  useEffect(() => {
    if (preferences.theme.mode === 'auto') {
      updatePreferences({
        theme: { mode: prefersDark ? 'dark' : 'light' },
      });
    }
    updatePreferences({
      app: { isMobile },
    });
  }, [isMobile, preferences.theme.mode, prefersDark, updatePreferences]);

  const value = useMemo<PreferencesContextType>(() => {
    return {
      clearCache,
      getInitialPreferences,
      preferences,
      resetPreferences,
      updatePreferences,
    };
  }, [
    clearCache,
    getInitialPreferences,
    preferences,
    resetPreferences,
    updatePreferences,
  ]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

// Hook for using preferences
export function usePreferencesContext() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  // 当前偏好设置
  const preferences = context.preferences;

  // 初始偏好设置
  const initialPreferences = context.getInitialPreferences();
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

  const theme: 'dark' | 'light' = useMemo(() => {
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
    ...context,
  };
}
