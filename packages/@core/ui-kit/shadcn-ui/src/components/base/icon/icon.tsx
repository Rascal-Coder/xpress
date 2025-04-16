import type { Icon } from '@xpress-core/typings';

import { IconDefault, IconifyIcon } from '@xpress-core/icons';
import {
  isFunction,
  isHttpUrl,
  isObject,
  isString,
} from '@xpress-core/shared/utils';

import React from 'react';

type BaseIconProps = {
  className?: string;
  fallback?: boolean;
};

export interface IconProps extends BaseIconProps {
  icon?: Icon;
}

const XpressIcon: React.FC<IconProps> = ({ fallback, icon, ...rest }) => {
  const isRemoteIcon = isString(icon) && isHttpUrl(icon);
  const isComponent = !isString(icon) && (isObject(icon) || isFunction(icon));

  if (isComponent && icon) {
    const IconComponent = icon as React.ComponentType<
      React.SVGProps<SVGSVGElement>
    >;

    return <IconComponent {...(rest as React.SVGProps<SVGSVGElement>)} />;
  }

  if (isRemoteIcon) {
    return (
      <img
        src={icon}
        {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  }

  if (icon) {
    return <IconifyIcon {...rest} icon={icon} />;
  }

  if (fallback) {
    return <IconDefault {...rest} />;
  }

  return null;
};

export default XpressIcon;
