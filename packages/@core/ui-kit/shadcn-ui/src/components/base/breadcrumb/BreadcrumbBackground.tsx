import type { BreadcrumbProps } from './type';

import { useNamespace } from '@xpress-core/hooks';
import { cn } from '@xpress-core/shared/utils';

import { XpressIcon } from '../icon';

import './style.css';

export function XpressBreadcrumbBackground({
  breadcrumbs,
  className,
  onSelect,
  showIcon = false,
}: BreadcrumbProps) {
  const { b } = useNamespace('breadcrumb');
  const handleClick = (index: number, path?: string) => {
    if (!path || index === breadcrumbs.length - 1) {
      return;
    }
    onSelect?.(path);
  };

  return (
    <ul className={cn('flex', b(), className)}>
      {breadcrumbs.map((item, index) => (
        <li key={`${item.path}-${item.title}-${index}`}>
          <a
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClick(index, item.path);
            }}
          >
            <span className="flex-center z-10 h-full">
              {showIcon && item.icon && (
                <XpressIcon
                  className="mr-1 size-4 flex-shrink-0"
                  icon={item.icon}
                />
              )}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? 'text-foreground font-normal'
                    : ''
                }
              >
                {item.title}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
