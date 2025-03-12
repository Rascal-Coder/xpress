import type { TabsProps } from './types';

import { useDebounceFn } from '@xpress-core/hooks';

import { useCallback, useEffect, useRef, useState } from 'react';

type DomElement = Element | null | undefined;

export function useTabsViewScroll(props: TabsProps) {
  const resizeObserverRef = useRef<null | ResizeObserver>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const tabItemCountRef = useRef(0);
  const scrollbarRef = useRef<any>(null);
  const [scrollViewportEl, setScrollViewportEl] = useState<DomElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollIsAtLeft, setScrollIsAtLeft] = useState(true);
  const [scrollIsAtRight, setScrollIsAtRight] = useState(false);

  const getScrollClientWidth = useCallback(() => {
    const scrollbarEl = scrollbarRef.current?.$el;
    if (!scrollbarEl || !scrollViewportEl) return {};

    const scrollbarWidth = scrollbarEl.clientWidth;
    const scrollViewWidth = scrollViewportEl.clientWidth;
    return {
      scrollbarWidth,
      scrollViewWidth,
    };
  }, [scrollViewportEl]);

  const scrollDirection = useCallback(
    (direction: 'left' | 'right', distance: number = 150) => {
      const { scrollbarWidth, scrollViewWidth } = getScrollClientWidth();

      if (!scrollbarWidth || !scrollViewWidth) return;
      if (scrollbarWidth > scrollViewWidth) return;

      scrollViewportEl?.scrollBy({
        behavior: 'smooth',
        left:
          direction === 'left'
            ? -(scrollbarWidth - distance)
            : +(scrollbarWidth - distance),
      });
    },
    [getScrollClientWidth, scrollViewportEl],
  );

  const scrollToActiveIntoView = useCallback(async () => {
    if (!scrollViewportEl) return;

    const viewportEl = scrollViewportEl;
    const { scrollbarWidth } = getScrollClientWidth();
    const { scrollWidth } = viewportEl;

    if (scrollbarWidth >= scrollWidth) return;

    requestAnimationFrame(() => {
      const activeItem = viewportEl?.querySelector('.is-active');
      activeItem?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    });
  }, [scrollViewportEl, getScrollClientWidth]);

  const calcShowScrollbarButton = useCallback(async () => {
    if (!scrollViewportEl) return;

    const { scrollbarWidth } = getScrollClientWidth();

    setShowScrollButton(scrollViewportEl.scrollWidth > scrollbarWidth);
  }, [scrollViewportEl, getScrollClientWidth]);

  const handleResize = useDebounceFn(
    () => {
      calcShowScrollbarButton();
      scrollToActiveIntoView();
    },
    { wait: 100 },
  );

  const initScrollbar = useCallback(async () => {
    const scrollbarEl = scrollbarRef.current?.$el;
    if (!scrollbarEl) return;

    const viewportEl = scrollbarEl?.querySelector(
      'div[data-radix-scroll-area-viewport]',
    );

    setScrollViewportEl(viewportEl);
    calcShowScrollbarButton();
    scrollToActiveIntoView();

    // 监听大小变化
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = new ResizeObserver(handleResize.run);
    resizeObserverRef.current.observe(viewportEl);

    tabItemCountRef.current = props.tabs?.length || 0;
    mutationObserverRef.current?.disconnect();

    mutationObserverRef.current = new MutationObserver(() => {
      const count = viewportEl.querySelectorAll(
        `div[data-tab-item="true"]`,
      ).length;

      if (count > tabItemCountRef.current) {
        scrollToActiveIntoView();
      }

      if (count !== tabItemCountRef.current) {
        calcShowScrollbarButton();
        tabItemCountRef.current = count;
      }
    });

    mutationObserverRef.current.observe(viewportEl, {
      attributes: false,
      childList: true,
      subtree: true,
    });
  }, [
    calcShowScrollbarButton,
    scrollToActiveIntoView,
    handleResize.run,
    props.tabs?.length,
  ]);

  const handleScrollAt = useDebounceFn(
    ({ left, right }) => {
      setScrollIsAtLeft(left);
      setScrollIsAtRight(right);
    },
    { wait: 100 },
  );

  const handleWheel = useCallback(
    ({ deltaY }: WheelEvent) => {
      scrollViewportEl?.scrollBy({
        left: deltaY * 3,
      });
    },
    [scrollViewportEl],
  );

  // 监听 active 变化
  useEffect(() => {
    scrollToActiveIntoView();
  }, [props.active, scrollToActiveIntoView]);

  // 监听 styleType 变化
  useEffect(() => {
    initScrollbar();
  }, [props.styleType, initScrollbar]);

  // 组件挂载
  useEffect(() => {
    initScrollbar();

    return () => {
      resizeObserverRef.current?.disconnect();
      mutationObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      mutationObserverRef.current = null;
    };
  }, [initScrollbar]);

  return {
    handleScrollAt,
    handleWheel,
    initScrollbar,
    scrollbarRef,
    scrollDirection,
    scrollIsAtLeft,
    scrollIsAtRight,
    showScrollButton,
  };
}
