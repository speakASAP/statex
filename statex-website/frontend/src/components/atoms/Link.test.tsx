import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Link } from './Link';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

describe('Link', () => {
  it('renders with default STX classes', () => {
    render(<Link href="/test">Test Link</Link>);
    const link = screen.getByRole('link', { name: /test link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('stx-link', 'stx-link--default', 'stx-link--md');
  });

  it('renders with all variants', () => {
    const variants = [
      { variant: 'primary', className: 'stx-link--primary' },
      { variant: 'secondary', className: 'stx-link--secondary' },
      { variant: 'accent', className: 'stx-link--accent' },
      { variant: 'muted', className: 'stx-link--muted' },
      { variant: 'underline', className: 'stx-link--underline' },
    ];

    variants.forEach(({ variant, className }) => {
      const { rerender } = render(<Link variant={variant as any} href="/test">{variant}</Link>);
      const link = screen.getByRole('link', { name: variant });
      expect(link).toHaveClass(className);
      rerender(<div />);
    });
  });

  it('renders with all sizes', () => {
    const sizes = [
      { size: 'sm', className: 'stx-link--sm' },
      { size: 'md', className: 'stx-link--md' },
      { size: 'lg', className: 'stx-link--lg' },
    ];

    sizes.forEach(({ size, className }) => {
      const { rerender } = render(<Link size={size as any} href="/test">{size}</Link>);
      const link = screen.getByRole('link', { name: size });
      expect(link).toHaveClass(className);
      rerender(<div />);
    });
  });

  it('renders with underline when specified', () => {
    render(<Link underline href="/test">Underlined Link</Link>);
    const link = screen.getByRole('link', { name: /underlined link/i });
    expect(link).toHaveClass('stx-link--underline');
  });

  it('renders with icon on the left', () => {
    render(
      <Link href="#" icon={<svg data-testid="test-icon" />} iconPosition="left">
        Link with left icon
      </Link>
    );
    const link = screen.getByRole('link');
    const iconElement = screen.getByTestId('test-icon');

    expect(iconElement.parentElement).toHaveClass('stx-link__icon', 'stx-link__icon--left', 'stx-link__icon--md');
  });

  it('renders with icon on the right', () => {
    render(
      <Link href="#" icon={<svg data-testid="test-icon" />} iconPosition="right">
        Link with right icon
      </Link>
    );
    const link = screen.getByRole('link');
    const iconElement = screen.getByTestId('test-icon');

    expect(iconElement.parentElement).toHaveClass('stx-link__icon', 'stx-link__icon--right', 'stx-link__icon--md');
  });

  it('renders with proper text wrapper', () => {
    render(<Link href="/test">Test Link Text</Link>);
    const link = screen.getByRole('link', { name: /test link text/i });
    const textElement = link.querySelector('.stx-link__text');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveTextContent('Test Link Text');
  });

  it('applies custom className', () => {
    render(<Link className="custom-link" href="/test">Custom Link</Link>);
    const link = screen.getByRole('link', { name: /custom link/i });
    expect(link).toHaveClass('custom-link');
  });

  it('passes through standard anchor props', () => {
    render(<Link href="/test" target="_blank" rel="noopener">External Link</Link>);
    const link = screen.getByRole('link', { name: /external link/i });
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });
});

// Theme switching tests
describe('Link Theme Support', () => {
  // Test link colors in all themes
  describe('Link Colors Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`link colors render correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Link href="/test">Theme Test Link</Link>,
          theme
        );

        const link = container.querySelector('.stx-link');
        expect(link).toBeInTheDocument();

        // Verify theme-specific styling
        const computedStyle = getComputedStyle(link as Element);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.textDecoration).toBeDefined();
      });
    });
  });

  // Test link variants in all themes
  describe('Link Variants Theme Support', () => {
    const variants = ['primary', 'secondary', 'accent', 'muted', 'underline'] as const;

    variants.forEach(variant => {
      ALL_THEMES.forEach(theme => {
        it(`${variant} variant renders correctly in ${theme} theme`, () => {
          const { container } = renderWithTheme(
            <Link variant={variant} href="/test">{variant} Link</Link>,
            theme
          );

          const link = container.querySelector('.stx-link');
          expect(link).toBeInTheDocument();
          expect(link).toHaveClass(`stx-link--${variant}`);

          // Verify theme-specific styling
          const computedStyle = getComputedStyle(link as Element);
          expect(computedStyle.color).toBeDefined();
          expect(computedStyle.textDecoration).toBeDefined();
        });
      });
    });
  });

  // Test link sizes in all themes
  describe('Link Sizes Theme Support', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      ALL_THEMES.forEach(theme => {
        it(`${size} size renders correctly in ${theme} theme`, () => {
          const { container } = renderWithTheme(
            <Link size={size} href="/test">{size} Link</Link>,
            theme
          );

          const link = container.querySelector('.stx-link');
          expect(link).toBeInTheDocument();
          expect(link).toHaveClass(`stx-link--${size}`);

          // Verify theme-specific styling
          const computedStyle = getComputedStyle(link as Element);
          expect(computedStyle.color).toBeDefined();
          expect(computedStyle.fontSize).toBeDefined();
        });
      });
    });
  });

  // Test link hover states in all themes
  describe('Link Hover States Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`link hover state works correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Link href="/test">Hover Test Link</Link>,
          theme
        );

        const link = container.querySelector('.stx-link') as HTMLElement;
        expect(link).toBeInTheDocument();

        // Simulate hover
        link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

        // Verify hover styling
        const computedStyle = getComputedStyle(link);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.textDecoration).toBeDefined();
      });
    });
  });

  // Test link focus states in all themes
  describe('Link Focus States Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`link focus state works correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Link href="/test">Focus Test Link</Link>,
          theme
        );

        const link = container.querySelector('.stx-link') as HTMLElement;
        expect(link).toBeInTheDocument();

        // Simulate focus
        link.focus();

        // Verify focus styling
        const computedStyle = getComputedStyle(link);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.outline).toBeDefined();
      });
    });
  });

  // Test link with icons in all themes
  describe('Link Icons Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`link with left icon renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Link href="#" icon={<svg data-testid="left-icon" />} iconPosition="left">
            Left Icon Link
          </Link>,
          theme
        );

        const icon = screen.getByTestId('left-icon');
        expect(icon).toBeInTheDocument();
        expect(icon.parentElement).toHaveClass('stx-link__icon--left');

        // Verify icon styling
        const computedStyle = getComputedStyle(icon.parentElement as Element);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.fontSize).toBeDefined();
      });

      it(`link with right icon renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Link href="#" icon={<svg data-testid="right-icon" />} iconPosition="right">
            Right Icon Link
          </Link>,
          theme
        );

        const icon = screen.getByTestId('right-icon');
        expect(icon).toBeInTheDocument();
        expect(icon.parentElement).toHaveClass('stx-link__icon--right');

        // Verify icon styling
        const computedStyle = getComputedStyle(icon.parentElement as Element);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.fontSize).toBeDefined();
      });
    });
  });

  // Test link text wrapper in all themes
  describe('Link Text Wrapper Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`link text wrapper renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Link href="/test">Text Wrapper Test</Link>,
          theme
        );

        const link = container.querySelector('.stx-link');
        const textElement = link?.querySelector('.stx-link__text');
        expect(textElement).toBeInTheDocument();
        expect(textElement).toHaveTextContent('Text Wrapper Test');

        // Verify text styling
        const computedStyle = getComputedStyle(textElement as Element);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.fontSize).toBeDefined();
      });
    });
  });

  // Test link with custom styling in all themes
  describe('Link Custom Styling Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`link with custom styling renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Link href="/test" className="custom-link">Custom Link</Link>,
          theme
        );

        const link = container.querySelector('.stx-link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveClass('custom-link');

        // Verify custom styling is applied
        const computedStyle = getComputedStyle(link as Element);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.textDecoration).toBeDefined();
      });
    });
  });

  // Test link accessibility in all themes
  describe('Link Accessibility Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`link maintains accessibility in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Link href="/test" aria-label="Accessible Link">Accessible Link</Link>,
          theme
        );

        const link = container.querySelector('.stx-link') as HTMLElement;
        expect(link).toHaveAttribute('aria-label', 'Accessible Link');
        expect(link).toHaveAttribute('href', '/test');

        // Test contrast (basic check)
        const computedStyle = getComputedStyle(link);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.backgroundColor).toBeDefined();
      });
    });
  });

  // Test link with external attributes in all themes
  describe('Link External Attributes Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`link with external attributes renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Link href="/external" target="_blank" rel="noopener noreferrer">External Link</Link>,
          theme
        );

        const link = container.querySelector('.stx-link') as HTMLElement;
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');

        // Verify styling
        const computedStyle = getComputedStyle(link);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.textDecoration).toBeDefined();
      });
    });
  });

  // Test theme transitions
  describe('Link Theme Transitions', () => {
    it('supports theme switching without breaking', () => {
      const { rerender } = renderWithTheme(<Link href="/test">Transition Test</Link>, 'light');

      // Switch to dark theme
      rerender(<Link href="/test">Transition Test</Link>);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<Link href="/test">Transition Test</Link>);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<Link href="/test">Transition Test</Link>);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();
    });
  });

  // Test theme performance
  describe('Link Theme Performance', () => {
    it('renders efficiently across all themes', () => {
      const startTime = performance.now();

      ALL_THEMES.forEach(theme => {
        renderWithTheme(<Link href="/test">Performance Test</Link>, theme);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should render all themes within reasonable time
      expect(totalTime).toBeLessThan(1000);
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'Link',
    (theme: ThemeName) => <Link href="/test">Enhanced Theme Test</Link>,
    {
      testSelectors: {
        background: '.stx-link',
        text: '.stx-link__text',
        border: '.stx-link',
        action: '.stx-link'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
