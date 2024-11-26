import type { XpressButtonProps } from './types';

import { LoaderCircle } from '@xpress-core/icons';

import { type HTMLAttributes, useMemo } from 'react';

import { Button as ButtonPrimitive } from '../../ui';

interface ButtonProps
  extends XpressButtonProps,
    HTMLAttributes<HTMLButtonElement> {}

export function XpressButton({
  asChild,
  className,
  disabled = false,
  loading = false,
  size = 'default',
  variant = 'default',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = useMemo(() => {
    return disabled || loading;
  }, [disabled, loading]);

  return (
    <ButtonPrimitive
      asChild={asChild}
      className={className}
      disabled={isDisabled}
      size={size}
      variant={variant}
      {...props}
    >
      {loading && (
        <LoaderCircle className="text-md mr-2 size-4 flex-shrink-0 animate-spin" />
      )}
      {children}
    </ButtonPrimitive>
  );
}
