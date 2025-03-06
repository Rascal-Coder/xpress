import type { BreadcrumbStyleType, Icon } from '@xpress-core/typings';

interface IBreadcrumb {
  defaultPath?: string;
  icon?: Icon;
  isHome?: boolean;
  items?: IBreadcrumb[];
  path?: string;
  title?: string;
}

interface BreadcrumbProps {
  breadcrumbs: IBreadcrumb[];
  className?: string;
  onSelect?: (path?: string, defaultPath?: string) => void;
  showIcon?: boolean;
  styleType?: BreadcrumbStyleType;
}

export type { BreadcrumbProps, IBreadcrumb };
