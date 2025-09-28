import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentLoader } from '@/lib/content/contentLoader';
import { TemplateRenderer } from '@/lib/content/templateRenderer';
import BlogPostRenderer from '@/components/blog/BlogPostRenderer';
import { HeroSpacer } from '@/components/atoms';
import { SlugMapper } from '@/lib/content/slugMapper';
import { ImageMappingService } from '@/lib/image/imageMappingService';

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const cleanSlug = SlugMapper.removeNumberedPrefix(resolvedParams.id);
  
  const loader = new ContentLoader();
  const post = await loader.loadBlogPost(cleanSlug, 'en');

  if (!post) {
    return {
      title: 'Blog Post Not Found - Statex',
      description: 'The requested blog post could not be found.',
    };
  }

  // Generate language alternates
  const availableLanguages = await loader.getAvailableLanguages(post.markdown.metadata.slug, 'blog');
  const alternates: Record<string, string> = {};
  
  for (const lang of availableLanguages) {
    const nativeSlug = loader.getNativeSlug(post.markdown.metadata.slug, lang);
    if (lang === 'en') {
      alternates[lang] = `/blog/${nativeSlug}`;
    } else {
      alternates[lang] = `/${lang}/blog/${nativeSlug}`;
    }
  }

  return {
    title: post.markdown.frontmatter.title,
    description: post.markdown.frontmatter.description,
    keywords: post.markdown.frontmatter.seo?.keywords || [],
    openGraph: {
      title: post.markdown.frontmatter.title,
      description: post.markdown.frontmatter.description,
      type: 'article',
      publishedTime: post.markdown.frontmatter.publishDate,
      authors: [post.markdown.frontmatter.author],
      tags: post.markdown.frontmatter.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.markdown.frontmatter.title,
      description: post.markdown.frontmatter.description,
    },
    alternates: {
      canonical: `/blog/${cleanSlug}`,
      languages: alternates,
    },
  };
}

export async function generateStaticParams() {
  const loader = new ContentLoader();
  const englishSlugs = await loader.getAllEnglishSlugs('blog');
  
  // Generate params for clean English slugs (no language prefix needed)
  const params: Array<{ id: string }> = [];
  
  for (const englishSlug of englishSlugs) {
    // Remove the numbered prefix from the English slug
    const cleanEnglishSlug = SlugMapper.removeNumberedPrefix(englishSlug);
    params.push({ id: cleanEnglishSlug });
  }
  
  return params;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const cleanSlug = SlugMapper.removeNumberedPrefix(resolvedParams.id);

  // Load the blog post
  const loader = new ContentLoader();
  const post = await loader.loadBlogPost(cleanSlug, 'en');

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
    'en',
    3
  );

  // Compute hero image data using centralized ImageMappingService
  const imageMappingService = ImageMappingService.getInstance();
  const heroImageId = imageMappingService.getHeroImage(post.markdown.metadata.slug);
  
  const blogImage = heroImageId ? {
    id: heroImageId,
    alt: `Blog post image for ${post.markdown.frontmatter.title}`,
    url: `/blog/optimized/${heroImageId}-1200w.webp`,
  } : null;

  return (
    <>
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