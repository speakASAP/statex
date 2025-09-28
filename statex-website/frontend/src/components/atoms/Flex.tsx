'use client';

import React, { forwardRef, HTMLAttributes, ElementType } from 'react';
import { flexClasses } from '@/lib/componentClasses';

type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export interface FlexProps extends HTMLAttributes<HTMLElement> {
  direction?: FlexDirection;
  align?: AlignItems;
  justify?: JustifyContent;
  wrap?: FlexWrap;
  gap?: GapSize;
  fullWidth?: boolean;
  fullHeight?: boolean;
  as?: ElementType;
}

const Flex = forwardRef<HTMLElement, FlexProps>(
  (
    {
      as: Component = 'div',
      className,
      direction = 'row',
      align = 'stretch',
      justify = 'start',
      wrap = 'nowrap',
      gap = 'md',
      fullWidth = false,
      fullHeight = false,
      ...props
    },
    ref
  ) => {
    // Generate classes using the new dynamic class generation system
    const flexClass = flexClasses({
      direction,
      align,
      justify,
      wrap,
      gap,
      fullWidth,
      fullHeight,
      ...(className && { className }),
    });

    return (
      <Component
        className={flexClass}
        ref={ref}
        {...props}
      />
    );
  }
);

Flex.displayName = 'Flex';

export { Flex };
