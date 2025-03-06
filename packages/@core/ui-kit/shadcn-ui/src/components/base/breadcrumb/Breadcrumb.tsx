import type { BreadcrumbProps } from './type';

import { cn } from '@xpress-core/shared/utils';

import { ChevronDown } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui';
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../ui/breadcrumb';
import { XpressIcon } from '../icon';

export function XpressBreadcrumb({
  breadcrumbs,
  className,
  onSelect,
  showIcon,
}: BreadcrumbProps) {
  const handleClick = (path?: string, defaultPath?: string) => {
    if (path) {
      onSelect?.(path, defaultPath);
    }
  };
  return (
    <BreadcrumbComponent className={className}>
      <BreadcrumbList>
        {breadcrumbs.length > 0 &&
          breadcrumbs.map((breadcrumb, index) => (
            <BreadcrumbItem
              key={`${breadcrumb.path}-${breadcrumb.title}-${index}`}
            >
              {(breadcrumb.items?.length ?? 0) > 0 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    {showIcon && (
                      <XpressIcon className="size-5" icon={breadcrumb.icon} />
                    )}
                    {breadcrumb.title}
                    <ChevronDown className="size-4" />
                    <DropdownMenuContent align="start">
                      {breadcrumb.items?.map((menuItem) => (
                        <DropdownMenuItem key={`sub-${menuItem.path}`}>
                          {menuItem.title}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenuTrigger>
                </DropdownMenu>
              ) : (
                <>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>
                      <div className="flex-center">
                        {showIcon && (
                          <XpressIcon
                            className={cn(
                              'mr-1 size-4',
                              breadcrumb.isHome && '!size-5',
                            )}
                            icon={breadcrumb.icon}
                          />
                        )}
                        {breadcrumb.title}
                      </div>
                    </BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleClick(breadcrumb.path, breadcrumb.defaultPath);
                        }}
                      >
                        <div className="flex-center">
                          {showIcon && (
                            <XpressIcon
                              className={cn(
                                'mr-1 size-4',
                                breadcrumb.isHome && '!size-5',
                              )}
                              icon={breadcrumb.icon}
                            />
                          )}
                          {breadcrumb.title}
                        </div>
                      </BreadcrumbLink>
                      {!breadcrumb.isHome && <BreadcrumbSeparator />}
                    </>
                  )}
                </>
              )}
            </BreadcrumbItem>
          ))}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
}
