import { Metadata } from 'next';
import React from 'react';
import { HeroSpacer } from '@/components/atoms';
import ProcessExplanationContent from './ProcessExplanationContent';

export const metadata: Metadata = {
  title: 'Our Process Explained - Free Prototype - Statex',
  description: 'Understand how we transform your ideas into working prototypes. Our streamlined process ensures fast delivery and high quality results.',
  keywords: ['prototype process', 'AI development process', 'rapid prototyping', 'development workflow', 'Statex process'],
};

export default function ProcessExplanationPage() {
  return (
    <>
      <HeroSpacer />
      <ProcessExplanationContent />
    </>
  );
}
