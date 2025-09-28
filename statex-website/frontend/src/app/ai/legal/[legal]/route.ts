import { NextRequest, NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/contentLoader';

export async function GET(
  request: NextRequest,
  { params }: { params: { legal: string } }
) {
  try {
    const { legal } = params;
    const contentLoader = new ContentLoader();
    
    // Get language from URL or default to English
    const url = new URL(request.url);
    const language = url.searchParams.get('lang') || 'en';
    
    // Load legal content
    const legalContent = await contentLoader.loadContent('legal', legal, language);
    
    if (!legalContent) {
      return NextResponse.json(
        { error: 'Legal document not found' },
        { status: 404 }
      );
    }

    // Return raw markdown for AI consumption
    const response = {
      slug: legal,
      language: language,
      title: legalContent.markdown.frontmatter.title,
      description: legalContent.markdown.frontmatter.description,
      content: legalContent.markdown.content,
      metadata: legalContent.markdown.metadata,
      lastModified: legalContent.markdown.metadata.lastModified
    };

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'X-Content-Type': 'ai-optimized-markdown'
      }
    });
  } catch (error) {
    console.error('Error serving AI legal content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}