import type { AvatarProps } from '@radix-ui/react-avatar';

import { cn } from '@xpress-core/shared/utils';

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
  return (
    <div
      className={cn(
        'relative flex w-8 flex-shrink-0 items-center rounded-none bg-transparent',
        rootClass,
      )}
    >
      <Avatar {...props} className="size-full">
        <AvatarImage alt={alt} src={src} />
        <AvatarFallback>X</AvatarFallback>
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
