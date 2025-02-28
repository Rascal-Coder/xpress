import type {
  BaseXpressLayoutProps,
  LayoutType,
  UseLayoutResult,
} from '@xpress-core/typings';

import { useMemo } from 'react';

/**
 * 布局hook
 * @param {BaseXpressLayoutProps} props - 布局属性
 * @returns {UseLayoutResult} 布局结果
 */
export const useLayout = ({
  isMobile,
  layout,
}: BaseXpressLayoutProps): UseLayoutResult => {
  const currentLayout = useMemo<LayoutType>(
    () => (isMobile ? 'sidebar-nav' : (layout as LayoutType)),
    [isMobile, layout],
  );

  const layoutStates = useMemo(
    () => ({
      isFullContent: currentLayout === 'full-content',
      isHeaderMixedNav: currentLayout === 'header-mixed-nav',
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
