import type { Props } from './types';

import { useIsMobile } from '@xpress-core/hooks';
import { X } from '@xpress-core/icons';
import {
  DrawerContext,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  VisuallyHidden,
  XpressButton,
  XpressHelpTooltip,
  XpressLoading,
} from '@xpress-core/shadcn-ui';
import { ELEMENT_ID_MAIN_CONTENT } from '@xpress-core/shared/constants';
import { cn } from '@xpress-core/shared/utils';

import { forwardRef, useEffect, useId, useMemo, useRef } from 'react';

export const Drawer = forwardRef<HTMLDivElement, Props>(
  (
    {
      appendFooter,
      appendToMain = true,
      cancelText,
      className,
      closable = true,
      closeIcon,
      closeIconPlacement = 'right',
      closeOnClickModal = true,
      closeOnPressEscape = true,
      confirmLoading,
      confirmText,
      contentClass,
      customTitle,
      description,
      extra,
      footer,
      footerClass,
      headerClass,
      isOpen,
      modal = true,
      onDrawerBeforeClose,
      onDrawerCancel,
      onDrawerClosed,
      onDrawerConfirm,
      onDrawerOpened,
      overlayBlur = 1,
      placement = 'right',
      prependFooter,
      setIsOpen,
      showCancelButton = true,
      showConfirmButton = true,
      showFooter = true,
      showHeader = true,
      showLoading,
      title,
      titleTooltip,
      zIndex = 2000,
      children,
    },
    ref,
  ) => {
    const { isMobile } = useIsMobile();
    // const { lock, unlock } = useScrollLock(document.body);
    const id = useId();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const onOpenChange = (open: boolean) => {
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
      if (!closeOnClickModal && target?.dataset.dismissableDrawer !== id) {
        e.preventDefault();
      }
    };
    const getAppendTo = useMemo(() => {
      return appendToMain ? `#${ELEMENT_ID_MAIN_CONTENT}` : undefined;
    }, [appendToMain]);
    const DefaultFooter = () => {
      return (
        <>
          {showCancelButton && (
            <XpressButton onClick={onDrawerCancel} variant="ghost">
              {cancelText || '取消'}
            </XpressButton>
          )}
          {showConfirmButton && (
            <XpressButton loading={confirmLoading} onClick={onDrawerConfirm}>
              {confirmText || '确定'}
            </XpressButton>
          )}
        </>
      );
    };
    useEffect(() => {
      if (showLoading && wrapperRef.current) {
        wrapperRef.current.scrollTo({
          top: 0,
        });
      }
    }, [showLoading]);
    // useEffect(() => {
    //   if (isOpen) {
    //     lock();
    //   } else {
    //     unlock();
    //   }
    // }, [isOpen, lock, unlock]);
    return (
      <DrawerContext.Provider value={{ id }}>
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
                    'pl-2': closable && closeIconPlacement === 'left',
                    'px-4 py-3': closable,
                  },
                )}
              >
                <div className="flex items-center">
                  {closable && closeIconPlacement === 'left' && (
                    <>
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
                      <Separator
                        className="ml-1 mr-2 h-8"
                        decorative
                        orientation="vertical"
                      ></Separator>
                    </>
                  )}
                  {title && (
                    <SheetTitle className="text-left">
                      {customTitle || (
                        <>
                          {title}
                          {titleTooltip && (
                            <XpressHelpTooltip trigger-class="pb-1">
                              {titleTooltip}
                            </XpressHelpTooltip>
                          )}
                        </>
                      )}
                    </SheetTitle>
                  )}
                  {description && (
                    <SheetDescription className="ml-1 mt-1 text-xs">
                      {description}
                    </SheetDescription>
                  )}
                  {(!title || !description) && (
                    <VisuallyHidden>
                      {!title && <SheetTitle />}
                      {!description && <SheetDescription />}
                    </VisuallyHidden>
                  )}
                </div>
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
              </SheetHeader>
            ) : (
              <VisuallyHidden>
                <SheetTitle />
                <SheetDescription />
              </VisuallyHidden>
            )}
            <div
              className={cn(
                'relative flex-1 overflow-y-auto p-3',
                contentClass,
                {
                  'overflow-hidden': showLoading,
                },
              )}
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
                {footer || <DefaultFooter />}
                {appendFooter}
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
      </DrawerContext.Provider>
    );
  },
);

Drawer.displayName = 'Drawer';
