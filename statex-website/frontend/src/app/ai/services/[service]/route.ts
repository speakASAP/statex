import { NextRequest, NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/contentLoader';

export async function GET(
  request: NextRequest,
  { params }: { params: { service: string } }
) {
  try {
    const { service } = params;
    const contentLoader = new ContentLoader();
    
    // Get language from URL or default to English
    const url = new URL(request.url);
    const language = url.searchParams.get('lang') || 'en';
    
    // Load service content
    const serviceContent = await contentLoader.loadContent('services', service, language);
    
    if (!serviceContent) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Return raw markdown for AI consumption
    const response = {
      slug: service,
      language: language,
      title: serviceContent.markdown.frontmatter.title,
      description: serviceContent.markdown.frontmatter.description,
      content: serviceContent.markdown.content,
      metadata: serviceContent.markdown.metadata,
      lastModified: serviceContent.markdown.metadata.lastModified
    };

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'X-Content-Type': 'ai-optimized-markdown'
      }
    });
  } catch (error) {
    console.error('Error serving AI service content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}