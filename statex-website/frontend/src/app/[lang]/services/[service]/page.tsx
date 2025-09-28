import React from 'react';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { TemplateRenderer } from '@/lib/content/templateRenderer';
import { HeroSpacer } from '@/components/atoms';
import PageRenderer from '@/components/pages/PageRenderer';
import { generateContentMetadata } from '@/lib/seo/metadataUtils';
import { StructuredData } from '@/components/seo/StructuredData';

interface ServicePageProps {
  params: Promise<{
    lang: string;
    service: string;
  }>;
  searchParams: Record<string, string>;
}

const SUPPORTED_LANGUAGES = ['en', 'cs', 'de', 'fr'];

export async function generateStaticParams() {
  const loader = new ContentLoader();
  const englishSlugs = await loader.getAllEnglishSlugs('services');
  
  const params: Array<{ lang: string; service: string }> = [];
  
  for (const englishSlug of englishSlugs) {
    for (const language of SUPPORTED_LANGUAGES) {
      const nativeSlug = loader.getNativeSlug(englishSlug, language);
      params.push({ lang: language, service: nativeSlug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: ServicePageProps) {
  const resolvedParams = await params;
  const { lang, service } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return {
      title: 'Language Not Supported',
      description: 'The requested language is not supported.',
    };
  }

  return await generateContentMetadata({
    contentType: 'services',
    slug: service,
    language: lang,
    fallbackTitle: 'Service Not Found',
    fallbackDescription: 'The requested service could not be found.',
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const resolvedParams = await params;
  const { lang, service } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const loader = new ContentLoader();
  const renderer = new TemplateRenderer();
  const page = await loader.loadService(service, lang);

  if (!page) {
    notFound();
  }

  // Select template and render content
  const template = renderer.selectTemplate(page.markdown);
  const renderedContent = await renderer.renderContent(page, template);

  // Generate structured data for this service
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': page.markdown.frontmatter.title,
    'description': page.markdown.frontmatter.seo?.metaDescription || page.markdown.frontmatter.description,
    'provider': {
      '@type': 'Organization',
      'name': 'Statex',
      'url': 'https://statex.cz'
    },
    'serviceType': page.markdown.frontmatter.category || 'Technology Services',
    'areaServed': {
      '@type': 'Place',
      'name': 'Europe'
    },
    'availableLanguage': ['English', 'Czech', 'German', 'French']
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