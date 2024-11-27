import type { AsyncShowResult, RenderFunction } from './types';

import { type ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

/**
 * 异步条件渲染Hook
 * @param when - Promise或异步函数，用于获取数据
 * @param render - 渲染函数，接收数据并返回ReactNode
 * @param fallback - 加载状态显示的内容
 * @returns AsyncShowResult
 *
 * @example
 * // 基础用法
 * const { content, isLoading } = useAsyncShow(
 *   fetchUserData(userId),
 *   (user) => <UserProfile user={user} />,
 *   <LoadingSkeleton />
 * );
 *
 * @example
 * // 处理错误状态
 * const { content, isLoading, error } = useAsyncShow(
 *   async () => {
 *     const response = await fetch('/api/data');
 *     if (!response.ok) throw new Error('Failed to fetch');
 *     return response.json();
 *   },
 *   (data) => <DataDisplay data={data} />,
 *   <Loading />
 * );
 */
export function useAsyncShow<T>(
  when: (() => Promise<T>) | Promise<T>,
  render: RenderFunction<T>,
  fallback?: ReactNode,
): AsyncShowResult {
  const [state, setState] = useState<{
    data: null | T;
    error?: Error;
    isLoading: boolean;
  }>({
    data: null,
    isLoading: true,
  });

  useEffect(() => {
    const promise = typeof when === 'function' ? when() : when;

    setState((prev) => ({ ...prev, isLoading: true }));

    promise
      .then((result) => {
        setState({
          data: result,
          isLoading: false,
        });
      })
      .catch((error) => {
        setState({
          data: null,
          error,
          isLoading: false,
        });
      });
  }, [when]);

  const content = useMemo(() => {
    if (state.isLoading) {
      return fallback ?? null;
    }

    if (state.error || !state.data) {
      return null;
    }

    return render(state.data);
  }, [state, render, fallback]);

  return {
    content,
    error: state.error,
    isLoading: state.isLoading,
  };
}
