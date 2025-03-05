import { usePreferencesContext } from '@xpress-core/preferences';

import { SwitchItem } from '../SwitchItem';

export const Header = () => {
  const { isFullContent, preferences, updatePreferences } =
    usePreferencesContext();
  const disabled = isFullContent;
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
    </>
  );
};
