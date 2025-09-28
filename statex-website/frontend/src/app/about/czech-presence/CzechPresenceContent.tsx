'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function CzechPresenceContent() {
  const template = useTemplateBuilder()
    .addSection('hero', 'default', {
      title: 'Czech Presence',
      subtitle: 'Our presence and commitment to the Czech market',
      icon: '🇨🇿',
      layout: 'default'
    })
    .addSection('content', 'default', {
      title: 'Czech Presence Content Coming Soon',
      subtitle: 'This page will detail our presence and activities in the Czech Republic.',
      content: 'This page will detail our presence and activities in the Czech Republic.'
    })
    .build();

  return <TemplateRenderer template={template} />;
}
