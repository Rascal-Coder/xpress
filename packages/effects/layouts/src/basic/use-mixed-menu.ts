import type { MenuRecordRaw } from '@xpress-core/typings';

import { type Router, useNavigate, useRouter } from '@xpress/router';
import { useAccessStore } from '@xpress/stores';
import { useFindMenu } from '@xpress-core/hooks';
import { usePreferencesContext } from '@xpress-core/preferences';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useMixedMenu(router: Router) {
  const navigate = useNavigate();
  const menus = useAccessStore((state) => state.accessMenus);
  const { findRootMenuByPath } = useFindMenu();
  const { curRoute } = useRouter(router);
  const [splitSideMenus, setSplitSideMenus] = useState<MenuRecordRaw[]>([]);
  const mixedRootMenuPath = useRef<string>('');
  const mixExtraMenus = useRef<MenuRecordRaw[]>([]);
  const [rootMenuPath, setRootMenuPath] = useState<string>('');
  /** 记录当前顶级菜单下哪个子菜单最后激活 */
  const defaultSubMap = useMemo(() => new Map<string, string>(), []);
  const { preferences, isMixedNav } = usePreferencesContext();
  const needSplit = useMemo(() => {
    return preferences.navigation.split && isMixedNav;
  }, [isMixedNav, preferences.navigation.split]);
  const sidebarVisible = useMemo(() => {
    const enableSidebar = preferences.sidebar.enable;
    if (needSplit) {
      return enableSidebar && splitSideMenus.length > 0;
    }
    return enableSidebar;
  }, [needSplit, preferences.sidebar.enable, splitSideMenus.length]);

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
    return headerMenus;
  }, [headerMenus]);
  /**
   * 侧边菜单激活路径
   */
  const sidebarActive = useMemo(() => {
    return (curRoute?.meta?.activePath as string) ?? curRoute?.pathname;
  }, [curRoute]);

  /**
   * 头部菜单激活路径
   */
  const headerActive = useMemo(() => {
    if (!needSplit) {
      return curRoute?.pathname;
    }
    return rootMenuPath;
  }, [curRoute?.pathname, needSplit, rootMenuPath]);

  /**
   * 菜单点击事件处理
   * @param path 菜单路径
   * @param mode 菜单模式
   */
  const handleMenuSelect = (path: string, mode: 'horizontal' | 'vertical') => {
    if (!needSplit || mode === 'vertical') {
      navigate(path);
      return;
    }
    const rootMenu = menus.find((item) => item.path === path);

    setRootMenuPath(rootMenu?.path ?? '');
    setSplitSideMenus(rootMenu?.children ?? []);

    if (rootMenu?.children === undefined) {
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
    if (
      parentsPath.length <= 1 &&
      preferences.sidebar.autoActivateChild &&
      preferences.app.layout === 'mixed-nav'
    ) {
      navigate(
        defaultSubMap.has(key) ? (defaultSubMap.get(key) as string) : key,
      );
    }
  };

  /**
   * 计算侧边菜单
   * @param path 路由路径
   */
  const calcSideMenus = useCallback(
    (path: string) => {
      let { rootMenu } = findRootMenuByPath(menus, path);
      if (!rootMenu) {
        rootMenu = menus.find((item) => item.path === path);
      }
      const result = findRootMenuByPath(rootMenu?.children || [], path, 1);
      mixedRootMenuPath.current = result.rootMenuPath ?? '';
      mixExtraMenus.current = result.findMenu?.children ?? [];
      setRootMenuPath(rootMenu?.path ?? '');
      setSplitSideMenus(rootMenu?.children ?? []);
    },
    [findRootMenuByPath, menus],
  );
  useEffect(() => {
    const currentPath =
      (curRoute?.meta?.activePath as string) ?? curRoute?.pathname;
    calcSideMenus(currentPath);
    if (rootMenuPath && preferences.app.layout === 'mixed-nav') {
      defaultSubMap.set(rootMenuPath, currentPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curRoute?.pathname, curRoute?.meta?.activePath, defaultSubMap]);

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
