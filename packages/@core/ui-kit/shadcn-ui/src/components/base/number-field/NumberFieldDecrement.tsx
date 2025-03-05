import { usePressedHold } from '@xpress-core/hooks';
import { cn } from '@xpress-core/shared/utils';

import { Minus } from 'lucide-react';
import { useContext, useMemo, useRef } from 'react';

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
  const { isPressed } = usePressedHold({
    disabled: isDisabled,
    onTrigger: handleDecrease,
    target: currentElement.current,
  });

  return (
    <button
      aria-label="Decrease"
      className={cn(
        'absolute left-0 top-1/2 -translate-y-1/2 p-3 disabled:cursor-not-allowed disabled:opacity-20',
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
