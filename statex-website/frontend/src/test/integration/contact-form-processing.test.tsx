import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { FormSection } from '@/components/sections/FormSection';

// Mock services
vi.mock('@/services/notificationService', () => ({
  directNotificationService: {
    sendPrototypeRequest: vi.fn().mockResolvedValue({
      success: true,
      message: 'Form submitted successfully!',
      aiResponse: {
        prototype_id: 'test-proto-123'
      }
    })
  }
}));

vi.mock('@/services/processingFeedbackService', () => ({
  processingFeedbackService: {
    startMonitoring: vi.fn().mockResolvedValue({
      submissionId: 'test-submission-123',
      status: 'processing',
      steps: [
        {
          id: 'validation',
          name: 'Validating submission',
          status: 'completed',
          progress: 100,
          estimatedTime: 2
        }
      ],
      totalProgress: 25,
      estimatedTimeRemaining: 30,
      startTime: new Date()
    }),
    stopMonitoring: vi.fn()
  }
}));

vi.mock('@/services/userService', () => ({
  userService: {
    getSessionId: vi.fn().mockReturnValue('test-session-123'),
    generateSessionId: vi.fn().mockReturnValue('test-session-123'),
    storeSessionId: vi.fn(),
    getUserId: vi.fn().mockReturnValue('test-user-123'),
    storeUserId: vi.fn(),
    registerUser: vi.fn().mockResolvedValue({
      user_id: 'test-user-123',
      session_id: 'test-session-123'
    }),
    createSubmission: vi.fn().mockResolvedValue({
      submission_id: 'test-submission-123'
    })
  }
}));

vi.mock('@/services/fileUploadService', () => ({
  fileUploadService: {
    uploadFiles: vi.fn().mockResolvedValue([]),
    uploadVoiceRecording: vi.fn().mockResolvedValue({
      fileId: 'test-voice-123',
      tempSessionId: 'test-session-123',
      recordingTime: 10,
      fileSize: 1024
    })
  },
  voiceRecordingService: {
    isSupported: vi.fn().mockReturnValue(true),
    checkPermissions: vi.fn().mockResolvedValue({ granted: true }),
    startRecording: vi.fn().mockResolvedValue(undefined),
    stopRecording: vi.fn().mockResolvedValue(new Blob(['test'], { type: 'audio/wav' })),
    getPermissionInstructions: vi.fn().mockReturnValue('Please allow microphone access')
  },
  validateFile: vi.fn().mockReturnValue({ isValid: true }),
  formatFileSize: vi.fn().mockReturnValue('1 KB')
}));

describe('Contact Form Processing Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show processing feedback when form is submitted', async () => {
    render(
      <FormSection
        variant="contact"
        title="Contact Us"
        showContactFields={true}
        showVoiceRecording={false}
        showFileUpload={false}
      />
    );

    // Fill out the form
    const descriptionTextarea = screen.getByTestId('stx-form-textarea');
    const nameInput = screen.getByTestId('stx-form-name-input');
    const contactInput = screen.getByTestId('stx-form-contact-value');
    const submitButton = screen.getByTestId('stx-form-submit');

    await user.clear(descriptionTextarea);
    await user.type(descriptionTextarea, 'Test business inquiry');
    await user.clear(nameInput);
    await user.type(nameInput, 'John Doe');
    await user.clear(contactInput);
    await user.type(contactInput, 'john@example.com');

    // Submit the form
    await user.click(submitButton);

    // Wait for processing feedback to appear
    await waitFor(() => {
      expect(screen.getByText('🚀 AI Processing in Progress')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Check that processing steps are shown
    expect(screen.getByText('Validating submission')).toBeInTheDocument();
  });

  it('should handle form submission without contact fields (modal flow)', async () => {
    render(
      <FormSection
        variant="prototype"
        title="Get Prototype"
        showContactFields={false}
        showVoiceRecording={false}
        showFileUpload={false}
      />
    );

    // Fill out the description
    const descriptionTextarea = screen.getByTestId('stx-form-textarea');
    const submitButton = screen.getByTestId('stx-form-submit');

    await user.clear(descriptionTextarea);
    await user.type(descriptionTextarea, 'Test prototype request');

    // Submit the form
    await user.click(submitButton);

    // Should show contact collection modal first
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /contact information/i })).toBeInTheDocument();
    });
  });

  it('should show success state after processing completes', async () => {
    const mockProcessingService = await import('@/services/processingFeedbackService');
    
    // Mock the service to simulate completion
    mockProcessingService.processingFeedbackService.startMonitoring = vi.fn().mockImplementation(
      (submissionId, userId, callbacks) => {
        // Simulate completion after a short delay
        setTimeout(() => {
          if (callbacks?.onComplete) {
            callbacks.onComplete({
              submissionId,
              status: 'completed',
              steps: [],
              totalProgress: 100,
              estimatedTimeRemaining: 0,
              startTime: new Date(),
              endTime: new Date()
            });
          }
        }, 100);

        return Promise.resolve({
          submissionId,
          status: 'processing',
          steps: [],
          totalProgress: 0,
          estimatedTimeRemaining: 30,
          startTime: new Date()
        });
      }
    );

    render(
      <FormSection
        variant="contact"
        title="Contact Us"
        showContactFields={true}
        showVoiceRecording={false}
        showFileUpload={false}
      />
    );

    // Fill and submit form
    const descriptionTextarea = screen.getByTestId('stx-form-textarea');
    const nameInput = screen.getByTestId('stx-form-name-input');
    const submitButton = screen.getByTestId('stx-form-submit');

    await user.clear(descriptionTextarea);
    await user.type(descriptionTextarea, 'Test business inquiry');
    await user.clear(nameInput);
    await user.type(nameInput, 'John Doe');

    await user.click(submitButton);

    // Wait for processing to complete and success message to appear
    await waitFor(() => {
      expect(screen.getByText(/processed successfully/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Should show action buttons
    expect(screen.getByText(/view your dashboard/i)).toBeInTheDocument();
  });

  it('should handle processing errors gracefully', async () => {
    const mockProcessingService = await import('@/services/processingFeedbackService');
    
    // Mock the service to simulate error
    mockProcessingService.processingFeedbackService.startMonitoring = vi.fn().mockImplementation(
      (submissionId, userId, callbacks) => {
        // Simulate error after a short delay
        setTimeout(() => {
          if (callbacks?.onError) {
            callbacks.onError('Processing failed', {
              submissionId,
              status: 'failed',
              steps: [],
              totalProgress: 0,
              estimatedTimeRemaining: 0,
              startTime: new Date(),
              error: 'Processing failed'
            });
          }
        }, 100);

        return Promise.resolve({
          submissionId,
          status: 'processing',
          steps: [],
          totalProgress: 0,
          estimatedTimeRemaining: 30,
          startTime: new Date()
        });
      }
    );

    render(
      <FormSection
        variant="contact"
        title="Contact Us"
        showContactFields={true}
        showVoiceRecording={false}
        showFileUpload={false}
      />
    );

    // Fill and submit form
    const descriptionTextarea = screen.getByTestId('stx-form-textarea');
    const nameInput = screen.getByTestId('stx-form-name-input');
    const submitButton = screen.getByTestId('stx-form-submit');

    await user.clear(descriptionTextarea);
    await user.type(descriptionTextarea, 'Test business inquiry');
    await user.clear(nameInput);
    await user.type(nameInput, 'John Doe');

    await user.click(submitButton);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Processing failed')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});