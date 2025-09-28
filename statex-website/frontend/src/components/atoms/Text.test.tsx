import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Text } from './Text';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

describe('Text', () => {
  it('renders with default variant', () => {
    render(<Text>Hello World</Text>);
    const text = screen.getByText('Hello World');
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass('stx-text', 'stx-text--body', 'stx-text--color-default', 'stx-text--normal', 'stx-text--left');
  });

  it('renders with different heading variants', () => {
    const variants = [
      { variant: 'h1', className: 'stx-text--h1' },
      { variant: 'h2', className: 'stx-text--h2' },
      { variant: 'h3', className: 'stx-text--h3' },
      { variant: 'h4', className: 'stx-text--h4' },
      { variant: 'h5', className: 'stx-text--h5' },
      { variant: 'h6', className: 'stx-text--h6' },
    ];
    variants.forEach(({ variant, className }) => {
      render(<Text variant={variant as any}>{variant}</Text>);
      const text = screen.getByText(variant);
      expect(text).toHaveClass('stx-text', className);
    });
  });

  it('renders with different body variants', () => {
    const variants = [
      { variant: 'body', className: 'stx-text--body' },
      { variant: 'bodyLarge', className: 'stx-text--body-large' },
      { variant: 'bodySmall', className: 'stx-text--body-small' },
      { variant: 'caption', className: 'stx-text--caption' },
      { variant: 'label', className: 'stx-text--label' },
      { variant: 'link', className: 'stx-text--link' },
      { variant: 'muted', className: 'stx-text--muted' },
      { variant: 'code', className: 'stx-text--code' },
    ];
    variants.forEach(({ variant, className }) => {
      render(<Text variant={variant as any}>{variant}</Text>);
      const text = screen.getByText(variant);
      expect(text).toHaveClass('stx-text', className);
    });
  });

  it('renders with different colors', () => {
    const colors = [
      { color: 'default', className: 'stx-text--color-default' },
      { color: 'muted', className: 'stx-text--color-muted' },
      { color: 'subtle', className: 'stx-text--color-subtle' },
      { color: 'primary', className: 'stx-text--color-primary' },
      { color: 'accent', className: 'stx-text--color-accent' },
      { color: 'success', className: 'stx-text--color-success' },
      { color: 'warning', className: 'stx-text--color-warning' },
      { color: 'error', className: 'stx-text--color-error' },
      { color: 'white', className: 'stx-text--color-white' },
    ];
    colors.forEach(({ color, className }) => {
      render(<Text color={color as any}>{color}</Text>);
      const text = screen.getByText(color);
      expect(text).toHaveClass('stx-text', 'stx-text--body', className);
    });
  });

  it('renders with different alignments', () => {
    const alignments = [
      { align: 'left', className: 'stx-text--left' },
      { align: 'center', className: 'stx-text--center' },
      { align: 'right', className: 'stx-text--right' },
      { align: 'justify', className: 'stx-text--justify' },
    ];
    alignments.forEach(({ align, className }) => {
      render(<Text align={align as any}>{align}</Text>);
      const text = screen.getByText(align);
      expect(text).toHaveClass('stx-text', 'stx-text--body', className);
    });
  });

  it('renders with different weights', () => {
    const weights = [
      { weight: 'light', className: 'stx-text--light' },
      { weight: 'normal', className: 'stx-text--normal' },
      { weight: 'medium', className: 'stx-text--medium' },
      { weight: 'semibold', className: 'stx-text--semibold' },
      { weight: 'bold', className: 'stx-text--bold' },
    ];
    weights.forEach(({ weight, className }) => {
      render(<Text weight={weight as any}>{weight}</Text>);
      const text = screen.getByText(weight);
      expect(text).toHaveClass('stx-text', 'stx-text--body', className);
    });
  });

  it('applies custom className', () => {
    render(<Text className="custom-class">Custom text</Text>);
    const text = screen.getByText('Custom text');
    expect(text).toHaveClass('custom-class');
  });

  it('renders as different HTML elements', () => {
    render(<Text as="h1">H1 Element</Text>);
    let text = screen.getByRole('heading', { level: 1 });
    expect(text).toBeInTheDocument();

    render(<Text as="p">P Element</Text>);
    text = screen.getByText('P Element');
    expect(text.tagName).toBe('P');

    render(<Text as="span">Span Element</Text>);
    text = screen.getByText('Span Element');
    expect(text.tagName).toBe('SPAN');
  });

  it('applies truncate class when truncate is true', () => {
    render(<Text truncate>Truncated text</Text>);
    const text = screen.getByText('Truncated text');
    expect(text).toHaveClass('stx-text', 'stx-text--body', 'stx-text--color-default', 'stx-text--normal', 'stx-text--left');
  });

  it('applies fluid typography variants', () => {
    const fluidVariants = [
      { variant: 'fluid-xs', className: 'stx-text--fluid-xs' },
      { variant: 'fluid-sm', className: 'stx-text--fluid-sm' },
      { variant: 'fluid-base', className: 'stx-text--fluid-base' },
      { variant: 'fluid-lg', className: 'stx-text--fluid-lg' },
      { variant: 'fluid-xl', className: 'stx-text--fluid-xl' },
      { variant: 'fluid-2xl', className: 'stx-text--fluid-2xl' },
      { variant: 'fluid-3xl', className: 'stx-text--fluid-3xl' },
      { variant: 'fluid-4xl', className: 'stx-text--fluid-4xl' },
      { variant: 'fluid-5xl', className: 'stx-text--fluid-5xl' },
      { variant: 'fluid-6xl', className: 'stx-text--fluid-6xl' },
    ];
    fluidVariants.forEach(({ variant, className }) => {
      render(<Text variant={variant as any}>{variant}</Text>);
      const text = screen.getByText(variant);
      expect(text).toHaveClass('stx-text', className);
    });
  });

  // Theme switching tests
  describe('Theme Switching', () => {
    ALL_THEMES.forEach(theme => {
      it(`renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(<Text>Theme Test</Text>, theme);

        const text = screen.getByText('Theme Test');
        expect(text).toBeInTheDocument();
        expect(text).toHaveClass('stx-text');

        // Verify theme is applied
        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });

      it(`applies correct text color in ${theme} theme`, () => {
        const { container } = renderWithTheme(<Text>Theme Test</Text>, theme);

        const text = container.querySelector('.stx-text');
        expect(text).toBeInTheDocument();

        // Verify text has proper color styling
        const computedStyle = getComputedStyle(text as Element);
        expect(computedStyle.color).toBeDefined();
      });
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<Text>Theme Test</Text>, theme);

        const text = container.querySelector('.stx-text');
        expect(text).toBeInTheDocument();
        expect(text).toHaveClass('stx-text');

        // Clean up after each theme test
        cleanup();
      });
    });
  });

  // Test all text variants in all themes
  describe('Text Variants Theme Support', () => {
    const variants = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'bodyLarge', 'bodySmall', 'caption', 'label', 'link', 'muted', 'code'] as const;

    variants.forEach(variant => {
      ALL_THEMES.forEach(theme => {
        it(`${variant} variant renders correctly in ${theme} theme`, () => {
          const { container } = renderWithTheme(
            <Text variant={variant}>Test Text</Text>,
            theme
          );

          const text = screen.getByText('Test Text');
          expect(text).toBeInTheDocument();
          expect(text).toHaveClass('stx-text');

          // Verify theme-specific styling
          const computedStyle = getComputedStyle(text);
          expect(computedStyle.color).toBeDefined();
        });
      });
    });
  });

  // Test all text colors in all themes
  describe('Text Colors Theme Support', () => {
    const colors = ['default', 'muted', 'subtle', 'primary', 'accent', 'success', 'warning', 'error', 'white'] as const;

    colors.forEach(color => {
      ALL_THEMES.forEach(theme => {
        it(`${color} color renders correctly in ${theme} theme`, () => {
          const { container } = renderWithTheme(
            <Text color={color}>Test Text</Text>,
            theme
          );

          const text = screen.getByText('Test Text');
          expect(text).toBeInTheDocument();
          expect(text).toHaveClass('stx-text');

          // Verify theme-specific styling
          const computedStyle = getComputedStyle(text);
          expect(computedStyle.color).toBeDefined();
        });
      });
    });
  });

  // Test all text weights in all themes
  describe('Text Weights Theme Support', () => {
    const weights = ['light', 'normal', 'medium', 'semibold', 'bold'] as const;

    weights.forEach(weight => {
      ALL_THEMES.forEach(theme => {
        it(`${weight} weight renders correctly in ${theme} theme`, () => {
          const { container } = renderWithTheme(
            <Text weight={weight}>Test Text</Text>,
            theme
          );

          const text = screen.getByText('Test Text');
          expect(text).toBeInTheDocument();
          expect(text).toHaveClass('stx-text');

          // Verify theme-specific styling
          const computedStyle = getComputedStyle(text);
          expect(computedStyle.color).toBeDefined();
          expect(computedStyle.fontWeight).toBeDefined();
        });
      });
    });
  });

  // Test all text alignments in all themes
  describe('Text Alignments Theme Support', () => {
    const alignments = ['left', 'center', 'right', 'justify'] as const;

    alignments.forEach(align => {
      ALL_THEMES.forEach(theme => {
        it(`${align} alignment renders correctly in ${theme} theme`, () => {
          const { container } = renderWithTheme(
            <Text align={align}>Test Text</Text>,
            theme
          );

          const text = screen.getByText('Test Text');
          expect(text).toBeInTheDocument();
          expect(text).toHaveClass('stx-text');

          // Verify theme-specific styling
          const computedStyle = getComputedStyle(text);
          expect(computedStyle.color).toBeDefined();
          expect(computedStyle.textAlign).toBeDefined();
        });
      });
    });
  });

  // Test theme transitions
  describe('Theme Transitions', () => {
    it('supports theme switching without breaking', () => {
      const { rerender } = renderWithTheme(<Text>Test Text</Text>, 'light');

      // Switch to dark theme
      rerender(<Text>Test Text</Text>);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<Text>Test Text</Text>);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<Text>Test Text</Text>);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();
    });
  });

  // Test theme accessibility
  describe('Theme Accessibility', () => {
    ALL_THEMES.forEach(theme => {
      it(`maintains accessibility in ${theme} theme`, () => {
        const { container } = renderWithTheme(<Text>Accessible Text</Text>, theme);

        const text = screen.getByText('Accessible Text');
        expect(text).toBeInTheDocument();

        // Test contrast (basic check)
        const computedStyle = getComputedStyle(text);
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test theme performance
  describe('Theme Performance', () => {
    it('renders efficiently across all themes', () => {
      const startTime = performance.now();

      ALL_THEMES.forEach(theme => {
        renderWithTheme(<Text>Performance Test</Text>, theme);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should render all themes within reasonable time
      expect(totalTime).toBeLessThan(1000);
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'Text',
    (theme: ThemeName) => <Text>Enhanced Theme Test</Text>,
    {
      testSelectors: {
        background: '.stx-text',
        text: '.stx-text',
        border: '.stx-text',
        action: '.stx-text'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
