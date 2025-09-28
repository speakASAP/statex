import React from 'react';
import { ContentLoader } from '@/lib/content/contentLoader';
import { getFullUrl } from '@/config/env';

export async function generateMetadata() {
  return {
    title: 'AI-Friendly Blog Index - Statex',
    description: 'Complete index of all blog posts in AI-friendly Markdown format. Optimized for AI crawlers, LLMs, and automated content processing.',
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  };
}

export default async function AIBlogIndexPage() {
  const loader = new ContentLoader();
  const posts = await loader.loadAllBlogPosts();

  // Group posts by language
  const postsByLanguage = posts.reduce((acc, post) => {
    const lang = post.language || 'en';
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

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
        <h1>AI-Friendly Blog Index</h1>
        <p>
          Complete index of all blog posts optimized for AI processing. 
          Each post is available in both human-friendly HTML and AI-friendly Markdown formats.
        </p>
        <div className="ai-stats">
          <span>Total Posts: {posts.length}</span>
          <span>Languages: {Object.keys(postsByLanguage).length}</span>
        </div>
      </header>

      <main className="ai-main">
        {Object.entries(postsByLanguage).map(([language, languagePosts]) => (
          <section key={language} className="ai-posts-section">
            <h2>{languageNames[language]} Posts ({languagePosts.length})</h2>
            
            {languagePosts.map((post) => {
              const { markdown } = post;
              const slug = markdown.metadata.slug;
              
              return (
                <article key={`${language}-${slug}`} className="ai-post">
                  <div className="ai-post-header">
                    <h3>
                      <a href={`/ai/blog/${slug}`}>{markdown.frontmatter.title}</a>
                    </h3>
                    <span className="ai-language-badge">{languageNames[language]}</span>
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
                    <a href={`/ai/blog/${slug}`} className="ai-link">
                      📄 AI Version (Markdown)
                    </a>
                    <a href={`/blog/${slug}`} className="ai-link">
                      🌐 Human Version (HTML)
                    </a>
                  </div>
                </article>
              );
            })}
          </section>
        ))}

        <section className="ai-categories">
          <h2>Categories</h2>
          <ul>
            <li><a href="/ai/blog/category/digital-transformation">Digital Transformation</a></li>
            <li><a href="/ai/blog/category/compliance">Compliance</a></li>
            <li><a href="/ai/blog/category/seo-marketing">SEO & Marketing</a></li>
            <li><a href="/ai/blog/category/market-analysis">Market Analysis</a></li>
            <li><a href="/ai/blog/category/content-strategy">Content Strategy</a></li>
            <li><a href="/ai/blog/category/ai-automation">AI & Automation</a></li>
            <li><a href="/ai/blog/category/system-modernization">System Modernization</a></li>
            <li><a href="/ai/blog/category/digital-government">Digital Government</a></li>
            <li><a href="/ai/blog/category/talent-skills">Talent & Skills</a></li>
          </ul>
        </section>

        <section className="ai-navigation">
          <h2>AI-Friendly Navigation</h2>
          <ul>
            <li><a href="/ai/">AI Homepage</a></li>
            <li><a href="/ai/services/">AI Services</a></li>
            <li><a href="/ai/solutions/">AI Solutions</a></li>
            <li><a href="/ai/about/">AI About</a></li>
            <li><a href="/ai/contact/">AI Contact</a></li>
          </ul>
        </section>

        <section className="ai-language-navigation">
          <h2>Language-Specific AI Blog</h2>
          <ul>
            <li><a href="/ai/blog">English AI Blog</a></li>
            <li><a href="/cs/ai/blog">Czech AI Blog</a></li>
            <li><a href="/de/ai/blog">German AI Blog</a></li>
            <li><a href="/fr/ai/blog">French AI Blog</a></li>
          </ul>
        </section>
      </main>

      <footer className="ai-footer">
        <hr />
        <p>
          📎 <strong>Browse the AI version of this website:</strong>{' '}
          <a href={getFullUrl('/ai/')}>{getFullUrl('/ai/')}</a>
        </p>
        <p>
          🔗 <strong>Human-friendly version:</strong>{' '}
          <a href={getFullUrl('/blog/')}>{getFullUrl('/blog/')}</a>
        </p>
        <p>
          🌍 <strong>Language-specific AI blogs:</strong>{' '}
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