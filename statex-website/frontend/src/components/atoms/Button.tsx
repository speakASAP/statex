'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  asChild?: boolean;
  as?: React.ElementType;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  asChild = false,
  as,
  ...props
}: ButtonProps) {
  // Generate BEM + STX classes strictly from design tokens
  const baseClass = 'stx-button';
  const variantClass = `stx-button--${variant}`;
  const sizeClass = `stx-button--${size}`;
  const stateClasses = [];

  if (disabled || loading) {
    stateClasses.push('stx-button--disabled');
  }

  if (loading) {
    stateClasses.push('stx-button--loading');
  }

  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    ...stateClasses,
    className
  ].filter(Boolean).join(' ');

  // Icon classes using BEM element naming
  const iconClass = `stx-button__icon stx-button__icon--${iconPosition} stx-button__icon--${size}`;
  const spinnerClass = `stx-button__spinner stx-button__spinner--${size}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: buttonClasses,
      disabled: disabled || loading,
      ...props,
    } as any);
  }

  const Component = as || 'button';

  return (
    <Component
      className={buttonClasses}
      disabled={disabled || loading}
      data-testid="stx-button"
      {...props}
    >
      {loading && (
        <span className={spinnerClass} aria-hidden="true">
          <span className="stx-button__spinner-dot" />
          <span className="stx-button__spinner-dot" />
          <span className="stx-button__spinner-dot" />
        </span>
      )}

      {icon && iconPosition === 'left' && !loading && (
        <span className={iconClass} aria-hidden="true">
          {icon}
        </span>
      )}

      <span className="stx-button__text">
        {children}
      </span>

      {icon && iconPosition === 'right' && !loading && (
        <span className={iconClass} aria-hidden="true">
          {icon}
        </span>
      )}
    </Component>
  );
}
