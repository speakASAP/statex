import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { ContactFormSection } from './ContactFormSection';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

// Mock the ThemeProvider
vi.mock('@/components/providers/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light' })
}));

describe('ContactFormSection', () => {
  const defaultProps = {
    title: 'Contact Us',
    subtitle: 'Get in touch with our team',
    formTitle: 'Send us a message',
    formSubtitle: 'We\'ll get back to you within 24 hours',
    submitButtonText: 'Send Message',
    placeholder: 'Tell us about your project...'
  };

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<ContactFormSection {...defaultProps} />);

      expect(screen.getByText('Contact Us')).toBeInTheDocument();
      expect(screen.getByText('Get in touch with our team')).toBeInTheDocument();
      expect(screen.getByText('Send us a message')).toBeInTheDocument();
      expect(screen.getByText('We\'ll get back to you within 24 hours')).toBeInTheDocument();
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });

    it('renders with minimal props', () => {
      render(<ContactFormSection title="Contact" />);

      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument(); // default submit text
    });

    it('applies correct base classes', () => {
      const { container } = render(<ContactFormSection {...defaultProps} />);

      expect(container.firstChild).toHaveClass('stx-contact-form-section');
    });
  });

  describe('Default Variant', () => {
    it('renders default form structure', () => {
      render(<ContactFormSection {...defaultProps} variant="default" />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
    });

    it('renders textarea with correct attributes', () => {
      render(<ContactFormSection {...defaultProps} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('placeholder', 'Tell us about your project...');
      expect(textarea).toHaveAttribute('rows', '6');
    });

    it('renders submit button with correct text', () => {
      render(<ContactFormSection {...defaultProps} submitButtonText="Custom Submit" />);

      expect(screen.getByRole('button', { name: 'Custom Submit' })).toBeInTheDocument();
    });
  });

  describe('Prototype Variant', () => {
    it('renders prototype form structure', () => {
      render(<ContactFormSection {...defaultProps} variant="prototype" />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
    });

    it('applies prototype variant classes', () => {
      const { container } = render(<ContactFormSection {...defaultProps} variant="prototype" />);

      expect(container.firstChild).toHaveClass('stx-contact-form-section--prototype');
    });

    it('renders privacy note in prototype variant', () => {
      render(<ContactFormSection {...defaultProps} variant="prototype" />);

      expect(screen.getByText(/🔒 Your information is secure/)).toBeInTheDocument();
    });
  });

  describe('Voice Recording', () => {
    it('shows voice recording button when enabled', () => {
      render(<ContactFormSection {...defaultProps} variant="prototype" showVoiceRecording={true} />);

      expect(screen.getByText('🎤 Tell us with your voice (optional)')).toBeInTheDocument();
    });

    it('hides voice recording when disabled', () => {
      render(<ContactFormSection {...defaultProps} variant="prototype" showVoiceRecording={false} />);

      expect(screen.queryByText('🎤 Tell us with your voice (optional)')).not.toBeInTheDocument();
    });

    it('has recording button with correct structure', () => {
      render(<ContactFormSection {...defaultProps} variant="prototype" showVoiceRecording={true} />);

      const recordButton = screen.getByText('🎤 Tell us with your voice (optional)');
      expect(recordButton).toBeInTheDocument();
      expect(recordButton.closest('button')).toHaveClass('stx-contact-form__audio-btn');
    });
  });

  describe('File Upload', () => {
    it('shows file upload area when enabled', () => {
      render(<ContactFormSection {...defaultProps} variant="prototype" showFileUpload={true} />);

      expect(screen.getByText('📎 Attach documents (optional)')).toBeInTheDocument();
      expect(screen.getByText('Presentations, diagrams, documents, images, video etc.')).toBeInTheDocument();
    });

    it('hides file upload when disabled', () => {
      render(<ContactFormSection {...defaultProps} variant="prototype" showFileUpload={false} />);

      expect(screen.queryByText('📎 Attach documents (optional)')).not.toBeInTheDocument();
    });

    it('has file input with correct attributes', () => {
      render(<ContactFormSection {...defaultProps} variant="prototype" showFileUpload={true} />);

      const fileInput = document.getElementById('prototypeFileInput') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('type', 'file');
      expect(fileInput).toHaveAttribute('multiple');
      expect(fileInput).toHaveAttribute('accept', '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi');
    });
  });

  describe('Custom Form', () => {
    it('renders custom form when provided', () => {
      const customForm = <div data-testid="custom-form">Custom Form Content</div>;
      render(<ContactFormSection {...defaultProps} customForm={customForm} />);

      expect(screen.getByTestId('custom-form')).toBeInTheDocument();
      expect(screen.getByText('Custom Form Content')).toBeInTheDocument();
    });

    it('renders section title and subtitle with custom form', () => {
      const customForm = <div>Custom Form</div>;
      render(<ContactFormSection {...defaultProps} customForm={customForm} />);

      expect(screen.getByText('Contact Us')).toBeInTheDocument();
      expect(screen.getByText('Get in touch with our team')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with form data', () => {
      const onSubmit = vi.fn();
      render(<ContactFormSection {...defaultProps} variant="prototype" onSubmit={onSubmit} />);

      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Send Message' });

      act(() => {
        fireEvent.change(textarea, { target: { value: 'Test message' } });
        fireEvent.click(submitButton);
      });

      expect(onSubmit).toHaveBeenCalledWith({
        description: 'Test message',
        hasRecording: false,
        recordingTime: 0,
        files: []
      });
    });

    it('prevents default form submission', () => {
      const onSubmit = vi.fn();
      render(<ContactFormSection {...defaultProps} variant="prototype" onSubmit={onSubmit} />);

      const form = screen.getByRole('textbox').closest('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });

      act(() => {
        fireEvent(form!, submitEvent);
      });

      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe('Content Structure', () => {
    it('renders title in correct container', () => {
      const { container } = render(<ContactFormSection {...defaultProps} />);

      const titleElement = screen.getByText('Contact Us');
      expect(titleElement.closest('.stx-contact-form__section-title')).toBeInTheDocument();
    });

    it('renders subtitle in correct container', () => {
      const { container } = render(<ContactFormSection {...defaultProps} />);

      const subtitleElement = screen.getByText('Get in touch with our team');
      expect(subtitleElement.closest('.stx-contact-form__section-subtitle')).toBeInTheDocument();
    });

    it('renders form title in correct container', () => {
      const { container } = render(<ContactFormSection {...defaultProps} />);

      const formTitleElement = screen.getByText('Send us a message');
      expect(formTitleElement.closest('.stx-contact-form__form-title')).toBeInTheDocument();
    });

    it('renders textarea in correct container', () => {
      const { container } = render(<ContactFormSection {...defaultProps} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea.closest('.stx-contact-form__textarea')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form structure', () => {
      render(<ContactFormSection {...defaultProps} variant="prototype" />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<ContactFormSection {...defaultProps} />);

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });

    it('has proper form labels and placeholders', () => {
      render(<ContactFormSection {...defaultProps} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('placeholder', 'Tell us about your project...');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing optional props', () => {
      render(<ContactFormSection title="Contact" />);

      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.queryByText('Get in touch with our team')).not.toBeInTheDocument();
      expect(screen.queryByText('Send us a message')).not.toBeInTheDocument();
    });

    it('handles empty strings for optional props', () => {
      render(<ContactFormSection title="Contact" subtitle="" formTitle="" />);

      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.queryByText('Get in touch with our team')).not.toBeInTheDocument();
      expect(screen.queryByText('Send us a message')).not.toBeInTheDocument();
    });

    it('handles form submission without onSubmit callback', () => {
      render(<ContactFormSection {...defaultProps} variant="prototype" />);

      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Send Message' });

      act(() => {
        fireEvent.change(textarea, { target: { value: 'Test message' } });
        fireEvent.click(submitButton);
      });

      // Should not throw error
      expect(submitButton).toBeInTheDocument();
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'ContactFormSection',
    (theme: ThemeName) => <ContactFormSection {...defaultProps} />,
    {
      testSelectors: {
        background: '.stx-contact-form-section',
        text: '.stx-contact-form__section-title',
        border: '.stx-contact-form-section',
        action: '.stx-contact-form__submit-btn'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
