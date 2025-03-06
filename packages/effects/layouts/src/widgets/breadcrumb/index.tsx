import type { IBreadcrumb } from '@xpress-core/shadcn-ui';
import type { BreadcrumbStyleType } from '@xpress-core/typings';

import { type Router, useRouter } from '@xpress-core/router';
import { XpressBreadcrumbView } from '@xpress-core/shadcn-ui';

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const { curRoute, routes } = useRouter(router);
  const pathname = curRoute?.path;
  const navigate = useNavigate();
  const breadcrumbs = useMemo((): IBreadcrumb[] => {
    const matched = routes.filter((route) => pathname?.startsWith(route.path));
    const resultBreadcrumb: IBreadcrumb[] = [];

    for (const match of matched) {
      const { meta, path } = match;
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
      });
    }

    if (showHome) {
      resultBreadcrumb.unshift({
        icon: 'mdi:home-outline',
        isHome: true,
        path: '/home/analysis',
      });
    }

    if (hideWhenOnlyOne && resultBreadcrumb.length === 1) {
      return [];
    }
    resultBreadcrumb.push(
      {
        path: '/error-page',
        title: 'error-page',
      },
      {
        path: '/error-page/404',
        title: '404',
      },
    );
    return resultBreadcrumb;
  }, [routes, showHome, hideWhenOnlyOne, pathname]);

  const handleSelect = (path?: string) => {
    if (path) {
      navigate(path);
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
