import { animated, useSpring } from '@react-spring/web';

interface LoadingProps {
  title?: string;
  className?: string;
  hidden?: boolean;
}

const Loading = ({ title, className = '', hidden = false }: LoadingProps) => {
  const blocks = Array.from({ length: 4 });

  // 为每个方块创建独立的动画
  const block1Spring = useSpring({
    from: {
      transform: 'translateY(0px) scale(1) rotate(0deg)',
      opacity: 0.7,
    },
    to: async (next) => {
      while (true) {
        await next({
          transform: 'translateY(-30px) scale(0.8) rotate(180deg)',
          opacity: 1,
        });
        await next({
          transform: 'translateY(0px) scale(1) rotate(360deg)',
          opacity: 0.7,
        });
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    },
    config: {
      tension: 300,
      friction: 10,
    },
  });

  const block2Spring = useSpring({
    from: {
      transform: 'translateY(0px) scale(1) rotate(0deg)',
      opacity: 0.7,
    },
    to: async (next) => {
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        await next({
          transform: 'translateY(-30px) scale(0.8) rotate(180deg)',
          opacity: 1,
        });
        await next({
          transform: 'translateY(0px) scale(1) rotate(360deg)',
          opacity: 0.7,
        });
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    },
    config: {
      tension: 300,
      friction: 10,
    },
  });

  const block3Spring = useSpring({
    from: {
      transform: 'translateY(0px) scale(1) rotate(0deg)',
      opacity: 0.7,
    },
    to: async (next) => {
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        await next({
          transform: 'translateY(-30px) scale(0.8) rotate(180deg)',
          opacity: 1,
        });
        await next({
          transform: 'translateY(0px) scale(1) rotate(360deg)',
          opacity: 0.7,
        });
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    },
    config: {
      tension: 300,
      friction: 10,
    },
  });

  const block4Spring = useSpring({
    from: {
      transform: 'translateY(0px) scale(1) rotate(0deg)',
      opacity: 0.7,
    },
    to: async (next) => {
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await next({
          transform: 'translateY(-30px) scale(0.8) rotate(180deg)',
          opacity: 1,
        });
        await next({
          transform: 'translateY(0px) scale(1) rotate(360deg)',
          opacity: 0.7,
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    },
    config: {
      tension: 300,
      friction: 10,
    },
  });

  const blockSprings = [block1Spring, block2Spring, block3Spring, block4Spring];

  const shadowSpring = useSpring({
    from: {
      transform: 'scale(1)',
      opacity: 0.3,
    },
    to: async (next) => {
      while (true) {
        await next({ transform: 'scale(0.6)', opacity: 0.1 });
        await next({ transform: 'scale(1)', opacity: 0.3 });
      }
    },
    config: {
      tension: 300,
      friction: 10,
    },
  });

  const titleSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 200,
  });
  // dark: #0d0d10 ;light: #f4f7f9;
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        hidden
          ? 'pointer-events-none invisible opacity-0'
          : 'visible opacity-100'
      } ${className}`}
    >
      <div className="relative h-16">
        <div className="flex gap-2">
          {blockSprings.map((style, index) => (
            <animated.div
              key={index}
              style={{
                ...style,
                width: '16px',
                height: '16px',
                background: 'hsl(var(--primary))',
                borderRadius: '4px',
              }}
            />
          ))}
        </div>
        {/* 阴影组 */}
        <div className="absolute left-0 top-[60px] flex gap-2">
          {blocks.map((_, index) => (
            <animated.div
              key={index}
              style={{
                ...shadowSpring,
                width: '16px',
                height: '4px',
                borderRadius: '9999px',
                background: 'hsl(var(--primary) / 30%)',
                transformOrigin: 'center',
              }}
            />
          ))}
        </div>
      </div>
      {title && (
        <animated.div
          className="mt-[66px] text-[28px] font-semibold text-black/85 dark:text-white"
          style={titleSpring}
        >
          {title}
        </animated.div>
      )}
    </div>
  );
};

export default Loading;
