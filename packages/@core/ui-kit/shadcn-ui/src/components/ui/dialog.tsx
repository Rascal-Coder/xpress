import { cn } from '@xpress-core/shared/utils';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal" {...props}>
      {children}
    </DialogPrimitive.Portal>
  );
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export const DialogContext = React.createContext<{ id: string }>({ id: '' });

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const { id } = React.useContext(DialogContext);
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-popup bg-overlay fixed inset-0',
        className,
      )}
      ref={ref}
      {...props}
      data-dismissable-modal={id}
    />
  );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  closeClass?: string;
  closeDisabled?: boolean;
  container?: HTMLElement;
  modal?: boolean;
  onClose?: () => void;
  onClosed?: () => void;
  onOpened?: () => void;
  open?: boolean;
  overlayBlur?: number;
  showClose?: boolean;
  zIndex?: number;
}
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      closeClass,
      closeDisabled = false,
      container,
      modal,
      onClose,
      onClosed,
      onOpened,
      open,
      overlayBlur,
      showClose = true,
      zIndex,
      children,
      ...props
    },
    ref,
  ) => {
    const position = React.useMemo(
      () => (container ? 'absolute' : 'fixed'),
      [container],
    );

    const onAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
      // 只有在 ref 的动画结束时才触发 opened/closed 事件
      if (
        (event.target as HTMLElement) ===
        (ref as React.RefObject<HTMLDivElement>)?.current
      ) {
        if (open) {
          onOpened?.();
        } else {
          onClosed?.();
        }
      }
    };

    const overlayStyle = {
      ...(zIndex ? { zIndex } : {}),
      backdropFilter:
        overlayBlur && overlayBlur > 0 ? `blur(${overlayBlur}px)` : 'none',
      position,
    } as const;

    return (
      <DialogPortal container={container} data-slot="dialog-portal">
        {modal && open && (
          <DialogOverlay
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            style={overlayStyle}
          />
        )}
        <DialogPrimitive.Content
          className={cn(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-popup fixed left-[50%] top-[50%] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border shadow-lg duration-200 sm:max-w-lg',
            className,
          )}
          data-slot="dialog-content"
          onAnimationEnd={onAnimationEnd}
          ref={ref}
          {...props}
        >
          {children}
          {showClose && (
            <DialogPrimitive.Close
              className={cn(
                'data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:bg-accent hover:text-accent-foreground text-foreground/80 flex-center absolute right-3 top-3 h-6 w-6 rounded-full px-1 text-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none',
                closeClass,
              )}
              disabled={closeDisabled}
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      'flex flex-col gap-y-1.5 text-center sm:text-left',
      className,
    )}
    ref={ref}
    {...props}
  />
));
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    className={cn('flex flex-col-reverse justify-end gap-x-2', className)}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    ref={ref}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    className={cn('text-muted-foreground text-sm', className)}
    ref={ref}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
