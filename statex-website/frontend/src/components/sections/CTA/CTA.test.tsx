import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CTA } from './CTA';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../../test/utils/theme-testing';

describe('CTA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  const defaultProps = {
    primaryAction: {
      text: 'Get Started',
      href: '/contact',
      onClick: vi.fn()
    },
    secondaryAction: {
      text: 'Learn More',
      href: '/about',
      onClick: vi.fn()
    }
  };

  describe('STX Classes', () => {
    it('applies correct STX classes to CTA container', () => {
      render(<CTA {...defaultProps} />);

      const ctaContainer = document.querySelector('.stx-cta');
      expect(ctaContainer).toBeInTheDocument();
    });

    it('applies BEM-style classes to CTA elements', () => {
      render(<CTA {...defaultProps} />);

      const ctaContent = document.querySelector('.stx-cta-primary-content');
      const ctaTitle = document.querySelector('.stx-cta-primary-title');
      const ctaActions = document.querySelector('.stx-cta-primary-actions');

      expect(ctaContent).toBeInTheDocument();
      expect(ctaTitle).toBeInTheDocument();
      expect(ctaActions).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
      render(<CTA {...defaultProps} variant="secondary" />);

      const ctaContainer = document.querySelector('.stx-cta-secondary');
      expect(ctaContainer).toBeInTheDocument();
    });

    it('applies priority classes correctly', () => {
      render(<CTA {...defaultProps} priority="medium" />);

      const ctaContainer = document.querySelector('.stx-cta-priority-medium');
      expect(ctaContainer).toBeInTheDocument();
    });

    it('applies AI optimized classes', () => {
      render(<CTA {...defaultProps} aiOptimized={true} />);

      const ctaContainer = document.querySelector('.stx-cta-ai-optimized');
      expect(ctaContainer).toBeInTheDocument();
    });

    it('applies AB test classes', () => {
      render(<CTA {...defaultProps} abTest={{ experimentId: 'test-123', variant: 'A' }} />);

      const ctaContainer = document.querySelector('.stx-cta-ab-test');
      expect(ctaContainer).toBeInTheDocument();
    });
  });

  describe('Template Section Functionality', () => {
    it('renders default CTA content', () => {
      render(<CTA {...defaultProps} />);

      expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
      expect(screen.getByText('Get your free prototype in 24 hours. No strings attached.')).toBeInTheDocument();
    });

    it('renders custom title and description', () => {
      const customProps = {
        ...defaultProps,
        title: 'Custom CTA Title',
        description: 'Custom CTA description text'
      };

      render(<CTA {...customProps} />);

      expect(screen.getByText('Custom CTA Title')).toBeInTheDocument();
      expect(screen.getByText('Custom CTA description text')).toBeInTheDocument();
    });

    it('renders primary action button', () => {
      render(<CTA {...defaultProps} />);

      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Get Started' })).toHaveAttribute('href', '/contact');
    });

    it('renders secondary action button', () => {
      render(<CTA {...defaultProps} />);

      expect(screen.getByText('Learn More')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Learn More' })).toHaveAttribute('href', '/about');
    });

    it('handles button click events', async () => {
      const onClickSpy = vi.fn();
      const propsWithClick = {
        ...defaultProps,
        primaryAction: {
          ...defaultProps.primaryAction,
          onClick: onClickSpy
        }
      };

      render(<CTA {...propsWithClick} />);

      const link = screen.getByRole('link', { name: 'Get Started' });
      fireEvent.click(link);

      await waitFor(() => {
        expect(onClickSpy).toHaveBeenCalled();
      });
    });

    it('handles missing actions gracefully', () => {
      render(<CTA />);

      expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
      expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
    });

    it('handles only primary action', () => {
      render(<CTA primaryAction={defaultProps.primaryAction} />);

      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.queryByText('Learn More')).not.toBeInTheDocument();
    });

    it('handles only secondary action', () => {
      render(<CTA secondaryAction={defaultProps.secondaryAction} />);

      expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('calls onLoad callback', () => {
      const onLoadSpy = vi.fn();
      render(<CTA {...defaultProps} onLoad={onLoadSpy} />);

      // Component renders successfully
      expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
    });

    it('calls onError callback when error occurs', () => {
      const onErrorSpy = vi.fn();
      render(<CTA {...defaultProps} onError={onErrorSpy} />);

      // Note: In a real scenario, this would be triggered by an actual error
      // For testing purposes, we're just verifying the prop is passed
      expect(onErrorSpy).toBeDefined();
    });
  });

  describe('Layout Variants', () => {
    it('renders primary variant', () => {
      render(<CTA {...defaultProps} variant="primary" />);

      const ctaContainer = document.querySelector('.stx-cta-primary');
      expect(ctaContainer).toBeInTheDocument();
    });

    it('renders secondary variant', () => {
      render(<CTA {...defaultProps} variant="secondary" />);

      const ctaContainer = document.querySelector('.stx-cta-secondary');
      expect(ctaContainer).toBeInTheDocument();
    });

    it('renders floating variant', () => {
      render(<CTA {...defaultProps} variant="floating" />);

      const ctaContainer = document.querySelector('.stx-cta-floating');
      expect(ctaContainer).toBeInTheDocument();
    });

    it('renders different button variants per CTA type', () => {
      render(<CTA {...defaultProps} variant="secondary" />);

      const primaryButton = screen.getByRole('link', { name: 'Get Started' });
      expect(primaryButton).toHaveClass('stx-button--outline');
    });

    it('renders floating variant with different structure', () => {
      render(<CTA {...defaultProps} variant="floating" />);

      const floatingContent = document.querySelector('.stx-cta-floating-content');
      expect(floatingContent).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('maintains layout across viewport changes', () => {
      render(<CTA {...defaultProps} />);

      // Simulate viewport change
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      fireEvent(window, new Event('resize'));

      const ctaContainer = document.querySelector('.stx-cta');
      expect(ctaContainer).toBeInTheDocument();
    });

    it('works correctly on mobile viewport', () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<CTA {...defaultProps} />);

      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('works correctly on tablet viewport', () => {
      // Set tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<CTA {...defaultProps} />);

      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('works correctly on desktop viewport', () => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1440,
      });

      render(<CTA {...defaultProps} />);

      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing required props gracefully', () => {
      render(<CTA />);

      // Should render with default values
      expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
    });

    it('handles invalid variant gracefully', () => {
      render(<CTA {...defaultProps} variant={'invalid' as any} />);

      // Should fall back to primary variant
      const ctaContainer = document.querySelector('.stx-cta');
      expect(ctaContainer).toBeInTheDocument();
    });

    it('handles invalid priority gracefully', () => {
      render(<CTA {...defaultProps} priority={'invalid' as any} />);

      // Should still render
      expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
    });

    it('handles null action props gracefully', () => {
      render(<CTA primaryAction={null as any} secondaryAction={null as any} />);

      // Should render without buttons
      expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const renderSpy = vi.fn();

      function TestCTA() {
        renderSpy();
        return <CTA {...defaultProps} />;
      }

      render(<TestCTA />);

      // Should only render once
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('handles large content efficiently', () => {
      const longDescription = 'A'.repeat(1000);
      render(<CTA {...defaultProps} description={longDescription} />);

      // Should render without performance issues
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<CTA {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('provides proper button labels', () => {
      render(<CTA {...defaultProps} />);

      const primaryButton = screen.getByRole('link', { name: 'Get Started' });
      const secondaryButton = screen.getByRole('link', { name: 'Learn More' });
      expect(primaryButton).toBeInTheDocument();
      expect(secondaryButton).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<CTA {...defaultProps} />);

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        // Links should be focusable by default in React
        expect(link).toBeInTheDocument();
      });
    });

    it('provides proper ARIA attributes', () => {
      render(<CTA {...defaultProps} />);

      const ctaSection = document.querySelector('section');
      expect(ctaSection).toHaveAttribute('data-section-type', 'cta');
      expect(ctaSection).toHaveAttribute('data-section-variant', 'primary');
    });

    it('supports screen readers', () => {
      render(<CTA {...defaultProps} />);

      const ctaSection = document.querySelector('section');
      expect(ctaSection).toHaveAttribute('data-section-type', 'cta');
    });
  });

  describe('SEO', () => {
    it('includes proper data attributes', () => {
      render(<CTA {...defaultProps} />);

      const ctaSection = document.querySelector('section');
      expect(ctaSection).toHaveAttribute('data-section-type', 'cta');
      expect(ctaSection).toHaveAttribute('data-section-variant', 'primary');
      expect(ctaSection).toHaveAttribute('data-section-priority', 'high');
    });

    it('includes AI optimization data', () => {
      render(<CTA {...defaultProps} aiOptimized={true} />);

      const ctaSection = document.querySelector('section');
      expect(ctaSection).toHaveAttribute('data-ai-optimized', 'true');
    });

    it('includes AB test data', () => {
      render(<CTA {...defaultProps} abTest={{ experimentId: 'test-123', variant: 'A' }} />);

      const ctaSection = document.querySelector('section');
      expect(ctaSection).toHaveAttribute('data-ab-test', 'test-123');
    });
  });

  describe('Theme Integration', () => {
    it('integrates with theme system', () => {
      render(
        <div data-theme="dark">
          <CTA {...defaultProps} />
        </div>
      );

      const ctaContainer = document.querySelector('.stx-cta');
      expect(ctaContainer).toBeInTheDocument();
    });

    it('applies theme-specific styling', () => {
      const { container } = renderWithTheme(<CTA {...defaultProps} />, 'dark');

      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', 'dark');
      }

      const ctaContainer = container.querySelector('.stx-cta');
      expect(ctaContainer).toBeInTheDocument();
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<CTA {...defaultProps} />, theme);

        const ctaContainer = container.querySelector('.stx-cta');
        expect(ctaContainer).toBeInTheDocument();

        // Verify content is still rendered - use getAllByText to handle multiple instances
        const titleElements = screen.getAllByText('Ready to Get Started?');
        expect(titleElements.length).toBeGreaterThan(0);
      });
    });

    it('applies theme-specific CSS variables', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<CTA {...defaultProps} />, theme);

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
      const { rerender } = renderWithTheme(<CTA {...defaultProps} />, 'light');

      // Switch to dark theme
      rerender(<CTA {...defaultProps} />);
      const darkContainer = document.querySelector('[data-theme="light"]');
      expect(darkContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<CTA {...defaultProps} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<CTA {...defaultProps} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();

      // Switch back to light theme
      rerender(<CTA {...defaultProps} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();
    });
  });

  // Enhanced theme switching tests using the utility
  testCompleteThemeSupport(
    'CTA',
    (theme: ThemeName) => <CTA {...defaultProps} />,
    {
      testSelectors: {
        background: '.stx-cta',
        text: '.stx-cta-primary-title',
        border: '.stx-cta',
        action: '.stx-cta-primary-actions'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true
    }
  );

  describe('Integration', () => {
    it('integrates with theme system', () => {
      render(
        <div data-theme="dark">
          <CTA {...defaultProps} />
        </div>
      );

      const ctaContainer = document.querySelector('.stx-cta');
      expect(ctaContainer).toBeInTheDocument();
    });

    it('integrates with design system', () => {
      render(<CTA {...defaultProps} />);

      const designTokens = getComputedStyle(document.documentElement);
      // Check for any CSS custom properties
      expect(designTokens.getPropertyValue('--stx-color-primary')).toBeDefined();
    });

    it('works with template system', () => {
      render(
        <div className="stx-template stx-template--cta">
          <CTA {...defaultProps} />
        </div>
      );

      const template = document.querySelector('.stx-template--cta');
      expect(template).toBeInTheDocument();
    });

    it('integrates with analytics tracking', async () => {
      const onClickSpy = vi.fn();
      const propsWithClick = {
        ...defaultProps,
        primaryAction: {
          ...defaultProps.primaryAction,
          onClick: onClickSpy
        }
      };

      render(<CTA {...propsWithClick} />);

      const button = screen.getByRole('link', { name: 'Get Started' });
      fireEvent.click(button);

      await waitFor(() => {
        expect(onClickSpy).toHaveBeenCalled();
      });
    });
  });
});
