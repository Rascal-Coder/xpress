import { useTabbar } from '@xpress/stores';
import { usePreferencesContext } from '@xpress-core/preferences';
import { type Router, useFullPath, useRouter } from '@xpress-core/router';
import { TabsToolMore, TabsToolScreen, TabsView } from '@xpress-core/tabs-ui';

import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Tabbar = ({ router }: { router: Router }) => {
  const { preferences, updatePreferences, contentIsMaximize } =
    usePreferencesContext();
  const fullPath = useFullPath();
  const { curRoute } = useRouter(router);
  const matched = curRoute?.collecttedRouteInfo;
  const { addTab, tabs, closeTab, unpinTab } = useTabbar();
  const { pathname } = useLocation();
  const currentPath = useMemo(() => {
    return matched?.find((item) => item.path === pathname);
  }, [pathname, matched]);
  const currentTab = useMemo(() => {
    return {
      ...currentPath,
      fullPath,
      key: fullPath,
    };
  }, [currentPath, fullPath]);
  useEffect(() => {
    if (!currentPath?.defaultPath) {
      addTab(currentTab, preferences);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);
  // TODO: 需要优化  抽离为hook
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
  const currentActive = useMemo(() => {
    return fullPath;
  }, [fullPath]);
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
