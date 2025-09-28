'use client';

import React, { useState } from 'react';
import { Language } from '@/components/providers/LanguageProvider';
import { ContentType } from '@/lib/content/types';
import { Alert } from './Alert';
import { Button } from './Button';

interface TranslationFeedbackProps {
  language: Language;
  contentType?: ContentType;
  englishSlug?: string;
  missingTranslation?: boolean;
  onReportIssue?: (feedback: TranslationFeedback) => void;
  onRequestTranslation?: (request: TranslationRequest) => void;
  className?: string;
}

interface TranslationFeedback {
  language: Language;
  contentType?: ContentType;
  englishSlug?: string;
  issueType: 'missing' | 'incorrect' | 'outdated' | 'other';
  description: string;
  userEmail?: string;
}

interface TranslationRequest {
  language: Language;
  contentType?: ContentType;
  englishSlug?: string;
  priority: 'low' | 'medium' | 'high';
  userEmail?: string;
  reason?: string;
}

export function TranslationFeedback({
  language,
  contentType,
  englishSlug,
  missingTranslation = false,
  onReportIssue,
  onRequestTranslation,
  className = ''
}: TranslationFeedbackProps) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState<Partial<TranslationFeedback>>({
    language,
    contentType,
    englishSlug,
    issueType: 'missing'
  });
  const [requestData, setRequestData] = useState<Partial<TranslationRequest>>({
    language,
    contentType,
    englishSlug,
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const languageNames: Record<Language, string> = {
    en: 'English',
    cs: 'Czech',
    de: 'German',
    fr: 'French',
    ar: 'Arabic'
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackData.description?.trim()) return;

    setIsSubmitting(true);
    try {
      if (onReportIssue) {
        await onReportIssue(feedbackData as TranslationFeedback);
      }
      setSubmitted(true);
      setShowFeedbackForm(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      if (onRequestTranslation) {
        await onRequestTranslation(requestData as TranslationRequest);
      }
      setSubmitted(true);
      setShowRequestForm(false);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Alert
        variant="success"
        title="Thank you!"
        description="Your feedback has been submitted and will help us improve our translations."
        className={className}
      />
    );
  }

  if (missingTranslation) {
    return (
      <div className={`stx-translation-feedback ${className}`}>
        <Alert
          variant="warning"
          title="Translation Not Available"
          description={`This content is not yet available in ${languageNames[language]}. You can help us prioritize translations by requesting this content.`}
        />
        
        <div className="stx-translation-feedback__actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRequestForm(true)}
          >
            Request Translation
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFeedbackForm(true)}
          >
            Report Issue
          </Button>
        </div>

        {/* Translation Request Form */}
        {showRequestForm && (
          <div className="stx-translation-feedback__form">
            <h4>Request Translation</h4>
            <form onSubmit={handleRequestSubmit}>
              <div className="stx-form-group">
                <label htmlFor="priority">Priority:</label>
                <select
                  id="priority"
                  value={requestData.priority}
                  onChange={(e) => setRequestData(prev => ({ 
                    ...prev, 
                    priority: e.target.value as 'low' | 'medium' | 'high' 
                  }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="stx-form-group">
                <label htmlFor="reason">Why do you need this translation? (optional):</label>
                <textarea
                  id="reason"
                  value={requestData.reason || ''}
                  onChange={(e) => setRequestData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Help us understand why this translation is important to you..."
                  rows={3}
                />
              </div>

              <div className="stx-form-group">
                <label htmlFor="email">Email (optional, for updates):</label>
                <input
                  type="email"
                  id="email"
                  value={requestData.userEmail || ''}
                  onChange={(e) => setRequestData(prev => ({ ...prev, userEmail: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>

              <div className="stx-form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Feedback Form */}
        {showFeedbackForm && (
          <div className="stx-translation-feedback__form">
            <h4>Report Translation Issue</h4>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="stx-form-group">
                <label htmlFor="issueType">Issue Type:</label>
                <select
                  id="issueType"
                  value={feedbackData.issueType}
                  onChange={(e) => setFeedbackData(prev => ({ 
                    ...prev, 
                    issueType: e.target.value as TranslationFeedback['issueType']
                  }))}
                >
                  <option value="missing">Missing Translation</option>
                  <option value="incorrect">Incorrect Translation</option>
                  <option value="outdated">Outdated Translation</option>
                  <option value="other">Other Issue</option>
                </select>
              </div>

              <div className="stx-form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  value={feedbackData.description || ''}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Please describe the translation issue..."
                  rows={4}
                  required
                />
              </div>

              <div className="stx-form-group">
                <label htmlFor="feedbackEmail">Email (optional, for follow-up):</label>
                <input
                  type="email"
                  id="feedbackEmail"
                  value={feedbackData.userEmail || ''}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, userEmail: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>

              <div className="stx-form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting || !feedbackData.description?.trim()}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeedbackForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // For existing translations, show minimal feedback option
  return (
    <div className={`stx-translation-feedback stx-translation-feedback--minimal ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowFeedbackForm(true)}
        className="stx-translation-feedback__trigger"
      >
        Report Translation Issue
      </Button>

      {showFeedbackForm && (
        <div className="stx-translation-feedback__form">
          <h4>Report Translation Issue</h4>
          <form onSubmit={handleFeedbackSubmit}>
            <div className="stx-form-group">
              <label htmlFor="issueType">Issue Type:</label>
              <select
                id="issueType"
                value={feedbackData.issueType}
                onChange={(e) => setFeedbackData(prev => ({ 
                  ...prev, 
                  issueType: e.target.value as TranslationFeedback['issueType']
                }))}
              >
                <option value="incorrect">Incorrect Translation</option>
                <option value="outdated">Outdated Translation</option>
                <option value="other">Other Issue</option>
              </select>
            </div>

            <div className="stx-form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={feedbackData.description || ''}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Please describe the translation issue..."
                rows={3}
                required
              />
            </div>

            <div className="stx-form-actions">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting || !feedbackData.description?.trim()}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowFeedbackForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}