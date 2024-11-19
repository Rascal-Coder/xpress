import type { IconProps } from '@iconify/react';
import type { ForwardRefRenderFunction } from 'react';

import { Icon } from '@iconify/react';
import { forwardRef } from 'react';

type IconComponentProps = Omit<IconProps, 'icon'>;
type IconComponentRef = SVGSVGElement;

function createIconifyIcon(icon: string) {
  const IconComponent: ForwardRefRenderFunction<
    IconComponentRef,
    IconComponentProps
  > = (props, ref) => {
    return <Icon {...props} icon={icon} ref={ref} />;
  };

  return forwardRef(IconComponent);
}

export type { IconComponentProps };
export { createIconifyIcon };
