import { NumberFormatter, NumberParser } from '@internationalized/number';
import { useEventListener } from 'ahooks';
import { useCallback, useEffect, useRef, useState } from 'react';

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

export function useNumberFormatter(
  locale: string,
  options: Intl.NumberFormatOptions | undefined,
) {
  return new NumberFormatter(locale, options);
}

export function useNumberParser(
  locale: string,
  options: Intl.NumberFormatOptions | undefined,
) {
  return new NumberParser(locale, options);
}

/**
 * 处理小数运算的函数
 * 解决JavaScript浮点数计算精度问题
 * @param operator 运算符（加号或减号）
 * @param value1 第一个操作数
 * @param value2 第二个操作数
 * @returns 计算结果
 */
export function handleDecimalOperation(
  operator: '+' | '-',
  value1: number,
  value2: number,
): number {
  let result = operator === '+' ? value1 + value2 : value1 - value2;

  // 检查是否包含小数
  if (value1 % 1 !== 0 || value2 % 1 !== 0) {
    // 将数字转换为字符串并按小数点分割
    const value1Decimal = value1.toString().split('.');
    const value2Decimal = value2.toString().split('.');

    // 获取小数部分的长度
    const value1DecimalLength = value1Decimal[1]?.length ?? 0;
    const value2DecimalLength = value2Decimal[1]?.length ?? 0;

    // 计算需要的倍数，用于将小数转换为整数
    const multiplier = 10 ** Math.max(value1DecimalLength, value2DecimalLength);

    // 将小数转换为整数进行计算
    value1 = Math.round(value1 * multiplier);
    value2 = Math.round(value2 * multiplier);

    // 使用整数进行计算，避免浮点数精度问题
    result = operator === '+' ? value1 + value2 : value1 - value2;

    // 将结果转换回小数
    result /= multiplier;
  }

  return result;
}

interface Props {
  defaultValue?: number;
  modelValue?: number;
  onModelValueChange?: (value: number) => void;
}
export const useVModel = (props: Props) => {
  const [value, setValue] = useState<number>(
    props.modelValue ?? props.defaultValue ?? 0,
  );

  useEffect(() => {
    if (props.modelValue !== undefined) {
      setValue(props.modelValue);
    }
  }, [props.modelValue]);

  const handleChange = useCallback(
    (newValue: number) => {
      setValue(newValue);
      props.onModelValueChange?.(newValue);
    },
    [props],
  );

  return [value, handleChange] as const;
};
