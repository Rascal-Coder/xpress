import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCssVarOptions {
  initialValue?: string;
  observe?: boolean;
}

/**
 * React hook for manipulating CSS variables
 *
 * @param prop CSS 变量名
 * @param target 目标元素
 * @param options 配置项
 */
export function useCssVar(
  prop: string,
  target?: HTMLElement | null,
  options: UseCssVarOptions = {},
) {
  const { initialValue = '', observe = false } = options;
  const [value, setValue] = useState<string>(initialValue);
  const targetRef = useRef<HTMLElement | null>(null);

  // 更新目标元素引用
  useEffect(() => {
    targetRef.current = target || document.documentElement;
  }, [target]);

  // 更新 CSS 变量值
  const updateCssVar = useCallback(() => {
    if (!targetRef.current || !prop) return;

    const computedValue = window
      .getComputedStyle(targetRef.current)
      .getPropertyValue(prop)
      .trim();

    setValue(computedValue || initialValue);
  }, [prop, initialValue]);

  // 监听目标元素的样式变化
  useEffect(() => {
    if (!observe || !targetRef.current) return;

    const observer = new MutationObserver(updateCssVar);
    observer.observe(targetRef.current, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return () => observer.disconnect();
  }, [observe, updateCssVar]);

  // 初始化和属性变化时更新
  useEffect(() => {
    updateCssVar();
  }, [prop, updateCssVar]);

  // 监听值变化并更新样式
  useEffect(() => {
    if (!targetRef.current || !prop) return;

    if (value === null) {
      targetRef.current.style.removeProperty(prop);
    } else {
      targetRef.current.style.setProperty(prop, value);
    }
  }, [value, prop]);

  return [value, setValue] as const;
}
