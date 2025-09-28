import React from 'react';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { getFullUrl } from '@/config/env';

interface LanguageAIBlogPageProps {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Record<string, string>;
}

const SUPPORTED_LANGUAGES = ['cs', 'de', 'fr'];

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({ lang }));
}

export async function generateMetadata({ params }: LanguageAIBlogPageProps) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return {
      title: 'Language Not Supported',
      description: 'The requested language is not supported.',
    };
  }

  const languageNames: Record<string, string> = {
    'cs': 'Čeština',
    'de': 'Deutsch', 
    'fr': 'Français'
  };

  const languageDescriptions: Record<string, string> = {
    'cs': 'Kompletní index všech blogových příspěvků v AI-optimalizovaném Markdown formátu',
    'de': 'Vollständiger Index aller Blog-Beiträge im AI-optimierten Markdown-Format',
    'fr': 'Index complet de tous les articles de blog au format Markdown optimisé pour l\'IA'
  };
  
  return {
    title: `AI-Friendly Blog Index - ${languageNames[lang]} - Statex`,
    description: languageDescriptions[lang] || 'Complete index of all blog posts in AI-friendly Markdown format.',
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: `/${lang}/ai/blog`,
      languages: {
        'en': '/ai/blog',
        'cs': '/cs/ai/blog',
        'de': '/de/ai/blog',
        'fr': '/fr/ai/blog'
      }
    }
  };
}

export default async function LanguageAIBlogIndexPage({ params }: LanguageAIBlogPageProps) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const loader = new ContentLoader();
  const posts = await loader.loadBlogPosts(lang);

  // Language display names
  const languageNames: Record<string, string> = {
    en: 'English',
    cs: 'Czech',
    de: 'German',
    fr: 'French'
  };

  return (
    <div className="ai-content">
      <header className="ai-header">
        <h1>AI-Friendly Blog Index - {languageNames[lang]}</h1>
        <p>
          Complete index of all blog posts optimized for AI processing in {languageNames[lang]}. 
          Each post is available in both human-friendly HTML and AI-friendly Markdown formats.
        </p>
        <div className="ai-stats">
          <span>Total Posts: {posts.length}</span>
          <span>Language: {languageNames[lang]}</span>
        </div>
      </header>

      <main className="ai-main">
        <section className="ai-posts-section">
          <h2>{languageNames[lang]} Posts ({posts.length})</h2>
          
          {posts.map((post) => {
            const { markdown } = post;
            const slug = markdown.metadata.slug;
            
            return (
              <article key={slug} className="ai-post">
                <div className="ai-post-header">
                  <h3>
                    <a href={`/${lang}/ai/blog/${slug}`}>{markdown.frontmatter.title}</a>
                  </h3>
                  <span className="ai-language-badge">{languageNames[lang]}</span>
                </div>
                
                <div className="ai-post-meta">
                  <span>Author: {markdown.frontmatter.author}</span>
                  <span>Date: {markdown.frontmatter.publishDate}</span>
                  <span>Category: {markdown.frontmatter.category}</span>
                  <span>Read Time: {markdown.metadata.readTime}</span>
                  <span>Word Count: {markdown.metadata.wordCount}</span>
                </div>
                
                <p className="ai-post-description">
                  {markdown.frontmatter.seo.metaDescription}
                </p>
                
                <div className="ai-post-tags">
                  {markdown.frontmatter.tags.map((tag: string) => (
                    <span key={tag} className="ai-tag">{tag}</span>
                  ))}
                </div>
                
                <div className="ai-post-links">
                  <a href={`/${lang}/ai/blog/${slug}`} className="ai-link">
                    📄 AI Version (Markdown)
                  </a>
                  <a href={`/${lang}/blog/${slug}`} className="ai-link">
                    🌐 Human Version (HTML)
                  </a>
                </div>
              </article>
            );
          })}
        </section>

        <section className="ai-categories">
          <h2>Categories</h2>
          <ul>
            <li><a href={`/${lang}/ai/blog/category/digital-transformation`}>Digital Transformation</a></li>
            <li><a href={`/${lang}/ai/blog/category/compliance`}>Compliance</a></li>
            <li><a href={`/${lang}/ai/blog/category/seo-marketing`}>SEO & Marketing</a></li>
            <li><a href={`/${lang}/ai/blog/category/market-analysis`}>Market Analysis</a></li>
            <li><a href={`/${lang}/ai/blog/category/content-strategy`}>Content Strategy</a></li>
            <li><a href={`/${lang}/ai/blog/category/ai-automation`}>AI & Automation</a></li>
            <li><a href={`/${lang}/ai/blog/category/system-modernization`}>System Modernization</a></li>
            <li><a href={`/${lang}/ai/blog/category/digital-government`}>Digital Government</a></li>
            <li><a href={`/${lang}/ai/blog/category/talent-skills`}>Talent & Skills</a></li>
          </ul>
        </section>

        <section className="ai-navigation">
          <h2>AI-Friendly Navigation</h2>
          <ul>
            <li><a href={`/${lang}/ai/`}>AI Homepage</a></li>
            <li><a href={`/${lang}/ai/services/`}>AI Services</a></li>
            <li><a href={`/${lang}/ai/solutions/`}>AI Solutions</a></li>
            <li><a href={`/${lang}/ai/about/`}>AI About</a></li>
            <li><a href={`/${lang}/ai/contact/`}>AI Contact</a></li>
          </ul>
        </section>
      </main>

      <footer className="ai-footer">
        <hr />
        <p>
          📎 <strong>Browse the AI version of this website:</strong>{' '}
          <a href={getFullUrl(`/${lang}/ai/`)}>{getFullUrl(`/${lang}/ai/`)}</a>
        </p>
        <p>
          🔗 <strong>Human-friendly version:</strong>{' '}
          <a href={getFullUrl(`/${lang}/blog/`)}>{getFullUrl(`/${lang}/blog/`)}</a>
        </p>
        <p>
          🌍 <strong>Other languages:</strong>{' '}
          <a href={getFullUrl('/ai/blog')}>English</a> |{' '}
          <a href={getFullUrl('/cs/ai/blog')}>Czech</a> |{' '}
          <a href={getFullUrl('/de/ai/blog')}>German</a> |{' '}
          <a href={getFullUrl('/fr/ai/blog')}>French</a>
        </p>
        <p>
          🤖 <strong>This content is optimized for:</strong> AI crawlers, LLMs, 
          automated content processing, and machine learning applications.
        </p>
      </footer>
    </div>
  );
} 