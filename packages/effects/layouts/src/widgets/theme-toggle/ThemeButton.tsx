import { XpressButton } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { forwardRef, useMemo } from 'react';

import './ThemeButton.css';

interface ThemeButtonProps {
  type?: 'icon' | 'normal';
  isDark: boolean;
  handleChange: (isDark: boolean) => void;
}

const ThemeButtonComponent = forwardRef<HTMLButtonElement, ThemeButtonProps>(
  ({ type = 'normal', isDark, handleChange }, _ref) => {
    const theme = useMemo(() => {
      return isDark ? 'dark' : 'light';
    }, [isDark]);

    const variant = useMemo(() => {
      return type === 'normal'
        ? {
            variant: 'heavy' as const,
          }
        : {
            size: 'icon' as const,
            style: { padding: '7px' },
            variant: 'icon' as const,
          };
    }, [type]);

    function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
      const isAppearanceTransition =
        // @ts-expect-error startViewTransition 是实验性 API，尚未在 TypeScript 中定义
        document.startViewTransition &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!isAppearanceTransition || !event) {
        handleChange(!isDark);
        return;
      }

      // @ts-ignore startViewTransition
      const transition = document.startViewTransition(() => {
        handleChange(!isDark);
      });

      transition.ready.then(() => {
        const { clientX, clientY } = event;

        // 计算半径，以鼠标点击的位置为圆心，到四个角的距离中最大的那个作为半径
        const radius = Math.hypot(
          Math.max(clientX, innerWidth - clientX),
          Math.max(clientY, innerHeight - clientY),
        );
        const clipPath = [
          `circle(0% at ${clientX}px ${clientY}px)`,
          `circle(${radius}px at ${clientX}px ${clientY}px)`,
        ];
        const animation = document.documentElement.animate(
          {
            clipPath: isDark ? [...clipPath].reverse() : clipPath,
          },
          {
            duration: 450,
            easing: 'ease-in',
            pseudoElement: isDark
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
          },
        );
        animation.play();
        // animation.finished
        //   .then(() => {
        //     // eslint-disable-next-line no-console
        //     console.log('主题切换动画完成');
        //   })
        //   .catch((error: unknown) => {
        //     console.error('动画执行失败:', error);
        //   });
      });
      // .catch((error: unknown) => {
      //   console.error('主题切换动画失败:', error);
      // });
    }

    return (
      <XpressButton
        aria-label={theme}
        aria-live="polite"
        className={cn(
          'theme-toggle cursor-pointer border-none bg-none',
          `is-${theme}`,
        )}
        onClick={toggleTheme}
        size={variant.size}
        style={variant.style}
        variant={variant.variant}
      >
        <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24">
          <mask
            className="theme-toggle__moon"
            fill="hsl(var(--foreground)/80%)"
            id="theme-toggle-moon"
            stroke="none"
          >
            <rect fill="white" height="100%" width="100%" x="0" y="0" />
            <circle cx="40" cy="8" fill="black" r="11" />
          </mask>
          <circle
            className="theme-toggle__sun"
            cx="12"
            cy="12"
            id="sun"
            mask="url(#theme-toggle-moon)"
            r="11"
          />
          <g className="theme-toggle__sun-beams">
            <line x1="12" x2="12" y1="1" y2="3" />
            <line x1="12" x2="12" y1="21" y2="23" />
            <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
            <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
            <line x1="1" x2="3" y1="12" y2="12" />
            <line x1="21" x2="23" y1="12" y2="12" />
            <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
            <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
          </g>
        </svg>
      </XpressButton>
    );
  },
);

ThemeButtonComponent.displayName = 'ThemeButton';

export const ThemeButton = ThemeButtonComponent;
