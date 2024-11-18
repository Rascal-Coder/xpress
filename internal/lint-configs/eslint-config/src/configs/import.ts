import type { Linter } from 'eslint';

import * as pluginImport from 'eslint-plugin-import-x';

/**
 * 导出 ESLint import 插件相关配置
 * 用于规范导入语句的格式和顺序
 */
export async function importPluginConfig(): Promise<Linter.Config[]> {
  return [
    {
      plugins: {
        // @ts-expect-error - This is a dynamic import
        import: pluginImport,
      },
      rules: {
        // 确保所有导入语句都在文件顶部
        'import/first': 'error',

        // 导入语句之后需要空行
        'import/newline-after-import': 'error',

        // 禁止重复导入
        'import/no-duplicates': 'error',

        // 禁止导出可变的绑定
        'import/no-mutable-exports': 'error',

        // 禁止使用命名的默认导出
        'import/no-named-default': 'error',

        // 禁止模块导入自身
        'import/no-self-import': 'error',

        // 关闭检查模块是否能够解析
        'import/no-unresolved': 'off',

        // 禁止使用 Webpack 加载器语法
        'import/no-webpack-loader-syntax': 'error',
      },
    },
  ];
}
