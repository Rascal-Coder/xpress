import type { TabsStyleType } from '@xpress-core/typings';

import { usePreferencesContext } from '@xpress-core/preferences';

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
  return (
    <ToggleItem
      disabled={!preferences.tabbar.enable}
      items={styleItems}
      onChange={(value) => {
        updatePreferences({
          tabbar: { styleType: value as TabsStyleType },
        });
      }}
      value={preferences.tabbar.styleType}
    >
      面包屑风格
    </ToggleItem>
  );
}
