import { Metadata } from 'next';
import { getFullUrl } from '@/config/env';

export const metadata: Metadata = {
  title: 'Free Prototype - Statex',
  description: 'Get your free working prototype in 24-48 hours. Professional template showcasing the complete process and requirements for AI-powered prototype development.',
  keywords: ['free prototype', 'rapid development', 'AI-powered', 'working prototype', '24-48 hours', 'no commitment'],
  openGraph: {
    title: 'Free Prototype - Statex',
    description: 'Get your free working prototype in 24-48 hours. Completely free with one modification included.',
    type: 'website',
    url: getFullUrl('/free-prototype'),
  },
  alternates: {
    canonical: getFullUrl('/free-prototype'),
  },
};

export default function FreePrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
