/* eslint-disable react-refresh/only-export-components */
import type { DeepPartial } from '@xpress-core/typings';

import type { InitialOptions, Preferences } from './types';

import { StorageManager } from '@xpress-core/shared/cache';
import { isMacOs, merge } from '@xpress-core/shared/utils';

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
import { breakpointsTailwind, useBreakpoints } from './hooks/useBreakpoints';
import { useMediaQuery } from './hooks/useMediaQuery';
import { updateCSSVariables } from './update-css-variables';

const STORAGE_KEY = 'preferences';
const STORAGE_KEY_LOCALE = `${STORAGE_KEY}-locale`;
const STORAGE_KEY_THEME = `${STORAGE_KEY}-theme`;

class PreferenceManager {
  private cache: null | StorageManager = null;
  private initialPreferences: Preferences = defaultPreferences;
  private isInitialized: boolean = false;
  private state: Preferences = this.loadPreferences();

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

  public async initPreferences({ namespace, overrides }: InitialOptions) {
    if (this.isInitialized) {
      return;
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
  initPreferences: (options: InitialOptions) => Promise<void>;
  preferences: Preferences;
  resetPreferences: () => void;
  updatePreferences: (updates: DeepPartial<Preferences>) => void;
}

const PreferencesContext = createContext<null | PreferencesContextType>(null);

// Provider组件
interface PreferencesProviderProps {
  children: React.ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const preferenceManager = useRef(new PreferenceManager());

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

  // 监听系统主题变化
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  useEffect(() => {
    updatePreferences({
      theme: { mode: prefersDark ? 'dark' : 'light' },
    });
  }, [prefersDark, updatePreferences]);

  // 监听移动端断点
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isMobile = breakpoints.smaller('md');
  useEffect(() => {
    updatePreferences({
      app: { isMobile },
    });
  }, [isMobile, updatePreferences]);

  const clearCache = useCallback(() => {
    preferenceManager.current.clearCache();
  }, []);

  const initPreferences = useCallback(async (options: InitialOptions) => {
    const initialPrefs =
      await preferenceManager.current.initPreferences(options);
    if (initialPrefs) {
      setPreferences(initialPrefs);
    }
  }, []);

  const value = useMemo(
    () => ({
      clearCache,
      initPreferences,
      preferences,
      resetPreferences,
      updatePreferences,
    }),
    [
      preferences,
      updatePreferences,
      resetPreferences,
      clearCache,
      initPreferences,
    ],
  );

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
  return context;
}

const preferencesManager = new PreferenceManager();
export { PreferenceManager, preferencesManager };
