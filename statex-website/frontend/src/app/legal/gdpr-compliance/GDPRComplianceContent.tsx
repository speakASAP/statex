'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function GDPRComplianceContent() {
  const template = useTemplateBuilder()
    .addSection('hero', 'default', {
      title: 'GDPR Compliance',
      subtitle: 'Our commitment to data protection and privacy in accordance with GDPR regulations.',
      icon: '🔒',
      layout: 'default'
    })
    .addSection('content', 'default', {
      title: 'GDPR Compliance Content Coming Soon',
      subtitle: 'This page will detail our GDPR compliance measures, data processing practices, and your rights regarding personal data.',
      content: 'This page will detail our GDPR compliance measures, data processing practices, and your rights regarding personal data.'
    })
    .build();

  return <TemplateRenderer template={template} />;
}
