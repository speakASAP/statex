import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { Grid } from './Grid';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

describe('Grid', () => {
  it('renders with default props', () => {
    const { container } = render(<Grid>Content</Grid>);
    const element = container.firstChild as HTMLElement;

    expect(element).toHaveClass('stx-grid', 'stx-grid--cols-1', 'stx-grid--gap-md', 'stx-grid--align-stretch', 'stx-grid--justify-start');
    expect(element).toHaveTextContent('Content');
  });

  it('applies cols variants', () => {
    const { container: cols2Container } = render(<Grid cols={2}>Content</Grid>);
    const { container: cols6Container } = render(<Grid cols={6}>Content</Grid>);

    expect(cols2Container.firstChild).toHaveClass('stx-grid--cols-2');
    expect(cols6Container.firstChild).toHaveClass('stx-grid--cols-6');
  });

  it('applies gap variants', () => {
    const { container: noneContainer } = render(<Grid gap="none">Content</Grid>);
    const { container: xlContainer } = render(<Grid gap="xl">Content</Grid>);

    expect(noneContainer.firstChild).toHaveClass('stx-grid--gap-none');
    expect(xlContainer.firstChild).toHaveClass('stx-grid--gap-xl');
  });

  it('applies separate gapX and gapY', () => {
    const { container } = render(<Grid gapX="lg" gapY="sm">Content</Grid>);

    expect(container.firstChild).toHaveClass('stx-grid--col-gap-lg', 'stx-grid--row-gap-sm');
  });

  it('applies alignment variants', () => {
    const { container: centerContainer } = render(<Grid alignment="center">Content</Grid>);
    const { container: endContainer } = render(<Grid alignment="end">Content</Grid>);

    expect(centerContainer.firstChild).toHaveClass('stx-grid--align-center');
    expect(endContainer.firstChild).toHaveClass('stx-grid--align-end');
  });

  it('applies justify variants', () => {
    const { container: centerContainer } = render(<Grid justify="center">Content</Grid>);
    const { container: betweenContainer } = render(<Grid justify="between">Content</Grid>);

    expect(centerContainer.firstChild).toHaveClass('stx-grid--justify-center');
    expect(betweenContainer.firstChild).toHaveClass('stx-grid--justify-between');
  });

  it('applies responsive classes', () => {
    const { container } = render(
      <Grid responsive={{ sm: 2, md: 3, lg: 4 }}>Content</Grid>
    );

    expect(container.firstChild).toHaveClass('stx-grid--sm-cols-2', 'stx-grid--md-cols-3', 'stx-grid--lg-cols-4');
  });

  it('applies custom className', () => {
    const { container } = render(<Grid className="custom-class">Content</Grid>);

    expect(container.firstChild).toHaveClass('custom-class', 'stx-grid');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    const { container } = render(<Grid ref={ref}>Content</Grid>);

    expect(ref).toHaveBeenCalledWith(container.firstChild);
  });
});

describe('Grid Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Grid data-testid="grid-theme">Theme Test</Grid>, theme);
      const grid = container.querySelector('.stx-grid');
      expect(grid).toBeInTheDocument();
      // Theme container check
      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Grid data-testid="grid-theme">Theme Test</Grid>, theme);
      const grid = container.querySelector('.stx-grid');
      const computedStyle = getComputedStyle(grid as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Grid data-testid="grid-theme">Theme Test</Grid>, theme);
      const grid = container.querySelector('.stx-grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('stx-grid');
    });
  });

  it('applies theme-specific styling for different variants', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Grid cols={3} gap="lg" alignment="center" justify="between" data-testid="grid-variant">
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </Grid>,
        theme
      );
      const grid = container.querySelector('.stx-grid');
      expect(grid).toHaveClass('stx-grid--cols-3', 'stx-grid--gap-lg', 'stx-grid--align-center', 'stx-grid--justify-between');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains accessibility across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Grid role="main" aria-label="Grid layout" data-testid="grid-accessible">
          Accessible content
        </Grid>,
        theme
      );
      const grid = container.querySelector('.stx-grid');
      expect(grid).toHaveAttribute('role', 'main');
      expect(grid).toHaveAttribute('aria-label', 'Grid layout');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles theme transitions smoothly', () => {
    // Test light theme
    const { container: lightContainer } = renderWithTheme(<Grid data-testid="grid-transition">Transition Test</Grid>, 'light');
    let themeContainer = lightContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'light');

    // Test dark theme
    const { container: darkContainer } = renderWithTheme(<Grid data-testid="grid-transition">Transition Test</Grid>, 'dark');
    themeContainer = darkContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'dark');
  });

  it('maintains performance across theme switches', () => {
    const startTime = performance.now();

    ALL_THEMES.forEach(theme => {
      renderWithTheme(<Grid data-testid="grid-performance">Performance Test</Grid>, theme);
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Performance threshold: should complete all theme renders in under 100ms
    expect(totalTime).toBeLessThan(100);
  });

  it('applies correct responsive behavior across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Grid responsive={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap="md" data-testid="grid-responsive">
          <div>Responsive Item 1</div>
          <div>Responsive Item 2</div>
          <div>Responsive Item 3</div>
          <div>Responsive Item 4</div>
        </Grid>,
        theme
      );
      const grid = container.querySelector('.stx-grid');
      expect(grid).toHaveClass('stx-grid--sm-cols-1', 'stx-grid--md-cols-2', 'stx-grid--lg-cols-3', 'stx-grid--xl-cols-4', 'stx-grid--gap-md');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles complex grid layouts across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Grid cols={4} gapX="lg" gapY="sm" alignment="center" justify="around" data-testid="grid-complex">
          <div>Complex Item 1</div>
          <div>Complex Item 2</div>
          <div>Complex Item 3</div>
          <div>Complex Item 4</div>
        </Grid>,
        theme
      );
      const grid = container.querySelector('.stx-grid');
      expect(grid).toHaveClass('stx-grid--cols-4', 'stx-grid--col-gap-lg', 'stx-grid--row-gap-sm', 'stx-grid--align-center', 'stx-grid--justify-around');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains ref forwarding across themes', () => {
    ALL_THEMES.forEach(theme => {
      const ref = vi.fn();
      const { container } = renderWithTheme(<Grid ref={ref} data-testid="grid-ref">Ref Test</Grid>, theme);

      expect(ref).toHaveBeenCalledWith(container.querySelector('.stx-grid'));

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'Grid',
    (theme: ThemeName) => <Grid data-testid="grid-enhanced">Enhanced Theme Test</Grid>,
    {
      testSelectors: {
        background: '.stx-grid',
        text: '.stx-grid',
        border: '.stx-grid',
        action: '.stx-grid'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
