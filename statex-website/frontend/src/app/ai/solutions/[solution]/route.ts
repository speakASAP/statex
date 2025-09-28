import { NextRequest, NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/contentLoader';

export async function GET(
  request: NextRequest,
  { params }: { params: { solution: string } }
) {
  try {
    const { solution } = params;
    const contentLoader = new ContentLoader();
    
    // Get language from URL or default to English
    const url = new URL(request.url);
    const language = url.searchParams.get('lang') || 'en';
    
    // Load solution content
    const solutionContent = await contentLoader.loadContent('solutions', solution, language);
    
    if (!solutionContent) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }

    // Return raw markdown for AI consumption
    const response = {
      slug: solution,
      language: language,
      title: solutionContent.markdown.frontmatter.title,
      description: solutionContent.markdown.frontmatter.description,
      content: solutionContent.markdown.content,
      metadata: solutionContent.markdown.metadata,
      lastModified: solutionContent.markdown.metadata.lastModified
    };

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'X-Content-Type': 'ai-optimized-markdown'
      }
    });
  } catch (error) {
    console.error('Error serving AI solution content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}