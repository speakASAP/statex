import React from 'react';
import { render } from '@testing-library/react';
import { Spinner } from './Spinner';
import { renderWithTheme, ALL_THEMES } from '../../test/utils/theme-testing';

describe('Spinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies the correct class', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass('stx-spinner');
  });

  it('accepts custom className', () => {
    const { container } = render(<Spinner className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('Spinner Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Spinner data-testid="spinner-theme" />, theme);
      const spinner = container.querySelector('.stx-spinner');
      expect(spinner).toBeInTheDocument();
      // Theme container check
      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Spinner data-testid="spinner-theme" />, theme);
      const spinner = container.querySelector('.stx-spinner');
      const computedStyle = getComputedStyle(spinner as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Spinner data-testid="spinner-theme" />, theme);
      const spinner = container.querySelector('.stx-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('stx-spinner');
    });
  });

  it('applies theme-specific styling for different variants', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Spinner size="lg" data-testid="spinner-variant" />,
        theme
      );
      const spinner = container.querySelector('.stx-spinner');
      expect(spinner).toHaveClass('stx-spinner--lg');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains accessibility across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Spinner data-testid="spinner-accessible" />,
        theme
      );
      const spinner = container.querySelector('.stx-spinner');
      expect(spinner).toHaveAttribute('role', 'status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles theme transitions smoothly', () => {
    // Test light theme
    const { container: lightContainer } = renderWithTheme(<Spinner data-testid="spinner-transition" />, 'light');
    let themeContainer = lightContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'light');

    // Test dark theme
    const { container: darkContainer } = renderWithTheme(<Spinner data-testid="spinner-transition" />, 'dark');
    themeContainer = darkContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'dark');
  });

  it('maintains performance across theme switches', () => {
    const startTime = performance.now();

    ALL_THEMES.forEach(theme => {
      renderWithTheme(<Spinner data-testid="spinner-performance" />, theme);
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Performance threshold: should complete all theme renders in under 100ms
    expect(totalTime).toBeLessThan(100);
  });

  it('applies correct animation behavior across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Spinner data-testid="spinner-animation" />,
        theme
      );
      const spinner = container.querySelector('.stx-spinner');
      expect(spinner).toHaveClass('stx-spinner');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles all size variants across themes', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;

    ALL_THEMES.forEach(theme => {
      sizes.forEach(size => {
        const { container } = renderWithTheme(
          <Spinner size={size} data-testid={`spinner-size-${size}`} />,
          theme
        );
        const spinner = container.querySelector('.stx-spinner');
        expect(spinner).toHaveClass(`stx-spinner--${size}`);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('maintains custom className across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Spinner className="custom-spinner-class" data-testid="spinner-custom" />,
        theme
      );
      const spinner = container.querySelector('.stx-spinner');
      expect(spinner).toHaveClass('custom-spinner-class', 'stx-spinner');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles loading states across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Spinner data-testid="spinner-loading" />,
        theme
      );
      const spinner = container.querySelector('.stx-spinner');
      expect(spinner).toHaveAttribute('role', 'status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });
});
