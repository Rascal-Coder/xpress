import type { XpressButtonProps } from './types';

import { cn } from '@xpress-core/shared/utils';

import { type HTMLAttributes } from 'react';

import { XpressTooltip } from '../tooltip';
import { XpressButton } from './Button';

interface IconButtonProps
  extends XpressButtonProps,
    HTMLAttributes<HTMLButtonElement> {
  tooltip?: React.ReactNode | string;
  tooltipDelayDuration?: number;
  tooltipSide?: 'bottom' | 'left' | 'right' | 'top';
}

export function XpressIconButton({
  className,
  disabled = false,
  onClick,
  size = 'icon',
  tooltip,
  tooltipDelayDuration = 200,
  tooltipSide = 'bottom',
  variant = 'icon',
  children,
  ...props
}: IconButtonProps) {
  const BaseIconButton = (
    <XpressButton
      className={cn('rounded-full', className)}
      disabled={disabled}
      onClick={onClick}
      size={size}
      variant={variant}
      {...props}
    >
      {children}
    </XpressButton>
  );

  if (!tooltip) {
    return BaseIconButton;
  }

  return (
    <XpressTooltip
      delayDuration={tooltipDelayDuration}
      side={tooltipSide}
      trigger={BaseIconButton}
    >
      {tooltip}
    </XpressTooltip>
  );
}
