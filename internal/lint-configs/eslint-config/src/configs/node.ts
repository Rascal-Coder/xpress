import type { Linter } from 'eslint';

import { interopDefault } from '../util';

/**
 * 导出 Node.js 相关的 ESLint 配置
 * @returns ESLint 配置数组
 */
export async function node(): Promise<Linter.Config[]> {
  // 动态导入并获取 eslint-plugin-n 插件
  const pluginNode = await interopDefault(import('eslint-plugin-n'));

  return [
    {
      plugins: {
        n: pluginNode,
      },
      rules: {
        // 强制回调错误处理
        'n/handle-callback-err': ['error', '^(err|error)$'],
        // 禁止使用已废弃的 Node.js API
        'n/no-deprecated-api': 'error',
        // 禁止对 exports 对象进行赋值
        'n/no-exports-assign': 'error',
        // 禁止导入额外的依赖，但允许特定模块
        'n/no-extraneous-import': [
          'error',
          {
            allowModules: [
              'unbuild',
              '@xpress/vite-config',
              'vitest',
              'vite',
              '@xpress/tailwind-config',
              '@testing-library/react',
              'msw',
            ],
          },
        ],
        // 禁止使用 new require
        'n/no-new-require': 'error',
        // 禁止使用 __dirname 或 __filename 与字符串拼接
        'n/no-path-concat': 'error',
        // 检查不支持的 ES 语法特性
        'n/no-unsupported-features/es-syntax': [
          'error',
          {
            ignores: ['modules', 'dynamicImport'],
            version: '>=20.10.0',
          },
        ],
        // 强制使用 Buffer 而不是全局 Buffer
        'n/prefer-global/buffer': ['error', 'never'],
        // 强制使用 process 而不是全局 process
        'n/prefer-global/process': ['error', 'never'],
        // 将 process.exit() 视为 throw
        'n/process-exit-as-throw': 'error',
      },
    },
    {
      // 针对特定文件的规则覆盖
      files: [
        'scripts/**/*.?([cm])[jt]s?(x)',
        'internal/**/*.?([cm])[jt]s?(x)',
      ],
      rules: {
        // 在脚本和内部文件中允许使用全局 process
        'n/prefer-global/process': 'off',
      },
    },
  ];
}
