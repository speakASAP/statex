import { describe, it, expect } from 'vitest';
import { SlugMapper } from '@/lib/content/slugMapper';
import { getLocalizedUrlWithFallback } from '@/lib/utils/localization';
import { getHeaderTranslation, getFooterTranslation } from '@/lib/translations';

describe('Header and Footer Translation Integration - Complete System Test', () => {
  const languages = ['en', 'cs', 'de', 'fr'] as const;

  describe('Complete URL Generation System', () => {
    it('should generate correct URLs for all navigation items across all languages', () => {
      const navigationItems = [
        { path: '/services', expectedSlugs: { en: 'services', cs: 'sluzby', de: 'dienstleistungen', fr: 'services' } },
        { path: '/solutions', expectedSlugs: { en: 'solutions', cs: 'reseni', de: 'loesungen', fr: 'solutions' } },
        { path: '/about', expectedSlugs: { en: 'about', cs: 'o-nas', de: 'ueber-uns', fr: 'a-propos' } },
        { path: '/contact', expectedSlugs: { en: 'contact', cs: 'kontakt', de: 'kontakt', fr: 'contact' } },
        { path: '/free-prototype', expectedSlugs: { en: 'free-prototype', cs: 'bezplatny-prototyp', de: 'kostenloser-prototyp', fr: 'prototype-gratuit' } },
      ];

      navigationItems.forEach(item => {
        languages.forEach(language => {
          const url = getLocalizedUrlWithFallback(item.path, language);
          const expectedSlug = item.expectedSlugs[language];
          
          if (language === 'en') {
            expect(url).toBe(`/${expectedSlug}`);
          } else {
            expect(url).toBe(`/${language}/${expectedSlug}`);
          }
        });
      });
    });

    it('should generate correct URLs for all service items across all languages', () => {
      const serviceItems = [
        { path: '/services/ai-automation', expectedSlugs: { en: 'ai-automation', cs: 'ai-automatizace', de: 'ki-automatisierung', fr: 'automatisation-ia' } },
        { path: '/services/custom-software', expectedSlugs: { en: 'custom-software', cs: 'vlastni-software', de: 'individuelle-software', fr: 'logiciel-personnalise' } },
        { path: '/services/web-development', expectedSlugs: { en: 'web-development', cs: 'webovy-vyvoj', de: 'web-entwicklung', fr: 'developpement-web' } },
        { path: '/services/e-commerce', expectedSlugs: { en: 'e-commerce', cs: 'e-commerce', de: 'e-commerce', fr: 'e-commerce' } },
        { path: '/services/system-modernization', expectedSlugs: { en: 'system-modernization', cs: 'modernizace-systemu', de: 'systemmodernisierung', fr: 'modernisation-systemes' } },
        { path: '/services/consulting', expectedSlugs: { en: 'consulting', cs: 'poradenstvi', de: 'beratung', fr: 'conseil' } },
      ];

      serviceItems.forEach(item => {
        languages.forEach(language => {
          const url = getLocalizedUrlWithFallback(item.path, language);
          const expectedServiceSlug = SlugMapper.getNativeSlug('services', language);
          const expectedItemSlug = item.expectedSlugs[language];
          
          if (language === 'en') {
            expect(url).toBe(`/${expectedServiceSlug}/${expectedItemSlug}`);
          } else {
            expect(url).toBe(`/${language}/${expectedServiceSlug}/${expectedItemSlug}`);
          }
        });
      });
    });

    it('should generate correct URLs for all solution items across all languages', () => {
      const solutionItems = [
        { path: '/solutions/ai-integration', expectedSlugs: { en: 'ai-integration', cs: 'integrace-ai', de: 'ki-integration', fr: 'integration-ia' } },
        { path: '/solutions/business-automation', expectedSlugs: { en: 'business-automation', cs: 'automatizace-podnikani', de: 'geschaeftsautomatisierung', fr: 'automatisation-entreprise' } },
        { path: '/solutions/digital-transformation', expectedSlugs: { en: 'digital-transformation', cs: 'digitalni-transformace', de: 'digitale-transformation', fr: 'transformation-digitale' } },
        { path: '/solutions/legacy-modernization', expectedSlugs: { en: 'legacy-modernization', cs: 'modernizace-legacy-systemu', de: 'legacy-modernisierung', fr: 'modernisation-legacy' } },
      ];

      solutionItems.forEach(item => {
        languages.forEach(language => {
          const url = getLocalizedUrlWithFallback(item.path, language);
          const expectedSolutionSlug = SlugMapper.getNativeSlug('solutions', language);
          const expectedItemSlug = item.expectedSlugs[language];
          
          if (language === 'en') {
            expect(url).toBe(`/${expectedSolutionSlug}/${expectedItemSlug}`);
          } else {
            expect(url).toBe(`/${language}/${expectedSolutionSlug}/${expectedItemSlug}`);
          }
        });
      });
    });

    it('should generate correct URLs for all legal items across all languages', () => {
      const legalItems = [
        { path: '/legal/privacy-policy', expectedSlugs: { en: 'privacy-policy', cs: 'zasady-ochrany-osobnich-udaju', de: 'datenschutzerklaerung', fr: 'politique-confidentialite' } },
        { path: '/legal/terms-of-service', expectedSlugs: { en: 'terms-of-service', cs: 'obchodni-podminky', de: 'agb', fr: 'conditions-utilisation' } },
        { path: '/legal/cookie-policy', expectedSlugs: { en: 'cookie-policy', cs: 'zasady-cookies', de: 'cookie-richtlinie', fr: 'politique-cookies' } },
        { path: '/legal/gdpr-compliance', expectedSlugs: { en: 'gdpr-compliance', cs: 'gdpr-soulad', de: 'dsgvo-konformitaet', fr: 'conformite-rgpd' } },
        { path: '/legal/legal-disclaimers', expectedSlugs: { en: 'legal-disclaimers', cs: 'pravni-vylouceni', de: 'rechtliche-hinweise', fr: 'avertissements-legaux' } },
        { path: '/legal/legal-addendum', expectedSlugs: { en: 'legal-addendum', cs: 'pravni-dodatky', de: 'rechtliche-zusaetze', fr: 'addenda-juridique' } },
      ];

      legalItems.forEach(item => {
        languages.forEach(language => {
          const url = getLocalizedUrlWithFallback(item.path, language);
          const expectedLegalSlug = SlugMapper.getNativeSlug('legal', language);
          const expectedItemSlug = item.expectedSlugs[language];
          
          if (language === 'en') {
            expect(url).toBe(`/${expectedLegalSlug}/${expectedItemSlug}`);
          } else {
            expect(url).toBe(`/${language}/${expectedLegalSlug}/${expectedItemSlug}`);
          }
        });
      });
    });
  });

  describe('Translation Consistency Validation', () => {
    it('should have consistent translations between header and footer', () => {
      languages.forEach(language => {
        const headerTranslation = getHeaderTranslation(language);
        const footerTranslation = getFooterTranslation(language);

        // Services should be consistent
        expect(headerTranslation.navigation.services).toBe(footerTranslation.sections.services);
        
        // Solutions should be consistent
        expect(headerTranslation.navigation.solutions).toBe(footerTranslation.sections.solutions);
        
        // About should be consistent (header uses 'about', footer uses 'company' but both should exist)
        expect(headerTranslation.navigation.about).toBeTruthy();
        expect(footerTranslation.sections.company).toBeTruthy();
        
        // Contact should be consistent
        expect(headerTranslation.navigation.contact).toBeTruthy();
        expect(footerTranslation.quickLinks.contact).toBeTruthy();
      });
    });

    it('should have all required translation keys for header', () => {
      languages.forEach(language => {
        const translation = getHeaderTranslation(language);
        
        // Navigation keys
        expect(translation.navigation.services).toBeTruthy();
        expect(translation.navigation.solutions).toBeTruthy();
        expect(translation.navigation.about).toBeTruthy();
        expect(translation.navigation.contact).toBeTruthy();
        expect(translation.navigation.freePrototype).toBeTruthy();
        
        // CTA keys
        expect(translation.cta.getStarted).toBeTruthy();
        
        // Aria keys
        expect(translation.aria.openMenu).toBeTruthy();
        expect(translation.aria.switchTheme).toBeTruthy();
        expect(translation.aria.switchFrontend).toBeTruthy();
        expect(translation.aria.mainNavigation).toBeTruthy();
        expect(translation.aria.mobileNavigation).toBeTruthy();
      });
    });

    it('should have all required translation keys for footer', () => {
      languages.forEach(language => {
        const translation = getFooterTranslation(language);
        
        // Section keys
        expect(translation.sections.solutions).toBeTruthy();
        expect(translation.sections.services).toBeTruthy();
        expect(translation.sections.company).toBeTruthy();
        expect(translation.sections.legal).toBeTruthy();
        
        // Quick links keys
        expect(translation.quickLinks.title).toBeTruthy();
        expect(translation.quickLinks.blog).toBeTruthy();
        expect(translation.quickLinks.careers).toBeTruthy();
        expect(translation.quickLinks.contact).toBeTruthy();
        expect(translation.quickLinks.support).toBeTruthy();
        expect(translation.quickLinks.aiFriendly).toBeTruthy();
        
        // Contact keys
        expect(translation.contact.phone).toBeTruthy();
        expect(translation.contact.email).toBeTruthy();
        expect(translation.contact.address).toBeTruthy();
        
        // Social keys
        expect(translation.social.followUs).toBeTruthy();
        
        // Bottom keys
        expect(translation.bottom.copyright).toBeTruthy();
        
        // Company keys
        expect(translation.company.name).toBeTruthy();
        expect(translation.company.description).toBeTruthy();
        expect(translation.company.contact.phone).toBeTruthy();
        expect(translation.company.contact.email).toBeTruthy();
        expect(translation.company.contact.address).toBeTruthy();
        
        // All link keys should exist
        const linkKeys = [
          'aiAutomation', 'customSoftware', 'webDevelopment', 'ecommerce', 'systemModernization', 'consulting',
          'aiIntegration', 'businessAutomation', 'digitalTransformation', 'legacyModernization',
          'aboutUs', 'companyStory', 'czechPresence', 'internationalTeam', 'valuesMission',
          'privacyPolicy', 'termsOfService', 'cookiePolicy', 'gdprCompliance', 'legalDisclaimers', 'legalAddendum'
        ];
        
        linkKeys.forEach(key => {
          expect(translation.links[key as keyof typeof translation.links]).toBeTruthy();
        });
      });
    });
  });

  describe('SlugMapper Coverage Validation', () => {
    it('should have complete slug mappings for all header navigation items', () => {
      const navigationSlugs = ['services', 'solutions', 'about', 'contact', 'free-prototype'];
      
      navigationSlugs.forEach(slug => {
        expect(SlugMapper.hasSlug(slug)).toBe(true);
        
        languages.forEach(language => {
          const nativeSlug = SlugMapper.getNativeSlug(slug, language);
          expect(nativeSlug).toBeTruthy();
          expect(typeof nativeSlug).toBe('string');
          expect(nativeSlug.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have complete slug mappings for all footer service items', () => {
      const serviceSlugs = [
        'ai-automation', 'custom-software', 'web-development', 'e-commerce', 
        'system-modernization', 'consulting'
      ];
      
      serviceSlugs.forEach(slug => {
        expect(SlugMapper.hasSlug(slug)).toBe(true);
        
        languages.forEach(language => {
          const nativeSlug = SlugMapper.getNativeSlug(slug, language);
          expect(nativeSlug).toBeTruthy();
          expect(typeof nativeSlug).toBe('string');
          expect(nativeSlug.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have complete slug mappings for all footer solution items', () => {
      const solutionSlugs = [
        'ai-integration', 'business-automation', 'digital-transformation', 'legacy-modernization'
      ];
      
      solutionSlugs.forEach(slug => {
        expect(SlugMapper.hasSlug(slug)).toBe(true);
        
        languages.forEach(language => {
          const nativeSlug = SlugMapper.getNativeSlug(slug, language);
          expect(nativeSlug).toBeTruthy();
          expect(typeof nativeSlug).toBe('string');
          expect(nativeSlug.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have complete slug mappings for all footer legal items', () => {
      const legalSlugs = [
        'privacy-policy', 'terms-of-service', 'cookie-policy', 'gdpr-compliance',
        'legal-disclaimers', 'legal-addendum'
      ];
      
      legalSlugs.forEach(slug => {
        expect(SlugMapper.hasSlug(slug)).toBe(true);
        
        languages.forEach(language => {
          const nativeSlug = SlugMapper.getNativeSlug(slug, language);
          expect(nativeSlug).toBeTruthy();
          expect(typeof nativeSlug).toBe('string');
          expect(nativeSlug.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have complete slug mappings for additional pages', () => {
      const additionalSlugs = [
        'careers', 'support', 'company-story', 'czech-presence', 
        'international-team', 'values-mission'
      ];
      
      additionalSlugs.forEach(slug => {
        expect(SlugMapper.hasSlug(slug)).toBe(true);
        
        languages.forEach(language => {
          const nativeSlug = SlugMapper.getNativeSlug(slug, language);
          expect(nativeSlug).toBeTruthy();
          expect(typeof nativeSlug).toBe('string');
          expect(nativeSlug.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Fallback System Validation', () => {
    it('should handle missing slug mappings gracefully', () => {
      const nonExistentPaths = [
        '/non-existent-page',
        '/services/non-existent-service',
        '/solutions/non-existent-solution'
      ];

      nonExistentPaths.forEach(path => {
        languages.forEach(language => {
          expect(() => {
            const url = getLocalizedUrlWithFallback(path, language);
            expect(url).toBeTruthy();
            expect(typeof url).toBe('string');
          }).not.toThrow();
        });
      });
    });

    it('should provide English fallback when native translation fails', () => {
      const testPath = '/test-fallback-page';
      
      languages.forEach(language => {
        const url = getLocalizedUrlWithFallback(testPath, language, true);
        
        if (language === 'en') {
          expect(url).toBe(testPath);
        } else {
          // Should fall back to simple language prefix since no mapping exists
          expect(url).toBe(`/${language}${testPath}`);
        }
      });
    });
  });

  describe('System Integration Validation', () => {
    it('should maintain consistency between SlugMapper and translation system', () => {
      // Verify that all content types have proper mappings
      const contentTypes = SlugMapper.getContentTypesWithMappings();
      const expectedContentTypes = ['blog', 'pages', 'services', 'solutions', 'legal'];
      
      expectedContentTypes.forEach(contentType => {
        expect(contentTypes).toContain(contentType);
      });
    });

    it('should validate slug mapping completeness', () => {
      const validation = SlugMapper.validateSlugMappings();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should ensure bidirectional slug mapping works correctly', () => {
      const testSlugs = ['services', 'solutions', 'about', 'contact'];
      
      testSlugs.forEach(englishSlug => {
        languages.forEach(language => {
          if (language !== 'en') {
            const nativeSlug = SlugMapper.getNativeSlug(englishSlug, language);
            const backToEnglish = SlugMapper.getEnglishSlug(nativeSlug, language);
            expect(backToEnglish).toBe(englishSlug);
          }
        });
      });
    });
  });
});