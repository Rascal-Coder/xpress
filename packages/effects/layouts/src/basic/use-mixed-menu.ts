import type { MenuRecordRaw } from '@xpress-core/typings';

import { useAccessStore } from '@xpress/stores';
import { usePreferencesContext } from '@xpress-core/preferences';
import { type Router, useRouter } from '@xpress-core/router';

import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useMixedMenu(router: Router, mode?: 'horizontal' | 'vertical') {
  const navigate = useNavigate();
  const rootMenuPath = useRef<string>('');
  // const mixedRootMenuPath = useRef<string>('');
  // const mixExtraMenus = useRef<MenuRecordRaw[]>([]);
  /** 记录当前顶级菜单下哪个子菜单最后激活 */
  const defaultSubMap = new Map<string, string>();
  const { curRoute } = useRouter(router);
  const { preferences, isMixedNav, isHeaderMixedNav } = usePreferencesContext();
  const [splitSideMenus, setSplitSideMenus] = useState<MenuRecordRaw[]>([]);
  const needSplit = useMemo(() => {
    return (preferences.navigation.split && isMixedNav) || isHeaderMixedNav;
  }, [isHeaderMixedNav, isMixedNav, preferences.navigation.split]);

  const sidebarVisible = useMemo(() => {
    const enableSidebar = preferences.sidebar.enable;
    if (needSplit) {
      return enableSidebar && splitSideMenus.length > 0;
    }
    return enableSidebar;
  }, [needSplit, preferences.sidebar.enable, splitSideMenus.length]);

  const menus = useAccessStore((state) => state.accessMenus);

  /**
   * 头部菜单
   */
  const headerMenus = useMemo(() => {
    if (!needSplit) {
      return menus;
    }
    return menus.map((item) => {
      return {
        ...item,
        children: [],
      };
    });
  }, [menus, needSplit]);

  /**
   * 侧边菜单
   */
  const sidebarMenus = useMemo(() => {
    return needSplit ? splitSideMenus : menus;
  }, [menus, needSplit, splitSideMenus]);

  const mixHeaderMenus = useMemo(() => {
    return isHeaderMixedNav ? sidebarMenus : headerMenus;
  }, [isHeaderMixedNav, sidebarMenus, headerMenus]);
  /**
   * 侧边菜单激活路径
   */
  const sidebarActive = useMemo(() => {
    return (curRoute?.meta?.activePath as string) ?? curRoute?.path;
  }, [curRoute]);

  /**
   * 头部菜单激活路径
   */
  const headerActive = useMemo(() => {
    if (!needSplit) {
      return curRoute?.path;
    }
    return rootMenuPath.current;
  }, [curRoute, needSplit]);

  /**
   * 菜单点击事件处理
   * @param path 菜单路径
   * @param mode 菜单模式
   */
  const handleMenuSelect = (path: string) => {
    if (!needSplit || mode === 'vertical') {
      navigate(path);
      return;
    }

    const rootMenu = menus.find((item) => item.path === path);
    rootMenuPath.current = rootMenu?.path ?? '';
    setSplitSideMenus(rootMenu?.children ?? []);
    if (splitSideMenus.length === 0) {
      navigate(path);
    } else if (rootMenu && preferences.sidebar.autoActivateChild) {
      navigate(
        defaultSubMap.has(rootMenu.path)
          ? (defaultSubMap.get(rootMenu.path) as string)
          : rootMenu.path,
      );
    }
  };

  /**
   * 侧边菜单展开事件
   * @param key 路由路径
   * @param parentsPath 父级路径
   */
  const handleMenuOpen = (key: string, parentsPath: string[]) => {
    if (parentsPath.length <= 1 && preferences.sidebar.autoActivateChild) {
      navigate(
        defaultSubMap.has(key) ? (defaultSubMap.get(key) as string) : key,
      );
    }
  };
  return {
    sidebarVisible,
    headerMenus,
    sidebarMenus,
    sidebarActive,
    headerActive,
    mixHeaderMenus,
    handleMenuSelect,
    handleMenuOpen,
  };
}
