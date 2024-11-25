import type {
  LayoutType,
  UseLayoutResult,
  XpressLayoutProps,
} from '../typings';

import { useDebounceFn } from 'ahooks';
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { useCssVar } from './useCssVar';

export interface VisibleDomRect {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}
/**
 * 获取元素可见信息
 * @param element
 */
export function getElementVisibleRect(
  element?: HTMLElement | null | undefined,
): VisibleDomRect {
  if (!element) {
    return {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    };
  }
  const rect = element.getBoundingClientRect();
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight,
  );

  const top = Math.max(rect.top, 0);
  const bottom = Math.min(rect.bottom, viewHeight);

  const viewWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth,
  );

  const left = Math.max(rect.left, 0);
  const right = Math.min(rect.right, viewWidth);

  return {
    bottom,
    height: Math.max(0, bottom - top),
    left,
    right,
    top,
    width: Math.max(0, right - left),
  };
}
/** layout header 组件的高度 */
const CSS_VARIABLE_LAYOUT_HEADER_HEIGHT = '--xpress-header-height';
/** layout footer 组件的高度 */
const CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT = '--xpress-footer-height';
/** layout content 组件的高度 */
const CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT = '--xpress-content-height';
/** layout content 组件的宽度 */
const CSS_VARIABLE_LAYOUT_CONTENT_WIDTH = '--xpress-content-width';

/**
 * @zh_CN 默认命名空间
 */
// const DEFAULT_NAMESPACE = 'xpress';

/**
 * 头部样式hook
 */
export function useLayoutHeaderStyle() {
  const [headerHeight, setHeaderHeight] = useCssVar(
    CSS_VARIABLE_LAYOUT_HEADER_HEIGHT,
  );

  const getLayoutHeaderHeight = useCallback(() => {
    return Number.parseInt(headerHeight, 10);
  }, [headerHeight]);

  const setLayoutHeaderHeight = useCallback(
    (height: number) => {
      setHeaderHeight(`${height}px`);
    },
    [setHeaderHeight],
  );

  return {
    getLayoutHeaderHeight,
    setLayoutHeaderHeight,
  };
}

/**
 * 页脚样式hook
 */
export function useLayoutFooterStyle() {
  const [footerHeight, setFooterHeight] = useCssVar(
    CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT,
  );

  const getLayoutFooterHeight = useCallback(() => {
    return Number.parseInt(footerHeight, 10);
  }, [footerHeight]);

  const setLayoutFooterHeight = useCallback(
    (height: number) => {
      setFooterHeight(`${height}px`);
    },
    [setFooterHeight],
  );

  return {
    getLayoutFooterHeight,
    setLayoutFooterHeight,
  };
}

/**
 * 布局hook
 * @param {XpressLayoutProps} props - 布局属性
 * @returns {UseLayoutResult} 布局结果
 */
export const useLayout = ({
  isMobile,
  layout,
}: XpressLayoutProps): UseLayoutResult => {
  const currentLayout = useMemo<LayoutType>(
    () => (isMobile ? 'sidebar-nav' : (layout as LayoutType)),
    [isMobile, layout],
  );

  const layoutStates = useMemo(
    () => ({
      isFullContent: currentLayout === 'full-content',
      isHeaderNav: currentLayout === 'header-nav',
      isMixedNav: currentLayout === 'mixed-nav',
      isSidebarMixedNav: currentLayout === 'sidebar-mixed-nav',
    }),
    [currentLayout],
  );

  return {
    currentLayout,
    ...layoutStates,
  };
};

export function useLayoutContentStyle() {
  const resizeObserverRef = useRef<null | ResizeObserver>(null);
  const contentElementRef = useRef<HTMLDivElement | null>(null);
  const visibleDomRectRef = useRef<null | VisibleDomRect>(null);

  const [_contentHeight, setContentHeight] = useCssVar(
    CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT,
    contentElementRef.current,
  );
  const [_contentWidth, setContentWidth] = useCssVar(
    CSS_VARIABLE_LAYOUT_CONTENT_WIDTH,
    contentElementRef.current,
  );

  const overlayStyle = useMemo((): CSSProperties => {
    const { height, left, top, width } = visibleDomRectRef.current ?? {};
    return {
      height: height ? `${height}px` : undefined,
      left: left ? `${left}px` : undefined,
      position: 'fixed',
      top: top ? `${top}px` : undefined,
      width: width ? `${width}px` : undefined,
      zIndex: 150,
    };
  }, []);

  const { run: debouncedCalcHeight } = useDebounceFn(
    (_entries: ResizeObserverEntry[]) => {
      if (contentElementRef.current) {
        visibleDomRectRef.current = getElementVisibleRect(
          contentElementRef.current,
        );

        if (visibleDomRectRef.current) {
          setContentHeight(`${visibleDomRectRef.current.height}px`);
          setContentWidth(`${visibleDomRectRef.current.width}px`);
        }
      }
    },
    { wait: 16 },
  );

  useEffect(() => {
    if (contentElementRef.current && !resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(debouncedCalcHeight);
      resizeObserverRef.current.observe(contentElementRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [debouncedCalcHeight]);

  return {
    contentElementRef,
    overlayStyle,
    visibleDomRect: visibleDomRectRef.current,
  };
}
