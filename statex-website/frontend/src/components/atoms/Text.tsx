'use client';

import React, { forwardRef, HTMLAttributes, ElementType } from 'react';


type TextElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div'
  | 'strong'
  | 'em'
  | 'code'
  | 'small';

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'caption' | 'label' | 'link' | 'muted' | 'code' | 'small' | 'subtitle';
  color?: 'default' | 'muted' | 'subtle' | 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'white' | 'inverse';
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  as?: TextElement;
  truncate?: boolean;
}

const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      className = '',
      variant = 'body',
      color = 'default',
      align = 'left',
      weight = 'normal',
      as,
      truncate = false,
      children,
      ...props
    },
    ref
  ) => {
    // Auto-determine element type based on variant if `as` is not specified
    const getElementType = (): TextElement => {
      if (as) return as;

      switch (variant) {
        case 'h1':
          return 'h1';
        case 'h2':
          return 'h2';
        case 'h3':
          return 'h3';
        case 'h4':
          return 'h4';
        case 'h5':
          return 'h5';
        case 'h6':
          return 'h6';
        case 'code':
          return 'code';
        case 'label':
          return 'span';
        case 'small':
          return 'small';
        case 'subtitle':
          return 'h6';
        default:
          return 'p';
      }
    };

    const Component = getElementType() as ElementType;

    // Generate BEM + STX classes strictly from design tokens
    const baseClass = 'stx-text';
    const variantClass = `stx-text--${variant}`;
    const colorClass = `stx-text--color-${color}`;
    const alignClass = `stx-text--align-${align}`;
    const weightClass = `stx-text--weight-${weight}`;

    const modifierClasses = [];
    if (truncate) {
      modifierClasses.push('stx-text--truncate');
    }

    const textClasses = [
      baseClass,
      variantClass,
      colorClass,
      alignClass,
      weightClass,
      ...modifierClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <Component
        ref={ref}
        className={textClasses}
        data-testid="stx-text"
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

export { Text };
