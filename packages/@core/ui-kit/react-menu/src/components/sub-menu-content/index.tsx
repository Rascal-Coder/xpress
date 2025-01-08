import type { MenuItemProps } from '../types';

import { useNamespace } from '@xpress-core/hooks';
import { ChevronDown, ChevronRight } from '@xpress-core/icons';
import { XpressIcon } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { forwardRef, useMemo } from 'react';

import { useMenuContext } from '../hooks';

interface SubMenuContentProps extends MenuItemProps {
  className?: string;
  isMenuMore: boolean;
  isTopLevelMenuSubMenu: boolean;
  level?: number;
}
function SubMenuContent({
  className,
  icon,
  isMenuMore = false,
  level = 0,
  menuItemClick,
  path,
  title,
  children,
}: SubMenuContentProps) {
  const rootMenu = useMenuContext();
  const { b, e, is } = useNamespace('sub-menu-content');
  const nsMenu = useNamespace('menu');
  const opened = useMemo(() => {
    return rootMenu.openedMenus.includes(path);
  }, [path, rootMenu.openedMenus]);

  const collapse = useMemo(() => {
    return rootMenu.props.collapse;
  }, [rootMenu.props.collapse]);

  const isFirstLevel = useMemo(() => {
    return level === 1;
  }, [level]);
  const getCollapseShowTitle = useMemo(() => {
    return rootMenu.props.collapseShowTitle && isFirstLevel && collapse;
  }, [collapse, isFirstLevel, rootMenu.props.collapseShowTitle]);

  const mode = useMemo(() => {
    return rootMenu.props.mode;
  }, [rootMenu.props.mode]);

  const showArrowIcon = useMemo(() => {
    return mode === 'horizontal' || !(isFirstLevel && collapse);
  }, [collapse, isFirstLevel, mode]);

  const hiddenTitle = useMemo(() => {
    return (
      mode === 'vertical' && isFirstLevel && collapse && !getCollapseShowTitle
    );
  }, [collapse, getCollapseShowTitle, isFirstLevel, mode]);
  const IconComponent = forwardRef<
    SVGSVGElement,
    { className?: string; style?: React.CSSProperties }
  >(({ className, style }, ref) => {
    const Icon =
      (mode === 'horizontal' && !isFirstLevel) ||
      (mode === 'vertical' && collapse)
        ? ChevronRight
        : ChevronDown;

    return <Icon className={className} ref={ref} style={style} />;
  });
  IconComponent.displayName = 'IconComponent';
  const iconArrowStyle = useMemo(() => {
    return opened ? { transform: `rotate(180deg)` } : {};
  }, [opened]);
  return (
    <div
      className={cn(
        b(),
        is('collapse-show-title', getCollapseShowTitle),
        is('more', isMenuMore),
        className,
      )}
      onClick={() => menuItemClick?.()}
    >
      {children}
      {!isMenuMore && (
        <XpressIcon
          className={cn(nsMenu.e('icon'))}
          fallback
          icon={icon}
        ></XpressIcon>
      )}
      {!hiddenTitle && <div className={cn(e('title'))}>{title}</div>}
      {!isMenuMore && showArrowIcon && (
        <IconComponent
          className={cn(e('icon-arrow'), 'size-4')}
          style={iconArrowStyle}
        ></IconComponent>
      )}
    </div>
  );
}

export default SubMenuContent;
