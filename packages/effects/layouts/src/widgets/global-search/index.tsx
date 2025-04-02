import { Search } from '@xpress/icons';
import { Modal } from '@xpress-core/popup-ui';
import { XpressIcon } from '@xpress-core/shadcn-ui';
import { isWindowsOs } from '@xpress-core/shared/utils';

import { useLayoutEffect, useRef, useState } from 'react';

import { SearchPanel } from './SearchPanel';

export function GlobalSearch({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);
  return (
    <div
      className={className}
      onClick={() => {
        setIsOpen(true);
      }}
    >
      <div className="md:bg-accent group flex h-8 cursor-pointer items-center gap-3 rounded-2xl border-none bg-none px-2 py-0.5 outline-none">
        <Search className="text-muted-foreground group-hover:text-foreground size-4 group-hover:opacity-100" />
        <span className="text-muted-foreground group-hover:text-foreground hidden text-xs duration-300 md:block">
          搜索
        </span>
        <span className="bg-background border-foreground/60 text-muted-foreground group-hover:text-foreground relative hidden rounded-sm rounded-r-xl px-1.5 py-1 text-xs leading-none group-hover:opacity-100 md:block">
          {isWindowsOs() ? 'Ctrl' : '⌘'}
          <kbd>K</kbd>
        </span>
      </div>
      <Modal
        customFooter={
          <div className="prose prose-stone dark:prose-invert hidden flex-1 items-center gap-4 px-2 py-2 text-sm md:flex">
            <span className="inline-flex items-center gap-1 leading-4">
              <kbd aria-label="Up arrow">
                <XpressIcon icon="lucide:arrow-up" />
              </kbd>
              <kbd aria-label="Down arrow">
                <XpressIcon icon="lucide:arrow-down" />
              </kbd>
            </span>
            <span className="inline-flex items-center gap-1 leading-4">
              <kbd aria-label="Enter">enter</kbd>
              选择
            </span>
            <span className="inline-flex items-center gap-1 leading-4">
              <kbd aria-label="Escape">esc</kbd>
              关闭
            </span>
          </div>
        }
        customTitle={
          <div className="flex items-center">
            <Search className="text-muted-foreground mr-2 size-4" />
            <input
              className="ring-none placeholder:text-muted-foreground w-[80%] rounded-md border border-none bg-transparent p-2 pl-0 text-sm font-normal outline-none ring-0 ring-offset-transparent focus-visible:ring-transparent"
              placeholder="搜索导航菜单"
              ref={searchInputRef}
            />
          </div>
        }
        draggable={true}
        isOpen={isOpen}
        modal={true}
        openAutoFocus={true}
        overlayBlur={2}
        setIsOpen={setIsOpen}
      >
        <SearchPanel />
      </Modal>
    </div>
  );
}
