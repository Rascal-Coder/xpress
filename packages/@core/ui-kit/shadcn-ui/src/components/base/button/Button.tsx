import type { XpressButtonProps } from './types';

import { LoaderCircle } from '@xpress-core/icons';

import { forwardRef, type HTMLAttributes } from 'react';

import { Button as ButtonPrimitive } from '../../ui';

interface ButtonProps
  extends XpressButtonProps,
    HTMLAttributes<HTMLButtonElement> {}

export const XpressButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      className,
      disabled = false,
      loading = false,
      size = 'default',
      variant = 'default',
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <ButtonPrimitive
        asChild={asChild}
        className={className}
        disabled={isDisabled}
        ref={ref}
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
  },
);

XpressButton.displayName = 'XpressButton';
