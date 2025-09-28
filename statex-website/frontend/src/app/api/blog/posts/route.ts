import { NextRequest, NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/contentLoader';
import cacheService from '@/lib/caching/CachingService';
import { ImageMappingService } from '@/lib/image/imageMappingService';

const SUPPORTED_LANGUAGES = ['en', 'cs', 'de', 'fr'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';
    
    // Validate language parameter
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    // Use caching for performance
    const cacheKey = `api_blog_posts_${language}`;
    const posts = await cacheService.getOrSet(cacheKey, async () => {
      const loader = new ContentLoader();
      return await loader.loadBlogPosts(language);
    });

    // Use centralized ImageMappingService
    const imageMappingService = ImageMappingService.getInstance();

    // Add image data to posts
    const postsWithImages = posts.map((post: any) => {
      const { markdown } = post;
      const slug = markdown.metadata.slug;
      
      // Get hero image - for all languages, use the English slug since that's what's in the metadata
      const imageId = imageMappingService.getHeroImage(slug);
      
      return {
        ...post,
        blogImage: imageId ? {
          id: imageId,
          alt: `Blog post image for ${markdown.frontmatter.title}`
        } : null
      };
    });

    return NextResponse.json({
      posts: postsWithImages,
      language,
      count: postsWithImages.length
    });

  } catch (error) {
    console.error('Error loading blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to load blog posts' },
      { status: 500 }
    );
  }
} 