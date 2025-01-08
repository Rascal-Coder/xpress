import type { CSSProperties, PropsWithChildren } from 'react';

import { useEffect, useRef } from 'react';

interface Props extends PropsWithChildren {
  onAfterEnter?: () => void;
  onAfterLeave?: () => void;
  onBeforeEnter?: () => void;
  onBeforeLeave?: () => void;
  onEnter?: () => void;
  onLeave?: () => void;
}

function CollapseTransition({
  onAfterEnter,
  onAfterLeave,
  onBeforeEnter,
  onBeforeLeave,
  onEnter,
  onLeave,
  children,
}: Props) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const { borderBottomWidth, borderTopWidth, paddingBottom, paddingTop } =
      getComputedStyle(element);

    const enterStyles: CSSProperties = {
      borderBottomWidth,
      borderTopWidth,
      height: 'auto',
      overflow: 'hidden',
      paddingBottom,
      paddingTop,
    };

    const leaveStyles: CSSProperties = {
      borderBottomWidth: '0',
      borderTopWidth: '0',
      height: '0',
      overflow: 'hidden',
      paddingBottom: '0',
      paddingTop: '0',
    };

    // 进入动画
    onBeforeEnter?.();
    Object.assign(element.style, enterStyles);
    onEnter?.();
    requestAnimationFrame(() => {
      element.style.transition = 'all 0.3s ease-out';
      onAfterEnter?.();
    });

    // 离开动画
    return () => {
      onBeforeLeave?.();
      Object.assign(element.style, leaveStyles);
      onLeave?.();
      requestAnimationFrame(() => {
        element.style.transition = 'all 0.3s ease-in';
        onAfterLeave?.();
      });
    };
  }, [
    onAfterEnter,
    onAfterLeave,
    onBeforeEnter,
    onBeforeLeave,
    onEnter,
    onLeave,
  ]);

  return (
    <div
      ref={elementRef}
      style={{
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

export default CollapseTransition;
