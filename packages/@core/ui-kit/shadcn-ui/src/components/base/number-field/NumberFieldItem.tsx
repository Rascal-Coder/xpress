import { cn } from '@xpress-core/shared/utils';

import {
  createContext,
  type HTMLAttributes,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import {
  handleDecimalOperation,
  useNumberFormatter,
  useNumberParser,
  useVModel,
} from './hooks';
import { NumberField } from './NumberField';
import { NumberFieldContent } from './NumberFieldContent';
import { NumberFieldDecrement } from './NumberFieldDecrement';
import { NumberFieldIncrement } from './NumberFieldIncrement';
import { NumberFieldInput } from './NumberFieldInput';
import { clamp, snapValueToStep } from './shared';

export interface NumberFieldItemProps {
  /** The class name of the element. */
  className?: string;
  defaultValue?: number;
  /** When `true`, prevents the user from interacting with the Number Field. */
  disabled?: boolean;
  /** Formatting options for the value displayed in the number field. This also affects what characters are allowed to be typed by the user. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Id of the element */
  id?: string;
  /** The locale to use for formatting dates */
  locale?: string;
  /** The largest value allowed for the input. */
  max?: number;
  /** The smallest value allowed for the input. */
  min?: number;
  /** The amount that the input value changes with each increment or decrement "tick". */
  modelValue?: null | number;
  /** The name of the field. Submitted with its owning form as part of a name/value pair. */
  name?: string;
  /** Called when the value changes */
  onChange?: (value: number) => void;
  /** When `true`, indicates that the user must set the value before the owning form can be submitted. */
  required?: boolean;
  /** The locale to use for formatting dates */
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
  const [value, handleChange] = useVModel({
    defaultValue,
    modelValue: modelValue ?? 0,
    onModelValueChange: onChange,
  });
  // Formatter
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
