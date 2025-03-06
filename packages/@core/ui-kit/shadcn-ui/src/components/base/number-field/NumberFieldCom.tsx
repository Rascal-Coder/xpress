import { cn } from '@xpress-core/shared/utils';

import { CircleHelp } from 'lucide-react';

import { XpressTooltip } from '../tooltip';
import { NumberFieldItem, type NumberFieldItemProps } from './NumberFieldItem';

interface TooltipContentProps {
  content: string;
}

const DefaultTooltipContent = ({ content }: TooltipContentProps) => (
  <XpressTooltip trigger={<CircleHelp className="ml-1 size-3 cursor-help" />}>
    {content?.split('\n').map((line, index) => <p key={index}>{line}</p>)}
  </XpressTooltip>
);

export interface NumberFieldComProps extends NumberFieldItemProps {
  children?: React.ReactNode;
  className?: string;
  numberFieldClass?: string;
  tip?: string;
  tooltipComponent?: React.ReactElement;
}

export const NumberFieldCom = ({
  className,
  disabled,
  numberFieldClass,
  tip,
  tooltipComponent,
  children,
  ...props
}: NumberFieldComProps) => {
  const renderTooltip = () => {
    if (tooltipComponent) {
      return tooltipComponent;
    }
    if (tip) {
      return <DefaultTooltipContent content={tip} />;
    }
    return null;
  };

  return (
    <div
      className={cn(
        `my-1 flex w-full items-center justify-between rounded-md px-2 py-1`,
        tip ? '' : 'hover:bg-accent',
        disabled ? 'pointer-events-none opacity-50' : '',
        className,
      )}
    >
      <span className="flex items-center text-sm">
        {children}
        {renderTooltip()}
      </span>
      <NumberFieldItem
        className={cn('w-[165px]', numberFieldClass)}
        {...props}
      />
    </div>
  );
};
