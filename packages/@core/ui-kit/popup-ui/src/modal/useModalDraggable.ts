import { useCallback, useEffect, useRef } from 'react';

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
  // 使用ref存储最新位置
  const positionRef = useRef({ x: 0, y: 0 });
  // 是否已经拖拽过
  const hasDraggedRef = useRef(false);

  // 只有拖拽过后才应用保存的位置
  useEffect(() => {
    if (targetRef.current && draggable && hasDraggedRef.current) {
      targetRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
    }
  }, [targetRef, draggable]);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!targetRef.current) return;

      // 阻止事件冒泡和默认行为
      e.stopPropagation();
      // e.preventDefault();

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

      let hasMoved = false;

      const handleMouseMove = (e: MouseEvent) => {
        if (!targetRef.current) return;

        // 计算移动距离
        const moveX = e.clientX - startX;
        const moveY = e.clientY - startY;

        // 新位置 = 当前translate值 + 移动距离
        const newX = translateX + moveX;
        const newY = translateY + moveY;

        // 标记已经移动过
        if (Math.abs(moveX) > 5 || Math.abs(moveY) > 5) {
          hasMoved = true;
        }

        // 更新位置引用
        positionRef.current = { x: newX, y: newY };

        // 应用变换
        targetRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        targetRef.current.style.transition = 'none';
      };

      const handleMouseUp = () => {
        if (targetRef.current) {
          targetRef.current.style.transition = 'transform 0.2s ease-out';
        }

        // 只有在实际移动后才标记为已拖拽
        if (hasMoved) {
          hasDraggedRef.current = true;
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
    positionRef.current = { x: 0, y: 0 };
    hasDraggedRef.current = false;
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
    getCurrentPosition: () => positionRef.current,
    hasDragged: () => hasDraggedRef.current,
    resetPosition,
  };
}
