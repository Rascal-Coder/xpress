import type { MenuRecordRaw } from '@xpress-core/typings';

import { useAccessStore } from '@xpress/stores';
import { usePreferencesContext } from '@xpress-core/preferences';
import { type Router, useRouter } from '@xpress-core/router';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useMixedMenu(router: Router) {
  const navigate = useNavigate();
  const menus = useAccessStore((state) => state.accessMenus);
  const { curRoute } = useRouter(router);
  const [splitSideMenus, setSplitSideMenus] = useState<MenuRecordRaw[]>([]);
  const mixedRootMenuPath = useRef<string>('');
  const mixExtraMenus = useRef<MenuRecordRaw[]>([]);
  const [rootMenuPath, setRootMenuPath] = useState<string>('');
  /** 记录当前顶级菜单下哪个子菜单最后激活 */
  const defaultSubMap = useMemo(() => new Map<string, string>(), []);
  const { preferences, isMixedNav, isHeaderMixedNav } = usePreferencesContext();
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
    if (parentsPath.length <= 1 && preferences.sidebar.autoActivateChild) {
      navigate(
        defaultSubMap.has(key) ? (defaultSubMap.get(key) as string) : key,
      );
    }
  };
  // /////////////////////////\\\\\\\\\\\\\\\\\\\
  // TODO 抽离到hook
  const findMenuByPath = useCallback(
    (list: MenuRecordRaw[], path?: string): MenuRecordRaw | null => {
      for (const menu of list) {
        if (menu.path === path) {
          return menu;
        }
        const findMenu = menu.children && findMenuByPath(menu.children, path);
        if (findMenu) {
          const pathArray: string[] = [];
          const segments = findMenu.path.split('/').filter(Boolean);
          let currentPath = '';
          for (const segment of segments) {
            currentPath += `/${segment}`;
            pathArray.push(currentPath);
          }
          findMenu.parents = pathArray;
          return findMenu;
        }
      }
      return null;
    },
    [],
  );
  // TODO 抽离到hook
  const findRootMenuByPath = useCallback(
    (menus: MenuRecordRaw[], path: string, level = 0) => {
      const findMenu = findMenuByPath(menus, path);
      const rootMenuPath = findMenu?.parents?.[level];
      const rootMenu = rootMenuPath
        ? menus.find((item) => item.path === rootMenuPath)
        : null;
      return {
        findMenu,
        rootMenu,
        rootMenuPath,
      };
    },
    [findMenuByPath],
  );
  // /////////////////////////\\\\\\\\\\\\\\\\\\\

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
    if (rootMenuPath) {
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
