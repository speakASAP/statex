import { Metadata } from 'next';
import React from 'react';
import { HeroSpacer } from '@/components/atoms';
import WhatYouGetContent from './WhatYouGetContent';

export const metadata: Metadata = {
  title: 'What You Get - Free Prototype - Statex',
  description: 'Discover exactly what you\'ll receive with our free prototype service. From functional code to documentation, we deliver everything you need.',
  keywords: ['prototype deliverables', 'what you get', 'free prototype', 'prototype features', 'Statex deliverables'],
};

export default function WhatYouGetPage() {
  return (
    <>
      <HeroSpacer />
      <WhatYouGetContent />
    </>
  );
}
