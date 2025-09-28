import { ContentLoader } from '@/lib/content/contentLoader';
import { SlugMapper } from '@/lib/content/slugMapper';
import { notFound } from 'next/navigation';

interface LanguageAILegalPageProps {
  params: Promise<{
    lang: string;
    legal: string;
  }>;
}

const SUPPORTED_LANGUAGES = ['cs', 'de', 'fr'];

export async function generateStaticParams() {
  const loader = new ContentLoader();
  const englishSlugs = await loader.getAllEnglishSlugs('legal');
  
  const params: Array<{ lang: string; legal: string }> = [];
  
  for (const englishSlug of englishSlugs) {
    for (const language of SUPPORTED_LANGUAGES) {
      const nativeSlug = loader.getNativeSlug(englishSlug, language);
      params.push({ lang: language, legal: nativeSlug });
    }
  }

  return params;
}

export default async function LanguageAILegalPage({ params }: LanguageAILegalPageProps) {
  const resolvedParams = await params;
  const { lang, legal } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const loader = new ContentLoader();
  const content = await loader.loadLegal(legal, lang);

  if (!content) {
    notFound();
  }

  // Get English slug for cross-referencing
  const englishSlug = loader.getEnglishSlug(legal, lang) || legal;

  // Generate AI-friendly metadata
  const aiMetadata = {
    type: 'legal',
    slug: legal,
    englishSlug: englishSlug,
    language: lang,
    lastModified: content.markdown.metadata.lastModified,
    wordCount: content.markdown.metadata.wordCount,
    readTime: content.markdown.metadata.readTime,
    availableLanguages: await loader.getAvailableLanguages(englishSlug, 'legal'),
    legalNotice: 'This is legal documentation. Please consult with legal professionals for specific advice.',
    jurisdiction: 'European Union / Czech Republic'
  };

  // Generate cross-links to other languages
  const crossLinks = [];
  const allLanguages = ['en', 'cs', 'de', 'fr'];
  
  for (const language of allLanguages) {
    if (language === lang) continue; // Skip current language
    
    const targetSlug = language === 'en' ? englishSlug : SlugMapper.getNativeSlug(englishSlug, language);
    const url = language === 'en' ? `/ai/legal/${targetSlug}` : `/${language}/ai/legal/${targetSlug}`;
    
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
legalNotice: ${aiMetadata.legalNotice}
jurisdiction: ${aiMetadata.jurisdiction}

# Cross-Language Links
${crossLinks.map(link => `- [${link.title}](${link.url})`).join('\n')}

# Important Legal Information
This content is in ${lang.toUpperCase()} language and is provided for informational purposes only.
This does not constitute legal advice. Always consult with qualified legal professionals.
Original English version available at: /ai/legal/${englishSlug}
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