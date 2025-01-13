import type { Linter } from 'eslint';

import { interopDefault } from '../util';

// 导出异步函数，返回 ESLint unicorn 插件配置
export async function unicorn(): Promise<Linter.Config[]> {
  // 动态导入 eslint-plugin-unicorn
  const [pluginUnicorn] = await Promise.all([
    interopDefault(import('eslint-plugin-unicorn')),
  ] as const);

  return [
    {
      // 适用于所有 JS/TS 文件
      files: ['**/*.?([cm])[jt]s?(x)'],
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        // 继承 unicorn 推荐配置
        ...pluginUnicorn.configs.recommended.rules,

        // 自定义规则配置
        'unicorn/better-regex': 'off', // 允许使用简单的正则表达式
        'unicorn/consistent-destructuring': 'off', // 允许不同风格的解构
        'unicorn/consistent-function-scoping': 'off', // 允许灵活的函数作用域
        'unicorn/expiring-todo-comments': 'off', // 允许永久的 TODO 注释
        'unicorn/filename-case': 'off', // 允许任意的文件命名方式
        'unicorn/import-style': 'off', // 允许任意的导入风格
        'unicorn/no-array-for-each': 'off', // 允许使用 forEach
        'unicorn/no-null': 'off', // 允许使用 null
        'unicorn/no-useless-undefined': 'off', // 允许显式的 undefined
        'unicorn/prefer-at': 'off', // 允许使用传统的数组索引访问
        'unicorn/prefer-dom-node-text-content': 'off', // 允许使用 innerText
        // 强制使用 export from，但允许使用的变量除外
        'unicorn/prefer-export-from': ['error', { ignoreUsedVariables: true }],
        'unicorn/prefer-global-this': 'off', // 允许使用 window 对象
        'unicorn/prefer-top-level-await': 'off', // 允许在非顶级使用 await
        'unicorn/prevent-abbreviations': 'off', // 允许使用缩写
      },
    },

    // 脚本文件的特殊规则
    {
      files: [
        'scripts/**/*.?([cm])[jt]s?(x)',
        'internal/**/*.?([cm])[jt]s?(x)',
        'packages/@core/file-router/**/*.?([cm])[jt]s?(x)',
      ],
      rules: {
        'unicorn/no-process-exit': 'off', // 允许使用 process.exit()
      },
    },
  ];
}
