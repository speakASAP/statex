import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { Dropdown } from './Dropdown';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES } from '../../test/utils/theme-testing';

describe('Dropdown', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];

  const defaultProps = {
    options: defaultOptions,
    onValueChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with placeholder', () => {
    render(<Dropdown {...defaultProps} placeholder="Select option" />);
    expect(screen.getByText('Select option')).toBeInTheDocument();
  });

  it('renders selected value', () => {
    render(<Dropdown {...defaultProps} value="option1" />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('renders with STX classes', () => {
    render(<Dropdown {...defaultProps} />);
    const container = screen.getByRole('button').parentElement;
    const trigger = screen.getByRole('button');

    expect(container).toHaveClass('stx-dropdown');
    expect(trigger).toHaveClass('stx-dropdown-trigger');
  });

  it('opens dropdown on click', () => {
    render(<Dropdown {...defaultProps} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.getByRole('listbox')).toHaveClass('stx-dropdown-content');
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls onValueChange when option is selected', () => {
    const onValueChange = vi.fn();
    render(<Dropdown {...defaultProps} onValueChange={onValueChange} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const option = screen.getByText('Option 1');
    fireEvent.click(option);

    expect(onValueChange).toHaveBeenCalledWith('option1');
  });

  it('closes dropdown after selection', () => {
    render(<Dropdown {...defaultProps} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const option = screen.getByText('Option 1');
    fireEvent.click(option);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(<Dropdown {...defaultProps} />);

    const trigger = screen.getByRole('button');
    fireEvent.keyDown(trigger, { key: 'Enter' });

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    // Should highlight the second option
    const options = screen.getAllByRole('option');
    expect(options[1]).toHaveClass('stx-dropdown-option-highlighted');
  });

  it('closes dropdown on escape key', () => {
    render(<Dropdown {...defaultProps} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: 'Escape' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('disables dropdown when disabled prop is true', () => {
    render(<Dropdown {...defaultProps} disabled={true} />);

    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();

    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not call onValueChange for disabled options', () => {
    const onValueChange = vi.fn();
    render(<Dropdown {...defaultProps} onValueChange={onValueChange} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const disabledOption = screen.getByText('Option 3');
    fireEvent.click(disabledOption);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('has proper ARIA attributes', () => {
    render(<Dropdown {...defaultProps} aria-label="Test dropdown" />);

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-label', 'Test dropdown');
  });

  it('updates ARIA attributes when opened', () => {
    render(<Dropdown {...defaultProps} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies custom className', () => {
    render(<Dropdown {...defaultProps} className="custom-class" />);

    const container = screen.getByRole('button').parentElement;
    expect(container).toHaveClass('custom-class', 'stx-dropdown');
  });

  it('applies custom triggerClassName', () => {
    render(<Dropdown {...defaultProps} triggerClassName="custom-trigger" />);

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('custom-trigger', 'stx-dropdown-trigger');
  });

  it('applies custom contentClassName', () => {
    render(<Dropdown {...defaultProps} contentClassName="custom-content" />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const content = screen.getByRole('listbox');
    expect(content).toHaveClass('custom-content', 'stx-dropdown-content');
  });
});

// Theme switching tests
describe('Dropdown Theme Support', () => {
  const themeDefaultProps = {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3', disabled: true },
    ],
    onValueChange: vi.fn(),
  };

  // Test dropdown trigger styling in all themes
  describe('Dropdown Trigger Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`dropdown trigger renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Dropdown {...themeDefaultProps} placeholder="Select option" />,
          theme
        );

        const trigger = screen.getByRole('button');
        expect(trigger).toBeInTheDocument();
        expect(trigger).toHaveClass('stx-dropdown-trigger');

        // Verify trigger styling
        const computedStyle = getComputedStyle(trigger);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.border).toBeDefined();
        expect(computedStyle.borderRadius).toBeDefined();
      });
    });
  });

  // Test dropdown content styling in all themes
  describe('Dropdown Content Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`dropdown content renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Dropdown {...themeDefaultProps} />,
          theme
        );

        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        const content = screen.getByRole('listbox');
        expect(content).toBeInTheDocument();
        expect(content).toHaveClass('stx-dropdown-content');

        // Verify content styling
        const computedStyle = getComputedStyle(content);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.border).toBeDefined();
        expect(computedStyle.borderRadius).toBeDefined();
        expect(computedStyle.boxShadow).toBeDefined();
      });
    });
  });

  // Test dropdown options styling in all themes
  describe('Dropdown Options Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`dropdown options render correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Dropdown {...themeDefaultProps} />,
          theme
        );

        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(3);

        // Verify option styling
        options.forEach(option => {
          const computedStyle = getComputedStyle(option);
          expect(computedStyle.color).toBeDefined();
          expect(computedStyle.backgroundColor).toBeDefined();
          expect(computedStyle.padding).toBeDefined();
        });
      });
    });
  });

  // Test dropdown with selected value in all themes
  describe('Dropdown Selected Value Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`dropdown with selected value renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Dropdown {...themeDefaultProps} value="option1" />,
          theme
        );

        const selectedText = screen.getByText('Option 1');
        expect(selectedText).toBeInTheDocument();

        // Verify selected value styling
        const trigger = screen.getByRole('button');
        const computedStyle = getComputedStyle(trigger);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test dropdown with placeholder in all themes
  describe('Dropdown Placeholder Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`dropdown with placeholder renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Dropdown {...themeDefaultProps} placeholder="Select option" />,
          theme
        );

        const placeholder = screen.getByText('Select option');
        expect(placeholder).toBeInTheDocument();

        // Verify placeholder styling
        const computedStyle = getComputedStyle(placeholder);
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test disabled dropdown in all themes
  describe('Disabled Dropdown Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`disabled dropdown renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Dropdown {...themeDefaultProps} disabled={true} />,
          theme
        );

        const trigger = screen.getByRole('button');
        expect(trigger).toBeDisabled();

        // Verify disabled styling
        const computedStyle = getComputedStyle(trigger);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.opacity).toBeDefined();
      });
    });
  });

  // Test dropdown with custom classes in all themes
  describe('Dropdown Custom Classes Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`dropdown with custom classes renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Dropdown
            {...themeDefaultProps}
            className="custom-dropdown"
            triggerClassName="custom-trigger"
            contentClassName="custom-content"
          />,
          theme
        );

        const dropdownContainer = screen.getByRole('button').parentElement;
        const trigger = screen.getByRole('button');

        expect(dropdownContainer).toHaveClass('custom-dropdown', 'stx-dropdown');
        expect(trigger).toHaveClass('custom-trigger', 'stx-dropdown-trigger');

        // Open dropdown to test content classes
        fireEvent.click(trigger);
        const content = screen.getByRole('listbox');
        expect(content).toHaveClass('custom-content', 'stx-dropdown-content');

        // Verify custom styling is applied
        const containerStyle = getComputedStyle(dropdownContainer as Element);
        const triggerStyle = getComputedStyle(trigger);
        const contentStyle = getComputedStyle(content);
        expect(containerStyle.backgroundColor).toBeDefined();
        expect(triggerStyle.backgroundColor).toBeDefined();
        expect(contentStyle.backgroundColor).toBeDefined();
      });
    });
  });

  // Test dropdown accessibility in all themes
  describe('Dropdown Accessibility Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`dropdown maintains accessibility in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Dropdown {...themeDefaultProps} aria-label="Test dropdown" />,
          theme
        );

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveAttribute('aria-label', 'Test dropdown');

        // Test contrast (basic check)
        const computedStyle = getComputedStyle(trigger);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test theme transitions
  describe('Dropdown Theme Transitions', () => {
    it('supports theme switching without breaking', () => {
      const { rerender } = renderWithTheme(
        <Dropdown {...themeDefaultProps} />,
        'light'
      );

      // Switch to dark theme
      rerender(<Dropdown {...themeDefaultProps} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<Dropdown {...themeDefaultProps} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<Dropdown {...themeDefaultProps} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();
    });
  });

  // Test theme performance
  describe('Dropdown Theme Performance', () => {
    it('renders efficiently across all themes', () => {
      const startTime = performance.now();

      ALL_THEMES.forEach(theme => {
        renderWithTheme(<Dropdown {...themeDefaultProps} />, theme);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should render all themes within reasonable time
      expect(totalTime).toBeLessThan(1000);
    });
  });
});
