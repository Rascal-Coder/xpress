import { cn } from '@xpress-core/shared/utils';

import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const DrawerContext = React.createContext<{ id: string }>({ id: '' });
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const { id } = React.useContext(DrawerContext);
  return (
    <div
      className={cn('bg-overlay z-popup fixed inset-0', className)}
      ref={ref}
      {...props}
      data-dismissable-drawer={id}
    ></div>
  );
});
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 border-border',
  {
    defaultVariants: {
      side: 'right',
    },
    variants: {
      side: {
        bottom:
          'inset-x-0 bottom-0 border-t border-border data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left ',
        right:
          'inset-y-0 right-0 w-3/4 border-l  data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
      },
    },
  },
);

type SheetVariants = VariantProps<typeof sheetVariants>;

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    SheetVariants {
  class?: any;
  closeIcon?: React.ReactNode;
  container?: HTMLElement;
  modal?: boolean;
  onClosed?: () => void;
  onOpened?: () => void;
  open?: boolean;
  overlayBlur?: number;
  side?: SheetVariants['side'];
  zIndex?: number;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      className,
      container,
      modal,
      onClosed,
      onOpened,
      open,
      overlayBlur,
      side = 'right',
      zIndex,
      children,
      ...props
    },
    ref,
  ) => {
    // useScrollLock();
    const position = React.useMemo(
      () => (container ? 'absolute' : 'fixed'),
      [container],
    );
    const overlayStyle = {
      ...(zIndex ? { zIndex } : {}),
      backdropFilter:
        overlayBlur && overlayBlur > 0 ? `blur(${overlayBlur}px)` : 'none',
      position,
    } as const;

    const contentStyle = {
      ...(zIndex ? { zIndex } : {}),
      position,
    } as const;

    function onAnimationEnd(event: React.AnimationEvent<HTMLDivElement>) {
      if (event.target === (ref as React.RefObject<HTMLDivElement>)?.current) {
        if (open) {
          onOpened?.();
        } else {
          onClosed?.();
        }
      }
    }

    return (
      <SheetPortal container={container}>
        {open && modal && <SheetOverlay style={overlayStyle}></SheetOverlay>}
        <SheetPrimitive.Content
          className={cn('z-popup', sheetVariants({ side }), className)}
          onAnimationEnd={onAnimationEnd}
          ref={ref}
          style={contentStyle}
          {...props}
        >
          {children}
        </SheetPrimitive.Content>
      </SheetPortal>
    );
  },
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

// sheet header
const SheetHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col text-center sm:text-left', className)}
    {...props}
  >
    {children}
  </div>
);
SheetHeader.displayName = 'SheetHeader';

// sheet footer
const SheetFooter = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse justify-end gap-x-2', className)}
    {...props}
  >
    {children}
  </div>
);
SheetFooter.displayName = 'SheetFooter';

// sheet title
const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Title
    className={cn('text-foreground font-medium', className)}
    ref={ref}
    {...props}
  >
    {children}
  </SheetPrimitive.Title>
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

// sheet description
const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Description
    className={cn('text-muted-foreground text-sm', className)}
    ref={ref}
    {...props}
  >
    {children}
  </SheetPrimitive.Description>
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  DrawerContext,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
