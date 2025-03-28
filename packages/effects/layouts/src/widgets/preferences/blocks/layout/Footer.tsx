import { usePreferencesContext } from '@xpress-core/preferences';

import { SwitchItem } from '../SwitchItem';

export const Footer = () => {
  const { preferences, updatePreferences } = usePreferencesContext();
  return (
    <>
      <SwitchItem
        checked={preferences.footer.enable}
        onChange={(checked) => {
          updatePreferences({ footer: { enable: checked } });
        }}
      >
        显示页脚
      </SwitchItem>
      <SwitchItem
        checked={preferences.footer.fixed}
        disabled={!preferences.footer.enable}
        onChange={(checked) => {
          updatePreferences({ footer: { fixed: checked } });
        }}
      >
        固定页脚
      </SwitchItem>
    </>
  );
};
