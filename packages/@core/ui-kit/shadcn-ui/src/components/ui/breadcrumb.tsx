import { cn } from '@xpress-core/shared/utils';

import { Slot } from '@radix-ui/react-slot';
import { ChevronRightIcon, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

const Breadcrumb = React.forwardRef<
  HTMLElement,
  {
    separator?: React.ReactNode;
  } & React.ComponentPropsWithoutRef<'nav'>
>(({ ...props }, ref) => (
  <nav aria-label="breadcrumb" ref={ref} role="navigation" {...props} />
));
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <ol
    className={cn(
      'text-muted-foreground flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5',
      className,
    )}
    ref={ref}
    {...props}
  />
));
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li
    className={cn(
      'hover:text-foreground inline-flex items-center gap-1.5',
      className,
    )}
    ref={ref}
    {...props}
  >
    {props.children}
  </li>
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  {
    asChild?: boolean;
  } & React.ComponentPropsWithoutRef<'a'>
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      className={cn(
        'hover:text-foreground cursor-pointer transition-colors',
        className,
      )}
      ref={ref}
      {...props}
    >
      {props.children}
    </Comp>
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span
    aria-current="page"
    aria-disabled="true"
    className={cn('text-foreground cursor-pointer', className)}
    ref={ref}
    role="link"
    {...props}
  />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({
  className,
  children,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    aria-hidden="true"
    className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)}
    role="presentation"
    {...props}
  >
    {children ?? <ChevronRightIcon />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    role="presentation"
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
