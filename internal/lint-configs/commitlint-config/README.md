# Commitlint Config

此配置用于规范化 Git 提交信息。

## 提交格式

```bash
type(scope): subject

body

footer
```

## 提交规范

### 类型 (Type)

| 类型       | 说明                           |
| ---------- | ------------------------------ |
| `feat`     | 新增功能                       |
| `fix`      | 修复缺陷                       |
| `docs`     | 文档变更                       |
| `style`    | 代码格式调整                   |
| `refactor` | 代码重构                       |
| `perf`     | 性能优化                       |
| `test`     | 添加或修改测试用例             |
| `build`    | 构建流程、外部依赖变更         |
| `ci`       | 修改 CI 配置、脚本             |
| `chore`    | 对构建过程或辅助工具和库的更改 |
| `revert`   | 回滚 commit                    |
| `types`    | 类型定义文件修改               |
| `release`  | 发布新版本                     |
| `workflow` | 工作流程改进                   |

### 影响范围 (Scope)

| 范围          | 说明                      |
| ------------- | ------------------------- |
| `package名称` | package.json 中定义的包名 |
| `project`     | 项目整体变更              |
| `style`       | 样式相关变更              |
| `lint`        | 代码检查相关              |
| `ci`          | CI 相关配置               |
| `dev`         | 开发工具相关              |
| `deploy`      | 部署相关                  |
| `other`       | 其他变更                  |

## 快捷命令

使用 `pnpm commit` 启动交互式提交，支持以下快捷命令：

| 命令             | 说明                 |
| ---------------- | -------------------- |
| `pnpm commit :b` | build: 更新依赖      |
| `pnpm commit :c` | chore: 更新配置      |
| `pnpm commit :f` | docs: 修复文档错别字 |
| `pnpm commit :r` | docs: 更新 README    |
| `pnpm commit :s` | style: 更新代码格式  |

## 提交示例

### 新功能

```bash
feat(auth): 添加用户登录功能
```

### 修复问题

```bash
fix(auth): 修复登录验证失败的问题
```

### 文档更新

```bash
docs(readme): 补充环境配置说明
```

### 代码格式

```bash
style(components): 统一组件代码缩进
```

### 重构代码

```bash
refactor(utils): 重构日期处理工具函数
```

### 性能优化

```bash
perf(query): 优化列表查询性能
```

### 构建相关

```bash
build(deps): 升级 vite 到 v5.0.0
```

### 回滚提交

```bash
revert: feat(auth): 添加用户登录功能
```

### 类型定义

```bash
types(api): 更新接口返回值类型定义
```
