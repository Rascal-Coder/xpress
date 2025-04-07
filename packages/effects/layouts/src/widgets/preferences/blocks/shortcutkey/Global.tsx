import { usePreferencesContext } from '@xpress-core/preferences';
import { isWindowsOs } from '@xpress-core/shared/utils';

import { SwitchItem } from '../SwitchItem';

export const Global = () => {
  const { preferences, updatePreferences } = usePreferencesContext();
  return (
    <>
      <SwitchItem
        checked={preferences.shortcutKeys.enable}
        onChange={(value) => {
          updatePreferences({ shortcutKeys: { enable: value } });
        }}
      >
        快捷键
      </SwitchItem>
      <SwitchItem
        checked={preferences.shortcutKeys.globalSearch}
        disabled={!preferences.shortcutKeys.enable}
        onChange={(value) => {
          updatePreferences({ shortcutKeys: { globalSearch: value } });
        }}
        shortcut={
          <>
            {isWindowsOs() ? 'Ctrl' : '⌘'}
            <kbd> K </kbd>
          </>
        }
      >
        全局搜索
      </SwitchItem>
      <SwitchItem
        checked={preferences.shortcutKeys.globalLogout}
        disabled={!preferences.shortcutKeys.enable}
        onChange={(value) => {
          updatePreferences({ shortcutKeys: { globalLogout: value } });
        }}
        shortcut={<>{isWindowsOs() ? 'Alt' : '⌥'} Q</>}
      >
        退出登录
      </SwitchItem>
    </>
  );
};
