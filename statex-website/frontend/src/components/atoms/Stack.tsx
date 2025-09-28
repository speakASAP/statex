'use client';

import React from 'react';
import { stackClasses } from '../../lib/componentClasses';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  divider?: 'none' | 'solid' | 'dashed';
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';
  reverse?: boolean;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      spacing = 'md',
      alignment = 'stretch',
      justify = 'start',
      divider = 'none',
      as: Component = 'div',
      reverse = false,
      children,
      ...props
    },
    ref
  ) => {
    // Generate classes using the new dynamic class generation system
    const stackClass = stackClasses({
      spacing,
      alignment,
      justify,
      divider: divider === 'solid' || divider === 'dashed',
      reverse,
      ...(className && { className })
    });

    return (
      <Component
        className={stackClass}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Stack.displayName = 'Stack';

export { Stack };
