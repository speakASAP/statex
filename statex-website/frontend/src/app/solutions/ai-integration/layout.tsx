import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Integration Solutions - Statex',
  description: 'Transform your business with intelligent AI integration solutions. Increase productivity by 60%, reduce costs by 35%, and create new revenue streams across European markets.',
  keywords: ['AI integration', 'artificial intelligence', 'business automation', 'productivity increase', 'cost reduction', 'European AI solutions'],
};

export default function AIIntegrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
