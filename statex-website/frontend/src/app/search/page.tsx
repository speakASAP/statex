import { Metadata } from 'next';
import { HeroSpacer } from '@/components/atoms';
import SearchContent from './SearchContent';

export const metadata: Metadata = {
  title: 'Search Results - Statex',
  description: 'Find what you\'re looking for across our services, solutions, and resources. Intelligent search with AI-powered results.',
  keywords: ['search', 'AI search', 'content discovery', 'Statex search'],
};

export default function SearchPage() {
  return (
    <>
      <HeroSpacer />
      <SearchContent />
    </>
  );
}
