import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spacing } from './Spacing';
import { renderWithTheme, ALL_THEMES } from '../../test/utils/theme-testing';

describe('Spacing Component', () => {
  it('renders with default props', () => {
    render(<Spacing data-testid="spacing" />);
    expect(screen.getByTestId('spacing')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    render(<Spacing size="lg" data-testid="spacing" />);
    const element = screen.getByTestId('spacing');
    expect(element).toHaveClass('stx-spacing', 'stx-spacing--lg');
  });

  it('applies correct direction classes', () => {
    render(<Spacing direction="x" size="md" data-testid="spacing" />);
    const element = screen.getByTestId('spacing');
    expect(element).toHaveClass('stx-spacing', 'stx-spacing--md', 'stx-spacing--x');
  });

  it('renders with custom element', () => {
    render(<Spacing as="section" data-testid="spacing" />);
    expect(screen.getByTestId('spacing').tagName).toBe('SECTION');
  });

  it('applies all size variants correctly', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

    sizes.forEach(size => {
      const { unmount } = render(<Spacing size={size} data-testid={`spacing-${size}`} />);
      const element = screen.getByTestId(`spacing-${size}`);
      expect(element).toHaveClass('stx-spacing', `stx-spacing--${size}`);
      unmount();
    });
  });

  it('applies all direction variants correctly', () => {
    const directions = ['all', 'x', 'y', 'top', 'bottom', 'left', 'right'] as const;

    directions.forEach(direction => {
      const { unmount } = render(<Spacing direction={direction} size="md" data-testid={`spacing-${direction}`} />);
      const element = screen.getByTestId(`spacing-${direction}`);

      if (direction === 'all') {
        expect(element).toHaveClass('stx-spacing', 'stx-spacing--md');
      } else if (direction === 'x') {
        expect(element).toHaveClass('stx-spacing', 'stx-spacing--md', 'stx-spacing--x');
      } else if (direction === 'y') {
        expect(element).toHaveClass('stx-spacing', 'stx-spacing--md', 'stx-spacing--y');
      } else {
        expect(element).toHaveClass('stx-spacing', 'stx-spacing--md', `stx-spacing--${direction}`);
      }

      unmount();
    });
  });

  it('combines custom className with generated classes', () => {
    render(<Spacing size="lg" className="custom-class" data-testid="spacing" />);
    const element = screen.getByTestId('spacing');
    expect(element).toHaveClass('stx-spacing', 'stx-spacing--lg', 'custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Spacing ref={ref} data-testid="spacing" />);
    expect(ref.current).toBe(screen.getByTestId('spacing'));
  });

  it('forwards additional props', () => {
    render(<Spacing data-testid="spacing" aria-label="test spacing" />);
    const element = screen.getByTestId('spacing');
    expect(element).toHaveAttribute('aria-label', 'test spacing');
  });
});

describe('Spacing Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Spacing data-testid="spacing-theme" />, theme);
      const spacing = container.querySelector('.stx-spacing');
      expect(spacing).toBeInTheDocument();
      // Theme container check
      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Spacing data-testid="spacing-theme" />, theme);
      const spacing = container.querySelector('.stx-spacing');
      const computedStyle = getComputedStyle(spacing as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Spacing data-testid="spacing-theme" />, theme);
      const spacing = container.querySelector('.stx-spacing');
      expect(spacing).toBeInTheDocument();
      expect(spacing).toHaveClass('stx-spacing');
    });
  });

  it('applies theme-specific styling for different variants', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Spacing size="xl" direction="x" data-testid="spacing-variant" />,
        theme
      );
      const spacing = container.querySelector('.stx-spacing');
      expect(spacing).toHaveClass('stx-spacing--xl', 'stx-spacing--x');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains accessibility across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Spacing role="separator" aria-label="Content spacing" data-testid="spacing-accessible" />,
        theme
      );
      const spacing = container.querySelector('.stx-spacing');
      expect(spacing).toHaveAttribute('role', 'separator');
      expect(spacing).toHaveAttribute('aria-label', 'Content spacing');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles theme transitions smoothly', () => {
    // Test light theme
    const { container: lightContainer } = renderWithTheme(<Spacing data-testid="spacing-transition" />, 'light');
    let themeContainer = lightContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'light');

    // Test dark theme
    const { container: darkContainer } = renderWithTheme(<Spacing data-testid="spacing-transition" />, 'dark');
    themeContainer = darkContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'dark');
  });

  it('maintains performance across theme switches', () => {
    const startTime = performance.now();

    ALL_THEMES.forEach(theme => {
      renderWithTheme(<Spacing data-testid="spacing-performance" />, theme);
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Performance threshold: should complete all theme renders in under 100ms
    expect(totalTime).toBeLessThan(100);
  });

  it('applies correct spacing behavior across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Spacing size="lg" direction="y" data-testid="spacing-behavior" />,
        theme
      );
      const spacing = container.querySelector('.stx-spacing');
      expect(spacing).toHaveClass('stx-spacing--lg', 'stx-spacing--y');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles all size variants across themes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

    ALL_THEMES.forEach(theme => {
      sizes.forEach(size => {
        const { container } = renderWithTheme(
          <Spacing size={size} data-testid={`spacing-size-${size}`} />,
          theme
        );
        const spacing = container.querySelector('.stx-spacing');
        expect(spacing).toHaveClass(`stx-spacing--${size}`);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('handles all direction variants across themes', () => {
    const directions = ['all', 'x', 'y', 'top', 'bottom', 'left', 'right'] as const;

    ALL_THEMES.forEach(theme => {
      directions.forEach(direction => {
        const { container } = renderWithTheme(
          <Spacing direction={direction} size="md" data-testid={`spacing-direction-${direction}`} />,
          theme
        );
        const spacing = container.querySelector('.stx-spacing');

        if (direction === 'all') {
          expect(spacing).toHaveClass('stx-spacing--md');
        } else if (direction === 'x') {
          expect(spacing).toHaveClass('stx-spacing--md', 'stx-spacing--x');
        } else if (direction === 'y') {
          expect(spacing).toHaveClass('stx-spacing--md', 'stx-spacing--y');
        } else {
          expect(spacing).toHaveClass('stx-spacing--md', `stx-spacing--${direction}`);
        }

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('maintains ref forwarding across themes', () => {
    ALL_THEMES.forEach(theme => {
      const ref = { current: null };
      const { container } = renderWithTheme(<Spacing ref={ref} data-testid="spacing-ref" />, theme);

      expect(ref.current).toBe(container.querySelector('.stx-spacing'));

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });
});
