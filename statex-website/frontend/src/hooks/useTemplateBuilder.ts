'use client';

import { useMemo } from 'react';
import { TemplateConfig, SectionConfig, SectionType, SectionVariant } from '@/types/templates';

export class TemplateBuilder {
  private sections: SectionConfig[] = [];
  private metadata: Partial<TemplateConfig> = {};
  private sectionCounter = 0;

  addSection(
    type: SectionType,
    variant: SectionVariant,
    config: Record<string, any>
  ): TemplateBuilder {
    this.sectionCounter++;
    const uniqueId = `${type}-${variant}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${this.sectionCounter}`;
    
    this.sections.push({
      id: uniqueId,
      type,
      variant,
      config,
      priority: 'medium',
      aiOptimized: false
    });
    return this;
  }

  setMetadata(metadata: Partial<TemplateConfig>): TemplateBuilder {
    this.metadata = { ...this.metadata, ...metadata };
    return this;
  }

  build(): TemplateConfig {
    const uniqueTemplateId = `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: uniqueTemplateId,
      name: this.metadata.name || 'Dynamic Template',
      description: this.metadata.description || 'Generated template',
      sections: this.sections,
      metadata: {
        seo: this.metadata.metadata?.seo || {},
        performance: this.metadata.metadata?.performance || {},
        analytics: this.metadata.metadata?.analytics || {}
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

export function useTemplateBuilder(): TemplateBuilder {
  return useMemo(() => new TemplateBuilder(), []);
}
