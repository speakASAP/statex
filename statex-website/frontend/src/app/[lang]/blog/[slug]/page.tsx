import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { TemplateRenderer } from '@/lib/content/templateRenderer';
import BlogPostRenderer from '@/components/blog/BlogPostRenderer';
import { HeroSpacer } from '@/components/atoms';
import { ImageMappingService } from '@/lib/image/imageMappingService';
import { generateContentMetadata } from '@/lib/seo/metadataUtils';
import { StructuredData } from '@/components/seo/StructuredData';

interface LanguageBlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: LanguageBlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  
  // Validate language
  const supportedLanguages = ['cs', 'de', 'fr'];
  if (!supportedLanguages.includes(lang)) {
    return {
      title: 'Blog Post Not Found - Statex',
      description: 'The requested blog post could not be found.',
    };
  }

  return await generateContentMetadata({
    contentType: 'blog',
    slug: slug,
    language: lang,
    fallbackTitle: 'Blog Post Not Found - Statex',
    fallbackDescription: 'The requested blog post could not be found.',
  });
}

export async function generateStaticParams() {
  const loader = new ContentLoader();
  const languages = ['cs', 'de', 'fr'];
  const params: Array<{ lang: string; slug: string }> = [];
  
  for (const language of languages) {
    try {
      const posts = await loader.loadBlogPosts(language);
      for (const post of posts) {
        params.push({
          lang: language,
          slug: post.markdown.metadata.slug
        });
      }
    } catch (error) {
      console.warn(`Failed to load posts for language ${language}:`, error);
    }
  }
  
  return params;
}

export default async function LanguageBlogPostPage({ params }: LanguageBlogPostPageProps) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  
  // Validate language
  const supportedLanguages = ['cs', 'de', 'fr'];
  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

  // Load the blog post
  const loader = new ContentLoader();
  const post = await loader.loadBlogPost(slug, lang);

  if (!post) {
    notFound();
  }

  // Render the content using template system
  const templateRenderer = new TemplateRenderer();
  const template = templateRenderer.selectTemplate(post.markdown);
  const renderedContent = await templateRenderer.renderContent(post, template);

  // Fetch related posts on the server
  const relatedPosts = await loader.getRelatedPosts(
    post.markdown.metadata.slug,
    post.markdown.frontmatter.category,
    post.markdown.frontmatter.tags,
    lang,
    3
  );

  // Compute hero image data using centralized ImageMappingService
  const imageMappingService = ImageMappingService.getInstance();
  const heroImageId = imageMappingService.getHeroImageByNativeSlug(post.markdown.metadata.slug, lang);
  
  const blogImage = heroImageId ? {
    id: heroImageId,
    alt: `Blog post image for ${post.markdown.frontmatter.title}`,
    url: `/blog/optimized/${heroImageId}-1200w.webp`,
  } : null;

  // Generate structured data for blog post
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.markdown.frontmatter.title,
    'description': post.markdown.frontmatter.description,
    'author': {
      '@type': 'Organization',
      'name': 'Statex'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Statex',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://statex.cz/favicon-512x512.png'
      }
    },
    'datePublished': post.markdown.frontmatter.publishDate,
    'dateModified': post.markdown.metadata.lastModified,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://statex.cz/${lang}/blog/${slug}`
    },
    'image': blogImage ? {
      '@type': 'ImageObject',
      'url': `https://statex.cz${blogImage.url}`,
      'alt': blogImage.alt
    } : undefined,
    'articleSection': post.markdown.frontmatter.category,
    'keywords': post.markdown.frontmatter.tags?.join(', '),
    'inLanguage': lang
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <HeroSpacer />
      <BlogPostRenderer 
        content={renderedContent}
        post={post}
        relatedPosts={relatedPosts}
        blogImage={blogImage}
      />
    </>
  );
} 