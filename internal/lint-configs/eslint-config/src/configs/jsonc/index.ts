import type { Linter } from 'eslint';

import { interopDefault } from '../../util';
import { sortPackageJson } from './sortPackageJson';
import { sortTsconfig } from './sortTsconfig';

export async function jsonc(): Promise<Linter.Config[]> {
  const [pluginJsonc, parserJsonc] = await Promise.all([
    interopDefault(import('eslint-plugin-jsonc')),
    interopDefault(import('jsonc-eslint-parser')),
  ] as const);

  return [
    {
      // 指定需要检查的文件类型
      files: ['**/*.json', '**/*.json5', '**/*.jsonc', '*.code-workspace'],
      languageOptions: {
        parser: parserJsonc as any, // 使用 jsonc 解析器解析这些文件
      },
      plugins: {
        jsonc: pluginJsonc as any, // 使用 jsonc 插件进行规则检查
      },
      rules: {
        // 数值类型相关规则
        'jsonc/no-bigint-literals': 'error', // 禁止使用 BigInt 字面量，因为JSON不支持
        'jsonc/no-binary-expression': 'error', // 禁止使用二进制表达式（如 1+2）
        'jsonc/no-binary-numeric-literals': 'error', // 禁止使用二进制数字（如 0b1010）
        'jsonc/no-dupe-keys': 'error', // 禁止对象中出现重复的键名
        'jsonc/no-escape-sequence-in-identifier': 'error', // 禁止在标识符中使用转义序列
        'jsonc/no-floating-decimal': 'error', // 禁止省略小数点前后的数字（如 .5 或 2.）
        'jsonc/no-hexadecimal-numeric-literals': 'error', // 禁止使用十六进制数字（如 0xFF）
        'jsonc/no-infinity': 'error', // 禁止使用 Infinity
        'jsonc/no-multi-str': 'error', // 禁止使用多行字符串
        'jsonc/no-nan': 'error', // 禁止使用 NaN
        'jsonc/no-number-props': 'error', // 禁止使用数字作为对象属性
        'jsonc/no-numeric-separators': 'error', // 禁止使用数字分隔符（如 1_000）

        // 进制相关规则
        'jsonc/no-octal': 'error', // 禁止使用八进制数字（如 071）
        'jsonc/no-octal-escape': 'error', // 禁止使用八进制转义序列
        'jsonc/no-octal-numeric-literals': 'error', // 禁止使用八进制数字字面量

        // 语法相关规则
        'jsonc/no-parenthesized': 'error', // 禁止使用括号表达式
        'jsonc/no-plus-sign': 'error', // 禁止使用一元加号（如 +5）
        'jsonc/no-regexp-literals': 'error', // 禁止使用正则表达式字面量
        'jsonc/no-sparse-arrays': 'error', // 禁止使用稀疏数组（如 [1,,2]）
        'jsonc/no-template-literals': 'error', // 禁止使用模板字符串
        'jsonc/no-undefined-value': 'error', // 禁止使用 undefined 值
        'jsonc/no-unicode-codepoint-escapes': 'error', // 禁止使用 Unicode 码点转义
        'jsonc/no-useless-escape': 'error', // 禁止不必要的转义字符

        // 格式化相关规则
        'jsonc/space-unary-ops': 'error', // 一元运算符后必须有空格
        'jsonc/valid-json-number': 'error', // 确保数字格式符合 JSON 规范

        // Vue 相关规则
        'jsonc/vue-custom-block/no-parsing-error': 'error', // 防止 Vue 自定义块中的解析错误
      },
    },
    sortTsconfig(), // 应用 tsconfig.json 的排序规则
    sortPackageJson(), // 应用 package.json 的排序规则
  ];
}
