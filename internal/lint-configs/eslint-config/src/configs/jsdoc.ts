import type { Linter } from 'eslint';

import { interopDefault } from '../util';

/**
 * JSDoc ESLint 配置
 * 用于规范项目中的 JSDoc 文档注释
 * @returns ESLint 配置数组
 */
export async function jsdoc(): Promise<Linter.Config[]> {
  const [pluginJsdoc] = await Promise.all([
    interopDefault(import('eslint-plugin-jsdoc')),
  ] as const);

  return [
    {
      plugins: {
        jsdoc: pluginJsdoc,
      },
      // JSDoc 规则配置
      // 所有规则设置为 warn 级别，在违反规则时给出警告
      rules: {
        'jsdoc/check-access': 'warn', // @access 标签检查
        'jsdoc/check-param-names': 'warn', // 参数名称检查
        'jsdoc/check-property-names': 'warn', // 属性名称检查
        'jsdoc/check-types': 'warn', // 类型注释检查
        'jsdoc/empty-tags': 'warn', // 空标签检查
        'jsdoc/implements-on-classes': 'warn', // 类实现标签检查
        'jsdoc/no-defaults': 'warn', // 禁止默认值语法
        'jsdoc/no-multi-asterisks': 'warn', // 禁止多星号
        'jsdoc/require-param-name': 'warn', // 要求参数名称
        'jsdoc/require-property': 'warn', // 要求属性文档
        'jsdoc/require-property-description': 'warn', // 要求属性描述
        'jsdoc/require-property-name': 'warn', // 要求属性名称
        'jsdoc/require-returns-check': 'warn', // 返回值检查
        'jsdoc/require-returns-description': 'warn', // 要求返回值描述
        'jsdoc/require-yields-check': 'warn', // yield 语句检查
      },
    },
  ];
}
