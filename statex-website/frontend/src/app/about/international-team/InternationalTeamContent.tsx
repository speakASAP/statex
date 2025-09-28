'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function InternationalTeamContent() {
  const template = useTemplateBuilder()
    .addSection('hero', 'default', {
      title: 'Our International Team',
      subtitle: 'Meet our diverse team of experts from around the world. We bring together talent from different cultures and backgrounds to deliver exceptional results.',
      icon: '🌍',
      layout: 'default',
    })
    .addSection('features', 'default', {
      title: 'International Team Content Coming Soon',
      features: [
        {
          icon: '🌍',
          title: 'International Team Content Coming Soon',
          description: 'This page will showcase our international team members, their expertise, backgrounds, and the diverse perspectives they bring to our projects.'
        }
      ]
    })
    .build();

  return <TemplateRenderer template={template} />;
}
