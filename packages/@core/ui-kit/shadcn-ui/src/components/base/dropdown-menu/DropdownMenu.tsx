import type { XpressDropdownMenuItem } from './type';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui';

interface XpressDropdownMenuProps {
  children: React.ReactNode;
  menus: XpressDropdownMenuItem[];
}
export function XpressDropdownMenu({
  menus,
  children,
}: XpressDropdownMenuProps) {
  const handleItemClick = (menu: XpressDropdownMenuItem) => {
    if (menu.disabled) {
      return;
    }
    menu?.handler?.(menus);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-full items-center gap-1">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {menus.map((menu) => (
            <DropdownMenuItem
              className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground text-foreground/80 mb-1 cursor-pointer"
              disabled={menu.disabled}
              key={menu.value}
              onClick={() => {
                handleItemClick(menu);
              }}
            >
              {menu.icon && <menu.icon className="mr-2 size-4" />}
              {menu.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
