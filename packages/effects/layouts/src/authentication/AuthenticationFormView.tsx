import { cn } from '@xpress-core/shared/utils';

export const AuthenticationFormView = ({
  className,
  children,
  copyright,
}: {
  children: React.ReactNode;
  className?: string;
  copyright: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'flex-col-center dark:bg-background-deep bg-background relative px-6 py-10 lg:flex-1 lg:px-8',
        className,
      )}
    >
      <div className="enter-x mt-6 w-full sm:mx-auto md:max-w-md">
        {children}
      </div>
      <div className="text-muted-foreground absolute bottom-3 flex text-center text-xs">
        {copyright}
      </div>
    </div>
  );
};
