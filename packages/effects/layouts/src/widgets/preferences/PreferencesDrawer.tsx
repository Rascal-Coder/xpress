import { Copy, RotateCw } from '@xpress/icons';
import { Drawer, type Props } from '@xpress-core/popup-ui';
import {
  Segmented,
  XpressButton,
  XpressIconButton,
} from '@xpress-core/shadcn-ui';

import { useState } from 'react';

import { PreferencesAppearance } from './modules/appearance';
import { PreferencesLayout } from './modules/layout';

const CopyButton = () => {
  return (
    <XpressButton className="mx-4 w-full" size="sm" variant="default">
      <Copy className="mr-2 size-3" /> 复制偏好设置
    </XpressButton>
  );
};
const LogoutButton = () => {
  return (
    <XpressButton className="mx-4 w-full" size="sm" variant="ghost">
      清空缓存 & 退出登录
    </XpressButton>
  );
};
const Footer = () => {
  return (
    <>
      <CopyButton />
      <LogoutButton />
    </>
  );
};
const Extra = () => {
  return (
    <div className="flex items-center">
      <XpressIconButton
        className="relative"
        tooltip="数据有变化，点击可进行重置"
      >
        <span className="bg-primary absolute right-0.5 top-0.5 h-2 w-2 rounded"></span>
        <RotateCw className="size-4" />
      </XpressIconButton>
    </div>
  );
};
const tabs = [
  {
    label: '外观',
    value: 'appearance',
  },
  {
    label: '布局',
    value: 'layout',
  },
  {
    label: '快捷键',
    value: 'shortcutkey',
  },
  {
    label: '通用',
    value: 'general',
  },
];
export const PreferencesDrawer = (props: Props) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.value);
  const renderContent = () => {
    switch (activeTab) {
      case 'appearance': {
        return <PreferencesAppearance />;
      }
      case 'general': {
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium">通用设置</h3>
            <p>在这里配置语言、自动更新等通用设置</p>
          </div>
        );
      }
      case 'layout': {
        return <PreferencesLayout />;
      }
      case 'shortcutkey': {
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium">快捷键设置</h3>
            <p>在这里配置键盘快捷键</p>
          </div>
        );
      }
    }
  };

  return (
    <Drawer
      className="sm:max-w-sm"
      description="自定义偏好设置 & 实时预览"
      title="偏好设置"
      {...props}
      extra={<Extra />}
      footer={<Footer />}
    >
      <div className="p-1">
        <Segmented
          onChange={(value) => setActiveTab(value)}
          tabs={tabs}
          value={activeTab}
        />
        {renderContent()}
      </div>
    </Drawer>
  );
};
