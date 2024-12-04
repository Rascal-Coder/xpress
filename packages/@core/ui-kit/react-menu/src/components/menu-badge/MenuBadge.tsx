import type { MenuRecordBadgeRaw } from '@xpress-core/typings';

import { isValidColor } from '@xpress-core/shared/color';
import { cn } from '@xpress-core/shared/utils';

import { useMemo } from 'react';

import BadgeDot from './MenuBadgeDot';

interface MenuBadgeProps extends MenuRecordBadgeRaw {
  className?: string;
  hasChildren?: boolean;
}

function MenuBadge({
  badge,
  badgeType,
  badgeVariants,
  className,
}: MenuBadgeProps) {
  const variantsMap = useMemo(() => {
    return {
      default: 'bg-green-500',
      destructive: 'bg-destructive',
      primary: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
    };
  }, []);

  const isDot = useMemo(() => {
    return badgeType === 'dot';
  }, [badgeType]);

  const badgeClass = useMemo(() => {
    if (!badgeVariants) {
      return variantsMap.default;
    }
    return Object.keys(variantsMap).includes(badgeVariants)
      ? variantsMap[badgeVariants as keyof typeof variantsMap]
      : badgeVariants;
  }, [badgeVariants, variantsMap]);

  const badgeStyle = useMemo(() => {
    return badgeClass && isValidColor(badgeClass)
      ? { backgroundColor: badgeClass }
      : {};
  }, [badgeClass]);

  if (!isDot && !badge) return null;

  return (
    <span className={cn('absolute', className)}>
      {isDot ? (
        <BadgeDot dotClass={badgeClass} dotStyle={badgeStyle} />
      ) : (
        <div
          className={cn(
            'text-primary-foreground flex-center rounded-xl px-1.5 py-0.5 text-[10px]',
            badgeClass,
          )}
          style={badgeStyle}
        >
          {badge}
        </div>
      )}
    </span>
  );
}

export default MenuBadge;
