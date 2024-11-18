import type { Linter } from 'eslint';

import js from '@eslint/js';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export async function javascript(): Promise<Linter.Config[]> {
  return [
    {
      // 语言选项配置
      languageOptions: {
        ecmaVersion: 'latest', // 使用最新的 ECMAScript 版本
        globals: {
          ...globals.browser, // 浏览器全局变量
          ...globals.es2021, // ES2021 全局变量
          ...globals.node, // Node.js 全局变量
          document: 'readonly', // 只读的 document 对象
          navigator: 'readonly', // 只读的 navigator 对象
          window: 'readonly', // 只读的 window 对象
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true, // 启用 JSX
          },
          ecmaVersion: 'latest', // 使用最新的 ECMAScript 版本
          sourceType: 'module', // 代码是 ECMAScript 模块
        },
        sourceType: 'module',
      },
      linterOptions: {
        reportUnusedDisableDirectives: true, // 报告未使用的 eslint-disable 注释
      },
      plugins: {
        'unused-imports': pluginUnusedImports, // 未使用导入检测插件
      },
      rules: {
        ...js.configs.recommended.rules,
        // 强制 getter/setter 成对出现
        'accessor-pairs': [
          'error',
          { enforceForClassMembers: true, setWithoutGet: true },
        ],
        'array-callback-return': 'error', // 强制数组方法的回调函数中有 return 语句
        'block-scoped-var': 'error', // 强制变量在定义的作用域内使用
        'constructor-super': 'error', // 要求在构造函数中有 super() 的调用
        'default-case-last': 'error', // 要求 switch 语句中的 default 分支位于最后
        'dot-notation': ['error', { allowKeywords: true }], // 要求使用点号访问属性
        eqeqeq: ['error', 'always'], // 要求使用 === 和 !==
        'keyword-spacing': 'off', // 关闭关键字周围空格检查

        // 构造函数命名规范
        'new-cap': [
          'error',
          { capIsNew: false, newIsCap: true, properties: true },
        ],
        'no-alert': 'error', // 禁用 alert、confirm 和 prompt
        'no-array-constructor': 'error', // 禁止使用 Array 构造函数
        'no-async-promise-executor': 'error', // 禁止使用异步函数作为 Promise executor
        'no-caller': 'error', // 禁用 arguments.caller 或 arguments.callee
        'no-case-declarations': 'error', // 禁止在 case 子句中使用词法声明
        'no-class-assign': 'error', // 禁止修改类声明的变量
        'no-compare-neg-zero': 'error', // 禁止与 -0 进行比较
        'no-cond-assign': ['error', 'always'], // 禁止在条件语句中出现赋值操作符
        'no-console': ['error', { allow: ['warn', 'error'] }], // 禁用 console，允许 warn 和 error
        'no-const-assign': 'error', // 禁止修改 const 声明的变量
        'no-control-regex': 'error', // 禁止在正则表达式中使用控制字符
        'no-debugger': 'error', // 禁用 debugger
        'no-delete-var': 'error', // 禁止删除变量
        'no-dupe-args': 'error', // 禁止在 function 定义中出现重复的参数
        'no-dupe-class-members': 'error', // 禁止类成员中出现重复的名称
        'no-dupe-keys': 'error', // 禁止对象字面量中出现重复的键
        'no-duplicate-case': 'error', // 禁止出现重复的 case 标签
        'no-empty': ['error', { allowEmptyCatch: true }], // 禁止空块语句，但允许空的 catch 子句
        'no-empty-character-class': 'error', // 禁止在正则表达式中出现空字符集
        'no-empty-function': 'off', // 允许空函数
        'no-empty-pattern': 'error', // 禁止使用空解构模式
        'no-eval': 'error', // 禁用 eval()
        'no-ex-assign': 'error', // 禁止对 catch 子句中的异常重新赋值
        'no-extend-native': 'error', // 禁止扩展原生对象
        'no-extra-bind': 'error', // 禁止不必要的函数绑定
        'no-extra-boolean-cast': 'error', // 禁止不必要的布尔类型转换
        'no-fallthrough': 'error', // 禁止 case 语句落空
        'no-func-assign': 'error', // 禁止对 function 声明重新赋值
        'no-global-assign': 'error', // 禁止对原生对象或只读的全局对象进行赋值
        'no-implied-eval': 'error', // 禁止使用类似 eval() 的方法
        'no-import-assign': 'error', // 禁止对导入的绑定进行赋值
        'no-invalid-regexp': 'error', // 禁止无效的正则表达式
        'no-irregular-whitespace': 'error', // 禁止不规则的空白
        'no-iterator': 'error', // 禁用 __iterator__ 属性
        'no-labels': ['error', { allowLoop: false, allowSwitch: false }], // 禁用标签语句
        'no-lone-blocks': 'error', // 禁用不必要的嵌套块
        'no-loss-of-precision': 'error', // 禁止失去精度的数值字面量
        'no-misleading-character-class': 'error', // 禁止在字符类语法中出现由多个代码点组成的字符
        'no-multi-str': 'error', // 禁止使用多行字符串
        'no-new': 'error', // 禁止使用 new 以避免产生副作用
        'no-new-func': 'error', // 禁用 Function 构造函数
        'no-new-object': 'error', // 禁用 Object 构造函数
        'no-new-symbol': 'error', // 禁止 Symbol 对象前使用 new 操作符
        'no-new-wrappers': 'error', // 禁止对 String，Number 和 Boolean 使用 new 操作符
        'no-obj-calls': 'error', // 禁止把全局对象当作函数调用
        'no-octal': 'error', // 禁用八进制字面量
        'no-octal-escape': 'error', // 禁止在字符串字面量中使用八进制转义序列
        'no-proto': 'error', // 禁用 __proto__ 属性
        'no-prototype-builtins': 'error', // 禁止直接调用 Object.prototypes 的内置属性
        'no-redeclare': ['error', { builtinGlobals: false }], // 禁止重新声明变量
        'no-regex-spaces': 'error', // 禁止正则表达式字面量中出现多个空格
        'no-restricted-globals': [
          'error',
          { message: 'Use `globalThis` instead.', name: 'global' },
          { message: 'Use `globalThis` instead.', name: 'self' },
        ],
        'no-restricted-properties': [
          'error',
          {
            message:
              'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.',
            property: '__proto__',
          },
          {
            message: 'Use `Object.defineProperty` instead.',
            property: '__defineGetter__',
          },
          {
            message: 'Use `Object.defineProperty` instead.',
            property: '__defineSetter__',
          },
          {
            message: 'Use `Object.getOwnPropertyDescriptor` instead.',
            property: '__lookupGetter__',
          },
          {
            message: 'Use `Object.getOwnPropertyDescriptor` instead.',
            property: '__lookupSetter__',
          },
        ],
        'no-restricted-syntax': [
          // 禁用特定的语法
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
          'TSEnumDeclaration[const=true]',
          'TSExportAssignment',
        ],
        'no-self-assign': ['error', { props: true }], // 禁止自我赋值
        'no-self-compare': 'error', // 禁止自身比较
        'no-sequences': 'error', // 禁用逗号操作符
        'no-shadow-restricted-names': 'error', // 禁止遮蔽关键字
        'no-sparse-arrays': 'error', // 禁用稀疏数组
        'no-template-curly-in-string': 'error', // 禁止在常规字符串中出现模板字面量占位符语法
        'no-this-before-super': 'error', // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
        'no-throw-literal': 'error', // 禁止抛出异常字面量
        'no-undef': 'off', // 关闭未声明变量的检查
        'no-undef-init': 'error', // 禁止将变量初始化为 undefined
        'no-unexpected-multiline': 'error', // 禁止出现令人困惑的多行表达式
        'no-unmodified-loop-condition': 'error', // 禁用一成不变的循环条件
        'no-unneeded-ternary': ['error', { defaultAssignment: false }], // 禁止可以在有更简单的可替代的表达式时使用三元操作符
        'no-unreachable': 'error', // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
        'no-unreachable-loop': 'error', // 禁止出现无法到达的循环
        'no-unsafe-finally': 'error', // 禁止在 finally 语句块中出现控制流语句
        'no-unsafe-negation': 'error', // 禁止对关系运算符的左操作数使用否定操作符
        'no-unused-expressions': [
          // 禁止出现未使用过的表达式
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        'no-unused-vars': [
          // 禁止出现未使用过的变量
          'error',
          {
            args: 'none',
            caughtErrors: 'none',
            ignoreRestSiblings: true,
            vars: 'all',
          },
        ],
        'no-use-before-define': [
          // 禁止在变量定义之前使用它们
          'error',
          { classes: false, functions: false, variables: true },
        ],
        'no-useless-backreference': 'error', // 禁止在正则表达式中使用无用的回引用
        'no-useless-call': 'error', // 禁止不必要的 .call() 和 .apply()
        'no-useless-catch': 'error', // 禁止不必要的 catch 子句
        'no-useless-computed-key': 'error', // 禁止在对象中使用不必要的计算属性
        'no-useless-constructor': 'error', // 禁用不必要的构造函数
        'no-useless-rename': 'error', // 禁止在 import 和 export 和解构赋值时将引用重命名为相同的名字
        'no-useless-return': 'error', // 禁止多余的 return 语句
        'no-var': 'error', // 要求使用 let 或 const 而不是 var
        'no-with': 'error', // 禁用 with 语句
        'object-shorthand': [
          // 要求对象字面量中方法和属性使用简写语法
          'error',
          'always',
          { avoidQuotes: true, ignoreConstructors: false },
        ],
        'one-var': ['error', { initialized: 'never' }], // 强制函数中的变量要么一起声明要么分开声明
        'prefer-arrow-callback': [
          // 要求回调函数使用箭头函数
          'error',
          {
            allowNamedFunctions: false,
            allowUnboundThis: true,
          },
        ],
        'prefer-const': [
          // 要求使用 const 声明那些声明后不再被修改的变量
          'error',
          {
            destructuring: 'all',
            ignoreReadBeforeAssign: true,
          },
        ],
        'prefer-exponentiation-operator': 'error', // 要求使用 ** 运算符而不是 Math.pow()
        'prefer-promise-reject-errors': 'error', // 要求使用 Error 对象作为 Promise 拒绝的原因
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }], // 要求使用正则表达式字面量而不是构造函数
        'prefer-rest-params': 'error', // 要求使用剩余参数而不是 arguments
        'prefer-spread': 'error', // 要求使用扩展运算符而非 .apply()
        'prefer-template': 'error', // 要求使用模板字面量而非字符串连接
        'space-before-function-paren': 'off', // 关闭函数圆括号之前有一个空格的要求
        'spaced-comment': 'error', // 要求或禁止在注释前有空白
        'symbol-description': 'error', // 要求 symbol 描述
        'unicode-bom': ['error', 'never'], // 要求或禁止使用 Unicode 字节顺序标记 (BOM)

        // 未使用的导入处理
        'unused-imports/no-unused-imports': 'error', // 禁止未使用的导入
        'unused-imports/no-unused-vars': [
          // 禁止未使用的变量
          'error',
          {
            args: 'after-used', // 仅检查使用过的参数之后的未使用参数
            argsIgnorePattern: '^_', // 忽略以下划线开头的参数
            vars: 'all', // 检查所有变量
            varsIgnorePattern: '^_', // 忽略以下划线开头的变量
          },
        ],
        'use-isnan': [
          // 要求使用 isNaN() 检查 NaN
          'error',
          { enforceForIndexOf: true, enforceForSwitchCase: true },
        ],
        'valid-typeof': ['error', { requireStringLiterals: true }], // 强制 typeof 表达式与有效的字符串进行比较
        'vars-on-top': 'error', // 要求所有的 var 声明出现在它们所在的作用域顶部
        yoda: ['error', 'never'], // 要求或禁止 "Yoda" 条件
      },
    },
  ];
}
