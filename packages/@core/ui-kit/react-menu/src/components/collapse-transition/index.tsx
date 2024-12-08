import type { FC, PropsWithChildren } from 'react';

import { useRef } from 'react';
import { Transition } from 'react-transition-group';

interface CollapseTransitionProps extends PropsWithChildren {
  in?: boolean;
}

const reset = (el: HTMLElement) => {
  el.style.maxHeight = '';
  el.style.overflow = el.dataset.oldOverflow || '';
  el.style.paddingTop = el.dataset.oldPaddingTop || '';
  el.style.paddingBottom = el.dataset.oldPaddingBottom || '';
  el.style.marginTop = el.dataset.oldMarginTop || '';
  el.style.marginBottom = el.dataset.oldMarginBottom || '';
};

const CollapseTransition: FC<CollapseTransitionProps> = (props) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    const el = nodeRef.current;
    if (!el) return;

    // Save original styles
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldMarginTop = el.style.marginTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldMarginBottom = el.style.marginBottom;
    if (el.style.height) el.dataset.elExistsHeight = el.style.height;

    // Initial state for enter
    el.style.maxHeight = '0';
    el.style.paddingTop = '0';
    el.style.marginTop = '0';
    el.style.paddingBottom = '0';
    el.style.marginBottom = '0';
  };

  const onEntering = () => {
    const el = nodeRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.dataset.oldOverflow = el.style.overflow;
      if (el.dataset.elExistsHeight) {
        el.style.maxHeight = el.dataset.elExistsHeight;
      } else if (el.scrollHeight === 0) {
        el.style.maxHeight = '0';
      } else {
        el.style.maxHeight = `${el.scrollHeight}px`;
      }

      el.style.paddingTop = el.dataset.oldPaddingTop || '';
      el.style.paddingBottom = el.dataset.oldPaddingBottom || '';
      el.style.marginTop = el.dataset.oldMarginTop || '';
      el.style.marginBottom = el.dataset.oldMarginBottom || '';
      el.style.overflow = 'hidden';
    });
  };

  const onEntered = () => {
    const el = nodeRef.current;
    if (!el) return;

    el.style.maxHeight = '';
    el.style.overflow = el.dataset.oldOverflow || '';
  };

  const onExit = () => {
    const el = nodeRef.current;
    if (!el) return;

    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldMarginTop = el.style.marginTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldMarginBottom = el.style.marginBottom;
    el.dataset.oldOverflow = el.style.overflow;

    el.style.maxHeight = `${el.scrollHeight}px`;
    el.style.overflow = 'hidden';
  };

  const onExiting = () => {
    const el = nodeRef.current;
    if (!el) return;

    if (el.scrollHeight !== 0) {
      el.style.maxHeight = '0';
      el.style.paddingTop = '0';
      el.style.paddingBottom = '0';
      el.style.marginTop = '0';
      el.style.marginBottom = '0';
    }
  };

  const onExited = () => {
    const el = nodeRef.current;
    if (!el) return;
    reset(el);
  };

  const onEnterCancelled = () => {
    const el = nodeRef.current;
    if (!el) return;
    reset(el);
  };

  const onExitCancelled = () => {
    const el = nodeRef.current;
    if (!el) return;
    reset(el);
  };

  return (
    <Transition
      nodeRef={nodeRef}
      {...props}
      addEndListener={(done) => {
        const node = nodeRef.current;
        if (node) {
          const handleTransitionEnd = () => {
            node.removeEventListener('transitionend', handleTransitionEnd);
            done();
          };
          node.addEventListener('transitionend', handleTransitionEnd, false);
        }
      }}
      onEnter={onEnter}
      onEnterCancelled={onEnterCancelled}
      onEntered={onEntered}
      onEntering={onEntering}
      onExit={onExit}
      onExitCancelled={onExitCancelled}
      onExited={onExited}
      onExiting={onExiting}
    >
      <div ref={nodeRef}>{props.children}</div>
    </Transition>
  );
};

export default CollapseTransition;
