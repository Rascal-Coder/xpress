import type { XpressButtonProps } from './types';

import { LoaderCircle } from '@xpress-core/icons';
import { cn } from '@xpress-core/shared/utils';

import { type HTMLAttributes, useMemo } from 'react';

import { Button as ButtonPrimitive } from '../../ui';

interface ButtonProps
  extends XpressButtonProps,
    HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
export default function Button({
  asChild,
  className,
  disabled,
  loading,
  children,
}: ButtonProps) {
  const isDisabled = useMemo(() => {
    return disabled || loading;
  }, [disabled, loading]);
  return (
    <ButtonPrimitive
      asChild={asChild}
      className={cn(className)}
      disabled={isDisabled}
    >
      {loading && (
        <LoaderCircle className="text-md mr-2 size-4 flex-shrink-0 animate-spin" />
      )}
      {children}
    </ButtonPrimitive>
  );
}
