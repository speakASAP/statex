import { Metadata } from 'next';
import { HeroSpacer } from '@/components/atoms';
import DesignSystemContent from './DesignSystemContent';

export const metadata: Metadata = {
  title: 'Design System Demo - Statex',
  description: 'Interactive demo of the Statex design system with themes, variants, and components.',
};

export default function DesignSystemPage() {
  return (
    <div>
      <HeroSpacer />
      <DesignSystemContent />
    </div>
  );
}
