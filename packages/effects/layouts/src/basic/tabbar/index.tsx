import { usePreferencesContext } from '@xpress-core/preferences';
import { TabsToolMore, TabsToolScreen, TabsView } from '@xpress-core/tabs-ui';

import { useState } from 'react';

export const Tabbar = () => {
  const [active, setActive] = useState('1');
  const [tabs, setTabs] = useState([
    { title: '工作台', key: '1', closable: true },
    { title: '分析页', key: '2', closable: true, affixTab: true },
  ]);
  const handleTestTab = (key: string) => {
    if (key === '1') {
      setTabs((prev) => {
        return [
          ...prev,
          {
            title: '测试页',
            key: String(prev.length + 1),
            closable: true,
            affixTab: false,
          },
        ];
      });
      setActive(key);
    }
  };
  const handleCloseTab = (key: string) => {
    setTabs((prev) => {
      return prev.filter((tab) => tab.key !== key);
    });
  };
  const { preferences, updatePreferences, contentIsMaximize } =
    usePreferencesContext();
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
  return (
    <>
      <TabsView
        active={active}
        contextMenus={() => [
          {
            key: 'close',
            text: '关闭',
          },
        ]}
        draggable={preferences.tabbar.draggable}
        middleClickToClose={preferences.tabbar.middleClickToClose}
        onClick={(key) => handleTestTab(key)}
        onClose={(key) => handleCloseTab(key)}
        showIcon={true}
        styleType={preferences.tabbar.styleType}
        tabs={tabs}
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
