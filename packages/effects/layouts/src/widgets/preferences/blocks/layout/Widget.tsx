import type { PreferencesButtonPositionType } from '@xpress-core/typings';

import { usePreferencesContext } from '@xpress-core/preferences';

import { SwitchItem } from '../SwitchItem';
import { ToggleItem } from '../ToggleItem';

export function Widget() {
  const { preferences, updatePreferences } = usePreferencesContext();
  const styleItems = [
    {
      label: '自动',
      value: 'auto',
    },
    {
      label: '顶栏',
      value: 'header',
    },
    {
      label: '固定',
      value: 'fixed',
    },
  ];
  return (
    <>
      <SwitchItem
        checked={preferences.widget.globalSearch}
        onChange={(checked) => {
          updatePreferences({ widget: { globalSearch: checked } });
        }}
      >
        启用全局搜索
      </SwitchItem>
      <SwitchItem
        checked={preferences.widget.themeToggle}
        onChange={(checked) => {
          updatePreferences({ widget: { themeToggle: checked } });
        }}
      >
        启用主题切换
      </SwitchItem>
      <SwitchItem
        checked={preferences.widget.languageToggle}
        onChange={(checked) => {
          updatePreferences({ widget: { languageToggle: checked } });
        }}
      >
        启用语言切换
      </SwitchItem>
      <SwitchItem
        checked={preferences.widget.fullscreen}
        onChange={(checked) => {
          updatePreferences({ widget: { fullscreen: checked } });
        }}
      >
        启用全屏
      </SwitchItem>
      <SwitchItem
        checked={preferences.widget.notification}
        onChange={(checked) => {
          updatePreferences({ widget: { notification: checked } });
        }}
      >
        启用通知
      </SwitchItem>
      {/* <SwitchItem
        checked={preferences.widget.lockScreen}
        onChange={(checked) => {
          updatePreferences({ widget: { lockScreen: checked } });
        }}
      >
        启用锁屏
      </SwitchItem> */}
      <SwitchItem
        checked={preferences.widget.sidebarToggle}
        onChange={(checked) => {
          updatePreferences({ widget: { sidebarToggle: checked } });
        }}
      >
        启用侧边栏切换
      </SwitchItem>
      <SwitchItem
        checked={preferences.widget.refresh}
        onChange={(checked) => {
          updatePreferences({ widget: { refresh: checked } });
        }}
      >
        启用刷新
      </SwitchItem>
      <ToggleItem
        items={styleItems}
        onChange={(value) => {
          if (value) {
            updatePreferences({
              app: {
                preferencesButtonPosition:
                  value as PreferencesButtonPositionType,
              },
            });
          }
        }}
        value={preferences.app.preferencesButtonPosition}
      >
        偏好设置位置
      </ToggleItem>
    </>
  );
}
