import { cn } from '@xpress-core/shared/utils';

export const NumberFieldContent = ({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'relative [&>[data-slot=input]]:has-[[data-slot=decrement]]:pl-5 [&>[data-slot=input]]:has-[[data-slot=increment]]:pr-5',
        className,
      )}
    >
      {children}
    </div>
  );
};
