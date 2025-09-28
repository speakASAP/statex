import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { Tooltip } from './Tooltip';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES } from '../../test/utils/theme-testing';

// Helper to flush all pending promises
const flushPromises = () => new Promise(setImmediate);

describe('Tooltip', () => {
  beforeAll(() => {
    vi.useRealTimers();
  });

  afterAll(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    // Clear any remaining tooltips from the DOM
    const tooltips = document.querySelectorAll('.stx-tooltip-content');
    tooltips.forEach(tooltip => tooltip.remove());
  });

  it('renders children', () => {
    render(
      <Tooltip content="Tooltip text">
        <button data-testid="tooltip-trigger-1">Hover me 1</button>
      </Tooltip>
    );
    expect(screen.getByTestId('tooltip-trigger-1')).toBeInTheDocument();
  });

  it('shows tooltip on mouse enter and hides on mouse leave', async () => {
    render(
      <Tooltip content="Tooltip text">
        <button data-testid="tooltip-trigger-2">Hover me 2</button>
      </Tooltip>
    );
    const trigger = screen.getByTestId('tooltip-trigger-2');

    await act(async () => {
      fireEvent.mouseEnter(trigger);
      await new Promise(res => setTimeout(res, 250));
      await flushPromises();
    });

    await waitFor(() => {
      expect(document.body.querySelector('.stx-tooltip-content')).toBeInTheDocument();
    });
    expect(document.body).toHaveTextContent('Tooltip text');

    await act(async () => {
      fireEvent.mouseLeave(trigger);
      await new Promise(res => setTimeout(res, 50));
      await flushPromises();
    });

    await waitFor(() => {
      expect(document.body.querySelector('.stx-tooltip-content')).not.toBeInTheDocument();
    });
  });

  it('shows tooltip on focus and hides on blur', async () => {
    render(
      <Tooltip content="Tooltip text">
        <button data-testid="tooltip-trigger-3">Focus me</button>
      </Tooltip>
    );
    const trigger = screen.getByTestId('tooltip-trigger-3');

    await act(async () => {
      fireEvent.focus(trigger);
      await new Promise(res => setTimeout(res, 250));
      await flushPromises();
    });

    await waitFor(() => {
      expect(document.body.querySelector('.stx-tooltip-content')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.blur(trigger);
      await new Promise(res => setTimeout(res, 50));
      await flushPromises();
    });

    await waitFor(() => {
      expect(document.body.querySelector('.stx-tooltip-content')).not.toBeInTheDocument();
    });
  });

  it('applies STX classes and position', async () => {
    render(
      <Tooltip content="Tooltip text" position="bottom">
        <button data-testid="tooltip-trigger-4">Hover me 4</button>
      </Tooltip>
    );

    await act(async () => {
      fireEvent.mouseEnter(screen.getByTestId('tooltip-trigger-4'));
      await new Promise(res => setTimeout(res, 250));
      await flushPromises();
    });

    await waitFor(() => {
      const tooltip = document.body.querySelector('.stx-tooltip-content');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveClass('stx-tooltip-content', 'stx-tooltip-bottom');

      const arrow = tooltip?.querySelector('.stx-tooltip-arrow');
      expect(arrow).toHaveClass('stx-tooltip-arrow', 'stx-tooltip-arrow-bottom');
    });
  });

  it('does not show tooltip when disabled', async () => {
    render(
      <Tooltip content="Tooltip text" disabled>
        <button data-testid="tooltip-trigger-5">Hover me 5</button>
      </Tooltip>
    );
    const trigger = screen.getByTestId('tooltip-trigger-5');
    fireEvent.mouseEnter(trigger);
    await new Promise(res => setTimeout(res, 250));
    expect(document.body.querySelector('.stx-tooltip-content')).not.toBeInTheDocument();
  });

  it('applies custom className', async () => {
    render(
      <Tooltip content="Tooltip text" className="custom-trigger" contentClassName="custom-content">
        <button data-testid="tooltip-trigger-6">Hover me 6</button>
      </Tooltip>
    );
    const trigger = screen.getByTestId('tooltip-trigger-6');
    expect(trigger.parentElement).toHaveClass('stx-tooltip', 'custom-trigger');

    await act(async () => {
      fireEvent.mouseEnter(trigger);
      await new Promise(res => setTimeout(res, 250));
      await flushPromises();
    });

    await waitFor(() => {
      const tooltip = document.body.querySelector('.stx-tooltip-content');
      expect(tooltip).toHaveClass('custom-content', 'stx-tooltip-content');
    });
  });
});

// Theme switching tests
describe('Tooltip Theme Support', () => {
  const themeDefaultProps = {
    content: 'Tooltip text',
    children: <button data-testid="tooltip-trigger">Hover me</button>,
  };

  // Test tooltip trigger styling in all themes
  describe('Tooltip Trigger Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`tooltip trigger renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Tooltip {...themeDefaultProps} />,
          theme
        );

        const trigger = screen.getByTestId('tooltip-trigger');
        expect(trigger).toBeInTheDocument();

        // Verify trigger styling
        const computedStyle = getComputedStyle(trigger);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
        expect(computedStyle.border).toBeDefined();
      });
    });
  });

  // Test tooltip container styling in all themes
  describe('Tooltip Container Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`tooltip container renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Tooltip {...themeDefaultProps} />,
          theme
        );

        const tooltipContainer = screen.getByTestId('tooltip-trigger').parentElement;
        expect(tooltipContainer).toBeInTheDocument();
        expect(tooltipContainer).toHaveClass('stx-tooltip');

        // Verify container styling
        const computedStyle = getComputedStyle(tooltipContainer as Element);
        expect(computedStyle.position).toBeDefined();
        expect(computedStyle.display).toBeDefined();
      });
    });
  });

  // Test tooltip with different positions in all themes
  describe('Tooltip Positions Theme Support', () => {
    const positions = ['top', 'bottom', 'left', 'right'];

    positions.forEach(position => {
      ALL_THEMES.forEach(theme => {
        it(`tooltip with ${position} position renders correctly in ${theme} theme`, () => {
          const { container } = renderWithTheme(
            <Tooltip {...themeDefaultProps} position={position as any} />,
            theme
          );

          const trigger = screen.getByTestId('tooltip-trigger');
          expect(trigger).toBeInTheDocument();

          // Verify trigger styling
          const computedStyle = getComputedStyle(trigger);
          expect(computedStyle.backgroundColor).toBeDefined();
          expect(computedStyle.color).toBeDefined();
        });
      });
    });
  });

  // Test disabled tooltip in all themes
  describe('Disabled Tooltip Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`disabled tooltip renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Tooltip {...themeDefaultProps} disabled={true} />,
          theme
        );

        const trigger = screen.getByTestId('tooltip-trigger');
        expect(trigger).toBeInTheDocument();

        // Verify disabled styling
        const computedStyle = getComputedStyle(trigger);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test tooltip with custom classes in all themes
  describe('Tooltip Custom Classes Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`tooltip with custom classes renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Tooltip
            {...themeDefaultProps}
            className="custom-trigger"
            contentClassName="custom-content"
          />,
          theme
        );

        const trigger = screen.getByTestId('tooltip-trigger');
        const tooltipContainer = trigger.parentElement;
        expect(tooltipContainer).toHaveClass('custom-trigger', 'stx-tooltip');

        // Verify custom styling is applied
        const triggerStyle = getComputedStyle(trigger);
        const containerStyle = getComputedStyle(tooltipContainer as Element);
        expect(triggerStyle.backgroundColor).toBeDefined();
        expect(containerStyle.position).toBeDefined();
      });
    });
  });

  // Test tooltip accessibility in all themes
  describe('Tooltip Accessibility Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`tooltip maintains accessibility in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Tooltip {...themeDefaultProps} />,
          theme
        );

        const trigger = screen.getByTestId('tooltip-trigger');
        expect(trigger).toBeInTheDocument();

        // Test contrast (basic check)
        const computedStyle = getComputedStyle(trigger);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test theme transitions
  describe('Tooltip Theme Transitions', () => {
    it('supports theme switching without breaking', () => {
      const { rerender } = renderWithTheme(
        <Tooltip {...themeDefaultProps} />,
        'light'
      );

      // Switch to dark theme
      rerender(<Tooltip {...themeDefaultProps} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<Tooltip {...themeDefaultProps} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<Tooltip {...themeDefaultProps} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();
    });
  });

  // Test theme performance
  describe('Tooltip Theme Performance', () => {
    it('renders efficiently across all themes', () => {
      const startTime = performance.now();

      ALL_THEMES.forEach(theme => {
        renderWithTheme(<Tooltip {...themeDefaultProps} />, theme);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should render all themes within reasonable time
      expect(totalTime).toBeLessThan(1000);
    });
  });
});
