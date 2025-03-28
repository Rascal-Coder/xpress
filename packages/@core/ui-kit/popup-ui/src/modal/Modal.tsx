import type { KeyboardEvent, MouseEvent } from 'react';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import ReactDOM from 'react-dom';

// Modal属性接口定义
interface ModalProps {
  bordered?: boolean;
  centered?: boolean;
  children?: React.ReactNode;
  className?: string;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  confirmLoading?: boolean;
  contentClassName?: string;
  draggable?: boolean;
  footer?: boolean | React.ReactNode;
  footerClassName?: string;
  fullscreen?: boolean;
  headerClassName?: string;
  isOpen?: boolean;
  onCancel?: () => void;
  onClose: () => void;
  onConfirm?: () => void;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  title?: React.ReactNode;
  width?: string;
  zIndex?: number;
}

// 基础Modal组件
const Modal = forwardRef<{ close: () => void }, ModalProps>(
  (
    {
      bordered = false,
      centered = false,
      className = '',
      closeOnClickModal = true,
      closeOnPressEscape = true,
      confirmLoading = false,
      contentClassName = '',
      draggable = false,
      footer,
      footerClassName = '',
      fullscreen = false,
      headerClassName = '',
      isOpen,
      onCancel,
      onClose,
      onConfirm,
      showCancelButton = true,
      showConfirmButton = true,
      title,
      width = '520px',
      zIndex,
      children,
    },
    ref,
  ) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [modalRef, setModalRef] = useState<HTMLDivElement | null>(null);
    const [headerRef, setHeaderRef] = useState<HTMLDivElement | null>(null);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      close: onClose,
    }));

    // 处理ESC键关闭
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnPressEscape && isOpen) {
          onClose();
        }
      };

      document.addEventListener(
        'keydown',
        handleKeyDown as unknown as EventListener,
      );
      return () => {
        document.removeEventListener(
          'keydown',
          handleKeyDown as unknown as EventListener,
        );
      };
    }, [closeOnPressEscape, isOpen, onClose]);

    // 拖拽功能
    useEffect(() => {
      if (!draggable || !headerRef || !modalRef || fullscreen) return;

      let initialX = 0;
      let initialY = 0;
      let startX = 0;
      let startY = 0;

      const onMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          setPosition({
            x: initialX + dx,
            y: initialY + dy,
          });
        }
      };

      const onMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener(
          'mousemove',
          onMouseMove as unknown as EventListener,
        );
        document.removeEventListener(
          'mouseup',
          onMouseUp as unknown as EventListener,
        );
      };

      const onMouseDown = (e: MouseEvent) => {
        startX = e.clientX;
        startY = e.clientY;
        initialX = position.x;
        initialY = position.y;
        setIsDragging(true);

        document.addEventListener(
          'mousemove',
          onMouseMove as unknown as EventListener,
        );
        document.addEventListener(
          'mouseup',
          onMouseUp as unknown as EventListener,
        );
      };

      headerRef.addEventListener(
        'mousedown',
        onMouseDown as unknown as EventListener,
      );

      return () => {
        headerRef.removeEventListener(
          'mousedown',
          onMouseDown as unknown as EventListener,
        );
        document.removeEventListener(
          'mousemove',
          onMouseMove as unknown as EventListener,
        );
        document.removeEventListener(
          'mouseup',
          onMouseUp as unknown as EventListener,
        );
      };
    }, [draggable, headerRef, modalRef, isDragging, position, fullscreen]);

    // 点击遮罩关闭
    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && closeOnClickModal) {
        onClose();
      }
    };

    // 如果modal未打开则不渲染
    if (!isOpen) return null;

    // 计算modal样式
    const getTransformValue = () => {
      if (fullscreen) return 'none';
      if (draggable && !fullscreen)
        return `translate(${position.x}px, ${position.y}px)`;
      if (centered && !fullscreen) return 'translateY(-50%)';
      return 'none';
    };

    const modalStyle: React.CSSProperties = {
      height: fullscreen ? '100%' : 'auto',
      margin: centered && !fullscreen ? '0 auto' : '',
      maxHeight: fullscreen ? '100%' : '80%',
      maxWidth: fullscreen ? '100%' : '90%',
      position: 'relative',
      top: getTopPosition(),
      transform: getTransformValue(),
      transition: isDragging ? 'none' : 'all 0.3s',
      width: fullscreen ? '100%' : width,
      zIndex: zIndex || 1000,
    };

    function getTopPosition() {
      if (fullscreen) return '0';
      if (centered && !fullscreen) return '50%';
      return '10vh';
    }

    return ReactDOM.createPortal(
      <div
        className={`modal-overlay ${isOpen ? 'open' : ''}`}
        onClick={handleOverlayClick}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          left: 0,
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: (zIndex || 1000) - 1,
        }}
      >
        <div
          className={`modal-container ${className}`}
          ref={setModalRef}
          style={modalStyle}
        >
          {title && (
            <div
              className={`modal-header ${headerClassName} ${draggable && !fullscreen ? 'draggable' : ''}`}
              ref={setHeaderRef}
              style={{
                borderBottom: bordered ? '1px solid #e8e8e8' : 'none',
                cursor: draggable && !fullscreen ? 'move' : 'default',
                padding: '16px',
                userSelect: draggable && !fullscreen ? 'none' : 'auto',
              }}
            >
              <h3 className="modal-title">{title}</h3>
              <button
                className="modal-close"
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'absolute',
                  right: '16px',
                  top: '16px',
                }}
              >
                &times;
              </button>
            </div>
          )}

          <div
            className={`modal-content ${contentClassName}`}
            style={{
              flex: '1 1 auto',
              overflowY: 'auto',
              padding: '16px',
            }}
          >
            {children}
          </div>

          {footer !== false && (
            <div
              className={`modal-footer ${footerClassName}`}
              style={{
                borderTop: bordered ? '1px solid #e8e8e8' : 'none',
                padding: '10px 16px',
                textAlign: 'right',
              }}
            >
              {showCancelButton && (
                <button
                  className="modal-cancel-btn"
                  onClick={onCancel || onClose}
                  style={{
                    background: '#fff',
                    border: '1px solid #d9d9d9',
                    marginRight: '8px',
                    padding: '5px 15px',
                  }}
                >
                  取消
                </button>
              )}
              {showConfirmButton && (
                <button
                  className="modal-confirm-btn"
                  disabled={confirmLoading}
                  onClick={onConfirm}
                  style={{
                    background: '#1890ff',
                    border: 'none',
                    color: 'white',
                    padding: '5px 15px',
                  }}
                >
                  {confirmLoading ? '加载中...' : '确定'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>,
      document.body,
    );
  },
);
Modal.displayName = 'Modal';
export default Modal;
