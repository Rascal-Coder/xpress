import Color from 'color';

interface HslValues {
  h: number;
  s: number;
  l: number;
}

function parseHslValues(hslString: string): HslValues | null {
  const values = hslString.split(' ').map((v) => Number.parseFloat(v));
  if (values.length < 3) return null;

  const h = values[0] as number;
  const s = values[1] as number;
  const l = values[2] as number;

  if (Number.isNaN(h) || Number.isNaN(s) || Number.isNaN(l)) return null;

  return { h, s, l };
}

function getLatestCssVariable(varName: string): string {
  const element = document.documentElement;
  const computedValue = getComputedStyle(element)
    .getPropertyValue(varName)
    .trim();
  return computedValue;
}

export function convertHslToHex(hslValue: string): string {
  try {
    // 检查是否是 CSS 变量引用
    if (hslValue.includes('var(')) {
      // 提取变量名
      const varName = hslValue.match(/var\(([^)]+)\)/)?.[1];
      if (!varName) return hslValue;

      let latestValue = '';
      // 使用MutationObserver监听样式变化
      const observer = new MutationObserver(() => {
        latestValue = getLatestCssVariable(varName);
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style'],
      });

      if (!latestValue) return hslValue;

      // 解析 HSL 值
      const hslValues = parseHslValues(latestValue);
      if (!hslValues) {
        console.warn('Invalid HSL values:', latestValue);
        return hslValue;
      }

      // 转换为 HEX
      return Color.hsl(hslValues.h, hslValues.s, hslValues.l).hex();
    }
    return hslValue;
  } catch (error) {
    console.error('Color conversion error:', error);
    return hslValue;
  }
}

type ThemeObject = Record<string, any>;

export function convertThemeColorsToHex(theme: ThemeObject): ThemeObject {
  const result: ThemeObject = {};

  for (const [key, value] of Object.entries(theme)) {
    if (typeof value === 'string' && value.includes('hsl(var(')) {
      result[key] = convertHslToHex(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = Array.isArray(value)
        ? value.map((item) =>
            typeof item === 'object' ? convertThemeColorsToHex(item) : item,
          )
        : convertThemeColorsToHex(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
