import type { TabsStyleType } from '@xpress-core/typings';

import { usePreferencesContext } from '@xpress-core/preferences';
import { NumberFieldCom } from '@xpress-core/shadcn-ui';

import { useState } from 'react';

import { SwitchItem } from '../SwitchItem';
import { ToggleItem } from '../ToggleItem';

export function Tabbar() {
  const { preferences, updatePreferences } = usePreferencesContext();
  const styleItems = [
    {
      label: '谷歌',
      value: 'chrome',
    },
    {
      label: '朴素',
      value: 'plain',
    },
    {
      label: '卡片',
      value: 'card',
    },

    {
      label: '轻快',
      value: 'brisk',
    },
  ];
  const [maxCount, setMaxCount] = useState(preferences.tabbar.maxCount);
  return (
    <>
      <SwitchItem
        checked={preferences.tabbar.enable}
        onChange={(checked) => {
          updatePreferences({ tabbar: { enable: checked } });
        }}
      >
        启用标签页
      </SwitchItem>
      <SwitchItem
        checked={preferences.tabbar.persist}
        disabled={!preferences.tabbar.enable}
        onChange={(checked) => {
          updatePreferences({ tabbar: { persist: checked } });
        }}
        tip="关闭后标签页只保留当前标签页"
      >
        标签页持久化
      </SwitchItem>
      <NumberFieldCom
        defaultValue={0}
        disabled={!preferences.tabbar.enable}
        max={30}
        min={0}
        modelValue={maxCount}
        onChange={(value) => {
          setMaxCount(value);
          updatePreferences({ tabbar: { maxCount: value } });
        }}
        step={5}
        tip="每次打开新的标签时如果超过最大标签数，\n会自动关闭一个最先打开的标签\n设置为 0 则不限制"
      >
        最大标签数
      </NumberFieldCom>
      <SwitchItem
        checked={preferences.tabbar.draggable}
        disabled={!preferences.tabbar.enable}
        onChange={(checked) => {
          updatePreferences({ tabbar: { draggable: checked } });
        }}
      >
        标签页可拖拽
      </SwitchItem>
      <SwitchItem
        onChange={(checked) => {
          updatePreferences({ tabbar: { wheelable: checked } });
        }}
        tip="开启后，标签栏区域可以响应滚轮的纵向滚动事件。\n关闭时，只能响应系统的横向滚动事件（需要按下Shift再滚动滚轮）"
      >
        启用纵向滚轮响应
      </SwitchItem>
      <SwitchItem
        checked={preferences.tabbar.middleClickToClose}
        disabled={!preferences.tabbar.enable}
        onChange={(checked) => {
          updatePreferences({ tabbar: { middleClickToClose: checked } });
        }}
      >
        点击鼠标中键关闭标签页
      </SwitchItem>
      <SwitchItem
        checked={preferences.tabbar.showIcon}
        disabled={!preferences.tabbar.enable}
        onChange={(checked) => {
          updatePreferences({ tabbar: { showIcon: checked } });
        }}
      >
        显示标签页图标
      </SwitchItem>
      <SwitchItem
        checked={preferences.tabbar.showMore}
        disabled={!preferences.tabbar.enable}
        onChange={(checked) => {
          updatePreferences({ tabbar: { showMore: checked } });
        }}
      >
        显示更多按钮
      </SwitchItem>
      <SwitchItem
        checked={preferences.tabbar.showMaximize}
        disabled={!preferences.tabbar.enable}
        onChange={(checked) => {
          updatePreferences({ tabbar: { showMaximize: checked } });
        }}
      >
        显示最大化按钮
      </SwitchItem>
      <ToggleItem
        disabled={!preferences.tabbar.enable}
        items={styleItems}
        onChange={(value) => {
          if (value) {
            updatePreferences({
              tabbar: { styleType: value as TabsStyleType },
            });
          }
        }}
        value={preferences.tabbar.styleType}
      >
        标签页风格
      </ToggleItem>
    </>
  );
}
