'use client';


import { forwardRef, AnchorHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { linkClasses } from '@/lib/componentClasses';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  underline?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      underline = false,
      icon,
      iconPosition = 'right',
      children,
      ...props
    },
    ref
  ) => {
    // Generate classes using the new dynamic class generation system
    const linkClass = linkClasses({
      variant,
      size,
      underline,
      icon,
      iconPosition,
      className,
    });

    return (
      <a
        ref={ref}
        className={linkClass}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className={cn('stx-link__icon', 'stx-link__icon--left', `stx-link__icon--${size}`)}>
            {icon}
          </span>
        )}
        <span className="stx-link__text">{children}</span>
        {icon && iconPosition === 'right' && (
          <span className={cn('stx-link__icon', 'stx-link__icon--right', `stx-link__icon--${size}`)}>
            {icon}
          </span>
        )}
      </a>
    );
  }
);

Link.displayName = 'Link';

export { Link };
