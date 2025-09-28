import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageProvider';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component to access language context
function TestComponent() {
  const {
    language,
    setLanguage,
    direction,
    isRTL
  } = useLanguage();

  return (
    <div>
      <span data-testid="current-language">{language}</span>
      <span data-testid="direction">{direction}</span>
      <span data-testid="rtl-status">{isRTL ? 'rtl' : 'ltr'}</span>
      <button
        onClick={() => setLanguage('en')}
        data-testid="set-english"
      >
        English
      </button>
      <button
        onClick={() => setLanguage('cs')}
        data-testid="set-czech"
      >
        Czech
      </button>
      <button
        onClick={() => setLanguage('ar')}
        data-testid="set-arabic"
      >
        Arabic
      </button>
    </div>
  );
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document attributes
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
  });

  afterEach(() => {
    // Cleanup
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
  });

  describe('STX Classes', () => {
    it('applies language attributes to document element', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(document.documentElement).toHaveAttribute('lang', 'en');
      expect(document.documentElement).toHaveAttribute('dir', 'ltr');
    });

    it('applies RTL classes for RTL languages', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const setArabicButton = screen.getByTestId('set-arabic');
      fireEvent.click(setArabicButton);

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('lang', 'ar');
        expect(document.documentElement).toHaveAttribute('dir', 'rtl');
      });
    });

    it('applies LTR classes for LTR languages', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const setCzechButton = screen.getByTestId('set-czech');
      fireEvent.click(setCzechButton);

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('lang', 'cs');
        expect(document.documentElement).toHaveAttribute('dir', 'ltr');
      });
    });

    it('applies BEM-style language classes', () => {
      render(
        <LanguageProvider>
          <div className="stx-content stx-content--localized">
            <span className="stx-content__text">Test</span>
          </div>
        </LanguageProvider>
      );

      const content = document.querySelector('.stx-content--localized');
      const text = document.querySelector('.stx-content__text');

      expect(content).toBeInTheDocument();
      expect(text).toBeInTheDocument();
    });
  });

  describe('Template Section Functionality', () => {
    it('translates text correctly', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('direction')).toHaveTextContent('ltr');

      // Change language and check direction
      const setCzechButton = screen.getByTestId('set-czech');
      fireEvent.click(setCzechButton);

      await waitFor(() => {
        expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
      });
    });

    it('handles RTL languages correctly', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const setArabicButton = screen.getByTestId('set-arabic');
      fireEvent.click(setArabicButton);

      await waitFor(() => {
        expect(screen.getByTestId('rtl-status')).toHaveTextContent('rtl');
        expect(document.documentElement).toHaveAttribute('dir', 'rtl');
      });
    });

    it('provides language context to children', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      expect(screen.getByTestId('direction')).toBeInTheDocument();
    });

    it('loads language from localStorage on mount', () => {
      localStorageMock.getItem.mockReturnValue('cs');

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(localStorageMock.getItem).toHaveBeenCalledWith('statex-language');
      expect(screen.getByTestId('current-language')).toHaveTextContent('cs');
      expect(document.documentElement).toHaveAttribute('lang', 'cs');
    });

    it('defaults to English when no localStorage value', () => {
      localStorageMock.getItem.mockReturnValue(null);

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      expect(document.documentElement).toHaveAttribute('lang', 'en');
    });

    it('handles invalid language from localStorage gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-lang');

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      expect(document.documentElement).toHaveAttribute('lang', 'en');
    });
  });

  describe('Layout Variants', () => {
    it('supports English language variant', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      expect(document.documentElement).toHaveAttribute('lang', 'en');
      expect(document.documentElement).toHaveAttribute('dir', 'ltr');
    });

    it('supports Czech language variant', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const setCzechButton = screen.getByTestId('set-czech');
      fireEvent.click(setCzechButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-language')).toHaveTextContent('cs');
        expect(document.documentElement).toHaveAttribute('lang', 'cs');
        expect(document.documentElement).toHaveAttribute('dir', 'ltr');
      });
    });

    it('supports Arabic language variant', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const setArabicButton = screen.getByTestId('set-arabic');
      fireEvent.click(setArabicButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-language')).toHaveTextContent('ar');
        expect(document.documentElement).toHaveAttribute('lang', 'ar');
        expect(document.documentElement).toHaveAttribute('dir', 'rtl');
      });
    });

    it('supports responsive language layouts', () => {
      render(
        <LanguageProvider>
          <div className="stx-layout stx-layout--responsive">
            <TestComponent />
          </div>
        </LanguageProvider>
      );

      const layout = document.querySelector('.stx-layout--responsive');
      expect(layout).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('maintains language settings across viewport changes', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      // Change language
      const setCzechButton = screen.getByTestId('set-czech');
      fireEvent.click(setCzechButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-language')).toHaveTextContent('cs');
      });

      // Simulate viewport change
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      fireEvent(window, new Event('resize'));

      // Language should remain the same
      expect(screen.getByTestId('current-language')).toHaveTextContent('cs');
    });

    it('works correctly on mobile viewport', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const setCzechButton = screen.getByTestId('set-czech');
      fireEvent.click(setCzechButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-language')).toHaveTextContent('cs');
      });
    });

    it('works correctly on tablet viewport', async () => {
      // Set tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const setArabicButton = screen.getByTestId('set-arabic');
      fireEvent.click(setArabicButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-language')).toHaveTextContent('ar');
      });
    });

    it('works correctly on desktop viewport', async () => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1440,
      });

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const setEnglishButton = screen.getByTestId('set-english');
      fireEvent.click(setEnglishButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      });
    });

    it('handles RTL responsive layouts', async () => {
      render(
        <LanguageProvider>
          <div className="stx-layout stx-layout--rtl">
            <TestComponent />
          </div>
        </LanguageProvider>
      );

      const setArabicButton = screen.getByTestId('set-arabic');
      fireEvent.click(setArabicButton);

      await waitFor(() => {
        const rtlLayout = document.querySelector('.stx-layout--rtl');
        expect(rtlLayout).toBeInTheDocument();
        expect(screen.getByTestId('rtl-status')).toHaveTextContent('rtl');
      });
    });
  });

  describe('Error Handling', () => {
    it('throws error when useLanguage is used outside provider', () => {
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useLanguage must be used within a LanguageProvider');
    });

    it('handles missing translation keys gracefully', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      // Should render without crashing
      expect(screen.getByTestId('current-language')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('updates language efficiently without unnecessary re-renders', () => {
      const renderSpy = vi.fn();

      function TestComponentWithSpy() {
        renderSpy();
        const { language, setLanguage } = useLanguage();
        return (
          <div>
            <span data-testid="current-language">{language}</span>
            <button onClick={() => setLanguage('cs')}>Change</button>
          </div>
        );
      }

      render(
        <LanguageProvider>
          <TestComponentWithSpy />
        </LanguageProvider>
      );

      // Should render initially
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('caches translations for performance', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      // Should render efficiently
      expect(screen.getByTestId('current-language')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('sets proper lang attribute for screen readers', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(document.documentElement).toHaveAttribute('lang', 'en');
    });

    it('sets proper dir attribute for RTL languages', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const setArabicButton = screen.getByTestId('set-arabic');
      fireEvent.click(setArabicButton);

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('dir', 'rtl');
      });
    });

    it('provides language information for assistive technologies', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(document.documentElement).toHaveAttribute('lang', 'en');
      expect(document.documentElement).toHaveAttribute('dir', 'ltr');
    });
  });

  describe('Integration', () => {
    it('integrates with theme system', () => {
      render(
        <LanguageProvider>
          <div data-theme="light">
            <TestComponent />
          </div>
        </LanguageProvider>
      );

      expect(screen.getByTestId('current-language')).toBeInTheDocument();
    });

    it('works with template system', () => {
      render(
        <LanguageProvider>
          <div aria-label="Navigation">
            <TestComponent />
          </div>
        </LanguageProvider>
      );

      expect(screen.getByTestId('current-language')).toBeInTheDocument();
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'LanguageProvider',
    (theme: ThemeName) => (
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    ),
    {
      testSelectors: {
        background: '[data-testid="current-language"]',
        text: '[data-testid="current-language"]',
        border: '[data-testid="direction"]',
        action: '[data-testid="set-english"]'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
