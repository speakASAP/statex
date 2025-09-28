# Multilingual Content Management Guidelines

## Overview

This document provides comprehensive guidelines for managing multilingual content in the StateX website system. The system uses English markdown files as the single source of truth, with translations derived from these authoritative sources.

## Core Principles

### 1. English as Single Source of Truth
- All content originates from English markdown files
- English files contain the authoritative structure, metadata, and content
- All translations are derived from and reference English source files
- Changes must be made to English files first, then propagated to translations

### 2. Markdown-First Approach
- All content is stored in markdown format for consistency and version control
- Frontmatter contains structured metadata for SEO and organization
- Raw markdown is served to AI crawlers for optimal indexing
- Processed HTML is served to human users with full styling

### 3. Dual Content Serving Strategy
- **AI Routes**: `/ai/` and `/{lang}/ai/` serve raw markdown for fast AI indexing
- **Human Routes**: Standard routes serve fully rendered HTML with styling
- This approach optimizes both SEO performance and user experience

## Content Structure

### Directory Organization

```
frontend/src/content/
├── blog/                    # Blog content (complete - 48 files)
│   ├── en/                  # 12 English source posts (AUTHORITATIVE)
│   ├── cs/                  # 12 Czech translations
│   ├── de/                  # 12 German translations
│   └── fr/                  # 12 French translations
├── pages/                   # Page content (target - 160 files)
│   ├── en/                  # English source files (AUTHORITATIVE)
│   │   ├── home.md          # Homepage content
│   │   ├── about.md         # About page content
│   │   ├── contact.md       # Contact page content
│   │   ├── services/        # 11 service files
│   │   ├── solutions/       # 10 solution files
│   │   └── legal/           # 13 legal files
│   ├── cs/                  # Czech translations (40 files)
│   ├── de/                  # German translations (40 files)
│   └── fr/                  # French translations (40 files)
└── translations/            # Component translations
    ├── header.ts
    ├── footer.ts
    └── common.ts
```

### File Naming Conventions

#### English Source Files (Authoritative)
- Use descriptive, SEO-friendly names in English
- Examples: `digital-transformation.md`, `gdpr-compliance.md`, `privacy-policy.md`
- These names become the canonical reference for all translations

#### Translation Files
- Use native language slugs that are culturally appropriate
- Examples:
  - Czech: `digitalni-transformace.md`, `gdpr-soulad.md`, `zasady-ochrany-soukromi.md`
  - German: `digitale-transformation.md`, `gdpr-konformitaet.md`, `datenschutzrichtlinie.md`
  - French: `transformation-numerique.md`, `conformite-gdpr.md`, `politique-confidentialite.md`

## Content Creation Workflow

### 1. Creating New Content

#### Step 1: Create English Source File
```bash
# Create new service content
touch frontend/src/content/pages/en/services/new-service.md
```

#### Step 2: Add Required Frontmatter
```yaml
---
title: "Service Title"
description: "Brief description for SEO"
publishDate: "2024-01-15"
category: "services"
tags: ["tag1", "tag2"]
seo:
  metaDescription: "SEO meta description"
  keywords: ["keyword1", "keyword2"]
translations:
  cs:
    title: "Czech Title"
    description: "Czech description"
    slug: "czech-slug"
    lastUpdated: "2024-01-15"
  de:
    title: "German Title"
    description: "German description"
    slug: "german-slug"
    lastUpdated: "2024-01-15"
  fr:
    title: "French Title"
    description: "French description"
    slug: "french-slug"
    lastUpdated: "2024-01-15"
---

# Service Title

Content goes here...
```

#### Step 3: Create Translation Files
```bash
# Create translation files with native slugs
touch frontend/src/content/pages/cs/services/czech-slug.md
touch frontend/src/content/pages/de/services/german-slug.md
touch frontend/src/content/pages/fr/services/french-slug.md
```

#### Step 4: Update SlugMapper
Add slug mappings to `frontend/src/lib/content/SlugMapper.ts`:
```typescript
services: {
  'new-service': {
    cs: 'czech-slug',
    de: 'german-slug',
    fr: 'french-slug'
  }
}
```

### 2. Updating Existing Content

#### Step 1: Update English Source
- Make all changes to the English markdown file first
- Update the `lastModified` date in frontmatter
- Increment version number if using versioning

#### Step 2: Flag Translations for Review
- Update `lastUpdated` dates in translation frontmatter
- Add review flags if content structure changes significantly
- Use ContentValidator to identify outdated translations

#### Step 3: Update Translations
- Review and update each translation file
- Maintain consistent structure with English source
- Update translation metadata and dates

## Content Quality Standards

### 1. Frontmatter Requirements

#### Required Fields
```yaml
title: string           # Page title
description: string     # Brief description
publishDate: string     # ISO date format
category: string        # Content category
tags: string[]         # Relevant tags
```

#### SEO Fields
```yaml
seo:
  metaDescription: string    # 150-160 characters
  keywords: string[]         # Relevant keywords
  canonicalUrl?: string      # Optional canonical URL
```

#### Translation Metadata
```yaml
translations:
  [language]:
    title: string           # Translated title
    description: string     # Translated description
    slug: string           # Native language slug
    lastUpdated: string    # ISO date format
```

### 2. Content Structure Standards

#### Heading Hierarchy
- Use proper heading hierarchy (H1 → H2 → H3)
- Maintain consistent structure across translations
- Include table of contents for long articles

#### Link Management
- Use relative links for internal content
- Ensure links work across all language versions
- Update link targets when slugs change

#### Image and Media
- Use descriptive alt text in all languages
- Optimize images for web performance
- Provide captions in appropriate languages

### 3. Translation Quality Guidelines

#### Accuracy Standards
- Maintain technical accuracy across languages
- Preserve meaning and intent of original content
- Adapt cultural references appropriately

#### Consistency Requirements
- Use consistent terminology within each language
- Maintain brand voice and tone
- Follow language-specific style guides

#### Localization Best Practices
- Adapt content for local markets
- Use appropriate currency and date formats
- Consider cultural sensitivities

## URL Structure and Routing

### Human-Readable URLs
```
English (default):     /services/digital-transformation
Czech:                /cs/sluzby/digitalni-transformace
German:               /de/dienstleistungen/digitale-transformation
French:               /fr/services/transformation-numerique
```

### AI-Friendly URLs
```
English AI:           /ai/services/digital-transformation
Czech AI:             /cs/ai/sluzby/digitalni-transformace
German AI:            /de/ai/dienstleistungen/digitale-transformation
French AI:            /fr/ai/services/transformation-numerique
```

### URL Best Practices
- Use native language keywords in URLs
- Keep URLs concise and descriptive
- Maintain consistency within each language
- Avoid special characters and spaces

## SEO and Metadata Management

### Meta Tag Generation
- Generate language-specific meta tags automatically
- Include hreflang tags for all language versions
- Provide Open Graph tags for social sharing
- Generate structured data in appropriate languages

### Sitemap Management
- Include all language versions in sitemaps
- Use proper hreflang annotations
- Update sitemaps automatically when content changes
- Submit language-specific sitemaps to search engines

### Canonical URL Strategy
- Set English version as canonical for duplicate content
- Use self-referencing canonicals for unique translations
- Implement proper cross-language canonical relationships

## Performance Optimization

### Caching Strategy
- Cache processed content by language and content type
- Implement cache invalidation for content updates
- Use CDN for static assets and images
- Optimize cache headers for different content types

### Bundle Optimization
- Split bundles by language to reduce initial load
- Implement lazy loading for non-critical content
- Optimize images and media for each market
- Use compression for text content

## Validation and Quality Assurance

### Automated Validation
- Run ContentValidator regularly to check translation completeness
- Validate frontmatter structure and required fields
- Check for broken links and missing images
- Verify URL structure and slug mappings

### Manual Review Process
- Review translations for accuracy and cultural appropriateness
- Test language switching functionality
- Verify SEO metadata and structured data
- Check visual consistency across languages

### Content Auditing
- Perform regular content audits for each language
- Identify outdated or missing translations
- Review performance metrics by language
- Update content based on user feedback and analytics

## Tools and Resources

### Content Management Tools
- ContentValidator: Automated translation validation
- SlugMapper: URL and slug management
- ContentLoader: Unified content loading system
- Translation Dashboard: Content manager interface

### Development Tools
- Markdown editors with frontmatter support
- Git for version control and collaboration
- Automated testing for content validation
- Performance monitoring for multilingual content

### External Resources
- Translation services and tools
- SEO analysis tools for each language market
- Cultural consultation for localization
- Performance monitoring and analytics

## Troubleshooting Common Issues

### Missing Translations
1. Check ContentValidator reports for missing files
2. Verify slug mappings in SlugMapper
3. Ensure proper frontmatter structure
4. Update translation metadata

### URL Routing Issues
1. Verify slug mappings are correct
2. Check for special characters in slugs
3. Ensure consistent URL patterns
4. Test language switching functionality

### Performance Issues
1. Check cache hit rates by language
2. Optimize images and media files
3. Review bundle sizes per language
4. Monitor content loading times

### SEO Problems
1. Verify hreflang implementation
2. Check meta tag generation
3. Review sitemap inclusion
4. Validate structured data

## Best Practices Summary

1. **Always start with English**: Create and perfect English content before translating
2. **Maintain structure consistency**: Keep the same content structure across all languages
3. **Use native slugs**: Create culturally appropriate URLs for each language
4. **Validate regularly**: Run automated validation to catch issues early
5. **Test thoroughly**: Test language switching and content loading across all languages
6. **Monitor performance**: Track metrics for each language version
7. **Update systematically**: Follow the established workflow for all content changes
8. **Document changes**: Keep clear records of content updates and translation status