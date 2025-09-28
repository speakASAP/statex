'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function CompanyStoryContent() {
  const template = useTemplateBuilder()
    .addSection('hero', 'default', {
      title: 'Our Company Story',
      subtitle: 'Discover the journey that brought us here. From humble beginnings to becoming a leading AI-powered development company in Europe.',
      icon: '📖',
      layout: 'default',
    })
    .addSection('features', 'default', {
      title: 'Company Story Content Coming Soon',
      features: [
        {
          icon: '📖',
          title: 'Company Story Content Coming Soon',
          description: "This page will showcase our company's journey, mission, vision, and the story behind our success in AI-powered development and digital transformation."
        }
      ]
    })
    .build();

  return <TemplateRenderer template={template} />;
}
