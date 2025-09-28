import { Metadata } from 'next';
import React from 'react';
import { HeroSpacer } from '@/components/atoms';
import ValuesMissionContent from './ValuesMissionContent';

export const metadata: Metadata = {
  title: 'Our Values & Mission - Statex',
  description: 'Discover what drives us forward. Our core values and mission guide everything we do in serving our clients and community.',
  keywords: ['values', 'mission', 'company values', 'Statex'],
};

export default function ValuesMissionPage() {
  return (
    <>
      <HeroSpacer />
      <ValuesMissionContent />
    </>
  );
}
