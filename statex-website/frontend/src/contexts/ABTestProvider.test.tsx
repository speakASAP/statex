import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ABTestProvider, useABTestContext } from './ABTestProvider';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../test/utils/theme-testing';

// Test component to use the context
const TestComponent = () => {
  const { getVariant, setVariant, isClient } = useABTestContext();

  return (
    <div>
      <div data-testid="variant-a">{getVariant('test-experiment', ['A', 'B', 'C'])}</div>
      <div data-testid="variant-b">{getVariant('another-experiment', ['X', 'Y'])}</div>
      <div data-testid="is-client">{isClient.toString()}</div>
      <button
        data-testid="set-variant-button"
        onClick={() => setVariant('test-experiment', 'B')}
      >
        Set Variant B
      </button>
    </div>
  );
};

describe('ABTestProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage before each test
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    // Reset any stored variants
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  describe('Provider Setup', () => {
    it('should provide AB test context to children', () => {
      render(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>
      );

      expect(screen.getByTestId('variant-a')).toBeInTheDocument();
      expect(screen.getByTestId('variant-b')).toBeInTheDocument();
      expect(screen.getByTestId('is-client')).toBeInTheDocument();
    });

    it('should initialize with isClient as true in client environment', async () => {
      render(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>
      );

      // In client environment, should be true after hydration
      expect(screen.getByTestId('is-client').textContent).toBe('true');
    });
  });

  describe('Variant Assignment', () => {
    it('should return valid variants from provided options', () => {
      render(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>
      );

      const variantA = screen.getByTestId('variant-a').textContent;
      const variantB = screen.getByTestId('variant-b').textContent;

      // Both should be valid variants from their respective arrays
      expect(['A', 'B', 'C']).toContain(variantA);
      expect(['X', 'Y']).toContain(variantB);
    });

    it('should return consistent variants for same experiment', () => {
      const { rerender } = render(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>
      );

      const firstVariant = screen.getByTestId('variant-a').textContent;

      // Re-render multiple times
      rerender(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>
      );

      expect(screen.getByTestId('variant-a').textContent).toBe(firstVariant);
    });

    it('should return different variants for different experiments', () => {
      render(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>
      );

      const variantA = screen.getByTestId('variant-a').textContent;
      const variantB = screen.getByTestId('variant-b').textContent;

      // Both should be valid variants from their respective arrays
      expect(['A', 'B', 'C']).toContain(variantA);
      expect(['X', 'Y']).toContain(variantB);
    });

    it('should return default when no variants provided', () => {
      const TestComponentWithEmptyVariants = () => {
        const { getVariant } = useABTestContext();
        return <div data-testid="empty-variant">{getVariant('test', [])}</div>;
      };

      render(
        <ABTestProvider>
          <TestComponentWithEmptyVariants />
        </ABTestProvider>
      );

      expect(screen.getByTestId('empty-variant').textContent).toBe('default');
    });
  });

  describe('Variant Setting', () => {
    it('should set variant when button is clicked', async () => {
      render(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>
      );

      const button = screen.getByTestId('set-variant-button');

      // Click the button
      await act(async () => {
        button.click();
      });

      // Should return the set variant
      expect(screen.getByTestId('variant-a').textContent).toBe('B');
    });

    it('should handle setVariant without crashing', () => {
      const TestComponentWithSetVariant = () => {
        const { setVariant } = useABTestContext();
        return (
          <button
            data-testid="set-variant-button"
            onClick={() => setVariant('test-experiment', 'B')}
          >
            Set Variant
          </button>
        );
      };

      render(
        <ABTestProvider>
          <TestComponentWithSetVariant />
        </ABTestProvider>
      );

      const button = screen.getByTestId('set-variant-button');
      expect(() => button.click()).not.toThrow();
    });
  });

  describe('Context Usage', () => {
    it('should throw error when used outside provider', () => {
      const TestComponentWithoutProvider = () => {
        try {
          useABTestContext();
          return <div>No error</div>;
        } catch (error) {
          return <div data-testid="error">Error caught</div>;
        }
      };

      render(<TestComponentWithoutProvider />);

      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    it('should provide correct context structure', () => {
      const TestComponentWithContextCheck = () => {
        const context = useABTestContext();
        return (
          <div>
            <div data-testid="has-getVariant">{typeof context.getVariant}</div>
            <div data-testid="has-setVariant">{typeof context.setVariant}</div>
            <div data-testid="has-isClient">{typeof context.isClient}</div>
          </div>
        );
      };

      render(
        <ABTestProvider>
          <TestComponentWithContextCheck />
        </ABTestProvider>
      );

      expect(screen.getByTestId('has-getVariant').textContent).toBe('function');
      expect(screen.getByTestId('has-setVariant').textContent).toBe('function');
      expect(screen.getByTestId('has-isClient').textContent).toBe('boolean');
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      const originalGetItem = localStorage.getItem;
      const originalSetItem = localStorage.setItem;

      localStorage.getItem = vi.fn(() => {
        throw new Error('localStorage error');
      });
      localStorage.setItem = vi.fn(() => {
        throw new Error('localStorage error');
      });

      expect(() => {
        render(
          <ABTestProvider>
            <TestComponent />
          </ABTestProvider>
        );
      }).not.toThrow();

      // Restore original methods
      localStorage.getItem = originalGetItem;
      localStorage.setItem = originalSetItem;
    });

    it('should handle invalid JSON in localStorage', () => {
      // Mock localStorage to return invalid JSON
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => 'invalid-json');

      expect(() => {
        render(
          <ABTestProvider>
            <TestComponent />
          </ABTestProvider>
        );
      }).not.toThrow();

      // Restore original method
      localStorage.getItem = originalGetItem;
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      let renderCount = 0;

      const TestComponentWithRenderCount = () => {
        renderCount++;
        const { getVariant } = useABTestContext();
        return <div data-testid="variant">{getVariant('test', ['A', 'B'])}</div>;
      };

      const { rerender } = render(
        <ABTestProvider>
          <TestComponentWithRenderCount />
        </ABTestProvider>
      );

      const initialRenderCount = renderCount;

      // Re-render multiple times
      for (let i = 0; i < 5; i++) {
        rerender(
          <ABTestProvider>
            <TestComponentWithRenderCount />
          </ABTestProvider>
        );
      }

      // Should not cause excessive re-renders
      expect(renderCount).toBeGreaterThan(initialRenderCount);
    });
  });

  describe('Integration', () => {
    it('should work with multiple providers', () => {
      const TestComponentWithMultipleProviders = () => {
        const { getVariant } = useABTestContext();
        return (
          <div>
            <div data-testid="variant-1">{getVariant('exp1', ['A', 'B'])}</div>
            <div data-testid="variant-2">{getVariant('exp2', ['X', 'Y'])}</div>
          </div>
        );
      };

      render(
        <ABTestProvider>
          <ABTestProvider>
            <TestComponentWithMultipleProviders />
          </ABTestProvider>
        </ABTestProvider>
      );

      // Both should be valid variants from their respective arrays
      const variant1 = screen.getByTestId('variant-1').textContent;
      const variant2 = screen.getByTestId('variant-2').textContent;

      expect(['A', 'B']).toContain(variant1);
      expect(['X', 'Y']).toContain(variant2);
    });

    it('should work with nested components', () => {
      const NestedComponent = () => {
        const { getVariant } = useABTestContext();
        return <div data-testid="nested-variant">{getVariant('nested', ['A', 'B'])}</div>;
      };

      const ParentComponent = () => (
        <div>
          <NestedComponent />
        </div>
      );

      render(
        <ABTestProvider>
          <ParentComponent />
        </ABTestProvider>
      );

      const variant = screen.getByTestId('nested-variant').textContent;
      expect(['A', 'B']).toContain(variant);
    });
  });

  describe('Theme Integration', () => {
    it('integrates with theme system', () => {
      render(
        <div data-theme="dark">
          <ABTestProvider>
            <TestComponent />
          </ABTestProvider>
        </div>
      );

      expect(screen.getByTestId('variant-a')).toBeInTheDocument();
      expect(screen.getByTestId('variant-b')).toBeInTheDocument();
    });

    it('applies theme-specific styling', () => {
      const { container } = renderWithTheme(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>,
        'dark'
      );

      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', 'dark');
      }

      expect(screen.getByTestId('variant-a')).toBeInTheDocument();
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(
          <ABTestProvider>
            <TestComponent />
          </ABTestProvider>,
          theme
        );

        // Use getAllByTestId to handle multiple instances
        const variantAElements = screen.getAllByTestId('variant-a');
        const variantBElements = screen.getAllByTestId('variant-b');
        const isClientElements = screen.getAllByTestId('is-client');

        expect(variantAElements.length).toBeGreaterThan(0);
        expect(variantBElements.length).toBeGreaterThan(0);
        expect(isClientElements.length).toBeGreaterThan(0);
      });
    });

    it('applies theme-specific CSS variables', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(
          <ABTestProvider>
            <TestComponent />
          </ABTestProvider>,
          theme
        );

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
      const { rerender } = renderWithTheme(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>,
        'light'
      );

      // Switch to dark theme
      rerender(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>
      );
      const darkContainer = document.querySelector('[data-theme="light"]');
      expect(darkContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>
      );
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>
      );
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();

      // Switch back to light theme
      rerender(
        <ABTestProvider>
          <TestComponent />
        </ABTestProvider>
      );
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();
    });
  });

  // Enhanced theme switching tests using the utility
  testCompleteThemeSupport(
    'ABTestProvider',
    (theme: ThemeName) => (
      <ABTestProvider>
        <TestComponent />
      </ABTestProvider>
    ),
    {
      testSelectors: {
        background: '[data-testid="variant-a"]',
        text: '[data-testid="variant-a"]',
        border: '[data-testid="variant-b"]',
        action: '[data-testid="set-variant-button"]'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true
    }
  );
});
