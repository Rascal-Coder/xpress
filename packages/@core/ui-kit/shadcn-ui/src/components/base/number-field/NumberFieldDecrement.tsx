import { cn } from '@xpress-core/shared/utils';

import { Minus } from 'lucide-react';
import { useContext, useEffect, useMemo, useRef } from 'react';

import { usePressedHold } from './hooks';
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
  const { isPressed, onPressRelease, onPressStart } = usePressedHold({
    disabled: isDisabled,
    onTrigger: handleDecrease,
  });

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      onPressRelease();
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [onPressRelease]);

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
      onPointerDown={onPressStart}
      ref={currentElement}
      style={{
        userSelect: 'none',
      }}
      tabIndex={-1}
    >
      {children || <Minus className="h-4 w-4" />}
    </button>
  );
};
