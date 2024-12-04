import type { CSSProperties } from 'react';

import { cn } from '@xpress-core/shared/utils';

interface MenuBadgeDotProps {
  dotClass?: string;
  dotStyle?: CSSProperties;
}
function MenuBadgeDot({ dotClass, dotStyle }: MenuBadgeDotProps) {
  return (
    <span className="relative mr-1 flex size-1.5">
      <span
        className={cn(
          'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
          dotClass,
        )}
        style={dotStyle}
      ></span>
      <span
        className={cn('relative inline-flex size-1.5 rounded-full', dotClass)}
        style={dotStyle}
      ></span>
    </span>
  );
}

export default MenuBadgeDot;
