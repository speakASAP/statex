'use client';

import React from 'react';
import { spacingClasses } from '@/lib/componentClasses';

export interface SpacingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  direction?: 'all' | 'x' | 'y' | 'top' | 'bottom' | 'left' | 'right';
}

const Spacing = React.forwardRef<HTMLDivElement, SpacingProps>(
  ({ className, size = 'md', direction = 'all', ...props }, ref) => {
    // Generate classes using the new dynamic class generation system
    const spacingClass = spacingClasses({
      size,
      direction,
      ...(className && { className })
    });

    return (
      <div
        className={spacingClass}
        ref={ref}
        {...props}
      />
    );
  }
);

Spacing.displayName = 'Spacing';

export { Spacing };
