import type { LayoutType } from '@xpress-core/typings';

import { CircleHelp } from '@xpress/icons';
import { usePreferencesContext } from '@xpress-core/preferences';
import { XpressTooltip } from '@xpress-core/shadcn-ui';

import { useState } from 'react';

import {
  FullContent,
  HeaderNav,
  HeaderSidebarNav,
  MixedNav,
  SidebarMixedNav,
  SidebarNav,
} from '../../icons';

export const Layout = () => {
  const components = {
    'full-content': <FullContent></FullContent>,
    'header-nav': <HeaderNav></HeaderNav>,
    'sidebar-nav': <SidebarNav></SidebarNav>,
    'header-sidebar-nav': <HeaderSidebarNav></HeaderSidebarNav>,
    'sidebar-mixed-nav': <SidebarMixedNav></SidebarMixedNav>,
    'mixed-nav': <MixedNav></MixedNav>,
  };
  const PRESET = [
    {
      name: '垂直',
      tip: '侧边垂直菜单模式',
      type: 'sidebar-nav',
    },
    {
      name: '双列菜单',
      tip: '垂直双列菜单模式',
      type: 'sidebar-mixed-nav',
    },
    {
      name: '水平',
      tip: '水平菜单模式，菜单全部显示在顶部',
      type: 'header-nav',
    },
    {
      name: '侧边导航',
      tip: '顶部通栏，侧边导航模式',
      type: 'header-sidebar-nav',
    },
    {
      name: '混合垂直',
      tip: '垂直水平菜单共存',
      type: 'mixed-nav',
    },
    {
      name: '内容全屏',
      tip: '不显示任何菜单，只显示内容主体',
      type: 'full-content',
    },
  ] as { name: string; tip: string; type: LayoutType }[];
  const { updatePreferences, preferences } = usePreferencesContext();
  const [layout, setLayout] = useState(preferences.app.layout);
  const handleSetLayout = (type: LayoutType) => {
    setLayout(type);
    updatePreferences({
      app: {
        layout: type,
      },
    });
  };
  return (
    <div className="flex w-full flex-wrap gap-5">
      {PRESET.map((item) => (
        <div key={item.name}>
          <div
            className="flex w-[100px] cursor-pointer flex-col"
            onClick={() => {
              handleSetLayout(item.type);
            }}
          >
            <div
              className={`outline-box flex-center ${
                layout === item.type && 'outline-box-active'
              }`}
            >
              {components[item.type as keyof typeof components]}
            </div>
            <div className="text-muted-foreground flex-center hover:text-foreground mt-2 text-center text-xs">
              {item.name}
              {item.tip && (
                <XpressTooltip
                  side="bottom"
                  trigger={<CircleHelp className="ml-1 size-3 cursor-help" />}
                >
                  {item.tip}
                </XpressTooltip>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
