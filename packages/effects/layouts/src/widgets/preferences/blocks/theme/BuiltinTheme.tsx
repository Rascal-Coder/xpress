import type { BuiltinThemeType } from '@xpress-core/typings';

import { UserRoundPen } from '@xpress/icons';
import {
  BUILT_IN_THEME_PRESETS,
  type BuiltinThemePreset,
  usePreferencesContext,
} from '@xpress-core/preferences';
import { convertToHsl, TinyColor } from '@xpress-core/shared/color';

import { useMemo, useRef, useState } from 'react';

export const BuiltinTheme = () => {
  // const [theme, setTheme] = useState<BuiltinThemeType>('default');
  const { updatePreferences, preferences } = usePreferencesContext();
  const theme = preferences.theme.builtinType;
  const builtinThemePresets = useMemo(() => {
    return [...BUILT_IN_THEME_PRESETS];
  }, []);

  const handleSelectTheme = (preset: BuiltinThemePreset) => {
    // setTheme(preset.type);
    updatePreferences({
      theme: {
        builtinType: preset.type,
        colorPrimary: preset.color,
      },
    });
  };

  const typeView = (name: BuiltinThemeType) => {
    switch (name) {
      case 'custom': {
        return '自定义';
      }
      case 'deep-blue': {
        return '深蓝色';
      }
      case 'deep-green': {
        return '深绿色';
      }
      case 'default': {
        return '默认';
      }
      case 'gray': {
        return '中灰色';
      }
      case 'green': {
        return '浅绿色';
      }
      case 'neutral': {
        return '中性色';
      }
      case 'orange': {
        return '橙黄色';
      }
      case 'pink': {
        return '樱花粉';
      }
      case 'rose': {
        return '玫瑰红';
      }
      case 'sky-blue': {
        return '天蓝色';
      }
      case 'slate': {
        return '石板灰';
      }
      case 'violet': {
        return '紫罗兰';
      }
      case 'yellow': {
        return '柠檬黄';
      }
      case 'zinc': {
        return '锌色灰';
      }
    }
  };
  const colorInput = useRef<HTMLInputElement>(null);
  const [colorPrimary, setColorPrimary] = useState(
    preferences.theme.colorPrimary,
  );
  const inputValue = useMemo(() => {
    return new TinyColor(colorPrimary || '').toHexString();
  }, [colorPrimary]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const themeColorPrimary = convertToHsl(target.value);
    setColorPrimary(themeColorPrimary);
    updatePreferences({ theme: { colorPrimary: themeColorPrimary } });
  };
  return (
    <div className="flex w-full flex-wrap justify-between">
      {builtinThemePresets.map((preset) => (
        <div key={preset.type}>
          <div
            className="flex cursor-pointer flex-col"
            onClick={() => {
              handleSelectTheme(preset);
              if (preset.type === 'custom' && colorInput.current) {
                colorInput.current?.click();
              }
            }}
          >
            <div
              className={`outline-box flex-center group cursor-pointer ${
                theme === preset.type && 'outline-box-active'
              }`}
            >
              {preset.type === 'custom' ? (
                <div className="size-full px-10 py-2">
                  <div className="flex-center relative size-5 rounded-sm">
                    <UserRoundPen className="absolute z-10 size-5 opacity-60 group-hover:opacity-100" />
                    <input
                      className="absolute inset-0 opacity-0"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onInput={handleInputChange}
                      ref={colorInput}
                      type="color"
                      value={inputValue}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="mx-10 my-2 size-5 rounded-md"
                  style={{ backgroundColor: preset.color }}
                ></div>
              )}
            </div>
            <div className="text-muted-foreground my-2 text-center text-xs">
              {typeView(preset.type)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
