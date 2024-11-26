declare const SIDE_OPTIONS: readonly ['top', 'right', 'bottom', 'left'];
declare const ALIGN_OPTIONS: readonly ['start', 'center', 'end'];
type Side = (typeof SIDE_OPTIONS)[number];
type Align = (typeof ALIGN_OPTIONS)[number];

export type { Align, Side };
