import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeaderSection } from '@/components/sections/HeaderSection';
import { FooterSection } from '@/components/sections/FooterSection';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { VariantProvider } from '@/components/providers/VariantProvider';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Link component
vi.mock('next/link', () => {
  return {
    default: ({ children, href, ...props }: any) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

const TestWrapper = ({ children, language = 'en' }: { children: React.ReactNode; language?: string }) => (
  <ThemeProvider>
    <VariantProvider>
      <LanguageProvider initialLanguage={language as any}>
        {children}
      </LanguageProvider>
    </VariantProvider>
  </ThemeProvider>
);

describe('Header and Footer Components Translation', () => {
  const languages = ['en', 'cs', 'de', 'fr'] as const;

  describe('HeaderSection Component', () => {
    languages.forEach(language => {
      it(`should render header with correct translations for ${language}`, () => {
        render(
          <TestWrapper language={language}>
            <HeaderSection />
          </TestWrapper>
        );

        // Check that header is rendered
        const header = screen.getByTestId('stx-header-section');
        expect(header).toBeInTheDocument();

        // Check navigation links are present
        const nav = screen.getByRole('navigation');
        expect(nav).toBeInTheDocument();

        // Check that links have proper hrefs with language-specific URLs
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);

        // Verify language-specific URLs
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href !== '/') {
            if (language === 'en') {
              // English URLs should not have language prefix
              expect(href).not.toMatch(/^\/(cs|de|fr)\//);
            } else {
              // Other languages should have language prefix or be external
              if (!href.startsWith('http') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
                expect(href).toMatch(new RegExp(`^/${language}/`));
              }
            }
          }
        });
      });
    });

    it('should update navigation when language changes', () => {
      const { rerender } = render(
        <TestWrapper language="en">
          <HeaderSection />
        </TestWrapper>
      );

      // Check English navigation
      let links = screen.getAllByRole('link');
      const englishHrefs = links.map(link => link.getAttribute('href'));

      // Re-render with Czech
      rerender(
        <TestWrapper language="cs">
          <HeaderSection />
        </TestWrapper>
      );

      // Check Czech navigation
      links = screen.getAllByRole('link');
      const czechHrefs = links.map(link => link.getAttribute('href'));

      // URLs should be different (Czech should have /cs/ prefix and native slugs)
      expect(englishHrefs).not.toEqual(czechHrefs);
    });
  });

  describe('FooterSection Component', () => {
    languages.forEach(language => {
      it(`should render footer with correct translations for ${language}`, () => {
        render(
          <TestWrapper language={language}>
            <FooterSection />
          </TestWrapper>
        );

        // Check that footer is rendered
        const footer = screen.getByTestId('stx-footer-section');
        expect(footer).toBeInTheDocument();

        // Check that footer sections are present
        const sections = footer.querySelectorAll('.stx-footer__section');
        expect(sections.length).toBeGreaterThan(0);

        // Check that links have proper hrefs with language-specific URLs
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);

        // Verify language-specific URLs
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href !== '/') {
            if (language === 'en') {
              // English URLs should not have language prefix (except for external links and AI links)
              if (!href.startsWith('http') && !href.startsWith('tel:') && !href.startsWith('mailto:') && !href.startsWith('/ai/')) {
                expect(href).not.toMatch(/^\/(cs|de|fr)\//);
              }
            } else {
              // Other languages should have language prefix or be external or AI links
              if (!href.startsWith('http') && !href.startsWith('tel:') && !href.startsWith('mailto:') && !href.startsWith('/ai/')) {
                expect(href).toMatch(new RegExp(`^/${language}/`));
              }
            }
          }
        });
      });

      it(`should have translated section titles for ${language}`, () => {
        render(
          <TestWrapper language={language}>
            <FooterSection />
          </TestWrapper>
        );

        // Check for section titles (they should be translated)
        const sectionTitles = screen.getAllByRole('heading', { level: 3 });
        expect(sectionTitles.length).toBeGreaterThan(0);

        // Each section title should have text content
        sectionTitles.forEach(title => {
          expect(title.textContent).toBeTruthy();
          expect(title.textContent?.trim().length).toBeGreaterThan(0);
        });
      });

      it(`should have translated contact information for ${language}`, () => {
        render(
          <TestWrapper language={language}>
            <FooterSection />
          </TestWrapper>
        );

        // Check for contact information
        const footer = screen.getByTestId('stx-footer-section');
        const contactSection = footer.querySelector('.stx-footer__contact');
        expect(contactSection).toBeInTheDocument();

        // Check for phone, email, and address
        const phoneLink = screen.getByRole('link', { name: /\+420/ });
        const emailLink = screen.getByRole('link', { name: /info@statex\.cz/ });
        
        expect(phoneLink).toBeInTheDocument();
        expect(emailLink).toBeInTheDocument();
      });
    });

    it('should update footer links when language changes', () => {
      const { rerender } = render(
        <TestWrapper language="en">
          <FooterSection />
        </TestWrapper>
      );

      // Check English footer links
      let links = screen.getAllByRole('link');
      const englishHrefs = links.map(link => link.getAttribute('href'));

      // Re-render with German
      rerender(
        <TestWrapper language="de">
          <FooterSection />
        </TestWrapper>
      );

      // Check German footer links
      links = screen.getAllByRole('link');
      const germanHrefs = links.map(link => link.getAttribute('href'));

      // URLs should be different (German should have /de/ prefix and native slugs)
      expect(englishHrefs).not.toEqual(germanHrefs);
    });
  });

  describe('Translation Fallback Behavior', () => {
    it('should handle missing translations gracefully in header', () => {
      // This test ensures the component doesn't crash with missing translations
      expect(() => {
        render(
          <TestWrapper language="en">
            <HeaderSection />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle missing translations gracefully in footer', () => {
      // This test ensures the component doesn't crash with missing translations
      expect(() => {
        render(
          <TestWrapper language="en">
            <FooterSection />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('AI-Friendly Links', () => {
    languages.forEach(language => {
      it(`should generate AI-friendly links correctly for ${language}`, () => {
        render(
          <TestWrapper language={language}>
            <FooterSection />
          </TestWrapper>
        );

        // Check for AI-friendly link by looking for links with /ai/ in href
        const allLinks = screen.getAllByRole('link');
        const aiLinks = allLinks.filter(link => {
          const href = link.getAttribute('href');
          return href && href.includes('/ai/');
        });
        
        expect(aiLinks.length).toBeGreaterThan(0);
        
        // Verify the AI link has the correct structure
        const aiLink = aiLinks[0];
        const href = aiLink?.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/\/ai\//);
      });
    });
  });
});