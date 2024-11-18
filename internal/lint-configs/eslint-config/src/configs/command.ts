import createCommand from 'eslint-plugin-command/config';

/**
 * ESLint 命令相关规则配置
 * 用于规范和限制 ESLint 命令的使用
 */
export async function command() {
  return [
    {
      // @ts-expect-error - no types
      ...createCommand(),
    },
  ];
}
