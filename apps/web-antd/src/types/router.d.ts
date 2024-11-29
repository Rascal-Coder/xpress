import '@xpress-core/router';

declare module '@xpress-core/router' {
  interface RouteMeta {
    icon?: ReactNode;
    title?: string;
    // 其他应用特定的 meta 属性
    layout?: 'blank' | 'default';
    hideMenu?: boolean;
    // ...
  }
}
