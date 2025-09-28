import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from '../page';
import { directNotificationService } from '@/services/notificationService';
import { fileUploadService, voiceRecordingService } from '@/services/fileUploadService';
import { userService } from '@/services/userService';

// Mock services
vi.mock('@/services/notificationService', () => ({
  directNotificationService: {
    sendPrototypeRequest: vi.fn(),
    testConnection: vi.fn(),
  },
}));

vi.mock('@/services/fileUploadService', () => ({
  fileUploadService: {
    uploadFiles: vi.fn(),
    uploadVoiceRecording: vi.fn(),
  },
  voiceRecordingService: {
    isSupported: vi.fn(() => true),
    checkPermissions: vi.fn(() => Promise.resolve({ granted: true })),
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
    getPermissionInstructions: vi.fn(() => 'Mock instructions'),
  },
  validateFile: vi.fn(() => ({ isValid: true })),
  formatFileSize: vi.fn((size) => `${size} bytes`),
}));

vi.mock('@/services/userService', () => ({
  userService: {
    getSessionId: vi.fn(() => 'test-session-id'),
    generateSessionId: vi.fn(() => 'new-session-id'),
    storeSessionId: vi.fn(),
    getUserId: vi.fn(() => null),
    storeUserId: vi.fn(),
    registerUser: vi.fn(),
    createSubmission: vi.fn(),
    collectContactInfo: vi.fn(),
    sendConfirmation: vi.fn(),
  },
}));

// Mock environment variables
vi.mock('@/config/env', () => ({
  env: {
    API_URL: 'http://localhost:8002',
    NOTIFICATION_SERVICE_URL: 'http://localhost:8005',
    NOTIFICATION_SERVICE_API_KEY: 'test-key',
  },
}));

describe('Contact Form Components', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    vi.mocked(directNotificationService.sendPrototypeRequest).mockResolvedValue({
      success: true,
      message: 'Form submitted successfully!',
      notificationId: 'test-notification-id',
      aiResponse: {
        prototype_id: 'proto_123',
        success: true,
        summary: {
          totalAgents: 3,
          successfulAgents: 3,
          totalProcessingTime: 5.2,
        },
      },
    });

    vi.mocked(userService.registerUser).mockResolvedValue({
      user_id: 'test-user-id',
      session_id: 'test-session-id',
    });

    vi.mocked(userService.createSubmission).mockResolvedValue({
      submission_id: 'test-submission-id',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Accessibility and Basic Functionality', () => {
    it('should render contact form with all required elements', async () => {
      render(<ContactPage />);

      // Check form title and subtitle
      expect(screen.getByText('Send us a Message')).toBeInTheDocument();
      expect(screen.getByText("We'll get back to you within 24 hours")).toBeInTheDocument();

      // Check main form elements
      expect(screen.getByTestId('stx-form')).toBeInTheDocument();
      expect(screen.getByTestId('stx-form-textarea')).toBeInTheDocument();
      expect(screen.getByTestId('stx-form-submit')).toBeInTheDocument();

      // Check media elements (voice recording and file upload)
      expect(screen.getByTestId('stx-form-audio-section')).toBeInTheDocument();
      expect(screen.getByTestId('stx-form-file-upload')).toBeInTheDocument();

      // Check contact fields
      expect(screen.getByTestId('stx-form-name-input')).toBeInTheDocument();
      expect(screen.getByTestId('stx-form-contact-type')).toBeInTheDocument();
      expect(screen.getByTestId('stx-form-contact-value')).toBeInTheDocument();

      // Check privacy note
      expect(screen.getByTestId('stx-form-privacy-note')).toBeInTheDocument();
    });

    it('should have proper form accessibility attributes', () => {
      render(<ContactPage />);

      const form = screen.getByTestId('stx-form');
      const textarea = screen.getByTestId('stx-form-textarea');
      const nameInput = screen.getByTestId('stx-form-name-input');
      const submitButton = screen.getByTestId('stx-form-submit');

      // Check form has proper structure
      expect(form).toBeInTheDocument();
      expect(form.tagName).toBe('FORM');

      // Check textarea is required
      expect(textarea).toBeRequired();
      expect(textarea).toHaveAttribute('placeholder');

      // Check name input is required
      expect(nameInput).toBeRequired();

      // Check submit button
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should display default values correctly', () => {
      render(<ContactPage />);

      const textarea = screen.getByTestId('stx-form-textarea');
      const nameInput = screen.getByTestId('stx-form-name-input');
      const contactSelect = screen.getByTestId('stx-form-contact-type');
      const contactValue = screen.getByTestId('stx-form-contact-value');

      // Check default values
      expect(textarea).toHaveValue('Make a website to offer website creation solutions. It will offer webshops with payment possibilities, sites with booking, website as landing etc. We will host solutions on our platform.');
      expect(nameInput).toHaveValue('PartyZan');
      expect(contactSelect).toHaveValue('telegram');
      expect(contactValue).toHaveValue('694579866');
    });
  });

  describe('Text Input Functionality', () => {
    it('should allow text input in description field', async () => {
      render(<ContactPage />);

      const textarea = screen.getByTestId('stx-form-textarea');
      
      // Clear and type new text
      await user.clear(textarea);
      await user.type(textarea, 'This is a test description');

      expect(textarea).toHaveValue('This is a test description');
    });

    it('should allow text input in name field', async () => {
      render(<ContactPage />);

      const nameInput = screen.getByTestId('stx-form-name-input');
      
      // Clear and type new name
      await user.clear(nameInput);
      await user.type(nameInput, 'John Doe');

      expect(nameInput).toHaveValue('John Doe');
    });

    it('should allow contact type selection', async () => {
      render(<ContactPage />);

      const contactSelect = screen.getByTestId('stx-form-contact-type');
      
      // Change contact type
      await user.selectOptions(contactSelect, 'email');

      expect(contactSelect).toHaveValue('email');
    });

    it('should update contact value placeholder based on contact type', async () => {
      render(<ContactPage />);

      const contactSelect = screen.getByTestId('stx-form-contact-type');
      const contactValue = screen.getByTestId('stx-form-contact-value');
      
      // Change to email
      await user.selectOptions(contactSelect, 'email');
      expect(contactValue).toHaveAttribute('placeholder', 'your@email.com');
      expect(contactValue).toHaveAttribute('type', 'email');

      // Change to WhatsApp
      await user.selectOptions(contactSelect, 'whatsapp');
      expect(contactValue).toHaveAttribute('placeholder', '+1 234 567 8900');
      expect(contactValue).toHaveAttribute('type', 'tel');

      // Change to LinkedIn
      await user.selectOptions(contactSelect, 'linkedin');
      expect(contactValue).toHaveAttribute('placeholder', 'https://linkedin.com/in/your-profile');
      expect(contactValue).toHaveAttribute('type', 'text');
    });
  });

  describe('Voice Recording Functionality', () => {
    it('should display voice recording button when supported', () => {
      render(<ContactPage />);

      const audioButton = screen.getByTestId('stx-form-audio-btn');
      expect(audioButton).toBeInTheDocument();
      expect(audioButton).toHaveTextContent('🎤 Record voice message');
    });

    it('should handle microphone permission denied state', async () => {
      // Mock permission denied
      vi.mocked(voiceRecordingService.checkPermissions).mockResolvedValue({ 
        granted: false, 
        error: 'Permission denied' 
      });

      render(<ContactPage />);

      // Wait for permission check
      await waitFor(() => {
        expect(screen.getByText('🚫 Microphone access denied')).toBeInTheDocument();
        expect(screen.getByText('🔧 Enable Microphone')).toBeInTheDocument();
      });
    });

    it('should start recording when button is clicked', async () => {
      render(<ContactPage />);

      const audioButton = screen.getByTestId('stx-form-audio-btn');
      
      await user.click(audioButton);

      expect(voiceRecordingService.startRecording).toHaveBeenCalled();
    });

    it('should display recording info when recording', async () => {
      // Mock recording state
      vi.mocked(voiceRecordingService.startRecording).mockImplementation(() => {
        // Simulate recording started
        return Promise.resolve();
      });

      render(<ContactPage />);

      const audioButton = screen.getByTestId('stx-form-audio-btn');
      
      await user.click(audioButton);

      // The component should update to show recording state
      // Note: This test might need adjustment based on actual component behavior
      await waitFor(() => {
        expect(audioButton).toHaveTextContent('⏹️ Stop recording');
      });
    });
  });

  describe('File Upload Functionality', () => {
    it('should display file upload area', () => {
      render(<ContactPage />);

      const fileUpload = screen.getByTestId('stx-form-file-upload');
      expect(fileUpload).toBeInTheDocument();
      expect(fileUpload).toHaveTextContent('📎 Attach documents (optional)');
    });

    it('should have hidden file input', () => {
      render(<ContactPage />);

      const fileInput = screen.getByTestId('stx-form-file-input');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('type', 'file');
      expect(fileInput).toHaveAttribute('multiple');
      expect(fileInput).toHaveAttribute('accept');
    });

    it('should handle file selection', async () => {
      // Mock file upload
      vi.mocked(fileUploadService.uploadFiles).mockResolvedValue([
        {
          fileId: 'test-file-id',
          originalName: 'test.pdf',
          fileSize: 1024,
          type: 'application/pdf',
          tempSessionId: 'test-session',
        },
      ]);

      render(<ContactPage />);

      const fileInput = screen.getByTestId('stx-form-file-input');
      
      // Create a mock file
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      
      await user.upload(fileInput, file);

      expect(fileUploadService.uploadFiles).toHaveBeenCalledWith([file]);
    });

    it('should display uploaded files', async () => {
      // Mock file upload
      vi.mocked(fileUploadService.uploadFiles).mockResolvedValue([
        {
          fileId: 'test-file-id',
          originalName: 'test.pdf',
          fileSize: 1024,
          type: 'application/pdf',
          tempSessionId: 'test-session',
        },
      ]);

      render(<ContactPage />);

      const fileInput = screen.getByTestId('stx-form-file-input');
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      
      await user.upload(fileInput, file);

      // Wait for file to be uploaded and displayed
      await waitFor(() => {
        expect(screen.getByTestId('stx-form-file-list')).toBeInTheDocument();
        expect(screen.getByText('📄 test.pdf (1024 bytes)')).toBeInTheDocument();
        expect(screen.getByText('✅ Uploaded')).toBeInTheDocument();
      });
    });

    it('should allow file removal', async () => {
      // Mock file upload
      vi.mocked(fileUploadService.uploadFiles).mockResolvedValue([
        {
          fileId: 'test-file-id',
          originalName: 'test.pdf',
          fileSize: 1024,
          type: 'application/pdf',
          tempSessionId: 'test-session',
        },
      ]);

      render(<ContactPage />);

      const fileInput = screen.getByTestId('stx-form-file-input');
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      
      await user.upload(fileInput, file);

      // Wait for file to be uploaded
      await waitFor(() => {
        expect(screen.getByTestId('stx-form-file-list')).toBeInTheDocument();
      });

      // Click remove button
      const removeButton = screen.getByTestId('stx-form-file-remove');
      await user.click(removeButton);

      // File should be removed
      expect(screen.queryByTestId('stx-form-file-list')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should disable submit button when description is empty', async () => {
      render(<ContactPage />);

      const textarea = screen.getByTestId('stx-form-textarea');
      const submitButton = screen.getByTestId('stx-form-submit');

      // Clear description
      await user.clear(textarea);

      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when name is empty', async () => {
      render(<ContactPage />);

      const nameInput = screen.getByTestId('stx-form-name-input');
      const submitButton = screen.getByTestId('stx-form-submit');

      // Clear name
      await user.clear(nameInput);

      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when contact value is empty', async () => {
      render(<ContactPage />);

      const contactValue = screen.getByTestId('stx-form-contact-value');
      const submitButton = screen.getByTestId('stx-form-submit');

      // Clear contact value
      await user.clear(contactValue);

      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when all required fields are filled', async () => {
      render(<ContactPage />);

      const textarea = screen.getByTestId('stx-form-textarea');
      const nameInput = screen.getByTestId('stx-form-name-input');
      const contactValue = screen.getByTestId('stx-form-contact-value');
      const submitButton = screen.getByTestId('stx-form-submit');

      // Fill all fields
      await user.clear(textarea);
      await user.type(textarea, 'Test description');
      await user.clear(nameInput);
      await user.type(nameInput, 'Test Name');
      await user.clear(contactValue);
      await user.type(contactValue, 'test@example.com');

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      render(<ContactPage />);

      const textarea = screen.getByTestId('stx-form-textarea');
      const nameInput = screen.getByTestId('stx-form-name-input');
      const contactValue = screen.getByTestId('stx-form-contact-value');
      const submitButton = screen.getByTestId('stx-form-submit');

      // Fill form
      await user.clear(textarea);
      await user.type(textarea, 'Test project description');
      await user.clear(nameInput);
      await user.type(nameInput, 'John Doe');
      await user.clear(contactValue);
      await user.type(contactValue, 'john@example.com');

      // Submit form
      await user.click(submitButton);

      // Wait for submission
      await waitFor(() => {
        expect(directNotificationService.sendPrototypeRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'Test project description',
            name: 'John Doe',
            contactType: 'telegram',
            contactValue: 'john@example.com',
            hasRecording: false,
            recordingTime: 0,
            files: [],
          })
        );
      });
    });

    it('should show success message after successful submission', async () => {
      render(<ContactPage />);

      const submitButton = screen.getByTestId('stx-form-submit');

      // Submit form with default values
      await user.click(submitButton);

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
        expect(screen.getByText('✅ Submitted!')).toBeInTheDocument();
      });
    });

    it('should show error message on submission failure', async () => {
      // Mock submission failure
      vi.mocked(directNotificationService.sendPrototypeRequest).mockResolvedValue({
        success: false,
        error: 'Submission failed',
      });

      render(<ContactPage />);

      const submitButton = screen.getByTestId('stx-form-submit');

      // Submit form
      await user.click(submitButton);

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText('Submission failed')).toBeInTheDocument();
      });
    });

    it('should show loading state during submission', async () => {
      // Mock delayed submission
      vi.mocked(directNotificationService.sendPrototypeRequest).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Success' }), 1000))
      );

      render(<ContactPage />);

      const submitButton = screen.getByTestId('stx-form-submit');

      // Submit form
      await user.click(submitButton);

      // Check loading state
      expect(submitButton).toHaveTextContent('⏳ Submitting...');
      expect(submitButton).toBeDisabled();
    });

    it('should show action buttons after successful submission', async () => {
      render(<ContactPage />);

      const submitButton = screen.getByTestId('stx-form-submit');

      // Submit form
      await user.click(submitButton);

      // Wait for success and action buttons
      await waitFor(() => {
        expect(screen.getByText('📊 View Your Dashboard')).toBeInTheDocument();
        expect(screen.getByText('🤖 View Prototype')).toBeInTheDocument();
        expect(screen.getByText('📋 Development Plan')).toBeInTheDocument();
        expect(screen.getByText('💼 Service Offer')).toBeInTheDocument();
        expect(screen.getByText('🚀 Request New Prototype')).toBeInTheDocument();
      });
    });
  });

  describe('Integration with Submission Service', () => {
    it('should register user before submission', async () => {
      render(<ContactPage />);

      const submitButton = screen.getByTestId('stx-form-submit');

      // Submit form with default values
      await user.click(submitButton);

      // Wait for user registration
      await waitFor(() => {
        expect(userService.registerUser).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'PartyZan',
            contact_info: [
              {
                type: 'telegram',
                value: '694579866',
                is_primary: true,
              },
            ],
            source: 'prototype',
          })
        );
      });
    });

    it('should create submission record after user registration', async () => {
      render(<ContactPage />);

      const submitButton = screen.getByTestId('stx-form-submit');

      // Submit form
      await user.click(submitButton);

      // Wait for submission creation
      await waitFor(() => {
        expect(userService.createSubmission).toHaveBeenCalledWith(
          'test-user-id',
          expect.objectContaining({
            user_id: 'test-user-id',
            page_type: 'prototype',
            description: expect.any(String),
            files: [],
            status: 'pending',
          })
        );
      });
    });
  });
});