import type { AvatarProps } from '@radix-ui/react-avatar';

import { cn } from '@xpress-core/shared/utils';

import { useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../../ui';

interface Props extends AvatarProps {
  alt?: string;
  dot?: boolean;
  dotClass?: string;
  rootClass?: string;
  src?: string;
}

const XpressAvatar = ({
  alt = 'avatar',
  dot = false,
  dotClass = 'bg-green-500',
  rootClass,
  src,
  ...props
}: Props) => {
  const text = useMemo(() => {
    return alt.slice(-2).toUpperCase();
  }, [alt]);

  return (
    <div className={cn('relative flex flex-shrink-0 items-center', rootClass)}>
      <Avatar {...props} className="size-full">
        <AvatarImage alt={alt} src={src} />
        <AvatarFallback>{text}</AvatarFallback>
      </Avatar>
      {dot && (
        <span
          className={cn(
            'border-background absolute bottom-0 right-0 size-3 rounded-full border-2',
            dotClass,
          )}
        />
      )}
    </div>
  );
};

export default XpressAvatar;
