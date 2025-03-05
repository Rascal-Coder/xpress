import { usePreferencesContext } from '@xpress-core/preferences';
import { NumberFieldItem } from '@xpress-core/shadcn-ui';

import { useState } from 'react';

import { SwitchItem } from '../SwitchItem';

export const Sidebar = () => {
  const { updatePreferences, preferences } = usePreferencesContext();
  const [width, setWidth] = useState(preferences.sidebar.width);
  return (
    <>
      <SwitchItem
        checked={preferences.sidebar.enable}
        onChange={(checked) => {
          updatePreferences({ sidebar: { enable: checked } });
        }}
      >
        显示侧边栏
      </SwitchItem>
      <SwitchItem
        checked={preferences.sidebar.collapsed}
        onChange={(checked) => {
          updatePreferences({ sidebar: { collapsed: checked } });
        }}
      >
        折叠菜单
      </SwitchItem>
      <SwitchItem
        checked={preferences.sidebar.expandOnHover}
        onChange={(checked) => {
          updatePreferences({ sidebar: { expandOnHover: checked } });
        }}
        tip="鼠标在折叠区域悬浮时，`启用`则展开当前子菜单，`禁用`则展开整个侧边栏"
      >
        鼠标悬停展开
      </SwitchItem>
      <SwitchItem
        checked={preferences.sidebar.collapsedShowTitle}
        onChange={(checked) => {
          updatePreferences({ sidebar: { collapsedShowTitle: checked } });
        }}
      >
        折叠显示菜单名
      </SwitchItem>
      <SwitchItem
        checked={preferences.sidebar.autoActivateChild}
        onChange={(checked) => {
          updatePreferences({ sidebar: { autoActivateChild: checked } });
        }}
        tip="点击顶层菜单时,自动激活第一个子菜单或者上一次激活的子菜单"
      >
        自动激活子菜单
      </SwitchItem>
      <NumberFieldItem
        className="w-[165px]"
        defaultValue={160}
        max={320}
        min={160}
        modelValue={width}
        onChange={(value) => {
          setWidth(value);
          updatePreferences({ sidebar: { width: value } });
        }}
        step={10}
      />
    </>
  );
};
