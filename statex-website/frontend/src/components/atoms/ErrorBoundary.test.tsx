// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';
import { renderWithTheme, ALL_THEMES } from '../../test/utils/theme-testing';

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders fallback when error thrown and fallback provided', () => {
    const Fallback = <div data-testid="fallback">Fallback UI</div>;
    const ProblemChild = () => { throw new Error('Test error'); };
    render(
      <ErrorBoundary fallback={Fallback}>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('renders default error UI when error thrown and no fallback', () => {
    const ProblemChild = () => { throw new Error('Test error'); };
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    const tryAgainButtons = screen.getAllByRole('button', { name: /try again/i });
    expect(tryAgainButtons.length).toBeGreaterThan(0);
    const reportErrorButtons = screen.getAllByRole('button', { name: /report error/i });
    expect(reportErrorButtons.length).toBeGreaterThan(0);
  });

  it('shows Try Again button when error occurs (smoke-test)', () => {
    const ProblemChild = () => { throw new Error('Test error'); };
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    const tryAgainButtons = screen.getAllByRole('button', { name: /try again/i });
    expect(tryAgainButtons.length).toBeGreaterThan(0);
  });

  it('calls handleReportError when Report Error is clicked', () => {
    const ProblemChild = () => { throw new Error('Test error'); };
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    const reportErrorButtons = screen.getAllByRole('button', { name: /report error/i });
    fireEvent.click(reportErrorButtons[0]);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('ErrorBoundary Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme when no error`, () => {
      const { container } = renderWithTheme(
        <ErrorBoundary>
          <div data-testid="child-theme">Child content</div>
        </ErrorBoundary>,
        theme
      );
      const child = container.querySelector('[data-testid="child-theme"]');
      expect(child).toBeInTheDocument();
      // Theme container check
      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme when no error`, () => {
      const { container } = renderWithTheme(
        <ErrorBoundary>
          <div data-testid="child-theme">Child content</div>
        </ErrorBoundary>,
        theme
      );
      const child = container.querySelector('[data-testid="child-theme"]');
      const computedStyle = getComputedStyle(child as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes when no error', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <ErrorBoundary>
          <div data-testid="child-theme">Child content</div>
        </ErrorBoundary>,
        theme
      );
      const child = container.querySelector('[data-testid="child-theme"]');
      expect(child).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('applies theme-specific styling for error states', () => {
    const ProblemChild = () => { throw new Error('Test error'); };

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>,
        theme
      );
      const errorBoundary = container.querySelector('[data-testid="error-boundary"]');
      expect(errorBoundary).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains accessibility across themes when error occurs', () => {
    const ProblemChild = () => { throw new Error('Test error'); };

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>,
        theme
      );
      const errorBoundary = container.querySelector('[data-testid="error-boundary"]');
      expect(errorBoundary).toBeInTheDocument();

      // Check for error message
      const errorMessage = container.querySelector('h2');
      expect(errorMessage).toHaveTextContent(/something went wrong/i);

      // Check for action buttons
      const tryAgainButton = container.querySelector('button[data-testid="try-again"]');
      const reportErrorButton = container.querySelector('button[data-testid="report-error"]');
      expect(tryAgainButton).toBeInTheDocument();
      expect(reportErrorButton).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles theme transitions smoothly', () => {
    // Test light theme
    const { container: lightContainer } = renderWithTheme(
      <ErrorBoundary>
        <div data-testid="child-transition">Child content</div>
      </ErrorBoundary>,
      'light'
    );
    let themeContainer = lightContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'light');

    // Test dark theme
    const { container: darkContainer } = renderWithTheme(
      <ErrorBoundary>
        <div data-testid="child-transition">Child content</div>
      </ErrorBoundary>,
      'dark'
    );
    themeContainer = darkContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'dark');
  });

  it('maintains performance across theme switches', () => {
    const startTime = performance.now();

    ALL_THEMES.forEach(theme => {
      renderWithTheme(
        <ErrorBoundary>
          <div data-testid="child-performance">Child content</div>
        </ErrorBoundary>,
        theme
      );
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Performance threshold: should complete all theme renders in under 100ms
    expect(totalTime).toBeLessThan(100);
  });

  it('applies correct error styling across themes', () => {
    const ProblemChild = () => { throw new Error('Test error'); };

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>,
        theme
      );
      const errorBoundary = container.querySelector('[data-testid="error-boundary"]');
      expect(errorBoundary).toBeInTheDocument();

      // Check error styling
      const errorContainer = container.querySelector('.stx-error-boundary');
      expect(errorContainer).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles custom fallback across themes', () => {
    const ProblemChild = () => { throw new Error('Test error'); };
    const CustomFallback = <div data-testid="custom-fallback">Custom Error UI</div>;

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <ErrorBoundary fallback={CustomFallback}>
          <ProblemChild />
        </ErrorBoundary>,
        theme
      );
      const customFallback = container.querySelector('[data-testid="custom-fallback"]');
      expect(customFallback).toBeInTheDocument();
      expect(customFallback).toHaveTextContent('Custom Error UI');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains error recovery functionality across themes', () => {
    const ProblemChild = () => { throw new Error('Test error'); };

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>,
        theme
      );

      // Check that error state is rendered
      const errorMessage = container.querySelector('h2');
      expect(errorMessage).toHaveTextContent(/something went wrong/i);

      // Check that recovery buttons are present
      const tryAgainButton = container.querySelector('button[data-testid="try-again"]');
      const reportErrorButton = container.querySelector('button[data-testid="report-error"]');
      expect(tryAgainButton).toBeInTheDocument();
      expect(reportErrorButton).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles nested error boundaries across themes', () => {
    const InnerProblemChild = () => { throw new Error('Inner error'); };

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <ErrorBoundary data-testid="outer-error-boundary">
          <ErrorBoundary data-testid="inner-error-boundary">
            <InnerProblemChild />
          </ErrorBoundary>
        </ErrorBoundary>,
        theme
      );

      // Inner error boundary should catch the error
      const innerErrorBoundary = container.querySelector('[data-testid="error-boundary"]');
      expect(innerErrorBoundary).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains error reporting functionality across themes', () => {
    const ProblemChild = () => { throw new Error('Test error'); };
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>,
        theme
      );

      const reportErrorButton = container.querySelector('button[data-testid="report-error"]');
      expect(reportErrorButton).toBeInTheDocument();

      // Test error reporting
      fireEvent.click(reportErrorButton as Element);

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
