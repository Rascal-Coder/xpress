import type { Linter } from 'eslint';

import { interopDefault } from '../util';

export async function test(): Promise<Linter.Config[]> {
  const [pluginTest, pluginNoOnlyTests] = await Promise.all([
    interopDefault(import('eslint-plugin-vitest')),
    // @ts-expect-error - no types
    interopDefault(import('eslint-plugin-no-only-tests')),
  ] as const);

  return [
    {
      files: [
        '**/__tests__/**/*.{js,jsx,ts,tsx}',
        '**/*.{spec,test}.{js,jsx,ts,tsx}',
      ],
      plugins: {
        test: {
          ...pluginTest,
          rules: {
            ...pluginTest.rules,
            ...pluginNoOnlyTests.rules,
          },
        },
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'react/display-name': 'off',
        'react/jsx-no-constructed-context-values': 'off',
        'react-hooks/rules-of-hooks': 'off',

        'test/consistent-test-it': [
          'error',
          { fn: 'it', withinDescribe: 'it' },
        ],
        'test/no-identical-title': 'error',
        'test/prefer-hooks-in-order': 'error',
        'test/prefer-lowercase-title': 'error',
      },
    },
  ];
}
