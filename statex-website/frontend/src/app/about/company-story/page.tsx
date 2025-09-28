import { Metadata } from 'next';
import React from 'react';
import { HeroSpacer } from '@/components/atoms';
import CompanyStoryContent from './CompanyStoryContent';

export const metadata: Metadata = {
  title: 'Our Company Story - Statex',
  description: 'Discover the journey that brought Statex from humble beginnings to a leading AI-powered development company in Europe.',
  keywords: ['company story', 'about Statex', 'AI development', 'company mission', 'company vision'],
};

export default function CompanyStoryPage() {
  return (
    <>
      <HeroSpacer />
      <CompanyStoryContent />
    </>
  );
}
