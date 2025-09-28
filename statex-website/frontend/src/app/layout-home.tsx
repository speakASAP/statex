import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Statex - AI-Powered Software Development & Digital Transformation',
  description: 'Transform your business with AI-powered software development and digital transformation services. Based in Europe, serving clients worldwide with cutting-edge solutions.',
  keywords: ['AI development', 'software development', 'digital transformation', 'European tech', 'Statex'],
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
