'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function WhatYouGetContent() {
  const template = useTemplateBuilder()
    .addSection('hero', 'default', {
      title: 'What You Get',
      subtitle: 'Your free prototype includes everything you need',
      icon: '🎁',
      layout: 'default'
    })
    .addSection('content', 'default', {
      title: 'What You Get Content Coming Soon',
      subtitle: 'This page will detail what is included in your free prototype package.',
      content: 'This page will detail what is included in your free prototype package.'
    })
    .build();

  return <TemplateRenderer template={template} />;
}
