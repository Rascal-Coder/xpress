import { TabsView } from '@xpress-core/tabs-ui';

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
  return (
    <TabsView
      active={active}
      contextMenus={() => [
        {
          key: 'close',
          text: '关闭',
        },
      ]}
      middleClickToClose
      onClick={(key) => handleTestTab(key)}
      onClose={(key) => handleCloseTab(key)}
      styleType="card"
      tabs={tabs}
    />
  );
};
