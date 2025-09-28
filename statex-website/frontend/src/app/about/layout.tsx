import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Statex',
  description: 'We are a team of passionate technologists dedicated to transforming businesses through AI-powered solutions. Based in the heart of Europe, we serve clients across the EU.',
  keywords: ['about Statex', 'AI development', 'European tech', 'software development', 'team'],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
