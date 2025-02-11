# React Router Toolset

这是一个基于 React Router 的增强工具集，提供了更强大的路由管理和导航功能。

## 主要功能

- 支持动态路由配置管理
- 提供历史记录管理
- 支持路由权限控制
- 支持外链跳转
- 支持菜单层级管理
- 提供便捷的路由工具函数

## 核心组件

### HistoryRouter

自定义的路由组件，用于支持编程式导航。

### Router 类

路由管理的核心类，提供以下主要功能：

- 路由配置管理
- 动态更新路由
- 路径解析和生成
- 路由状态管理

## API 说明

### RouteConfig 配置项

```typescript
{
  caseSensitive?: boolean;     // 是否大小写敏感
  children?: RouteConfig[];    // 子路由配置
  component?: () => Promise<any>; // 路由组件
  external?: boolean;          // 是否为外链
  flatten?: boolean;           // 是否扁平化子路由菜单
  helmet?: string;            // 页面标题
  hidden?: boolean;           // 是否在菜单中隐藏
  icon?: React.ReactNode;     // 菜单图标
  name?: string;              // 菜单名称
  path: string;               // 路由路径
  permission?: string;        // 权限控制
  progress?: boolean;         // 是否显示进度条
  redirect?: string;          // 重定向路径
}
```

### flatten属性示例

`flatten` 属性用于控制子路由在菜单中的展示层级。当设置为 `true` 时，子路由会被提升到与父级相同的层级显示。

```tsx
// 路由配置示例
const routesConfig = [
  {
    path: '/system',
    name: '系统管理',
    component: () => import('./pages/SystemLayout'),
    children: [
      {
        path: 'settings',
        name: '系统设置',
        component: () => import('./pages/Settings'),
        // 常规配置：settings将作为system的子菜单
        children: [
          {
            path: 'basic',
            name: '基础设置',
            component: () => import('./pages/BasicSettings'),
          },
          {
            path: 'advanced',
            name: '高级设置',
            component: () => import('./pages/AdvancedSettings'),
          },
        ],
      },
      {
        path: 'users',
        name: '用户管理',
        component: () => import('./pages/Users'),
        // 设置flatten为true：users的子菜单将与users同级显示
        flatten: true,
        children: [
          {
            path: 'list',
            name: '用户列表',
            component: () => import('./pages/UserList'),
          },
          {
            path: 'roles',
            name: '角色管理',
            component: () => import('./pages/UserRoles'),
          },
        ],
      },
    ],
  },
];

// 菜单展示效果：
// - 系统管理
//   - 系统设置
//     - 基础设置      (/system/settings/basic)
//     - 高级设置      (/system/settings/advanced)
//   - 用户管理        (/system/users)
//   - 用户列表        (/system/users/list)      // 因为flatten=true，所以与用户管理同级
//   - 角色管理        (/system/users/roles)     // 因为flatten=true，所以与用户管理同级
```

### 主要工具函数

- `useRouter`: 在组件中获取路由信息和状态
- `usePathname`: 用于处理动态路由参数的Hook函数

  ```tsx
  // 示例：将动态路由路径转换为实际路径
  function Component() {
    const getPathname = usePathname();

    // 假设当前URL为 /user/123/profile
    // 路由配置为 /user/:id/profile
    const actualPath = getPathname('/user/:id/profile');
    // 输出: /user/123/profile

    return <div>{actualPath}</div>;
  }
  ```

- `tryFindRouteFather`: 用于处理路由父级路径，特别适用于菜单展开和选中状态的计算

  ```tsx
  // 示例：获取包含动态参数的路由的父级路径

  // 普通路由
  const path1 = tryFindRouteFather('/users/list', false);
  // 输出: /users/list

  // 带动态参数的路由，并设置hidden为true
  const path2 = tryFindRouteFather('/users/:id/detail', true);
  // 输出: /users

  // 用于菜单选中状态计算
  const menuSelectedKey = tryFindRouteFather(currentPath, isDetailPage);
  ```

## 使用示例

```tsx
import { Router, HistoryRouter, useRouter } from './react-router-toolset';

// 创建路由配置
const routesConfig = [
  {
    path: '/',
    component: () => import('./pages/Layout'),
    children: [
      {
        path: 'home',
        name: '首页',
        component: () => import('./pages/Home')
      }
    ]
  }
];

// 初始化路由
const router = new Router(routesConfig);

// 在组件中使用
function App() {
  return (
    <HistoryRouter>
      {/* 你的应用组件 */}
    </HistoryRouter>
  );
}

// 在组件中获取路由信息
function YourComponent() {
  const { curRoute, routes } = useRouter(router);

  return (
    // 你的组件内容
  );
}
```

## 注意事项

1. 确保在应用的最外层使用 `HistoryRouter` 组件
2. 路由配置的 `path` 遵循 React Router 的路径格式
3. 权限控制需要配合 `permission` 字段使用
4. 外链跳转需要设置 `external: true`
