import { usePreferencesContext } from '@xpress-core/preferences';

import { SwitchItem } from '../SwitchItem';

export const Other = () => {
  const { updatePreferences, preferences } = usePreferencesContext();
  return (
    <>
      <SwitchItem
        checked={preferences.app.colorWeakMode}
        onChange={(checked) =>
          updatePreferences({ app: { colorWeakMode: checked } })
        }
      >
        色弱模式
      </SwitchItem>
      <SwitchItem
        checked={preferences.app.colorGrayMode}
        onChange={(checked) =>
          updatePreferences({ app: { colorGrayMode: checked } })
        }
      >
        灰色模式
      </SwitchItem>
    </>
  );
};
