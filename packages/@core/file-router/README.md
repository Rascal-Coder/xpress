# @xpress-core/file-router

基于文件系统的自动路由生成工具，为 React 应用提供约定式路由解决方案。

## 特性

- 📁 基于文件系统的路由生成
- ⚡️ 支持 Vite 开发服务器
- 🔄 实时文件监听和路由更新
- 🎯 TypeScript 支持
- 🎨 支持自定义路由配置
- 🔌 基于 unplugin 插件系统

## 安装

```bash
pnpm add @xpress-core/file-router
```

## 使用方法

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import FileRouter from '@xpress-core/file-router/vite';

export default defineConfig({
  plugins: [
    FileRouter({
      // 配置选项
    }),
  ],
});
```

### 路由配置选项

```typescript
interface ElegantReactRouterOption {
  /**
   * 路由文件目录
   * @default 'src/views'
   */
  pageDir: string;

  /**
   * 路由常量文件生成目录
   * @default 'src/router/elegant/routes.ts'
   */
  constDir: string;

  /**
   * 类型声明文件生成目录
   * @default 'src/types/elegant-router.d.ts'
   */
  dtsDir: string;

  /**
   * 导入文件生成目录
   * @default 'src/router/elegant/imports.ts'
   */
  importsDir: string;

  /**
   * 路由转换文件生成目录
   * @default 'src/router/elegant/transform.ts'
   */
  transformDir: string;

  /**
   * 项目根目录
   * @default process.cwd()
   */
  cwd: string;

  /**
   * 路径别名配置
   * @default { "@": "src" }
   */
  alias: Record<string, string>;

  /**
   * 布局组件配置
   * @default {
   *   base: 'src/layouts/base-layout/index.tsx',
   *   blank: 'src/layouts/blank-layout/index.tsx'
   * }
   */
  layouts: Record<string, string>;

  /**
   * 默认布局
   * @default 'base'
   */
  defaultLayout: string;

  /**
   * 自定义路由配置
   * @default {
   *   map: {
   *     'not-found': '*',
   *     root: '/'
   *   },
   *   names: []
   * }
   */
  customRoutes: {
    map?: Record<string, string>;
    names?: string[];
  };

  /**
   * 页面文件匹配模式
   * @default ['**‍/index.tsx', '**‍/[[]*[]].tsx']
   */
  pagePatterns: string[];

  /**
   * 页面文件排除模式
   * @default ['**‍/components/**']
   */
  pageExcludePatterns: string[];

  /**
   * 路由名称转换函数
   * @default (routeName) => routeName
   */
  routeNameTransformer: (routeName: string) => string;

  /**
   * 路由路径转换函数
   * @default (_transformedName, path) => path
   */
  routePathTransformer: (transformedName: string, path: string) => string;

  /**
   * 路由元信息生成函数
   * @default (name) => ({ title: name })
   */
  onRouteMetaGen: (name: string) => Record<string, any>;

  /**
   * 是否启用懒加载
   * @default (_name) => true
   */
  lazyImport: (name: string) => boolean;

  /**
   * 是否启用布局懒加载
   * @default (_name) => true
   */
  layoutLazyImport: (name: string) => boolean;

  /**
   * 是否显示日志
   * @default true
   */
  log: boolean;
}
```

## 目录结构

```
src/
  ├── core/           # 核心功能实现
  ├── route-core/     # 路由生成核心逻辑
  ├── constants/      # 常量定义
  ├── types/         # TypeScript 类型定义
  ├── vite.ts        # Vite 插件实现
  └── unplugin.ts    # Unplugin 插件封装
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 类型检查
pnpm typecheck
```

## License

MIT
