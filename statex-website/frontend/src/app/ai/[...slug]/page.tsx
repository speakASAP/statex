import React from 'react';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { detectLanguageFromSlugAdvanced } from '@/lib/utils/languageUtils';
import { contentConsistencyService } from '@/lib/services/contentConsistencyService';
import { getFullUrl } from '@/config/env';

// TypeScript interfaces for better type safety
interface AICatchAllPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Record<string, string>;
}

interface PageContent {
  markdown: {
    frontmatter: {
      title: string;
      seo: { metaDescription: string };
      author: string;
      publishDate: string;
      category: string;
      tags: string[];
      template: string;
      variant?: string;
    };
    metadata: {
      slug: string;
      wordCount: number;
      lastModified: string;
    };
  };
  aiMarkdown: string;
}

interface AIContentProps {
  content: string;
  language: string;
  slugPath: string;
  page?: PageContent;
}

interface AIFooterProps {
  language: string;
  slugPath: string;
  page?: PageContent | undefined;
}

// Constants
const SUPPORTED_LANGUAGES = ['en', 'cs', 'de', 'fr'] as const;
const STATIC_PAGES = ['services', 'about', 'solutions', 'contact'] as const;

/**
 * Generate static parameters for all supported languages and content types
 */
export async function generateStaticParams() {
  const loader = new ContentLoader();
  const englishSlugs = await loader.getAllEnglishSlugs('pages');
  
  const params: Array<{ slug: string[] }> = [];
  
  for (const englishSlug of englishSlugs) {
    for (const language of SUPPORTED_LANGUAGES) {
      const nativeSlug = loader.getNativeSlug(englishSlug, language);
      params.push({ slug: [nativeSlug] });
    }
  }

  return params;
}

/**
 * Generate metadata for the AI page
 */
export async function generateMetadata({ params }: AICatchAllPageProps) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join('/');
  const loader = new ContentLoader();
  
  const detectedLanguage = detectLanguageFromSlugAdvanced(slugPath);
  const page = await loadContent(slugPath, detectedLanguage, loader);

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  const { markdown } = page;
  
  // Generate alternate language URLs
  const alternates: Record<string, string> = {};
  
  for (const lang of SUPPORTED_LANGUAGES) {
    const langNativeSlug = loader.getNativeSlug(markdown.metadata.slug, lang);
    alternates[lang] = getFullUrl(`/ai/${langNativeSlug}.md`);
  }
  
  return {
    title: `${markdown.frontmatter.title} (AI Version - ${detectedLanguage.toUpperCase()})`,
    description: `Raw Markdown content for AI processing in ${detectedLanguage}: ${markdown.frontmatter.seo.metaDescription}`,
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: getFullUrl(`/ai/${slugPath}.md`),
      languages: alternates,
    },
  };
}

/**
 * Load content from different content types
 */
async function loadContent(slugPath: string, language: string, loader: ContentLoader): Promise<PageContent | null> {
  // Try loading as a page
  let page = await loader.loadPage(slugPath, language);
  
  if (!page) {
    // Try loading as a service
    page = await loader.loadService(slugPath, language);
  }
  
  if (!page) {
    // Try loading as a solution
    page = await loader.loadSolution(slugPath, language);
  }

  return page;
}

/**
 * Load static page content using content consistency service
 */
async function loadStaticPageContent(slugPath: string, language: string): Promise<string | null> {
  try {
    const contentVersion = await contentConsistencyService.getLanguageVersion(slugPath, language);
    return contentVersion?.ai || null;
  } catch (error) {
    console.error(`Error generating AI content for ${slugPath}:`, error);
    return null;
  }
}

/**
 * AI Footer component with navigation links
 */
function AIFooter({ language, slugPath, page }: AIFooterProps) {
  const loader = new ContentLoader();
  
  return (
    <footer className="ai-footer">
      <hr />
      <p>
        📎 <strong>Browse the AI version of this website:</strong>{' '}
        <a href={getFullUrl('/ai/')}>{getFullUrl('/ai/')}</a>
      </p>
      <p>
        🔗 <strong>Human-friendly version:</strong>{' '}
        <a href={getFullUrl(`/${slugPath}`)}>
          {getFullUrl(`/${slugPath}`)}
        </a>
      </p>
      <p>
        🌍 <strong>Language:</strong> {language.toUpperCase()} | 
        {SUPPORTED_LANGUAGES.map(lang => {
          const nativeSlug = page ? loader.getNativeSlug(page.markdown.metadata.slug, lang) : slugPath;
          return (
            <a key={lang} href={getFullUrl(`/ai/${lang === 'en' ? '' : lang + '/'}${nativeSlug}.md`)}>
              {' '}{lang === 'en' ? 'English' : lang === 'cs' ? 'Czech' : lang === 'de' ? 'German' : 'French'}
            </a>
          );
        })}
      </p>
      <p>
        📚 <strong>All AI content:</strong>{' '}
        <a href={getFullUrl('/ai/')}>{getFullUrl('/ai/')}</a>
      </p>
    </footer>
  );
}

/**
 * AI Content component for rendering markdown content
 */
function AIContent({ content, language, slugPath, page }: AIContentProps) {
  return (
    <div className="ai-content">
      <pre className="markdown-content">
        {content}
      </pre>
      <AIFooter language={language} slugPath={slugPath} page={page} />
    </div>
  );
}

/**
 * Generate AI-friendly Markdown content with cross-links
 */
function generateAIMarkdown(page: PageContent, language: string, nativeSlug: string): string {
  const { markdown, aiMarkdown } = page;
  
  // Add structured metadata at the top
  const metadata = `---
title: "${markdown.frontmatter.title}"
description: "${markdown.frontmatter.seo.metaDescription}"
author: "${markdown.frontmatter.author}"
publishDate: "${markdown.frontmatter.publishDate}"
category: "${markdown.frontmatter.category}"
tags: ${JSON.stringify(markdown.frontmatter.tags)}
language: "${language}"
template: "${markdown.frontmatter.template}"
variant: "${markdown.frontmatter.variant || 'default'}"
wordCount: ${markdown.metadata.wordCount}
lastModified: "${markdown.metadata.lastModified}"
nativeSlug: "${nativeSlug}"
---

`;

  // Add cross-links to related content in the same language
  const crossLinks = `

## Related Content (${language.toUpperCase()})

- [Browse all pages](${getFullUrl(`/ai/${language === 'en' ? '' : language + '/'}`)})
- [Homepage](${getFullUrl(`/ai/${language === 'en' ? 'home' : language + '/domu'}`)})
- [About Statex](${getFullUrl(`/ai/${language === 'en' ? 'about' : language + '/o-nas'}`)})
- [Services](${getFullUrl(`/ai/${language === 'en' ? 'services' : language + '/sluzby'}`)})
- [Solutions](${getFullUrl(`/ai/${language === 'en' ? 'solutions' : language + '/reseni'}`)})
- [Blog](${getFullUrl(`/ai/${language === 'en' ? 'blog' : language + '/blog'}`)})

## AI-Friendly Navigation

This content is optimized for AI processing and includes:
- Raw Markdown format for easy parsing
- Structured metadata for content understanding
- Cross-links to related content
- No HTML markup for clean text processing
- SEO-optimized for AI crawlers and LLMs
- Language-specific content and navigation
- Native language URLs for better SEO

## Available Languages

- [English](${getFullUrl(`/ai/${markdown.metadata.slug}.md`)})
- [Czech](${getFullUrl(`/ai/cs/${markdown.metadata.slug}.md`)})
- [German](${getFullUrl(`/ai/de/${markdown.metadata.slug}.md`)})
- [French](${getFullUrl(`/ai/fr/${markdown.metadata.slug}.md`)})

---

`;

  return metadata + aiMarkdown + crossLinks;
}

/**
 * Main AI Catch-All Page component
 */
export default async function AICatchAllPage({ params }: AICatchAllPageProps) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join('/');
  const loader = new ContentLoader();
  const detectedLanguage = detectLanguageFromSlugAdvanced(slugPath);

  // Try to load content from different content types
  let page = await loadContent(slugPath, detectedLanguage, loader);
  
  if (!page) {
    // Handle static pages that don't exist in content directory
    if (STATIC_PAGES.includes(slugPath as any)) {
      const staticContent = await loadStaticPageContent(slugPath, detectedLanguage);
      
      if (!staticContent) {
        notFound();
      }
      
      return (
        <AIContent 
          content={staticContent} 
          language={detectedLanguage} 
          slugPath={slugPath} 
        />
      );
    }
    
    notFound();
  }

  // Create AI-friendly Markdown content with cross-links
  const aiMarkdown = generateAIMarkdown(page, detectedLanguage, slugPath);

  return (
    <AIContent 
      content={aiMarkdown} 
      language={detectedLanguage} 
      slugPath={slugPath} 
      page={page}
    />
  );
} 