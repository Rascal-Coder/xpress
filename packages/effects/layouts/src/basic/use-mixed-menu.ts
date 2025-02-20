import type { MenuRecordRaw } from '@xpress-core/typings';

import { usePreferencesContext } from '@xpress-core/preferences';

import { useMemo, useState } from 'react';

export function useMixedMenu() {
  const { preferences, isMixedNav, isHeaderMixedNav } = usePreferencesContext();
  const [splitSideMenus] = useState<MenuRecordRaw[]>([]);
  const needSplit = useMemo(() => {
    return (preferences.navigation.split && isMixedNav) || isHeaderMixedNav;
  }, [isHeaderMixedNav, isMixedNav, preferences.navigation.split]);
  const sidebarMenus = useMemo(() => {
    const enableSidebar = preferences.sidebar.enable;
    if (needSplit) {
      return enableSidebar && splitSideMenus.length > 0;
    }
    return enableSidebar;
  }, [needSplit, preferences.sidebar.enable, splitSideMenus.length]);
  return {
    sidebarMenus,
  };
}
