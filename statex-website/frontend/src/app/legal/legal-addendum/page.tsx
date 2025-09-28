import { Metadata } from 'next';
import { HeroSpacer } from '@/components/atoms';
import LegalAddendumContent from './LegalAddendumContent';

export const metadata: Metadata = {
  title: 'Legal Addendum - Statex',
  description: 'Additional legal terms and conditions that apply to our services. Important information about our agreements and legal framework.',
  keywords: ['legal addendum', 'terms and conditions', 'legal framework', 'Statex legal'],
};

export default function LegalAddendumPage() {
  return (
    <>
      <HeroSpacer />
      <LegalAddendumContent />
    </>
  );
}
