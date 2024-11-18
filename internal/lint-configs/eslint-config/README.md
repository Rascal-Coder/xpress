# ESLint 配置依赖说明

## 基础依赖

| 依赖包        | 说明                          |
| ------------- | ----------------------------- |
| eslint        | ESLint 核心包                 |
| @eslint/js    | ESLint 的 JavaScript 规则集   |
| @types/eslint | ESLint 的 TypeScript 类型定义 |
| globals       | 全局变量定义                  |

## 语言支持

### TypeScript

| 依赖包                           | 说明                     |
| -------------------------------- | ------------------------ |
| @typescript-eslint/eslint-plugin | TypeScript ESLint 插件   |
| @typescript-eslint/parser        | TypeScript ESLint 解析器 |

### JSON

| 依赖包              | 说明            |
| ------------------- | --------------- |
| eslint-plugin-jsonc | JSON 文件的检查 |
| jsonc-eslint-parser | JSON 文件解析器 |

## 框架支持

### React

| 依赖包                      | 说明                      |
| --------------------------- | ------------------------- |
| eslint-plugin-react         | React 的 ESLint 规则      |
| eslint-plugin-react-hooks   | React Hooks 的规则检查    |
| eslint-plugin-react-refresh | React Fast Refresh 的规则 |

### Node.js

| 依赖包          | 说明             |
| --------------- | ---------------- |
| eslint-plugin-n | Node.js 相关规则 |

## 代码质量

### 代码风格

| 依赖包                 | 说明             |
| ---------------------- | ---------------- |
| eslint-plugin-prettier | 与 Prettier 集成 |
| perfectionist          | 代码格式化规则   |

### 模块管理

| 依赖包                 | 说明          |
| ---------------------- | ------------- |
| eslint-plugin-import-x | 导入/导出规则 |
| eslint-plugin-command  | 命令行规则    |

### 最佳实践

| 依赖包                | 说明               |
| --------------------- | ------------------ |
| eslint-plugin-unicorn | 通用的最佳实践规则 |
| eslint-plugin-regexp  | 正则表达式的检查   |

## 文档与注释

| 依赖包                        | 说明            |
| ----------------------------- | --------------- |
| eslint-plugin-jsdoc           | JSDoc 规则      |
| eslint-plugin-eslint-comments | ESLint 注释规则 |

## 测试工具

| 依赖包                      | 说明                      |
| --------------------------- | ------------------------- |
| eslint-plugin-vitest        | Vitest 测试框架的规则     |
| eslint-plugin-no-only-tests | 防止提交带有 .only 的测试 |
