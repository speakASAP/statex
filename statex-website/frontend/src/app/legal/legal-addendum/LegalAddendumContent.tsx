'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function LegalAddendumContent() {
  const template = useTemplateBuilder()
    .addSection('hero', 'default', {
      title: 'Legal Addendum',
      subtitle: 'Additional legal terms and conditions',
      icon: '📜',
      layout: 'default'
    })
    .addSection('content', 'default', {
      title: 'Legal Addendum Content Coming Soon',
      subtitle: 'This page will contain additional legal terms and conditions.',
      content: 'This page will contain additional legal terms and conditions.'
    })
    .build();

  return <TemplateRenderer template={template} />;
}
