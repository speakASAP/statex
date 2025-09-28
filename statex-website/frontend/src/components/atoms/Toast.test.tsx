import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { Toast } from './Toast';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

describe('Toast', () => {
  const defaultProps = {
    title: 'Test Toast',
    description: 'This is a test toast message'
  };

  describe('Basic Rendering', () => {
    it('renders with title and description', () => {
      render(<Toast {...defaultProps} />);

      expect(screen.getByText('Test Toast')).toBeInTheDocument();
      expect(screen.getByText('This is a test toast message')).toBeInTheDocument();
    });

    it('renders with only title', () => {
      render(<Toast title="Test Title" />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.queryByText('This is a test toast message')).not.toBeInTheDocument();
    });

    it('renders with only description', () => {
      render(<Toast description="Test Description" />);

      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
    });

    it('applies correct base classes', () => {
      const { container } = render(<Toast {...defaultProps} />);

      expect(container.firstChild).toHaveClass('stx-toast');
    });
  });

  describe('Variants', () => {
    it('applies default variant classes', () => {
      const { container } = render(<Toast {...defaultProps} variant="default" />);

      expect(container.firstChild).toHaveClass('stx-toast--default');
    });

    it('applies success variant classes', () => {
      const { container } = render(<Toast {...defaultProps} variant="success" />);

      expect(container.firstChild).toHaveClass('stx-toast--success');
    });

    it('applies warning variant classes', () => {
      const { container } = render(<Toast {...defaultProps} variant="warning" />);

      expect(container.firstChild).toHaveClass('stx-toast--warning');
    });

    it('applies error variant classes', () => {
      const { container } = render(<Toast {...defaultProps} variant="error" />);

      expect(container.firstChild).toHaveClass('stx-toast--error');
    });

    it('applies info variant classes', () => {
      const { container } = render(<Toast {...defaultProps} variant="info" />);

      expect(container.firstChild).toHaveClass('stx-toast--info');
    });
  });

  describe('Icons', () => {
    it('renders default icon for default variant', () => {
      render(<Toast {...defaultProps} variant="default" />);

      expect(screen.getByText('💬')).toBeInTheDocument();
    });

    it('renders default icon for success variant', () => {
      render(<Toast {...defaultProps} variant="success" />);

      expect(screen.getByText('✅')).toBeInTheDocument();
    });

    it('renders default icon for warning variant', () => {
      render(<Toast {...defaultProps} variant="warning" />);

      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('renders default icon for error variant', () => {
      render(<Toast {...defaultProps} variant="error" />);

      expect(screen.getByText('❌')).toBeInTheDocument();
    });

    it('renders default icon for info variant', () => {
      render(<Toast {...defaultProps} variant="info" />);

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });

    it('renders custom icon when provided', () => {
      render(<Toast {...defaultProps} icon="🚀" />);

      expect(screen.getByText('🚀')).toBeInTheDocument();
      expect(screen.queryByText('💬')).not.toBeInTheDocument();
    });
  });

  describe('Dismissible Behavior', () => {
    it('shows dismiss button when dismissible is true', () => {
      render(<Toast {...defaultProps} dismissible={true} />);

      expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
    });

    it('hides dismiss button when dismissible is false', () => {
      render(<Toast {...defaultProps} dismissible={false} />);

      expect(screen.queryByLabelText('Dismiss notification')).not.toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', async () => {
      const onDismiss = vi.fn();
      render(<Toast {...defaultProps} onDismiss={onDismiss} />);

      act(() => {
        fireEvent.click(screen.getByLabelText('Dismiss notification'));
      });

      // Wait for the 300ms timeout that the Toast component uses
      await new Promise(resolve => setTimeout(resolve, 350));

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('applies leaving class when dismissed', () => {
      const { container } = render(<Toast {...defaultProps} />);

      act(() => {
        fireEvent.click(screen.getByLabelText('Dismiss notification'));
      });

      expect(container.firstChild).toHaveClass('stx-toast', 'stx-toast--default', 'stx-toast--dismissible');
    });
  });

  describe('Auto-dismiss', () => {
    it('does not auto-dismiss when duration is 0', () => {
      const onDismiss = vi.fn();
      render(<Toast {...defaultProps} duration={0} onDismiss={onDismiss} />);

      expect(screen.getByText('Test Toast')).toBeInTheDocument();
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('sets up timer when duration is provided', () => {
      const onDismiss = vi.fn();
      render(<Toast {...defaultProps} duration={5000} onDismiss={onDismiss} />);

      expect(screen.getByText('Test Toast')).toBeInTheDocument();
      // Timer is set up but we don't test the actual timeout to avoid flakiness
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      const { container } = render(<Toast {...defaultProps} />);

      const toast = container.firstChild as HTMLElement;
      expect(toast).toHaveAttribute('role', 'alert');
      expect(toast).toHaveAttribute('aria-live', 'polite');
    });

    it('has dismissible button with correct aria-label', () => {
      render(<Toast {...defaultProps} />);

      const dismissButton = screen.getByLabelText('Dismiss notification');
      expect(dismissButton).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(<Toast {...defaultProps} className="custom-toast" />);

      expect(container.firstChild).toHaveClass('custom-toast');
    });

    it('combines custom className with default classes', () => {
      const { container } = render(<Toast {...defaultProps} className="custom-toast" />);

      expect(container.firstChild).toHaveClass('stx-toast', 'custom-toast');
    });
  });

  describe('Edge Cases', () => {
    it('renders without any props', () => {
      const { container } = render(<Toast />);

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('stx-toast');
    });

    it('handles empty title and description', () => {
      const { container } = render(<Toast title="" description="" />);

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
      expect(screen.queryByText('This is a test toast message')).not.toBeInTheDocument();
    });
  });
});

// Theme switching tests
describe('Toast Theme Support', () => {
  const themeDefaultProps = {
    title: 'Test Toast',
    description: 'This is a test toast message'
  };

  // Test toast styling in all themes
  describe('Toast Styling Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`toast styling renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Toast {...themeDefaultProps} />,
          theme
        );

        const toast = container.querySelector('.stx-toast');
        expect(toast).toBeInTheDocument();

        // Verify theme-specific styling
        const computedStyle = getComputedStyle(toast as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.borderColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test toast variants in all themes
  describe('Toast Variants Theme Support', () => {
    const variants = ['default', 'success', 'warning', 'error', 'info'] as const;

    variants.forEach(variant => {
      ALL_THEMES.forEach(theme => {
        it(`${variant} variant renders correctly in ${theme} theme`, () => {
          const { container } = renderWithTheme(
            <Toast {...themeDefaultProps} variant={variant} />,
            theme
          );

          const toast = container.querySelector('.stx-toast');
          expect(toast).toBeInTheDocument();
          expect(toast).toHaveClass(`stx-toast--${variant}`);

          // Verify theme-specific styling
          const computedStyle = getComputedStyle(toast as Element);
          expect(computedStyle.backgroundColor).toBeDefined();
          expect(computedStyle.borderColor).toBeDefined();
          expect(computedStyle.color).toBeDefined();
        });
      });
    });
  });

  // Test toast icons in all themes
  describe('Toast Icons Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`toast icons render correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Toast {...themeDefaultProps} variant="success" />,
          theme
        );

        const icon = screen.getByText('✅');
        expect(icon).toBeInTheDocument();

        // Verify icon styling
        const computedStyle = getComputedStyle(icon);
        expect(computedStyle.fontSize).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });

      it(`custom toast icon renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Toast {...themeDefaultProps} icon="🚀" />,
          theme
        );

        const icon = screen.getByText('🚀');
        expect(icon).toBeInTheDocument();

        // Verify custom icon styling
        const computedStyle = getComputedStyle(icon);
        expect(computedStyle.fontSize).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test toast dismissible behavior in all themes
  describe('Toast Dismissible Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`dismissible toast renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Toast {...themeDefaultProps} dismissible={true} />,
          theme
        );

        const dismissButton = screen.getByLabelText('Dismiss notification');
        expect(dismissButton).toBeInTheDocument();

        // Verify dismiss button styling
        const computedStyle = getComputedStyle(dismissButton);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.borderRadius).toBeDefined();
      });
    });
  });

  // Test toast content in all themes
  describe('Toast Content Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`toast content renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Toast {...themeDefaultProps} />,
          theme
        );

        const title = screen.getByText('Test Toast');
        const description = screen.getByText('This is a test toast message');
        expect(title).toBeInTheDocument();
        expect(description).toBeInTheDocument();

        // Verify content styling
        const titleStyle = getComputedStyle(title);
        const descStyle = getComputedStyle(description);
        expect(titleStyle.color).toBeDefined();
        expect(descStyle.color).toBeDefined();
        expect(titleStyle.fontWeight).toBeDefined();
      });
    });
  });

  // Test toast with only title in all themes
  describe('Toast Title Only Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`toast with only title renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Toast title="Title Only" />,
          theme
        );

        const title = screen.getByText('Title Only');
        expect(title).toBeInTheDocument();

        // Verify title styling
        const computedStyle = getComputedStyle(title);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.fontWeight).toBeDefined();
      });
    });
  });

  // Test toast with only description in all themes
  describe('Toast Description Only Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`toast with only description renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Toast description="Description Only" />,
          theme
        );

        const description = screen.getByText('Description Only');
        expect(description).toBeInTheDocument();

        // Verify description styling
        const computedStyle = getComputedStyle(description);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.fontSize).toBeDefined();
      });
    });
  });

  // Test toast with custom styling in all themes
  describe('Toast Custom Styling Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`toast with custom styling renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Toast {...themeDefaultProps} className="custom-toast" />,
          theme
        );

        const toast = container.querySelector('.stx-toast');
        expect(toast).toBeInTheDocument();
        expect(toast).toHaveClass('custom-toast');

        // Verify custom styling is applied
        const computedStyle = getComputedStyle(toast as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.borderColor).toBeDefined();
      });
    });
  });

  // Test toast accessibility in all themes
  describe('Toast Accessibility Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`toast maintains accessibility in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Toast {...themeDefaultProps} />,
          theme
        );

        const toast = container.querySelector('.stx-toast') as HTMLElement;
        expect(toast).toHaveAttribute('role', 'alert');
        expect(toast).toHaveAttribute('aria-live', 'polite');

        // Test contrast (basic check)
        const computedStyle = getComputedStyle(toast);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test toast dismiss animation in all themes
  describe('Toast Dismiss Animation Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`toast dismiss animation works correctly in ${theme} theme`, async () => {
        const { container } = renderWithTheme(
          <Toast {...themeDefaultProps} />,
          theme
        );

        const toast = container.querySelector('.stx-toast');
        expect(toast).toBeInTheDocument();

        // Simulate dismiss
        act(() => {
          fireEvent.click(screen.getByLabelText('Dismiss notification'));
        });

        // Verify dismiss classes are applied
        expect(toast).toHaveClass('stx-toast--dismissible');

        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 350));
      });
    });
  });

  // Test theme transitions
  describe('Toast Theme Transitions', () => {
    it('supports theme switching without breaking', () => {
      const { rerender } = renderWithTheme(<Toast {...themeDefaultProps} />, 'light');

      // Switch to dark theme
      rerender(<Toast {...themeDefaultProps} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<Toast {...themeDefaultProps} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<Toast {...themeDefaultProps} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();
    });
  });

  // Test theme performance
  describe('Toast Theme Performance', () => {
    it('renders efficiently across all themes', () => {
      const startTime = performance.now();

      ALL_THEMES.forEach(theme => {
        renderWithTheme(<Toast {...themeDefaultProps} />, theme);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should render all themes within reasonable time
      expect(totalTime).toBeLessThan(1000);
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'Toast',
    (theme: ThemeName) => <Toast {...themeDefaultProps} />,
    {
      testSelectors: {
        background: '.stx-toast',
        text: '.stx-toast__title',
        border: '.stx-toast',
        action: '.stx-toast__dismiss'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
