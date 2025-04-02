import { useCallback, useEffect } from 'react';

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
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!targetRef.current) return;
      // 阻止事件冒泡
      e.stopPropagation();

      // 记录初始鼠标位置
      const startX = e.clientX;
      const startY = e.clientY;

      // 获取当前transform值
      const computedStyle = window.getComputedStyle(targetRef.current);
      const transform = computedStyle.transform || '';

      // 提取当前translate值
      let translateX = 0;
      let translateY = 0;

      if (transform !== 'none' && transform !== '') {
        // 提取transform矩阵值
        const matrix = transform.match(/matrix\(([^)]+)\)/);
        if (matrix && matrix[1]) {
          const values = matrix[1].split(', ');
          if (values.length >= 6) {
            translateX = Number.parseFloat(values[4] ?? '0') || 0;
            translateY = Number.parseFloat(values[5] ?? '0') || 0;
          }
        }
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!targetRef.current) return;

        // 计算移动距离
        const moveX = e.clientX - startX;
        const moveY = e.clientY - startY;

        // 新位置 = 当前translate值 + 移动距离
        const newX = translateX + moveX;
        const newY = translateY + moveY;

        // 应用变换
        targetRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        targetRef.current.style.transition = 'none';
      };

      const handleMouseUp = () => {
        if (targetRef.current) {
          targetRef.current.style.transition = 'transform 0.2s ease-out';
        }

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [targetRef],
  );

  // 重置位置
  const resetPosition = useCallback(() => {
    if (targetRef.current) {
      targetRef.current.style.transform = '';
    }
  }, [targetRef]);

  // 添加拖拽事件
  const addDraggableEvents = useCallback(() => {
    if (dragRef.current && targetRef.current) {
      dragRef.current.addEventListener('mousedown', handleMouseDown);
    }
  }, [dragRef, targetRef, handleMouseDown]);

  // 移除拖拽事件
  const removeDraggableEvents = useCallback(() => {
    if (dragRef.current && targetRef.current) {
      dragRef.current.removeEventListener('mousedown', handleMouseDown);
    }
  }, [dragRef, targetRef, handleMouseDown]);

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
    resetPosition,
  };
}
