import type { Icon } from '@xpress-core/typings';

import { LogOut } from '@xpress-core/icons';
import { Modal as LogoutModal } from '@xpress-core/popup-ui';
import { usePreferencesContext } from '@xpress-core/preferences';
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  XpressAvatar,
  XpressIcon,
} from '@xpress-core/shadcn-ui';
import { isWindowsOs } from '@xpress-core/shared/utils';

import { useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export function UserDropdown({
  text,
  tagText,
  menus,
  onLogout,
}: {
  menus: {
    handler: () => void;
    icon: Icon;
    text: string;
  }[];
  onLogout: () => void;
  tagText: string;
  text: string;
}) {
  const [openPopover, setOpenPopover] = useState(false);
  const altView = useMemo(() => (isWindowsOs() ? 'Alt' : '⌥'), []);
  const { globalLogoutShortcutKey } = usePreferencesContext();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const handleLogout = () => {
    setOpenPopover(false);
    setIsLogoutOpen(true);
  };
  const handleSubmitLogout = () => {
    setIsLogoutOpen(false);
    onLogout();
  };
  // 添加快捷键监听
  useHotkeys('alt+q', (e) => {
    e.preventDefault();
    if (globalLogoutShortcutKey) {
      handleLogout();
    }
  });
  return (
    <>
      <LogoutModal
        cancelText="取消"
        centered
        closeClass="top-1"
        confirmText="确认"
        contentClass="px-8 min-h-10"
        footerClass="border-none mb-3 mr-3"
        headerClass="border-none pt-3"
        isOpen={isLogoutOpen}
        modal={true}
        onModalCancel={() => setIsLogoutOpen(false)}
        onModalConfirm={handleSubmitLogout}
        setIsOpen={setIsLogoutOpen}
        title="提示"
      >
        是否退出登录？
      </LogoutModal>
      <DropdownMenu onOpenChange={setOpenPopover} open={openPopover}>
        <DropdownMenuTrigger>
          <div className="hover:bg-accent ml-1 mr-2 cursor-pointer rounded-full p-1.5">
            <div className="hover:text-accent-foreground flex-center">
              <XpressAvatar
                className="size-8"
                dot
                src="https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp"
              />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2 min-w-[240px] p-0 pb-1">
          <DropdownMenuLabel className="flex items-center p-3">
            <XpressAvatar
              className="size-12"
              dot
              dotClass="bottom-0 right-1 border-2 size-4 bg-green-500"
              src="https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp"
            />
            <div className="ml-2 w-full">
              <div className="text-foreground mb-1 flex items-center text-sm font-medium">
                {text}
                {tagText && (
                  <Badge className="ml-2 text-green-400">{tagText}</Badge>
                )}
              </div>
              <div className="text-muted-foreground text-xs font-normal">
                ann.vben@gmail.com
              </div>
            </div>
          </DropdownMenuLabel>
          {menus.length > 0 && <DropdownMenuSeparator />}
          {menus.map((menu) => (
            <DropdownMenuItem
              className="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
              key={menu.text}
              onClick={menu.handler}
            >
              <XpressIcon className="mr-2 size-4" icon={menu.icon} />
              {menu.text}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 size-4"></LogOut>
            退出登录
            <DropdownMenuShortcut>{altView} Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
