import type { ButtonProps, ButtonSize, ButtonVariant } from './button.types';
import { Fragment } from 'react';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-primary bg-primary text-primary-foreground shadow-primary enabled:hover:border-primary-hover enabled:hover:bg-primary-hover [&[href]]:hover:border-primary-hover [&[href]]:hover:bg-primary-hover',
  secondary:
    'border-border bg-surface/80 text-text-primary backdrop-blur-sm enabled:hover:bg-surface-hover [&[href]]:hover:bg-surface-hover',
  outline:
    'border-primary bg-transparent text-text-primary enabled:hover:bg-primary-soft [&[href]]:hover:bg-primary-soft',
  ghost:
    'border-border bg-transparent text-text-primary enabled:hover:bg-surface-hover [&[href]]:hover:bg-surface-hover',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-11 gap-3 rounded-control px-4 py-2 text-sm [&_[data-button-icon]]:size-4',
  md: 'min-h-12 gap-2.5 rounded-control px-4 py-3 text-sm [&_[data-button-icon]]:size-4.5',
  lg: 'min-h-12 gap-2.5 rounded-control px-5 py-3 text-sm [&_[data-button-icon]]:size-4.5',
  icon: 'size-11 shrink-0 gap-0 rounded-full p-0 text-sm [&_[data-button-icon]]:size-5',
};

export const Button = ({
  variant = 'secondary',
  size = 'md',
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: ButtonProps) => {
  const classes = [
    'inline-flex cursor-pointer items-center justify-center border font-medium transition-[color,background-color,border-color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring enabled:active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none [&[href]]:active:translate-y-px [&_[data-button-icon]]:inline-flex [&_[data-button-icon]]:shrink-0 [&_[data-button-icon]>*]:size-full',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <Fragment>
      {leftIcon && (
        <span data-button-icon aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {size === 'icon' ? (
        <span data-button-icon aria-hidden="true" className="items-center justify-center">
          {children}
        </span>
      ) : (
        children
      )}
      {rightIcon && (
        <span data-button-icon aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </Fragment>
  );

  if (props.href !== undefined) {
    const rel =
      props.target === '_blank'
        ? Array.from(new Set(`${props.rel ?? ''} noreferrer noopener`.trim().split(/\s+/))).join(
            ' ',
          )
        : props.rel;

    return (
      <a {...props} rel={rel} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button {...props} type={props.type ?? 'button'} className={classes}>
      {content}
    </button>
  );
};
