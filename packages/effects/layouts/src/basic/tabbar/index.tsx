import { useTabbar } from '@xpress/stores';
import { usePreferencesContext } from '@xpress-core/preferences';
import { type Router } from '@xpress-core/router';
import { TabsToolMore, TabsToolScreen, TabsView } from '@xpress-core/tabs-ui';

import { useNavigate } from 'react-router-dom';

import { useTabbarFn } from './useTabbar';

export const Tabbar = ({ router }: { router: Router }) => {
  const { preferences, updatePreferences, contentIsMaximize } =
    usePreferencesContext();
  const { currentActive, currentTab } = useTabbarFn({ router });
  const { tabs, closeTab, unpinTab } = useTabbar();
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

  const navigate = useNavigate();
  const handleTabClick = (tab: Record<string, any>) => {
    navigate(tab.fullPath);
  };
  const handleTabClose = (tab: Record<string, any>) => {
    closeTab(tab, currentTab, navigate);
  };
  const handleUnpin = (tab: Record<string, any>) => {
    unpinTab(tab);
  };
  return (
    <>
      <TabsView
        active={currentActive}
        contextMenus={() => [
          {
            key: 'close',
            text: '关闭',
          },
        ]}
        draggable={preferences.tabbar.draggable}
        middleClickToClose={preferences.tabbar.middleClickToClose}
        onClick={handleTabClick}
        onClose={handleTabClose}
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
