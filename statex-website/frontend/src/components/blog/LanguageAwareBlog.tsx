'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { BlogPageClient } from './BlogPageClient';

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

interface LanguageAwareBlogProps {
  initialLanguage?: string;
}

export function LanguageAwareBlog({ initialLanguage = 'en' }: LanguageAwareBlogProps) {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('LanguageAwareBlog render - language:', language, 'initialLanguage:', initialLanguage);

  const loadPostsForLanguage = async (lang: string) => {
    console.log('Loading posts for language:', lang);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/blog/posts?language=${lang}`);
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('LanguageAwareBlog useEffect - language changed to:', language);
    if (language) {
      loadPostsForLanguage(language);
    }
  }, [language]);

  if (loading) {
    return (
      <div className="stx-section">
        <div className="stx-container">
          <div className="stx-loading-spinner"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stx-section">
        <div className="stx-container">
          <div className="stx-alert stx-alert--error">
            <p>Error loading blog posts: {error}</p>
            <button 
              onClick={() => loadPostsForLanguage(language)}
              className="stx-button stx-button--secondary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <BlogPageClient posts={posts} />;
} 