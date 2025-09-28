import { ContentLoader } from '@/lib/content/contentLoader';
import { SlugMapper } from '@/lib/content/slugMapper';
import { notFound } from 'next/navigation';

interface LanguageAISolutionPageProps {
  params: Promise<{
    lang: string;
    solution: string;
  }>;
}

const SUPPORTED_LANGUAGES = ['cs', 'de', 'fr'];

export async function generateStaticParams() {
  const loader = new ContentLoader();
  const englishSlugs = await loader.getAllEnglishSlugs('solutions');
  
  const params: Array<{ lang: string; solution: string }> = [];
  
  for (const englishSlug of englishSlugs) {
    for (const language of SUPPORTED_LANGUAGES) {
      const nativeSlug = loader.getNativeSlug(englishSlug, language);
      params.push({ lang: language, solution: nativeSlug });
    }
  }

  return params;
}

export default async function LanguageAISolutionPage({ params }: LanguageAISolutionPageProps) {
  const resolvedParams = await params;
  const { lang, solution } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const loader = new ContentLoader();
  const content = await loader.loadSolution(solution, lang);

  if (!content) {
    notFound();
  }

  // Get English slug for cross-referencing
  const englishSlug = loader.getEnglishSlug(solution, lang) || solution;

  // Generate AI-friendly metadata
  const aiMetadata = {
    type: 'solution',
    slug: solution,
    englishSlug: englishSlug,
    language: lang,
    lastModified: content.markdown.metadata.lastModified,
    wordCount: content.markdown.metadata.wordCount,
    readTime: content.markdown.metadata.readTime,
    availableLanguages: await loader.getAvailableLanguages(englishSlug, 'solutions')
  };

  // Generate cross-links to other languages
  const crossLinks = [];
  const allLanguages = ['en', 'cs', 'de', 'fr'];
  
  for (const language of allLanguages) {
    if (language === lang) continue; // Skip current language
    
    const targetSlug = language === 'en' ? englishSlug : SlugMapper.getNativeSlug(englishSlug, language);
    const url = language === 'en' ? `/ai/solutions/${targetSlug}` : `/${language}/ai/solutions/${targetSlug}`;
    
    crossLinks.push({
      language: language,
      url: url,
      title: `${content.markdown.frontmatter.title} (${language.toUpperCase()})`
    });
  }

  // Return raw markdown content with metadata for AI consumption
  const aiContent = `---
# AI-Friendly Content Metadata
type: ${aiMetadata.type}
slug: ${aiMetadata.slug}
englishSlug: ${aiMetadata.englishSlug}
language: ${aiMetadata.language}
lastModified: ${aiMetadata.lastModified}
wordCount: ${aiMetadata.wordCount}
readTime: ${aiMetadata.readTime}
availableLanguages: [${aiMetadata.availableLanguages.join(', ')}]

# Cross-Language Links
${crossLinks.map(link => `- [${link.title}](${link.url})`).join('\n')}

# Language Information
This content is in ${lang.toUpperCase()} language.
Original English version available at: /ai/solutions/${englishSlug}
---

${content.markdown.content}`;

  return (
    <div className="ai-content">
      <pre style={{ 
        whiteSpace: 'pre-wrap', 
        fontFamily: 'monospace',
        fontSize: '14px',
        lineHeight: '1.5',
        margin: 0,
        padding: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        {aiContent}
      </pre>
    </div>
  );
}