'use client';

import React, { ComponentType, Suspense } from 'react';
import { SectionPriority } from '@/types/templates';

interface DynamicSectionProps {
  component: ComponentType<any>;
  config: Record<string, any>;
  priority: SectionPriority;
  aiOptimized: boolean;
}

export function DynamicSection({
  component: Component,
  config,
  priority,
  aiOptimized
}: DynamicSectionProps) {
  const sectionClass = `stx-section stx-section--${priority} ${aiOptimized ? 'stx-section--ai-optimized' : ''}`;

  return (
    <section className={sectionClass} data-priority={priority} data-ai-optimized={aiOptimized}>
      <Suspense fallback={<div className="stx-section__loading">Loading...</div>}>
        <Component {...config} />
      </Suspense>
    </section>
  );
}
