import type {
  LayoutType,
  UseLayoutResult,
  XpressLayoutProps,
} from '../typings';

import { useMemo } from 'react';

export function useLayout({
  isMobile,
  layout,
}: XpressLayoutProps): UseLayoutResult {
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
}
