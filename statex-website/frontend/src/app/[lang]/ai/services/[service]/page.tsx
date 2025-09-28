import { ContentLoader } from '@/lib/content/contentLoader';
import { SlugMapper } from '@/lib/content/slugMapper';
import { notFound } from 'next/navigation';

interface LanguageAIServicePageProps {
  params: Promise<{
    lang: string;
    service: string;
  }>;
}

const SUPPORTED_LANGUAGES = ['cs', 'de', 'fr'];

export async function generateStaticParams() {
  const loader = new ContentLoader();
  const englishSlugs = await loader.getAllEnglishSlugs('services');
  
  const params: Array<{ lang: string; service: string }> = [];
  
  for (const englishSlug of englishSlugs) {
    for (const language of SUPPORTED_LANGUAGES) {
      const nativeSlug = loader.getNativeSlug(englishSlug, language);
      params.push({ lang: language, service: nativeSlug });
    }
  }

  return params;
}

export default async function LanguageAIServicePage({ params }: LanguageAIServicePageProps) {
  const resolvedParams = await params;
  const { lang, service } = resolvedParams;
  
  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const loader = new ContentLoader();
  const content = await loader.loadService(service, lang);

  if (!content) {
    notFound();
  }

  // Get English slug for cross-referencing
  const englishSlug = loader.getEnglishSlug(service, lang) || service;

  // Generate AI-friendly metadata
  const aiMetadata = {
    type: 'service',
    slug: service,
    englishSlug: englishSlug,
    language: lang,
    lastModified: content.markdown.metadata.lastModified,
    wordCount: content.markdown.metadata.wordCount,
    readTime: content.markdown.metadata.readTime,
    availableLanguages: await loader.getAvailableLanguages(englishSlug, 'services'),
    serviceArea: 'European Union',
    businessType: 'B2B Technology Services'
  };

  // Generate cross-links to other languages
  const crossLinks = [];
  const allLanguages = ['en', 'cs', 'de', 'fr'];
  
  for (const language of allLanguages) {
    if (language === lang) continue; // Skip current language
    
    const targetSlug = language === 'en' ? englishSlug : SlugMapper.getNativeSlug(englishSlug, language);
    const url = language === 'en' ? `/ai/services/${targetSlug}` : `/${language}/ai/services/${targetSlug}`;
    
    crossLinks.push({
      language: language,
      url: url,
      title: `${content.markdown.frontmatter.title} (${language.toUpperCase()})`
    });
  }

  // Generate related services
  const relatedServices = content.relatedContent?.map(related => ({
    title: related.markdown.frontmatter.title,
    slug: related.markdown.metadata.slug,
    type: related.markdown.metadata.contentType,
    url: `/${lang}/ai/${related.markdown.metadata.contentType}/${related.markdown.metadata.slug}`
  })) || [];

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
serviceArea: ${aiMetadata.serviceArea}
businessType: ${aiMetadata.businessType}

# Cross-Language Links
${crossLinks.map(link => `- [${link.title}](${link.url})`).join('\n')}

# Related Services
${relatedServices.map(related => `- [${related.title}](${related.url})`).join('\n')}

# Service Information
This content is in ${lang.toUpperCase()} language.
Service available in: ${aiMetadata.serviceArea}
Original English version available at: /ai/services/${englishSlug}
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