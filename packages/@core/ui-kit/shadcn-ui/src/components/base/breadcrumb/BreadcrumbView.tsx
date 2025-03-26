import type { BreadcrumbProps } from './type';

import { XpressBreadcrumb } from './Breadcrumb';
import { XpressBreadcrumbBackground } from './BreadcrumbBackground';

export function XpressBreadcrumbView({ styleType, ...props }: BreadcrumbProps) {
  return (
    <div className="flex-center hidden lg:block [&_ol]:mb-0 [&_ul]:mb-0">
      {styleType === 'normal' && <XpressBreadcrumb {...props} />}
      {styleType === 'background' && <XpressBreadcrumbBackground {...props} />}
    </div>
  );
}
