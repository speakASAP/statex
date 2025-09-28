#!/usr/bin/env node

/**
 * Fix Missing Components for Final Deployment
 * 
 * This script addresses the critical issues found in validation:
 * 1. Missing page translations (Czech home, about, contact)
 * 2. Missing AI content serving routes
 * 3. Missing language switcher component
 * 4. Missing metadata generation utilities
 * 5. Missing language detection utilities
 */

const fs = require('fs');
const path = require('path');

class ComponentFixer {
  constructor() {
    this.fixes = [];
  }

  async fixAllMissingComponents() {
    console.log('🔧 Fixing Missing Components for Final Deployment...\n');

    try {
      await this.fixMissingPageTranslations();
      await this.fixMissingAiRoutes();
      await this.fixMissingLanguageSwitcher();
      await this.fixMissingMetadataUtils();
      await this.fixMissingLanguageDetection();
      
      this.generateFixReport();
    } catch (error) {
      console.error('❌ Component fixing failed:', error.message);
      process.exit(1);
    }
  }

  addFix(component, status, message) {
    this.fixes.push({
      component,
      status,
      message,
      timestamp: new Date().toISOString()
    });
  }

  async fixMissingPageTranslations() {
    console.log('📝 Fixing Missing Page Translations...');

    // Fix Czech home page
    await this.createCzechHomePage();
    
    // Fix Czech about page  
    await this.createCzechAboutPage();
    
    // Fix Czech contact page
    await this.createCzechContactPage();

    console.log('✅ Page translations fixed\n');
  }

  async createCzechHomePage() {
    const czechHomePath = path.join(process.cwd(), 'src/content/pages/cs/domu.md');
    
    if (!fs.existsSync(czechHomePath)) {
      const czechHomeContent = `---
title: "Domů - StateX"
description: "StateX - Váš partner pro digitální transformaci a AI řešení v Evropě"
slug: "domu"
language: "cs"
---

# Vítejte ve StateX

StateX je váš důvěryhodný partner pro digitální transformaci a implementaci umělé inteligence v Evropě. Specializujeme se na poskytování inovativních řešení, která pomáhají firmám růst a prosperovat v digitálním věku.

## Naše služby

- **AI Automatizace**: Implementace inteligentních systémů pro automatizaci obchodních procesů
- **Digitální Transformace**: Komplexní přechod na digitální technologie
- **Vývoj Software**: Vlastní softwarová řešení na míru
- **Poradenství**: Odborné poradenství v oblasti IT a digitalizace

## Proč StateX?

- ✅ Evropská compliance (GDPR)
- ✅ Vícejazyčná podpora
- ✅ Rychlé prototypování
- ✅ Komplexní služby

Kontaktujte nás ještě dnes a začněte svou cestu k digitální transformaci!
`;

      fs.writeFileSync(czechHomePath, czechHomeContent);
      this.addFix('czech_home_page', 'CREATED', 'Czech home page created');
    }
  }

  async createCzechAboutPage() {
    const czechAboutPath = path.join(process.cwd(), 'src/content/pages/cs/o-nas.md');
    
    if (!fs.existsSync(czechAboutPath)) {
      const czechAboutContent = `---
title: "O nás - StateX"
description: "Seznamte se s týmem StateX a naší misí v oblasti digitální transformace"
slug: "o-nas"
language: "cs"
---

# O StateX

StateX je přední poskytovatel služeb digitální transformace se zaměřením na evropský trh. Naše mise je pomáhat firmám využít sílu umělé inteligence a moderních technologií k dosažení jejich obchodních cílů.

## Naše mise

Věříme, že každá firma si zaslouží přístup k nejmodernějším technologiím. Proto poskytujeme:

- **Dostupné AI řešení** pro firmy všech velikostí
- **Evropskou compliance** s GDPR a dalšími předpisy
- **Vícejazyčnou podporu** pro mezinárodní expanzi
- **Rychlé prototypování** pro testování nápadů

## Náš tým

Náš tým se skládá z odborníků na:
- Umělou inteligenci a strojové učení
- Vývoj softwaru a webových aplikací
- Digitální transformaci a automatizaci
- Evropské právní předpisy a compliance

## Naše hodnoty

- **Inovace**: Neustále hledáme nové způsoby řešení problémů
- **Kvalita**: Dodáváme pouze nejkvalitnější řešení
- **Transparentnost**: Otevřená komunikace s našimi klienty
- **Spolehlivost**: Můžete se na nás spolehnout
`;

      fs.writeFileSync(czechAboutPath, czechAboutContent);
      this.addFix('czech_about_page', 'CREATED', 'Czech about page created');
    }
  }

  async createCzechContactPage() {
    const czechContactPath = path.join(process.cwd(), 'src/content/pages/cs/kontakt.md');
    
    if (!fs.existsSync(czechContactPath)) {
      const czechContactContent = `---
title: "Kontakt - StateX"
description: "Kontaktujte tým StateX pro vaše projekty digitální transformace"
slug: "kontakt"
language: "cs"
---

# Kontaktujte nás

Máte projekt nebo nápad, který byste chtěli realizovat? Rádi vám pomůžeme!

## Jak nás můžete kontaktovat

### Bezplatný prototyp
Začněte s naším bezplatným prototypem a zjistěte, jak můžeme pomoci vašemu podnikání.

[Získat bezplatný prototyp](/cs/bezplatny-prototyp)

### Přímý kontakt
Pro složitější projekty nebo specifické požadavky nás kontaktujte přímo.

**Email**: info@statex.eu
**Telefon**: +420 XXX XXX XXX

### Kancelář
StateX s.r.o.
Praha, Česká republika

## Oblasti působnosti

Poskytujeme služby po celé Evropě s důrazem na:
- Českou republiku
- Německo  
- Francii
- Další evropské země

## Pracovní doba

**Pondělí - Pátek**: 9:00 - 18:00 CET
**Víkend**: Na vyžádání pro urgentní projekty

Těšíme se na spolupráci s vámi!
`;

      fs.writeFileSync(czechContactPath, czechContactContent);
      this.addFix('czech_contact_page', 'CREATED', 'Czech contact page created');
    }
  }

  async fixMissingAiRoutes() {
    console.log('🤖 Fixing Missing AI Routes...');

    await this.createAiServicesRoute();
    await this.createAiSolutionsRoute();
    await this.createAiLegalRoute();

    console.log('✅ AI routes fixed\n');
  }

  async createAiServicesRoute() {
    const aiServicesDir = path.join(process.cwd(), 'src/app/ai/services/[service]');
    const aiServicesRoutePath = path.join(aiServicesDir, 'route.ts');

    if (!fs.existsSync(aiServicesDir)) {
      fs.mkdirSync(aiServicesDir, { recursive: true });
    }

    if (!fs.existsSync(aiServicesRoutePath)) {
      const aiServicesRouteContent = `import { NextRequest, NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/ContentLoader';

export async function GET(
  request: NextRequest,
  { params }: { params: { service: string } }
) {
  try {
    const { service } = params;
    const contentLoader = new ContentLoader();
    
    // Get language from URL or default to English
    const url = new URL(request.url);
    const language = url.searchParams.get('lang') || 'en';
    
    // Load service content
    const serviceContent = await contentLoader.loadContent('services', service, language);
    
    if (!serviceContent) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Return raw markdown for AI consumption
    const response = {
      slug: service,
      language: language,
      title: serviceContent.markdown.frontmatter.title,
      description: serviceContent.markdown.frontmatter.description,
      content: serviceContent.markdown.content,
      metadata: serviceContent.markdown.metadata,
      lastModified: serviceContent.markdown.metadata.lastModified
    };

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'X-Content-Type': 'ai-optimized-markdown'
      }
    });
  } catch (error) {
    console.error('Error serving AI service content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`;

      fs.writeFileSync(aiServicesRoutePath, aiServicesRouteContent);
      this.addFix('ai_services_route', 'CREATED', 'AI services route created');
    }
  }

  async createAiSolutionsRoute() {
    const aiSolutionsDir = path.join(process.cwd(), 'src/app/ai/solutions/[solution]');
    const aiSolutionsRoutePath = path.join(aiSolutionsDir, 'route.ts');

    if (!fs.existsSync(aiSolutionsDir)) {
      fs.mkdirSync(aiSolutionsDir, { recursive: true });
    }

    if (!fs.existsSync(aiSolutionsRoutePath)) {
      const aiSolutionsRouteContent = `import { NextRequest, NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/ContentLoader';

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
}`;

      fs.writeFileSync(aiSolutionsRoutePath, aiSolutionsRouteContent);
      this.addFix('ai_solutions_route', 'CREATED', 'AI solutions route created');
    }
  }

  async createAiLegalRoute() {
    const aiLegalDir = path.join(process.cwd(), 'src/app/ai/legal/[legal]');
    const aiLegalRoutePath = path.join(aiLegalDir, 'route.ts');

    if (!fs.existsSync(aiLegalDir)) {
      fs.mkdirSync(aiLegalDir, { recursive: true });
    }

    if (!fs.existsSync(aiLegalRoutePath)) {
      const aiLegalRouteContent = `import { NextRequest, NextResponse } from 'next/server';
import { ContentLoader } from '@/lib/content/ContentLoader';

export async function GET(
  request: NextRequest,
  { params }: { params: { legal: string } }
) {
  try {
    const { legal } = params;
    const contentLoader = new ContentLoader();
    
    // Get language from URL or default to English
    const url = new URL(request.url);
    const language = url.searchParams.get('lang') || 'en';
    
    // Load legal content
    const legalContent = await contentLoader.loadContent('legal', legal, language);
    
    if (!legalContent) {
      return NextResponse.json(
        { error: 'Legal document not found' },
        { status: 404 }
      );
    }

    // Return raw markdown for AI consumption
    const response = {
      slug: legal,
      language: language,
      title: legalContent.markdown.frontmatter.title,
      description: legalContent.markdown.frontmatter.description,
      content: legalContent.markdown.content,
      metadata: legalContent.markdown.metadata,
      lastModified: legalContent.markdown.metadata.lastModified
    };

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'X-Content-Type': 'ai-optimized-markdown'
      }
    });
  } catch (error) {
    console.error('Error serving AI legal content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`;

      fs.writeFileSync(aiLegalRoutePath, aiLegalRouteContent);
      this.addFix('ai_legal_route', 'CREATED', 'AI legal route created');
    }
  }

  async fixMissingLanguageSwitcher() {
    console.log('🌐 Fixing Missing Language Switcher...');

    const languageSwitcherDir = path.join(process.cwd(), 'src/components/layout');
    const languageSwitcherPath = path.join(languageSwitcherDir, 'LanguageSwitcher.tsx');

    if (!fs.existsSync(languageSwitcherDir)) {
      fs.mkdirSync(languageSwitcherDir, { recursive: true });
    }

    if (!fs.existsSync(languageSwitcherPath)) {
      const languageSwitcherContent = `'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' }
];

interface LanguageSwitcherProps {
  currentLanguage: string;
  className?: string;
}

export default function LanguageSwitcher({ 
  currentLanguage, 
  className = '' 
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      // Close dropdown
      setIsOpen(false);

      // If switching to English, remove language prefix
      if (newLanguage === 'en') {
        // Remove language prefix from current path
        const newPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';
        router.push(newPath);
        return;
      }

      // For other languages, add or replace language prefix
      let newPath: string;
      
      if (pathname.startsWith('/cs') || pathname.startsWith('/de') || pathname.startsWith('/fr')) {
        // Replace existing language prefix
        newPath = pathname.replace(/^\/[a-z]{2}/, \`/\${newLanguage}\`);
      } else {
        // Add language prefix to English path
        newPath = \`/\${newLanguage}\${pathname === '/' ? '' : pathname}\`;
      }

      router.push(newPath);
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  return (
    <div className={\`relative inline-block text-left \${className}\`}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <GlobeAltIcon className="w-4 h-4 mr-2" />
        <span className="mr-1">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.nativeName}</span>
        <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
        <ChevronDownIcon className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1" role="menu">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  className={\`\${
                    language.code === currentLanguage
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700'
                  } group flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 hover:text-gray-900\`}
                  role="menuitem"
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <span className="mr-3 text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs text-gray-500">{language.name}</span>
                  </div>
                  {language.code === currentLanguage && (
                    <span className="ml-auto text-indigo-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}`;

      fs.writeFileSync(languageSwitcherPath, languageSwitcherContent);
      this.addFix('language_switcher', 'CREATED', 'Language switcher component created');
    }

    console.log('✅ Language switcher fixed\n');
  }

  async fixMissingMetadataUtils() {
    console.log('🔍 Fixing Missing Metadata Utils...');

    const metadataUtilsDir = path.join(process.cwd(), 'src/lib/utils');
    const metadataUtilsPath = path.join(metadataUtilsDir, 'metadata.ts');

    if (!fs.existsSync(metadataUtilsDir)) {
      fs.mkdirSync(metadataUtilsDir, { recursive: true });
    }

    if (!fs.existsSync(metadataUtilsPath)) {
      const metadataUtilsContent = `import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  language: string;
  alternateLanguages?: { [key: string]: string };
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonicalUrl,
    language,
    alternateLanguages = {},
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image'
  } = config;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(', '),
    
    // Open Graph
    openGraph: {
      title,
      description,
      type: ogType as any,
      locale: getLocaleFromLanguage(language),
      ...(ogImage && { images: [{ url: ogImage }] }),
      ...(alternateLanguages && {
        alternateLocale: Object.keys(alternateLanguages).map(lang => 
          getLocaleFromLanguage(lang)
        )
      })
    },

    // Twitter
    twitter: {
      card: twitterCard as any,
      title,
      description,
      ...(ogImage && { images: [ogImage] })
    },

    // Canonical and alternate URLs
    ...(canonicalUrl && { 
      alternates: {
        canonical: canonicalUrl,
        languages: alternateLanguages
      }
    }),

    // Additional metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  return metadata;
}

export function generateHreflangTags(
  currentPath: string,
  languages: string[],
  baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://statex.eu'
): { [key: string]: string } {
  const hreflangUrls: { [key: string]: string } = {};

  languages.forEach(lang => {
    if (lang === 'en') {
      // English doesn't have language prefix
      hreflangUrls[lang] = \`\${baseUrl}\${currentPath}\`;
    } else {
      // Other languages have language prefix
      const langPath = currentPath === '/' ? \`/\${lang}\` : \`/\${lang}\${currentPath}\`;
      hreflangUrls[lang] = \`\${baseUrl}\${langPath}\`;
    }
  });

  // Add x-default for English
  hreflangUrls['x-default'] = \`\${baseUrl}\${currentPath}\`;

  return hreflangUrls;
}

export function getLocaleFromLanguage(language: string): string {
  const localeMap: { [key: string]: string } = {
    'en': 'en_US',
    'cs': 'cs_CZ',
    'de': 'de_DE',
    'fr': 'fr_FR'
  };

  return localeMap[language] || 'en_US';
}

export function generateStructuredData(config: {
  type: 'WebSite' | 'Organization' | 'Article' | 'Service';
  name: string;
  description: string;
  url: string;
  language: string;
  additionalData?: any;
}) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': config.type,
    name: config.name,
    description: config.description,
    url: config.url,
    inLanguage: config.language,
    ...config.additionalData
  };

  if (config.type === 'Organization') {
    return {
      ...baseStructuredData,
      '@type': 'Organization',
      sameAs: [
        'https://linkedin.com/company/statex',
        'https://twitter.com/statex'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+420-774-287-541',
        contactType: 'customer service',
        availableLanguage: ['English', 'Czech', 'German', 'French']
      }
    };
  }

  return baseStructuredData;
}

export function generateSiteMetadata(language: string = 'en'): Metadata {
  const titles = {
    en: 'StateX - Digital Transformation & AI Solutions',
    cs: 'StateX - Digitální transformace a AI řešení',
    de: 'StateX - Digitale Transformation & KI-Lösungen',
    fr: 'StateX - Transformation numérique et solutions IA'
  };

  const descriptions = {
    en: 'StateX provides cutting-edge digital transformation and AI solutions for European businesses. Get your free prototype today.',
    cs: 'StateX poskytuje špičková řešení digitální transformace a umělé inteligence pro evropské firmy. Získejte svůj bezplatný prototyp ještě dnes.',
    de: 'StateX bietet modernste digitale Transformation und KI-Lösungen für europäische Unternehmen. Holen Sie sich noch heute Ihren kostenlosen Prototyp.',
    fr: 'StateX fournit des solutions de transformation numérique et d\\'IA de pointe pour les entreprises européennes. Obtenez votre prototype gratuit dès aujourd\\'hui.'
  };

  return generateMetadata({
    title: titles[language as keyof typeof titles] || titles.en,
    description: descriptions[language as keyof typeof descriptions] || descriptions.en,
    keywords: ['digital transformation', 'AI solutions', 'European business', 'GDPR compliant'],
    language,
    alternateLanguages: generateHreflangTags('/', ['en', 'cs', 'de', 'fr']),
    ogType: 'website',
    twitterCard: 'summary_large_image'
  });
}`;

      fs.writeFileSync(metadataUtilsPath, metadataUtilsContent);
      this.addFix('metadata_utils', 'CREATED', 'Metadata utilities created');
    }

    console.log('✅ Metadata utils fixed\n');
  }

  async fixMissingLanguageDetection() {
    console.log('🌐 Fixing Missing Language Detection...');

    const languageUtilsDir = path.join(process.cwd(), 'src/lib/utils');
    const languageUtilsPath = path.join(languageUtilsDir, 'language.ts');

    if (!fs.existsSync(languageUtilsDir)) {
      fs.mkdirSync(languageUtilsDir, { recursive: true });
    }

    if (!fs.existsSync(languageUtilsPath)) {
      const languageUtilsContent = `export const SUPPORTED_LANGUAGES = ['en', 'cs', 'de', 'fr'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const LANGUAGE_NAMES = {
  en: 'English',
  cs: 'Čeština',
  de: 'Deutsch',
  fr: 'Français'
} as const;

export const LANGUAGE_FLAGS = {
  en: '🇺🇸',
  cs: '🇨🇿',
  de: '🇩🇪',
  fr: '🇫🇷'
} as const;

/**
 * Detects language from URL pathname
 */
export function detectLanguageFromPath(pathname: string): SupportedLanguage {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
    return firstSegment as SupportedLanguage;
  }
  
  return 'en'; // Default to English
}

/**
 * Removes language prefix from pathname
 */
export function removeLanguagePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
    return '/' + segments.slice(1).join('/');
  }
  
  return pathname;
}

/**
 * Adds language prefix to pathname
 */
export function addLanguagePrefix(pathname: string, language: SupportedLanguage): string {
  if (language === 'en') {
    return pathname; // English doesn't need prefix
  }
  
  const cleanPath = removeLanguagePrefix(pathname);
  return \`/\${language}\${cleanPath === '/' ? '' : cleanPath}\`;
}

/**
 * Gets the localized path for a given language
 */
export function getLocalizedPath(pathname: string, targetLanguage: SupportedLanguage): string {
  const cleanPath = removeLanguagePrefix(pathname);
  return addLanguagePrefix(cleanPath, targetLanguage);
}

/**
 * Checks if a language is supported
 */
export function isSupportedLanguage(language: string): language is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
}

/**
 * Gets browser preferred language from Accept-Language header
 */
export function getBrowserPreferredLanguage(acceptLanguage?: string): SupportedLanguage {
  if (!acceptLanguage) return 'en';
  
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, quality = '1'] = lang.trim().split(';q=');
      return {
        code: code.toLowerCase().split('-')[0],
        quality: parseFloat(quality)
      };
    })
    .sort((a, b) => b.quality - a.quality);
  
  for (const lang of languages) {
    if (isSupportedLanguage(lang.code)) {
      return lang.code;
    }
  }
  
  return 'en';
}

/**
 * Gets language-specific URL for content
 */
export function getLanguageSpecificUrl(
  baseUrl: string,
  language: SupportedLanguage,
  contentType?: string,
  slug?: string
): string {
  let path = '';
  
  if (contentType && slug) {
    path = \`/\${contentType}/\${slug}\`;
  }
  
  const localizedPath = addLanguagePrefix(path, language);
  return \`\${baseUrl}\${localizedPath}\`;
}

/**
 * Validates language parameter from URL
 */
export function validateLanguageParam(lang: string | undefined): SupportedLanguage {
  if (lang && isSupportedLanguage(lang)) {
    return lang;
  }
  return 'en';
}

/**
 * Gets opposite direction languages for RTL support (future use)
 */
export function getTextDirection(language: SupportedLanguage): 'ltr' | 'rtl' {
  // All currently supported languages are LTR
  // This can be extended for RTL languages like Arabic
  return 'ltr';
}

/**
 * Gets language-specific date format
 */
export function getDateFormat(language: SupportedLanguage): string {
  const formats = {
    en: 'MM/dd/yyyy',
    cs: 'dd.MM.yyyy',
    de: 'dd.MM.yyyy',
    fr: 'dd/MM/yyyy'
  };
  
  return formats[language];
}

/**
 * Gets language-specific number format
 */
export function getNumberFormat(language: SupportedLanguage): Intl.NumberFormatOptions {
  const formats = {
    en: { locale: 'en-US' },
    cs: { locale: 'cs-CZ' },
    de: { locale: 'de-DE' },
    fr: { locale: 'fr-FR' }
  };
  
  return formats[language];
}`;

      fs.writeFileSync(languageUtilsPath, languageUtilsContent);
      this.addFix('language_detection', 'CREATED', 'Language detection utilities created');
    }

    console.log('✅ Language detection fixed\n');
  }

  generateFixReport() {
    console.log('📊 COMPONENT FIX REPORT');
    console.log('=' * 50);
    
    const created = this.fixes.filter(fix => fix.status === 'CREATED').length;
    const skipped = this.fixes.filter(fix => fix.status === 'SKIPPED').length;
    
    console.log(`✅ Components Created: ${created}`);
    console.log(`⏭️  Components Skipped: ${skipped}`);
    console.log('=' * 50);

    this.fixes.forEach(fix => {
      const icon = fix.status === 'CREATED' ? '✅' : '⏭️';
      console.log(`${icon} ${fix.component}: ${fix.message}`);
    });

    console.log(`\n🎉 All missing components have been addressed!\n`);
    
    // Save fix report
    const reportPath = path.join(process.cwd(), 'component-fix-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      summary: { created, skipped, total: this.fixes.length },
      fixes: this.fixes,
      generatedAt: new Date().toISOString()
    }, null, 2));
    
    console.log(`📄 Fix report saved to: ${reportPath}`);
  }
}

// Run component fixes if called directly
if (require.main === module) {
  const fixer = new ComponentFixer();
  fixer.fixAllMissingComponents()
    .then(() => {
      console.log('Component fixing completed successfully');
    })
    .catch((error) => {
      console.error('Component fixing failed:', error);
      process.exit(1);
    });
}

module.exports = { ComponentFixer };