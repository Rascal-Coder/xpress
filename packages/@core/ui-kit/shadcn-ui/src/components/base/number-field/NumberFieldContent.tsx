import { cn } from '@xpress-core/shared/utils';

export const NumberFieldContent = ({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('relative', className)}>{children}</div>;
};
