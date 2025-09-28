import { Metadata } from 'next';
import { HeroSpacer } from '@/components/atoms';
import LegalDisclaimersContent from './LegalDisclaimersContent';

export const metadata: Metadata = {
  title: 'Legal Disclaimers - Statex',
  description: 'Important legal disclaimers and limitations that apply to our services. Please read carefully to understand our legal obligations and limitations.',
  keywords: ['legal disclaimers', 'limitations of liability', 'legal notices', 'Statex legal'],
};

export default function LegalDisclaimersPage() {
  return (
    <>
      <HeroSpacer />
      <LegalDisclaimersContent />
    </>
  );
}
