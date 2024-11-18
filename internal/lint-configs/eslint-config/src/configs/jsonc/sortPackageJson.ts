import type { Linter } from 'eslint';

/**
 * ESLint 配置文件中 package.json 文件的排序规则
 * 用于规范和限制 package.json 文件的排序
 */
export function sortPackageJson(): Linter.Config {
  return {
    // 指定此规则适用于所有 package.json 文件
    files: ['**/package.json'],
    rules: {
      // 数组值排序规则
      'jsonc/sort-array-values': [
        'error',
        {
          order: { type: 'asc' }, // 按字母升序排序
          // 仅对 files 和 pnpm.neverBuiltDependencies 字段进行数组排序
          pathPattern: '^files$|^pnpm.neverBuiltDependencies$',
        },
      ],
      // package.json 字段排序规则
      'jsonc/sort-keys': [
        'error',
        {
          // 第一层级字段排序规则
          order: [
            // 基础信息
            'name', // 包名
            'version', // 版本号
            'description', // 描述
            'private', // 是否私有包
            'keywords', // 关键词

            // 项目元数据
            'homepage', // 主页
            'bugs', // 问题追踪
            'repository', // 仓库信息
            'license', // 许可证
            'author', // 作者
            'contributors', // 贡献者
            'categories', // 分类
            'funding', // 赞助信息

            // 包配置
            'type', // 模块类型(commonjs/module)
            'scripts', // npm 脚本
            'files', // 包含的文件
            'sideEffects', // 副作用标记
            'bin', // 可执行文件

            // 入口文件配置
            'main', // 主入口
            'module', // ES 模块入口
            'unpkg', // CDN 入口
            'jsdelivr', // CDN 入口
            'types', // 类型声明入口
            'typesVersions', // 类型版本
            'imports', // 导入映射
            'exports', // 导出映射

            // 发布配置
            'publishConfig', // 发布配置
            'icon', // 图标
            'activationEvents', // 激活事件
            'contributes', // 贡献点

            // 依赖相关
            'peerDependencies', // 同版本依赖
            'peerDependenciesMeta', // 同版本依赖元数据
            'dependencies', // 运行时依赖
            'optionalDependencies', // 可选依赖
            'devDependencies', // 开发依赖

            // 环境和工具配置
            'engines', // 运行环境要求
            'packageManager', // 包管理器
            'pnpm', // pnpm 特定配置
            'overrides', // 依赖覆盖
            'resolutions', // 依赖解析

            // 开发工具配置
            'husky', // Git hooks
            'simple-git-hooks', // Git hooks 替代方案
            'lint-staged', // 暂存区 lint
            'eslintConfig', // ESLint 配置
          ],
          pathPattern: '^$', // 匹配根级字段
        },
        {
          // 依赖对象内部的排序规则
          order: { type: 'asc' }, // 按字母升序
          pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$',
        },
        {
          // 依赖覆盖配置的排序规则
          order: { type: 'asc' }, // 按字母升序
          pathPattern: '^(?:resolutions|overrides|pnpm.overrides)$',
        },
        {
          // exports 字段的子字段排序规则
          order: ['types', 'import', 'require', 'default'],
          pathPattern: '^exports.*$',
        },
      ],
    },
  };
}
