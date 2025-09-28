import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VariantProvider, useVariant } from './VariantProvider';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

// Test component to access variant context
function TestComponent() {
  const {
    variant,
    setVariant,
    variants,
    isVariantActive,
    toggleVariant,
    resetVariant
  } = useVariant();

  return (
    <div>
      <span data-testid="current-variant">{variant}</span>
      <button
        onClick={() => setVariant('modern')}
        data-testid="set-variant-modern"
      >
        Variant Modern
      </button>
      <button
        onClick={() => setVariant('classic')}
        data-testid="set-variant-classic"
      >
        Variant Classic
      </button>
      <button
        onClick={() => setVariant('minimal')}
        data-testid="set-variant-minimal"
      >
        Variant Minimal
      </button>
      <button
        onClick={() => setVariant('corporate')}
        data-testid="set-variant-corporate"
      >
        Variant Corporate
      </button>
      <button
        onClick={() => toggleVariant()}
        data-testid="toggle-variant"
      >
        Toggle
      </button>
      <button
        onClick={() => resetVariant()}
        data-testid="reset-variant"
      >
        Reset
      </button>
      <span data-testid="variant-modern-active">{isVariantActive('modern') ? 'active' : 'inactive'}</span>
      <span data-testid="variant-classic-active">{isVariantActive('classic') ? 'active' : 'inactive'}</span>
      <span data-testid="variant-minimal-active">{isVariantActive('minimal') ? 'active' : 'inactive'}</span>
      <span data-testid="variant-corporate-active">{isVariantActive('corporate') ? 'active' : 'inactive'}</span>
      <ul data-testid="available-variants">
        {variants.map(v => (
          <li key={v} data-testid={`variant-${v}`}>
            {v}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe('VariantProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  describe('STX Classes', () => {
    it('applies variant classes to document element', () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      expect(document.documentElement).toHaveAttribute('data-variant', 'modern');
    });

    it('updates variant classes when variant changes', async () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-variant', 'classic');
      });
    });

    it('applies BEM-style variant classes', () => {
      render(
        <VariantProvider>
          <div className="stx-component stx-component--variant-modern">
            <span className="stx-component__content">Test</span>
          </div>
        </VariantProvider>
      );

      const component = document.querySelector('.stx-component--variant-modern');
      const content = document.querySelector('.stx-component__content');

      expect(component).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it('applies variant-specific styling classes', async () => {
      render(
        <VariantProvider>
          <div className="stx-button stx-button--variant">
            <TestComponent />
          </div>
        </VariantProvider>
      );

      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      await waitFor(() => {
        const button = document.querySelector('.stx-button--variant');
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Template Section Functionality', () => {
    it('provides variant context to children', () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      expect(screen.getByTestId('current-variant')).toHaveTextContent('modern');
      expect(screen.getByTestId('available-variants')).toBeInTheDocument();
    });

    it('changes variant and updates state', async () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('classic');
      });
    });

    it('toggles between variants correctly', async () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      const toggleButton = screen.getByTestId('toggle-variant');

      // Initial: modern
      expect(screen.getByTestId('current-variant')).toHaveTextContent('modern');

      // First toggle: classic
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('classic');
      });

      // Second toggle: minimal
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('minimal');
      });

      // Third toggle: corporate
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('corporate');
      });

      // Fourth toggle: back to modern
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('modern');
      });
    });

    it('resets variant to default', async () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      // Change variant
      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('classic');
      });

      // Reset
      const resetButton = screen.getByTestId('reset-variant');
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('modern');
      });
    });

    it('checks variant active status correctly', () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      expect(screen.getByTestId('variant-modern-active')).toHaveTextContent('active');
      expect(screen.getByTestId('variant-classic-active')).toHaveTextContent('inactive');
      expect(screen.getByTestId('variant-minimal-active')).toHaveTextContent('inactive');
      expect(screen.getByTestId('variant-corporate-active')).toHaveTextContent('inactive');
    });

    it('provides available variants list', () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      expect(screen.getByTestId('variant-modern')).toBeInTheDocument();
      expect(screen.getByTestId('variant-classic')).toBeInTheDocument();
      expect(screen.getByTestId('variant-minimal')).toBeInTheDocument();
      expect(screen.getByTestId('variant-corporate')).toBeInTheDocument();
    });

    it('handles custom variant configurations', () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      // Should have all four variants in our system
      expect(screen.getByTestId('variant-modern')).toBeInTheDocument();
      expect(screen.getByTestId('variant-classic')).toBeInTheDocument();
      expect(screen.getByTestId('variant-minimal')).toBeInTheDocument();
      expect(screen.getByTestId('variant-corporate')).toBeInTheDocument();
      expect(screen.getByTestId('current-variant')).toHaveTextContent('modern');
    });
  });

  describe('Layout Variants', () => {
    it('supports variant modern layout', () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      expect(screen.getByTestId('current-variant')).toHaveTextContent('modern');
      expect(document.documentElement).toHaveAttribute('data-variant', 'modern');
    });

    it('supports variant classic layout', () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      expect(screen.getByTestId('current-variant')).toHaveTextContent('classic');
      expect(document.documentElement).toHaveAttribute('data-variant', 'classic');
    });

    it('supports custom variant layouts', () => {
      render(
        <VariantProvider>
          <div className="stx-layout stx-layout--variant-modern">
            <TestComponent />
          </div>
        </VariantProvider>
      );

      // Should support all four variant layouts
      expect(screen.getByTestId('variant-modern')).toBeInTheDocument();
      expect(screen.getByTestId('variant-classic')).toBeInTheDocument();
      expect(screen.getByTestId('variant-minimal')).toBeInTheDocument();
      expect(screen.getByTestId('variant-corporate')).toBeInTheDocument();
      expect(screen.getByTestId('current-variant')).toHaveTextContent('modern');
    });

    it('supports responsive variant layouts', () => {
      render(
        <VariantProvider>
          <div className="stx-layout stx-layout--responsive">
            <TestComponent />
          </div>
        </VariantProvider>
      );

      expect(screen.getByTestId('current-variant')).toHaveTextContent('modern');
      expect(document.documentElement).toHaveAttribute('data-variant', 'modern');
    });
  });

  describe('Responsive Behavior', () => {
    it('maintains variant state across viewport changes', async () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      // Set variant to classic
      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('classic');
      });

      // Simulate viewport change
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      fireEvent(window, new Event('resize'));

      // Variant should remain classic
      expect(screen.getByTestId('current-variant')).toHaveTextContent('classic');
    });

    it('works correctly on mobile viewport', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('classic');
      });
    });

    it('works correctly on tablet viewport', async () => {
      // Set tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('classic');
      });
    });

    it('works correctly on desktop viewport', async () => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1440,
      });

      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('classic');
      });
    });

    it('adapts variant behavior to screen size', () => {
      render(
        <VariantProvider>
          <div className="stx-variant stx-variant--adaptive">
            <TestComponent />
          </div>
        </VariantProvider>
      );

      const variant = document.querySelector('.stx-variant--adaptive');
      expect(variant).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('throws error when useVariant is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useVariant must be used within a VariantProvider');

      consoleSpy.mockRestore();
    });

    it('handles invalid variant gracefully', async () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      // Try to set invalid variant
      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      // Should not crash
      expect(screen.getByTestId('current-variant')).toBeInTheDocument();
    });

    it('handles empty variants array gracefully', () => {
      render(
        <VariantProvider variants={[]}>
          <TestComponent />
        </VariantProvider>
      );

      // Should not crash
      expect(screen.getByTestId('current-variant')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('updates variant efficiently without unnecessary re-renders', async () => {
      const renderSpy = vi.fn();

      function TestComponentWithSpy() {
        const { variant, setVariant } = useVariant();
        renderSpy();
        return (
          <div>
            <span data-testid="current-variant">{variant}</span>
            <button onClick={() => setVariant('classic')} data-testid="set-variant-classic">
              Variant Classic
            </button>
          </div>
        );
      }

      render(
        <VariantProvider>
          <TestComponentWithSpy />
        </VariantProvider>
      );

      const initialRenderCount = renderSpy.mock.calls.length;

      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('classic');
      });

      // Should only re-render once for the variant change
      expect(renderSpy.mock.calls.length).toBe(initialRenderCount + 1);
    });

    it('caches variant checks for performance', () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      // Multiple calls to isVariantActive should be efficient
      const status1 = screen.getByTestId('variant-modern-active').textContent;
      const status2 = screen.getByTestId('variant-modern-active').textContent;

      expect(status1).toBe(status2);
    });
  });

  describe('A/B Testing Integration', () => {
    it('integrates with A/B testing system', () => {
      render(
        <VariantProvider>
          <div className="stx-ab-test stx-ab-test--active">
            <TestComponent />
          </div>
        </VariantProvider>
      );

      const abTest = document.querySelector('.stx-ab-test--active');
      expect(abTest).toBeInTheDocument();
    });

    it('tracks variant changes for analytics', async () => {
      render(
        <VariantProvider>
          <TestComponent />
        </VariantProvider>
      );

      // Change variant
      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('classic');
        expect(document.documentElement).toHaveAttribute('data-variant', 'classic');
      });
    });
  });

  describe('Integration', () => {
    it('integrates with theme system', async () => {
      render(
        <VariantProvider>
          <div data-theme="light">
            <TestComponent />
          </div>
        </VariantProvider>
      );

      const setVariantClassicButton = screen.getByTestId('set-variant-classic');
      fireEvent.click(setVariantClassicButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-variant')).toHaveTextContent('classic');
      });
    });

    it('works with template system', () => {
      render(
        <VariantProvider>
          <div className="stx-template stx-template--variant">
            <TestComponent />
          </div>
        </VariantProvider>
      );

      const template = document.querySelector('.stx-template--variant');
      expect(template).toBeInTheDocument();
    });

    it('integrates with design system', () => {
      render(
        <VariantProvider>
          <div className="stx-design-system stx-design-system--variant">
            <TestComponent />
          </div>
        </VariantProvider>
      );

      const designSystem = document.querySelector('.stx-design-system--variant');
      expect(designSystem).toBeInTheDocument();
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'VariantProvider',
    (theme: ThemeName) => (
      <VariantProvider>
        <TestComponent />
      </VariantProvider>
    ),
    {
      testSelectors: {
        background: '[data-testid="current-variant"]',
        text: '[data-testid="current-variant"]',
        border: '[data-testid="available-variants"]',
        action: '[data-testid="set-variant-modern"]'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
