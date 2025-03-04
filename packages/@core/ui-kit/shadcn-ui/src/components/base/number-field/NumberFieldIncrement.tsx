import { cn } from '@xpress-core/shared/utils';

import { Plus } from 'lucide-react';
import { useContext, useEffect, useMemo, useRef } from 'react';

import { usePressedHold } from './hooks';
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
  const { isPressed, onPressRelease, onPressStart } = usePressedHold({
    disabled: isDisabled,
    onTrigger: handleIncrease,
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
      aria-label="Increase"
      className={cn(
        'absolute right-0 top-1/2 -translate-y-1/2 p-3 disabled:cursor-not-allowed disabled:opacity-20',
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
      {children || <Plus className="h-4 w-4" />}
    </button>
  );
};
