import type { FC, PropsWithChildren } from 'react';

import { useRef } from 'react';
import { Transition } from 'react-transition-group';

/**
 * 折叠过渡动画组件的属性接口
 * @interface CollapseTransitionProps
 * @extends {PropsWithChildren}
 */
interface CollapseTransitionProps extends PropsWithChildren {
  /**
   * 控制折叠内容是否显示
   * @default false
   */
  in?: boolean;
}

/**
 * 重置元素的样式到初始状态
 * @param {HTMLElement} el - 需要重置样式的 HTML 元素
 */
const reset = (el: HTMLElement) => {
  el.style.maxHeight = '';
  el.style.overflow = el.dataset.oldOverflow || '';
  el.style.paddingTop = el.dataset.oldPaddingTop || '';
  el.style.paddingBottom = el.dataset.oldPaddingBottom || '';
  el.style.marginTop = el.dataset.oldMarginTop || '';
  el.style.marginBottom = el.dataset.oldMarginBottom || '';
};

/**
 * 折叠过渡动画组件
 * 提供平滑的展开/折叠动画效果
 *
 * @component
 * @example
 * ```tsx
 * <CollapseTransition in={isOpen}>
 *   <div>折叠内容</div>
 * </CollapseTransition>
 * ```
 */
const CollapseTransition: FC<CollapseTransitionProps> = (props) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  /**
   * 进入动画开始时的处理函数
   * 保存原始样式并设置初始状态
   */
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

  /**
   * 进入动画进行中的处理函数
   * 设置目标高度和过渡样式
   */
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

  /**
   * 进入动画结束时的处理函数
   * 清除过渡样式
   */
  const onEntered = () => {
    const el = nodeRef.current;
    if (!el) return;

    el.style.maxHeight = '';
    el.style.overflow = el.dataset.oldOverflow || '';
  };

  /**
   * 退出动画开始时的处理函数
   * 保存当前样式状态
   */
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

  /**
   * 退出动画进行中的处理函数
   * 设置折叠动画
   */
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

  /**
   * 退出动画结束时的处理函数
   * 重置所有样式
   */
  const onExited = () => {
    const el = nodeRef.current;
    if (!el) return;
    reset(el);
  };

  /**
   * 进入动画被取消时的处理函数
   */
  const onEnterCancelled = () => {
    const el = nodeRef.current;
    if (!el) return;
    reset(el);
  };

  /**
   * 退出动画被取消时的处理函数
   */
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
