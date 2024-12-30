import { cn } from '@xpress-core/shared/utils';

import XpressAvatar from '../avatar';

interface Props {
  /**
   * @zh_CN Logo 样式
   */
  className?: string;
  /**
   * @zh_CN 是否收起文本
   */
  collapsed?: boolean;
  /**
   * @zh_CN Logo 跳转地址
   */
  href?: string;
  /**
   * @zh_CN Logo 图片大小
   */
  logoSize?: number;
  /**
   * @zh_CN Logo 图标
   */
  src?: string;
  /**
   * @zh_CN Logo 文本
   */
  text: string;
  /**
   * @zh_CN Logo 主题
   */
  theme?: string;
}

export function XpressLogo({
  className,
  collapsed = false,
  href = 'javascript:void 0',
  src = '',
  text,
  theme = 'light',
}: Props) {
  return (
    <div className={cn('flex h-full items-center text-lg', theme)}>
      <a
        className={cn(
          'flex h-full items-center gap-2 overflow-hidden px-3 text-lg leading-normal transition-all duration-500',
          className,
        )}
        href={href}
      >
        {src && (
          <XpressAvatar
            alt={text}
            className="relative w-8 rounded-none bg-transparent"
            src={src}
          />
        )}
        {!collapsed && (
          <span className="text-foreground truncate text-nowrap font-semibold">
            {text}
          </span>
        )}
      </a>
    </div>
  );
}
