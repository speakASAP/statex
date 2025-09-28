import React from 'react';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { TemplateRenderer } from '@/lib/content/templateRenderer';
import { HeroSpacer } from '@/components/atoms';
import PageRenderer from '@/components/pages/PageRenderer';

interface EnglishSolutionPageProps {
  params: Promise<{
    solution: string;
  }>;
  searchParams: Record<string, string>;
}

export async function generateStaticParams() {
  const loader = new ContentLoader();
  const englishSlugs = await loader.getAllEnglishSlugs('solutions');
  
  return englishSlugs.map((slug) => ({
    solution: slug,
  }));
}

export async function generateMetadata({ params }: EnglishSolutionPageProps) {
  const resolvedParams = await params;
  const { solution } = resolvedParams;
  
  const loader = new ContentLoader();
  const page = await loader.loadSolution(solution, 'en');

  if (!page) {
    return {
      title: 'Solution Not Found',
      description: 'The requested solution could not be found.',
    };
  }

  const { markdown } = page;
  
  // Generate alternate language URLs
  const alternates: Record<string, string> = {};
  const supportedLanguages = ['en', 'cs', 'de', 'fr'];
  
  for (const language of supportedLanguages) {
    const langNativeSlug = loader.getNativeSlug(solution, language);
    if (language === 'en') {
      alternates[language] = `/solutions/${langNativeSlug}`;
    } else {
      alternates[language] = `/${language}/solutions/${langNativeSlug}`;
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
      canonical: `/solutions/${solution}`,
      languages: alternates,
    },
  };
}

export default async function EnglishSolutionPage({ params }: EnglishSolutionPageProps) {
  const resolvedParams = await params;
  const { solution } = resolvedParams;
  
  const loader = new ContentLoader();
  const renderer = new TemplateRenderer();
  const page = await loader.loadSolution(solution, 'en');

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