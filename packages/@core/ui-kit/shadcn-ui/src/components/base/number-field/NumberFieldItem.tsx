import { useControlledState } from '@xpress-core/hooks';
import {
  clamp,
  cn,
  handleDecimalOperation,
  snapValueToStep,
  useNumberFormatter,
  useNumberParser,
} from '@xpress-core/shared/utils';

import {
  createContext,
  type HTMLAttributes,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { NumberField } from './NumberField';
import { NumberFieldContent } from './NumberFieldContent';
import { NumberFieldDecrement } from './NumberFieldDecrement';
import { NumberFieldIncrement } from './NumberFieldIncrement';
import { NumberFieldInput } from './NumberFieldInput';

export interface NumberFieldItemProps {
  /** 元素的类名 */
  className?: string;
  defaultValue: number;
  /** 当为true时，阻止用户与数字输入框交互 */
  disabled?: boolean;
  /** 数字字段中显示的值的格式化选项。这也会影响用户允许输入的字符 */
  formatOptions?: Intl.NumberFormatOptions;
  /** 元素的ID */
  id?: string;
  /** 用于格式化日期的区域设置 */
  locale?: string;
  /** 输入允许的最大值 */
  max?: number;
  /** 输入允许的最小值 */
  min?: number;
  /** 每次增加或减少"点击"时输入值变化的数量 */
  modelValue?: null | number;
  /** 字段的名称。作为名称/值对的一部分与其所属表单一起提交 */
  name?: string;
  /** 值变化时的回调函数 */
  onChange?: (value: number) => void;
  /** 当为true时，表示用户必须在提交所属表单之前设置该值 */
  required?: boolean;
  /** 用于格式化日期的区域设置 */
  step?: number;
}

export interface NumberFieldRootContext {
  applyInputValue: (val: string) => void;
  disabled: boolean;
  handleDecrease: (multiplier?: number) => void;
  handleIncrease: (multiplier?: number) => void;
  handleMinMaxValue: (type: 'max' | 'min') => void;
  id: string | undefined;
  inputMode: HTMLAttributes<HTMLInputElement>['inputMode'];
  isDecreaseDisabled: boolean;
  isIncreaseDisabled: boolean;
  max: number | undefined;
  min: number | undefined;
  modelValue: number;
  setInputValue: (val: string) => void;
  textValue: string;
  validate: (val: string) => boolean;
}
export const NumberFieldContext = createContext<NumberFieldRootContext>(
  {} as NumberFieldRootContext,
);
export const NumberFieldItem = ({
  className,
  defaultValue,
  disabled,
  formatOptions,
  id,
  locale = 'en',
  max,
  min,
  modelValue,
  onChange,
  step = 1,
}: NumberFieldItemProps) => {
  const [value, handleChange] = useControlledState({
    defaultValue,
    modelValue: modelValue ?? 0,
    onModelValueChange: onChange,
  });
  const numberFormatter = useNumberFormatter(locale, formatOptions);
  const numberParser = useNumberParser(locale, formatOptions);
  const inputEl = useRef<HTMLInputElement>(null);
  const clampInputValue = useCallback(
    (val: number) => {
      // 将值限制在最小值和最大值之间，四舍五入到最接近的步进值，并四舍五入到指定的小数位数
      let clampedValue: number;
      clampedValue =
        step === undefined || Number.isNaN(step)
          ? clamp(val, min ?? 0, max ?? 0)
          : snapValueToStep(val, min ?? 0, max ?? 0, step);

      clampedValue = numberParser.parse(numberFormatter.format(clampedValue));
      return clampedValue;
    },
    [numberFormatter, numberParser, step, min, max],
  );
  const isDecreaseDisabled = useMemo(() => {
    return (
      clampInputValue(value ?? 0) === min ||
      (min && !Number.isNaN(min)
        ? handleDecimalOperation('-', value ?? 0, step) < min
        : false)
    );
  }, [clampInputValue, min, step, value]);
  const isIncreaseDisabled = useMemo(() => {
    return (
      clampInputValue(value ?? 0) === max ||
      (max && !Number.isNaN(max)
        ? handleDecimalOperation('+', value ?? 0, step) > max
        : false)
    );
  }, [clampInputValue, max, step, value]);
  function handleChangingValue(type: 'decrease' | 'increase', multiplier = 1) {
    inputEl.current?.focus();
    const currentInputValue = numberParser.parse(inputEl.current?.value ?? '');
    if (disabled) return;

    let newValue: number;
    if (Number.isNaN(currentInputValue)) {
      newValue = min ?? 0;
    } else {
      newValue =
        type === 'increase'
          ? clampInputValue(currentInputValue + (step ?? 1) * multiplier)
          : clampInputValue(currentInputValue - (step ?? 1) * multiplier);
    }
    handleChange?.(newValue);
  }

  function handleIncrease(multiplier = 1) {
    handleChangingValue('increase', multiplier);
  }
  function handleDecrease(multiplier = 1) {
    handleChangingValue('decrease', multiplier);
  }

  function handleMinMaxValue(type: 'max' | 'min') {
    if (type === 'min' && min !== undefined) {
      handleChange?.(clampInputValue(min));
    } else if (type === 'max' && max !== undefined) {
      handleChange?.(clampInputValue(max));
    }
  }

  const inputMode = useMemo(() => {
    // 根据格式化选项判断是否允许小数输入
    const hasDecimals =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      numberFormatter.resolvedOptions().maximumFractionDigits! > 0;
    return hasDecimals ? 'decimal' : 'numeric';
  }, [numberFormatter]);

  // 使用减号替换会计格式的负号，以便更好地朗读
  const textValueFormatter = useNumberFormatter(locale, formatOptions);
  const textValue = useMemo(
    () => (Number.isNaN(value) ? '' : textValueFormatter.format(value ?? 0)),
    [value, textValueFormatter],
  );

  function validate(val: string) {
    return numberParser.isValidPartialNumber(val, min ?? 0, max ?? 0);
  }

  function setInputValue(val: string) {
    if (inputEl.current) inputEl.current.value = val;
  }

  const applyInputValue = useCallback(
    (val: string) => {
      const parsedValue = numberParser.parse(val);
      const clampedValue = clampInputValue(parsedValue);

      handleChange(clampedValue);
      // 如果输入值为空，保持空值状态
      if (val.length === 0) {
        setInputValue(val);
        return;
      }

      // 如果解析失败，重置为当前格式化后的数值
      if (Number.isNaN(parsedValue)) {
        setInputValue(textValue);
        return;
      }

      setInputValue(textValue);
    },
    [clampInputValue, handleChange, numberParser, textValue],
  );

  return (
    <NumberFieldContext.Provider
      value={{
        applyInputValue,
        disabled: disabled ?? false,
        handleDecrease,
        handleIncrease,
        handleMinMaxValue,
        id,
        inputMode,
        isDecreaseDisabled,
        isIncreaseDisabled,
        max,
        min,
        modelValue: value,
        setInputValue,
        textValue,
        validate,
      }}
    >
      <NumberField className={cn(className)}>
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput ref={inputEl} />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </NumberFieldContext.Provider>
  );
};
