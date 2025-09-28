import { Metadata } from 'next';
import React from 'react';
import { HeroSpacer } from '@/components/atoms';
import InternationalTeamContent from './InternationalTeamContent';

export const metadata: Metadata = {
  title: 'Our International Team - Statex',
  description: 'Meet our diverse team of experts from around the world. We bring together talent from different cultures and backgrounds to deliver exceptional results.',
  keywords: ['international team', 'global experts', 'diversity', 'Statex'],
};

export default function InternationalTeamPage() {
  return (
    <>
      <HeroSpacer />
      <InternationalTeamContent />
    </>
  );
}
