import type { ButtonVariants, ButtonVariantSize } from '../../ui';

export interface XpressButtonProps {
  asChild?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonVariantSize;
  variant?: ButtonVariants;
}
