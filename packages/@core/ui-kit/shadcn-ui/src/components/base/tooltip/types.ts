import type { Side } from '@xpress-core/typings';

export interface XpressTooltipProps {
  children: React.ReactNode;
  contentClass?: string;
  contentStyle?: React.CSSProperties;
  delayDuration?: number;
  side?: Side;
  trigger: React.ReactNode;
}
