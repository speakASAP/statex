'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function ValuesMissionContent() {
  const template = useTemplateBuilder()
    .addSection('hero', 'default', {
      title: 'Our Values & Mission',
      subtitle: 'Discover what drives us forward. Our core values and mission guide everything we do in serving our clients and community.',
      icon: '🎯',
      layout: 'default',
    })
    .addSection('features', 'default', {
      title: 'Values & Mission Content Coming Soon',
      features: [
        {
          icon: '🎯',
          title: 'Values & Mission Content Coming Soon',
          description: 'This page will showcase our core values, mission statement, and the principles that guide our work in AI development and digital transformation.'
        }
      ]
    })
    .build();

  return <TemplateRenderer template={template} />;
}
