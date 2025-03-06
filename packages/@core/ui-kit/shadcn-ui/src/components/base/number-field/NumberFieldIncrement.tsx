import { usePressedHold } from '@xpress-core/hooks';
import { cn } from '@xpress-core/shared/utils';

import { Plus } from 'lucide-react';
import { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { NumberFieldContext } from './NumberFieldItem';

export const NumberFieldIncrement = ({
  className,
  children,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) => {
  const currentElement = useRef<HTMLButtonElement>(null);
  const { disabled, handleIncrease, isIncreaseDisabled } =
    useContext(NumberFieldContext);
  const isDisabled = useMemo(
    () => disabled || props.disabled || isIncreaseDisabled,
    [disabled, props.disabled, isIncreaseDisabled],
  );
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(
    null,
  );

  useLayoutEffect(() => {
    setButtonElement(currentElement.current);
  }, []);

  const { isPressed } = usePressedHold({
    disabled: isDisabled,
    onTrigger: handleIncrease,
    target: buttonElement,
  });

  return (
    <button
      aria-label="Increase"
      className={cn(
        'absolute right-1 top-1/2 -translate-y-1/2 rounded-sm p-1.5',
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
      {children || <Plus className="h-4 w-4" />}
    </button>
  );
};
