import type { Linter } from 'eslint';

import { interopDefault } from '../util';

// 导出异步函数，返回 ESLint 配置数组
export async function typescript(): Promise<Linter.Config[]> {
  // 异步加载 TypeScript ESLint 插件和解析器
  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    // @ts-expect-error missing types
    interopDefault(import('@typescript-eslint/parser')),
  ] as const);

  return [
    {
      // 匹配所有 TypeScript 和 JavaScript 文件（包括 JSX/TSX）
      files: ['**/*.?([cm])[jt]s?(x)'],

      // 语言选项配置
      languageOptions: {
        parser: parserTs, // 使用 TypeScript 解析器
        parserOptions: {
          createDefaultProgram: false,
          ecmaFeatures: {
            jsx: true, // 启用 JSX 支持
          },
          ecmaVersion: 'latest', // 使用最新的 ECMAScript 版本
          jsxPragma: 'React', // 设置 JSX 编译为 React.createElement
          project: './tsconfig.*.json', // TypeScript 配置文件路径
          sourceType: 'module', // 使用 ES 模块
        },
      },

      // 配置 TypeScript ESLint 插件
      plugins: {
        '@typescript-eslint': pluginTs,
      },

      // ESLint 规则配置
      rules: {
        // 继承推荐配置和严格配置的规则
        ...pluginTs.configs['eslint-recommended'].overrides?.[0].rules,
        ...pluginTs.configs.strict.rules,

        // TypeScript 注释相关规则
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-check': false,
            'ts-expect-error': 'allow-with-description', // 允许带描述的 @ts-expect-error
            'ts-ignore': 'allow-with-description', // 允许带描述的 @ts-ignore
            'ts-nocheck': 'allow-with-description', // 允许带描述的 @ts-nocheck
          },
        ],

        // 关闭类型定义一致性检查（interface vs type）
        '@typescript-eslint/consistent-type-definitions': 'off',

        // 关闭函数返回类型必须显式声明的规则
        '@typescript-eslint/explicit-function-return-type': 'off',

        // 关闭模块边界类型必须显式声明的规则
        '@typescript-eslint/explicit-module-boundary-types': 'off',

        // 配置空函数规则
        '@typescript-eslint/no-empty-function': [
          'error',
          {
            allow: ['arrowFunctions', 'functions', 'methods'], // 允许空的箭头函数、普通函数和方法
          },
        ],

        // 关闭 any 类型检查
        '@typescript-eslint/no-explicit-any': 'off',

        // 关闭命名空间使用限制
        '@typescript-eslint/no-namespace': 'off',

        // 禁止使用非空断言
        '@typescript-eslint/no-non-null-assertion': 'error',

        // 关闭未使用表达式检查
        '@typescript-eslint/no-unused-expressions': 'off',

        // 未使用变量检查配置
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_', // 忽略以下划线开头的参数
            varsIgnorePattern: '^_', // 忽略以下划线开头的变量
          },
        ],

        // 关闭在定义前使用变量的检查
        '@typescript-eslint/no-use-before-define': 'off',

        // 禁止使用 require 语句
        '@typescript-eslint/no-var-requires': 'error',

        // 关闭未使用导入的检查（由 TypeScript 处理）
        'unused-imports/no-unused-vars': 'off',
      },
    },
  ];
}
