import React from 'react';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { TemplateRenderer } from '@/lib/content/templateRenderer';
import { HeroSpacer } from '@/components/atoms';
import PageRenderer from '@/components/pages/PageRenderer';

interface EnglishLegalPageProps {
  params: Promise<{
    legal: string;
  }>;
  searchParams: Record<string, string>;
}

export async function generateStaticParams() {
  const loader = new ContentLoader();
  const englishSlugs = await loader.getAllEnglishSlugs('legal');
  
  return englishSlugs.map((slug) => ({
    legal: slug,
  }));
}

export async function generateMetadata({ params }: EnglishLegalPageProps) {
  const resolvedParams = await params;
  const { legal } = resolvedParams;
  
  const loader = new ContentLoader();
  const page = await loader.loadLegal(legal, 'en');

  if (!page) {
    return {
      title: 'Legal Document Not Found',
      description: 'The requested legal document could not be found.',
    };
  }

  const { markdown } = page;
  
  // Generate alternate language URLs
  const alternates: Record<string, string> = {};
  const supportedLanguages = ['en', 'cs', 'de', 'fr'];
  
  for (const language of supportedLanguages) {
    const langNativeSlug = loader.getNativeSlug(legal, language);
    if (language === 'en') {
      alternates[language] = `/legal/${langNativeSlug}`;
    } else {
      alternates[language] = `/${language}/legal/${langNativeSlug}`;
    }
  }
  
  return {
    title: markdown.frontmatter.title,
    description: markdown.frontmatter.seo?.metaDescription || markdown.frontmatter.description,
    keywords: markdown.frontmatter.seo?.keywords,
    openGraph: {
      title: markdown.frontmatter.title,
      description: markdown.frontmatter.seo?.metaDescription || markdown.frontmatter.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: markdown.frontmatter.title,
      description: markdown.frontmatter.seo?.metaDescription || markdown.frontmatter.description,
    },
    alternates: {
      canonical: `/legal/${legal}`,
      languages: alternates,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function EnglishLegalPage({ params }: EnglishLegalPageProps) {
  const resolvedParams = await params;
  const { legal } = resolvedParams;
  
  const loader = new ContentLoader();
  const renderer = new TemplateRenderer();
  const page = await loader.loadLegal(legal, 'en');

  if (!page) {
    notFound();
  }

  // Select template and render content
  const template = renderer.selectTemplate(page.markdown);
  const renderedContent = await renderer.renderContent(page, template);

  return (
    <>
      <HeroSpacer />
      <PageRenderer 
        content={renderedContent}
      />
    </>
  );
}