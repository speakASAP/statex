'use client';

import React from 'react';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Container } from '@/components/atoms/Container';

// Dynamic class generation function
export const getBlogClasses = (variant: 'default' | 'grid' = 'default') => {
  return {
    container: `stx-blog stx-blog--${variant}`,
    title: 'stx-blog__title',
    description: 'stx-blog__description',
    posts: 'stx-blog__posts',
    post: 'stx-blog__post',
    image: 'stx-blog__image',
    content: 'stx-blog__content',
    heading: 'stx-blog__heading',
    excerpt: 'stx-blog__excerpt',
    meta: 'stx-blog__meta',
    link: 'stx-blog__link'
  };
};

interface BlogProps {
  variant?: 'default' | 'grid' | 'list' | 'featured';
  title?: string;
  description?: string;
  posts?: Array<{
    title: string;
    excerpt: string;
    image?: string;
    date: string;
    author: string;
    category: string;
    slug: string;
  }>;
  showViewAll?: boolean;
  viewAllText?: string;
  viewAllLink?: string;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
}

export function Blog({
  title = 'Latest Blog Posts',
  description = 'Stay updated with our latest insights and news',
  posts = [],
  showViewAll = true,
  viewAllText = 'View All Posts',
  viewAllLink = '/blog',
  className = '',
}: BlogProps) {
  const classes = getBlogClasses('default');
  const blogClasses = `${classes.container} ${className}`.trim();

  return (
    <section className={blogClasses} data-testid="stx-blog-section">
      <Container size="80vw">
        <div className="stx-blog-header">
          <Text variant="h2" className={classes.title}>
            {title}
          </Text>
          {description && (
            <Text variant="bodyLarge" className={classes.description}>
              {description}
            </Text>
          )}
        </div>
        <div className={classes.posts}>
          {posts.map((post, index) => (
            <article key={index} className={classes.post}>
              {post.image && (
                <div className={classes.image}>
                  <img src={post.image} alt={post.title} />
                </div>
              )}
              <div className={classes.content}>
                <Text variant="h3" className={classes.heading}>
                  <a href={`/blog/${post.slug}`} className={classes.link}>
                    {post.title}
                  </a>
                </Text>
                <Text variant="bodyMedium" className={classes.excerpt}>
                  {post.excerpt}
                </Text>
                <div className={classes.meta}>
                  <Text variant="bodySmall">
                    {post.date} • {post.author} • {post.category}
                  </Text>
                </div>
              </div>
            </article>
          ))}
        </div>
        {showViewAll && (
          <div className="stx-blog-footer">
            <Button variant="secondary" asChild>
              <a href={viewAllLink}>{viewAllText}</a>
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
