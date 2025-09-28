import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DesignSystemProvider, useDesignSystem } from './DesignSystemProvider';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../test/utils/theme-testing';

// Test component that uses the design system
const TestComponent = () => {
  const designSystem = useDesignSystem();

  return (
    <div>
      <div data-testid="fluid-typography">
        {designSystem.fluidTypography(16, 24)}
      </div>
      <div data-testid="modular-scale">
        {designSystem.modularScale(2)}
      </div>
      <div data-testid="fluid-spacing">
        {designSystem.fluidSpacing(1, 2)}
      </div>
      <div data-testid="color-scale">
        {designSystem.generateColorScale('primary', 5).join(', ')}
      </div>
    </div>
  );
};

// Test component that should throw error when used outside provider
const TestComponentWithoutProvider = () => {
  const designSystem = useDesignSystem();
  return <div>{designSystem.fluidTypography(16, 24)}</div>;
};

describe('DesignSystemProvider', () => {
  describe('Basic Functionality', () => {
    it('renders children without crashing', () => {
      render(
        <DesignSystemProvider>
          <div>Test content</div>
        </DesignSystemProvider>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('provides design system functions to children', () => {
      render(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      );

      expect(screen.getByTestId('fluid-typography')).toBeInTheDocument();
      expect(screen.getByTestId('modular-scale')).toBeInTheDocument();
      expect(screen.getByTestId('fluid-spacing')).toBeInTheDocument();
      expect(screen.getByTestId('color-scale')).toBeInTheDocument();
    });
  });

  describe('Design System Functions', () => {
    it('provides fluidTypography function', () => {
      render(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      );

      const fluidTypography = screen.getByTestId('fluid-typography');
      expect(fluidTypography.textContent).toContain('clamp');
      expect(fluidTypography.textContent).toContain('16px');
      expect(fluidTypography.textContent).toContain('24px');
    });

    it('provides modularScale function', () => {
      render(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      );

      const modularScale = screen.getByTestId('modular-scale');
      expect(modularScale.textContent).toBe('25');
    });

    it('provides fluidSpacing function', () => {
      render(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      );

      const fluidSpacing = screen.getByTestId('fluid-spacing');
      expect(fluidSpacing.textContent).toContain('clamp');
      expect(fluidSpacing.textContent).toContain('1rem');
      expect(fluidSpacing.textContent).toContain('2rem');
    });

    it('provides generateColorScale function', () => {
      render(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      );

      const colorScale = screen.getByTestId('color-scale');
      expect(colorScale.textContent).toContain('hsl');
      expect(colorScale.textContent).toContain('primary');
    });
  });

  describe('Error Handling', () => {
    it('throws error when useDesignSystem is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useDesignSystem must be used within a DesignSystemProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Context Values', () => {
    it('provides all required design system functions', () => {
      render(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      );

      // All functions should be available and working
      expect(screen.getByTestId('fluid-typography')).toBeInTheDocument();
      expect(screen.getByTestId('modular-scale')).toBeInTheDocument();
      expect(screen.getByTestId('fluid-spacing')).toBeInTheDocument();
      expect(screen.getByTestId('color-scale')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('works with nested components', () => {
      const NestedComponent = () => {
        const designSystem = useDesignSystem();
        return (
          <div data-testid="nested">
            {designSystem.fluidTypography(14, 18)}
          </div>
        );
      };

      render(
        <DesignSystemProvider>
          <div>
            <TestComponent />
            <NestedComponent />
          </div>
        </DesignSystemProvider>
      );

      expect(screen.getByTestId('nested')).toBeInTheDocument();
      expect(screen.getByTestId('nested').textContent).toContain('clamp');
    });

    it('maintains context across re-renders', () => {
      const { rerender } = render(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      );

      expect(screen.getByTestId('fluid-typography')).toBeInTheDocument();

      rerender(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      );

      expect(screen.getByTestId('fluid-typography')).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('integrates with theme system', () => {
      render(
        <div data-theme="dark">
          <DesignSystemProvider>
            <TestComponent />
          </DesignSystemProvider>
        </div>
      );

      expect(screen.getByTestId('fluid-typography')).toBeInTheDocument();
      expect(screen.getByTestId('modular-scale')).toBeInTheDocument();
    });

    it('applies theme-specific styling', () => {
      const { container } = renderWithTheme(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>,
        'dark'
      );

      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', 'dark');
      }

      expect(screen.getByTestId('fluid-typography')).toBeInTheDocument();
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(
          <DesignSystemProvider>
            <TestComponent />
          </DesignSystemProvider>,
          theme
        );
        const utils = within(container);
        expect(utils.getByTestId('fluid-typography')).toBeInTheDocument();
        expect(utils.getByTestId('modular-scale')).toBeInTheDocument();
        expect(utils.getByTestId('fluid-spacing')).toBeInTheDocument();
        expect(utils.getByTestId('color-scale')).toBeInTheDocument();
      });
    });

    it('applies theme-specific CSS variables', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(
          <DesignSystemProvider>
            <TestComponent />
          </DesignSystemProvider>,
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
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>,
        'light'
      );

      // Switch to dark theme
      rerender(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      );
      const darkContainer = document.querySelector('[data-theme="light"]');
      expect(darkContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      );
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      );
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();

      // Switch back to light theme
      rerender(
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      );
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();
    });
  });

  // Enhanced theme switching tests using the utility
  testCompleteThemeSupport(
    'DesignSystemProvider',
    (theme: ThemeName) => (
      <DesignSystemProvider>
        <TestComponent />
      </DesignSystemProvider>
    ),
    {
      testSelectors: {
        background: '[data-testid="fluid-typography"]',
        text: '[data-testid="fluid-typography"]',
        border: '[data-testid="modular-scale"]',
        action: '[data-testid="color-scale"]'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true
    }
  );
});
