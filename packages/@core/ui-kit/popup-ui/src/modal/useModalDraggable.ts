import { useEffect, useRef, useState } from 'react';

interface Transform {
  offsetX: number;
  offsetY: number;
}

export const useModalDraggable = (
  targetRef: React.RefObject<HTMLElement>,
  dragRef: React.RefObject<HTMLElement>,
  draggable: boolean,
  overflow?: boolean,
) => {
  const transformRef = useRef<Transform>({
    offsetX: 0,
    offsetY: 0,
  });
  const [dragging, setDragging] = useState(false);
  const onMousedown = (e: MouseEvent) => {
    const downX = e.clientX;
    const downY = e.clientY;
    const { offsetX, offsetY } = transformRef.current;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const targetRect = targetRef.current!.getBoundingClientRect();
    const targetLeft = targetRect.left;
    const targetTop = targetRect.top;
    const targetWidth = targetRect.width;
    const targetHeight = targetRect.height;

    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    const minLeft = -targetLeft + offsetX;
    const minTop = -targetTop + offsetY;
    const maxLeft = clientWidth - targetLeft - targetWidth + offsetX;
    const maxTop = clientHeight - targetTop - targetHeight + offsetY;

    const onMousemove = (e: MouseEvent) => {
      let moveX = offsetX + e.clientX - downX;
      let moveY = offsetY + e.clientY - downY;

      if (!overflow) {
        moveX = Math.min(Math.max(moveX, minLeft), maxLeft);
        moveY = Math.min(Math.max(moveY, minTop), maxTop);
        setDragging(true);
      }

      transformRef.current = {
        offsetX: moveX,
        offsetY: moveY,
      };

      if (targetRef.current) {
        targetRef.current.style.transform = `translate(${addUnit(moveX)}, ${addUnit(moveY)})`;
      }
    };

    const onMouseup = () => {
      setDragging(false);
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    };

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup);
  };

  const onDraggable = () => {
    if (dragRef.current && targetRef.current) {
      dragRef.current.addEventListener('mousedown', onMousedown);
    }
  };

  const offDraggable = () => {
    if (dragRef.current && targetRef.current) {
      dragRef.current.removeEventListener('mousedown', onMousedown);
    }
  };

  const resetPosition = () => {
    transformRef.current = {
      offsetX: 0,
      offsetY: 0,
    };
    if (targetRef.current) {
      targetRef.current.style.transform = 'none';
    }
  };

  useEffect(() => {
    if (draggable) {
      onDraggable();
    } else {
      offDraggable();
    }

    return () => {
      offDraggable();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggable]);

  return {
    dragging,
    resetPosition,
  };
};

function addUnit(value?: number | string, defaultUnit = 'px'): string {
  if (!value) return '';
  if (typeof value === 'number' || /^\d+$/.test(String(value))) {
    return `${value}${defaultUnit}`;
  } else if (typeof value === 'string') {
    return value;
  }
  console.warn('binding value must be a string or number');
  return '';
}
