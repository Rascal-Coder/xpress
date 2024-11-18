import type { Linter } from 'eslint';

/**
 * ESLint 配置文件中 tsconfig 文件的排序规则
 * 用于规范和限制 tsconfig 文件的排序
 */
export function sortTsconfig(): Linter.Config {
  return {
    // 指定此规则适用的 TypeScript 配置文件
    files: [
      '**/tsconfig.json', // 标准 tsconfig 文件
      '**/tsconfig.*.json', // 特定环境的 tsconfig 文件（如 tsconfig.build.json）
      'internal/tsconfig/*.json', // 内部 tsconfig 文件
    ],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          // tsconfig 文件顶层字段的排序规则
          order: [
            'extends', // 继承的其他配置文件
            'compilerOptions', // 编译器选项
            'references', // 项目引用
            'files', // 明确包含的文件
            'include', // 包含的文件/文件夹模式
            'exclude', // 排除的文件/文件夹模式
          ],
          pathPattern: '^$', // 匹配根级字段
        },
        {
          // compilerOptions 内部选项的排序规则
          order: [
            /* Projects - 项目配置选项 */
            'incremental', // 增量编译
            'composite', // 组合项目
            'tsBuildInfoFile', // 构建信息文件位置
            'disableSourceOfProjectReferenceRedirect', // 禁用项目引用的源文件重定向
            'disableSolutionSearching', // 禁用解决方案搜索
            'disableReferencedProjectLoad', // 禁用引用项目的自动加载

            /* Language and Environment - 语言和环境配置 */
            'target', // 目标 ECMAScript 版本
            'jsx', // JSX 代码生成
            'jsxFactory', // JSX 工厂函数
            'jsxFragmentFactory', // JSX Fragment 工厂函数
            'jsxImportSource', // JSX 运行时模块说明符
            'lib', // 包含的库文件
            'moduleDetection', // 模块检测方式
            'noLib', // 不包含默认库文件
            'reactNamespace', // React 命名空间
            'useDefineForClassFields', // 使用 define 进行类字段定义
            'emitDecoratorMetadata', // 发出装饰器元数据
            'experimentalDecorators', // 启用实验性的装饰器

            /* Modules - 模块配置 */
            'baseUrl', // 模块解析的基准目录
            'rootDir', // 源文件的根目录
            'rootDirs', // 多个源文件根目录
            'customConditions', // 自定义条件
            'module', // 模块系统
            'moduleResolution', // 模块解析策略
            'moduleSuffixes', // 模块后缀
            'noResolve', // 不自动包含 import 的文件
            'paths', // 模块路径映射
            'resolveJsonModule', // 允许导入 JSON 模块
            'resolvePackageJsonExports', // 解析 package.json 的 exports
            'resolvePackageJsonImports', // 解析 package.json 的 imports
            'typeRoots', // 类型声明文件根目录
            'types', // 包含的类型声明包
            'allowArbitraryExtensions', // 允许任意文件扩展名
            'allowImportingTsExtensions', // 允许导入 .ts 文件
            'allowUmdGlobalAccess', // 允许访问 UMD 全局变量

            /* JavaScript Support - JavaScript 支持 */
            'allowJs', // 允许编译 JavaScript 文件
            'checkJs', // 检查 JavaScript 文件
            'maxNodeModuleJsDepth', // node_modules 中 JS 文件的最大搜索深度

            /* Type Checking - 类型检查 */
            'strict', // 启用所有严格类型检查选项
            'strictBindCallApply', // 严格检查 bind/call/apply
            'strictFunctionTypes', // 严格的函数类型检查
            'strictNullChecks', // 严格的空值检查
            'strictPropertyInitialization', // 严格的属性初始化检查
            'allowUnreachableCode', // 允许不可达代码
            'allowUnusedLabels', // 允许未使用的标签
            'alwaysStrict', // 始终启用严格模式
            'exactOptionalPropertyTypes', // 精确的可选属性类型
            'noFallthroughCasesInSwitch', // 禁止 switch 语句中的穿透情况
            'noImplicitAny', // 禁止隐含的 any 类型
            'noImplicitOverride', // 要求显式的重写标记
            'noImplicitReturns', // 要求所有函数显式返回
            'noImplicitThis', // 禁止隐含的 this
            'noPropertyAccessFromIndexSignature', // 禁止通过索引访问属性
            'noUncheckedIndexedAccess', // 检查索引访问
            'noUnusedLocals', // 禁止未使用的局部变量
            'noUnusedParameters', // 禁止未使用的参数
            'useUnknownInCatchVariables', // 在 catch 子句中使用 unknown

            /* Emit - 输出配置 */
            'declaration', // 生成声明文件
            'declarationDir', // 声明文件输出目录
            'declarationMap', // 生成声明文件的 sourcemap
            'downlevelIteration', // 降级迭代器实现
            'emitBOM', // 输出 BOM 标记
            'emitDeclarationOnly', // 只输出声明文件
            'importHelpers', // 导入辅助函数
            'importsNotUsedAsValues', // import 语句的处理方式
            'inlineSourceMap', // 内联 sourcemap
            'inlineSources', // 内联源代码
            'mapRoot', // sourcemap 文件位置
            'newLine', // 换行符类型
            'noEmit', // 不生成输出文件
            'noEmitHelpers', // 不生成辅助函数
            'noEmitOnError', // 有错误时不生成输出
            'outDir', // 输出目录
            'outFile', // 输出文件
            'preserveConstEnums', // 保留 const enum 声明
            'preserveValueImports', // 保留值导入
            'removeComments', // 删除注释
            'sourceMap', // 生成 sourcemap
            'sourceRoot', // 源文件根目录
            'stripInternal', // 删除内部注释

            /* Interop Constraints - 互操作约束 */
            'allowSyntheticDefaultImports', // 允许合成默认导入
            'esModuleInterop', // 启用 ES 模块互操作性
            'forceConsistentCasingInFileNames', // 强制文件名大小写一致
            'isolatedModules', // 将每个文件作为单独的模块
            'preserveSymlinks', // 保留符号链接
            'verbatimModuleSyntax', // 逐字模块语法

            /* Completeness - 完整性检查 */
            'skipDefaultLibCheck', // 跳过默认库检查
            'skipLibCheck', // 跳过所有库检查
          ],
          pathPattern: '^compilerOptions$', // 匹配 compilerOptions 字段
        },
      ],
    },
  };
}
