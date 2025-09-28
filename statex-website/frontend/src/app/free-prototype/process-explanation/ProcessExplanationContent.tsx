'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function ProcessExplanationContent() {
  const template = useTemplateBuilder()
    .addSection('hero', 'default', {
      title: 'Our Process Explained',
      subtitle: 'Understand how we transform your ideas into working prototypes. Our streamlined process ensures fast delivery and high quality results.',
      icon: '📋',
      layout: 'default'
    })
    .addSection('features', 'default', {
      title: 'Process Explanation Content Coming Soon',
      subtitle: 'This page will showcase our step-by-step process for creating AI-powered prototypes, from initial consultation to final delivery, with detailed explanations of each phase.',
      features: [
        {
          icon: '📋',
          title: 'Process Explanation Content Coming Soon',
          description: 'This page will showcase our step-by-step process for creating AI-powered prototypes, from initial consultation to final delivery, with detailed explanations of each phase.'
        }
      ]
    })
    .build();

  return <TemplateRenderer template={template} />;
}
