import { Metadata } from 'next';
import React from 'react';
import { HeroSpacer } from '@/components/atoms';
import RequirementsContent from './RequirementsContent';

export const metadata: Metadata = {
  title: 'Requirements & Eligibility - Free Prototype - Statex',
  description: 'Learn about the requirements for our free prototype service. We make it simple and accessible for businesses of all sizes.',
  keywords: ['prototype requirements', 'eligibility criteria', 'free prototype', 'business requirements', 'Statex requirements'],
};

export default function RequirementsPage() {
  return (
    <>
      <HeroSpacer />
      <RequirementsContent />
    </>
  );
}
