import type { IContextMenuItem } from '@xpress-core/shadcn-ui';
import type { TabDefinition } from '@xpress-core/tabs-ui';

import {
  type Router,
  useFullPath,
  useLocation,
  useNavigate,
  useRouter,
} from '@xpress/router';
import { useTabbar } from '@xpress/stores';
import {
  ArrowLeftToLine,
  ArrowRightLeft,
  ArrowRightToLine,
  ExternalLink,
  FoldHorizontal,
  Fullscreen,
  Minimize2,
  Pin,
  PinOff,
  RotateCw,
  X,
} from '@xpress-core/icons';
import { usePreferencesContext } from '@xpress-core/preferences';

import { useEffect, useMemo } from 'react';

export const useTabbarFn = ({ router }: { router: Router }) => {
  const { curRoute, flattenRoutes } = useRouter(router);
  const matched = curRoute?.collecttedRouteInfo;
  const {
    tabs,
    affixTabs,
    addTab,
    setAffixTabs,
    closeAllTabs,
    closeTab,
    closeLeftTabs,
    closeOtherTabs,
    closeRightTabs,
    openTabInNewWindow,
    refresh,
    sortTabs,
    toggleTabPin,
    unpinTab,
  } = useTabbar();
  const { preferences, contentIsMaximize, updatePreferences } =
    usePreferencesContext();
  const { pathname } = useLocation();
  const fullPath = useFullPath();
  const navigate = useNavigate();
  /**
   * 当前路径
   */
  const currentPath = useMemo(() => {
    return matched?.find((item) => item.path === pathname);
  }, [pathname, matched]);

  /**
   * 当前标签页
   */
  const currentTab = useMemo(() => {
    return {
      ...currentPath,
      fullPath,
      key: fullPath,
      affixTab: false,
      closable: true,
      icon: '',
      title: currentPath?.meta?.title || '',
    };
  }, [currentPath, fullPath]);

  /**
   * 初始化固定标签页
   */
  const initAffixTabs = () => {
    const allFlattenRoutes = [...flattenRoutes.values()]
      .filter((route) => !route.isConstant && !route.isRoot)
      .map((item) => {
        return {
          path: item.pathname,
          meta: item.meta,
          key: item.pathname,
          fullPath: item.pathname,
        };
      });
    const fixedRoutes = allFlattenRoutes
      .filter((route) => route.meta?.affixTab)
      .map((route) => ({
        ...route,
        affixTab: true,
        closable: false,
        icon: route.meta?.icon?.toString() || '',
        title: route.meta?.title || '',
        key: route.path || '',
      }));
    setAffixTabs(fixedRoutes);
  };
  useEffect(() => {
    initAffixTabs();
    if (!preferences.tabbar.persist) {
      closeOtherTabs(currentTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!currentPath?.defaultPath) {
      addTab(currentTab, preferences);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  const currentActive = useMemo(() => {
    return fullPath;
  }, [fullPath]);
  /**
   * 获取操作是否禁用
   * @param tab
   */
  function getTabDisableState(tab: TabDefinition, currentTab: TabDefinition) {
    const _affixTabs = affixTabs();
    const index = tabs.findIndex((item) => item.path === tab.path);

    const disabled = tabs.length <= 1;

    const { meta } = tab;
    const affixTab = meta?.affixTab ?? false;
    const isCurrentTab = currentTab.path === tab.path;

    // 当前处于最左侧或者减去固定标签页的数量等于0
    const disabledCloseLeft = index === 0 || index - _affixTabs.length <= 0;

    const disabledCloseRight = index === tabs.length - 1;

    const disabledCloseOther = disabled || tabs.length - _affixTabs.length <= 1;
    return {
      disabledCloseAll: disabled,
      disabledCloseCurrent: !!affixTab || disabled,
      disabledCloseLeft,
      disabledCloseOther,
      disabledCloseRight,
      disabledRefresh: !isCurrentTab,
    };
  }

  const createContextMenus = (tab: TabDefinition) => {
    const {
      disabledCloseAll,
      disabledCloseCurrent,
      disabledCloseLeft,
      disabledCloseOther,
      disabledCloseRight,
      disabledRefresh,
    } = getTabDisableState(tab, currentTab);

    const affixTab = tab?.meta?.affixTab ?? false;
    const toggleMaximize = () => {
      updatePreferences({
        header: {
          hidden: !contentIsMaximize,
        },
        sidebar: {
          hidden: !contentIsMaximize,
        },
      });
    };
    const menus: IContextMenuItem[] = [
      {
        disabled: disabledCloseCurrent,
        handler: () => {
          closeTab(tab, currentTab, navigate);
        },
        icon: X,
        key: 'close',
        text: '关闭',
      },
      {
        handler: async () => {
          toggleTabPin(tab);
        },
        icon: affixTab ? PinOff : Pin,
        key: 'affix',
        text: affixTab ? '取消固定' : '固定',
      },
      {
        handler: async () => {
          if (!contentIsMaximize) {
            await navigate(tab.fullPath || tab.path || '');
          }
          toggleMaximize();
        },
        icon: contentIsMaximize ? Minimize2 : Fullscreen,
        key: contentIsMaximize ? 'restore-maximize' : 'maximize',
        text: contentIsMaximize ? '还原' : '最大化',
      },
      {
        disabled: disabledRefresh,
        handler: refresh,
        icon: RotateCw,
        key: 'reload',
        text: '重新加载',
      },
      {
        handler: () => {
          openTabInNewWindow(tab);
        },
        icon: ExternalLink,
        key: 'open-in-new-window',
        separator: true,
        text: '新窗口打开',
      },

      {
        disabled: disabledCloseLeft,
        handler: async () => {
          await closeLeftTabs(tab);
        },
        icon: ArrowLeftToLine,
        key: 'close-left',
        text: '关闭左侧',
      },
      {
        disabled: disabledCloseRight,
        handler: async () => {
          await closeRightTabs(tab);
        },
        icon: ArrowRightToLine,
        key: 'close-right',
        separator: true,
        text: '关闭右侧',
      },
      {
        disabled: disabledCloseOther,
        handler: async () => {
          await closeOtherTabs(tab);
        },
        icon: FoldHorizontal,
        key: 'close-other',
        text: '关闭其他',
      },
      {
        disabled: disabledCloseAll,
        handler: closeAllTabs,
        icon: ArrowRightLeft,
        key: 'close-all',
        text: '关闭所有',
      },
    ];
    return menus;
  };
  const handleTabClick = (tab: Record<string, any>) => {
    navigate(tab.fullPath || tab.path);
  };
  const handleTabClose = (tab: TabDefinition) => {
    closeTab(tab, currentTab, navigate);
  };
  const handleUnpin = (tab: TabDefinition) => {
    unpinTab(tab);
  };
  return {
    getTabDisableState,
    currentActive,
    currentTab,
    createContextMenus,
    handleTabClick,
    handleTabClose,
    handleUnpin,
    tabs,
    sortTabs,
  };
};
