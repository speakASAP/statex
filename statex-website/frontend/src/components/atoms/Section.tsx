'use client';


import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { sectionClasses } from '../../lib/componentClasses';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  background?: 'default' | 'muted' | 'primary' | 'accent' | 'dark';
  alignment?: 'left' | 'center' | 'right';
  as?: 'section' | 'div' | 'article' | 'main';
  container?: boolean;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      spacing = 'md',
      background = 'default',
      alignment = 'left',
      as: Component = 'section',
      container = true,
      containerSize = 'lg',
      children,
      ...props
    },
    ref
  ) => {
    // Generate classes using the new dynamic class generation system
    const sectionClass = sectionClasses({
      spacing,
      background,
      alignment,
      ...(className && { className })
    });

    const content = container ? (
      <div className={cn('stx-section__container', `stx-section__container--${containerSize}`)}>
        {children}
      </div>
    ) : (
      children
    );

    return (
      <Component
        className={sectionClass}
        ref={ref as any}
        {...props}
      >
        {content}
      </Component>
    );
  }
);

Section.displayName = 'Section';

export { Section };
