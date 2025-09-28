'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Language } from '@/components/providers/LanguageProvider';
import { ContentType } from '@/lib/content/types';
import { Alert } from '@/components/atoms/Alert';
import { Button } from '@/components/atoms/Button';
import { TranslationFeedback } from '@/components/atoms/TranslationFeedback';

interface LanguageSwitchErrorHandlerProps {
  error: string;
  currentLanguage: Language;
  targetLanguage: Language;
  contentType?: ContentType;
  englishSlug?: string;
  fallbackUrl?: string;
  onRetry?: () => void;
  onFeedback?: (feedback: any) => void;
}

const languageNames: Record<Language, string> = {
  en: 'English',
  cs: 'Czech',
  de: 'German',
  fr: 'French',
  ar: 'Arabic'
};

export function LanguageSwitchErrorHandler({
  error,
  currentLanguage,
  targetLanguage,
  contentType,
  englishSlug,
  fallbackUrl,
  onRetry,
  onFeedback
}: LanguageSwitchErrorHandlerProps) {
  const router = useRouter();

  const handleGoToFallback = () => {
    if (fallbackUrl) {
      router.push(fallbackUrl);
    }
  };

  const handleGoHome = () => {
    const homeUrl = targetLanguage === 'en' ? '/' : `/${targetLanguage}`;
    router.push(homeUrl);
  };

  const getErrorTitle = () => {
    if (error.includes('Translation not available')) {
      return 'Translation Not Available';
    }
    if (error.includes('Could not determine English slug')) {
      return 'Page Not Found';
    }
    return 'Language Switch Error';
  };

  const getErrorDescription = () => {
    const targetLangName = languageNames[targetLanguage];
    
    if (error.includes('Translation not available')) {
      return `This content is not yet available in ${targetLangName}. We're working on translating all our content to provide you with the best experience.`;
    }
    
    if (error.includes('Could not determine English slug')) {
      return `We couldn't find the equivalent page in ${targetLangName}. This might be because the page doesn't exist or the URL structure has changed.`;
    }
    
    return `An error occurred while switching to ${targetLangName}. Please try again or contact support if the problem persists.`;
  };

  const getSuggestedActions = () => {
    const actions = [];

    if (fallbackUrl) {
      actions.push(
        <Button
          key="fallback"
          variant="primary"
          onClick={handleGoToFallback}
        >
          Go to {languageNames[targetLanguage]} Homepage
        </Button>
      );
    }

    if (onRetry) {
      actions.push(
        <Button
          key="retry"
          variant="outline"
          onClick={onRetry}
        >
          Try Again
        </Button>
      );
    }

    actions.push(
      <Button
        key="home"
        variant="ghost"
        onClick={handleGoHome}
      >
        Go to Homepage
      </Button>
    );

    return actions;
  };

  return (
    <div className="stx-language-switch-error">
      <Alert
        variant="warning"
        title={getErrorTitle()}
        description={getErrorDescription()}
      />

      <div className="stx-language-switch-error__actions">
        {getSuggestedActions()}
      </div>

      {/* Show translation feedback for missing translations */}
      {error.includes('Translation not available') && contentType && englishSlug && (
        <TranslationFeedback
          language={targetLanguage}
          contentType={contentType}
          englishSlug={englishSlug}
          missingTranslation={true}
          onReportIssue={onFeedback}
          onRequestTranslation={onFeedback}
        />
      )}

      <style jsx>{`
        .stx-language-switch-error {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1rem;
        }

        .stx-language-switch-error__actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .stx-language-switch-error__actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}