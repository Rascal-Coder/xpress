import type { ReactNode } from 'react';

import type { SupportedLanguagesType } from '../src/types';

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultPreferences } from '../src/config';
import { PreferencesProvider, usePreferencesContext } from '../src/Preferences';

const mockOptions = {
  namespace: 'test',
  overrides: {
    app: {
      locale: 'zh-CN' as SupportedLanguagesType,
    },
  },
};

describe('preferencesProvider', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <PreferencesProvider options={mockOptions}>{children}</PreferencesProvider>
  );

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

  it('should initialize with merged preferences', () => {
    const { result } = renderHook(() => usePreferencesContext(), { wrapper });

    expect(result.current.preferences.app.locale).toBe('zh-CN');
    expect(result.current.preferences).toEqual(
      expect.objectContaining({
        ...defaultPreferences,
        app: {
          ...defaultPreferences.app,
          locale: 'zh-CN',
        },
      }),
    );
  });

  it('should update preferences correctly', () => {
    const { result } = renderHook(() => usePreferencesContext(), { wrapper });

    act(() => {
      result.current.updatePreferences({
        theme: { mode: 'dark' },
      });
    });

    expect(result.current.preferences.theme.mode).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('should reset preferences to default', () => {
    const { result } = renderHook(() => usePreferencesContext(), { wrapper });

    act(() => {
      result.current.updatePreferences({
        theme: { mode: 'dark' },
      });
    });

    act(() => {
      result.current.resetPreferences();
    });

    expect(result.current.preferences).toEqual(defaultPreferences);
  });

  it('should handle mobile layout correctly', async () => {
    const { result } = renderHook(() => usePreferencesContext(), { wrapper });

    // 等待状态更新
    await act(async () => {
      // 触发一次更新
      result.current.updatePreferences({
        app: { isMobile: true },
      });
    });

    expect(result.current.isMobile).toBe(true);
    expect(result.current.layout).toBe('sidebar-nav');
  });

  it('should handle theme auto mode', () => {
    const { result } = renderHook(() => usePreferencesContext(), { wrapper });

    act(() => {
      result.current.updatePreferences({
        theme: { mode: 'auto' },
      });
    });

    expect(result.current.preferences.theme.mode).toBe('dark');
  });
});
