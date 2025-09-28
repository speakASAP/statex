import { Metadata } from 'next';
import { HeroSpacer } from '@/components/atoms';
import GDPRComplianceContent from './GDPRComplianceContent';

export const metadata: Metadata = {
  title: 'GDPR Compliance - Statex',
  description: 'Learn about our commitment to GDPR compliance and data protection. We ensure your data is handled securely and in accordance with EU regulations.',
  keywords: ['GDPR compliance', 'data protection', 'EU regulations', 'privacy', 'Statex legal'],
};

export default function GDPRCompliancePage() {
  return (
    <>
      <HeroSpacer />
      <GDPRComplianceContent />
    </>
  );
}
