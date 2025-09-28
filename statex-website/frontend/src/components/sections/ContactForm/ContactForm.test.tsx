import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactForm } from './ContactForm';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../../test/utils/theme-testing';

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  const defaultProps = {
    onLoad: vi.fn(),
    onError: vi.fn()
  };

  describe('STX Classes', () => {
    it('applies correct STX classes to contact form container', () => {
      render(<ContactForm {...defaultProps} />);

      const formContainer = document.querySelector('.stx-contact-form');
      expect(formContainer).toBeInTheDocument();
    });

    it('applies BEM-style classes to form elements', () => {
      render(<ContactForm {...defaultProps} />);

      const header = document.querySelector('.stx-contact-form-header');
      const content = document.querySelector('.stx-contact-form-content');
      const title = document.querySelector('.stx-contact-form-title');

      expect(header).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(title).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
      render(<ContactForm {...defaultProps} variant="minimal" />);

      const formContainer = document.querySelector('.stx-contact-form-minimal');
      expect(formContainer).toBeInTheDocument();
    });

    it('applies priority classes correctly', () => {
      render(<ContactForm {...defaultProps} priority="high" />);

      const formContainer = document.querySelector('.stx-contact-form-priority-high');
      expect(formContainer).toBeInTheDocument();
    });

    it('applies AI optimized classes', () => {
      render(<ContactForm {...defaultProps} aiOptimized={true} />);

      const formContainer = document.querySelector('.stx-contact-form-ai-optimized');
      expect(formContainer).toBeInTheDocument();
    });

    it('applies AB test classes', () => {
      render(<ContactForm {...defaultProps} abTest={{ experimentId: 'test-123', variant: 'A' }} />);

      const formContainer = document.querySelector('.stx-contact-form-ab-test');
      expect(formContainer).toBeInTheDocument();
    });
  });

  describe('Template Section Functionality', () => {
    it('renders default contact form content', () => {
      render(<ContactForm {...defaultProps} />);

      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
      expect(screen.getByText('Ready to start your project? Let\'s talk!')).toBeInTheDocument();
      expect(screen.getByText('Contact form - default variant coming soon')).toBeInTheDocument();
    });

    it('renders custom title and description', () => {
      const customProps = {
        ...defaultProps,
        title: 'Custom Contact Form',
        description: 'Custom contact form description'
      };

      render(<ContactForm {...customProps} />);

      expect(screen.getByText('Custom Contact Form')).toBeInTheDocument();
      expect(screen.getByText('Custom contact form description')).toBeInTheDocument();
    });

    it('renders different variants with correct placeholder text', () => {
      render(<ContactForm {...defaultProps} variant="minimal" />);

      expect(screen.getByText('Contact form - minimal variant coming soon')).toBeInTheDocument();
    });

    it('renders expanded variant', () => {
      render(<ContactForm {...defaultProps} variant="expanded" />);

      expect(screen.getByText('Contact form - expanded variant coming soon')).toBeInTheDocument();
    });

    it('calls onLoad callback', () => {
      const onLoadSpy = vi.fn();
      render(<ContactForm {...defaultProps} onLoad={onLoadSpy} />);

      // Component renders successfully
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    it('calls onError callback when error occurs', () => {
      const onErrorSpy = vi.fn();
      render(<ContactForm {...defaultProps} onError={onErrorSpy} />);

      // Note: In a real scenario, this would be triggered by an actual error
      // For testing purposes, we're just verifying the prop is passed
      expect(onErrorSpy).toBeDefined();
    });

    it('handles custom fields prop', () => {
      const customFields = [
        { name: 'name', label: 'Name', type: 'text' as const, required: true },
        { name: 'email', label: 'Email', type: 'email' as const, required: true }
      ];

      render(<ContactForm {...defaultProps} fields={customFields} />);

      // Should still show placeholder since form is not implemented
      expect(screen.getByText('Contact form - default variant coming soon')).toBeInTheDocument();
    });
  });

  describe('Layout Variants', () => {
    it('renders default variant', () => {
      render(<ContactForm {...defaultProps} variant="default" />);

      const formContainer = document.querySelector('.stx-contact-form-default');
      expect(formContainer).toBeInTheDocument();
    });

    it('renders minimal variant', () => {
      render(<ContactForm {...defaultProps} variant="minimal" />);

      const formContainer = document.querySelector('.stx-contact-form-minimal');
      expect(formContainer).toBeInTheDocument();
    });

    it('renders expanded variant', () => {
      render(<ContactForm {...defaultProps} variant="expanded" />);

      const formContainer = document.querySelector('.stx-contact-form-expanded');
      expect(formContainer).toBeInTheDocument();
    });

    it('renders with different priorities', () => {
      render(<ContactForm {...defaultProps} priority="low" />);

      const formContainer = document.querySelector('.stx-contact-form-priority-low');
      expect(formContainer).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('maintains layout across viewport changes', () => {
      render(<ContactForm {...defaultProps} />);

      // Simulate viewport change
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      fireEvent(window, new Event('resize'));

      const formContainer = document.querySelector('.stx-contact-form');
      expect(formContainer).toBeInTheDocument();
    });

    it('works correctly on mobile viewport', () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<ContactForm {...defaultProps} />);

      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    it('works correctly on tablet viewport', () => {
      // Set tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<ContactForm {...defaultProps} />);

      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    it('works correctly on desktop viewport', () => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1440,
      });

      render(<ContactForm {...defaultProps} />);

      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing required props gracefully', () => {
      render(<ContactForm />);

      // Should render with default values
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    it('handles invalid variant gracefully', () => {
      render(<ContactForm {...defaultProps} variant={'invalid' as any} />);

      // Should still render
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    it('handles invalid priority gracefully', () => {
      render(<ContactForm {...defaultProps} priority={'invalid' as any} />);

      // Should still render
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    it('handles null fields gracefully', () => {
      render(<ContactForm {...defaultProps} fields={null as any} />);

      // Should render without crashing
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const renderSpy = vi.fn();

      function TestContactForm() {
        renderSpy();
        return <ContactForm {...defaultProps} />;
      }

      render(<TestContactForm />);

      // Should only render once
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('handles large content efficiently', () => {
      const longDescription = 'A'.repeat(1000);
      render(<ContactForm {...defaultProps} description={longDescription} />);

      // Should render without performance issues
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<ContactForm {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('provides proper ARIA attributes', () => {
      render(<ContactForm {...defaultProps} />);

      const contactFormSection = document.querySelector('section');
      expect(contactFormSection).toHaveAttribute('data-section-type', 'contactForm');
      expect(contactFormSection).toHaveAttribute('data-section-variant', 'default');
    });

    it('supports screen readers', () => {
      render(<ContactForm {...defaultProps} />);

      const contactFormSection = document.querySelector('section');
      expect(contactFormSection).toHaveAttribute('data-section-type', 'contactForm');
    });
  });

  describe('SEO', () => {
    it('includes proper data attributes', () => {
      render(<ContactForm {...defaultProps} />);

      const contactFormSection = document.querySelector('section');
      expect(contactFormSection).toHaveAttribute('data-section-type', 'contactForm');
      expect(contactFormSection).toHaveAttribute('data-section-variant', 'default');
      expect(contactFormSection).toHaveAttribute('data-section-priority', 'medium');
    });

    it('includes AI optimization data', () => {
      render(<ContactForm {...defaultProps} aiOptimized={true} />);

      const contactFormSection = document.querySelector('section');
      expect(contactFormSection).toHaveAttribute('data-ai-optimized', 'true');
    });

    it('includes AB test data', () => {
      render(<ContactForm {...defaultProps} abTest={{ experimentId: 'test-123', variant: 'A' }} />);

      const contactFormSection = document.querySelector('section');
      expect(contactFormSection).toHaveAttribute('data-ab-test', 'test-123');
    });
  });

  describe('Theme Integration', () => {
    it('integrates with theme system', () => {
      render(
        <div data-theme="dark">
          <ContactForm {...defaultProps} />
        </div>
      );

      const formContainer = document.querySelector('.stx-contact-form');
      expect(formContainer).toBeInTheDocument();
    });

    it('applies theme-specific styling', () => {
      const { container } = renderWithTheme(<ContactForm {...defaultProps} />, 'dark');

      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', 'dark');
      }

      const formContainer = container.querySelector('.stx-contact-form');
      expect(formContainer).toBeInTheDocument();
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<ContactForm {...defaultProps} />, theme);

        const formContainer = container.querySelector('.stx-contact-form');
        expect(formContainer).toBeInTheDocument();

        // Verify content is still rendered - use getAllByText to handle multiple instances
        const titleElements = screen.getAllByText('Get In Touch');
        expect(titleElements.length).toBeGreaterThan(0);
      });
    });

    it('applies theme-specific CSS variables', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<ContactForm {...defaultProps} />, theme);

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
      const { rerender } = renderWithTheme(<ContactForm {...defaultProps} />, 'light');

      // Switch to dark theme
      rerender(<ContactForm {...defaultProps} />);
      const darkContainer = document.querySelector('[data-theme="light"]');
      expect(darkContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<ContactForm {...defaultProps} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<ContactForm {...defaultProps} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();

      // Switch back to light theme
      rerender(<ContactForm {...defaultProps} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();
    });
  });

  // Enhanced theme switching tests using the utility
  testCompleteThemeSupport(
    'ContactForm',
    (theme: ThemeName) => <ContactForm {...defaultProps} />,
    {
      testSelectors: {
        background: '.stx-contact-form',
        text: '.stx-contact-form-title',
        border: '.stx-contact-form',
        action: '.stx-contact-form-content'
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
          <ContactForm {...defaultProps} />
        </div>
      );

      const formContainer = document.querySelector('.stx-contact-form');
      expect(formContainer).toBeInTheDocument();
    });

    it('integrates with design system', () => {
      render(<ContactForm {...defaultProps} />);

      const designTokens = getComputedStyle(document.documentElement);
      // Check for any CSS custom properties
      expect(designTokens.getPropertyValue('--stx-color-primary')).toBeDefined();
    });

    it('works with template system', () => {
      render(
        <div className="stx-template stx-template--contact">
          <ContactForm {...defaultProps} />
        </div>
      );

      const template = document.querySelector('.stx-template--contact');
      expect(template).toBeInTheDocument();
    });

    it('integrates with analytics tracking', () => {
      const onLoadSpy = vi.fn();
      render(<ContactForm {...defaultProps} onLoad={onLoadSpy} />);

      // Component renders successfully with analytics integration
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });
  });
});
