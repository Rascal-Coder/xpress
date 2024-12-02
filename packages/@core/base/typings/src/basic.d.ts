declare const SIDE_OPTIONS: readonly ['top', 'right', 'bottom', 'left'];
declare const ALIGN_OPTIONS: readonly ['start', 'center', 'end'];
type Side = (typeof SIDE_OPTIONS)[number];
type Align = (typeof ALIGN_OPTIONS)[number];
type Icon =
  | ((props: any) => React.ReactNode)
  | React.ComponentType<any>
  | string;
export type { Align, Icon, Side };
