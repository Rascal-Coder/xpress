# @xpress-core/router

基于 React Router 的增强型路由器，提供更友好的 API 和更强大的功能。

## 特性

- 🚀 基于配置的路由系统
- 🔒 导航守卫支持
- 📦 类型安全
- 🎯 命令式导航 API
- 📝 查询参数处理
- 📜 滚动行为控制
- ⚡ 错误处理机制

## 安装

```bash
pnpm add @xpress-core/router
```

## 基础使用

1. 配置路由：

```tsx
import { RouteRecord } from '@xpress-core/router';

const routes: RouteRecord[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
    children: [
      {
        path: 'team',
        component: Team,
      },
    ],
  },
];
```

2. 创建路由实例：

```tsx
import { RouterProvider } from '@xpress-core/router';

function App() {
  return (
    <RouterProvider
      options={{
        mode: 'history',
        routes,
        scrollBehavior: (to, from) => ({ top: 0 }),
      }}
    >
      <YourApp />
    </RouterProvider>
  );
}
```

3. 在组件中使用：

```tsx
import { useRouter, useRoute } from '@xpress-core/router';

function YourComponent() {
  const router = useRouter();
  const route = useRoute();

  // 编程式导航
  const handleClick = () => {
    router.push('/about');
    // 或者使用对象形式
    router.push({
      path: '/about',
      query: { id: '123' },
    });
  };

  // 获取当前路由信息
  console.log(route.path);
  console.log(route.query);
  console.log(route.params);
}
```

## 高级功能

### 导航守卫

```tsx
const options = {
  beforeEach: async (to, from, next) => {
    if (to.path === '/admin' && !isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  },
  afterEach: (to, from) => {
    console.log(\`路由切换到: \${to.path}\`);
  }
};
```

### 错误处理

```tsx
const router = useRouter();

router.onError((error) => {
  console.error('路由错误:', error);
});
```

### 滚动行为

```tsx
const options = {
  scrollBehavior: (to, from) => {
    // 滚动到顶部
    return { top: 0, behavior: 'smooth' };

    // 保持位置
    return false;

    // 自定义滚动位置
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
  },
};
```

## API 参考

### Hooks

- \`useRouter()\`: 获取路由器实例
- \`useRoute()\`: 获取当前路由信息

### Router 实例方法

- \`push(to: RouteLocationRaw)\`: 导航到新路由
- \`replace(to: RouteLocationRaw)\`: 替换当前路由
- \`addRoute(route: RouteRecord)\`: 动态添加路由
- \`removeRoute(name: string)\`: 移除路由
- \`beforeEach(guard: NavigationGuard)\`: 添加全局前置守卫
- \`afterEach(hook: NavigationHook)\`: 添加全局后置钩子
- \`onError(handler: ErrorHandler)\`: 设置错误处理器

### 类型定义

```tsx
interface RouteLocationRaw {
  path?: string;
  name?: string;
  query?: Record<string, any>;
  params?: Record<string, any>;
  hash?: string;
}

interface RouteLocation {
  path: string;
  fullPath: string;
  query: Record<string, any>;
  params: Record<string, any>;
  meta: Record<string, any>;
  name?: string;
  hash: string;
}
```

## 最佳实践

1. 路由配置集中管理：

```tsx
// routes/index.ts
export const routes: RouteRecord[] = [
  {
    path: '/',
    component: Home,
    meta: { title: '首页' },
  },
  // ...其他路由
];
```

2. 路由守卫处理权限：

```tsx
const authGuard: NavigationGuard = async (to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
};
```

3. 错误处理：

```tsx
router.onError((error) => {
  if (error.type === RouterErrorTypes.NAVIGATION_CANCELLED) {
    console.warn('导航被取消');
  } else {
    // 处理其他错误
  }
});
```
