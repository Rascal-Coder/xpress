import type { ReactNode } from 'react';

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultPreferences } from '../src/config';
import { PreferencesProvider, usePreferences } from '../src/preferences';
import { isDarkTheme } from '../src/update-css-variables';

describe('preferencesProvider', () => {
  // 设置通用的测试包装器
  const wrapper = ({ children }: { children: ReactNode }) => (
    <PreferencesProvider>{children}</PreferencesProvider>
  );

  // 模拟 matchMedia
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches:
          query === '(prefers-color-scheme: dark)' ||
          query === '(max-width: 768px)',
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    );
  });

  // 基础功能测试
  describe('basic Functionality', () => {
    it('should start with defaultPreferences', () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.preferences).toEqual(defaultPreferences);
    });

    it('should initialize with custom preferences', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      await act(async () => {
        await result.current.initPreferences({
          namespace: 'test',
          overrides: {
            app: {
              locale: 'zh-CN',
              name: 'Test App',
            },
          },
        });
      });

      expect(result.current.preferences.app.locale).toBe('zh-CN');
      expect(result.current.preferences.app.name).toBe('Test App');
    });

    it('should handle multiple initializations', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      await act(async () => {
        await result.current.initPreferences({
          namespace: 'test1',
          overrides: { app: { locale: 'en-US' } },
        });
      });

      const firstInitState = result.current.preferences;

      await act(async () => {
        await result.current.initPreferences({
          namespace: 'test2',
          overrides: { app: { locale: 'zh-CN' } },
        });
      });

      expect(result.current.preferences).toEqual(firstInitState);
    });

    it('should reset preferences to default', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      await act(async () => {
        result.current.updatePreferences({
          app: { locale: 'zh-CN' },
          theme: { mode: 'dark' },
        });
      });

      await act(async () => {
        result.current.resetPreferences();
      });

      expect(result.current.preferences).toEqual(defaultPreferences);
    });
  });

  // 主题相关测试
  describe('theme Management', () => {
    it('should update theme mode', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      await act(async () => {
        result.current.updatePreferences({
          theme: { mode: 'dark' },
        });
      });

      expect(result.current.preferences.theme.mode).toBe('dark');
    });

    it('should handle color modes', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      await act(async () => {
        result.current.updatePreferences({
          app: {
            colorGrayMode: true,
            colorWeakMode: true,
          },
        });
      });

      expect(result.current.preferences.app.colorGrayMode).toBe(true);
      expect(result.current.preferences.app.colorWeakMode).toBe(true);
    });
  });

  // 语言设置测试
  describe('language Settings', () => {
    it('should handle language switching', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      await act(async () => {
        result.current.updatePreferences({
          app: { locale: 'en-US' },
        });
      });

      expect(result.current.preferences.app.locale).toBe('en-US');
    });
  });

  // 布局设置测试
  describe('layout Settings', () => {
    it('should handle sidebar preferences', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      await act(async () => {
        result.current.updatePreferences({
          sidebar: {
            collapsed: true,
            width: 200,
          },
        });
      });

      expect(result.current.preferences.sidebar.collapsed).toBe(true);
      expect(result.current.preferences.sidebar.width).toBe(200);
    });

    it('should handle navigation style', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      await act(async () => {
        result.current.updatePreferences({
          navigation: { styleType: 'plain' },
        });
      });

      expect(result.current.preferences.navigation.styleType).toBe('plain');
    });

    it('should handle layout type', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      await act(async () => {
        result.current.updatePreferences({
          app: { layout: 'mixed-nav' },
        });
      });

      expect(result.current.preferences.app.layout).toBe('mixed-nav');
    });
  });

  // 响应式设计测试
  describe('responsive Design', () => {
    it('should handle mobile mode', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      await act(async () => {
        result.current.updatePreferences({
          app: { isMobile: true },
        });
      });

      expect(result.current.preferences.app.isMobile).toBe(true);
    });

    it('should handle content compact mode', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      await act(async () => {
        result.current.updatePreferences({
          app: { contentCompact: 'compact' },
        });
      });

      expect(result.current.preferences.app.contentCompact).toBe('compact');
    });
  });

  // 数据合并测试
  describe('data Merging', () => {
    it('should merge nested preferences correctly', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      await act(async () => {
        result.current.updatePreferences({
          app: { name: 'Test App' },
        });
      });

      expect(result.current.preferences.app.name).toBe('Test App');
      expect(result.current.preferences.app.locale).toBe(
        defaultPreferences.app.locale,
      );
    });
  });
});

// 主题检测功能测试
describe('isDarkTheme', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    );
  });

  it('should return true for dark theme', () => {
    expect(isDarkTheme('dark')).toBe(true);
  });

  it('should return false for light theme', () => {
    expect(isDarkTheme('light')).toBe(false);
  });

  it('should return system preference for auto theme', () => {
    expect(isDarkTheme('auto')).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith(
      '(prefers-color-scheme: dark)',
    );
  });

  it('should handle invalid theme values', () => {
    // @ts-ignore - 测试无效的主题值
    expect(isDarkTheme('invalid')).toBe(false);
  });
});
