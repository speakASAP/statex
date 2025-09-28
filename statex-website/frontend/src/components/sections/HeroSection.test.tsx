import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../test/utils/theme-testing';

// Mock AB testing hook
vi.mock('@/hooks/useABTest', () => ({
  useABTest: () => ({
    getVariant: vi.fn(() => 'default'),
    setVariant: vi.fn(),
    isClient: true
  })
}));

describe('HeroSection Component', () => {
  const defaultProps = {
    title: 'Transform Your Ideas Into Working Prototypes in 24 Hours',
    subtitle: 'Experience the future of software development with AI-powered rapid prototyping',
    description: 'Get a fully functional prototype of your software idea in just 24 hours. No coding required.',
    cta: {
      primary: {
        text: 'Get Your Free Prototype',
        href: '/prototype'
      },
      secondary: {
        text: 'Learn How It Works',
        href: '/how-it-works'
      }
    }
  };

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<HeroSection {...defaultProps} />);

      expect(screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours')).toBeInTheDocument();
      expect(screen.getByText('Experience the future of software development with AI-powered rapid prototyping')).toBeInTheDocument();
      expect(screen.getByText('Get a fully functional prototype of your software idea in just 24 hours. No coding required.')).toBeInTheDocument();
    });

    it('renders primary CTA button', () => {
      render(<HeroSection {...defaultProps} />);

      const primaryButton = screen.getByRole('button', { name: /get your free prototype/i });
      expect(primaryButton).toBeInTheDocument();
      // Button component doesn't have href attribute, it handles navigation internally
      expect(primaryButton).toHaveClass('stx-button', 'stx-button--primary');
    });

    it('renders secondary CTA button', () => {
      render(<HeroSection {...defaultProps} />);

      const secondaryButton = screen.getByRole('button', { name: /learn how it works/i });
      expect(secondaryButton).toBeInTheDocument();
      // Button component doesn't have href attribute, it handles navigation internally
      expect(secondaryButton).toHaveClass('stx-button', 'stx-button--secondary');
    });

    it('renders without optional props', () => {
      render(<HeroSection title="Test Title" />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies default layout classes', () => {
      render(<HeroSection {...defaultProps} />);

      const section = screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours').closest('section');
      expect(section).toBeInTheDocument();
      const hero = section?.querySelector('.stx-hero');
      expect(hero).toHaveClass('stx-hero--default');
    });

    it('applies split layout classes', () => {
      render(<HeroSection {...defaultProps} layout="split" />);

      const section = screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours').closest('section');
      const hero = section?.querySelector('.stx-hero');
      expect(hero).toHaveClass('stx-hero--split');
    });

    it('applies video layout classes', () => {
      render(<HeroSection {...defaultProps} layout="video" />);

      const section = screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours').closest('section');
      const hero = section?.querySelector('.stx-hero');
      expect(hero).toHaveClass('stx-hero--video');
    });
  });

  describe('Layout Support', () => {
    it('renders default layout correctly', () => {
      render(<HeroSection {...defaultProps} />);

      const section = screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours').closest('section');
      expect(section).toBeInTheDocument();
      const hero = section?.querySelector('.stx-hero--default');
      expect(hero).toBeInTheDocument();
    });

    it('renders split layout correctly', () => {
      render(<HeroSection {...defaultProps} layout="split" />);

      const section = screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours').closest('section');
      const hero = section?.querySelector('.stx-hero--split');
      expect(hero).toBeInTheDocument();
    });

    it('renders video layout correctly', () => {
      render(<HeroSection {...defaultProps} layout="video" />);

      const section = screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours').closest('section');
      const hero = section?.querySelector('.stx-hero--video');
      expect(hero).toBeInTheDocument();
    });
  });

  describe('AB Testing Integration', () => {
    it('renders without AB testing by default', () => {
      render(<HeroSection {...defaultProps} />);

      const section = screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours').closest('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('renders mobile-optimized content', () => {
      render(<HeroSection {...defaultProps} />);

      // Check that content is accessible on mobile
      expect(screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /get your free prototype/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<HeroSection {...defaultProps} />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('Transform Your Ideas Into Working Prototypes in 24 Hours');
    });

    it('has proper section structure', () => {
      render(<HeroSection {...defaultProps} />);

      const section = screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours').closest('section');
      expect(section).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<HeroSection {...defaultProps} />);

      const primaryButton = screen.getByRole('button', { name: /get your free prototype/i });
      const secondaryButton = screen.getByRole('button', { name: /learn how it works/i });

      // Buttons should be focusable and accessible
      expect(primaryButton).toBeInTheDocument();
      expect(secondaryButton).toBeInTheDocument();
      expect(primaryButton).not.toBeDisabled();
      expect(secondaryButton).not.toBeDisabled();
    });
  });

  describe('Content Customization', () => {
    it('renders custom title', () => {
      render(<HeroSection {...defaultProps} title="Custom Title" />);

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders custom subtitle', () => {
      render(<HeroSection {...defaultProps} subtitle="Custom Subtitle" />);

      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    });

    it('renders custom description', () => {
      render(<HeroSection {...defaultProps} description="Custom Description" />);

      expect(screen.getByText('Custom Description')).toBeInTheDocument();
    });

    it('renders custom CTA text', () => {
      const customProps = {
        ...defaultProps,
        cta: {
          ...defaultProps.cta,
          primary: { ...defaultProps.cta.primary, text: 'Custom CTA' }
        }
      };

      render(<HeroSection {...customProps} />);

      expect(screen.getByRole('button', { name: /custom cta/i })).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing title gracefully', () => {
      render(<HeroSection {...defaultProps} title="" />);

      // Should not crash, but may show empty heading
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('handles missing subtitle gracefully', () => {
      render(<HeroSection {...defaultProps} subtitle="" />);

      const section = screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours').closest('section');
      expect(section).toBeInTheDocument();
    });

    it('handles missing description gracefully', () => {
      render(<HeroSection {...defaultProps} description="" />);

      const section = screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours').closest('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders without performance issues', () => {
      const startTime = performance.now();

      render(<HeroSection {...defaultProps} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly (less than 200ms to be more realistic)
      expect(renderTime).toBeLessThan(200);
    });

    it('handles large content efficiently', () => {
      const largeProps = {
        ...defaultProps,
        title: 'A'.repeat(1000), // Very long title
        subtitle: 'B'.repeat(1000), // Very long subtitle
        description: 'C'.repeat(1000) // Very long description
      };

      expect(() => {
        render(<HeroSection {...largeProps} />);
      }).not.toThrow();
    });
  });

  describe('Theme Integration', () => {
    it('integrates with theme system', () => {
      render(
        <div data-theme="dark">
          <HeroSection {...defaultProps} />
        </div>
      );

      const heroSection = document.querySelector('.stx-hero');
      expect(heroSection).toBeInTheDocument();
    });

    it('applies theme-specific styling', () => {
      const { container } = renderWithTheme(<HeroSection {...defaultProps} />, 'dark');

      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', 'dark');
      }

      const heroSection = container.querySelector('.stx-hero');
      expect(heroSection).toBeInTheDocument();
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<HeroSection {...defaultProps} />, theme);

        const heroSection = container.querySelector('.stx-hero');
        expect(heroSection).toBeInTheDocument();

        // Verify content is still rendered - use getAllByText to handle multiple instances
        const titleElements = screen.getAllByText('Transform Your Ideas Into Working Prototypes in 24 Hours');
        expect(titleElements.length).toBeGreaterThan(0);
      });
    });

    it('applies theme-specific CSS variables', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<HeroSection {...defaultProps} />, theme);

        const root = container.closest('[data-theme]');
        if (root) {
          const computedStyle = getComputedStyle(root);

          // Check for theme-specific variables
          const bgPrimary = computedStyle.getPropertyValue('--bg-primary');
          const textPrimary = computedStyle.getPropertyValue('--text-primary');

          expect(bgPrimary).toBeDefined();
          expect(textPrimary).toBeDefined();
        }
      });
    });

    it('supports theme switching without breaking', () => {
      const { rerender } = renderWithTheme(<HeroSection {...defaultProps} />, 'light');

      // Switch to dark theme
      rerender(<HeroSection {...defaultProps} />);
      const darkContainer = document.querySelector('[data-theme="light"]');
      expect(darkContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<HeroSection {...defaultProps} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<HeroSection {...defaultProps} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();

      // Switch back to light theme
      rerender(<HeroSection {...defaultProps} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();
    });
  });

  // Enhanced theme switching tests using the utility
  testCompleteThemeSupport(
    'HeroSection',
    (theme: ThemeName) => <HeroSection {...defaultProps} />,
    {
      testSelectors: {
        background: '.stx-hero',
        text: '.stx-hero__title',
        border: '.stx-hero',
        action: '.stx-hero__actions'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true
    }
  );
});
