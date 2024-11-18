import type { Linter } from 'eslint';

import perfectionistPlugin from 'eslint-plugin-perfectionist';

// 导出perfectionist配置函数
export async function perfectionist(): Promise<Linter.Config[]> {
  return [
    // 使用插件推荐的自然排序配置
    perfectionistPlugin.configs['recommended-natural'],
    {
      rules: {
        // 配置导出语句的排序规则
        'perfectionist/sort-exports': [
          'error',
          {
            order: 'asc', // 升序排序
            type: 'natural', // 自然排序
          },
        ],

        // 配置import语句的排序规则
        'perfectionist/sort-imports': [
          'error',
          {
            // 自定义分组配置
            customGroups: {
              type: {
                xpress: 'xpress', // xpress相关类型
              },
              value: {
                xpress: ['@xpress*', '@xpress/**/**', '@xpress-core/**/**'], // xpress相关导入
              },
            },
            // 导入语句分组顺序
            groups: [
              ['external-type', 'builtin-type', 'type'], // 外部类型、内置类型、普通类型
              ['parent-type', 'sibling-type', 'index-type'], // 父级类型、同级类型、索引类型
              ['internal-type'], // 内部类型
              'builtin', // 内置模块
              'xpress', // xpress相关
              'external', // 外部依赖
              'internal', // 内部模块
              ['parent', 'sibling', 'index'], // 父级、同级、索引模块
              'side-effect', // 副作用导入
              'side-effect-style', // 样式副作用
              'style', // 样式导入
              'object', // 对象导入
              'unknown', // 未知类型
            ],
            internalPattern: ['#*', '#*/**'], // 内部模块匹配模式
            newlinesBetween: 'always', // 分组之间总是添加空行
            order: 'asc', // 升序排序
            type: 'natural', // 自然排序
          },
        ],

        // 配置命名导出的排序规则
        'perfectionist/sort-named-exports': [
          'error',
          {
            order: 'asc',
            type: 'natural',
          },
        ],

        // 配置对象属性的排序规则
        'perfectionist/sort-objects': [
          'error',
          {
            // 自定义分组
            customGroups: {
              items: 'items',
              list: 'list',
              children: 'children',
            },
            groups: ['unknown', 'items', 'list', 'children'],
            ignorePattern: ['children'], // 忽略children属性的排序
            order: 'asc',
            partitionByComment: 'Part:**', // 通过注释分区
            type: 'natural',
          },
        ],
      },
    },
  ];
}
