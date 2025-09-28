// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stack } from './Stack';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

describe('Stack', () => {
  it('renders with default classes', () => {
    render(<Stack data-testid="stack">Content</Stack>);
    const stack = screen.getByTestId('stack');
    expect(stack).toBeInTheDocument();
    expect(stack).toHaveClass('stx-stack', 'stx-stack--spacing-md');
  });

  it('renders with all spacing variants', () => {
    const spacings = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    spacings.forEach(spacing => {
      render(<Stack spacing={spacing as any} data-testid={`stack-spacing-${spacing}`}>S</Stack>);
      const stack = screen.getByTestId(`stack-spacing-${spacing}`);
      expect(stack).toHaveClass(`stx-stack--spacing-${spacing}`);
    });
  });

  it('renders with all alignment variants', () => {
    const alignments = ['start', 'center', 'end', 'stretch'] as const;

    alignments.forEach((alignment) => {
      render(
        <Stack alignment={alignment} data-testid={`stack-align-${alignment}`}>
          <div>Item 1</div>
          <div>Item 2</div>
        </Stack>
      );

      const stack = screen.getByTestId(`stack-align-${alignment}`);
      expect(stack).toHaveClass(`stx-stack--alignment-${alignment}`);
    });
  });

  it('renders with all justify variants', () => {
    const justifies = ['start', 'center', 'end', 'between', 'around', 'evenly'] as const;

    justifies.forEach((justify) => {
      render(
        <Stack justify={justify} data-testid={`stack-justify-${justify}`}>
          <div>Item 1</div>
          <div>Item 2</div>
        </Stack>
      );

      const stack = screen.getByTestId(`stack-justify-${justify}`);
      expect(stack).toHaveClass(`stx-stack--justify-${justify}`);
    });
  });

  it('renders with all divider variants', () => {
    const dividers = ['none', 'solid', 'dashed'] as const;

    dividers.forEach((divider) => {
      render(
        <Stack divider={divider} data-testid={`stack-divider-${divider}`}>
          <div>Item 1</div>
          <div>Item 2</div>
        </Stack>
      );

      const stack = screen.getByTestId(`stack-divider-${divider}`);
      if (divider === 'solid' || divider === 'dashed') {
        expect(stack).toHaveClass('stx-stack--divider');
      } else {
        expect(stack).not.toHaveClass('stx-stack--divider');
      }
    });
  });

  it('renders with reverse', () => {
    render(<Stack reverse data-testid="stack-reverse">R</Stack>);
    const stack = screen.getByTestId('stack-reverse');
    expect(stack).toHaveClass('stx-stack--reverse');
  });

  it('renders as different element types', () => {
    render(<Stack as="section" data-testid="stack-section">S</Stack>);
    const stack = screen.getByTestId('stack-section');
    expect(stack.tagName).toBe('SECTION');
  });

  it('applies custom className', () => {
    render(<Stack className="custom-stack" data-testid="stack-custom">C</Stack>);
    const stack = screen.getByTestId('stack-custom');
    expect(stack).toHaveClass('custom-stack');
  });

  it('renders children', () => {
    render(
      <Stack data-testid="stack-children">
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>
    );
    const stack = screen.getByTestId('stack-children');
    expect(stack).toHaveTextContent('Child 1Child 2');
  });
});

describe('Stack Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Stack data-testid="stack-theme">Theme Test</Stack>, theme);
      const stack = container.querySelector('.stx-stack');
      expect(stack).toBeInTheDocument();
      // Theme container check
      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Stack data-testid="stack-theme">Theme Test</Stack>, theme);
      const stack = container.querySelector('.stx-stack');
      const computedStyle = getComputedStyle(stack as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Stack data-testid="stack-theme">Theme Test</Stack>, theme);
      const stack = container.querySelector('.stx-stack');
      expect(stack).toBeInTheDocument();
      expect(stack).toHaveClass('stx-stack');
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'Stack',
    (theme: ThemeName) => <Stack data-testid="stack-enhanced">Enhanced Theme Test</Stack>,
    {
      testSelectors: {
        background: '.stx-stack',
        text: '.stx-stack',
        border: '.stx-stack',
        action: '.stx-stack'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
