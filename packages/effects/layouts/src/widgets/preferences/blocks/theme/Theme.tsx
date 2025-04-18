import type { Icon, ThemeModeType } from '@xpress-core/typings';

import { MoonStar, Sun, SunMoon } from '@xpress/icons';
import { usePreferencesContext } from '@xpress-core/preferences';

import { useState } from 'react';

import { SwitchItem } from '../SwitchItem';

const THEME_PRESET: Array<{ icon: Icon; label: string; name: ThemeModeType }> =
  [
    {
      icon: Sun,
      name: 'light',
      label: '浅色',
    },
    {
      icon: MoonStar,
      name: 'dark',
      label: '深色',
    },
    {
      icon: SunMoon,
      name: 'auto',
      label: '跟随系统',
    },
  ];

export const Theme = () => {
  const {
    updatePreferences,
    theme: currentTheme,
    preferences,
  } = usePreferencesContext();

  const [theme, setTheme] = useState<ThemeModeType>(currentTheme);
  const handleClick = (name: ThemeModeType) => {
    setTheme(name);
    updatePreferences({ theme: { mode: name } });
  };
  return (
    <div className="flex w-full flex-wrap justify-between">
      {THEME_PRESET.map((item) => (
        <div
          className="flex cursor-pointer flex-col"
          key={item.name}
          onClick={() => handleClick(item.name)}
        >
          <div
            className={`outline-box flex-center py-4 ${theme === item.name && 'outline-box-active'}`}
          >
            <item.icon className="mx-9 size-5" />
          </div>
          <div className="text-muted-foreground mt-2 text-center text-xs">
            {item.label}
          </div>
        </div>
      ))}
      <SwitchItem
        checked={preferences.theme.enableThemeAnimation}
        onChange={(checked) =>
          updatePreferences({ theme: { enableThemeAnimation: checked } })
        }
      >
        开启主题切换动画
      </SwitchItem>
      <SwitchItem
        checked={preferences.theme.semiDarkSidebar}
        className="mt-6"
        disabled={theme === 'dark'}
        onChange={(checked) =>
          updatePreferences({ theme: { semiDarkSidebar: checked } })
        }
      >
        深色侧边栏
      </SwitchItem>
      <SwitchItem
        checked={preferences.theme.semiDarkHeader}
        disabled={theme === 'dark'}
        onChange={(checked) =>
          updatePreferences({ theme: { semiDarkHeader: checked } })
        }
      >
        深色顶栏
      </SwitchItem>
    </div>
  );
};
