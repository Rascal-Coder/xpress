import type { Linter } from 'eslint';

// 定义不需要进行导入限制检查的文件
const restrictedImportIgnores = [
  '**/vite.config.mts',
  '**/tailwind.config.mjs',
  '**/postcss.config.mjs',
];

// 自定义 ESLint 配置数组
const customConfig: Linter.Config[] = [
  // shadcn-ui 组件的配置
  // {
  //   files: ['packages/@core/ui-kit/shadcn-ui/**/**'],
  // },
  // 针对主要应用和包的基础配置
  {
    files: [
      'apps/**/**',
      'packages/effects/**/**',
      'packages/utils/**/**',
      'packages/types/**/**',
      'packages/locales/**/**',
    ],
    ignores: restrictedImportIgnores,
    rules: {
      // 关闭接口和对象排序规则
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-objects': 'off',
    },
  },

  // apps 目录下的导入限制规则
  {
    files: ['apps/**/**'],
    ignores: restrictedImportIgnores,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            // 禁止直接导入 #/api、#/layouts、#/locales、#/stores
            // 要求使用 @core 包
            {
              group: ['#/api/*'],
              message:
                'The #/api package cannot be imported, please use the @core package itself',
            },
            {
              group: ['#/layouts/*'],
              message:
                'The #/layouts package cannot be imported, please use the @core package itself',
            },
            {
              group: ['#/locales/*'],
              message:
                'The #/locales package cannot be imported, please use the @core package itself',
            },
            {
              group: ['#/stores/*'],
              message:
                'The #/stores package cannot be imported, please use the @core package itself',
            },
          ],
        },
      ],
      'perfectionist/sort-interfaces': 'off',
    },
  },

  // @core 包的导入限制
  {
    files: ['packages/@core/**/**'],
    ignores: restrictedImportIgnores,
    rules: {
      // 禁止 @core 包导入 @xpress 包
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@xpress/*'],
              message:
                'The @core package cannot import the @xpress package, please use the @core package itself',
            },
          ],
        },
      ],
    },
  },

  // @core/base 包的导入限制
  {
    files: ['packages/@core/base/**/**'],
    ignores: restrictedImportIgnores,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@xpress/*', '@xpress-core/*'],
              message:
                'The @core/base package cannot import the @xpress package, please use the @core/base package itself',
            },
          ],
        },
      ],
    },
  },

  // 不能引入@xpress/*里面的包
  {
    files: [
      'packages/types/**/**',
      'packages/utils/**/**',
      'packages/icons/**/**',
      'packages/constants/**/**',
      'packages/styles/**/**',
      'packages/stores/**/**',
      'packages/preferences/**/**',
      'packages/locales/**/**',
    ],
    ignores: restrictedImportIgnores,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@xpress/*'],
              message:
                'The @xpress package cannot be imported, please use the @core package itself',
            },
          ],
        },
      ],
    },
  },

  // 后端模拟代码，不需要太多规则
  {
    files: ['apps/backend-mock/**/**', 'docs/**/**'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      'n/no-extraneous-import': 'off',
      'n/prefer-global/buffer': 'off',
      'n/prefer-global/process': 'off',
      'no-console': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'unicorn/prefer-module': 'off',
    },
  },
  {
    files: ['**/**/playwright.config.ts'],
    rules: {
      'n/prefer-global/buffer': 'off',
      'n/prefer-global/process': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['internal/**/**', 'scripts/**/**'],
    rules: {
      'no-console': 'off',
    },
  },
];

export { customConfig };
