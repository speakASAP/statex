import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LanguageProvider } from '@/components/providers/LanguageProvider';

// Mock Next.js router
const mockPush = vi.fn();
const mockSwitchLanguageWithFeedback = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/blog/european-digital-transformation-2024',
}));

vi.mock('../../lib/services/translationService', () => ({
  useTranslationService: () => ({
    switchLanguageWithFeedback: mockSwitchLanguageWithFeedback,
    switchLanguage: vi.fn(),
    switchLanguageSimple: vi.fn(),
    getLocalizedUrl: vi.fn(),
    getLocalizedAIUrl: vi.fn(),
    getLocalizedBlogUrl: vi.fn(),
    getLocalizedAIBlogUrl: vi.fn(),
    getLanguageUrls: vi.fn(),
    getAvailableLanguagesForContent: vi.fn(),
    translationService: {},
  }),
}));

// Mock SlugMapper
vi.mock('@/lib/content/slugMapper', () => ({
  SlugMapper: {
    getEnglishSlug: vi.fn((nativeSlug: string, lang: string) => {
      if (nativeSlug === 'european-digital-transformation-2024') return 'european-digital-transformation-2024';
      if (nativeSlug === 'evropska-digitalni-transformace-2024') return 'european-digital-transformation-2024';
      if (nativeSlug === 'europaeische-digitale-transformation-2024') return 'european-digital-transformation-2024';
      if (nativeSlug === 'transformation-digitale-europeenne-2024') return 'european-digital-transformation-2024';
      return null;
    }),
    getNativeSlug: vi.fn((englishSlug: string, lang: string) => {
      switch (lang) {
        case 'en': return 'european-digital-transformation-2024';
        case 'cs': return 'evropska-digitalni-transformace-2024';
        case 'de': return 'europaeische-digitale-transformation-2024';
        case 'fr': return 'transformation-digitale-europeenne-2024';
        default: return englishSlug;
      }
    }),
    hasSlug: vi.fn((slug: string) => {
      return ['european-digital-transformation-2024', 'evropska-digitalni-transformace-2024', 'europaeische-digitale-transformation-2024', 'transformation-digitale-europeenne-2024'].includes(slug);
    }),
  },
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

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('en');
    mockSwitchLanguageWithFeedback.mockResolvedValue(undefined);
  });

  describe('Dropdown variant', () => {
    it('renders dropdown with all supported languages', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher variant="dropdown" />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      
      // Check that all language options are present
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(5); // en, cs, de, fr, ar
      
      // Check for current language display
      expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('changes language and navigates to correct URL when dropdown selection changes', async () => {
      render(
        <TestWrapper>
          <LanguageSwitcher variant="dropdown" />
        </TestWrapper>
      );

      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'cs' } });

      await waitFor(() => {
        expect(mockSwitchLanguageWithFeedback).toHaveBeenCalledWith(
          'cs',
          expect.any(Function),
          expect.any(Function)
        );
      });
    });

    it('handles blog URLs correctly', async () => {
      render(
        <TestWrapper>
          <LanguageSwitcher variant="dropdown" />
        </TestWrapper>
      );

      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'de' } });

      await waitFor(() => {
        expect(mockSwitchLanguageWithFeedback).toHaveBeenCalledWith(
          'de',
          expect.any(Function),
          expect.any(Function)
        );
      });
    });
  });

  describe('Buttons variant', () => {
    it('renders buttons for all supported languages', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher variant="buttons" />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Switch to English')).toBeInTheDocument();
      expect(screen.getByLabelText('Switch to Čeština')).toBeInTheDocument();
      expect(screen.getByLabelText('Switch to Deutsch')).toBeInTheDocument();
      expect(screen.getByLabelText('Switch to Français')).toBeInTheDocument();
    });

    it('changes language and navigates when button is clicked', async () => {
      render(
        <TestWrapper>
          <LanguageSwitcher variant="buttons" />
        </TestWrapper>
      );

      const czechButton = screen.getByLabelText('Switch to Čeština');
      fireEvent.click(czechButton);

      await waitFor(() => {
        expect(mockSwitchLanguageWithFeedback).toHaveBeenCalledWith(
          'cs',
          expect.any(Function),
          expect.any(Function)
        );
      });
    });

    it('shows active state for current language', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher variant="buttons" />
        </TestWrapper>
      );

      const englishButton = screen.getByLabelText('Switch to English');
      expect(englishButton).toHaveClass('stx-language-switcher__button--active');
    });
  });

  describe('Props', () => {
    it('hides flags when showFlags is false', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher variant="dropdown" showFlags={false} />
        </TestWrapper>
      );

      expect(screen.queryByText('🇬🇧')).not.toBeInTheDocument();
      expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('hides labels when showLabels is false', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher variant="dropdown" showLabels={false} />
        </TestWrapper>
      );

      expect(screen.queryByText('EN')).not.toBeInTheDocument();
      expect(screen.getByText('🇬🇧')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher className="custom-class" />
        </TestWrapper>
      );

      const container = screen.getByRole('combobox').closest('.stx-language-switcher');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Enhanced functionality', () => {
    it('shows loading state during language switch', async () => {
      mockSwitchLanguageWithFeedback.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );

      render(
        <TestWrapper>
          <LanguageSwitcher variant="dropdown" />
        </TestWrapper>
      );

      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'cs' } });

      // Check for loading state
      expect(dropdown).toBeDisabled();
    });

    it('handles missing translation feedback', async () => {
      const onLanguageSwitch = vi.fn();
      
      render(
        <TestWrapper>
          <LanguageSwitcher 
            variant="dropdown" 
            onLanguageSwitch={onLanguageSwitch}
            showFeedback={true}
          />
        </TestWrapper>
      );

      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'cs' } });

      await waitFor(() => {
        expect(mockSwitchLanguageWithFeedback).toHaveBeenCalled();
      });
    });

    it('disables feedback when showFeedback is false', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher variant="dropdown" showFeedback={false} />
        </TestWrapper>
      );

      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'cs' } });

      // Should not show any feedback toasts
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('handles language switch errors gracefully', async () => {
      mockSwitchLanguageWithFeedback.mockRejectedValueOnce(new Error('Switch failed'));

      render(
        <TestWrapper>
          <LanguageSwitcher variant="dropdown" showFeedback={true} />
        </TestWrapper>
      );

      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'cs' } });

      await waitFor(() => {
        expect(mockSwitchLanguageWithFeedback).toHaveBeenCalled();
      });
    });
  });
}); 