import { usePreferencesContext } from '@xpress-core/preferences';
import { XpressButton } from '@xpress-core/shadcn-ui';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

interface ThemeButtonProps {
  type?: 'icon' | 'normal';
  isDark: boolean;
  handleChange: (isDark: boolean) => void;
}

const ThemeButtonComponent = ({
  type = 'normal',
  isDark,
  handleChange,
}: ThemeButtonProps) => {
  const theme = useMemo(() => {
    return isDark ? 'dark' : 'light';
  }, [isDark]);
  const { preferences } = usePreferencesContext();
  const [isAnimatingToDark, setIsAnimatingToDark] = useState(isDark);

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
    if (!preferences.theme.enableThemeAnimation) {
      handleChange(!isDark);
      return;
    }
    if (!isAppearanceTransition || !event) {
      handleChange(!isDark);
      return;
    }

    const { clientX, clientY } = event;
    const radius = Math.hypot(
      Math.max(clientX, innerWidth - clientX),
      Math.max(clientY, innerHeight - clientY),
    );
    const clipPath = [
      `circle(0% at ${clientX}px ${clientY}px)`,
      `circle(${radius}px at ${clientX}px ${clientY}px)`,
    ];

    // 解决context更新延迟问题
    const nextIsDark = !isDark;
    setIsAnimatingToDark(nextIsDark);

    // @ts-ignore startViewTransition
    const transition = document.startViewTransition(() => {
      handleChange(nextIsDark);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: isAnimatingToDark ? clipPath : clipPath.reverse(),
        },
        {
          duration: 450,
          easing: 'ease-in',
          pseudoElement: isAnimatingToDark
            ? '::view-transition-new(root)'
            : '::view-transition-old(root)',
        },
      );
    });
  }

  return (
    <XpressButton
      aria-label={theme}
      aria-live="polite"
      onClick={toggleTheme}
      size={variant.size}
      style={variant.style}
      variant={variant.variant}
    >
      <motion.svg
        aria-hidden="true"
        height="24"
        initial={false}
        viewBox="0 0 24 24"
        width="24"
      >
        <mask
          fill="hsl(var(--foreground)/80%)"
          id="theme-toggle-moon"
          stroke="none"
        >
          <rect fill="white" height="100%" width="100%" x="0" y="0" />
          <motion.circle
            animate={{ x: isDark ? 0 : -20 }}
            cx="40"
            cy="8"
            fill="black"
            initial={{ x: isDark ? 0 : -20 }}
            r="11"
            transition={{ duration: 0.5, ease: [0, 0, 0.3, 1] }}
          />
        </mask>
        <motion.circle
          animate={{ scale: isDark ? 0.5 : 1 }}
          cx="12"
          cy="12"
          fill="hsl(var(--foreground)/90)"
          id="sun"
          initial={{ scale: isDark ? 0.5 : 1 }}
          mask="url(#theme-toggle-moon)"
          r="11"
          transition={{ duration: 1.6, ease: [0.25, 0, 0.2, 1] }}
        />
        <motion.g
          animate={{
            opacity: isDark ? 1 : 0,
            rotate: isDark ? 90 : 0,
          }}
          initial={{
            opacity: isDark ? 1 : 0,
            rotate: isDark ? 90 : 0,
          }}
          stroke="hsl(var(--foreground)/90)"
          strokeWidth="2"
          transition={{
            opacity: { duration: 0.6, ease: [0.25, 0, 0.3, 1] },
            rotate: { duration: 1.6, ease: [0.5, 1.5, 0.75, 1.25] },
          }}
        >
          <line x1="12" x2="12" y1="1" y2="3" />
          <line x1="12" x2="12" y1="21" y2="23" />
          <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
          <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
          <line x1="1" x2="3" y1="12" y2="12" />
          <line x1="21" x2="23" y1="12" y2="12" />
          <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
          <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
        </motion.g>
      </motion.svg>
    </XpressButton>
  );
};
ThemeButtonComponent.displayName = 'ThemeButton';

export const ThemeButton = ThemeButtonComponent;
