import React from 'react';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { HeroSpacer } from '@/components/atoms';
import { BlogPageClient } from '@/components/blog/BlogPageClient';
import { ImageMappingService } from '@/lib/image/imageMappingService';

interface LanguageBlogPageProps {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Record<string, string>;
}

const SUPPORTED_LANGUAGES = ['cs', 'de', 'fr'];

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({ lang }));
}

export async function generateMetadata({ params }: LanguageBlogPageProps) {
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
    'cs': 'Nejnovější poznatky o evropské digitální transformaci, technologických trendech a obchodní inovaci',
    'de': 'Neueste Erkenntnisse über europäische digitale Transformation, Technologietrends und Geschäftsinnovation',
    'fr': 'Dernières informations sur la transformation numérique européenne, les tendances technologiques et l\'innovation commerciale'
  };
  
  return {
    title: `Blog - ${languageNames[lang] || 'Statex'}`,
    description: languageDescriptions[lang] || 'Latest insights on European digital transformation, technology trends, and business innovation.',
    keywords: ['blog', 'digital transformation', 'technology trends', 'European business', 'AI', 'automation'],
    alternates: {
      canonical: `/${lang}/blog`,
      languages: {
        'en': '/blog',
        'cs': '/cs/blog',
        'de': '/de/blog',
        'fr': '/fr/blog'
      }
    }
  };
}

export default async function LanguageBlogPage({ params }: LanguageBlogPageProps) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const loader = new ContentLoader();
  const posts = await loader.loadBlogPosts(lang);

  // Use centralized ImageMappingService
  const imageMappingService = ImageMappingService.getInstance();

  // Pre-compute image data for each post on the server side
  const postsWithImages = posts.map((post: any) => {
    const { markdown } = post;
    const slug = markdown.metadata.slug;
    const imageId = imageMappingService.getHeroImageByNativeSlug(slug, lang);
    return {
      ...post,
      blogImage: imageId ? {
        id: imageId,
        alt: `Blog post image for ${markdown.frontmatter.title}`
      } : null
    };
  });

  return (
    <>
      <HeroSpacer />
      <BlogPageClient posts={postsWithImages} />
      
      {/* AI-Friendly Link */}
      <section className="stx-section">
        <div className="stx-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">AI-Friendly Content</h2>
            <p className="stx-section-subtitle">
              Access all our content in AI-optimized Markdown format for faster processing and analysis.
            </p>
            <a href={`/${lang}/ai/blog`} className="stx-button stx-button--secondary">
              Browse AI Version →
            </a>
          </div>
        </div>
      </section>
    </>
  );
} 