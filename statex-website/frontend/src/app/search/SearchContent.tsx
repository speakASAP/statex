'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function SearchContent() {
  const template = useTemplateBuilder()
    .addSection('hero', 'default', {
      title: 'Search Results',
      subtitle: 'Find what you\'re looking for on our website',
      icon: '🔍',
      layout: 'default'
    })
    .addSection('content', 'default', {
      title: 'Search Content Coming Soon',
      subtitle: 'This page will display search results and help users find relevant content.',
      content: 'This page will display search results and help users find relevant content.'
    })
    .build();

  return <TemplateRenderer template={template} />;
}
