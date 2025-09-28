'use client';

import React from 'react';
import { TemplateConfig } from '@/types/templates';
import { SectionRegistry } from '@/components/sections/SectionRegistry';
import { DynamicSection } from '@/components/sections/DynamicSection';
import { SectionInstance } from '@/components/sections/types';

interface TemplateRendererProps {
  template: TemplateConfig;
  pageType?: 'homepage' | 'about' | 'service' | 'solution' | 'legal' | 'prototype';
  className?: string;
}

export function TemplateRenderer({ template, pageType = 'homepage', className = '' }: TemplateRendererProps) {
  return (
    <div className={`stx-template ${className}`} data-template-id={template.id}>
      {template.sections?.map((section, index) => {
        const SectionComponent = SectionRegistry.getComponent(section.type, section.variant);

        if (!SectionComponent) {
          console.warn(`Section component not found: ${section.type}-${section.variant}`);
          return null;
        }

        // Convert template section to section instance format
        const sectionInstance: SectionInstance = {
          id: section.id,
          type: section.type,
          variant: section.variant,
          data: section.config,
          priority: section.priority,
          aiOptimized: section.aiOptimized
        };

        // Ensure unique key by combining section ID with index and template ID
        const uniqueKey = `${section.id}-${index}-${template.id}`;

        return (
          <DynamicSection
            key={uniqueKey}
            section={sectionInstance}
            pageType={pageType}
          />
        );
      })}
    </div>
  );
}
