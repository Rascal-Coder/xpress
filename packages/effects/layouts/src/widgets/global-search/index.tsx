import { Search } from '@xpress/icons';
import { Modal } from '@xpress-core/popup-ui';
import { isWindowsOs } from '@xpress-core/shared/utils';

import { useState } from 'react';

export function GlobalSearch({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
        draggable={true}
        isFullscreen={isFullscreen}
        isOpen={isOpen}
        modal={true}
        onFullscreenChange={(fullscreen) => {
          setIsFullscreen(!fullscreen);
        }}
        overlayBlur={10}
        setIsOpen={setIsOpen}
        showFullScreenButton={true}
        title="全局搜索"
      >
        这是自定义对话框的内容
      </Modal>
    </div>
  );
}
