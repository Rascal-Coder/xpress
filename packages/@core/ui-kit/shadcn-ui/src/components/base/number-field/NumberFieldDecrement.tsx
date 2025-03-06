import { usePressedHold } from '@xpress-core/hooks';
import { cn } from '@xpress-core/shared/utils';

import { Minus } from 'lucide-react';
import { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { NumberFieldContext } from './NumberFieldItem';

export const NumberFieldDecrement = ({
  className,
  children,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) => {
  const currentElement = useRef<HTMLButtonElement>(null);
  const { disabled, handleDecrease, isDecreaseDisabled } =
    useContext(NumberFieldContext);
  const isDisabled = useMemo(
    () => disabled || props.disabled || isDecreaseDisabled,
    [disabled, props.disabled, isDecreaseDisabled],
  );
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(
    null,
  );

  useLayoutEffect(() => {
    setButtonElement(currentElement.current);
  }, []);

  const { isPressed } = usePressedHold({
    disabled: isDisabled,
    onTrigger: handleDecrease,
    target: buttonElement,
  });

  return (
    <button
      aria-label="Decrease"
      className={cn(
        'absolute left-1 top-1/2 -translate-y-1/2 rounded-sm p-1.5',
        'transition-all duration-200 ease-in-out',
        'hover:bg-[#e8e8e8] active:bg-[#dedede] dark:hover:bg-[#6e6e6e] dark:active:bg-[#606060]',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent',
        className,
      )}
      data-disabled={isDisabled}
      data-pressed={isPressed ? 'true' : undefined}
      disabled={isDisabled}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      ref={currentElement}
      style={{
        userSelect: isPressed ? 'none' : undefined,
      }}
      tabIndex={-1}
    >
      {children || <Minus className="h-4 w-4" />}
    </button>
  );
};
