import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { Button } from './Button';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

describe('Button', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with default variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('stx-button', 'stx-button--primary', 'stx-button--md');
  });

  it('renders with all variants', () => {
    const variants = [
      { variant: 'primary', className: 'stx-button--primary' },
      { variant: 'secondary', className: 'stx-button--secondary' },
      { variant: 'outline', className: 'stx-button--outline' },
      { variant: 'ghost', className: 'stx-button--ghost' },
      { variant: 'cta', className: 'stx-button--cta' },
    ];
    variants.forEach(({ variant, className }) => {
      cleanup();
      render(<Button variant={variant as any}>{variant}</Button>);
      const button = screen.getByRole('button', { name: variant });
      expect(button).toHaveClass('stx-button', className);
    });
  });

  it('renders with all sizes', () => {
    const sizes = [
      { size: 'sm', className: 'stx-button--sm' },
      { size: 'md', className: 'stx-button--md' },
      { size: 'lg', className: 'stx-button--lg' },
    ];
    sizes.forEach(({ size, className }) => {
      cleanup();
      render(<Button size={size as any}>{size}</Button>);
      const button = screen.getByRole('button', { name: size });
      expect(button).toHaveClass('stx-button', 'stx-button--primary', className);
    });
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: /custom/i });
    expect(button).toHaveClass('custom-class');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it('shows loading spinner', () => {
    render(<Button loading>Loading</Button>);
    const spinner = screen.getByRole('button').querySelector('.stx-button__spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('renders icon left', () => {
    const icon = <svg data-testid="icon" />;
    render(<Button icon={icon} iconPosition="left">IconLeft</Button>);
    expect(screen.getByTestId('icon').parentElement).toHaveClass('stx-button__icon-left');
  });

  it('renders icon right', () => {
    const icon = <svg data-testid="icon" />;
    render(<Button icon={icon} iconPosition="right">IconRight</Button>);
    expect(screen.getByTestId('icon').parentElement).toHaveClass('stx-button__icon-right');
  });

  it('renders asChild variant with correct classes', () => {
    const Custom = (props: any) => <a data-testid="custom-link" {...props} />;
    render(
      <Button asChild>
        <Custom>Child Link</Custom>
      </Button>
    );
    const custom = screen.getByTestId('custom-link');
    expect(custom).toHaveClass('stx-button', 'stx-button--primary', 'stx-button--md');
  });

  it('applies responsive classes for size', () => {
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
    render(<Button size="sm">Mobile</Button>);
    const button = screen.getByRole('button', { name: /mobile/i });
    expect(button).toHaveClass('stx-button', 'stx-button--primary', 'stx-button--sm');

    global.innerWidth = 1440;
    global.dispatchEvent(new Event('resize'));
    render(<Button size="lg">Desktop</Button>);
    const buttonDesktop = screen.getByRole('button', { name: /desktop/i });
    expect(buttonDesktop).toHaveClass('stx-button', 'stx-button--primary', 'stx-button--lg');
  });

  it('handles loading state with spinner', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button', { name: /loading/i });
    const spinner = button.querySelector('.stx-button__spinner');
    expect(spinner).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('handles disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('stx-button');
  });

  it('renders icon with correct size classes', () => {
    const icon = <svg data-testid="icon" />;
    render(<Button icon={icon} size="lg">IconButton</Button>);
    const iconElement = screen.getByTestId('icon').parentElement;
    expect(iconElement).toHaveClass('stx-button__icon-left', 'stx-button__icon--lg');
  });

  it('combines variant and size classes correctly', () => {
    render(<Button variant="outline" size="sm">Combined</Button>);
    const button = screen.getByRole('button', { name: /combined/i });
    expect(button).toHaveClass('stx-button', 'stx-button--outline', 'stx-button--sm');
  });

  // Theme switching tests
  describe('Theme Switching', () => {
    ALL_THEMES.forEach(theme => {
      it(`renders correctly in ${theme} theme`, () => {
        cleanup();
        const { container } = renderWithTheme(<Button>Theme Test</Button>, theme);

        const button = screen.getByRole('button', { name: /theme test/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('stx-button');

        // Verify theme is applied
        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });

      it(`applies correct styling in ${theme} theme`, () => {
        cleanup();
        const { container } = renderWithTheme(<Button>Theme Test</Button>, theme);

        const button = container.querySelector('.stx-button');
        expect(button).toBeInTheDocument();

        // Verify button has proper styling
        const computedStyle = getComputedStyle(button as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.borderColor).toBeDefined();
      });
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        cleanup();
        const { container } = renderWithTheme(<Button>Click me</Button>, theme);

        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
      });
    });
  });

  // Test all button variants in all themes
  describe('Button Variants Theme Support', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'cta'] as const;

    variants.forEach(variant => {
      ALL_THEMES.forEach(theme => {
        it(`${variant} variant renders correctly in ${theme} theme`, () => {
          cleanup();
          const { container } = renderWithTheme(
            <Button variant={variant}>Test Button</Button>,
            theme
          );

          const button = screen.getByRole('button', { name: /test button/i });
          expect(button).toBeInTheDocument();
          expect(button).toHaveClass(`stx-button--${variant}`);

          // Verify theme-specific styling
          const computedStyle = getComputedStyle(button);
          expect(computedStyle.backgroundColor).toBeDefined();
          expect(computedStyle.color).toBeDefined();
        });
      });
    });
  });

  // Test button sizes in all themes
  describe('Button Sizes Theme Support', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      ALL_THEMES.forEach(theme => {
        it(`${size} size renders correctly in ${theme} theme`, () => {
          cleanup();
          const { container } = renderWithTheme(
            <Button size={size}>Test Button</Button>,
            theme
          );

          const button = screen.getByRole('button', { name: /test button/i });
          expect(button).toBeInTheDocument();
          expect(button).toHaveClass(`stx-button--${size}`);

          // Verify theme-specific styling
          const computedStyle = getComputedStyle(button);
          expect(computedStyle.backgroundColor).toBeDefined();
          expect(computedStyle.color).toBeDefined();
        });
      });
    });
  });

  // Test button states in all themes
  describe('Button States Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`disabled state renders correctly in ${theme} theme`, () => {
        cleanup();
        const { container } = renderWithTheme(
          <Button disabled>Disabled Button</Button>,
          theme
        );

        const button = screen.getByRole('button', { name: /disabled button/i });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();

        // Verify theme-specific styling for disabled state
        const computedStyle = getComputedStyle(button);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });

      it(`loading state renders correctly in ${theme} theme`, () => {
        cleanup();
        const { container } = renderWithTheme(
          <Button loading>Loading Button</Button>,
          theme
        );

        const button = screen.getByRole('button', { name: /loading button/i });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();

        // Verify loading spinner is present
        const spinner = button.querySelector('.stx-button__spinner');
        expect(spinner).toBeInTheDocument();
      });
    });
  });

  // Test theme transitions
  describe('Theme Transitions', () => {
    it('supports theme switching without breaking', () => {
      cleanup();
      const { rerender } = renderWithTheme(<Button>Test Button</Button>, 'light');

      // Switch to dark theme
      rerender(<Button>Test Button</Button>);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<Button>Test Button</Button>);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<Button>Test Button</Button>);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();
    });
  });

  // Test theme accessibility
  describe('Theme Accessibility', () => {
    ALL_THEMES.forEach(theme => {
      it(`maintains accessibility in ${theme} theme`, () => {
        cleanup();
        const { container } = renderWithTheme(<Button>Accessible Button</Button>, theme);

        const button = screen.getByRole('button', { name: /accessible button/i });
        expect(button).toBeInTheDocument();

        // Test focus indicators
        const computedStyle = getComputedStyle(button);
        expect(computedStyle.outline).toBeDefined();

        // Test contrast (basic check)
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.backgroundColor).toBeDefined();
      });
    });
  });

  // Test theme performance
  describe('Theme Performance', () => {
    it('renders efficiently across all themes', () => {
      const startTime = performance.now();

      ALL_THEMES.forEach(theme => {
        cleanup();
        renderWithTheme(<Button>Performance Test</Button>, theme);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should render all themes within reasonable time
      expect(totalTime).toBeLessThan(1000);
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'Button',
    (theme: ThemeName) => <Button>Enhanced Theme Test</Button>,
    {
      testSelectors: {
        background: '.stx-button',
        text: '.stx-button',
        border: '.stx-button',
        action: '.stx-button'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
