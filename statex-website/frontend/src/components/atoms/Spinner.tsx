'use client';

import React from 'react';
import { spinnerClasses } from '@/lib/componentClasses';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

export function Spinner({
  size = 'md',
  color = 'primary',
  className
}: SpinnerProps) {
  // Generate classes using the new dynamic class generation system
  const spinnerClass = spinnerClasses({
    size,
    color,
    className,
  });

  return (
    <div
      className={spinnerClass}
      role="status"
      aria-label="Loading"
    >
      <div className="stx-spinner__circle" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
