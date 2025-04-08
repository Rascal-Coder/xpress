import type { BadgeVariants } from './badge';

import { cn } from '@xpress-core/shared/utils';

import { badgeVariants } from './badge';

export const Badge = ({
  className,
  variant,
  children,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariants['variant'];
}) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)}>{children}</div>
  );
};
