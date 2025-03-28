import { usePreferencesContext } from '@xpress-core/preferences';
import { type Router } from '@xpress-core/router';
import {
  type IContextMenuItem,
  type TabDefinition,
  TabsToolMore,
  TabsToolScreen,
  TabsView,
} from '@xpress-core/tabs-ui';

import { useEffect, useState } from 'react';

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
  const [menus, setMenus] = useState<IContextMenuItem[]>([]);
  const handleOpenChange = (tab: TabDefinition) => {
    setMenus(createContextMenus(tab));
  };
  const [moreMenus, setMoreMenus] = useState<IContextMenuItem[]>([]);
  useEffect(() => {
    const menus = createContextMenus(currentTab).map((item) => {
      return {
        ...item,
        label: item.text,
        value: item.key,
      };
    });
    setMoreMenus(menus);
  }, [createContextMenus, currentTab]);

  return (
    <>
      <TabsView
        active={currentActive}
        contextMenus={() => menus}
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
