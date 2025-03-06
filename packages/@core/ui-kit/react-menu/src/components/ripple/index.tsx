import { useCallback, useEffect, useState } from 'react';

import './styles.css';

interface RippleProps {
  color?: string;
  duration?: number;
}

export const Ripple: React.FC<RippleProps> = ({
  color = 'rgba(255, 255, 255, 0.3)',
  duration = 850,
}) => {
  const [rippleArray, setRippleArray] = useState<
    { size: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    const cleanup = () => {
      setRippleArray([]);
    };

    return cleanup;
  }, []);

  const addRipple = useCallback((event: React.MouseEvent) => {
    const rippleContainer = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rippleContainer.width, rippleContainer.height);
    const x = event.clientX - rippleContainer.x - size / 2;
    const y = event.clientY - rippleContainer.y - size / 2;
    const newRipple = {
      size,
      x,
      y,
    };

    setRippleArray((prevState) => [...prevState, newRipple]);
  }, []);

  return (
    <div
      className="ripple-container"
      onMouseDown={addRipple}
      style={{ inset: 0, overflow: 'hidden', position: 'absolute' }}
    >
      {rippleArray.length > 0 &&
        rippleArray.map((ripple, index) => {
          return (
            <span
              key={`ripple_${index}`}
              style={{
                animation: `ripple ${duration}ms linear`,
                backgroundColor: color,
                borderRadius: '50%',
                height: ripple.size,
                opacity: 0,
                position: 'absolute',
                transform: `translate3d(${ripple.x}px, ${ripple.y}px, 0)`,
                width: ripple.size,
              }}
            />
          );
        })}
    </div>
  );
};
