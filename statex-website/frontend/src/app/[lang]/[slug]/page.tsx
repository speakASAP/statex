import React from 'react';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { TemplateRenderer } from '@/lib/content/templateRenderer';
import { HeroSpacer } from '@/components/atoms';
import PageRenderer from '@/components/pages/PageRenderer';
import { generateContentMetadata } from '@/lib/seo/metadataUtils';
import { StructuredData } from '@/components/seo/StructuredData';

interface MultilingualPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
  searchParams: Record<string, string>;
}

const SUPPORTED_LANGUAGES = ['en', 'cs', 'de', 'fr'];

export async function generateStaticParams() {
  const loader = new ContentLoader();
  const englishSlugs = await loader.getAllEnglishSlugs('pages');
  
  const params: Array<{ lang: string; slug: string }> = [];
  
  for (const englishSlug of englishSlugs) {
    for (const language of SUPPORTED_LANGUAGES) {
      const nativeSlug = loader.getNativeSlug(englishSlug, language);
      params.push({ lang: language, slug: nativeSlug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: MultilingualPageProps) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return {
      title: 'Language Not Supported',
      description: 'The requested language is not supported.',
    };
  }

  return await generateContentMetadata({
    contentType: 'pages',
    slug: slug,
    language: lang,
    fallbackTitle: 'Page Not Found',
    fallbackDescription: 'The requested page could not be found.',
  });
}

export default async function MultilingualPage({ params }: MultilingualPageProps) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const loader = new ContentLoader();
  const renderer = new TemplateRenderer();

  // Load the page content for the specified language
  const page = await loader.loadPage(slug, lang);

  if (!page) {
    notFound();
  }

  // Select template and render content
  const template = renderer.selectTemplate(page.markdown);
  const renderedContent = await renderer.renderContent(page, template);

  // Generate structured data for this page
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