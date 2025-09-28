import React from 'react';

interface HeroSpacerProps {
  className?: string;
}

export function HeroSpacer({ className = '' }: HeroSpacerProps) {
  return (
    <div
      className={`stx-hero-spacer ${className}`}
      aria-hidden="true"
    />
  );
}
