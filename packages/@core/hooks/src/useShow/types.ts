import { type ReactNode } from 'react';

/**
 * 渲染函数类型
 * @template T 数据类型
 */
export type RenderFunction<T> = (data: T) => ReactNode;

/**
 * 异步Show Hook的返回值类型
 */
export type AsyncShowResult = {
  /** 渲染的内容 */
  content: ReactNode;
  /** 是否有错误 */
  error?: Error;
  /** 是否正在加载 */
  isLoading: boolean;
};
