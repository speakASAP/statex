# Translation Troubleshooting Guide

## Overview

This guide provides comprehensive troubleshooting solutions for common issues encountered in the StateX multilingual translation system. It covers technical problems, content issues, and workflow challenges with step-by-step resolution procedures.

## Quick Diagnostic Commands

### System Health Check
```bash
# Run comprehensive system validation
npm run content:validate --all

# Check translation completeness
npm run content:check-completeness

# Validate slug mappings
npm run content:validate-slugs

# Test all routes
npm run test:routes --language=all
```

### Content Status Check
```bash
# Generate translation status report
npm run content:translation-report

# Check for missing files
npm run content:find-missing

# Validate frontmatter structure
npm run content:validate-frontmatter

# Check content consistency
npm run content:compare-structure
```

## Common Issues and Solutions

### 1. Missing Translation Files

#### Symptoms
- 404 errors when switching languages
- Content not found errors in logs
- Missing pages in language-specific navigation
- ContentValidator reports missing translations

#### Diagnostic Commands
```bash
# Identify missing translation files
npm run content:find-missing --language=cs,de,fr

# Check specific content type
npm run content:find-missing --type=services --language=cs

# Generate missing file report
npm run content:missing-report --output=missing-translations.json
```

#### Root Causes
1. **New English content without translations**
2. **Deleted translation files**
3. **Incorrect file naming**
4. **Missing directory structure**

#### Resolution Steps

**Step 1: Identify Missing Files**
```bash
# Run missing file detection
npm run content:find-missing --detailed

# Example output:
# Missing translations:
# - cs/services/digital-transformation.md
# - de/solutions/cloud-migration.md
# - fr/legal/privacy-policy.md
```

**Step 2: Create Missing Translation Files**
```bash
# Generate template files for missing translations
npm run content:generate-templates --source=en/services/digital-transformation.md --target=cs,de,fr

# Create directory structure if needed
mkdir -p frontend/src/content/pages/cs/services
mkdir -p frontend/src/content/pages/de/services
mkdir -p frontend/src/content/pages/fr/services
```

**Step 3: Add Content and Metadata**
```markdown
---
title: "Služby digitální transformace"
description: "Komplexní řešení digitální transformace"
publishDate: "2024-01-15"
category: "services"
tags: ["digitální-transformace", "poradenství"]
sourceFile: "en/services/digital-transformation.md"
language: "cs"
lastUpdated: "2024-01-15"
translationStatus: "completed"
---

# Translated content here...
```

**Step 4: Update SlugMapper**
```typescript
// Add slug mapping in SlugMapper.ts
services: {
  'digital-transformation': {
    cs: 'sluzby-digitalni-transformace',
    de: 'digitale-transformationsdienstleistungen',
    fr: 'services-transformation-numerique'
  }
}
```

**Step 5: Validate Resolution**
```bash
# Verify files are created correctly
npm run content:validate --language=cs --type=services

# Test content loading
npm run test:content-loading --slug=digital-transformation --language=cs
```

### 2. Incorrect URL Routing

#### Symptoms
- Language switching redirects to wrong pages
- 404 errors on translated URLs
- Incorrect canonical URLs
- Broken internal links

#### Diagnostic Commands
```bash
# Test URL generation
npm run test:url-generation --language=all

# Validate slug mappings
npm run content:validate-slugs --verbose

# Check route resolution
npm run test:route-resolution --url=/cs/sluzby/digitalni-transformace
```

#### Root Causes
1. **Incorrect slug mappings in SlugMapper**
2. **Missing or malformed native slugs**
3. **Route configuration errors**
4. **Cache invalidation issues**

#### Resolution Steps

**Step 1: Verify Slug Mappings**
```typescript
// Check SlugMapper configuration
import { slugMappings } from '@/lib/content/SlugMapper';

// Verify mapping exists
const mapping = slugMappings.services['digital-transformation'];
console.log('Mapping:', mapping);
// Expected: { cs: 'sluzby-digitalni-transformace', de: '...', fr: '...' }
```

**Step 2: Test Slug Resolution**
```bash
# Test English to native slug conversion
npm run test:slug-conversion --english=digital-transformation --language=cs
# Expected output: sluzby-digitalni-transformace

# Test native to English slug conversion
npm run test:slug-conversion --native=sluzby-digitalni-transformace --language=cs
# Expected output: digital-transformation
```

**Step 3: Fix Slug Mappings**
```typescript
// Update SlugMapper.ts with correct mappings
export const slugMappings = {
  services: {
    'digital-transformation': {
      cs: 'sluzby-digitalni-transformace',  // Correct Czech slug
      de: 'digitale-transformation',        // Correct German slug
      fr: 'transformation-numerique'        // Correct French slug
    }
  }
};
```

**Step 4: Clear Cache and Test**
```bash
# Clear routing cache
npm run cache:clear --type=routing

# Test URL generation
npm run test:url-generation --slug=digital-transformation --language=cs

# Test actual routes
curl http://localhost:3000/cs/sluzby/sluzby-digitalni-transformace
```

### 3. Content Structure Inconsistencies

#### Symptoms
- Different content structure across languages
- Missing sections in translations
- Inconsistent frontmatter fields
- Validation errors in ContentValidator

#### Diagnostic Commands
```bash
# Compare content structure across languages
npm run content:compare-structure --source=en --target=cs,de,fr

# Validate frontmatter consistency
npm run content:validate-frontmatter --cross-language

# Check content hierarchy
npm run content:validate-hierarchy --language=all
```

#### Root Causes
1. **Outdated translations not updated with English changes**
2. **Manual translation errors**
3. **Missing frontmatter fields**
4. **Inconsistent markdown structure**

#### Resolution Steps

**Step 1: Identify Structural Differences**
```bash
# Generate structure comparison report
npm run content:compare-structure --detailed --output=structure-diff.json

# Example output showing missing sections:
# {
#   "en/services/digital-transformation.md": {
#     "sections": ["Overview", "Benefits", "Process", "Pricing"],
#     "headings": 12
#   },
#   "cs/services/sluzby-digitalni-transformace.md": {
#     "sections": ["Overview", "Benefits", "Process"],  // Missing "Pricing"
#     "headings": 9  // Missing 3 headings
#   }
# }
```

**Step 2: Update Translation Structure**
```markdown
<!-- Add missing sections to Czech translation -->
## Ceny

Naše cenové plány jsou navrženy tak, aby vyhovovaly různým potřebám podniků...

### Základní balíček
- Konzultace a analýza
- Základní implementace
- Podpora po dobu 3 měsíců

### Pokročilý balíček
- Komplexní transformace
- Pokročilé integrace
- Podpora po dobu 12 měsíců
```

**Step 3: Validate Frontmatter Consistency**
```yaml
# Ensure all translations have consistent frontmatter
---
title: "Služby digitální transformace"
description: "Komplexní řešení digitální transformace"
publishDate: "2024-01-15"
category: "services"
tags: ["digitální-transformace", "poradenství", "technologie"]
seo:
  metaDescription: "Odborné služby digitální transformace"
  keywords: ["digitální transformace", "modernizace podnikání"]
sourceFile: "en/services/digital-transformation.md"
language: "cs"
lastUpdated: "2024-01-15"
translationStatus: "completed"
---
```

**Step 4: Verify Resolution**
```bash
# Re-run structure comparison
npm run content:compare-structure --source=en/services/digital-transformation.md --target=cs/services/sluzby-digitalni-transformace.md

# Validate frontmatter
npm run content:validate-frontmatter --file=cs/services/sluzby-digitalni-transformace.md
```

### 4. Language Switching Failures

#### Symptoms
- Language switcher redirects to homepage
- Context not preserved during language switch
- Incorrect target language pages
- JavaScript errors in language switching

#### Diagnostic Commands
```bash
# Test language switching functionality
npm run test:language-switching --from=en --to=cs --page=services/digital-transformation

# Check language detection
npm run test:language-detection --url=/cs/sluzby/digitalni-transformace

# Validate language switcher component
npm run test:component --component=LanguageSwitcher
```

#### Root Causes
1. **Missing equivalent content in target language**
2. **Incorrect slug mapping resolution**
3. **JavaScript errors in language switcher**
4. **Cache issues with language detection**

#### Resolution Steps

**Step 1: Test Content Availability**
```bash
# Check if target content exists
npm run content:check-exists --slug=digital-transformation --language=cs
# Should return: true

# Verify slug mapping
npm run content:get-native-slug --english=digital-transformation --language=cs
# Should return: sluzby-digitalni-transformace
```

**Step 2: Debug Language Switcher**
```typescript
// Add debugging to LanguageSwitcher component
export function LanguageSwitcher({ currentLanguage, currentSlug }: Props) {
  const handleLanguageSwitch = async (targetLanguage: string) => {
    console.log('Switching language:', { currentLanguage, targetLanguage, currentSlug });
    
    try {
      // Get target slug for new language
      const targetSlug = await getNativeSlug(currentSlug, targetLanguage);
      console.log('Target slug:', targetSlug);
      
      if (!targetSlug) {
        console.warn('No translation available, redirecting to homepage');
        router.push(`/${targetLanguage}`);
        return;
      }
      
      // Generate target URL
      const targetUrl = generateLocalizedUrl(targetSlug, targetLanguage);
      console.log('Target URL:', targetUrl);
      
      router.push(targetUrl);
    } catch (error) {
      console.error('Language switch error:', error);
      // Fallback to homepage
      router.push(`/${targetLanguage}`);
    }
  };
  
  // Component JSX...
}
```

**Step 3: Fix Missing Translations**
```bash
# If content doesn't exist in target language, create it
npm run content:generate-translation --source=en/services/digital-transformation.md --target=cs

# Update slug mappings if needed
npm run content:update-slug-mapping --english=digital-transformation --czech=sluzby-digitalni-transformace
```

**Step 4: Test Language Switching**
```bash
# Test end-to-end language switching
npm run test:e2e --test=language-switching

# Test specific language pair
npm run test:language-switch --from=en --to=cs --page=services/digital-transformation
```

### 5. SEO and Metadata Issues

#### Symptoms
- Missing or incorrect meta tags
- Broken hreflang implementation
- Duplicate content issues
- Poor search engine indexing

#### Diagnostic Commands
```bash
# Validate SEO metadata
npm run seo:validate --language=all

# Check hreflang implementation
npm run seo:validate-hreflang --page=services/digital-transformation

# Test meta tag generation
npm run seo:test-meta-tags --language=cs --page=services/digital-transformation
```

#### Root Causes
1. **Missing SEO frontmatter in translations**
2. **Incorrect hreflang URL generation**
3. **Duplicate or missing canonical URLs**
4. **Inconsistent meta descriptions across languages**

#### Resolution Steps

**Step 1: Validate SEO Frontmatter**
```yaml
# Ensure complete SEO metadata in all translations
seo:
  metaDescription: "Odborné služby digitální transformace pro modernizaci vašich obchodních operací"
  keywords: ["digitální transformace", "modernizace podnikání", "technologické poradenství"]
  canonicalUrl: "/cs/sluzby/sluzby-digitalni-transformace"
  ogTitle: "Služby digitální transformace | StateX"
  ogDescription: "Komplexní řešení digitální transformace pro moderní podniky"
  ogImage: "/images/services/digital-transformation-cs.jpg"
```

**Step 2: Fix Hreflang Implementation**
```typescript
// Ensure proper hreflang generation
export function generateHreflangTags(englishSlug: string, contentType: string) {
  const languages = ['en', 'cs', 'de', 'fr'];
  const hreflangTags = [];
  
  for (const lang of languages) {
    const nativeSlug = getNativeSlug(englishSlug, lang);
    if (nativeSlug) {
      const url = lang === 'en' 
        ? `/${contentType}/${englishSlug}`
        : `/${lang}/${getLocalizedContentType(contentType, lang)}/${nativeSlug}`;
      
      hreflangTags.push({
        hreflang: lang,
        href: `https://statex.cz${url}`
      });
    }
  }
  
  return hreflangTags;
}
```

**Step 3: Test SEO Implementation**
```bash
# Test meta tag generation
curl -s http://localhost:3000/cs/sluzby/sluzby-digitalni-transformace | grep -E '<meta|<link.*hreflang'

# Validate structured data
npm run seo:validate-structured-data --language=cs --page=services/digital-transformation
```

### 6. Performance Issues

#### Symptoms
- Slow content loading in specific languages
- High memory usage during content processing
- Cache misses for translated content
- Timeout errors on language switching

#### Diagnostic Commands
```bash
# Test content loading performance
npm run test:performance --language=all --content-type=services

# Check cache effectiveness
npm run cache:stats --language=cs

# Monitor memory usage
npm run monitor:memory --during=content-loading
```

#### Root Causes
1. **Inefficient content loading for translations**
2. **Missing or ineffective caching**
3. **Large content files without optimization**
4. **Concurrent loading bottlenecks**

#### Resolution Steps

**Step 1: Optimize Content Loading**
```typescript
// Implement efficient content loading with caching
export class OptimizedContentLoader {
  private cache = new Map<string, ProcessedContent>();
  
  async loadContent(contentType: string, slug: string, language: string): Promise<ProcessedContent> {
    const cacheKey = `${contentType}:${slug}:${language}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    // Load and process content
    const content = await this.processContent(contentType, slug, language);
    
    // Cache the result
    this.cache.set(cacheKey, content);
    
    return content;
  }
  
  // Implement cache invalidation
  invalidateCache(contentType?: string, language?: string) {
    if (!contentType && !language) {
      this.cache.clear();
      return;
    }
    
    for (const [key] of this.cache) {
      if (key.includes(`${contentType}:`) || key.endsWith(`:${language}`)) {
        this.cache.delete(key);
      }
    }
  }
}
```

**Step 2: Implement Content Preloading**
```typescript
// Preload common content during language switching
export async function preloadLanguageContent(targetLanguage: string) {
  const commonPages = ['home', 'about', 'contact'];
  const preloadPromises = commonPages.map(page => 
    loadContent('pages', page, targetLanguage)
  );
  
  // Preload in background
  Promise.all(preloadPromises).catch(console.error);
}
```

**Step 3: Optimize Content Files**
```bash
# Compress large content files
npm run content:optimize --language=all

# Generate optimized images for each language
npm run images:optimize --language-specific

# Minify content where appropriate
npm run content:minify --preserve-structure
```

## Advanced Troubleshooting

### 1. Debug Mode Activation

#### Enable Comprehensive Logging
```bash
# Set debug environment variables
export DEBUG=content:*,translation:*,routing:*
export LOG_LEVEL=debug

# Start application with debug logging
npm run dev:debug
```

#### Content Loading Debug
```typescript
// Add debug logging to ContentLoader
export class ContentLoader {
  async loadContent(contentType: string, slug: string, language: string) {
    console.debug(`Loading content: ${contentType}/${slug} (${language})`);
    
    try {
      const startTime = Date.now();
      const content = await this.processContent(contentType, slug, language);
      const loadTime = Date.now() - startTime;
      
      console.debug(`Content loaded successfully in ${loadTime}ms`);
      return content;
    } catch (error) {
      console.error(`Content loading failed: ${error.message}`);
      throw error;
    }
  }
}
```

### 2. Automated Issue Detection

#### Content Validation Script
```bash
#!/bin/bash
# comprehensive-validation.sh

echo "Running comprehensive content validation..."

# Check translation completeness
npm run content:validate --all > validation-report.txt

# Check for broken links
npm run content:validate-links --cross-language >> validation-report.txt

# Validate SEO metadata
npm run seo:validate --all >> validation-report.txt

# Check performance
npm run test:performance --all >> validation-report.txt

echo "Validation complete. Check validation-report.txt for results."
```

#### Automated Health Monitoring
```typescript
// health-monitor.ts
export class HealthMonitor {
  async runHealthCheck(): Promise<HealthReport> {
    const checks = [
      this.checkTranslationCompleteness(),
      this.checkRouteHealth(),
      this.checkCacheEffectiveness(),
      this.checkPerformanceMetrics()
    ];
    
    const results = await Promise.allSettled(checks);
    
    return {
      timestamp: new Date().toISOString(),
      overall: results.every(r => r.status === 'fulfilled') ? 'healthy' : 'issues',
      checks: results.map((result, index) => ({
        name: ['translations', 'routes', 'cache', 'performance'][index],
        status: result.status,
        details: result.status === 'fulfilled' ? result.value : result.reason
      }))
    };
  }
}
```

### 3. Emergency Recovery Procedures

#### Content Rollback
```bash
# Rollback to previous content version
git checkout HEAD~1 -- frontend/src/content/

# Regenerate content cache
npm run cache:regenerate

# Validate rollback
npm run content:validate --quick
```

#### Cache Reset
```bash
# Clear all caches
npm run cache:clear --all

# Regenerate content cache
npm run cache:regenerate --language=all

# Warm up cache with common content
npm run cache:warmup --pages=home,about,services
```

#### Route Recovery
```bash
# Reset route configuration
npm run routes:reset

# Regenerate slug mappings
npm run content:regenerate-slugs

# Test all routes
npm run test:routes --comprehensive
```

## Prevention Strategies

### 1. Automated Testing
```bash
# Set up continuous validation
npm run test:content --watch

# Automated translation validation
npm run content:validate --schedule=daily

# Performance monitoring
npm run monitor:performance --continuous
```

### 2. Content Quality Gates
```typescript
// Pre-commit hook for content validation
export async function validateBeforeCommit() {
  const validationResults = await runContentValidation();
  
  if (validationResults.hasErrors) {
    console.error('Content validation failed. Commit blocked.');
    console.error(validationResults.errors);
    process.exit(1);
  }
  
  console.log('Content validation passed. Commit allowed.');
}
```

### 3. Monitoring and Alerting
```typescript
// Set up monitoring alerts
export const monitoringConfig = {
  translationCompleteness: {
    threshold: 95, // Alert if below 95% complete
    frequency: 'daily'
  },
  performanceMetrics: {
    maxLoadTime: 2000, // Alert if load time > 2s
    frequency: 'hourly'
  },
  errorRates: {
    maxErrorRate: 1, // Alert if error rate > 1%
    frequency: 'realtime'
  }
};
```

## Support and Escalation

### 1. Issue Classification
- **Critical**: Site-breaking issues affecting all languages
- **High**: Issues affecting specific languages or major features
- **Medium**: Performance or usability issues
- **Low**: Minor inconsistencies or optimization opportunities

### 2. Escalation Procedures
1. **Level 1**: Automated detection and basic troubleshooting
2. **Level 2**: Manual investigation and advanced troubleshooting
3. **Level 3**: Developer intervention and code changes
4. **Level 4**: Architecture review and system redesign

### 3. Documentation Updates
- Update this guide when new issues are discovered
- Document all resolution procedures
- Maintain knowledge base of common problems
- Regular review and improvement of troubleshooting procedures