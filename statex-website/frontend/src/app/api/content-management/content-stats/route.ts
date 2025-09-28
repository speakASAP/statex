import { NextRequest, NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/contentLoader';
import { ContentType } from '@/lib/content/types';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const contentDir = path.join(process.cwd(), 'src/content');
    const contentLoader = new ContentLoader(contentDir);
    
    const contentTypes: ContentType[] = ['blog', 'pages', 'services', 'solutions', 'legal'];
    const languages = ['en', 'cs', 'de', 'fr'];
    
    const stats = {
      totalContent: 0,
      byContentType: {} as Record<ContentType, number>,
      byLanguage: {} as Record<string, number>,
      translationCompleteness: 0
    };
    
    // Initialize counters
    for (const contentType of contentTypes) {
      stats.byContentType[contentType] = 0;
    }
    
    for (const language of languages) {
      stats.byLanguage[language] = 0;
    }
    
    // Count content by type and language
    let totalPossibleTranslations = 0;
    let actualTranslations = 0;
    
    for (const contentType of contentTypes) {
      // Get English content count (source of truth)
      const englishContent = await contentLoader.loadAllContent(contentType, 'en');
      const englishCount = englishContent.length;
      
      if (englishCount > 0) {
        stats.byContentType[contentType] = englishCount;
        stats.totalContent += englishCount;
        
        // For each English piece, check translations
        for (const language of languages) {
          const languageContent = await contentLoader.loadAllContent(contentType, language);
          const languageCount = languageContent.length;
          
          if (language === 'en') {
            stats.byLanguage[language] += languageCount;
            actualTranslations += languageCount;
            totalPossibleTranslations += languageCount;
          } else {
            stats.byLanguage[language] += languageCount;
            actualTranslations += languageCount;
            totalPossibleTranslations += englishCount; // Each English piece should have a translation
          }
        }
      }
    }
    
    // Calculate translation completeness
    stats.translationCompleteness = totalPossibleTranslations > 0 
      ? Math.round((actualTranslations / totalPossibleTranslations) * 100)
      : 0;
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error generating content statistics:', error);
    return NextResponse.json(
      { error: 'Failed to generate content statistics' },
      { status: 500 }
    );
  }
}