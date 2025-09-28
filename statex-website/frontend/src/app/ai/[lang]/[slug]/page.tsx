import React from 'react';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';

interface MultilingualAIPageProps {
  params: {
    lang: string;
    slug: string;
  };
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

export async function generateMetadata({ params }: MultilingualAIPageProps) {
  const { lang, slug } = params;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return {
      title: 'Language Not Supported',
      description: 'The requested language is not supported.',
    };
  }

  const loader = new ContentLoader();
  const page = await loader.loadPage(slug, lang);

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  const { markdown } = page;
  
  // Generate alternate language URLs (without language prefixes)
  const alternates: Record<string, string> = {};
  
  for (const language of SUPPORTED_LANGUAGES) {
    const langNativeSlug = loader.getNativeSlug(markdown.metadata.slug, language);
    if (language === 'en') {
      alternates[language] = `/ai/${langNativeSlug}.md`;
    } else {
      alternates[language] = `/ai/${language}/${langNativeSlug}.md`;
    }
  }
  
  return {
    title: `${markdown.frontmatter.title} (AI Version - ${lang.toUpperCase()})`,
    description: `Raw Markdown content for AI processing in ${lang}: ${markdown.frontmatter.seo.metaDescription}`,
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: `/ai/${lang}/${slug}.md`,
      languages: alternates,
    },
  };
}

export default async function MultilingualAIPage({ params }: MultilingualAIPageProps) {
  const { lang, slug } = params;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const loader = new ContentLoader();

  // Load the page content for the specified language
  const page = await loader.loadPage(slug, lang);

  if (!page) {
    notFound();
  }

  const { markdown } = page;

  // Create AI-friendly Markdown content with cross-links
  const aiMarkdown = generateMultilingualAIMarkdown(page, lang, slug);

  return (
    <div className="ai-content">
      <pre className="markdown-content">
        {aiMarkdown}
      </pre>
      
      {/* AI Footer with cross-links */}
      <footer className="ai-footer">
        <hr />
        <p>
          📎 <strong>Browse the AI version of this website:</strong>{' '}
          <a href="https://statex.cz/ai/">https://statex.cz/ai/</a>
        </p>
        <p>
          🔗 <strong>Human-friendly version:</strong>{' '}
          <a href={`https://statex.cz/${lang}/${slug}`}>
            https://statex.cz/{lang}/{slug}
          </a>
        </p>
        <p>
          🌍 <strong>Language:</strong> {lang.toUpperCase()} | 
          <a href={`https://statex.cz/ai/${loader.getNativeSlug(markdown.metadata.slug, 'en')}.md`}> English</a> | 
          <a href={`https://statex.cz/ai/cs/${loader.getNativeSlug(markdown.metadata.slug, 'cs')}.md`}> Czech</a> | 
          <a href={`https://statex.cz/ai/de/${loader.getNativeSlug(markdown.metadata.slug, 'de')}.md`}> German</a> | 
          <a href={`https://statex.cz/ai/fr/${loader.getNativeSlug(markdown.metadata.slug, 'fr')}.md`}> French</a>
        </p>
        <p>
          📚 <strong>All AI content:</strong>{' '}
          <a href="https://statex.cz/ai/">https://statex.cz/ai/</a>
        </p>
      </footer>
    </div>
  );
}

function generateMultilingualAIMarkdown(page: any, language: string, nativeSlug: string): string {
  const { markdown, aiMarkdown } = page;
  
  // Start with the AI-optimized Markdown content
  let content = aiMarkdown;
  
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

- [Browse all pages](https://statex.cz/ai/${language}/)
- [Homepage](https://statex.cz/ai/${language}/domu)
- [About Statex](https://statex.cz/ai/${language}/o-nas)
- [Services](https://statex.cz/ai/${language}/sluzby)
- [Solutions](https://statex.cz/ai/${language}/reseni)
- [Blog](https://statex.cz/ai/${language}/blog)

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

- [English](https://statex.cz/ai/${markdown.metadata.slug}.md)
- [Czech](https://statex.cz/ai/cs/${markdown.metadata.slug}.md)
- [German](https://statex.cz/ai/de/${markdown.metadata.slug}.md)
- [French](https://statex.cz/ai/fr/${markdown.metadata.slug}.md)

---

`;

  return metadata + content + crossLinks;
} 