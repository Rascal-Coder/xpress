import type { Props } from './types';

import { X } from '@xpress/icons';
import { useIsMobile } from '@xpress-core/hooks';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  VisuallyHidden,
  XpressButton,
  XpressLoading,
} from '@xpress-core/shadcn-ui';
import { ELEMENT_ID_MAIN_CONTENT } from '@xpress-core/shared/constants';
import { cn } from '@xpress-core/shared/utils';

import { forwardRef, useEffect, useId, useMemo, useRef } from 'react';

export const Drawer = forwardRef<HTMLDivElement, Props>(
  (
    {
      onDrawerBeforeClose,
      isOpen,
      setIsOpen,
      placement = 'right',
      className,
      modal = true,
      zIndex = 2000,
      overlayBlur = 1,
      onDrawerClosed,
      onDrawerOpened,
      closeOnPressEscape = true,
      closeOnClickModal = true,
      appendToMain = true,
      showHeader = true,
      headerClass,
      closable = true,
      closeIconPlacement = 'right',
      closeIcon,
      title,
      description,
      extra,
      contentClass,
      showLoading,
      children,
      showFooter = true,
      footerClass,
      prependFooter,
      appendFooter,
      footer,
      showCancelButton = true,
      showConfirmButton = true,
      cancelText,
      confirmText,
      confirmLoading,
      onDrawerCancel,
      onDrawerConfirm,
    },
    ref,
  ) => {
    const { isMobile } = useIsMobile();
    const id = useId();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const onOpenChange = async (open: boolean) => {
      if (open) {
        setIsOpen(true);
      } else {
        const allowClose = onDrawerBeforeClose ? onDrawerBeforeClose() : true;
        if (allowClose) {
          setIsOpen(false);
        }
      }
    };
    const handleFocusOutside = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onClosed = () => {
      if (!isOpen) {
        onDrawerClosed?.();
      }
    };

    const onEscapeKeyDown = (e: KeyboardEvent) => {
      if (!closeOnPressEscape) {
        e.preventDefault();
      }
    };
    const onInteractOutside = (e: Event) => {
      if (!closeOnClickModal) {
        e.preventDefault();
      }
    };
    const onOpenAutoFocus = (e: Event) => {
      if (!closeOnPressEscape) {
        e.preventDefault();
      }
    };
    const onOpened = () => {
      if (isOpen) {
        onDrawerOpened?.();
      }
    };

    const onPointerDownOutside = (e: Event) => {
      const target = e.target as HTMLElement;
      const drawerContent = document.querySelector(`[data-drawer="${id}"]`);
      if (
        drawerContent &&
        !drawerContent.contains(target) &&
        !closeOnClickModal
      ) {
        e.preventDefault();
      }
    };
    const getAppendTo = useMemo(() => {
      return appendToMain ? `#${ELEMENT_ID_MAIN_CONTENT}` : undefined;
    }, [appendToMain]);

    useEffect(() => {
      if (showLoading && wrapperRef.current) {
        wrapperRef.current.scrollTo({
          top: 0,
        });
      }
    }, [showLoading]);
    return (
      <Sheet modal={false} onOpenChange={onOpenChange} open={isOpen}>
        <SheetContent
          className={cn('flex w-[520px] flex-col', className, {
            '!w-full':
              isMobile || placement === 'bottom' || placement === 'top',
            'max-h-[100vh]': placement === 'bottom' || placement === 'top',
          })}
          container={
            getAppendTo
              ? ((document.querySelector(getAppendTo) || undefined) as
                  | HTMLElement
                  | undefined)
              : undefined
          }
          data-drawer={id}
          modal={modal}
          onCloseAutoFocus={handleFocusOutside}
          onClosed={onClosed}
          onEscapeKeyDown={onEscapeKeyDown}
          onFocusOutside={handleFocusOutside}
          onInteractOutside={onInteractOutside}
          onOpenAutoFocus={onOpenAutoFocus}
          onOpened={onOpened}
          onPointerDownOutside={onPointerDownOutside}
          open={isOpen}
          overlayBlur={overlayBlur}
          ref={ref}
          side={placement}
          zIndex={zIndex}
        >
          {showHeader ? (
            <SheetHeader
              className={cn(
                '!flex flex-row items-center justify-between border-b px-6 py-5',
                headerClass,
                {
                  'px-4 py-3': closable,
                  'pl-2': closable && closeIconPlacement === 'left',
                },
              )}
            >
              <div className="flex items-center">
                {closable && closeIconPlacement === 'left' && (
                  <SheetClose
                    asChild
                    className="data-[state=open]:bg-secondary ml-[2px] cursor-pointer rounded-full opacity-80 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
                  >
                    {closeIcon || (
                      <XpressButton size="icon" variant="icon">
                        <X className="size-4" />
                      </XpressButton>
                    )}
                  </SheetClose>
                )}
                {(!title || !description) && (
                  <VisuallyHidden>
                    {!title && <SheetTitle />}
                    {!description && <SheetDescription />}
                  </VisuallyHidden>
                )}
                <div className="flex-center">
                  {extra}
                  {closable && closeIconPlacement === 'right' && (
                    <SheetClose
                      asChild
                      className="data-[state=open]:bg-secondary ml-[2px] cursor-pointer rounded-full opacity-80 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
                    >
                      {closeIcon || (
                        <XpressButton size="icon" variant="icon">
                          <X className="size-4" />
                        </XpressButton>
                      )}
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetHeader>
          ) : (
            <VisuallyHidden>
              <SheetTitle />
              <SheetDescription />
            </VisuallyHidden>
          )}
          <div
            className={cn('relative flex-1 overflow-y-auto p-3', contentClass, {
              'overflow-hidden': showLoading,
            })}
            ref={wrapperRef}
          >
            {showLoading && <XpressLoading className="size-full" spinning />}
            {children}
          </div>
          {showFooter && (
            <SheetFooter
              className={cn(
                'w-full flex-row items-center justify-end border-t p-2 px-3',
                footerClass,
              )}
            >
              {prependFooter}
              {footer ||
                (showCancelButton && (
                  <XpressButton onClick={onDrawerCancel} variant="ghost">
                    {cancelText || '取消'}
                  </XpressButton>
                ))}
              {showConfirmButton && (
                <XpressButton
                  loading={confirmLoading}
                  onClick={onDrawerConfirm}
                >
                  {confirmText || '确定'}
                </XpressButton>
              )}
              {appendFooter}
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    );
  },
);

Drawer.displayName = 'Drawer';
