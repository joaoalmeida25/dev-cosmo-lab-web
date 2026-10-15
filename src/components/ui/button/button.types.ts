import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface IButtonAppearanceProps {
  variant?: ButtonVariant;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

interface INativeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

interface IAnchorButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  disabled?: never;
}

type ButtonSizeProps =
  { size: 'icon'; 'aria-label': string } | { size?: Exclude<ButtonSize, 'icon'> };

export type ButtonProps = IButtonAppearanceProps &
  ButtonSizeProps &
  (INativeButtonProps | IAnchorButtonProps);
