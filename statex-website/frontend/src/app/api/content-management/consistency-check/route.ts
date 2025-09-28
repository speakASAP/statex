import { NextRequest, NextResponse } from 'next/server';
import { ContentConsistencyChecker } from '@/lib/content/ContentConsistencyChecker';
import { ContentType } from '@/lib/content/types';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType') as ContentType | null;
    
    const contentDir = path.join(process.cwd(), 'src/content');
    const checker = new ContentConsistencyChecker(contentDir);
    
    let consistencyReport;
    
    if (contentType) {
      // Check specific content type
      consistencyReport = await checker.checkContentType(contentType);
    } else {
      // Check all content
      consistencyReport = await checker.checkAllContent();
    }
    
    return NextResponse.json(consistencyReport);
  } catch (error) {
    console.error('Error running consistency check:', error);
    return NextResponse.json(
      { error: 'Failed to run consistency check' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, englishSlug, language } = body;
    
    const contentDir = path.join(process.cwd(), 'src/content');
    const checker = new ContentConsistencyChecker(contentDir);
    
    if (englishSlug && contentType && language) {
      // Check single content piece
      const issues = await checker.checkSingleContent(englishSlug, contentType, language);
      return NextResponse.json({
        englishSlug,
        contentType,
        language,
        issues,
        totalIssues: issues.length
      });
    } else {
      return NextResponse.json(
        { error: 'Missing required parameters: englishSlug, contentType, language' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error running single content consistency check:', error);
    return NextResponse.json(
      { error: 'Failed to run consistency check' },
      { status: 500 }
    );
  }
}