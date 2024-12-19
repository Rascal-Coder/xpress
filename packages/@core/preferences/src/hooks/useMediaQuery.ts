import { useEffect, useState } from 'react';

/**
 * 检查特性是否被支持
 */
function useSupported(callback: () => boolean): boolean {
  return typeof window !== 'undefined' && callback();
}

/**
 * Reactive Media Query hook for React
 * Ported from vue-use-web by Abdelrahman Awad
 *
 * @param query 媒体查询字符串
 * @returns 是否匹配该媒体查询
 */
export function useMediaQuery(query: string): boolean {
  const isSupported = useSupported(
    () =>
      window &&
      'matchMedia' in window &&
      typeof window.matchMedia === 'function',
  );

  const [matches, setMatches] = useState(() => {
    if (!isSupported) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!isSupported) return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 处理新旧版本的 MediaQueryList API
    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // @ts-expect-error 兼容旧版 API
      mediaQuery.addListener(handler);
    }

    // 初始化值
    setMatches(mediaQuery.matches);

    // 清理函数
    return () => {
      if ('removeEventListener' in mediaQuery) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        // @ts-expect-error 兼容旧版 API
        mediaQuery.removeListener(handler);
      }
    };
  }, [query, isSupported]);

  return matches;
}
