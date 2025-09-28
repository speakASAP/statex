import React from 'react';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { TemplateRenderer } from '@/lib/content/templateRenderer';
import { HeroSpacer } from '@/components/atoms';
import PageRenderer from '@/components/pages/PageRenderer';
import { generateContentMetadata } from '@/lib/seo/metadataUtils';
import { StructuredData } from '@/components/seo/StructuredData';

interface LegalPageProps {
  params: Promise<{
    lang: string;
    legal: string;
  }>;
  searchParams: Record<string, string>;
}

const SUPPORTED_LANGUAGES = ['en', 'cs', 'de', 'fr'];

export async function generateStaticParams() {
  const loader = new ContentLoader();
  const englishSlugs = await loader.getAllEnglishSlugs('legal');
  
  const params: Array<{ lang: string; legal: string }> = [];
  
  for (const englishSlug of englishSlugs) {
    for (const language of SUPPORTED_LANGUAGES) {
      const nativeSlug = loader.getNativeSlug(englishSlug, language);
      params.push({ lang: language, legal: nativeSlug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: LegalPageProps) {
  const resolvedParams = await params;
  const { lang, legal } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return {
      title: 'Language Not Supported',
      description: 'The requested language is not supported.',
    };
  }

  const metadata = await generateContentMetadata({
    contentType: 'legal',
    slug: legal,
    language: lang,
    fallbackTitle: 'Legal Document Not Found',
    fallbackDescription: 'The requested legal document could not be found.',
  });

  // Add robots directive for legal pages
  return {
    ...metadata,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const resolvedParams = await params;
  const { lang, legal } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const loader = new ContentLoader();
  const renderer = new TemplateRenderer();
  const page = await loader.loadLegal(legal, lang);

  if (!page) {
    notFound();
  }

  // Select template and render content
  const template = renderer.selectTemplate(page.markdown);
  const renderedContent = await renderer.renderContent(page, template);

  // Generate structured data for legal document
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': page.markdown.frontmatter.title,
    'description': page.markdown.frontmatter.seo?.metaDescription || page.markdown.frontmatter.description,
    'publisher': {
      '@type': 'Organization',
      'name': 'Statex',
      'url': 'https://statex.cz'
    },
    'about': {
      '@type': 'Thing',
      'name': 'Legal Information'
    },
    'inLanguage': lang,
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'Statex',
      'url': 'https://statex.cz'
    }
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <HeroSpacer />
      <PageRenderer 
        content={renderedContent}
      />
    </>
  );
}