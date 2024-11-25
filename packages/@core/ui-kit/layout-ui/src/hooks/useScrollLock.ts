import { useCallback, useEffect, useRef, useState } from 'react';

const isClient =
  typeof window !== 'undefined' && typeof document !== 'undefined';

const isIOS = getIsIOS();

function getIsIOS() {
  return (
    isClient &&
    window?.navigator?.userAgent &&
    (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) ||
      // The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
      // https://github.com/vueuse/vueuse/issues/3577
      (window?.navigator?.maxTouchPoints > 2 &&
        /iPad|Macintosh/.test(window?.navigator.userAgent)))
  );
}
function checkOverflowScroll(ele: Element): boolean {
  const style = window.getComputedStyle(ele);
  if (
    style.overflowX === 'scroll' ||
    style.overflowY === 'scroll' ||
    (style.overflowX === 'auto' && ele.clientWidth < ele.scrollWidth) ||
    (style.overflowY === 'auto' && ele.clientHeight < ele.scrollHeight)
  ) {
    return true;
  } else {
    const parent = ele.parentNode as Element;
    if (!parent || parent.tagName === 'BODY') {
      return false;
    }
    return checkOverflowScroll(parent);
  }
}

function preventDefault(e: TouchEvent): boolean {
  const target = e.target as Element;

  // 如果元素或父节点设置了overflow: scroll则不阻止
  if (checkOverflowScroll(target)) {
    return false;
  }

  // 如果是多点触控手势(如缩放)则不阻止
  if (e.touches.length > 1) {
    return true;
  }

  if (e.preventDefault) {
    e.preventDefault();
  }

  return false;
}

export function useScrollLock(
  element: HTMLElement | null = null,
  initialState = false,
) {
  const [isLocked, setIsLocked] = useState(initialState);
  const initialOverflowRef = useRef<string>('');
  const touchMoveListenerRef = useRef<(() => void) | null>(null);

  // 锁定滚动
  const lock = useCallback(() => {
    if (!element || isLocked) return;

    initialOverflowRef.current = element.style.overflow;
    element.style.overflow = 'hidden';

    if (isIOS) {
      const handleTouchMove = (e: TouchEvent) => preventDefault(e);
      element.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      touchMoveListenerRef.current = () => {
        element.removeEventListener('touchmove', handleTouchMove);
      };
    }

    setIsLocked(true);
  }, [element, isLocked]);

  // 解锁滚动
  const unlock = useCallback(() => {
    if (!element || !isLocked) return;

    if (isIOS && touchMoveListenerRef.current) {
      touchMoveListenerRef.current();
      touchMoveListenerRef.current = null;
    }

    element.style.overflow = initialOverflowRef.current;
    setIsLocked(false);
  }, [element, isLocked]);

  // 监听element变化
  useEffect(() => {
    if (!element) return;

    if (element.style.overflow !== 'hidden') {
      initialOverflowRef.current = element.style.overflow;
    }

    if (element.style.overflow === 'hidden') {
      setIsLocked(true);
      return;
    }

    if (isLocked) {
      element.style.overflow = 'hidden';
    }
  }, [element, isLocked]);

  // 组件卸载时解锁
  useEffect(() => {
    return () => {
      unlock();
    };
  }, [unlock]);

  return {
    isLocked,
    lock,
    unlock,
  };
}
