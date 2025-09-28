'use client';

import React from 'react';
import { HeaderSection } from './HeaderSection';
import { HeaderSectionConfig } from '@/types/templates';

interface HeaderSectionClientProps extends HeaderSectionConfig {
  fallback?: React.ReactNode;
}

export function HeaderSectionClient({ fallback, ...config }: HeaderSectionClientProps) {
  // Remove loading state - show full header immediately
  return <HeaderSection {...config} />;
} 