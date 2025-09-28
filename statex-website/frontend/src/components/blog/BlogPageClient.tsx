'use client';

import React from 'react';
import { BlogLazyImage } from './BlogLazyImage';

interface BlogPost {
  markdown: {
    frontmatter: {
      title: string;
      description: string;
      category: string;
      publishDate: string;
      tags: string[];
      seo: {
        metaDescription: string;
      };
    };
    metadata: {
      slug: string;
      readTime: string;
    };
  };
}

interface BlogPost {
  markdown: {
    frontmatter: {
      title: string;
      description: string;
      category: string;
      publishDate: string;
      tags: string[];
      seo: {
        metaDescription: string;
      };
    };
    metadata: {
      slug: string;
      readTime: string;
    };
  };
  blogImage?: {
    id: string;
    alt: string;
  } | null;
}

interface BlogPageClientProps {
  posts: BlogPost[];
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  console.log('BlogPageClient render - posts count:', posts.length, 'posts:', posts);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="stx-hero">
        <div className="stx-container">
          <div className="stx-hero__content">
            <h1 className="stx-hero__title">Blog</h1>
            <p className="stx-hero__subtitle">
              Latest insights on European digital transformation, technology trends, and business innovation
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="stx-section">
        <div className="stx-container">
          <div className="stx-blog__posts">
            {posts.map((post: BlogPost) => {
              const { markdown, blogImage } = post;
              const slug = markdown.metadata.slug;
              
              return (
                <article key={slug} className="stx-blog__post">
                  {blogImage ? (
                    <div className="stx-blog__image">
                      <BlogLazyImage
                        imageId={blogImage.id}
                        alt={blogImage.alt}
                        className="stx-blog__post-image"
                        onLoad={() => console.log(`Blog post image for ${slug} loaded`)}
                        onError={() => console.error(`Blog post image for ${slug} failed to load`)}
                      />
                    </div>
                  ) : (
                    <div className="stx-blog__image">
                      <div className="stx-blog__image-placeholder">
                        <div className="stx-loading-spinner"></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="stx-blog__content">
                    <div className="stx-blog__meta">
                      <span className="stx-blog__category">{markdown.frontmatter.category}</span>
                      <span className="stx-blog__date">{formatDate(markdown.frontmatter.publishDate)}</span>
                      <span className="stx-blog__read-time">{markdown.metadata.readTime}</span>
                    </div>
                    
                    <h3 className="stx-blog__heading">
                      <a href={`/blog/${slug}`}>{markdown.frontmatter.title}</a>
                    </h3>
                    
                    <p className="stx-blog__excerpt">
                      {markdown.frontmatter.seo.metaDescription}
                    </p>
                    
                    <div className="stx-blog__tags">
                      {markdown.frontmatter.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="stx-badge">{tag}</span>
                      ))}
                    </div>
                    
                    <a href={`/blog/${slug}`} className="stx-blog__link">
                      Read More →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
} 