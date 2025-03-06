import type { BreadcrumbStyleType, Icon } from '@xpress-core/typings';

interface IBreadcrumb {
  icon?: Icon;
  isHome?: boolean;
  items?: IBreadcrumb[];
  path?: string;
  title?: string;
}

interface BreadcrumbProps {
  breadcrumbs: IBreadcrumb[];
  className?: string;
  onSelect?: (path?: string) => void;
  showIcon?: boolean;
  styleType?: BreadcrumbStyleType;
}

export type { BreadcrumbProps, IBreadcrumb };
