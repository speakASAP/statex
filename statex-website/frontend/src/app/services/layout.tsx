import { Metadata } from 'next';
import { getFullUrl } from '@/config/env';

export const metadata: Metadata = {
  title: 'Services - Statex',
  description: 'Professional AI-powered development services for EU businesses. Web development, AI automation, custom software, and digital transformation solutions.',
  keywords: ['web development', 'AI automation', 'custom software', 'digital transformation', 'EU development services', 'Czech Republic', 'technology consulting'],
  openGraph: {
    title: 'Services - Statex',
    description: 'Professional AI-powered development services for EU businesses. Web development, AI automation, custom software, and digital transformation solutions.',
    type: 'website',
    url: getFullUrl('/services'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services - Statex',
    description: 'Professional AI-powered development services for EU businesses. Web development, AI automation, custom software, and digital transformation solutions.',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
