import { NextRequest, NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/contentLoader';
import { SlugMapper } from '@/lib/content/slugMapper';

interface RouteParams {
  params: Promise<{ id: string }>;
}

function detectLanguageFromSlug(slug: string): string {
  // Check if the slug matches any native language patterns
  const languages = ['cs', 'de', 'fr'];
  
  for (const lang of languages) {
    // Get all native slugs for this language
    const nativeSlugs = SlugMapper.getAllNativeSlugs(lang);
    if (nativeSlugs.includes(slug)) {
      return lang;
    }
  }
  
  // If no match found, assume English
  return 'en';
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const loader = new ContentLoader();

    // Auto-detect language from the slug
    const detectedLanguage = detectLanguageFromSlug(resolvedParams.id);

    // Load the blog post
    const post = await loader.loadBlogPost(resolvedParams.id, detectedLanguage);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      post,
      language: detectedLanguage,
      success: true
    });

  } catch (error) {
    console.error('Error loading AI blog post:', error);
    return NextResponse.json(
      { error: 'Failed to load blog post' },
      { status: 500 }
    );
  }
} 