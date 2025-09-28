/**
 * Comprehensive test suite for the Complete Multilingual Translation System
 * Tests all aspects of the multilingual functionality including:
 * - Content loading across languages
 * - URL routing and slug mapping
 * - AI content serving
 * - Language switching
 * - SEO optimization
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// Test configuration
const SUPPORTED_LANGUAGES = ['en', 'cs', 'de', 'fr'];
const CONTENT_TYPES = ['services', 'solutions', 'legal'];
const BASE_PAGES = ['home', 'about', 'contact'];
const CONTENT_PATH = join(process.cwd(), 'src/content');

describe('Multilingual Translation System - Final Validation', () => {
  
  describe('Translation Completeness', () => {
    
    it('should have complete blog translations for all languages', () => {
      const blogPath = join(CONTENT_PATH, 'blog');
      const englishPosts = readdirSync(join(blogPath, 'en'))
        .filter(file => file.endsWith('.md'));

      expect(englishPosts.length).toBeGreaterThan(0);

      SUPPORTED_LANGUAGES.filter(lang => lang !== 'en').forEach(language => {
        const langPath = join(blogPath, language);
        expect(existsSync(langPath), `Blog directory should exist for ${language}`).toBe(true);
        
        const translatedPosts = readdirSync(langPath)
          .filter(file => file.endsWith('.md'));
        
        expect(translatedPosts.length).toBe(englishPosts.length);
        
        // Check that all English posts have translations
        englishPosts.forEach(post => {
          expect(translatedPosts.includes(post), 
            `Blog post ${post} should be translated to ${language}`).toBe(true);
        });
      });
    });

    it('should have complete page translations for all base pages', () => {
      const pagesPath = join(CONTENT_PATH, 'pages');

      BASE_PAGES.forEach(page => {
        const englishFile = join(pagesPath, 'en', `${page}.md`);
        expect(existsSync(englishFile), `English source should exist for ${page}`).toBe(true);

        SUPPORTED_LANGUAGES.filter(lang => lang !== 'en').forEach(language => {
          const translatedFile = join(pagesPath, language, `${page}.md`);
          expect(existsSync(translatedFile), 
            `${page} should be translated to ${language}`).toBe(true);
        });
      });
    });

    it('should have complete content type translations', () => {
      const pagesPath = join(CONTENT_PATH, 'pages');

      CONTENT_TYPES.forEach(contentType => {
        const englishPath = join(pagesPath, 'en', contentType);
        expect(existsSync(englishPath), 
          `English ${contentType} directory should exist`).toBe(true);

        const englishFiles = readdirSync(englishPath)
          .filter(file => file.endsWith('.md'));
        
        expect(englishFiles.length).toBeGreaterThan(0);

        SUPPORTED_LANGUAGES.filter(lang => lang !== 'en').forEach(language => {
          const langPath = join(pagesPath, language, contentType);
          expect(existsSync(langPath), 
            `${contentType} directory should exist for ${language}`).toBe(true);

          const translatedFiles = readdirSync(langPath)
            .filter(file => file.endsWith('.md'));

          expect(translatedFiles.length).toBe(englishFiles.length);

          // Check individual file translations
          englishFiles.forEach(file => {
            expect(translatedFiles.includes(file), 
              `${contentType}/${file} should be translated to ${language}`).toBe(true);
          });
        });
      });
    });

    it('should have consistent frontmatter structure across languages', () => {
      const pagesPath = join(CONTENT_PATH, 'pages');
      
      // Test services as example
      const englishServicesPath = join(pagesPath, 'en', 'services');
      if (existsSync(englishServicesPath)) {
        const englishFiles = readdirSync(englishServicesPath)
          .filter(file => file.endsWith('.md'));

        englishFiles.slice(0, 3).forEach(file => { // Test first 3 files
          const englishContent = readFileSync(join(englishServicesPath, file), 'utf8');
          const englishFrontmatter = extractFrontmatter(englishContent);

          SUPPORTED_LANGUAGES.filter(lang => lang !== 'en').forEach(language => {
            const translatedPath = join(pagesPath, language, 'services', file);
            if (existsSync(translatedPath)) {
              const translatedContent = readFileSync(translatedPath, 'utf8');
              const translatedFrontmatter = extractFrontmatter(translatedContent);

              // Check that key frontmatter fields exist
              expect(translatedFrontmatter.title).toBeDefined();
              expect(translatedFrontmatter.description).toBeDefined();
              
              if (englishFrontmatter.category) {
                expect(translatedFrontmatter.category).toBeDefined();
              }
            }
          });
        });
      }
    });
  });

  describe('URL Patterns and Routing', () => {
    
    it('should have SlugMapper implementation', () => {
      const slugMapperPath = join(process.cwd(), 'src/lib/content/SlugMapper.ts');
      expect(existsSync(slugMapperPath), 'SlugMapper should exist').toBe(true);
      
      const slugMapperContent = readFileSync(slugMapperPath, 'utf8');
      expect(slugMapperContent).toContain('class');
      expect(slugMapperContent).toContain('getNativeSlug');
    });

    it('should have route files for all content types', () => {
      const routePaths = [
        'src/app/[lang]/services/[service]/page.tsx',
        'src/app/[lang]/solutions/[solution]/page.tsx',
        'src/app/[lang]/legal/[legal]/page.tsx'
      ];

      routePaths.forEach(routePath => {
        const fullPath = join(process.cwd(), routePath);
        expect(existsSync(fullPath), `Route should exist: ${routePath}`).toBe(true);
      });
    });

    it('should have AI content serving routes', () => {
      const aiRoutePaths = [
        'src/app/ai/services/[service]/route.ts',
        'src/app/ai/solutions/[solution]/route.ts',
        'src/app/ai/legal/[legal]/route.ts'
      ];

      aiRoutePaths.forEach(routePath => {
        const fullPath = join(process.cwd(), routePath);
        expect(existsSync(fullPath), `AI route should exist: ${routePath}`).toBe(true);
      });
    });
  });

  describe('Content Loading System', () => {
    
    it('should have ContentLoader implementation', () => {
      const contentLoaderPath = join(process.cwd(), 'src/lib/content/ContentLoader.ts');
      expect(existsSync(contentLoaderPath), 'ContentLoader should exist').toBe(true);
      
      const contentLoaderContent = readFileSync(contentLoaderPath, 'utf8');
      expect(contentLoaderContent).toContain('class');
      expect(contentLoaderContent).toContain('loadContent');
    });

    it('should have content validation utilities', () => {
      const possiblePaths = [
        'src/lib/content/ContentValidator.ts',
        'src/lib/validation/ContentValidator.ts',
        'src/lib/content/validation.ts'
      ];

      const validatorExists = possiblePaths.some(path => 
        existsSync(join(process.cwd(), path))
      );

      expect(validatorExists, 'Content validator should exist').toBe(true);
    });
  });

  describe('Language Switching', () => {
    
    it('should have language switcher component', () => {
      const possiblePaths = [
        'src/components/layout/LanguageSwitcher.tsx',
        'src/components/ui/LanguageSwitcher.tsx',
        'src/components/LanguageSwitcher.tsx'
      ];

      const switcherExists = possiblePaths.some(path => 
        existsSync(join(process.cwd(), path))
      );

      expect(switcherExists, 'Language switcher component should exist').toBe(true);
    });

    it('should have language detection utilities', () => {
      const possiblePaths = [
        'src/lib/i18n.ts',
        'src/lib/language.ts',
        'src/lib/utils/language.ts'
      ];

      const detectionExists = possiblePaths.some(path => 
        existsSync(join(process.cwd(), path))
      );

      expect(detectionExists, 'Language detection utilities should exist').toBe(true);
    });
  });

  describe('SEO Optimization', () => {
    
    it('should have metadata generation utilities', () => {
      const possiblePaths = [
        'src/lib/metadata.ts',
        'src/lib/seo.ts',
        'src/lib/utils/metadata.ts'
      ];

      const metadataExists = possiblePaths.some(path => 
        existsSync(join(process.cwd(), path))
      );

      expect(metadataExists, 'Metadata generation utilities should exist').toBe(true);
    });

    it('should have sitemap generation', () => {
      const possiblePaths = [
        'src/app/sitemap.xml/route.ts',
        'src/app/sitemap.ts'
      ];

      const sitemapExists = possiblePaths.some(path => 
        existsSync(join(process.cwd(), path))
      );

      expect(sitemapExists, 'Sitemap generation should exist').toBe(true);
    });

    it('should have layout with proper head configuration', () => {
      const layoutPath = join(process.cwd(), 'src/app/layout.tsx');
      expect(existsSync(layoutPath), 'Layout file should exist').toBe(true);
      
      const layoutContent = readFileSync(layoutPath, 'utf8');
      expect(layoutContent).toContain('metadata');
    });
  });

  describe('Performance and Caching', () => {
    
    it('should have caching implementation in ContentLoader', () => {
      const contentLoaderPath = join(process.cwd(), 'src/lib/content/ContentLoader.ts');
      
      if (existsSync(contentLoaderPath)) {
        const contentLoaderContent = readFileSync(contentLoaderPath, 'utf8');
        const hasCaching = contentLoaderContent.includes('cache') || 
                          contentLoaderContent.includes('Cache') ||
                          contentLoaderContent.includes('Map') ||
                          contentLoaderContent.includes('memoize');
        
        expect(hasCaching, 'ContentLoader should implement caching').toBe(true);
      }
    });
  });

  describe('Translation Quality', () => {
    
    it('should have non-empty translation files', () => {
      const pagesPath = join(CONTENT_PATH, 'pages');
      
      // Test a sample of files to ensure they're not empty
      SUPPORTED_LANGUAGES.forEach(language => {
        const langPath = join(pagesPath, language);
        
        if (existsSync(langPath)) {
          const homeFile = join(langPath, 'home.md');
          
          if (existsSync(homeFile)) {
            const content = readFileSync(homeFile, 'utf8');
            expect(content.length).toBeGreaterThan(100); // Should have substantial content
            expect(content).toContain('title:');
            expect(content).toContain('description:');
          }
        }
      });
    });

    it('should have proper slug mappings in translated files', () => {
      const pagesPath = join(CONTENT_PATH, 'pages');
      
      // Check that Czech files have Czech slugs
      const czechServicesPath = join(pagesPath, 'cs', 'services');
      if (existsSync(czechServicesPath)) {
        const czechFiles = readdirSync(czechServicesPath)
          .filter(file => file.endsWith('.md'));
        
        // Check that file names are in Czech (not English)
        const hasCzechSlugs = czechFiles.some(file => 
          file.includes('sluzby') || 
          file.includes('digitalni') || 
          file.includes('poradenstvi')
        );
        
        expect(hasCzechSlugs, 'Czech services should have Czech file names').toBe(true);
      }
    });
  });
});

// Helper function to extract frontmatter from markdown content
function extractFrontmatter(content: string): Record<string, any> {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};
  
  const frontmatterText = frontmatterMatch[1];
  const frontmatter: Record<string, any> = {};
  
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  });
  
  return frontmatter;
}