import { usePreferencesContext } from '@xpress-core/preferences';
import { type Router } from '@xpress-core/router';
import {
  type IContextMenuItem,
  type TabDefinition,
  TabsToolMore,
  TabsToolScreen,
  TabsView,
} from '@xpress-core/tabs-ui';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useTabbarFn } from './useTabbar';

export const Tabbar = ({ router }: { router: Router }) => {
  const { preferences, updatePreferences, contentIsMaximize } =
    usePreferencesContext();
  const {
    currentActive,
    handleTabClick,
    handleTabClose,
    handleUnpin,
    sortTabs,
    tabs,
    createContextMenus,
    currentTab,
  } = useTabbarFn({ router });

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

  // 使用 useMemo 初始化 menus
  const initialMenus = useMemo(
    () => (currentTab ? createContextMenus(currentTab) : []),
    [currentTab, createContextMenus],
  );

  const [menus, setMenus] = useState<IContextMenuItem[]>(initialMenus);

  const [moreMenus, setMoreMenus] = useState<IContextMenuItem[]>([]);

  const getContextMenus = useCallback(() => {
    return currentTab ? createContextMenus(currentTab) : menus;
  }, [currentTab, createContextMenus, menus]);

  const handleOpenChange = (tab: TabDefinition) => {
    if (tab) {
      const menus = createContextMenus(tab);
      setMenus(menus);
    }
  };

  useEffect(() => {
    if (currentTab) {
      const menus = createContextMenus(currentTab);
      setMenus(menus);
      const updatedMenus = createContextMenus(currentTab).map((item) => ({
        ...item,
        label: item.text,
        value: item.key,
      }));
      setMoreMenus(updatedMenus);
    }
  }, [currentTab, createContextMenus]);

  return (
    <>
      <TabsView
        active={currentActive}
        contextMenus={getContextMenus}
        draggable={preferences.tabbar.draggable}
        middleClickToClose={preferences.tabbar.middleClickToClose}
        onClick={handleTabClick}
        onClose={handleTabClose}
        onOpenChange={handleOpenChange}
        showIcon={preferences.tabbar.showIcon}
        sortTabs={sortTabs}
        styleType={preferences.tabbar.styleType}
        tabs={tabs}
        unpin={handleUnpin}
        wheelable={preferences.tabbar.wheelable}
      />
      <div className="flex-center h-full">
        {preferences.tabbar.showMore && <TabsToolMore menus={moreMenus} />}
        {preferences.tabbar.showMaximize && (
          <TabsToolScreen
            screen={contentIsMaximize}
            toggleScreen={toggleMaximize}
          />
        )}
      </div>
    </>
  );
};
