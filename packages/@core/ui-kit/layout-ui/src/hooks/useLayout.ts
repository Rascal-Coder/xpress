import type {
  LayoutType,
  UseLayoutResult,
  XpressLayoutProps,
} from '../typings';

import { useCallback, useEffect, useMemo, useState } from 'react';
/** layout header 组件的高度 */
const CSS_VARIABLE_LAYOUT_HEADER_HEIGHT = '--xpress-header-height';
/** layout footer 组件的高度 */
const CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT = '--xpress-footer-height';

/**
 * @zh_CN 默认命名空间
 */
// const DEFAULT_NAMESPACE = 'xpress';
/**
 * CSS变量hook
 */
const useCssVar = (varName: string) => {
  const [value, setValue] = useState('');

  const updateValue = useCallback(
    (newValue: string) => {
      setValue(newValue);
      document.documentElement.style.setProperty(varName, newValue);
    },
    [varName],
  );

  useEffect(() => {
    const initialValue = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    setValue(initialValue || '0px');
  }, [varName]);

  return [value, updateValue] as const;
};

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
