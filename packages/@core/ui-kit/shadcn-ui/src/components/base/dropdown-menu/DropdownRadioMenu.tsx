import type { XpressDropdownMenuItem } from './type';

import { cn } from '@xpress-core/shared/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui';

export function XpressDropdownRadioMenu({
  menus,
  onChange,
  value,
  children,
}: {
  children: React.ReactNode;
  menus: XpressDropdownMenuItem[];
  onChange: (value: string) => void;
  value: string;
}) {
  const handleItemClick = (value: string) => {
    onChange(value);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex items-center gap-1">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {menus.map((menu) => (
            <DropdownMenuItem
              className={cn(
                'data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground text-foreground/80 mb-1 cursor-pointer',
                menu.value === value && 'bg-accent text-accent-foreground',
              )}
              key={menu.value}
              onClick={() => handleItemClick(menu.value)}
            >
              {menu.icon ? (
                <menu.icon className="mr-2 size-4" />
              ) : (
                <span
                  className={cn(
                    'mr-2 size-1.5 rounded-full',
                    menu.value === value && 'bg-foreground',
                  )}
                ></span>
              )}
              {menu.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
