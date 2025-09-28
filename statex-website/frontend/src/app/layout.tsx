import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import '../styles/design-tokens.css';
import '../styles/blog.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { VariantProvider } from '@/components/providers/VariantProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { ABTestProvider } from '@/contexts/ABTestProvider';
import { HeaderSectionClient } from '@/components/sections/HeaderSectionClient';
import { FooterSection } from '@/components/sections/FooterSection';
import { OrganizationStructuredData, WebsiteStructuredData } from '@/components/seo/StructuredData';
import { env } from '@/config/env';

export const metadata: Metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: {
    default: 'Statex - AI-Powered Prototype Development | Transform Ideas into Working Apps in 24 Hours',
    template: '%s | Statex',
  },
  description:
    'Get your free working prototype in 24-48 hours. AI-powered development services for EU businesses. Voice, text, or file input - we create your app instantly.',
  keywords: [
    'AI prototype development',
    '24 hour prototype',
    'free prototype',
    'EU software development',
    'AI automation',
    'digital transformation',
    'web development',
    'custom software',
    'Czech Republic',
    'technology consulting',
    'business automation',
  ],
  authors: [{ name: 'Statex Team' }],
  creator: 'Statex',
  publisher: 'Statex',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: env.BASE_URL,
    siteName: 'Statex.cz',
    title: 'Statex - AI-Powered Prototype Development | Transform Ideas into Working Apps in 24 Hours',
    description:
      'Get your free working prototype in 24-48 hours. AI-powered development services for EU businesses. Voice, text, or file input - we create your app instantly.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Statex - AI-Powered Prototype Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Statex - AI-Powered Prototype Development',
    description: 'Get your free working prototype in 24-48 hours. AI-powered development services for EU businesses.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code', // To be replaced with actual verification code
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0066CC',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='scroll-smooth'>
      <head>
        {/* Only keep icon and manifest links, remove Google Fonts preconnects */}
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <meta name='msapplication-TileColor' content='#0066CC' />
      </head>
      <body>
        <OrganizationStructuredData />
        <WebsiteStructuredData />
        <ThemeProvider>
          <VariantProvider>
            <LanguageProvider>
              <ABTestProvider>
                <HeaderSectionClient />
                {children}
                <FooterSection />
              </ABTestProvider>
            </LanguageProvider>
          </VariantProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
