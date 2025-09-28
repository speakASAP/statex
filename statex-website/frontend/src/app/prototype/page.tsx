import { Metadata } from 'next';
import { HeroSpacer } from '@/components/atoms';
import PrototypeContent from './PrototypeContent';

export const metadata: Metadata = {
  title: 'Get Your Free Prototype - Statex',
  description: 'Describe your app idea and get a working prototype in 24-48 hours. No commitment required, secure & confidential. AI-powered development by Statex.',
  keywords: ['free prototype', 'app development', 'AI automation', 'quick development', 'software prototype'],
};

export default function PrototypePage() {
  return (
    <>
      <HeroSpacer />
      <PrototypeContent />
    </>
  );
}
