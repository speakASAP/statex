import { NextRequest, NextResponse } from 'next/server';
import { ContentValidator } from '@/lib/content/ContentValidator';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const contentDir = path.join(process.cwd(), 'src/content');
    const validator = new ContentValidator(contentDir);
    
    const validationReport = await validator.validateAllTranslations();
    
    return NextResponse.json(validationReport);
  } catch (error) {
    console.error('Error generating validation report:', error);
    return NextResponse.json(
      { error: 'Failed to generate validation report' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentDir = path.join(process.cwd(), 'src/content');
    const validator = new ContentValidator(contentDir);
    
    // Generate a fresh validation report
    const validationReport = await validator.validateAllTranslations();
    
    // In a real implementation, you might want to save this report to a database
    // or file system for historical tracking
    
    return NextResponse.json({
      success: true,
      report: validationReport,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating validation report:', error);
    return NextResponse.json(
      { error: 'Failed to generate validation report' },
      { status: 500 }
    );
  }
}