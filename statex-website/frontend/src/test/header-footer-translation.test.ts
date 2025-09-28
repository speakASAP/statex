import { describe, it, expect } from 'vitest';
import { SlugMapper } from '@/lib/content/slugMapper';
import { getLocalizedUrlWithFallback } from '@/lib/utils/localization';
import { getHeaderTranslation, getFooterTranslation } from '@/lib/translations';

describe('Header and Footer Translation Integration', () => {
  const languages = ['en', 'cs', 'de', 'fr'] as const;
  
  describe('Header Navigation URLs', () => {
    const navigationPaths = [
      '/services',
      '/solutions', 
      '/about',
      '/contact',
      '/free-prototype'
    ];

    languages.forEach(language => {
      it(`should generate proper native URLs for ${language}`, () => {
        navigationPaths.forEach(path => {
          const url = getLocalizedUrlWithFallback(path, language);
          
          if (language === 'en') {
            expect(url).toBe(path);
          } else {
            expect(url).toMatch(new RegExp(`^/${language}/`));
            // Verify that SlugMapper is being used (even if result is same)
            const pathSegments = path.split('/').filter(Boolean);
            if (pathSegments.length === 1) {
              const slug = pathSegments[0];
              const nativeSlug = SlugMapper.getNativeSlug(slug, language);
              expect(url).toBe(`/${language}/${nativeSlug}`);
            }
          }
        });
      });
    });
  });

  describe('Footer Service Links', () => {
    const servicePaths = [
      '/services/ai-automation',
      '/services/custom-software',
      '/services/web-development',
      '/services/e-commerce',
      '/services/system-modernization',
      '/services/consulting'
    ];

    languages.forEach(language => {
      it(`should generate proper service URLs for ${language}`, () => {
        servicePaths.forEach(path => {
          const url = getLocalizedUrlWithFallback(path, language);
          
          if (language === 'en') {
            expect(url).toBe(path);
          } else {
            expect(url).toMatch(new RegExp(`^/${language}/`));
            // Should contain native slugs
            const pathSegments = url.split('/').filter(Boolean);
            expect(pathSegments.length).toBeGreaterThanOrEqual(3); // lang/services/slug
          }
        });
      });
    });
  });

  describe('Footer Solution Links', () => {
    const solutionPaths = [
      '/solutions/ai-integration',
      '/solutions/business-automation',
      '/solutions/digital-transformation',
      '/solutions/legacy-modernization'
    ];

    languages.forEach(language => {
      it(`should generate proper solution URLs for ${language}`, () => {
        solutionPaths.forEach(path => {
          const url = getLocalizedUrlWithFallback(path, language);
          
          if (language === 'en') {
            expect(url).toBe(path);
          } else {
            expect(url).toMatch(new RegExp(`^/${language}/`));
          }
        });
      });
    });
  });

  describe('Footer Legal Links', () => {
    const legalPaths = [
      '/legal/privacy-policy',
      '/legal/terms-of-service',
      '/legal/cookie-policy',
      '/legal/gdpr-compliance',
      '/legal/legal-disclaimers',
      '/legal/legal-addendum'
    ];

    languages.forEach(language => {
      it(`should generate proper legal URLs for ${language}`, () => {
        legalPaths.forEach(path => {
          const url = getLocalizedUrlWithFallback(path, language);
          
          if (language === 'en') {
            expect(url).toBe(path);
          } else {
            expect(url).toMatch(new RegExp(`^/${language}/`));
          }
        });
      });
    });
  });

  describe('Translation Completeness', () => {
    languages.forEach(language => {
      it(`should have complete header translations for ${language}`, () => {
        const headerTranslation = getHeaderTranslation(language);
        
        expect(headerTranslation.navigation.services).toBeTruthy();
        expect(headerTranslation.navigation.solutions).toBeTruthy();
        expect(headerTranslation.navigation.about).toBeTruthy();
        expect(headerTranslation.navigation.contact).toBeTruthy();
        expect(headerTranslation.navigation.freePrototype).toBeTruthy();
        expect(headerTranslation.cta.getStarted).toBeTruthy();
      });

      it(`should have complete footer translations for ${language}`, () => {
        const footerTranslation = getFooterTranslation(language);
        
        expect(footerTranslation.sections.services).toBeTruthy();
        expect(footerTranslation.sections.solutions).toBeTruthy();
        expect(footerTranslation.sections.company).toBeTruthy();
        expect(footerTranslation.sections.legal).toBeTruthy();
        
        // Check service links
        expect(footerTranslation.links.aiAutomation).toBeTruthy();
        expect(footerTranslation.links.customSoftware).toBeTruthy();
        expect(footerTranslation.links.webDevelopment).toBeTruthy();
        
        // Check solution links
        expect(footerTranslation.links.aiIntegration).toBeTruthy();
        expect(footerTranslation.links.businessAutomation).toBeTruthy();
        expect(footerTranslation.links.digitalTransformation).toBeTruthy();
        
        // Check legal links
        expect(footerTranslation.links.privacyPolicy).toBeTruthy();
        expect(footerTranslation.links.termsOfService).toBeTruthy();
        expect(footerTranslation.links.cookiePolicy).toBeTruthy();
      });
    });
  });

  describe('SlugMapper Integration', () => {
    it('should have mappings for all navigation items', () => {
      const navigationSlugs = ['services', 'solutions', 'about', 'contact', 'free-prototype'];
      
      navigationSlugs.forEach(slug => {
        expect(SlugMapper.hasSlug(slug)).toBe(true);
        
        languages.forEach(language => {
          const nativeSlug = SlugMapper.getNativeSlug(slug, language);
          expect(nativeSlug).toBeTruthy();
          expect(typeof nativeSlug).toBe('string');
        });
      });
    });

    it('should have mappings for all service items', () => {
      const serviceSlugs = [
        'ai-automation',
        'custom-software', 
        'web-development',
        'e-commerce',
        'system-modernization',
        'consulting'
      ];
      
      serviceSlugs.forEach(slug => {
        expect(SlugMapper.hasSlug(slug)).toBe(true);
        
        languages.forEach(language => {
          const nativeSlug = SlugMapper.getNativeSlug(slug, language);
          expect(nativeSlug).toBeTruthy();
          expect(typeof nativeSlug).toBe('string');
        });
      });
    });

    it('should have mappings for all solution items', () => {
      const solutionSlugs = [
        'ai-integration',
        'business-automation',
        'digital-transformation', 
        'legacy-modernization'
      ];
      
      solutionSlugs.forEach(slug => {
        expect(SlugMapper.hasSlug(slug)).toBe(true);
        
        languages.forEach(language => {
          const nativeSlug = SlugMapper.getNativeSlug(slug, language);
          expect(nativeSlug).toBeTruthy();
          expect(typeof nativeSlug).toBe('string');
        });
      });
    });

    it('should have mappings for all legal items', () => {
      const legalSlugs = [
        'privacy-policy',
        'terms-of-service',
        'cookie-policy',
        'gdpr-compliance',
        'legal-disclaimers',
        'legal-addendum'
      ];
      
      legalSlugs.forEach(slug => {
        expect(SlugMapper.hasSlug(slug)).toBe(true);
        
        languages.forEach(language => {
          const nativeSlug = SlugMapper.getNativeSlug(slug, language);
          expect(nativeSlug).toBeTruthy();
          expect(typeof nativeSlug).toBe('string');
        });
      });
    });
  });

  describe('Fallback Behavior', () => {
    it('should fall back to English when native slug is not found', () => {
      const nonExistentPath = '/non-existent-page';
      
      languages.forEach(language => {
        const url = getLocalizedUrlWithFallback(nonExistentPath, language);
        
        if (language === 'en') {
          expect(url).toBe(nonExistentPath);
        } else {
          // Should fall back to simple language prefix
          expect(url).toBe(`/${language}${nonExistentPath}`);
        }
      });
    });
  });
});