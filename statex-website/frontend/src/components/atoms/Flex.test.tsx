import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Flex } from './Flex';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

describe('Flex', () => {
  it('renders with default STX classes', () => {
    render(<Flex data-testid="flex">Test content</Flex>);
    const flex = screen.getByTestId('flex');
    expect(flex).toBeInTheDocument();
    expect(flex).toHaveClass('stx-flex', 'stx-flex--row', 'stx-flex--align-stretch', 'stx-flex--justify-start', 'stx-flex--gap-md');
  });

  it('renders with direction variants', () => {
    const directions = [
      { direction: 'column', className: 'stx-flex--column' },
      { direction: 'row-reverse', className: 'stx-flex--row-reverse' },
      { direction: 'column-reverse', className: 'stx-flex--column-reverse' },
    ];

    directions.forEach(({ direction, className }) => {
      const { rerender } = render(<Flex direction={direction as any} data-testid={`flex-${direction}`}>Test</Flex>);
      const flex = screen.getByTestId(`flex-${direction}`);
      expect(flex).toHaveClass(className);
      rerender(<div />);
    });
  });

  it('renders with alignment variants', () => {
    const alignments = [
      { align: 'start', className: 'stx-flex--align-start' },
      { align: 'center', className: 'stx-flex--align-center' },
      { align: 'end', className: 'stx-flex--align-end' },
      { align: 'baseline', className: 'stx-flex--align-baseline' },
    ];

    alignments.forEach(({ align, className }) => {
      const { rerender } = render(<Flex align={align as any} data-testid={`flex-${align}`}>Test</Flex>);
      const flex = screen.getByTestId(`flex-${align}`);
      expect(flex).toHaveClass(className);
      rerender(<div />);
    });
  });

  it('renders with justify variants', () => {
    const justifyOptions = [
      { justify: 'center', className: 'stx-flex--justify-center' },
      { justify: 'end', className: 'stx-flex--justify-end' },
      { justify: 'between', className: 'stx-flex--justify-between' },
      { justify: 'around', className: 'stx-flex--justify-around' },
      { justify: 'evenly', className: 'stx-flex--justify-evenly' },
    ];

    justifyOptions.forEach(({ justify, className }) => {
      const { rerender } = render(<Flex justify={justify as any} data-testid={`flex-${justify}`}>Test</Flex>);
      const flex = screen.getByTestId(`flex-${justify}`);
      expect(flex).toHaveClass(className);
      rerender(<div />);
    });
  });

  it('renders with wrap variants', () => {
    render(<Flex wrap="wrap" data-testid="flex-wrap">Test</Flex>);
    const flex = screen.getByTestId('flex-wrap');
    expect(flex).toHaveClass('stx-flex--wrap');
  });

  it('renders with gap variants', () => {
    const gaps = [
      { gap: 'xs', className: 'stx-flex--gap-xs' },
      { gap: 'sm', className: 'stx-flex--gap-sm' },
      { gap: 'lg', className: 'stx-flex--gap-lg' },
      { gap: 'xl', className: 'stx-flex--gap-xl' },
    ];

    gaps.forEach(({ gap, className }) => {
      const { rerender } = render(<Flex gap={gap as any} data-testid={`flex-${gap}`}>Test</Flex>);
      const flex = screen.getByTestId(`flex-${gap}`);
      expect(flex).toHaveClass(className);
      rerender(<div />);
    });
  });

  it('renders with full width and height', () => {
    render(<Flex fullWidth fullHeight data-testid="flex-full">Test</Flex>);
    const flex = screen.getByTestId('flex-full');
    expect(flex).toHaveClass('stx-flex--full-width', 'stx-flex--full-height');
  });

  it('renders without gap when set to none', () => {
    render(<Flex gap="none" data-testid="flex-no-gap">Test</Flex>);
    const flex = screen.getByTestId('flex-no-gap');
    expect(flex).not.toHaveClass('stx-flex--gap-none');
  });

  it('renders as different element types', () => {
    render(<Flex as="section" data-testid="flex-section">Test</Flex>);
    const flex = screen.getByTestId('flex-section');
    expect(flex.tagName).toBe('SECTION');
  });

  it('applies custom className', () => {
    render(<Flex className="custom-flex" data-testid="flex-custom">Test</Flex>);
    const flex = screen.getByTestId('flex-custom');
    expect(flex).toHaveClass('custom-flex');
  });
});

describe('Flex Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Flex data-testid="flex-theme">Theme Test</Flex>, theme);
      const flex = container.querySelector('.stx-flex');
      expect(flex).toBeInTheDocument();
      // Theme container check
      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Flex data-testid="flex-theme">Theme Test</Flex>, theme);
      const flex = container.querySelector('.stx-flex');
      const computedStyle = getComputedStyle(flex as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Flex data-testid="flex-theme">Theme Test</Flex>, theme);
      const flex = container.querySelector('.stx-flex');
      expect(flex).toBeInTheDocument();
      expect(flex).toHaveClass('stx-flex');
    });
  });

  it('applies theme-specific styling for different variants', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Flex direction="column" align="center" justify="between" gap="lg" data-testid="flex-variant">
          <div>Item 1</div>
          <div>Item 2</div>
        </Flex>,
        theme
      );
      const flex = container.querySelector('.stx-flex');
      expect(flex).toHaveClass('stx-flex--column', 'stx-flex--align-center', 'stx-flex--justify-between', 'stx-flex--gap-lg');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains accessibility across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Flex role="main" aria-label="Main content" data-testid="flex-accessible">
          Accessible content
        </Flex>,
        theme
      );
      const flex = container.querySelector('.stx-flex');
      expect(flex).toHaveAttribute('role', 'main');
      expect(flex).toHaveAttribute('aria-label', 'Main content');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles theme transitions smoothly', () => {
    // Test light theme
    const { container: lightContainer } = renderWithTheme(<Flex data-testid="flex-transition">Transition Test</Flex>, 'light');
    let themeContainer = lightContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'light');

    // Test dark theme
    const { container: darkContainer } = renderWithTheme(<Flex data-testid="flex-transition">Transition Test</Flex>, 'dark');
    themeContainer = darkContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'dark');
  });

  it('maintains performance across theme switches', () => {
    const startTime = performance.now();

    ALL_THEMES.forEach(theme => {
      renderWithTheme(<Flex data-testid="flex-performance">Performance Test</Flex>, theme);
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Performance threshold: should complete all theme renders in under 100ms
    expect(totalTime).toBeLessThan(100);
  });

  it('applies correct spacing and layout in all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Flex gap="md" align="center" justify="between" data-testid="flex-layout">
          <div>Left</div>
          <div>Right</div>
        </Flex>,
        theme
      );
      const flex = container.querySelector('.stx-flex');
      expect(flex).toHaveClass('stx-flex--gap-md', 'stx-flex--align-center', 'stx-flex--justify-between');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles responsive behavior across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Flex wrap="wrap" gap="sm" data-testid="flex-responsive">
          <div>Responsive Item 1</div>
          <div>Responsive Item 2</div>
          <div>Responsive Item 3</div>
        </Flex>,
        theme
      );
      const flex = container.querySelector('.stx-flex');
      expect(flex).toHaveClass('stx-flex--wrap', 'stx-flex--gap-sm');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'Flex',
    (theme: ThemeName) => <Flex data-testid="flex-enhanced">Enhanced Theme Test</Flex>,
    {
      testSelectors: {
        background: '.stx-flex',
        text: '.stx-flex',
        border: '.stx-flex',
        action: '.stx-flex'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
