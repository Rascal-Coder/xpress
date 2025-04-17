import { usePreferencesContext } from '@xpress-core/preferences';

import { SwitchItem } from '../SwitchItem';

export const General = () => {
  const { preferences, updatePreferences } = usePreferencesContext();
  return (
    <>
      <SwitchItem
        checked={preferences.app.dynamicTitle}
        onChange={(value) => {
          updatePreferences({ app: { dynamicTitle: value } });
        }}
      >
        动态标题
      </SwitchItem>
      <SwitchItem
        checked={preferences.app.watermark}
        onChange={(value) => {
          updatePreferences({ app: { watermark: value } });
        }}
      >
        水印
      </SwitchItem>
      <SwitchItem
        checked={preferences.app.enableCheckUpdates}
        onChange={(value) => {
          updatePreferences({ app: { enableCheckUpdates: value } });
        }}
      >
        自动检查更新
      </SwitchItem>
    </>
  );
};
