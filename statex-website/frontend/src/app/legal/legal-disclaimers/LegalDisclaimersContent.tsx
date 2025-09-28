'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function LegalDisclaimersContent() {
  const template = useTemplateBuilder()
    .addSection('hero', 'default', {
      title: 'Legal Disclaimers',
      subtitle: 'Important legal disclaimers and limitations that apply to our services. Please read carefully to understand our legal obligations and limitations.',
      icon: '⚠️',
      layout: 'default'
    })
    .addSection('content', 'default', {
      title: 'Legal Disclaimers Content Coming Soon',
      subtitle: 'This page will showcase important legal disclaimers, limitations of liability, and legal notices that apply to our services and website usage.',
      content: 'This page will showcase important legal disclaimers, limitations of liability, and legal notices that apply to our services and website usage.'
    })
    .build();

  return <TemplateRenderer template={template} />;
}
