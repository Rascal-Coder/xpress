import { useEventListener } from 'ahooks';
import { useCallback, useRef, useState } from 'react';

interface UsePressedHoldOptions {
  disabled?: boolean;
  onTrigger?: () => void;
  target?: HTMLElement | null;
}

/**
 * 长按事件处理的自定义Hook
 * 用于处理按钮的长按操作，比如数字输入框的增减按钮
 *
 * @param options - Hook的配置选项
 * @param options.disabled - 是否禁用长按功能
 * @param options.onTrigger - 触发时的回调函数
 * @param options.target - 需要绑定长按事件的目标DOM元素，默认为window
 *
 * @returns 返回一个对象，包含:
 * - isPressed: 当前是否处于按压状态
 * - onTrigger: 传入的触发回调函数
 *
 * @description
 * 功能特点:
 * 1. 支持长按连续触发
 * 2. 首次触发延迟400ms，之后每60ms触发一次
 * 3. 只响应鼠标左键点击
 * 4. 自动清理定时器，防止内存泄漏
 */
export const usePressedHold = (options: UsePressedHoldOptions) => {
  const { disabled, onTrigger, target } = options;
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<number>();

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  const onIncrementPressStart = useCallback(
    (delay: number) => {
      resetTimeout();
      if (disabled) return;

      onTrigger?.();

      timeoutRef.current = window.setTimeout(() => {
        onIncrementPressStart(60);
      }, delay);
    },
    [disabled, onTrigger, resetTimeout],
  );

  const handlePressStart = useCallback(() => {
    onIncrementPressStart(400);
  }, [onIncrementPressStart]);

  const handlePressEnd = useCallback(() => {
    resetTimeout();
  }, [resetTimeout]);

  const onPressStart = useCallback(
    (event: Event) => {
      if (!(event instanceof PointerEvent) || event.button !== 0 || isPressed)
        return;
      event.preventDefault();
      setIsPressed(true);
      handlePressStart();
    },
    [isPressed, handlePressStart],
  );

  const onPressRelease = useCallback(() => {
    setIsPressed(false);
    handlePressEnd();
  }, [handlePressEnd]);

  useEventListener('pointerdown', onPressStart, { target: target || window });

  useEventListener('pointerup', onPressRelease, { target: window });

  useEventListener('pointercancel', onPressRelease, { target: window });

  return {
    isPressed,
    onTrigger,
  };
};
