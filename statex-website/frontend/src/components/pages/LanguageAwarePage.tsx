'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage, Language } from '@/components/providers/LanguageProvider';
import { useTranslationService } from '@/lib/services/translationService';
import { ContentType } from '@/lib/content/types';
import { TranslationFeedback } from '@/components/atoms/TranslationFeedback';
import { Alert } from '@/components/atoms/Alert';

interface LanguageAwarePageProps {
  children: React.ReactNode;
  contentType?: ContentType;
  englishSlug?: string;
  availableLanguages?: Language[];
  showTranslationFeedback?: boolean;
  onLanguageUnavailable?: (language: Language) => void;
}

export function LanguageAwarePage({
  children,
  contentType,
  englishSlug,
  availableLanguages,
  showTranslationFeedback = true,
  onLanguageUnavailable
}: LanguageAwarePageProps) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const { getAvailableLanguagesForContent } = useTranslationService();
  const [actualAvailableLanguages, setActualAvailableLanguages] = useState<Language[]>(availableLanguages || []);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);
  const [translationStatus, setTranslationStatus] = useState<{
    isAvailable: boolean;
    isPartial: boolean;
    lastUpdated?: string;
  }>({ isAvailable: true, isPartial: false });

  // Check available languages when component mounts or content changes
  useEffect(() => {
    if (contentType && englishSlug && !availableLanguages) {
      setIsLoadingLanguages(true);
      getAvailableLanguagesForContent(englishSlug, contentType)
        .then(languages => {
          setActualAvailableLanguages(languages);
          
          const isCurrentLanguageAvailable = languages.includes(language);
          setTranslationStatus({
            isAvailable: isCurrentLanguageAvailable,
            isPartial: languages.length < 4, // Assuming 4 total languages
          });

          if (!isCurrentLanguageAvailable && onLanguageUnavailable) {
            onLanguageUnavailable(language);
          }
        })
        .catch(error => {
          console.error('Error checking available languages:', error);
          setTranslationStatus({ isAvailable: true, isPartial: false });
        })
        .finally(() => {
          setIsLoadingLanguages(false);
        });
    }
  }, [contentType, englishSlug, language, availableLanguages, getAvailableLanguagesForContent, onLanguageUnavailable]);

  // Handle feedback submission
  const handleTranslationFeedback = async (feedback: any) => {
    try {
      // Here you would typically send the feedback to your backend
      console.log('Translation feedback submitted:', feedback);
      
      // You could integrate with your notification service or API
      // await notificationService.submitTranslationFeedback(feedback);
      
      return true;
    } catch (error) {
      console.error('Error submitting translation feedback:', error);
      return false;
    }
  };

  const isCurrentLanguageAvailable = actualAvailableLanguages.includes(language);
  const missingLanguages = ['en', 'cs', 'de', 'fr'].filter(lang => 
    !actualAvailableLanguages.includes(lang as Language)
  );

  return (
    <div className="stx-language-aware-page">
      {/* Translation status indicator */}
      {!isLoadingLanguages && translationStatus.isPartial && isCurrentLanguageAvailable && (
        <Alert
          variant="info"
          title="Translation Status"
          description={`This content is available in ${actualAvailableLanguages.length} of 4 languages. Missing: ${missingLanguages.join(', ')}`}
          dismissible={true}
          className="stx-language-aware-page__status"
        />
      )}

      {/* Main content */}
      <div className="stx-language-aware-page__content">
        {children}
      </div>

      {/* Translation feedback */}
      {showTranslationFeedback && contentType && englishSlug && (
        <div className="stx-language-aware-page__feedback">
          {!isCurrentLanguageAvailable ? (
            <TranslationFeedback
              language={language}
              contentType={contentType}
              englishSlug={englishSlug}
              missingTranslation={true}
              onReportIssue={handleTranslationFeedback}
              onRequestTranslation={handleTranslationFeedback}
            />
          ) : (
            <TranslationFeedback
              language={language}
              contentType={contentType}
              englishSlug={englishSlug}
              missingTranslation={false}
              onReportIssue={handleTranslationFeedback}
            />
          )}
        </div>
      )}

      <style jsx>{`
        .stx-language-aware-page {
          position: relative;
        }

        .stx-language-aware-page__status {
          margin-bottom: 1rem;
        }

        .stx-language-aware-page__content {
          position: relative;
        }

        .stx-language-aware-page__feedback {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--stx-color-border-primary);
        }

        @media (max-width: 768px) {
          .stx-language-aware-page__feedback {
            margin-top: 1rem;
            padding-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}