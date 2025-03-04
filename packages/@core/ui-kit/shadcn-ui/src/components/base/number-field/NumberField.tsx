import { cn } from '@xpress-core/shared/utils';

export const NumberField = ({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('grid gap-1.5', className)}>{children}</div>;
};
