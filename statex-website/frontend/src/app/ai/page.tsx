import React from 'react';
import { ContentLoader } from '@/lib/content/contentLoader';
import { env, getFullUrl } from '@/config/env';

export async function generateMetadata() {
  return {
    title: 'AI-Friendly Content Index - Statex',
    description: 'Complete index of all website content in AI-friendly Markdown format. Optimized for AI crawlers, LLMs, and automated content processing.',
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  };
}

export default async function AIHomePage() {
  const loader = new ContentLoader();
  
  // Load all content types
  const pages = await loader.loadPages();
  const services = await loader.loadServices();
  const solutions = await loader.loadSolutions();
  const blogPosts = await loader.loadBlogPosts();

  return (
    <div className="ai-content">
      <header className="ai-header">
        <h1>AI-Friendly Content Index</h1>
        <p>
          Complete index of all Statex website content optimized for AI processing. 
          Each page is available in both human-friendly HTML and AI-friendly Markdown formats.
        </p>
      </header>

      <main className="ai-main">
        {/* Pages Section */}
        <section className="ai-pages">
          <h2>Website Pages</h2>
          
          {pages.map((page) => {
            const { markdown } = page;
            const slug = markdown.metadata.slug;
            
            return (
              <article key={slug} className="ai-page">
                <h3>
                  <a href={`/ai/${slug}`}>{markdown.frontmatter.title}</a>
                </h3>
                
                <div className="ai-page-meta">
                  <span>Category: {markdown.frontmatter.category}</span>
                  <span>Template: {markdown.frontmatter.template}</span>
                  <span>Word Count: {markdown.metadata.wordCount}</span>
                </div>
                
                <p className="ai-page-description">
                  {markdown.frontmatter.seo.metaDescription}
                </p>
                
                <div className="ai-page-tags">
                  {markdown.frontmatter.tags.map((tag: string) => (
                    <span key={tag} className="ai-tag">{tag}</span>
                  ))}
                </div>
                
                <div className="ai-page-links">
                  <a href={`/ai/${slug}`} className="ai-link">
                    📄 AI Version (Markdown)
                  </a>
                  <a href={`/${slug}`} className="ai-link">
                    🌐 Human Version (HTML)
                  </a>
                </div>
              </article>
            );
          })}
        </section>

        {/* Services Section */}
        <section className="ai-services">
          <h2>Services</h2>
          
          {services.map((service) => {
            const { markdown } = service;
            const slug = markdown.metadata.slug;
            
            return (
              <article key={slug} className="ai-service">
                <h3>
                  <a href={`/ai/services/${slug}`}>{markdown.frontmatter.title}</a>
                </h3>
                
                <div className="ai-service-meta">
                  <span>Category: {markdown.frontmatter.category}</span>
                  <span>Word Count: {markdown.metadata.wordCount}</span>
                </div>
                
                <p className="ai-service-description">
                  {markdown.frontmatter.seo.metaDescription}
                </p>
                
                <div className="ai-service-tags">
                  {markdown.frontmatter.tags.map((tag: string) => (
                    <span key={tag} className="ai-tag">{tag}</span>
                  ))}
                </div>
                
                <div className="ai-service-links">
                  <a href={`/ai/services/${slug}`} className="ai-link">
                    📄 AI Version (Markdown)
                  </a>
                  <a href={`/services/${slug}`} className="ai-link">
                    🌐 Human Version (HTML)
                  </a>
                </div>
              </article>
            );
          })}
        </section>

        {/* Solutions Section */}
        <section className="ai-solutions">
          <h2>Solutions</h2>
          
          {solutions.map((solution) => {
            const { markdown } = solution;
            const slug = markdown.metadata.slug;
            
            return (
              <article key={slug} className="ai-solution">
                <h3>
                  <a href={`/ai/solutions/${slug}`}>{markdown.frontmatter.title}</a>
                </h3>
                
                <div className="ai-solution-meta">
                  <span>Category: {markdown.frontmatter.category}</span>
                  <span>Word Count: {markdown.metadata.wordCount}</span>
                </div>
                
                <p className="ai-solution-description">
                  {markdown.frontmatter.seo.metaDescription}
                </p>
                
                <div className="ai-solution-tags">
                  {markdown.frontmatter.tags.map((tag: string) => (
                    <span key={tag} className="ai-tag">{tag}</span>
                  ))}
                </div>
                
                <div className="ai-solution-links">
                  <a href={`/ai/solutions/${slug}`} className="ai-link">
                    📄 AI Version (Markdown)
                  </a>
                  <a href={`/solutions/${slug}`} className="ai-link">
                    🌐 Human Version (HTML)
                  </a>
                </div>
              </article>
            );
          })}
        </section>

        {/* Blog Posts Section */}
        <section className="ai-blog-posts">
          <h2>Blog Posts</h2>
          
          {blogPosts.slice(0, 10).map((post) => {
            const { markdown } = post;
            const slug = markdown.metadata.slug;
            
            return (
              <article key={slug} className="ai-blog-post">
                <h3>
                  <a href={`/ai/blog/${slug}`}>{markdown.frontmatter.title}</a>
                </h3>
                
                <div className="ai-blog-post-meta">
                  <span>Author: {markdown.frontmatter.author}</span>
                  <span>Date: {markdown.frontmatter.publishDate}</span>
                  <span>Category: {markdown.frontmatter.category}</span>
                  <span>Read Time: {markdown.metadata.readTime}</span>
                  <span>Word Count: {markdown.metadata.wordCount}</span>
                </div>
                
                <p className="ai-blog-post-description">
                  {markdown.frontmatter.seo.metaDescription}
                </p>
                
                <div className="ai-blog-post-tags">
                  {markdown.frontmatter.tags.map((tag: string) => (
                    <span key={tag} className="ai-tag">{tag}</span>
                  ))}
                </div>
                
                <div className="ai-blog-post-links">
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
          
          <div className="ai-blog-posts-more">
            <a href="/ai/blog" className="ai-link">
              📚 View All Blog Posts →
            </a>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="ai-navigation">
          <h2>AI-Friendly Navigation</h2>
          <ul>
            <li><a href="/ai/">AI Homepage</a></li>
            <li><a href="/ai/services/">AI Services</a></li>
            <li><a href="/ai/solutions/">AI Solutions</a></li>
            <li><a href="/ai/blog/">AI Blog</a></li>
            <li><a href="/ai/about/">AI About</a></li>
            <li><a href="/ai/contact/">AI Contact</a></li>
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
          <a href={env.BASE_URL}>{env.BASE_URL}</a>
        </p>
        <p>
          🤖 <strong>This content is optimized for:</strong> AI crawlers, LLMs, 
          automated content processing, and machine learning applications.
        </p>
      </footer>
    </div>
  );
} 