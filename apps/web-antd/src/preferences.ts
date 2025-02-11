import type { Preferences } from '@xpress-core/preferences';
import type { DeepPartial } from '@xpress-core/typings';
/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences: DeepPartial<Preferences> = {
  // overrides
  app: {
    name: '测试213',
  },
  theme: {
    builtinType: 'pink',
    colorPrimary: 'hsl(347 77% 60%)',
    mode: 'light',
  },
};
