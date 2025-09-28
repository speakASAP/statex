'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage, Language } from '@/components/providers/LanguageProvider';
import { useTranslationService, LanguageSwitchResult } from '../../lib/services/translationService';
import { Toast } from './Toast';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  className?: string;
  showFlags?: boolean;
  showLabels?: boolean;
  variant?: 'dropdown' | 'buttons';
  showCurrentLanguage?: boolean;
  showFeedback?: boolean;
  onLanguageSwitch?: (language: Language, result: LanguageSwitchResult) => void;
}

const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
  { value: 'cs', label: 'CS', flag: '🇨🇿', name: 'Čeština' },
  { value: 'de', label: 'DE', flag: '🇩🇪', name: 'Deutsch' },
  { value: 'fr', label: 'FR', flag: '🇫🇷', name: 'Français' },
  { value: 'ar', label: 'AR', flag: '🇦🇪', name: 'العربية' },
];

export function LanguageSwitcher({ 
  className = '',
  showFlags = true,
  showLabels = true,
  variant = 'dropdown',
  showCurrentLanguage = true,
  showFeedback = true,
  onLanguageSwitch
}: LanguageSwitcherProps) {
  const { language } = useLanguage();
  const { switchLanguageWithFeedback } = useTranslationService();
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  const getCurrentLanguageInfo = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.value === language) || SUPPORTED_LANGUAGES[0]!;
  };

  const handleLanguageChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value as Language;
    if (newLanguage === language) {
      return;
    }

    setIsLoading(true);
    setFeedbackMessage(null);

    try {
      await switchLanguageWithFeedback(
        newLanguage,
        // onMissingTranslation callback
        (result) => {
          if (showFeedback) {
            const langName = SUPPORTED_LANGUAGES.find(l => l.value === newLanguage)?.name || newLanguage;
            setFeedbackMessage({
              type: 'warning',
              message: `This page is not available in ${langName}. You've been redirected to the ${langName} homepage.`
            });
          }
          if (onLanguageSwitch) {
            onLanguageSwitch(newLanguage, result);
          }
        },
        // onError callback
        (error) => {
          if (showFeedback) {
            setFeedbackMessage({
              type: 'error',
              message: `Failed to switch language: ${error}`
            });
          }
          if (onLanguageSwitch) {
            onLanguageSwitch(newLanguage, { success: false, error });
          }
        }
      );

      // Success case
      if (onLanguageSwitch) {
        onLanguageSwitch(newLanguage, { success: true });
      }
    } catch (error) {
      console.error('Error switching language:', error);
      if (showFeedback) {
        setFeedbackMessage({
          type: 'error',
          message: 'An unexpected error occurred while switching languages.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-dismiss feedback messages
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const currentLang = getCurrentLanguageInfo();

  if (variant === 'buttons') {
    return (
      <>
        <div className={`stx-language-switcher stx-language-switcher--buttons ${className} ${isLoading ? 'stx-language-switcher--loading' : ''}`}>
          {showCurrentLanguage && currentLang && (
            <div className="stx-language-switcher__current">
              <span className="stx-language-switcher__current-label">Current:</span>
              <span className="stx-language-switcher__current-flag">{currentLang?.flag}</span>
              <span className="stx-language-switcher__current-name">{currentLang?.name}</span>
            </div>
          )}
          <div className="stx-language-switcher__buttons">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleLanguageChange({ target: { value: lang.value } } as React.ChangeEvent<HTMLSelectElement>)}
                disabled={isLoading}
                className={`stx-language-switcher__button ${
                  language === lang.value ? 'stx-language-switcher__button--active' : ''
                } ${isLoading ? 'stx-language-switcher__button--loading' : ''}`}
                aria-label={`Switch to ${lang.name}`}
              >
                {showFlags && <span className="stx-language-switcher__flag">{lang.flag}</span>}
                {showLabels && <span className="stx-language-switcher__label">{lang.label}</span>}
                {isLoading && language !== lang.value && (
                  <span className="stx-language-switcher__loading">⟳</span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Feedback Toast */}
        {feedbackMessage && showFeedback && (
          <Toast
            variant={feedbackMessage.type}
            description={feedbackMessage.message}
            dismissible={true}
            onDismiss={() => setFeedbackMessage(null)}
            className="stx-language-switcher__feedback"
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className={`stx-language-switcher stx-language-switcher--native ${className} ${isLoading ? 'stx-language-switcher--loading' : ''}`}>
        <select
          value={language}
          onChange={handleLanguageChange}
          disabled={isLoading}
          className="stx-language-switcher__select"
          aria-label="Select language"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value} className="stx-language-switcher__option">
              {showFlags ? `${lang.flag} ` : ''}{showLabels ? lang.name : lang.label}
            </option>
          ))}
        </select>
        <div className="stx-language-switcher__display">
          {showFlags && <span className="stx-language-switcher__flag">{currentLang.flag}</span>}
          {showLabels && <span className="stx-language-switcher__label">{currentLang.label}</span>}
          <span className="stx-language-switcher__arrow">
            {isLoading ? '⟳' : '▼'}
          </span>
        </div>
      </div>
      
      {/* Feedback Toast */}
      {feedbackMessage && showFeedback && (
        <Toast
          variant={feedbackMessage.type}
          description={feedbackMessage.message}
          dismissible={true}
          onDismiss={() => setFeedbackMessage(null)}
          className="stx-language-switcher__feedback"
        />
      )}
    </>
  );
} 