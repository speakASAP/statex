import { NextRequest, NextResponse } from 'next/server';
import { ContentValidator } from '@/lib/content/ContentValidator';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const contentDir = path.join(process.cwd(), 'src/content');
    const validator = new ContentValidator(contentDir);
    
    const missingTranslationReport = await validator.generateMissingTranslationReport();
    
    // Group by content type for better organization
    const groupedReport = missingTranslationReport.reduce((acc, item) => {
      if (!acc[item.contentType]) {
        acc[item.contentType] = {
          contentType: item.contentType,
          missingTranslations: [],
          totalMissing: 0
        };
      }
      
      acc[item.contentType].missingTranslations.push({
        englishSlug: item.englishSlug,
        missingLanguages: item.missingLanguages,
        englishFilePath: item.englishFilePath,
        expectedPaths: item.expectedPaths
      });
      
      acc[item.contentType].totalMissing += item.missingLanguages.length;
      
      return acc;
    }, {} as Record<string, any>);
    
    return NextResponse.json(Object.values(groupedReport));
  } catch (error) {
    console.error('Error generating missing translations report:', error);
    return NextResponse.json(
      { error: 'Failed to generate missing translations report' },
      { status: 500 }
    );
  }
}