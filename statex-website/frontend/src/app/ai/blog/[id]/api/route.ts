import { NextRequest, NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/contentLoader';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const contentLoader = new ContentLoader();
    
    // Get language from URL or default to English
    const url = new URL(request.url);
    const language = url.searchParams.get('lang') || 'en';
    
    // Load blog post content
    const blogContent = await contentLoader.loadContent('blog', id, language);
    
    if (!blogContent) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Return raw markdown for AI consumption
    const response = {
      slug: id,
      language: language,
      title: blogContent.markdown.frontmatter.title,
      description: blogContent.markdown.frontmatter.description,
      content: blogContent.markdown.content,
      metadata: blogContent.markdown.metadata,
      author: blogContent.markdown.frontmatter.author,
      date: blogContent.markdown.frontmatter.date,
      category: blogContent.markdown.frontmatter.category,
      tags: blogContent.markdown.frontmatter.tags,
      lastModified: blogContent.markdown.metadata.lastModified
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
    console.error('Error serving AI blog content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}