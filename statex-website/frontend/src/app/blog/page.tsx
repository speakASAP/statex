import React from 'react';
import { HeroSpacer } from '@/components/atoms';
import { LanguageAwareBlog } from '@/components/blog/LanguageAwareBlog';

export async function generateMetadata() {
  return {
    title: 'Blog - Statex',
    description: 'Latest insights on European digital transformation, technology trends, and business innovation. Expert analysis and practical guidance for modern businesses.',
    keywords: ['blog', 'digital transformation', 'technology trends', 'European business', 'AI', 'automation'],
    alternates: {
      canonical: '/blog',
      languages: {
        'en': '/blog',
        'cs': '/cs/blog',
        'de': '/de/blog',
        'fr': '/fr/blog'
      }
    }
  };
}

export default function BlogPage() {
  return (
    <>
      <HeroSpacer />
      <LanguageAwareBlog />
      
      {/* AI-Friendly Link */}
      <section className="stx-section">
        <div className="stx-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">AI-Friendly Content</h2>
            <p className="stx-section-subtitle">
              Access all our content in AI-optimized Markdown format for faster processing and analysis.
            </p>
            <a href="/ai/blog" className="stx-button stx-button--secondary">
              Browse AI Version →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
