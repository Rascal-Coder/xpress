import type { XpressTooltipProps } from './types';

import { cn } from '@xpress-core/shared/utils';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui';

export function XpressTooltip({
  contentClass,
  contentStyle,
  delayDuration = 0,
  side = 'right',
  trigger,
  children,
}: XpressTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild tabIndex={-1}>
          {trigger}
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            'side-content text-popover-foreground bg-accent rounded-md',
            contentClass,
          )}
          side={side}
          style={contentStyle}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
