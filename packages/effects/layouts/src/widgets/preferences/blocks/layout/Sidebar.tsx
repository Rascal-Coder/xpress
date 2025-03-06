import { usePreferencesContext } from '@xpress-core/preferences';
import { NumberFieldCom } from '@xpress-core/shadcn-ui';

import { useState } from 'react';

import { SwitchItem } from '../SwitchItem';

export const Sidebar = () => {
  const { updatePreferences, preferences, isSideMode } =
    usePreferencesContext();
  const [width, setWidth] = useState(preferences.sidebar.width);
  const currentLayout = preferences.app.layout;
  return (
    <>
      <SwitchItem
        checked={preferences.sidebar.enable}
        disabled={!isSideMode}
        onChange={(checked) => {
          updatePreferences({ sidebar: { enable: checked } });
        }}
      >
        显示侧边栏
      </SwitchItem>
      <SwitchItem
        checked={preferences.sidebar.collapsed}
        disabled={!preferences.sidebar.enable || !isSideMode}
        onChange={(checked) => {
          updatePreferences({ sidebar: { collapsed: checked } });
        }}
      >
        折叠菜单
      </SwitchItem>
      <SwitchItem
        checked={preferences.sidebar.expandOnHover}
        disabled={
          !preferences.sidebar.enable ||
          !isSideMode ||
          !preferences.sidebar.collapsed
        }
        onChange={(checked) => {
          updatePreferences({ sidebar: { expandOnHover: checked } });
        }}
        tip="鼠标在折叠区域悬浮时，`启用`则展开当前子菜单，`禁用`则展开整个侧边栏"
      >
        鼠标悬停展开
      </SwitchItem>
      <SwitchItem
        checked={preferences.sidebar.collapsedShowTitle}
        disabled={
          !preferences.sidebar.enable ||
          !isSideMode ||
          !preferences.sidebar.collapsed
        }
        onChange={(checked) => {
          updatePreferences({ sidebar: { collapsedShowTitle: checked } });
        }}
      >
        折叠显示菜单名
      </SwitchItem>
      <SwitchItem
        checked={preferences.sidebar.autoActivateChild}
        disabled={
          !preferences.sidebar.enable ||
          !['mixed-nav', 'sidebar-mixed-nav'].includes(
            currentLayout as string,
          ) ||
          !isSideMode
        }
        onChange={(checked) => {
          updatePreferences({ sidebar: { autoActivateChild: checked } });
        }}
        tip="点击顶层菜单时,自动激活第一个子菜单或者上一次激活的子菜单"
      >
        自动激活子菜单
      </SwitchItem>
      <NumberFieldCom
        defaultValue={160}
        disabled={!preferences.sidebar.enable || !isSideMode}
        max={320}
        min={160}
        modelValue={width}
        onChange={(value) => {
          setWidth(value);
          updatePreferences({ sidebar: { width: value } });
        }}
        step={10}
      >
        宽度
      </NumberFieldCom>
    </>
  );
};
