import { NextRequest, NextResponse } from 'next/server';
import { seoValidator } from '@/lib/seo/seoValidator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType');
    
    let report;
    
    if (contentType && ['blog', 'pages', 'services', 'solutions', 'legal'].includes(contentType)) {
      report = await seoValidator.validateContentType(contentType as any);
    } else {
      report = await seoValidator.validateAllContent();
    }
    
    return NextResponse.json({
      success: true,
      report,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('SEO validation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to validate SEO',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, slug, language } = body;
    
    if (!contentType || !slug || !language) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: contentType, slug, language',
        },
        { status: 400 }
      );
    }
    
    const result = await seoValidator.validateContent(contentType, slug, language);
    
    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('SEO validation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to validate SEO',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}