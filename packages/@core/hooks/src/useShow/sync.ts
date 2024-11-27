import { useMemo } from 'react';

/**
 * 条件渲染Hook，用于控制内容的显示/隐藏
 * @param when - 控制是否显示内容的布尔值
 * @param render - 返回需要渲染内容的函数
 * @param fallback - 可选的备选内容，当when为false时显示
 * @returns React.ReactNode
 *
 * @example
 * // 基础用法
 * const content = useShow(
 *   isVisible,
 *   () => <div>显示的内容</div>,
 *   <Loading />
 * );
 *
 * @example
 * // 用于性能优化场景
 * const HeavyComponent = () => {
 *   const [isReady, setIsReady] = useState(false);
 *
 *   const content = useShow(
 *     isReady,
 *     () => (
 *       <ExpensiveChart
 *         data={complexData}
 *         onRender={() => console.log('图表已渲染')}
 *       />
 *     )
 *   );
 *
 *   return content;
 * };
 */
export function useShow(
  when: boolean,
  render: () => React.ReactNode,
  fallback?: React.ReactNode,
) {
  return useMemo(() => {
    if (!when) {
      return fallback ?? null;
    }
    return render();
  }, [when, render, fallback]);
}
