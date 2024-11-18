import type { Linter } from 'eslint';

import { interopDefault } from '../util';

/**
 * ESLint 注释相关规则配置
 * 用于规范和限制 ESLint 注释的使用
 */
export async function comments(): Promise<Linter.Config[]> {
  const [pluginComments] = await Promise.all([
    // @ts-expect-error - no types
    interopDefault(import('eslint-plugin-eslint-comments')),
  ] as const);

  return [
    {
      plugins: {
        'eslint-comments': pluginComments,
      },
      rules: {
        // 禁止使用 eslint-enable 注释来启用多个规则
        'eslint-comments/no-aggregating-enable': 'error',
        // 禁止重复的 eslint-disable 注释
        'eslint-comments/no-duplicate-disable': 'error',
        // 禁止使用没有具体规则的 eslint-disable 注释
        'eslint-comments/no-unlimited-disable': 'error',
        // 禁止使用未匹配的 eslint-enable 注释
        'eslint-comments/no-unused-enable': 'error',
      },
    },
  ];
}
