import React from 'react';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { getFullUrl } from '@/config/env';

interface LanguageAIBlogPostProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
  searchParams: Record<string, string>;
}

const SUPPORTED_LANGUAGES = ['cs', 'de', 'fr'];

export async function generateStaticParams() {
  const loader = new ContentLoader();
  const params: Array<{ lang: string; slug: string }> = [];
  
  for (const lang of SUPPORTED_LANGUAGES) {
    const posts = await loader.loadBlogPosts(lang);
    for (const post of posts) {
      params.push({
        lang,
        slug: post.markdown.metadata.slug
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: LanguageAIBlogPostProps) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return {
      title: 'Language Not Supported',
      description: 'The requested language is not supported.',
    };
  }

  const loader = new ContentLoader();
  const post = await loader.loadBlogPost(slug, lang);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const { markdown } = post;
  
  // Generate alternate language URLs
  const alternates: Record<string, string> = {};
  
  // Add English version
  const englishSlug = loader.getNativeSlug(markdown.metadata.slug, 'en');
  alternates['en'] = `/ai/blog/${englishSlug}`;
  
  // Add other language versions
  for (const language of SUPPORTED_LANGUAGES) {
    const langNativeSlug = loader.getNativeSlug(markdown.metadata.slug, language);
    alternates[language] = `/${language}/ai/blog/${langNativeSlug}`;
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
      canonical: `/${lang}/ai/blog/${slug}`,
      languages: alternates,
    },
  };
}

export default async function LanguageAIBlogPostPage({ params }: LanguageAIBlogPostProps) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const loader = new ContentLoader();
  const post = await loader.loadBlogPost(slug, lang);

  if (!post) {
    notFound();
  }

  const { markdown } = post;

  // Create AI-friendly Markdown content with cross-links
  const aiMarkdownContent = generateLanguageAIMarkdown(post, lang, slug);

  return (
    <div className="ai-content">
      <pre className="markdown-content">
        {aiMarkdownContent}
      </pre>
      
      {/* AI Footer with cross-links */}
      <footer className="ai-footer">
        <hr />
        <p>
          📎 <strong>Browse the AI version of this website:</strong>{' '}
          <a href={getFullUrl(`/${lang}/ai/`)}>{getFullUrl(`/${lang}/ai/`)}</a>
        </p>
        <p>
          🔗 <strong>Human-friendly version:</strong>{' '}
          <a href={getFullUrl(`/${lang}/blog/${slug}`)}>
            {getFullUrl(`/${lang}/blog/${slug}`)}
          </a>
        </p>
        <p>
          🌍 <strong>Language:</strong> {lang.toUpperCase()} | 
          <a href={`${getFullUrl('/ai/blog/')}${loader.getNativeSlug(markdown.metadata.slug, 'en')}`}> English</a> | 
          <a href={`${getFullUrl('/cs/ai/blog/')}${loader.getNativeSlug(markdown.metadata.slug, 'cs')}`}> Czech</a> | 
          <a href={`${getFullUrl('/de/ai/blog/')}${loader.getNativeSlug(markdown.metadata.slug, 'de')}`}> German</a> | 
          <a href={`${getFullUrl('/fr/ai/blog/')}${loader.getNativeSlug(markdown.metadata.slug, 'fr')}`}> French</a>
        </p>
        <p>
          📚 <strong>All AI content:</strong>{' '}
          <a href={getFullUrl(`/${lang}/ai/`)}>{getFullUrl(`/${lang}/ai/`)}</a>
        </p>
      </footer>
    </div>
  );
}

function generateLanguageAIMarkdown(post: any, language: string, nativeSlug: string): string {
  const { markdown } = post;
  
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

- [Browse all pages](${getFullUrl(`/${language}/ai/`)})
- [Homepage](${getFullUrl(`/${language}/ai/domu`)})
- [About Statex](${getFullUrl(`/${language}/ai/o-nas`)})
- [Services](${getFullUrl(`/${language}/ai/sluzby`)})
- [Solutions](${getFullUrl(`/${language}/ai/reseni`)})
- [Blog](${getFullUrl(`/${language}/ai/blog`)})

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

- [English](${getFullUrl(`/ai/blog/${markdown.metadata.slug}`)})
- [Czech](${getFullUrl(`/cs/ai/blog/${markdown.metadata.slug}`)})
- [German](${getFullUrl(`/de/ai/blog/${markdown.metadata.slug}`)})
- [French](${getFullUrl(`/fr/ai/blog/${markdown.metadata.slug}`)})

---

`;

  return metadata + markdown.content + crossLinks;
} 