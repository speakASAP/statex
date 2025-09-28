import { Metadata } from 'next';
import React from 'react';
import { HeroSpacer } from '@/components/atoms';
import CzechPresenceContent from './CzechPresenceContent';

export const metadata: Metadata = {
  title: 'Our Czech Presence - Statex',
  description: 'Discover our strong presence in the Czech Republic. We serve the local market with expertise in AI and software development.',
  keywords: ['Czech Republic', 'local office', 'AI development', 'Czech market', 'Statex'],
};

export default function CzechPresencePage() {
  return (
    <>
      <HeroSpacer />
      <CzechPresenceContent />
    </>
  );
}
