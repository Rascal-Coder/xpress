import type { Linter } from 'eslint';

/**
 * ESLint 规则禁用配置
 * 针对特定文件类型禁用某些规则
 */
export async function disableds(): Promise<Linter.Config[]> {
  return [
    {
      // 测试文件的规则配置
      files: ['**/__tests__/**/*.?([cm])[jt]s?(x)'],
      name: 'disables/test',
      rules: {
        // 允许在测试文件中使用 @ts-comment
        '@typescript-eslint/ban-ts-comment': 'off',
        // 允许在测试文件中使用 console
        'no-console': 'off',
      },
    },
    {
      // 类型声明文件(.d.ts)的规则配置
      files: ['**/*.d.ts'],
      name: 'disables/dts',
      rules: {
        // 允许使用三斜线引用指令
        '@typescript-eslint/triple-slash-reference': 'off',
      },
    },
    {
      // JavaScript 文件的规则配置
      files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
      name: 'disables/js',
      rules: {
        // 关闭导出函数必须指定返回类型的检查
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ];
}
