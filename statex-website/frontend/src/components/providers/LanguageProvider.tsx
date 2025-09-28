'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'cs' | 'de' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  resetLanguage: () => void;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const languageConfig = {
  en: { name: 'English', flag: '🇬🇧', direction: 'ltr' as const },
  cs: { name: 'Čeština', flag: '🇨🇿', direction: 'ltr' as const },
  de: { name: 'Deutsch', flag: '🇩🇪', direction: 'ltr' as const },
  fr: { name: 'Français', flag: '🇫🇷', direction: 'ltr' as const },
  ar: { name: 'العربية', flag: '🇦🇪', direction: 'rtl' as const },
};

const STORAGE_KEY = 'statex-language-preference';

export function LanguageProvider({ children, initialLanguage }: { children: React.ReactNode; initialLanguage?: Language }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load language preference from props, URL, and localStorage on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      // Priority: initialLanguage prop > URL language > localStorage > default
      if (initialLanguage && languageConfig[initialLanguage]) {
        setLanguageState(initialLanguage);
        localStorage.setItem(STORAGE_KEY, initialLanguage);
      } else {
        // Check URL language
        const pathname = window.location.pathname;
        const urlLanguage = detectLanguageFromURL(pathname);
        
        if (urlLanguage && languageConfig[urlLanguage]) {
          setLanguageState(urlLanguage);
          localStorage.setItem(STORAGE_KEY, urlLanguage);
        } else {
          // Fallback to localStorage
          const savedLanguage = localStorage.getItem(STORAGE_KEY) as Language;
          if (savedLanguage && languageConfig[savedLanguage]) {
            setLanguageState(savedLanguage);
          } else {
            // Default to English
            setLanguageState('en');
            localStorage.setItem(STORAGE_KEY, 'en');
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load language preference:', error);
      // Fallback to English
      setLanguageState('en');
    } finally {
      setIsInitialized(true);
    }
  }, [initialLanguage]);

  // Function to detect language from URL
  const detectLanguageFromURL = (pathname: string): Language | null => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && segments[0] && isSupportedLanguage(segments[0])) {
      return segments[0] as Language;
    }
    return null;
  };

  // Save language preference to localStorage when it changes
  const setLanguage = (newLanguage: Language) => {
    if (languageConfig[newLanguage]) {
      setLanguageState(newLanguage);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, newLanguage);
        }
      } catch (error) {
        console.warn('Failed to save language preference to localStorage:', error);
      }
    }
  };

  // Reset language to English
  const resetLanguage = () => {
    setLanguageState('en');
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, 'en');
      }
    } catch (error) {
      console.warn('Failed to reset language preference in localStorage:', error);
    }
  };

  // Update document direction when language changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      const config = languageConfig[language];
      document.documentElement.setAttribute('dir', config.direction);
      document.documentElement.setAttribute('lang', language);
    }
  }, [language, isInitialized]);

  const direction = languageConfig[language].direction;
  const isRTL = direction === 'rtl';

  // Provide context immediately, even during SSR
  const contextValue = { language, setLanguage, resetLanguage, direction, isRTL };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return a fallback during SSR or if context is not available
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      resetLanguage: () => {},
      direction: 'ltr' as const,
      isRTL: false
    };
  }
  return context;
}

// Utility function to get supported languages
export function getSupportedLanguages() {
  return Object.entries(languageConfig).map(([code, config]) => ({
    code: code as Language,
    ...config,
  }));
}

// Utility function to check if a language is supported
export function isSupportedLanguage(language: string): language is Language {
  return language in languageConfig;
}
