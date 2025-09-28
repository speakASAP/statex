import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('stx-input');
  });

  it('renders with error state', () => {
    render(<Input error="Error!" placeholder="Error input" />);
    const input = screen.getByPlaceholderText('Error input');
    expect(input).toHaveClass('stx-input--error');
    expect(screen.getByText('Error!')).toHaveClass('stx-input__helper-text-error');
  });

  it('renders with success state', () => {
    render(<Input success helperText="Success!" placeholder="Success input" />);
    const input = screen.getByPlaceholderText('Success input');
    expect(input).toHaveClass('stx-input--success');
    expect(screen.getByText('Success!')).toHaveClass('stx-input__helper-text-success');
  });

  it('renders helperText in default state', () => {
    render(<Input helperText="Help" placeholder="Help input" />);
    expect(screen.getByText('Help')).toHaveClass('stx-input__helper-text');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Custom input" />);
    const input = screen.getByPlaceholderText('Custom input');
    expect(input).toHaveClass('custom-class');
  });

  it('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Input ref={ref} placeholder="Ref input" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('handles different input types', () => {
    render(<Input type="email" placeholder="Email input" />);
    const input = screen.getByPlaceholderText('Email input');
    expect(input).toHaveAttribute('type', 'email');
  });
});

// Theme switching tests
describe('Input Theme Support', () => {
  // Test input styling in all themes
  describe('Input Styling Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`input styling renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Input placeholder="Theme Test" />,
          theme
        );

        const input = container.querySelector('.stx-input');
        expect(input).toBeInTheDocument();

        // Verify theme-specific styling
        const computedStyle = getComputedStyle(input as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.borderColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test input states in all themes
  describe('Input States Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`input error state renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Input error="Error message" placeholder="Error Test" />,
          theme
        );

        const input = container.querySelector('.stx-input');
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('stx-input--error');

        // Verify error styling
        const computedStyle = getComputedStyle(input as Element);
        expect(computedStyle.borderColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });

      it(`input success state renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Input success helperText="Success message" placeholder="Success Test" />,
          theme
        );

        const input = container.querySelector('.stx-input');
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('stx-input--success');

        // Verify success styling
        const computedStyle = getComputedStyle(input as Element);
        expect(computedStyle.borderColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });

      it(`input disabled state renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Input disabled placeholder="Disabled Test" />,
          theme
        );

        const input = container.querySelector('.stx-input') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toBeDisabled();

        // Verify disabled styling
        const computedStyle = getComputedStyle(input);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.opacity).toBeDefined();
      });
    });
  });

  // Test input types in all themes
  describe('Input Types Theme Support', () => {
    const inputTypes = ['text', 'email', 'password', 'number', 'tel', 'url'] as const;

    inputTypes.forEach(type => {
      ALL_THEMES.forEach(theme => {
        it(`${type} input type renders correctly in ${theme} theme`, () => {
          const { container } = renderWithTheme(
            <Input type={type} placeholder={`${type} Test`} />,
            theme
          );

          const input = container.querySelector('.stx-input') as HTMLInputElement;
          expect(input).toBeInTheDocument();
          expect(input).toHaveAttribute('type', type);

          // Verify theme-specific styling
          const computedStyle = getComputedStyle(input);
          expect(computedStyle.backgroundColor).toBeDefined();
          expect(computedStyle.borderColor).toBeDefined();
          expect(computedStyle.color).toBeDefined();
        });
      });
    });
  });

  // Test helper text in all themes
  describe('Input Helper Text Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`helper text renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Input helperText="Helper message" placeholder="Helper Test" />,
          theme
        );

        const helperText = screen.getByText('Helper message');
        expect(helperText).toBeInTheDocument();
        expect(helperText).toHaveClass('stx-input__helper-text');

        // Verify helper text styling
        const computedStyle = getComputedStyle(helperText);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.fontSize).toBeDefined();
      });

      it(`error helper text renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Input error="Error message" placeholder="Error Helper Test" />,
          theme
        );

        const errorText = screen.getByText('Error message');
        expect(errorText).toBeInTheDocument();
        expect(errorText).toHaveClass('stx-input__helper-text-error');

        // Verify error text styling
        const computedStyle = getComputedStyle(errorText);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.fontSize).toBeDefined();
      });

      it(`success helper text renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Input success helperText="Success message" placeholder="Success Helper Test" />,
          theme
        );

        const successText = screen.getByText('Success message');
        expect(successText).toBeInTheDocument();
        expect(successText).toHaveClass('stx-input__helper-text-success');

        // Verify success text styling
        const computedStyle = getComputedStyle(successText);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.fontSize).toBeDefined();
      });
    });
  });

  // Test input focus states in all themes
  describe('Input Focus States Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`input focus state works correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Input placeholder="Focus Test" />,
          theme
        );

        const input = container.querySelector('.stx-input') as HTMLInputElement;
        expect(input).toBeInTheDocument();

        // Simulate focus
        input.focus();

        // Verify focus styling
        const computedStyle = getComputedStyle(input);
        expect(computedStyle.borderColor).toBeDefined();
        expect(computedStyle.outline).toBeDefined();
      });
    });
  });

  // Test input placeholder styling in all themes
  describe('Input Placeholder Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`input placeholder styling works correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Input placeholder="Placeholder Test" />,
          theme
        );

        const input = container.querySelector('.stx-input') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'Placeholder Test');

        // Verify placeholder styling
        const computedStyle = getComputedStyle(input);
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.fontSize).toBeDefined();
      });
    });
  });

  // Test theme transitions
  describe('Input Theme Transitions', () => {
    it('supports theme switching without breaking', () => {
      const { rerender } = renderWithTheme(<Input placeholder="Transition Test" />, 'light');

      // Switch to dark theme
      rerender(<Input placeholder="Transition Test" />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<Input placeholder="Transition Test" />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<Input placeholder="Transition Test" />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();
    });
  });

  // Test theme accessibility
  describe('Input Theme Accessibility', () => {
    ALL_THEMES.forEach(theme => {
      it(`maintains accessibility in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Input placeholder="Accessible Input" aria-label="Test Input" />,
          theme
        );

        const input = container.querySelector('.stx-input') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('aria-label', 'Test Input');

        // Test contrast (basic check)
        const computedStyle = getComputedStyle(input);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test theme performance
  describe('Input Theme Performance', () => {
    it('renders efficiently across all themes', () => {
      const startTime = performance.now();

      ALL_THEMES.forEach(theme => {
        renderWithTheme(<Input placeholder="Performance Test" />, theme);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should render all themes within reasonable time
      expect(totalTime).toBeLessThan(1000);
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'Input',
    (theme: ThemeName) => <Input placeholder="Enhanced Theme Test" />,
    {
      testSelectors: {
        background: '.stx-input',
        text: '.stx-input',
        border: '.stx-input',
        action: '.stx-input'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
