'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  detectOptimalTheme,
  getAutoDetectPreference,
  trackThemeSwitch,
  Theme,
  isValidTheme
} from '@/lib/themeDetection';
import { loadThemeCSS, preloadThemeCSS } from '@/lib/themeCSSLoader';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  autoDetect: boolean;
  setAutoDetect: (enabled: boolean) => void;
  isInitialized: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [autoDetect, setAutoDetectState] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Get auto-detect preference
        const savedAutoDetect = getAutoDetectPreference();
        setAutoDetectState(savedAutoDetect);

        if (savedAutoDetect) {
          // Use intelligent theme detection
          const detectedTheme = await detectOptimalTheme();
          if (isValidTheme(detectedTheme)) {
            setThemeState(detectedTheme);
          } else {
            // Fallback to saved theme or light
            const savedTheme = localStorage.getItem('statex-theme') as Theme;
            if (savedTheme && isValidTheme(savedTheme)) {
              setThemeState(savedTheme);
            } else {
              setThemeState('light');
            }
          }
        } else {
          // Use saved theme preference
          const savedTheme = localStorage.getItem('statex-theme') as Theme;
          if (savedTheme && isValidTheme(savedTheme)) {
            setThemeState(savedTheme);
          } else {
            setThemeState('light');
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize theme:', error);
        setThemeState('light');
        setIsInitialized(true);
      }
    };

    initializeTheme();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // Update data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);

    // Save theme preference
    localStorage.setItem('statex-theme', theme);

    // Load theme CSS
    loadThemeCSS(theme).catch(error => {
      console.error('Failed to load theme CSS:', error);
    });

    // Preload adjacent themes for faster switching
    const themes: Theme[] = ['light', 'dark', 'eu', 'uae'];
    const currentIndex = themes.indexOf(theme);
    const adjacentThemes = [
      themes[(currentIndex - 1 + themes.length) % themes.length],
      themes[(currentIndex + 1) % themes.length]
    ];

    adjacentThemes.forEach(adjacentTheme => {
      if (adjacentTheme) {
        preloadThemeCSS(adjacentTheme);
      }
    });

    // Track theme switch for analytics
    trackThemeSwitch(theme);
  }, [theme, isInitialized]);

  const setTheme = (newTheme: Theme) => {
    if (!isValidTheme(newTheme)) {
      console.warn(`Invalid theme: ${newTheme}`);
      return;
    }

    setThemeState(newTheme);
    setAutoDetectState(false);
    localStorage.setItem('statex-auto-detect', 'false');
  };

  const setAutoDetect = (enabled: boolean) => {
    setAutoDetectState(enabled);
    localStorage.setItem('statex-auto-detect', enabled.toString());

    if (enabled) {
      // Re-detect theme when auto-detect is enabled
      detectOptimalTheme().then(detectedTheme => {
        if (isValidTheme(detectedTheme)) {
          setThemeState(detectedTheme);
        }
      }).catch(error => {
        console.error('Failed to detect theme:', error);
      });
    }
  };

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'eu', 'uae'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex]!;

    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      autoDetect,
      setAutoDetect,
      isInitialized
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
