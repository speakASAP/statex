import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

// Mock theme detection functions
vi.mock('@/lib/themeDetection', () => ({
  detectOptimalTheme: vi.fn().mockResolvedValue('light'),
  getAutoDetectPreference: vi.fn().mockReturnValue(false),
  trackThemeSwitch: vi.fn(),
  isValidTheme: vi.fn().mockImplementation((theme) => ['light', 'dark', 'eu', 'uae'].includes(theme)),
}));

// Mock theme CSS loader
vi.mock('@/lib/themeCSSLoader', () => ({
  loadThemeCSS: vi.fn().mockResolvedValue(undefined),
  preloadThemeCSS: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component to access theme context
function TestComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme('eu')} data-testid="set-eu">
        Set EU
      </button>
      <button onClick={() => setTheme('uae')} data-testid="set-uae">
        Set UAE
      </button>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document attributes
    document.documentElement.removeAttribute('data-theme');
    // Reset localStorage mock
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
  });

  afterEach(() => {
    // Cleanup
    document.documentElement.removeAttribute('data-theme');
  });

  describe('STX Classes', () => {
    it('applies data-theme attribute to document element', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      });
    });

    it('applies correct theme classes when theme changes', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      });

      const setDarkButton = screen.getByTestId('set-dark');
      fireEvent.click(setDarkButton);

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      });
    });

    it('applies EU theme classes correctly', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      });

      const setEuButton = screen.getByTestId('set-eu');
      fireEvent.click(setEuButton);

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'eu');
      });
    });

    it('applies UAE theme classes correctly', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      });

      const setUaeButton = screen.getByTestId('set-uae');
      fireEvent.click(setUaeButton);

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'uae');
      });
    });
  });

  describe('Template Section Functionality', () => {
    it('provides theme context to children', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      });
    });

    it('sets theme and updates localStorage', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      });

      const setDarkButton = screen.getByTestId('set-dark');
      fireEvent.click(setDarkButton);

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('statex-theme', 'dark');
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });
    });

    it('toggles through themes in correct order', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      });

      const toggleButton = screen.getByTestId('toggle-theme');

      // Initial: light
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

      // First toggle: dark
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });

      // Second toggle: eu
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('eu');
      });

      // Third toggle: uae
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('uae');
      });

      // Fourth toggle: back to light
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      });
    });

    it('loads theme from localStorage on mount', async () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(localStorageMock.getItem).toHaveBeenCalledWith('statex-theme');
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
        expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      });
    });

    it('handles invalid theme from localStorage gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-theme');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
        expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      });
    });

    it('defaults to light theme when no localStorage value', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
        expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      });
    });
  });

  describe('Error Handling', () => {
    it('throws error when useTheme is used outside provider', () => {
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');
    });

    it('handles missing theme keys gracefully', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('updates theme efficiently without unnecessary re-renders', async () => {
      const renderSpy = vi.fn();

      function TestComponentWithSpy() {
        const { theme, setTheme } = useTheme();
        renderSpy();

        return (
          <div>
            <span data-testid="current-theme">{theme}</span>
            <button onClick={() => setTheme('dark')} data-testid="set-dark">
              Set Dark
            </button>
          </div>
        );
      }

      render(
        <ThemeProvider>
          <TestComponentWithSpy />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      });

      // Get initial render count (may be 1 or 2 due to StrictMode/initialization)
      const initialRenderCount = renderSpy.mock.calls.length;
      expect(initialRenderCount).toBeGreaterThanOrEqual(1);

      // Change theme
      const setDarkButton = screen.getByTestId('set-dark');
      fireEvent.click(setDarkButton);

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      });

      // Should only re-render once for theme change
      expect(renderSpy).toHaveBeenCalledTimes(initialRenderCount + 1);
    });
  });

  describe('Integration', () => {
    it('integrates with other providers correctly', async () => {
      render(
        <ThemeProvider>
          <div data-testid="theme-integration">
            <TestComponent />
          </div>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('theme-integration')).toBeInTheDocument();
        expect(screen.getByTestId('current-theme')).toBeInTheDocument();
      });
    });

    it('supports nested theme providers', async () => {
      render(
        <ThemeProvider>
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toBeInTheDocument();
      });
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'ThemeProvider',
    (theme: ThemeName) => {
      // Set the theme in localStorage before rendering
      localStorageMock.getItem.mockReturnValue(theme);
      return (
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
    },
    {
      testSelectors: {
        background: '[data-theme]',
        text: '[data-testid="current-theme"]',
        border: '[data-theme]',
        action: '[data-testid="toggle-theme"]'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
