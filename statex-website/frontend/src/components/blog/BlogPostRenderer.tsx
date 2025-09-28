'use client';

import React from 'react';
import { RenderedContent } from '@/lib/content/templateRenderer';
import { ProcessedContent } from '@/lib/content/ContentProcessor';
import { HeroSpacer } from '@/components/atoms';
import { BlogHeroImage } from './BlogLazyImage';
import { CollapsibleContent } from './CollapsibleContent';

interface BlogImageData {
  id: string;
  alt: string;
  url: string;
}

interface BlogPostRendererProps {
  content: RenderedContent;
  post: ProcessedContent;
  relatedPosts: ProcessedContent[];
  blogImage?: BlogImageData | null;
}

export default function BlogPostRenderer({ 
  content, 
  post, 
  relatedPosts,
  blogImage
}: BlogPostRendererProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderSection = (section: any) => {
    switch (section.type) {
      case 'hero':
        return renderHeroSection(section);
      case 'content':
        return renderContentSection(section);
      case 'related':
        return renderRelatedSection();
      default:
        return null;
    }
  };

  const renderHeroSection = (section: any) => {
    const { content: heroContent, config } = section;
    
    return (
      <section className="stx-blog-hero">
        {blogImage && (
          <div className="stx-blog-image">
            <BlogHeroImage
              imageId={blogImage.id}
              alt={blogImage.alt}
              onLoad={() => console.log('Hero image loaded')}
              onError={() => console.error('Hero image failed to load')}
            />
          </div>
        )}
        
        <div className="stx-blog-hero__container">
          {config.showCategory && (
            <div className="stx-badge">{heroContent.category}</div>
          )}
          <h1 className="stx-blog-hero__title">{heroContent.title}</h1>
          <p className="stx-blog-hero__subtitle">{heroContent.description}</p>
          
          <div className="stx-blog__meta">
            {config.showAuthor && (
              <span>By {heroContent.author}</span>
            )}
            {config.showDate && (
              <span>{formatDate(heroContent.publishDate)}</span>
            )}
            {config.showReadTime && (
              <span>{heroContent.readTime}</span>
            )}
          </div>
          
          {config.showTags && heroContent.tags && (
            <div className="stx-blog__tags">
              {heroContent.tags.map((tag: string) => (
                <span key={tag} className="stx-badge">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderContentSection = (section: any) => {
    const { content: contentData } = section;
    
    return (
      <section className="stx-section">
        <div className="stx-container">
          <CollapsibleContent 
            htmlContent={contentData.html} 
            defaultCollapsed={false}
            articleTitle={post.markdown.frontmatter.title}
          />
        </div>
      </section>
    );
  };

  const renderRelatedSection = () => {
    return (
      <section className="stx-section">
        <div className="stx-container">
          <h2 className="stx-section__title">Related Posts</h2>
          <ul className="stx-related-posts__list">
            {relatedPosts.map((related) => (
              <li key={related.markdown.metadata.slug} className="stx-related-posts__item">
                <a href={`/blog/${related.markdown.metadata.slug}`} className="stx-related-posts__link">
                  {related.markdown.frontmatter.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <>
      <HeroSpacer />
      {content.sections.map((section) => (
        <React.Fragment key={section.id}>
          {renderSection(section)}
        </React.Fragment>
      ))}
    </>
  );
} 