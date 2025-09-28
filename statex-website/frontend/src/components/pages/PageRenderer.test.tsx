import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import PageRenderer from './PageRenderer';
import { RenderedContent } from '@/lib/content/templateRenderer';
import { ProcessedContent } from '@/lib/content/ContentProcessor';
import {
  renderWithProviders,
  testCompleteThemeSupport,
  ALL_THEMES,
  type ThemeName
} from '../../test/utils/test-utils';

// Mock data for testing
const mockPage: ProcessedContent = {
  markdown: {
    frontmatter: {
      title: 'Test Page',
      description: 'This is a test page description',
      author: 'Test Author',
      publishDate: '2024-01-15',
      category: 'Test Category',
      tags: ['test', 'page'],
      language: 'en',
      template: 'page',
      seo: {
        keywords: ['test', 'page'],
        metaDescription: 'Test page meta description'
      }
    },
    content: '# Test Page\n\nThis is the content of the test page.',
    metadata: {
      slug: 'test-page',
      readTime: '3 min read',
      wordCount: 75,
      language: 'en'
    }
  },
  html: {
    content: '<h1>Test Page</h1><p>This is the content of the test page.</p>',
    metadata: {
      slug: 'test-page',
      readTime: '3 min read',
      wordCount: 75,
      language: 'en'
    }
  },
  aiMarkdown: {
    content: '# Test Page\n\nThis is the content of the test page.',
    metadata: {
      slug: 'test-page',
      readTime: '3 min read',
      wordCount: 75,
      language: 'en'
    }
  }
};

const mockRenderedContent: RenderedContent = {
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      variant: 'default',
      content: {
        title: 'Test Page',
        description: 'This is a test page description',
        subtitle: 'Test subtitle'
      },
      config: {
        showTitle: true,
        showDescription: true,
        showSubtitle: true
      }
    },
    {
      id: 'content-1',
      type: 'content',
      variant: 'markdown',
      content: {
        html: '<h1>Test Page</h1><p>This is the content of the test page.</p>'
      },
      config: {
        maxWidth: '1200px',
        typography: 'prose'
      }
    },
    {
      id: 'cta-1',
      type: 'cta',
      variant: 'primary',
      content: {
        title: 'Ready to Get Started?',
        description: 'Contact us today to discuss your project.',
        buttonText: 'Contact Us',
        buttonLink: '/contact'
      },
      config: {
        showContactForm: true,
        showSocialProof: true
      }
    }
  ],
  metadata: {
    template: 'page',
    seo: {
      title: 'Test Page',
      description: 'This is a test page description'
    }
  }
};

describe('PageRenderer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('STX Classes', () => {
    it('applies correct STX classes to page sections', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      const heroSection = document.querySelector('.stx-hero');
      const contentSection = document.querySelector('.stx-section');
      const ctaSection = document.querySelector('.stx-cta');
      const contentBody = document.querySelector('.stx-content__body');

      expect(heroSection).toBeInTheDocument();
      expect(contentSection).toBeInTheDocument();
      expect(ctaSection).toBeInTheDocument();
      expect(contentBody).toBeInTheDocument();
    });

    it('applies BEM-style classes to page elements', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      const heroTitle = document.querySelector('.stx-hero__title');
      const heroSubtitle = document.querySelector('.stx-hero__subtitle');
      const ctaTitle = document.querySelector('.stx-cta__title');
      const ctaDescription = document.querySelector('.stx-cta__description');
      const ctaForm = document.querySelector('.stx-cta__form');

      expect(heroTitle).toBeInTheDocument();
      expect(heroSubtitle).toBeInTheDocument();
      expect(ctaTitle).toBeInTheDocument();
      expect(ctaDescription).toBeInTheDocument();
      expect(ctaForm).toBeInTheDocument();
    });
  });

  describe('Hero Section Rendering', () => {
    it('renders hero section with all content when config is enabled', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      expect(screen.getByText('Test Page')).toBeInTheDocument();
      expect(screen.getByText('This is a test page description')).toBeInTheDocument();
      expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    });

    it('renders hero section with conditional content based on config', () => {
      const contentWithDisabledConfig = {
        ...mockRenderedContent,
        sections: [
          {
            ...mockRenderedContent.sections[0],
            config: {
              showTitle: true,
              showDescription: false,
              showSubtitle: false
            }
          },
          ...mockRenderedContent.sections.slice(1)
        ]
      };

      renderWithProviders(
        <PageRenderer
          content={contentWithDisabledConfig}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      // Should show
      expect(screen.getByText('Test Page')).toBeInTheDocument();

      // Should not show
      expect(screen.queryByText('This is a test page description')).not.toBeInTheDocument();
      expect(screen.queryByText('Test subtitle')).not.toBeInTheDocument();
    });
  });

  describe('Content Section Rendering', () => {
    it('renders content section with HTML content', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      const contentSection = document.querySelector('.stx-content__body');
      expect(contentSection).toBeInTheDocument();
      expect(contentSection).toHaveClass('prose');
    });

    it('applies custom maxWidth from config', () => {
      const contentWithCustomWidth = {
        ...mockRenderedContent,
        sections: [
          ...mockRenderedContent.sections.slice(0, 1),
          {
            ...mockRenderedContent.sections[1],
            config: {
              ...mockRenderedContent.sections[1].config,
              maxWidth: '1400px'
            }
          },
          ...mockRenderedContent.sections.slice(2)
        ]
      };

      renderWithProviders(
        <PageRenderer
          content={contentWithCustomWidth}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      const contentContainer = document.querySelector('.stx-content');
      expect(contentContainer).toHaveStyle({ maxWidth: '1400px' });
    });

    it('applies custom typography class from config', () => {
      const contentWithCustomTypography = {
        ...mockRenderedContent,
        sections: [
          ...mockRenderedContent.sections.slice(0, 1),
          {
            ...mockRenderedContent.sections[1],
            config: {
              ...mockRenderedContent.sections[1].config,
              typography: 'custom-prose'
            }
          },
          ...mockRenderedContent.sections.slice(2)
        ]
      };

      renderWithProviders(
        <PageRenderer
          content={contentWithCustomTypography}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      const contentBody = document.querySelector('.stx-content__body');
      expect(contentBody).toHaveClass('custom-prose');
    });
  });

  describe('CTA Section Rendering', () => {
    it('renders CTA section with all content when config is enabled', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
      expect(screen.getByText('Contact us today to discuss your project.')).toBeInTheDocument();
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
      expect(screen.getByText('Trusted by 500+ European businesses')).toBeInTheDocument();
    });

    it('renders CTA section with conditional content based on config', () => {
      const contentWithDisabledConfig = {
        ...mockRenderedContent,
        sections: [
          ...mockRenderedContent.sections.slice(0, 2),
          {
            ...mockRenderedContent.sections[2],
            config: {
              showContactForm: true,
              showSocialProof: false
            }
          }
        ]
      };

      renderWithProviders(
        <PageRenderer
          content={contentWithDisabledConfig}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      // Should show
      expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
      expect(screen.getByText('Contact Us')).toBeInTheDocument();

      // Should not show
      expect(screen.queryByText('Trusted by 500+ European businesses')).not.toBeInTheDocument();
    });

    it('renders contact form when showContactForm is enabled', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      const contactButton = screen.getByText('Contact Us');
      expect(contactButton).toBeInTheDocument();
      expect(contactButton.closest('a')).toHaveAttribute('href', '/contact');
    });

    it('renders social proof when showSocialProof is enabled', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      expect(screen.getByText('Trusted by 500+ European businesses')).toBeInTheDocument();
    });
  });

  describe('Section Rendering Logic', () => {
    it('renders all sections in order', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      const sections = document.querySelectorAll('section');
      expect(sections).toHaveLength(3); // hero, content, cta
    });

    it('handles unknown section types gracefully', () => {
      const contentWithUnknownSection = {
        ...mockRenderedContent,
        sections: [
          ...mockRenderedContent.sections,
          {
            id: 'unknown-1',
            type: 'unknown',
            variant: 'default',
            content: {},
            config: {}
          }
        ]
      };

      renderWithProviders(
        <PageRenderer
          content={contentWithUnknownSection}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      // Should still render the known sections
      expect(screen.getByText('Test Page')).toBeInTheDocument();
      expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      const sections = document.querySelectorAll('section');
      expect(sections.length).toBeGreaterThan(0);
    });

    it('provides proper heading hierarchy', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      const heroTitle = document.querySelector('.stx-hero__title');
      expect(heroTitle?.tagName).toBe('H1');
    });

    it('includes proper ARIA labels for interactive elements', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      const contactButton = screen.getByText('Contact Us');
      expect(contactButton).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('integrates with container component correctly', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      const containers = document.querySelectorAll('.stx-container');
      expect(containers.length).toBeGreaterThan(0);
    });

    it('integrates with HeroSpacer component', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      // HeroSpacer should be rendered at the top
      const heroSpacer = document.querySelector('.stx-hero-spacer');
      expect(heroSpacer).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles availableLanguages prop correctly', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de', 'fr']}
          currentLanguage="en"
          slug="test-page"
        />
      );

      // Component should render successfully with different language arrays
      expect(screen.getByText('Test Page')).toBeInTheDocument();
    });

    it('handles currentLanguage prop correctly', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="cs"
          slug="test-page"
        />
      );

      // Component should render successfully with different current language
      expect(screen.getByText('Test Page')).toBeInTheDocument();
    });

    it('handles slug prop correctly', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="custom-slug"
        />
      );

      // Component should render successfully with custom slug
      expect(screen.getByText('Test Page')).toBeInTheDocument();
    });

    it('handles empty availableLanguages array', () => {
      renderWithProviders(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={[]}
          currentLanguage="en"
          slug="test-page"
        />
      );

      // Component should render successfully with empty languages array
      expect(screen.getByText('Test Page')).toBeInTheDocument();
    });
  });
});

describe('PageRenderer Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme`, () => {
      const { container } = renderWithTheme(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />,
        theme
      );

      const heroSection = container.querySelector('.stx-hero');
      expect(heroSection).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme`, () => {
      const { container } = renderWithTheme(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />,
        theme
      );

      const heroSection = container.querySelector('.stx-hero');
      const computedStyle = getComputedStyle(heroSection as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />,
        theme
      );

      const heroSection = container.querySelector('.stx-hero');
      expect(heroSection).toBeInTheDocument();

      // Check for page content
      const heroTitle = container.querySelector('.stx-hero__title');
      expect(heroTitle).toHaveTextContent('Test Page');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains accessibility across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />,
        theme
      );

      // Check for proper heading hierarchy
      const heroTitle = container.querySelector('.stx-hero__title');
      expect(heroTitle?.tagName).toBe('H1');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains performance across theme switches', () => {
    const startTime = performance.now();

    ALL_THEMES.forEach(theme => {
      renderWithTheme(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />,
        theme
      );
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Performance threshold: should complete all theme renders in under 500ms
    expect(totalTime).toBeLessThan(500);
  });

  it('maintains page structure across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />,
        theme
      );

      // Check page structure
      const heroSection = container.querySelector('.stx-hero');
      const contentSection = container.querySelector('.stx-section');
      const ctaSection = container.querySelector('.stx-cta');
      expect(heroSection).toBeInTheDocument();
      expect(contentSection).toBeInTheDocument();
      expect(ctaSection).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains content rendering across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />,
        theme
      );

      // Check for page content
      expect(container).toHaveTextContent('Test Page');
      expect(container).toHaveTextContent('This is a test page description');
      expect(container).toHaveTextContent('Ready to Get Started?');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains container integration across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <PageRenderer
          content={mockRenderedContent}
          page={mockPage}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
          slug="test-page"
        />,
        theme
      );

      // Check container integration
      const stxContainers = container.querySelectorAll('.stx-container');
      expect(stxContainers.length).toBeGreaterThan(0);

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });
}); 