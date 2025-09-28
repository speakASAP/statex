import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ABTestProvider } from '@/contexts/ABTestProvider';

// All available themes
export const ALL_THEMES = ['light', 'dark', 'eu', 'uae'] as const;
export type ThemeName = typeof ALL_THEMES[number];

// All available languages
export const ALL_LANGUAGES = ['en', 'cs', 'de', 'fr', 'ar'] as const;
export type Language = typeof ALL_LANGUAGES[number];

// Test wrapper that includes all necessary providers
interface TestWrapperProps {
  children: React.ReactNode;
  theme?: ThemeName;
  language?: Language;
  enableABTesting?: boolean;
}

function TestWrapper({ 
  children, 
  theme = 'light', 
  language = 'en',
  enableABTesting = false 
}: TestWrapperProps) {
  // Set theme attribute directly for testing
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Also set theme synchronously to ensure it's set immediately
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }

  return (
    <LanguageProvider>
      {enableABTesting ? (
        <ABTestProvider>
          {children}
        </ABTestProvider>
      ) : (
        children
      )}
    </LanguageProvider>
  );
}

// Enhanced render function with all providers
export function renderWithProviders(
  ui: ReactElement,
  options: {
    theme?: ThemeName;
    language?: Language;
    enableABTesting?: boolean;
  } & Omit<RenderOptions, 'wrapper'> = {}
) {
  const {
    theme = 'light',
    language = 'en',
    enableABTesting = false,
    ...renderOptions
  } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestWrapper 
      theme={theme} 
      language={language}
      enableABTesting={enableABTesting}
    >
      {children}
    </TestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Helper function to render with specific theme (backward compatibility)
export function renderWithTheme(
  ui: ReactElement,
  theme: ThemeName = 'light',
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return renderWithProviders(ui, { theme, ...options });
}

// Helper function to render with specific language
export function renderWithLanguage(
  ui: ReactElement,
  language: Language = 'en',
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return renderWithProviders(ui, { language, ...options });
}

// Helper function to render with AB testing enabled
export function renderWithABTesting(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return renderWithProviders(ui, { enableABTesting: true, ...options });
}

// Utility function to test all themes
export function testAllThemes(
  componentName: string,
  renderComponent: (theme: ThemeName) => ReactElement
) {
  describe(`${componentName} All Themes`, () => {
    ALL_THEMES.forEach(theme => {
      it(`renders correctly in ${theme} theme`, () => {
        const { container } = renderWithProviders(renderComponent(theme), { theme });
        expect(container.firstChild).toBeInTheDocument();
      });
    });
  });
}

// Utility function to test all languages
export function testAllLanguages(
  componentName: string,
  renderComponent: (language: Language) => ReactElement
) {
  describe(`${componentName} All Languages`, () => {
    ALL_LANGUAGES.forEach(language => {
      it(`renders correctly in ${language} language`, () => {
        const { container } = renderWithProviders(renderComponent(language), { language });
        expect(container.firstChild).toBeInTheDocument();
      });
    });
  });
}

// Utility function to test theme and language combinations
export function testThemeAndLanguageCombinations(
  componentName: string,
  renderComponent: (theme: ThemeName, language: Language) => ReactElement
) {
  describe(`${componentName} Theme and Language Combinations`, () => {
    ALL_THEMES.forEach(theme => {
      ALL_LANGUAGES.forEach(language => {
        it(`renders correctly with ${theme} theme and ${language} language`, () => {
          const { container } = renderWithProviders(
            renderComponent(theme, language), 
            { theme, language }
          );
          expect(container.firstChild).toBeInTheDocument();
        });
      });
    });
  });
}

// Re-export commonly used testing utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event'; 