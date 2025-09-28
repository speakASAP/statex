import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ProcessingFeedback } from '../ProcessingFeedback';
import { processingFeedbackService } from '@/services/processingFeedbackService';

// Mock the processing feedback service
vi.mock('@/services/processingFeedbackService', () => ({
  processingFeedbackService: {
    startMonitoring: vi.fn(),
    stopMonitoring: vi.fn(),
  }
}));

const mockProcessingFeedbackService = processingFeedbackService as any;

describe('ProcessingFeedback', () => {
  const defaultProps = {
    submissionId: 'test-submission-123',
    userId: 'test-user-456',
    isVisible: true,
    onComplete: vi.fn(),
    onError: vi.fn(),
    onRetry: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when not visible', () => {
    render(<ProcessingFeedback {...defaultProps} isVisible={false} />);
    expect(screen.queryByText('AI Processing in Progress')).not.toBeInTheDocument();
  });

  it('should render processing feedback when visible', async () => {
    const mockStatus = {
      submissionId: 'test-submission-123',
      status: 'processing' as const,
      steps: [
        {
          id: 'validation',
          name: 'Validating submission',
          status: 'completed' as const,
          progress: 100,
          estimatedTime: 2
        },
        {
          id: 'nlp_analysis',
          name: 'Analyzing text content',
          status: 'in_progress' as const,
          progress: 50,
          estimatedTime: 8
        }
      ],
      totalProgress: 25,
      estimatedTimeRemaining: 30,
      startTime: new Date()
    };

    mockProcessingFeedbackService.startMonitoring.mockResolvedValue(mockStatus);

    render(<ProcessingFeedback {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('🚀 AI Processing in Progress')).toBeInTheDocument();
    });

    expect(mockProcessingFeedbackService.startMonitoring).toHaveBeenCalledWith(
      'test-submission-123',
      'test-user-456',
      expect.any(Object)
    );
  });

  it('should display processing steps', async () => {
    const mockStatus = {
      submissionId: 'test-submission-123',
      status: 'processing' as const,
      steps: [
        {
          id: 'validation',
          name: 'Validating submission',
          status: 'completed' as const,
          progress: 100,
          estimatedTime: 2
        },
        {
          id: 'nlp_analysis',
          name: 'Analyzing text content',
          status: 'in_progress' as const,
          progress: 50,
          estimatedTime: 8
        }
      ],
      totalProgress: 25,
      estimatedTimeRemaining: 30,
      startTime: new Date()
    };

    mockProcessingFeedbackService.startMonitoring.mockResolvedValue(mockStatus);

    render(<ProcessingFeedback {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Validating submission')).toBeInTheDocument();
      expect(screen.getByText('Analyzing text content')).toBeInTheDocument();
    });
  });

  it('should handle completion callback', async () => {
    const mockStatus = {
      submissionId: 'test-submission-123',
      status: 'completed' as const,
      steps: [],
      totalProgress: 100,
      estimatedTimeRemaining: 0,
      startTime: new Date(),
      endTime: new Date()
    };

    mockProcessingFeedbackService.startMonitoring.mockImplementation((submissionId, userId, callbacks) => {
      // Simulate completion
      setTimeout(() => {
        if (callbacks?.onComplete) {
          callbacks.onComplete(mockStatus);
        }
      }, 100);
      return Promise.resolve(mockStatus);
    });

    render(<ProcessingFeedback {...defaultProps} />);

    await waitFor(() => {
      expect(defaultProps.onComplete).toHaveBeenCalledWith(mockStatus);
    });
  });

  it('should handle error callback', async () => {
    const errorMessage = 'Processing failed';
    const mockStatus = {
      submissionId: 'test-submission-123',
      status: 'failed' as const,
      steps: [],
      totalProgress: 0,
      estimatedTimeRemaining: 0,
      startTime: new Date(),
      error: errorMessage
    };

    mockProcessingFeedbackService.startMonitoring.mockImplementation((submissionId, userId, callbacks) => {
      // Simulate error
      setTimeout(() => {
        if (callbacks?.onError) {
          callbacks.onError(errorMessage, mockStatus);
        }
      }, 100);
      return Promise.resolve(mockStatus);
    });

    render(<ProcessingFeedback {...defaultProps} />);

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(<ProcessingFeedback {...defaultProps} />);
    
    unmount();
    
    expect(mockProcessingFeedbackService.stopMonitoring).toHaveBeenCalledWith('test-submission-123');
  });
});