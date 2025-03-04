import {
  type FormEvent,
  forwardRef,
  type KeyboardEvent,
  useContext,
  type WheelEvent,
} from 'react';

import { Input } from '../../ui';
import { NumberFieldContext } from './NumberFieldItem';
import { getActiveElement } from './shared';

export const NumberFieldInput = forwardRef<HTMLInputElement>((_, ref) => {
  const {
    applyInputValue,
    disabled,
    handleDecrease,
    handleIncrease,
    handleMinMaxValue,
    id,
    inputMode,
    max,
    min,
    modelValue,
    textValue,
    validate,
  } = useContext(NumberFieldContext);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        handleDecrease();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        handleIncrease();
        break;
      }
      case 'End': {
        e.preventDefault();
        handleMinMaxValue('max');
        break;
      }
      case 'Enter': {
        e.preventDefault();
        applyInputValue((e.target as HTMLInputElement).value);
        break;
      }
      case 'Home': {
        e.preventDefault();
        handleMinMaxValue('min');
        break;
      }
      case 'PageDown': {
        e.preventDefault();
        handleDecrease(10);
        break;
      }
      case 'PageUp': {
        e.preventDefault();
        handleIncrease(10);
        break;
      }
    }
  };

  const handleWheel = (e: WheelEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target !== getActiveElement()) return;

    // 在触控板上，用户可能同时在 X 和 Y 方向滚动
    // 如果滚动主要在 X 方向，则认为用户不是想要增减数值
    // 这个判断不是完美的，因为事件会快速触发且增量很小
    // 特别是当用户在接近 45 度角滚动时
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

    if (e.deltaY < 0) {
      handleIncrease();
    } else {
      handleDecrease();
    }
  };

  const handleBeforeInput = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const data = (e as unknown as InputEvent).data;
    const nextValue =
      target.value.slice(0, target.selectionStart ?? undefined) +
      (data ?? '') +
      target.value.slice(target.selectionEnd ?? undefined);
    if (!validate(nextValue)) {
      e.preventDefault();
    }
  };

  return (
    <Input
      aria-roledescription="Number field"
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={modelValue}
      autoComplete="off"
      autoCorrect="off"
      data-disabled={disabled}
      disabled={disabled}
      id={id}
      inputMode={inputMode}
      onBeforeInput={handleBeforeInput}
      onBlur={(e) => {
        applyInputValue(e.target.value);
      }}
      onChange={(e) => {
        applyInputValue(e.target.value);
      }}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      ref={ref}
      role="spinbutton"
      spellCheck={false}
      tabIndex={0}
      type="text"
      value={textValue}
    />
  );
});

NumberFieldInput.displayName = 'NumberFieldInput';
