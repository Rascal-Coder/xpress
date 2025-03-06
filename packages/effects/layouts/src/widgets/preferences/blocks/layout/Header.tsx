import type { LayoutHeaderModeType } from '@xpress-core/typings';

import {
  type LayoutHeaderMenuAlignType,
  usePreferencesContext,
} from '@xpress-core/preferences';

import { PreferenceSelectItem } from '../SelectItem';
import { SwitchItem } from '../SwitchItem';
import { ToggleItem } from '../ToggleItem';

export const Header = () => {
  const { isFullContent, preferences, updatePreferences } =
    usePreferencesContext();
  const disabled = isFullContent;
  const headerMenuAlignItems = [
    { label: '左侧', value: 'start' },
    { label: '居中', value: 'center' },
    { label: '右侧', value: 'end' },
  ];
  const headerMenuVisibleModes = [
    { label: '静止', value: 'static' },
    { label: '固定', value: 'fixed' },
    { label: '自动隐藏和显示', value: 'auto' },
    { label: '滚动隐藏和显示', value: 'auto-scroll' },
  ];
  return (
    <>
      <SwitchItem
        checked={preferences.header.enable}
        disabled={disabled}
        onChange={(checked) => {
          updatePreferences({ header: { enable: checked } });
        }}
      >
        显示顶栏
      </SwitchItem>
      <PreferenceSelectItem
        defaultValue={preferences.header.mode}
        items={headerMenuVisibleModes}
        onChange={(value) => {
          updatePreferences({
            header: { mode: value as LayoutHeaderModeType },
          });
        }}
      >
        模式
      </PreferenceSelectItem>
      <ToggleItem
        items={headerMenuAlignItems}
        onChange={(value) => {
          updatePreferences({
            header: { menuAlign: value as LayoutHeaderMenuAlignType },
          });
        }}
        value={preferences.header.menuAlign}
      >
        菜单位置
      </ToggleItem>
    </>
  );
};
