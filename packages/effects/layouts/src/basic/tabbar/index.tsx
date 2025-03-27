import { usePreferencesContext } from '@xpress-core/preferences';
import { type Router } from '@xpress-core/router';
import {
  type IContextMenuItem,
  TabsToolMore,
  TabsToolScreen,
  TabsView,
} from '@xpress-core/tabs-ui';

import { useState } from 'react';

import { useTabbarFn } from './useTabbar';

export const Tabbar = ({ router }: { router: Router }) => {
  const { preferences, updatePreferences, contentIsMaximize } =
    usePreferencesContext();
  const {
    currentActive,
    handleTabClick,
    handleTabClose,
    handleUnpin,
    tabs,
    createContextMenus,
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
  const handleOpenChange = (tab: Record<string, any>) => {
    setMenus(createContextMenus(tab));
  };
  return (
    <>
      <TabsView
        active={currentActive}
        contextMenus={() => menus}
        draggable={preferences.tabbar.draggable}
        middleClickToClose={preferences.tabbar.middleClickToClose}
        onClick={() => handleTabClick}
        onClose={handleTabClose}
        onOpenChange={handleOpenChange}
        showIcon={true}
        styleType={preferences.tabbar.styleType}
        tabs={tabs}
        unpin={handleUnpin}
        wheelable={preferences.tabbar.wheelable}
      />
      <div className="flex-center h-full">
        {preferences.tabbar.showMore && (
          <TabsToolMore
            menus={[
              {
                label: '关闭',
                value: 'close',
                key: 'close',
              },
            ]}
          />
        )}
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
