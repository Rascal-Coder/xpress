# DataTable 数据表格组件

一个基于 TanStack Table (React Table) 和 Shadcn UI 构建的可复用数据表格组件，具有排序、过滤和选择功能。

## 特性

- 🔄 可排序的列
- 🔍 多种类型的过滤器（文本搜索、选择、范围）
- ✅ 行选择功能
- 📱 响应式设计
- 🎨 符合设计系统的样式

## 使用方法

### 基本用法

```tsx
import { DataTable } from '@/components/Table';
import type { ColumnDef } from '@tanstack/react-table';

// 定义数据类型
type User = {
  id: string;
  name: string;
  email: string;
};

// 创建数据
const users = [
  { id: '1', name: '张三', email: 'zhangsan@example.com' },
  { id: '2', name: '李四', email: 'lisi@example.com' },
];

// 定义列
const columns: ColumnDef<User>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: '姓名', accessorKey: 'name' },
  { header: '邮箱', accessorKey: 'email' },
];

// 使用组件
function MyComponent() {
  return <DataTable columns={columns} data={users} />;
}
```

### 高级用法

#### 添加过滤功能

```tsx
<DataTable
  columns={columns}
  data={users}
  filterableColumns={['name', 'email']}
/>
```

#### 添加默认排序

```tsx
<DataTable
  columns={columns}
  data={users}
  initialSorting={[{ id: 'name', desc: false }]}
/>
```

#### 自定义过滤器类型

在列定义中设置 `meta.filterVariant` 属性:

```tsx
const columns: ColumnDef<User>[] = [
  // ...
  {
    header: '角色',
    accessorKey: 'role',
    meta: {
      filterVariant: 'select', // 'select', 'range', 或 'text'(默认)
    },
  },
];
```

## 组件属性

| 属性名 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `columns` | `ColumnDef<TData>[]` | - | 表格列定义 |
| `data` | `TData[]` | - | 表格数据 |
| `filterableColumns` | `Array<keyof TData>` | `[]` | 可过滤的列 |
| `initialSorting` | `SortingState` | `[]` | 初始排序状态 |
| `showFooterAttribution` | `boolean` | `false` | 是否显示底部归属信息 |

## 示例

查看 `examples` 目录中的示例:

- `BasicTableExample.tsx`: 基本用法示例
- `KeywordTableExample.tsx` (默认导出): 关键词分析表格示例

## 更多信息

此组件基于:

- [TanStack Table](https://tanstack.com/table)
- [Shadcn UI](https://ui.shadcn.com/)
