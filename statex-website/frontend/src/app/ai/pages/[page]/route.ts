import { NextRequest, NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/contentLoader';

export async function GET(
  request: NextRequest,
  { params }: { params: { page: string } }
) {
  try {
    const { page } = params;
    const contentLoader = new ContentLoader();
    
    // Get language from URL or default to English
    const url = new URL(request.url);
    const language = url.searchParams.get('lang') || 'en';
    
    // Load page content
    const pageContent = await contentLoader.loadContent('pages', page, language);
    
    if (!pageContent) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Return raw markdown for AI consumption
    const response = {
      slug: page,
      language: language,
      title: pageContent.markdown.frontmatter.title,
      description: pageContent.markdown.frontmatter.description,
      content: pageContent.markdown.content,
      metadata: pageContent.markdown.metadata,
      lastModified: pageContent.markdown.metadata.lastModified
    };

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'X-Content-Type': 'ai-optimized-markdown',
        'X-Content-Language': language
      }
    });
  } catch (error) {
    console.error('Error serving AI page content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}