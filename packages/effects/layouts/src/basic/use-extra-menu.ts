import type { MenuRecordRaw } from '@xpress-core/typings';

import { useAccessStore } from '@xpress/stores';
import { useFindMenu } from '@xpress-core/hooks';
import { usePreferencesContext } from '@xpress-core/preferences';
import { type Router, useRouter } from '@xpress-core/router';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useExtraMenu(router: Router) {
  const { curRoute } = useRouter(router);
  const navigate = useNavigate();
  const menus = useAccessStore((state) => state.accessMenus);
  const { findRootMenuByPath } = useFindMenu();
  /** 记录当前顶级菜单下哪个子菜单最后激活 */
  const defaultSubMap = useMemo(() => new Map<string, string>(), []);
  const { preferences } = usePreferencesContext();
  const [extraRootMenus, setExtraRootMenus] = useState<MenuRecordRaw[]>([]);
  const [extraMenus, setExtraMenus] = useState<MenuRecordRaw[]>([]);
  const [sidebarExtraVisible, setSidebarExtraVisible] = useState(false);
  const [extraActiveMenu, setExtraActiveMenu] = useState<string>('');
  const parentLevel = useMemo(
    () => (preferences.app.layout === 'header-mixed-nav' ? 1 : 0),
    [preferences.app.layout],
  );
  /**
   * 选择混合菜单事件
   * @param menu
   */
  const handleMixedMenuSelect = async (menu: MenuRecordRaw) => {
    const { findMenu } = findRootMenuByPath(menus, menu.path);
    const newExtraMenus = menu?.children ?? [];
    setExtraMenus(newExtraMenus);
    setExtraActiveMenu(findMenu?.parents?.[parentLevel] ?? menu.path);
    const hasChildren = newExtraMenus.length > 0;
    setSidebarExtraVisible(hasChildren);
    if (!hasChildren) {
      await navigate(menu.path);
    } else if (preferences.sidebar.autoActivateChild) {
      await navigate(
        defaultSubMap.has(menu.path)
          ? (defaultSubMap.get(menu.path) as string)
          : menu.path,
      );
    }
  };

  /**
   * 选择默认菜单事件
   * @param menu
   * @param rootMenu
   */
  const handleDefaultSelect = (
    menu: MenuRecordRaw,
    rootMenu?: MenuRecordRaw,
  ) => {
    const { findMenu } = findRootMenuByPath(menus, menu.path);
    const newExtraMenus = rootMenu?.children ?? extraRootMenus ?? [];
    setExtraMenus(newExtraMenus);
    setExtraActiveMenu(findMenu?.parents?.[parentLevel] ?? menu.path);
    if (preferences.sidebar.expandOnHover) {
      setSidebarExtraVisible(newExtraMenus.length > 0);
    }
  };
  /**
   * 侧边菜单鼠标移出事件
   */
  const handleSideMouseLeave = () => {
    if (preferences.sidebar.expandOnHover) {
      return;
    }

    const { findMenu, rootMenu, rootMenuPath } = findRootMenuByPath(
      menus,
      curRoute?.pathname ?? '',
    );
    setExtraActiveMenu(rootMenuPath ?? findMenu?.path ?? '');
    setExtraMenus(rootMenu?.children ?? []);
    // setSidebarExtraVisible();
    if (!preferences.sidebar.expandOnHover) {
      setSidebarExtraVisible(false);
    }
  };

  const handleMenuMouseEnter = (menu: MenuRecordRaw) => {
    if (!preferences.sidebar.expandOnHover) {
      const { findMenu } = findRootMenuByPath(menus, menu.path);
      const newExtraMenus = findMenu?.children ?? [];
      setExtraMenus(newExtraMenus);
      setExtraActiveMenu(findMenu?.parents?.[parentLevel] ?? menu.path);
      setSidebarExtraVisible(newExtraMenus.length > 0);
    }
  };

  /**
   * 计算额外菜单
   * @param path
   */
  const calcExtraMenus = useCallback(
    (path: string) => {
      const currentPath = curRoute?.meta?.activePath || path;
      const { findMenu, rootMenu, rootMenuPath } = findRootMenuByPath(
        menus,
        currentPath,
        parentLevel,
      );
      const newExtraRootMenus = rootMenu?.children ?? [];
      setExtraRootMenus(newExtraRootMenus);
      if (rootMenuPath) defaultSubMap.set(rootMenuPath, currentPath);
      setExtraActiveMenu(rootMenuPath ?? findMenu?.path ?? '');
      setExtraMenus(newExtraRootMenus);
      if (preferences.sidebar.expandOnHover) {
        setSidebarExtraVisible(newExtraRootMenus.length > 0);
      }
    },
    [
      curRoute?.meta?.activePath,
      defaultSubMap,
      findRootMenuByPath,
      menus,
      parentLevel,
      preferences.sidebar.expandOnHover,
    ],
  );
  useEffect(() => {
    calcExtraMenus(curRoute?.pathname ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curRoute?.pathname, preferences.app.layout]);
  return {
    handleMixedMenuSelect,
    handleDefaultSelect,
    handleSideMouseLeave,
    handleMenuMouseEnter,
    extraActiveMenu,
    extraMenus,
    sidebarExtraVisible,
  };
}
