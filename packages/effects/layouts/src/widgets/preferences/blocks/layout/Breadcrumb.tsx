import { usePreferencesContext } from '@xpress-core/preferences';

import { SwitchItem } from '../SwitchItem';

export const Breadcrumb = () => {
  const { preferences, updatePreferences } = usePreferencesContext();
  return (
    <>
      <SwitchItem
        checked={preferences.breadcrumb.enable}
        onChange={(value) => {
          updatePreferences({ breadcrumb: { enable: value } });
        }}
      >
        开启面包屑导航
      </SwitchItem>
    </>
  );
};
