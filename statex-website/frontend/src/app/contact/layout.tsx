import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Statex',
  description: 'Ready to transform your business? Get in touch with our team of AI development experts. We serve clients across Europe with cutting-edge solutions.',
  keywords: ['contact Statex', 'AI development', 'software development', 'consulting', 'Prague'],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
