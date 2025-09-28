import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { TranslationFeedback } from './TranslationFeedback';

describe('TranslationFeedback', () => {
  const defaultProps = {
    language: 'cs' as const,
    contentType: 'services' as const,
    englishSlug: 'digital-transformation',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Missing translation state', () => {
    it('renders missing translation alert', () => {
      render(
        <TranslationFeedback 
          {...defaultProps} 
          missingTranslation={true} 
        />
      );

      expect(screen.getByText('Translation Not Available')).toBeInTheDocument();
      expect(screen.getByText(/This content is not yet available in Czech/)).toBeInTheDocument();
    });

    it('shows request translation button', () => {
      render(
        <TranslationFeedback 
          {...defaultProps} 
          missingTranslation={true} 
        />
      );

      expect(screen.getByText('Request Translation')).toBeInTheDocument();
      expect(screen.getByText('Report Issue')).toBeInTheDocument();
    });

    it('opens translation request form', async () => {
      render(
        <TranslationFeedback 
          {...defaultProps} 
          missingTranslation={true} 
        />
      );

      const requestButton = screen.getByRole('button', { name: /request translation/i });
      fireEvent.click(requestButton);

      await waitFor(() => {
        expect(screen.getByLabelText('Priority:')).toBeInTheDocument();
        expect(screen.getByLabelText(/Why do you need this translation/)).toBeInTheDocument();
      });
    });

    it('submits translation request', async () => {
      const onRequestTranslation = vi.fn();
      
      render(
        <TranslationFeedback 
          {...defaultProps} 
          missingTranslation={true}
          onRequestTranslation={onRequestTranslation}
        />
      );

      fireEvent.click(screen.getByText('Request Translation'));

      await waitFor(() => {
        expect(screen.getByLabelText('Priority:')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText('Priority:'), { target: { value: 'high' } });
      fireEvent.change(screen.getByLabelText(/Why do you need this translation/), { 
        target: { value: 'Business critical content' } 
      });

      fireEvent.click(screen.getByText('Submit Request'));

      await waitFor(() => {
        expect(onRequestTranslation).toHaveBeenCalledWith({
          language: 'cs',
          contentType: 'services',
          englishSlug: 'digital-transformation',
          priority: 'high',
          reason: 'Business critical content',
        });
      });
    });
  });

  describe('Existing translation state', () => {
    it('renders minimal feedback trigger', () => {
      render(
        <TranslationFeedback 
          {...defaultProps} 
          missingTranslation={false} 
        />
      );

      expect(screen.getByText('Report Translation Issue')).toBeInTheDocument();
    });

    it('opens feedback form when trigger is clicked', async () => {
      render(
        <TranslationFeedback 
          {...defaultProps} 
          missingTranslation={false} 
        />
      );

      fireEvent.click(screen.getByText('Report Translation Issue'));

      await waitFor(() => {
        expect(screen.getByLabelText('Issue Type:')).toBeInTheDocument();
        expect(screen.getByLabelText('Description:')).toBeInTheDocument();
      });
    });

    it('submits feedback report', async () => {
      const onReportIssue = vi.fn();
      
      render(
        <TranslationFeedback 
          {...defaultProps} 
          missingTranslation={false}
          onReportIssue={onReportIssue}
        />
      );

      fireEvent.click(screen.getByText('Report Translation Issue'));

      await waitFor(() => {
        expect(screen.getByLabelText('Issue Type:')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText('Issue Type:'), { target: { value: 'incorrect' } });
      fireEvent.change(screen.getByLabelText('Description:'), { 
        target: { value: 'The translation is inaccurate' } 
      });

      fireEvent.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(onReportIssue).toHaveBeenCalledWith({
          language: 'cs',
          contentType: 'services',
          englishSlug: 'digital-transformation',
          issueType: 'incorrect',
          description: 'The translation is inaccurate',
        });
      });
    });
  });

  describe('Form validation', () => {
    it('disables submit button when description is empty', async () => {
      render(
        <TranslationFeedback 
          {...defaultProps} 
          missingTranslation={false} 
        />
      );

      fireEvent.click(screen.getByText('Report Translation Issue'));

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /submit/i });
        expect(submitButton).toBeDisabled();
      });
    });

    it('enables submit button when description is provided', async () => {
      render(
        <TranslationFeedback 
          {...defaultProps} 
          missingTranslation={false} 
        />
      );

      fireEvent.click(screen.getByText('Report Translation Issue'));

      await waitFor(() => {
        expect(screen.getByLabelText('Description:')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText('Description:'), { 
        target: { value: 'Some feedback' } 
      });

      const submitButton = screen.getByText('Submit');
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Success state', () => {
    it('shows success message after submission', async () => {
      const onReportIssue = vi.fn().mockResolvedValue(true);
      
      render(
        <TranslationFeedback 
          {...defaultProps} 
          missingTranslation={false}
          onReportIssue={onReportIssue}
        />
      );

      fireEvent.click(screen.getByText('Report Translation Issue'));

      await waitFor(() => {
        expect(screen.getByLabelText('Description:')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText('Description:'), { 
        target: { value: 'Test feedback' } 
      });

      fireEvent.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(screen.getByText('Thank you!')).toBeInTheDocument();
        expect(screen.getByText(/Your feedback has been submitted/)).toBeInTheDocument();
      });
    });
  });

  describe('Loading states', () => {
    it('shows loading state during submission', async () => {
      const onReportIssue = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );
      
      render(
        <TranslationFeedback 
          {...defaultProps} 
          missingTranslation={false}
          onReportIssue={onReportIssue}
        />
      );

      fireEvent.click(screen.getByText('Report Translation Issue'));

      await waitFor(() => {
        expect(screen.getByLabelText('Description:')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText('Description:'), { 
        target: { value: 'Test feedback' } 
      });

      fireEvent.click(screen.getByText('Submit'));

      expect(screen.getByText('Submitting...')).toBeInTheDocument();
    });
  });
});