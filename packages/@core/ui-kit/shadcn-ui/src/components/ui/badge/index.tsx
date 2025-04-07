// <script setup lang="ts">
// import type { BadgeVariants } from './badge';

// import { cn } from '@vben-core/shared/utils';

// import { badgeVariants } from './badge';

// const props = defineProps<{
//   class?: any;
//   variant?: BadgeVariants['variant'];
// }>();
// </script>

// <template>
//   <div :class="cn(badgeVariants({ variant }), props.class)">
//     <slot></slot>
//   </div>
// </template>

import type { BadgeVariants } from './badge';

import { cn } from '@xpress-core/shared/utils';

import { badgeVariants } from './badge';

export const Badge = ({
  className,
  variant,
  children,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariants['variant'];
}) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)}>{children}</div>
  );
};
