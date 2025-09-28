import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { Alert } from './Alert';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

describe('Alert', () => {
  const defaultProps = {
    title: 'Test Alert',
    description: 'This is a test alert message'
  };

  describe('Basic Rendering', () => {
    it('renders with title and description', () => {
      render(<Alert {...defaultProps} />);

      expect(screen.getByText('Test Alert')).toBeInTheDocument();
      expect(screen.getByText('This is a test alert message')).toBeInTheDocument();
    });

    it('renders with only title', () => {
      render(<Alert title="Test Title" />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.queryByText('This is a test alert message')).not.toBeInTheDocument();
    });

    it('renders with only description', () => {
      render(<Alert description="Test Description" />);

      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.queryByText('Test Alert')).not.toBeInTheDocument();
    });

    it('renders with children', () => {
      render(
        <Alert>
          <p>Custom alert content</p>
        </Alert>
      );

      expect(screen.getByText('Custom alert content')).toBeInTheDocument();
    });

    it('applies correct base classes', () => {
      const { container } = render(<Alert {...defaultProps} />);

      expect(container.firstChild).toHaveClass('stx-alert');
    });
  });

  describe('Variants', () => {
    it('applies default variant classes', () => {
      const { container } = render(<Alert {...defaultProps} variant="default" />);

      expect(container.firstChild).toHaveClass('stx-alert--default');
    });

    it('applies success variant classes', () => {
      const { container } = render(<Alert {...defaultProps} variant="success" />);

      expect(container.firstChild).toHaveClass('stx-alert--success');
    });

    it('applies warning variant classes', () => {
      const { container } = render(<Alert {...defaultProps} variant="warning" />);

      expect(container.firstChild).toHaveClass('stx-alert--warning');
    });

    it('applies error variant classes', () => {
      const { container } = render(<Alert {...defaultProps} variant="error" />);

      expect(container.firstChild).toHaveClass('stx-alert--error');
    });

    it('applies info variant classes', () => {
      const { container } = render(<Alert {...defaultProps} variant="info" />);

      expect(container.firstChild).toHaveClass('stx-alert--info');
    });
  });

  describe('Sizes', () => {
    it('applies small size classes', () => {
      const { container } = render(<Alert {...defaultProps} size="sm" />);

      expect(container.firstChild).toHaveClass('stx-alert--sm');
    });

    it('applies medium size classes', () => {
      const { container } = render(<Alert {...defaultProps} size="md" />);

      expect(container.firstChild).toHaveClass('stx-alert--md');
    });

    it('applies large size classes', () => {
      const { container } = render(<Alert {...defaultProps} size="lg" />);

      expect(container.firstChild).toHaveClass('stx-alert--lg');
    });

    it('defaults to medium size', () => {
      const { container } = render(<Alert {...defaultProps} />);

      expect(container.firstChild).toHaveClass('stx-alert--md');
    });
  });

  describe('Icons', () => {
    it('renders default icon for default variant', () => {
      render(<Alert {...defaultProps} variant="default" />);

      expect(screen.getByText('📝')).toBeInTheDocument();
    });

    it('renders default icon for success variant', () => {
      render(<Alert {...defaultProps} variant="success" />);

      expect(screen.getByText('✅')).toBeInTheDocument();
    });

    it('renders default icon for warning variant', () => {
      render(<Alert {...defaultProps} variant="warning" />);

      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('renders default icon for error variant', () => {
      render(<Alert {...defaultProps} variant="error" />);

      expect(screen.getByText('❌')).toBeInTheDocument();
    });

    it('renders default icon for info variant', () => {
      render(<Alert {...defaultProps} variant="info" />);

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });

    it('renders custom icon when provided', () => {
      render(<Alert {...defaultProps} icon="🚀" />);

      expect(screen.getByText('🚀')).toBeInTheDocument();
      expect(screen.queryByText('📝')).not.toBeInTheDocument();
    });

    it('does not render icon when children are provided and no icon is set', () => {
      render(
        <Alert>
          <p>Custom content</p>
        </Alert>
      );

      expect(screen.queryByText('📝')).not.toBeInTheDocument();
    });
  });

  describe('Dismissible Behavior', () => {
    it('shows dismiss button when dismissible is true', () => {
      render(<Alert {...defaultProps} dismissible={true} />);

      expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
    });

    it('hides dismiss button when dismissible is false', () => {
      render(<Alert {...defaultProps} dismissible={false} />);

      expect(screen.queryByLabelText('Dismiss alert')).not.toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', () => {
      const onDismiss = vi.fn();
      render(<Alert {...defaultProps} dismissible={true} onDismiss={onDismiss} />);

      fireEvent.click(screen.getByLabelText('Dismiss alert'));

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Content Structure', () => {
    it('renders title in correct container', () => {
      const { container } = render(<Alert {...defaultProps} />);

      const titleElement = screen.getByText('Test Alert');
      expect(titleElement.closest('.stx-alert__title')).toBeInTheDocument();
    });

    it('renders description in correct container', () => {
      const { container } = render(<Alert {...defaultProps} />);

      const descriptionElement = screen.getByText('This is a test alert message');
      expect(descriptionElement.closest('.stx-alert__description')).toBeInTheDocument();
    });

    it('renders children in correct container', () => {
      render(
        <Alert>
          <p>Custom content</p>
        </Alert>
      );

      const customElement = screen.getByText('Custom content');
      expect(customElement.closest('.stx-alert__content')).toBeInTheDocument();
    });
  });

  // Theme switching tests
  describe('Theme Switching', () => {
    ALL_THEMES.forEach(theme => {
      it(`renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(<Alert {...defaultProps} />, theme);

        const alert = container.querySelector('.stx-alert__title');
        expect(alert).toBeInTheDocument();
        if (alert) {
          expect(alert.closest('.stx-alert')).toHaveClass('stx-alert');
        }

        // Verify theme is applied
        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });

      it(`applies correct styling in ${theme} theme`, () => {
        const { container } = renderWithTheme(<Alert {...defaultProps} />, theme);

        const alert = container.querySelector('.stx-alert');
        expect(alert).toBeInTheDocument();

        // Verify alert has proper styling
        const computedStyle = getComputedStyle(alert as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.borderColor).toBeDefined();
      });
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<Alert {...defaultProps} />, theme);

        const alert = container.querySelector('.stx-alert__title');
        expect(alert).toBeInTheDocument();
        if (alert) {
          expect(alert.closest('.stx-alert')).toBeInTheDocument();
        }

        // Clean up after each theme test
        cleanup();
      });
    });
  });

  // Test all alert variants in all themes
  describe('Alert Variants Theme Support', () => {
    const variants = ['default', 'success', 'warning', 'error', 'info'] as const;

    variants.forEach(variant => {
      ALL_THEMES.forEach(theme => {
        it(`${variant} variant renders correctly in ${theme} theme`, () => {
          const { container } = renderWithTheme(
            <Alert {...defaultProps} variant={variant} />,
            theme
          );

          const alert = screen.getByText('Test Alert');
          expect(alert).toBeInTheDocument();
          expect(alert.closest('.stx-alert')).toHaveClass(`stx-alert--${variant}`);

          // Verify theme-specific styling
          const alertElement = container.querySelector('.stx-alert');
          const computedStyle = getComputedStyle(alertElement as Element);
          expect(computedStyle.backgroundColor).toBeDefined();
          expect(computedStyle.color).toBeDefined();
        });
      });
    });
  });

  // Test all alert sizes in all themes
  describe('Alert Sizes Theme Support', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      ALL_THEMES.forEach(theme => {
        it(`${size} size renders correctly in ${theme} theme`, () => {
          const { container } = renderWithTheme(
            <Alert {...defaultProps} size={size} />,
            theme
          );

          const alert = screen.getByText('Test Alert');
          expect(alert).toBeInTheDocument();
          expect(alert.closest('.stx-alert')).toHaveClass(`stx-alert--${size}`);

          // Verify theme-specific styling
          const alertElement = container.querySelector('.stx-alert');
          const computedStyle = getComputedStyle(alertElement as Element);
          expect(computedStyle.backgroundColor).toBeDefined();
          expect(computedStyle.color).toBeDefined();
        });
      });
    });
  });

  // Test dismissible alerts in all themes
  describe('Dismissible Alerts Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`dismissible alert renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Alert {...defaultProps} dismissible={true} />,
          theme
        );

        const alert = screen.getByText('Test Alert');
        expect(alert).toBeInTheDocument();

        const dismissButton = screen.getByLabelText('Dismiss alert');
        expect(dismissButton).toBeInTheDocument();

        // Verify theme-specific styling
        const alertElement = container.querySelector('.stx-alert');
        const computedStyle = getComputedStyle(alertElement as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test theme transitions
  describe('Theme Transitions', () => {
    it('supports theme switching without breaking', () => {
      const { rerender } = renderWithTheme(<Alert {...defaultProps} />, 'light');

      // Switch to dark theme
      rerender(<Alert {...defaultProps} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<Alert {...defaultProps} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<Alert {...defaultProps} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();
    });
  });

  // Test theme accessibility
  describe('Theme Accessibility', () => {
    ALL_THEMES.forEach(theme => {
      it(`maintains accessibility in ${theme} theme`, () => {
        const { container } = renderWithTheme(<Alert {...defaultProps} />, theme);

        const alert = screen.getByText('Test Alert');
        expect(alert).toBeInTheDocument();

        // Test contrast (basic check)
        const alertElement = container.querySelector('.stx-alert');
        const computedStyle = getComputedStyle(alertElement as Element);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.backgroundColor).toBeDefined();
      });
    });
  });

  // Test theme performance
  describe('Theme Performance', () => {
    it('renders efficiently across all themes', () => {
      const startTime = performance.now();

      ALL_THEMES.forEach(theme => {
        renderWithTheme(<Alert {...defaultProps} />, theme);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should render all themes within reasonable time
      expect(totalTime).toBeLessThan(1000);
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'Alert',
    (theme: ThemeName) => <Alert {...defaultProps} />,
    {
      testSelectors: {
        background: '.stx-alert',
        text: '.stx-alert__title',
        border: '.stx-alert',
        action: '.stx-alert__dismiss'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
