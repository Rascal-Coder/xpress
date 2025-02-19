import { CircleHelp } from '@xpress/icons';
import { Switch, XpressTooltip } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { type ReactNode } from 'react';

interface Props {
  disabled?: boolean;
  tip?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  children?: ReactNode;
  shortcut?: ReactNode;
  customTip?: ReactNode;
  className?: string;
}

export const SwitchItem = ({
  disabled = false,
  tip = '',
  checked,
  onChange,
  children,
  shortcut,
  customTip,
  className,
}: Props) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div
      className={cn(
        className,
        `hover:bg-accent my-1 flex w-full items-center justify-between rounded-md px-2 py-2.5 ${
          disabled ? 'pointer-events-none opacity-50' : ''
        } `,
      )}
      onClick={handleClick}
    >
      <span className="flex items-center text-sm">
        {children}

        {(customTip || tip) && (
          <XpressTooltip
            side="bottom"
            trigger={
              <div className="ml-1">
                <CircleHelp className="size-3 cursor-help" />
              </div>
            }
          >
            {customTip ||
              tip.split('\n').map((line, index) => <p key={index}>{line}</p>)}
          </XpressTooltip>
        )}
      </span>
      {shortcut && (
        <span className="ml-auto mr-2 text-xs opacity-60">{shortcut}</span>
      )}
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      />
    </div>
  );
};
