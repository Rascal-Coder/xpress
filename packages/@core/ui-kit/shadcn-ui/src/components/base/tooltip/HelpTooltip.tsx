import { cn } from '@xpress-core/shared/utils';

import { CircleHelp } from 'lucide-react';

import { XpressTooltip } from './Tooltip';

interface HelpTooltipProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  triggerClass?: string;
}

export function XpressHelpTooltip({
  trigger,
  triggerClass,
  children,
}: HelpTooltipProps) {
  return (
    <XpressTooltip
      delayDuration={300}
      side="right"
      trigger={
        trigger || (
          <CircleHelp
            className={cn(
              'text-foreground/80 hover:text-foreground inline-flex h-5 w-5 cursor-pointer',
              triggerClass,
            )}
          />
        )
      }
    >
      {children}
    </XpressTooltip>
  );
}
