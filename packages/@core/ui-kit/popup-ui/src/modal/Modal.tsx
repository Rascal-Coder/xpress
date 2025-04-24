// import { useIsMobile } from '@xpress-core/hooks';
import { Expand, Shrink } from '@xpress-core/icons';
import {
  Dialog,
  DialogContent,
  DialogContext,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  VisuallyHidden,
  XpressButton,
  XpressHelpTooltip,
  XpressIconButton,
  XpressLoading,
} from '@xpress-core/shadcn-ui';
import { ELEMENT_ID_MAIN_CONTENT } from '@xpress-core/shared/constants';
import { cn } from '@xpress-core/shared/utils';

import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { useModalDraggable } from './useModalDraggable';

interface ModalProps {
  appendFooter?: React.ReactNode;
  appendToMain?: boolean;
  bordered?: boolean;
  cancelText?: string;
  centered?: boolean;
  children?: React.ReactNode;
  closeClass?: string;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  confirmLoading?: boolean;
  confirmText?: string;
  contentClass?: string;
  customFooter?: React.ReactNode;
  customTitle?: React.ReactNode;
  description?: string;
  draggable?: boolean;
  footerClass?: string;
  headerClass?: string;
  isOpen: boolean;
  modal?: boolean;
  modalClass?: string;
  onModalBeforeClose?: () => void;
  onModalCancel?: () => void;
  onModalClosed?: () => void;
  onModalConfirm?: () => void;
  onModalOpened?: () => void;
  openAutoFocus?: boolean;
  overlayBlur?: number;
  prependFooter?: React.ReactNode;
  setIsOpen: (open: boolean) => void;
  showCancelButton?: boolean;
  showClose?: boolean;
  showConfirmButton?: boolean;
  showFullScreenButton?: boolean;
  showHeader?: boolean;
  showLoading?: boolean;
  title?: string;
  titleTooltip?: string;
  zIndex?: number;
}
export const Modal = ({
  appendToMain = false,
  bordered = true,
  cancelText,
  centered,
  closeOnPressEscape = true,
  confirmLoading,
  confirmText,
  customFooter = false,
  draggable,
  isOpen,
  modal,
  modalClass,
  onModalBeforeClose,
  onModalCancel,
  onModalClosed,
  onModalConfirm,
  onModalOpened,
  overlayBlur,
  setIsOpen,
  showCancelButton = true,
  showConfirmButton = true,
  showHeader = true,
  zIndex,
  children,
  ...props
}: ModalProps) => {
  const id = useId();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleClose = () => {
    const allowClose = onModalBeforeClose ? onModalBeforeClose() : true;
    if (allowClose) {
      setIsOpen(false);
    }
  };
  const getAppendTo = useMemo(() => {
    return appendToMain ? `#${ELEMENT_ID_MAIN_CONTENT}` : undefined;
  }, [appendToMain]);
  // const { isMobile } = useIsMobile();

  const shouldFullscreen = useMemo(() => {
    return isFullscreen && showHeader;
  }, [isFullscreen, showHeader]);

  const shouldDraggable = useMemo(() => {
    return draggable && !shouldFullscreen && showHeader;
  }, [draggable, shouldFullscreen, showHeader]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [modalRendered, setModalRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 等待下一帧，确保 Modal 已经渲染到 DOM
      requestAnimationFrame(() => {
        if (dialogRef.current) {
          setModalRendered(true);
        }
      });
    } else {
      setModalRendered(false);
    }
  }, [isOpen]);
  useModalDraggable(
    modalRendered ? dialogRef : { current: null },
    modalRendered ? headerRef : { current: null },
    shouldDraggable ?? false,
  );

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const handerOpenAutoFocus = (e: Event) => {
    if (!props.openAutoFocus) {
      e.preventDefault();
    }
  };
  const onClosed = () => {
    if (!isOpen) {
      onModalClosed?.();
    }
  };
  const onEscapeKeyDown = (e: KeyboardEvent) => {
    if (closeOnPressEscape) {
      handleClose();
    } else {
      e.preventDefault();
    }
  };
  const onInteractOutside = (e: Event) => {
    if (!props.closeOnClickModal) {
      e.preventDefault();
    }
  };
  const onOpened = () => {
    if (isOpen) {
      onModalOpened?.();
    }
  };

  const onPointerDownOutside = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!props.closeOnClickModal && target?.dataset.dismissableModal !== id) {
      e.preventDefault();
    }
  };
  const wrapperRef = useRef<HTMLDivElement>(null);

  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.showLoading && wrapperRef.current) {
      wrapperRef.current.scrollTo({
        top: 0,
      });
    }
  }, [props.showLoading]);
  const DefaultFooter = () => {
    return (
      <>
        {showCancelButton && (
          <XpressButton onClick={onModalCancel} variant="ghost">
            {cancelText || '取消'}
          </XpressButton>
        )}
        {showConfirmButton && (
          <XpressButton loading={confirmLoading} onClick={onModalConfirm}>
            {confirmText || '确定'}
          </XpressButton>
        )}
      </>
    );
  };
  return (
    <DialogContext.Provider value={{ id }}>
      <Dialog modal={modal} open={isOpen}>
        <DialogContent
          className={cn('sm:rounded-[var(--radius)]', modalClass, {
            'border-border border': bordered,
            'fixed inset-0 h-full !max-w-full translate-x-0 translate-y-0 gap-0 rounded-none':
              shouldFullscreen,
            'shadow-3xl': !bordered,
            'top-1/2 !-translate-y-1/2': centered && !shouldFullscreen,
          })}
          closeClass={props.closeClass}
          container={
            getAppendTo
              ? ((document.querySelector(getAppendTo) || undefined) as
                  | HTMLElement
                  | undefined)
              : undefined
          }
          modal={modal}
          onClose={handleClose}
          onCloseAutoFocus={(e: Event) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClosed={onClosed}
          onEscapeKeyDown={onEscapeKeyDown}
          onFocusOutside={(e: Event) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onInteractOutside={onInteractOutside}
          onOpenAutoFocus={handerOpenAutoFocus}
          onOpened={onOpened}
          onPointerDownOutside={onPointerDownOutside}
          open={isOpen}
          overlayBlur={overlayBlur}
          ref={dialogRef}
          showClose={props.showClose}
          zIndex={zIndex}
        >
          <DialogHeader
            className={cn(
              'px-5 py-2',
              {
                'border-b': bordered,
                'cursor-move select-none': shouldDraggable,
                hidden: !showHeader,
              },
              props.headerClass,
            )}
            data-draggable={shouldDraggable}
            ref={headerRef}
          >
            <DialogTitle className="text-left">
              {props.customTitle || (
                <>
                  {props.title}
                  {props.titleTooltip && (
                    <XpressHelpTooltip trigger-class="pb-1">
                      {props.titleTooltip}
                    </XpressHelpTooltip>
                  )}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {props.description && (
            <DialogDescription className="ml-1 mt-1 text-xs">
              {props.description}
            </DialogDescription>
          )}
          {(!props.title || !props.description) && (
            <VisuallyHidden>
              {!props.title && <DialogTitle />}
              {!props.description && <DialogDescription />}
            </VisuallyHidden>
          )}
          <div
            className={cn(
              'relative min-h-40 flex-1 overflow-y-auto p-3',
              props.contentClass,
              {
                'h-[calc(100vh-8rem)]': shouldFullscreen,
                'overflow-hidden': props.showLoading,
              },
            )}
            ref={wrapperRef}
          >
            {props.showLoading && (
              <XpressLoading className="size-full h-auto min-h-full" spinning />
            )}
            {children}
          </div>
          {props.showFullScreenButton && (
            <XpressIconButton
              className="hover:bg-accent hover:text-accent-foreground text-foreground/80 flex-center absolute right-10 top-3 hidden size-6 rounded-full px-1 text-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none sm:block"
              onClick={handleFullscreen}
            >
              {isFullscreen ? (
                <Shrink className="size-3.5" />
              ) : (
                <Expand className="size-3.5" />
              )}
            </XpressIconButton>
          )}

          <DialogFooter
            className={cn(
              'box-border flex-row items-center justify-end p-2',
              {
                'border-t': bordered,
              },
              props.footerClass,
            )}
            ref={footerRef}
          >
            {props.prependFooter}
            {customFooter || <DefaultFooter />}
            {props.appendFooter}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

Modal.displayName = 'Modal';
