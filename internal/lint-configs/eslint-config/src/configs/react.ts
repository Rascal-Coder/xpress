import type { Linter } from 'eslint';

import { interopDefault } from '../util';

export async function react(): Promise<Linter.Config[]> {
  const [pluginReactHooks, pluginReactRefresh] = await Promise.all([
    // @ts-expect-error missing types
    interopDefault(import('eslint-plugin-react-hooks')),
    // @ts-expect-error missing types
    interopDefault(import('eslint-plugin-react-refresh')),
  ] as const);

  return [
    {
      plugins: {
        'react-hooks': pluginReactHooks,
        'react-refresh': pluginReactRefresh,
      },
      rules: {
        ...pluginReactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': [
          'warn',
          {
            allowConstantExport: true,
          },
        ],
      },
    },
  ];
}
