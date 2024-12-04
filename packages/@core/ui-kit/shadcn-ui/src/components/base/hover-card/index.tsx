import type {
  HoverCardContentProps,
  HoverCardProps,
} from '@radix-ui/react-hover-card';

import { cn } from '@xpress-core/shared/utils';

import { forwardRef } from 'react';

import {
  HoverCardContent,
  HoverCard as HoverCardRoot,
  HoverCardTrigger,
} from '../../ui/hover-card';

export interface XpressHoverCardProps extends HoverCardProps {
  children?: React.ReactNode;
  className?: string;
  contentClass?: string;
  contentProps?: HoverCardContentProps;
  trigger?: React.ReactNode;
}

export const XpressHoverCard = forwardRef<HTMLDivElement, XpressHoverCardProps>(
  (
    { className, contentClass, contentProps, trigger, children, ...props },
    ref,
  ) => {
    return (
      <HoverCardRoot {...props}>
        <HoverCardTrigger asChild className={cn('h-full', className)}>
          <div className="h-full cursor-pointer" ref={ref}>
            {trigger}
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          className={cn('side-content z-[1000]', contentClass)}
          {...contentProps}
        >
          {children}
        </HoverCardContent>
      </HoverCardRoot>
    );
  },
);

XpressHoverCard.displayName = 'XpressHoverCard';

export default XpressHoverCard;
