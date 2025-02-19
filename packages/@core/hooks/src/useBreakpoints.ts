/* eslint-disable unicorn/no-array-reduce */
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Increase string a value with unit
 *
 * @example '2px' + 1 = '3px'
 * @example '15em' + (-2) = '13em'
 */
function increaseWithUnit(target: number, delta: number): number;
function increaseWithUnit(target: string, delta: number): string;
function increaseWithUnit(
  target: number | string,
  delta: number,
): number | string;
function increaseWithUnit(
  target: number | string,
  delta: number,
): number | string {
  if (typeof target === 'number') return target + delta;
  const value = target.match(/^-?\d+\.?\d*/)?.[0] || '';
  const unit = target.slice(value.length);
  const result = Number.parseFloat(value) + delta;
  if (Number.isNaN(result)) return target;
  return result + unit;
}

export type Breakpoints<K extends string = string> = Record<K, number | string>;

export interface UseBreakpointsOptions {
  strategy?: 'max-width' | 'min-width';
  window?: null | Window;
}

export function useBreakpoints<K extends string>(
  breakpoints: Breakpoints<K>,
  options: UseBreakpointsOptions = {},
) {
  const { strategy = 'min-width' } = options;

  // 处理值和单位
  const getValue = useCallback(
    (k: K, delta?: number) => {
      let v = breakpoints[k];

      if (delta !== undefined) {
        v = increaseWithUnit(v, delta);
      }

      if (typeof v === 'number') {
        v = `${v}px`;
      }

      return v;
    },
    [breakpoints],
  );

  // 生成媒体查询
  const queries = useMemo(() => {
    return Object.keys(breakpoints).reduce(
      (acc, key) => {
        const k = key as K;
        acc[k] =
          strategy === 'min-width'
            ? `(min-width: ${getValue(k)})`
            : `(max-width: ${getValue(k)})`;
        return acc;
      },
      {} as Record<K, string>,
    );
  }, [breakpoints, getValue, strategy]);

  // 存储媒体查询匹配状态
  const [matches, setMatches] = useState<Record<K, boolean>>(() => {
    if (typeof window === 'undefined') {
      return Object.keys(queries).reduce(
        (acc, key) => {
          acc[key as K] = false;
          return acc;
        },
        {} as Record<K, boolean>,
      );
    }

    return Object.keys(queries).reduce(
      (acc, key) => {
        acc[key as K] = window.matchMedia(queries[key as K]).matches;
        return acc;
      },
      {} as Record<K, boolean>,
    );
  });

  // 监听媒体查询变化
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryLists = {} as Record<K, MediaQueryList>;
    const handlers = {} as Record<K, (e: MediaQueryListEvent) => void>;

    Object.keys(queries).forEach((key) => {
      const k = key as K;
      mediaQueryLists[k] = window.matchMedia(queries[k]);
      handlers[k] = (e: MediaQueryListEvent) => {
        setMatches((prev) => ({
          ...prev,
          [k]: e.matches,
        }));
      };

      if ('addEventListener' in mediaQueryLists[k]) {
        mediaQueryLists[k].addEventListener('change', handlers[k]);
      } else {
        // @ts-expect-error 兼容旧版 API
        mediaQueryLists[k].addListener(handlers[k]);
      }
    });

    // 清理函数
    return () => {
      Object.keys(queries).forEach((key) => {
        const k = key as K;
        if ('removeEventListener' in mediaQueryLists[k]) {
          mediaQueryLists[k].removeEventListener('change', handlers[k]);
        } else {
          // @ts-expect-error 兼容旧版 API
          mediaQueryLists[k].removeListener(handlers[k]);
        }
      });
    };
  }, [queries]);

  // 计算当前匹配的断点
  const current = useMemo(() => {
    return Object.keys(breakpoints)
      .filter((key) => matches[key as K])
      .map((key) => key);
  }, [breakpoints, matches]);

  // 计算最大激活断点
  const active = useMemo(() => {
    return current.length === 0 ? '' : current[current.length - 1];
  }, [current]);

  // 工具函数
  const match = (query: string): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  };

  return {
    ...matches,
    active,
    between: (min: K, max: K) =>
      match(
        `(min-width: ${getValue(min)}) and (max-width: ${getValue(max, -0.1)})`,
      ),
    current,
    greater: (k: K) => match(`(min-width: ${getValue(k, 0.1)})`),
    greaterOrEqual: (k: K) => match(`(min-width: ${getValue(k)})`),
    isGreater: (k: K) => match(`(min-width: ${getValue(k, 0.1)})`),
    isGreaterOrEqual: (k: K) => match(`(min-width: ${getValue(k)})`),
    isInBetween: (min: K, max: K) =>
      match(
        `(min-width: ${getValue(min)}) and (max-width: ${getValue(max, -0.1)})`,
      ),
    isSmaller: (k: K) => match(`(max-width: ${getValue(k, -0.1)})`),
    isSmallerOrEqual: (k: K) => match(`(max-width: ${getValue(k)})`),
    smaller: (k: K) => match(`(max-width: ${getValue(k, -0.1)})`),
    smallerOrEqual: (k: K) => match(`(max-width: ${getValue(k)})`),
  };
}

export type UseBreakpointsReturn<K extends string = string> = {
  active: string;
  between: (min: K, max: K) => boolean;
  current: string[];
  greater: (k: K) => boolean;
  greaterOrEqual: (k: K) => boolean;
  isGreater: (k: K) => boolean;
  isGreaterOrEqual: (k: K) => boolean;
  isInBetween: (min: K, max: K) => boolean;
  isSmaller: (k: K) => boolean;
  isSmallerOrEqual: (k: K) => boolean;
  smaller: (k: K) => boolean;
  smallerOrEqual: (k: K) => boolean;
} & Record<K, boolean>;
/**
 * Breakpoints from Tailwind V2
 *
 * @see https://tailwindcss.com/docs/breakpoints
 */
export const breakpointsTailwind = {
  '2xl': 1536,
  lg: 1024,
  md: 768,
  sm: 640,
  xl: 1280,
};
