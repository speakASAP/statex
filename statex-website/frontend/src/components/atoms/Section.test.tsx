import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Section } from './Section';
import { renderWithTheme, ALL_THEMES } from '../../test/utils/theme-testing';

describe('Section', () => {
  it('renders with default STX classes', () => {
    render(<Section>Test Section</Section>);
    const section = screen.getByText('Test Section').closest('section');
    expect(section).toHaveClass('stx-section', 'stx-section--spacing-md');
  });

  it('renders with all spacing variants', () => {
    const spacings = [
      { spacing: 'none', className: 'stx-section--spacing-none' },
      { spacing: 'sm', className: 'stx-section--spacing-sm' },
      { spacing: 'md', className: 'stx-section--spacing-md' },
      { spacing: 'lg', className: 'stx-section--spacing-lg' },
      { spacing: 'xl', className: 'stx-section--spacing-xl' },
      { spacing: '2xl', className: 'stx-section--spacing-2xl' },
    ];

    spacings.forEach(({ spacing, className }) => {
      const { rerender } = render(<Section spacing={spacing as any}>Section {spacing}</Section>);
      const section = screen.getByText(`Section ${spacing}`).closest('section');
      expect(section).toHaveClass(className);
      rerender(<div />);
    });
  });

  it('renders with all background variants', () => {
    const backgrounds = [
      { background: 'default', className: 'stx-section--background-default' },
      { background: 'muted', className: 'stx-section--background-muted' },
      { background: 'primary', className: 'stx-section--background-primary' },
      { background: 'accent', className: 'stx-section--background-accent' },
      { background: 'dark', className: 'stx-section--background-dark' },
    ];

    backgrounds.forEach(({ background, className }) => {
      const { rerender } = render(<Section background={background as any}>Section {background}</Section>);
      const section = screen.getByText(`Section ${background}`).closest('section');
      expect(section).toHaveClass(className);
      rerender(<div />);
    });
  });

  it('renders with all alignment variants', () => {
    const alignments = [
      { alignment: 'left', className: 'stx-section--alignment-left' },
      { alignment: 'center', className: 'stx-section--alignment-center' },
      { alignment: 'right', className: 'stx-section--alignment-right' },
    ];

    alignments.forEach(({ alignment, className }) => {
      const { rerender } = render(<Section alignment={alignment as any}>Section {alignment}</Section>);
      const section = screen.getByText(`Section ${alignment}`).closest('section');
      expect(section).toHaveClass(className);
      rerender(<div />);
    });
  });

  it('renders with different HTML elements', () => {
    const elements = ['section', 'div', 'article', 'main'];

    elements.forEach((as) => {
      const { rerender } = render(<Section as={as as any}>Section as {as}</Section>);
      // Get the outermost element by traversing up from the text node
      let element = screen.getByText(`Section as ${as}`);
      if (!element) throw new Error('Element not found');
      while (element.parentElement) {
        if (element.parentElement?.className?.includes('stx-section')) {
          element = element.parentElement;
        } else {
          break;
        }
      }
      expect(element.tagName.toLowerCase()).toBe(as);
      rerender(<div />);
    });
  });

  it('renders with container when container is true', () => {
    render(<Section container={true}>Section with container</Section>);
    const container = screen.getByText('Section with container').closest('.stx-section__container');
    expect(container).toHaveClass('stx-section__container', 'stx-section__container--lg');
  });

  it('renders without container when container is false', () => {
    render(<Section container={false}>Section without container</Section>);
    const textNode = screen.queryByText('Section without container');
    const container = textNode ? textNode.closest('.stx-section__container') : null;
    expect(container).not.toBeInTheDocument();
  });

  it('renders with all container sizes', () => {
    const sizes = [
      { containerSize: 'sm', className: 'stx-section__container--sm' },
      { containerSize: 'md', className: 'stx-section__container--md' },
      { containerSize: 'lg', className: 'stx-section__container--lg' },
      { containerSize: 'xl', className: 'stx-section__container--xl' },
      { containerSize: 'full', className: 'stx-section__container--full' },
    ];

    sizes.forEach(({ containerSize, className }) => {
      const { rerender } = render(
        <Section container={true} containerSize={containerSize as any}>
          Section {containerSize}
        </Section>
      );
      const container = screen.getByText(`Section ${containerSize}`).closest('.stx-section__container');
      expect(container).toHaveClass(className);
      rerender(<div />);
    });
  });

  it('applies custom className', () => {
    render(<Section className="custom-section">Custom Section</Section>);
    const section = screen.getByText('Custom Section').closest('section');
    expect(section).toHaveClass('custom-section');
  });

  it('passes through standard HTML attributes', () => {
    render(<Section id="test-section" data-testid="section">Section with attributes</Section>);
    const section = screen.getByTestId('section');
    expect(section).toHaveAttribute('id', 'test-section');
  });
});

describe('Section Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Section data-testid="section-theme">Theme Test</Section>, theme);
      const section = container.querySelector('.stx-section');
      expect(section).toBeInTheDocument();
      // Theme container check
      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Section data-testid="section-theme">Theme Test</Section>, theme);
      const section = container.querySelector('.stx-section');
      const computedStyle = getComputedStyle(section as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Section data-testid="section-theme">Theme Test</Section>, theme);
      const section = container.querySelector('.stx-section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('stx-section');
    });
  });

  it('applies theme-specific styling for different variants', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Section spacing="lg" background="primary" alignment="center" data-testid="section-variant">
          <div>Item 1</div>
          <div>Item 2</div>
        </Section>,
        theme
      );
      const section = container.querySelector('.stx-section');
      expect(section).toHaveClass('stx-section--spacing-lg', 'stx-section--background-primary', 'stx-section--alignment-center');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains accessibility across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Section role="main" aria-label="Main content section" data-testid="section-accessible">
          Accessible content
        </Section>,
        theme
      );
      const section = container.querySelector('.stx-section');
      expect(section).toHaveAttribute('role', 'main');
      expect(section).toHaveAttribute('aria-label', 'Main content section');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles theme transitions smoothly', () => {
    // Test light theme
    const { container: lightContainer } = renderWithTheme(<Section data-testid="section-transition">Transition Test</Section>, 'light');
    let themeContainer = lightContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'light');

    // Test dark theme
    const { container: darkContainer } = renderWithTheme(<Section data-testid="section-transition">Transition Test</Section>, 'dark');
    themeContainer = darkContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'dark');
  });

  it('maintains performance across theme switches', () => {
    const startTime = performance.now();

    ALL_THEMES.forEach(theme => {
      renderWithTheme(<Section data-testid="section-performance">Performance Test</Section>, theme);
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Performance threshold: should complete all theme renders in under 150ms
    expect(totalTime).toBeLessThan(150);
  });

  it('applies correct container behavior across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Section container={true} containerSize="lg" data-testid="section-container">
          <div>Container content</div>
        </Section>,
        theme
      );
      const sectionContainer = container.querySelector('.stx-section__container');
      expect(sectionContainer).toHaveClass('stx-section__container--lg');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles all background variants across themes', () => {
    const backgrounds = ['default', 'muted', 'primary', 'accent', 'dark'] as const;

    ALL_THEMES.forEach(theme => {
      backgrounds.forEach(background => {
        const { container } = renderWithTheme(
          <Section background={background} data-testid={`section-background-${background}`}>
            Background {background}
          </Section>,
          theme
        );
        const section = container.querySelector('.stx-section');
        expect(section).toHaveClass(`stx-section--background-${background}`);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('handles all spacing variants across themes', () => {
    const spacings = ['none', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

    ALL_THEMES.forEach(theme => {
      spacings.forEach(spacing => {
        const { container } = renderWithTheme(
          <Section spacing={spacing} data-testid={`section-spacing-${spacing}`}>
            Spacing {spacing}
          </Section>,
          theme
        );
        const section = container.querySelector('.stx-section');
        expect(section).toHaveClass(`stx-section--spacing-${spacing}`);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('maintains custom className across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Section className="custom-section-class" data-testid="section-custom">
          Custom section
        </Section>,
        theme
      );
      const section = container.querySelector('.stx-section');
      expect(section).toHaveClass('custom-section-class', 'stx-section');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles different HTML elements across themes', () => {
    const elements = ['section', 'div', 'article', 'main'] as const;

    ALL_THEMES.forEach(theme => {
      elements.forEach(as => {
        const { container } = renderWithTheme(
          <Section as={as} data-testid={`section-element-${as}`}>
            Element {as}
          </Section>,
          theme
        );
        const section = container.querySelector('.stx-section');
        expect(section?.tagName.toLowerCase()).toBe(as);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });
});
