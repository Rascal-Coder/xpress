import type { Linter } from 'eslint';

import { interopDefault } from '../util';

export async function react(): Promise<Linter.Config[]> {
  const [pluginReact, pluginReactHooks, pluginReactRefresh] = await Promise.all(
    [
      interopDefault(import('eslint-plugin-react')),
      interopDefault(import('eslint-plugin-react-hooks')),
      interopDefault(import('eslint-plugin-react-refresh')),
    ] as const,
  );

  return [
    {
      files: ['**/*.?([cm])[jt]s?(x)'],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          sourceType: 'module',
        },
      },
      plugins: {
        react: pluginReact,
        'react-hooks': pluginReactHooks,
        'react-refresh': pluginReactRefresh,
      },
      rules: {
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',

        // react refresh
        'react-refresh/only-export-components': 'off',

        ...pluginReact.configs.recommended.rules,
        'react/jsx-uses-react': 'off',
        'react/prop-types': 'off',
        // react runtime
        'react/react-in-jsx-scope': 'off',
      },
      settings: {
        react: {
          runtime: 'automatic',
          version: '18.3.1', // 使用固定版本，与 pnpm-workspace.yaml 中的版本保持一致
        },
      },
    },
  ];
}
