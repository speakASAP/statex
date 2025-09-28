import React from 'react';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { SlugMapper } from '@/lib/content/slugMapper';

interface AIBlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const loader = new ContentLoader();

  // Generate params for all languages
  const params: Array<{ id: string }> = [];
  const languages = ['en', 'cs', 'de', 'fr'];

  for (const language of languages) {
    const posts = await loader.loadBlogPosts(language);
    for (const post of posts) {
      const cleanSlug = SlugMapper.removeNumberedPrefix(post.markdown.metadata.slug);
      const nativeSlug = SlugMapper.getNativeSlug(cleanSlug, language);
      params.push({ id: nativeSlug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: AIBlogPostPageProps) {
  const resolvedParams = await params;
  const loader = new ContentLoader();

  // Auto-detect language from the slug
  const detectedLanguage = detectLanguageFromSlug(resolvedParams.id);
  const post = await loader.loadBlogPost(resolvedParams.id, detectedLanguage);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const { markdown } = post;

  // Generate alternate language URLs (without language prefixes)
  const languages = ['en', 'cs', 'de', 'fr'];
  const alternates: Record<string, string> = {};

  for (const lang of languages) {
    const cleanSlug = SlugMapper.removeNumberedPrefix(markdown.metadata.slug);
    const nativeSlug = SlugMapper.getNativeSlug(cleanSlug, lang);
    alternates[lang] = `/ai/blog/${nativeSlug}.md`;
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
      canonical: `/ai/blog/${resolvedParams.id}.md`,
      languages: alternates,
    },
  };
}

export default async function AIBlogPostPage({ params }: AIBlogPostPageProps) {
  const resolvedParams = await params;
  const loader = new ContentLoader();

  // Auto-detect language from the slug
  const detectedLanguage = detectLanguageFromSlug(resolvedParams.id);

  // Load the blog post
  const post = await loader.loadBlogPost(resolvedParams.id, detectedLanguage);

  if (!post) {
    notFound();
  }

  // Create AI-friendly Markdown content with cross-links
  const aiContent = generateAIBlogMarkdown(post, detectedLanguage, resolvedParams.id);

  return (
    <div className="ai-content">
      <pre className="markdown-content">
        {aiContent}
      </pre>
    </div>
  );
}

/**
 * Auto-detect language from the slug
 * Returns the detected language or 'en' as default
 */
function detectLanguageFromSlug(slug: string): string {
  // Check if the slug matches any native language patterns
  const languages = ['cs', 'de', 'fr'];

  for (const lang of languages) {
    // Get all native slugs for this language
    const nativeSlugs = SlugMapper.getAllNativeSlugs(lang);
    if (nativeSlugs.includes(slug)) {
      return lang;
    }
  }

  // If no match found, assume English
  return 'en';
}

function generateAIBlogMarkdown(post: any, language: string, nativeSlug: string): string {
  const { markdown } = post;

  // Start with the AI-optimized Markdown content
  const content = markdown.content;

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

- [Browse all blog posts](https://statex.cz/ai/blog/)
- [Homepage](https://statex.cz/ai/home)
- [About Statex](https://statex.cz/ai/about)
- [Services](https://statex.cz/ai/services)
- [Solutions](https://statex.cz/ai/solutions)

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

- [English](https://statex.cz/ai/blog/${markdown.metadata.slug}.md)
- [Czech](https://statex.cz/ai/blog/${markdown.metadata.slug}.md)
- [German](https://statex.cz/ai/blog/${markdown.metadata.slug}.md)
- [French](https://statex.cz/ai/blog/${markdown.metadata.slug}.md)

---

`;

  return metadata + content + crossLinks;
}
