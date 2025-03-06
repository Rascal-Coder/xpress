import type { NavigationStyleType } from '@xpress-core/typings';

import { usePreferencesContext } from '@xpress-core/preferences';

import { SwitchItem } from '../SwitchItem';
import { ToggleItem } from '../ToggleItem';

const stylesItems: { label: string; value: string }[] = [
  { label: '圆润', value: 'rounded' },
  { label: '朴素', value: 'plain' },
];
export const Navigation = () => {
  const { preferences, updatePreferences, isMixedNav, isFullContent } =
    usePreferencesContext();
  return (
    <>
      <ToggleItem
        items={stylesItems}
        onChange={(value) => {
          updatePreferences({
            navigation: { styleType: value as NavigationStyleType },
          });
        }}
        value={preferences.navigation.styleType}
      >
        导航菜单风格
      </ToggleItem>
      <SwitchItem
        checked={preferences.navigation.split}
        disabled={!isMixedNav || isFullContent}
        onChange={(value) => {
          updatePreferences({ navigation: { split: value } });
        }}
        tip="开启时，侧边栏显示顶栏对应菜单的子菜单"
      >
        导航菜单分离
      </SwitchItem>
      <SwitchItem
        checked={preferences.navigation.accordion}
        disabled={isFullContent}
        onChange={(value) => {
          updatePreferences({ navigation: { accordion: value } });
        }}
      >
        侧边导航菜单手风琴模式
      </SwitchItem>
    </>
  );
};
