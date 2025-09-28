'use client';

import React, { useEffect, useState } from 'react';
import { LanguageSwitcher } from '@/components/atoms/LanguageSwitcher';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { SlugMapper } from '@/lib/content/slugMapper';

interface AIBlogPostClientProps {
  params: { id: string };
}

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
  let content = markdown.content;
  
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

export function AIBlogPostClient({ params }: AIBlogPostClientProps) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`/ai/blog/${params.id}/api`);
        if (!response.ok) {
          throw new Error('Failed to load blog post');
        }
        const data = await response.json();
        setPost(data.post);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [params.id]);

  if (loading) {
    return <div>Loading AI blog post...</div>;
  }

  if (error || !post) {
    return <div>Error loading blog post: {error}</div>;
  }

  const detectedLanguage = detectLanguageFromSlug(params.id);
  const aiContent = generateAIBlogMarkdown(post, detectedLanguage, params.id);

  return (
    <LanguageProvider>
      <div className="ai-content">
        <header className="ai-header">
          <div className="ai-header-content">
            <h1>AI-Friendly Blog Post</h1>
            <LanguageSwitcher variant="buttons" />
          </div>
        </header>
        
        <main className="ai-main">
          <pre className="markdown-content">
            {aiContent}
          </pre>
        </main>
        
        {/* AI Footer with cross-links */}
        <footer className="ai-footer">
          <hr />
          <p>
            📎 <strong>Browse the AI version of this website:</strong>{' '}
            <a href="https://statex.cz/ai/">https://statex.cz/ai/</a>
          </p>
          <p>
            🔗 <strong>Human-friendly version:</strong>{' '}
            <a href={`https://statex.cz/blog/${params.id}`}>
              https://statex.cz/blog/{params.id}
            </a>
          </p>
          <p>
            🌍 <strong>Language:</strong> {detectedLanguage.toUpperCase()} | 
            <a href={`https://statex.cz/ai/blog/${post.markdown.metadata.slug}.md`}> English</a> | 
            <a href={`https://statex.cz/ai/blog/${post.markdown.metadata.slug}.md`}> Czech</a> | 
            <a href={`https://statex.cz/ai/blog/${post.markdown.metadata.slug}.md`}> German</a> | 
            <a href={`https://statex.cz/ai/blog/${post.markdown.metadata.slug}.md`}> French</a>
          </p>
          <p>
            📚 <strong>All AI content:</strong>{' '}
            <a href="https://statex.cz/ai/">https://statex.cz/ai/</a>
          </p>
        </footer>
      </div>
    </LanguageProvider>
  );
} 