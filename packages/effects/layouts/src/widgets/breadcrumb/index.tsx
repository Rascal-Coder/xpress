import type { IBreadcrumb } from '@xpress-core/shadcn-ui';
import type { BreadcrumbStyleType } from '@xpress-core/typings';

import { type Router, useNavigate, useRouter } from '@xpress/router';
import { XpressBreadcrumbView } from '@xpress-core/shadcn-ui';

import { useMemo } from 'react';

interface BreadcrumbProps {
  hideWhenOnlyOne?: boolean;
  showHome?: boolean;
  showIcon?: boolean;
  type?: BreadcrumbStyleType;
  router: Router;
}

export function Breadcrumb({
  hideWhenOnlyOne = false,
  showHome = false,
  showIcon = false,
  type = 'background',
  router,
}: BreadcrumbProps) {
  const { curRoute } = useRouter(router);
  const navigate = useNavigate();
  const breadcrumbs = useMemo((): IBreadcrumb[] => {
    const resultBreadcrumb: IBreadcrumb[] = [];
    const matched = curRoute?.collecttedRouteInfo;
    if (matched) {
      for (const match of matched) {
        const { meta, path, defaultPath } = match;
        if (!meta || !path) continue;

        const hideChildrenInMenu = meta.hideChildrenInMenu;
        const hideInBreadcrumb = meta.hideInBreadcrumb;
        const { icon, title } = meta;

        if (hideInBreadcrumb || hideChildrenInMenu) {
          continue;
        }

        resultBreadcrumb.push({
          icon,
          path,
          title: title || '',
          defaultPath,
        });
      }

      if (showHome) {
        resultBreadcrumb.unshift({
          icon: 'mdi:home-outline',
          isHome: true,
          path: '/home',
          defaultPath: 'analysis',
        });
      }

      if (hideWhenOnlyOne && resultBreadcrumb.length === 1) {
        return [];
      }
    }
    return resultBreadcrumb;
  }, [curRoute?.collecttedRouteInfo, showHome, hideWhenOnlyOne]);

  const handleSelect = (path?: string, defaultPath?: string) => {
    if (path && !defaultPath) {
      navigate(path);
    } else if (path && defaultPath) {
      navigate(`${path}/${defaultPath}`);
    }
  };
  return (
    <XpressBreadcrumbView
      breadcrumbs={breadcrumbs}
      className="ml-2"
      onSelect={handleSelect}
      showIcon={showIcon}
      styleType={type}
    />
  );
}
