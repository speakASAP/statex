import React from 'react';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { TemplateRenderer } from '@/lib/content/templateRenderer';
import { HeroSpacer } from '@/components/atoms';
import PageRenderer from '@/components/pages/PageRenderer';
import { generateContentMetadata } from '@/lib/seo/metadataUtils';
import { StructuredData } from '@/components/seo/StructuredData';

interface SolutionPageProps {
  params: Promise<{
    lang: string;
    solution: string;
  }>;
  searchParams: Record<string, string>;
}

const SUPPORTED_LANGUAGES = ['en', 'cs', 'de', 'fr'];

export async function generateStaticParams() {
  const loader = new ContentLoader();
  const englishSlugs = await loader.getAllEnglishSlugs('solutions');
  
  const params: Array<{ lang: string; solution: string }> = [];
  
  for (const englishSlug of englishSlugs) {
    for (const language of SUPPORTED_LANGUAGES) {
      const nativeSlug = loader.getNativeSlug(englishSlug, language);
      params.push({ lang: language, solution: nativeSlug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: SolutionPageProps) {
  const resolvedParams = await params;
  const { lang, solution } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return {
      title: 'Language Not Supported',
      description: 'The requested language is not supported.',
    };
  }

  return await generateContentMetadata({
    contentType: 'solutions',
    slug: solution,
    language: lang,
    fallbackTitle: 'Solution Not Found',
    fallbackDescription: 'The requested solution could not be found.',
  });
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const resolvedParams = await params;
  const { lang, solution } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const loader = new ContentLoader();
  const renderer = new TemplateRenderer();
  const page = await loader.loadSolution(solution, lang);

  if (!page) {
    notFound();
  }

  // Select template and render content
  const template = renderer.selectTemplate(page.markdown);
  const renderedContent = await renderer.renderContent(page, template);

  // Generate structured data for this solution
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': page.markdown.frontmatter.title,
    'description': page.markdown.frontmatter.seo?.metaDescription || page.markdown.frontmatter.description,
    'manufacturer': {
      '@type': 'Organization',
      'name': 'Statex',
      'url': 'https://statex.cz'
    },
    'category': page.markdown.frontmatter.category || 'Software Solutions',
    'offers': {
      '@type': 'Offer',
      'availability': 'https://schema.org/InStock',
      'priceCurrency': 'EUR',
      'seller': {
        '@type': 'Organization',
        'name': 'Statex'
      }
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