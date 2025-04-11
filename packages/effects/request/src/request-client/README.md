# Request Client

基于 Axios 封装的现代化 HTTP 请求客户端，提供了更强大的类型支持和更便捷的使用方式。

## 特性

- 🚀 基于 Axios 封装，提供统一的接口规范
- 🔒 内置认证和 Token 刷新机制
- 📦 支持文件上传和下载
- 🎯 强大的拦截器系统
- 🔄 灵活的参数序列化选项
- 💡 智能的响应数据处理

## 安装

```bash
npm install axios qs
```

## 基础用法

```typescript
import { RequestClient } from './request-client';

// 创建实例
const client = new RequestClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// GET 请求
const getData = async () => {
  const response = await client.get('/users');
  return response;
};

// POST 请求
const createData = async (data) => {
  const response = await client.post('/users', data);
  return response;
};
```

## 高级配置

### 响应数据返回方式

可以通过 `responseReturn` 配置响应数据的返回方式：

- `raw`: 返回原始的 Axios 响应，包含 headers、status 等信息
- `body`: 只返回响应体数据
- `data`: 只返回响应体中的 data 字段数据

```typescript
// 配置默认返回方式
const client = new RequestClient({
  responseReturn: 'data',
});

// 针对单个请求配置
const response = await client.get('/users', {
  responseReturn: 'raw',
});
```

### 参数序列化

支持多种参数序列化方式：

- `brackets`: `ids[]=1&ids[]=2`
- `comma`: `ids=1,2`
- `indices`: `ids[0]=1&ids[1]=2`
- `repeat`: `ids=1&ids=2`

```typescript
const client = new RequestClient({
  paramsSerializer: 'brackets',
});
```

### 拦截器

提供请求和响应拦截器：

```typescript
// 添加请求拦截器
client.addRequestInterceptor({
  fulfilled: (config) => {
    // 在发送请求之前做些什么
    return config;
  },
  rejected: (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
});

// 添加响应拦截器
client.addResponseInterceptor({
  fulfilled: (response) => {
    // 对响应数据做些什么
    return response;
  },
  rejected: (error) => {
    // 对响应错误做些什么
    return Promise.reject(error);
  },
});
```

### 文件操作

支持文件上传和下载：

```typescript
// 文件上传
await client.upload('/upload', formData);

// 文件下载
await client.download('/download', 'filename.pdf');
```

### 认证和 Token 刷新

内置了 Token 认证和自动刷新机制：

```typescript
const client = new RequestClient({
  // ... 其他配置
});

// 配置认证拦截器
client.addResponseInterceptor(
  authenticateResponseInterceptor({
    client,
    doReAuthenticate: async () => {
      // 重新认证逻辑
    },
    doRefreshToken: async () => {
      // 刷新 token 逻辑
      return 'new_token';
    },
    enableRefreshToken: true,
    formatToken: (token) => `Bearer ${token}`,
  }),
);
```

## 类型支持

完整的 TypeScript 类型支持：

```typescript
interface User {
  id: number;
  name: string;
}

// 请求将返回 User 类型的数据
const user = await client.get<User>('/user/1');
```

## 错误处理

内置了统一的错误处理机制：

```typescript
client.addResponseInterceptor(
  errorMessageResponseInterceptor((message, error) => {
    // 处理错误消息
    console.error(message);
  }),
);
```

## API 参考

### RequestClient

主要方法：

- `get<T>(url: string, config?: RequestClientConfig): Promise<T>`
- `post<T>(url: string, data?: any, config?: RequestClientConfig): Promise<T>`
- `put<T>(url: string, data?: any, config?: RequestClientConfig): Promise<T>`
- `delete<T>(url: string, config?: RequestClientConfig): Promise<T>`
- `request<T>(url: string, config: RequestClientConfig): Promise<T>`
- `upload(url: string, data: FormData, config?: RequestClientConfig): Promise<any>`
- `download(url: string, filename: string, config?: RequestClientConfig): Promise<void>`

### 配置选项

```typescript
interface RequestClientOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  responseReturn?: 'raw' | 'body' | 'data';
  paramsSerializer?: 'brackets' | 'comma' | 'indices' | 'repeat';
  // ... 其他 Axios 配置选项
}
```
