'use client';


import { forwardRef, HTMLAttributes } from 'react';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | '80vw';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  as?: 'div' | 'section' | 'main' | 'article' | 'header' | 'footer';
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({
    className = '',
    size = 'lg',
    padding = 'md',
    as: Component = 'div',
    ...props
  }, ref) => {
    // Generate BEM + STX classes strictly from design tokens
    const baseClass = 'stx-container';
    const sizeClass = `stx-container--${size}`;
    const paddingClass = `stx-container--padding-${padding}`;

    const containerClasses = [
      baseClass,
      sizeClass,
      paddingClass,
      className
    ].filter(Boolean).join(' ');

    return (
      <Component
        className={containerClasses}
        ref={ref}
        data-testid="stx-container"
        {...props}
      />
    );
  }
);

Container.displayName = 'Container';

export { Container };
