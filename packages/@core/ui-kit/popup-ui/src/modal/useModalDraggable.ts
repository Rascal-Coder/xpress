import { useCallback, useEffect, useState } from 'react';

interface Position {
  offsetX: number;
  offsetY: number;
}

/**
 * Modal拖拽Hook
 * @param targetRef Modal容器的ref
 * @param dragRef 拖拽句柄的ref
 * @param draggable 是否可拖拽
 * @returns 拖拽相关的状态和方法
 */
export function useModalDraggable(
  targetRef: React.RefObject<HTMLElement>,
  dragRef: React.RefObject<HTMLElement>,
  draggable: boolean,
) {
  const [position, setPosition] = useState<Position>({
    offsetX: 0,
    offsetY: 0,
  });

  const [dragging, setDragging] = useState(false);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!targetRef.current) return;

      const downX = e.clientX;
      const downY = e.clientY;
      const targetRect = targetRef.current.getBoundingClientRect();

      const { offsetX, offsetY } = position;
      const targetLeft = targetRect.left;
      const targetTop = targetRect.top;
      const targetWidth = targetRect.width;
      const targetHeight = targetRect.height;
      const docElement = document.documentElement;
      const clientWidth = docElement.clientWidth;
      const clientHeight = docElement.clientHeight;

      const minLeft = -targetLeft + offsetX;
      const minTop = -targetTop + offsetY;
      const maxLeft = clientWidth - targetLeft - targetWidth + offsetX;
      const maxTop = clientHeight - targetTop - targetHeight + offsetY;

      const handleMouseMove = (e: MouseEvent) => {
        let moveX = offsetX + e.clientX - downX;
        let moveY = offsetY + e.clientY - downY;

        moveX = Math.min(Math.max(moveX, minLeft), maxLeft);
        moveY = Math.min(Math.max(moveY, minTop), maxTop);

        setPosition({ offsetX: moveX, offsetY: moveY });
        if (targetRef.current) {
          targetRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
          setDragging(true);
        }
      };

      const handleMouseUp = () => {
        setDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [position, targetRef],
  );

  // 添加和移除拖拽事件监听
  const addDraggableEvents = useCallback(() => {
    if (dragRef.current && targetRef.current) {
      dragRef.current.addEventListener('mousedown', handleMouseDown);
    }
  }, [dragRef, targetRef, handleMouseDown]);

  const removeDraggableEvents = useCallback(() => {
    if (dragRef.current && targetRef.current) {
      dragRef.current.removeEventListener('mousedown', handleMouseDown);
    }
  }, [dragRef, targetRef, handleMouseDown]);

  // 重置位置
  const resetPosition = useCallback(() => {
    setPosition({ offsetX: 0, offsetY: 0 });
    if (targetRef.current) {
      targetRef.current.style.transform = 'none';
    }
  }, [targetRef]);

  // 响应draggable属性变化
  useEffect(() => {
    if (draggable) {
      addDraggableEvents();
    } else {
      removeDraggableEvents();
    }

    return () => {
      removeDraggableEvents();
    };
  }, [draggable, addDraggableEvents, removeDraggableEvents]);

  return {
    dragging,
    position,
    resetPosition,
  };
}
