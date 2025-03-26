import { useTabbar } from '@xpress/stores';
import { usePreferencesContext } from '@xpress-core/preferences';
import {
  type Router,
  type TabDefinition,
  useFullPath,
  useRouter,
} from '@xpress-core/router';

import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useTabbarFn = ({ router }: { router: Router }) => {
  const { curRoute } = useRouter(router);
  const matched = curRoute?.collecttedRouteInfo;
  const { tabs, affixTabs, addTab } = useTabbar();
  const { preferences } = usePreferencesContext();
  const { pathname } = useLocation();
  const fullPath = useFullPath();

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
    };
  }, [currentPath, fullPath]);

  /**
   * 初始化固定标签页
   */
  const initAffixTabs = () => {
    // console.log('flattenRoutes', flattenRoutes);
    // const allFlattenRoutes = [...flattenRoutes];
    // console.log('allFlattenRoutes', allFlattenRoutes);
  };
  useEffect(() => {
    initAffixTabs();
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
    const disabledCloseLeft =
      index === 0 || index - _affixTabs.length <= 0 || !isCurrentTab;

    const disabledCloseRight = !isCurrentTab || index === tabs.length - 1;

    const disabledCloseOther =
      disabled || !isCurrentTab || tabs.length - _affixTabs.length <= 1;
    return {
      disabledCloseAll: disabled,
      disabledCloseCurrent: !!affixTab || disabled,
      disabledCloseLeft,
      disabledCloseOther,
      disabledCloseRight,
      disabledRefresh: !isCurrentTab,
    };
  }
  return {
    getTabDisableState,
    currentActive,
    currentTab,
  };
};
