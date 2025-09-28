'use client';

import React, { useState, useEffect } from 'react';
import { ProcessingStatus, ProcessingStep, processingFeedbackService } from '@/services/processingFeedbackService';
import { getPrototypeUrl } from '@/config/env';

interface ProcessingFeedbackProps {
  submissionId: string;
  userId?: string;
  isVisible: boolean;
  prototypeId?: string;
  onComplete?: (status: ProcessingStatus) => void;
  onError?: (error: string) => void;
  onRetry?: () => void;
  onClose?: () => void;
}

export function ProcessingFeedback({
  submissionId,
  userId,
  isVisible,
  prototypeId,
  onComplete,
  onError,
  onRetry,
  onClose
}: ProcessingFeedbackProps) {
  const [status, setStatus] = useState<ProcessingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isVisible || !submissionId) return;

    console.log('🔄 Starting processing feedback monitoring for:', submissionId);

    // Start monitoring
    const startMonitoring = async () => {
      try {
        const initialStatus = await processingFeedbackService.startMonitoring(
          submissionId,
          userId,
          {
            onStatusUpdate: (updatedStatus) => {
              console.log('📊 Status update:', updatedStatus);
              setStatus(updatedStatus);
              setError(null);
            },
            onStepUpdate: (step) => {
              console.log('👣 Step update:', step);
            },
            onComplete: (finalStatus) => {
              console.log('✅ Processing complete:', finalStatus);
              setStatus(finalStatus);
              if (onComplete) {
                onComplete(finalStatus);
              }
            },
            onError: (errorMessage, errorStatus) => {
              console.error('❌ Processing error:', errorMessage);
              setError(errorMessage);
              setStatus(errorStatus);
              if (onError) {
                onError(errorMessage);
              }
            }
          }
        );

        setStatus(initialStatus);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to start monitoring';
        console.error('❌ Failed to start monitoring:', err);
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
      }
    };

    startMonitoring();

    // Cleanup on unmount
    return () => {
      console.log('🛑 Stopping processing feedback monitoring');
      processingFeedbackService.stopMonitoring(submissionId);
    };
  }, [isVisible]); // Only depend on isVisible to prevent restart

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setStatus(null);
    
    if (onRetry) {
      onRetry();
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStepIcon = (step: ProcessingStep): string => {
    switch (step.status) {
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'in_progress':
        return '🔄';
      default:
        return '⏳';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'completed':
        return '🎉';
      case 'failed':
        return '💥';
      case 'processing':
        return '⚙️';
      default:
        return '🚀';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="processing-feedback">
      <div className="processing-feedback__container">
        {/* Header */}
        <div className="processing-feedback__header">
          <div className="processing-feedback__header-content">
            <div className="processing-feedback__title">
              {status ? getStatusIcon(status.status) : '🚀'} AI Processing in Progress
            </div>
            {onClose && (
              <button 
                className="processing-feedback__close-button"
                onClick={onClose}
                aria-label="Close processing feedback"
              >
                ✕
              </button>
            )}
          </div>
          {status && (
            <div className="processing-feedback__subtitle">
              {status.status === 'completed' 
                ? 'Analysis Complete!' 
                : status.status === 'failed'
                ? 'Processing Failed'
                : `Processing your submission...`}
            </div>
          )}
        </div>

        {/* Overall Progress */}
        {status && (
          <div className="processing-feedback__overall">
            <div className="processing-feedback__progress-container">
              <div className="processing-feedback__progress-bar">
                <div 
                  className="processing-feedback__progress-fill"
                  style={{ width: `${status.totalProgress}%` }}
                />
              </div>
              <div className="processing-feedback__progress-text">
                {status.totalProgress}% Complete
              </div>
            </div>
            
            {status.estimatedTimeRemaining > 0 && status.status === 'processing' && (
              <div className="processing-feedback__time-remaining">
                ⏱️ Estimated time remaining: {formatTime(status.estimatedTimeRemaining)}
              </div>
            )}
          </div>
        )}

        {/* Processing Steps */}
        {status && (
          <div className="processing-feedback__steps">
            <div className="processing-feedback__steps-title">Processing Steps:</div>
            <div className="processing-feedback__steps-list">
              {status.steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`processing-feedback__step ${step.status}`}
                >
                  <div className="processing-feedback__step-icon">
                    {getStepIcon(step)}
                  </div>
                  <div className="processing-feedback__step-content">
                    <div className="processing-feedback__step-name">
                      {step.name}
                    </div>
                    {step.status === 'in_progress' && (
                      <div className="processing-feedback__step-progress">
                        <div className="processing-feedback__step-progress-bar">
                          <div 
                            className="processing-feedback__step-progress-fill"
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                        <span className="processing-feedback__step-progress-text">
                          {step.progress}%
                        </span>
                      </div>
                    )}
                    {step.error && (
                      <div className="processing-feedback__step-error">
                        ⚠️ {step.error}
                      </div>
                    )}
                    {step.actualTime && step.status === 'completed' && (
                      <div className="processing-feedback__step-time">
                        ⏱️ {formatTime(step.actualTime)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="processing-feedback__error">
            <div className="processing-feedback__error-icon">⚠️</div>
            <div className="processing-feedback__error-content">
              <div className="processing-feedback__error-title">Processing Error</div>
              <div className="processing-feedback__error-message">{error}</div>
              <button 
                className="processing-feedback__retry-button"
                onClick={handleRetry}
              >
                🔄 Retry Processing
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {status?.status === 'completed' && (
          <div className="processing-feedback__success">
            <div className="processing-feedback__success-icon">🎉</div>
            <div className="processing-feedback__success-content">
              <div className="processing-feedback__success-title">
                Processing Complete!
              </div>
              <div className="processing-feedback__success-message">
                Your submission has been analyzed by {status.summary?.successfulAgents || 'multiple'} AI agents.
                {status.endTime && status.startTime && (
                  <div className="processing-feedback__success-time">
                    Total time: {formatTime(Math.floor((status.endTime.getTime() - status.startTime.getTime()) / 1000))}
                  </div>
                )}
              </div>
              
              {/* Prototype Links */}
              {prototypeId && (
                <div className="processing-feedback__prototype-links">
                  <div className="processing-feedback__prototype-links-title">
                    🚀 Your Prototype is Ready!
                  </div>
                  <div className="processing-feedback__prototype-links-buttons">
                    <a
                      href={getPrototypeUrl(prototypeId)}
                      className="processing-feedback__prototype-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🤖 View Prototype
                    </a>
                    <a
                      href={getPrototypeUrl(prototypeId, 'plan')}
                      className="processing-feedback__prototype-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📋 Development Plan
                    </a>
                    <a
                      href={getPrototypeUrl(prototypeId, 'offer')}
                      className="processing-feedback__prototype-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      💼 Service Offer
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Step Indicator */}
        {status?.currentStep && status.status === 'processing' && (
          <div className="processing-feedback__current-step">
            <div className="processing-feedback__current-step-icon">🔄</div>
            <div className="processing-feedback__current-step-text">
              Currently: {status.currentStep}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .processing-feedback {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .processing-feedback__container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .processing-feedback__header {
          text-align: center;
          margin-bottom: 24px;
        }

        .processing-feedback__header-content {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .processing-feedback__title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .processing-feedback__close-button {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .processing-feedback__close-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .processing-feedback__close-button:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .processing-feedback__subtitle {
          font-size: 16px;
          color: #6b7280;
        }

        .processing-feedback__overall {
          margin-bottom: 24px;
        }

        .processing-feedback__progress-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .processing-feedback__progress-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .processing-feedback__progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #10b981);
          transition: width 0.3s ease;
        }

        .processing-feedback__progress-text {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          min-width: 80px;
          text-align: right;
        }

        .processing-feedback__time-remaining {
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }

        .processing-feedback__steps {
          margin-bottom: 24px;
        }

        .processing-feedback__steps-title {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
        }

        .processing-feedback__steps-list {
          space-y: 8px;
        }

        .processing-feedback__step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .processing-feedback__step.pending {
          background: #f9fafb;
        }

        .processing-feedback__step.in_progress {
          background: #eff6ff;
          border: 1px solid #dbeafe;
        }

        .processing-feedback__step.completed {
          background: #f0fdf4;
          border: 1px solid #dcfce7;
        }

        .processing-feedback__step.failed {
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .processing-feedback__step-icon {
          font-size: 18px;
          margin-top: 2px;
        }

        .processing-feedback__step-content {
          flex: 1;
        }

        .processing-feedback__step-name {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }

        .processing-feedback__step-progress {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .processing-feedback__step-progress-bar {
          flex: 1;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .processing-feedback__step-progress-fill {
          height: 100%;
          background: #3b82f6;
          transition: width 0.3s ease;
        }

        .processing-feedback__step-progress-text {
          font-size: 12px;
          color: #6b7280;
          min-width: 30px;
        }

        .processing-feedback__step-error {
          font-size: 12px;
          color: #dc2626;
          margin-top: 4px;
        }

        .processing-feedback__step-time {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .processing-feedback__error {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .processing-feedback__error-icon {
          font-size: 20px;
          color: #dc2626;
        }

        .processing-feedback__error-content {
          flex: 1;
        }

        .processing-feedback__error-title {
          font-size: 16px;
          font-weight: 600;
          color: #dc2626;
          margin-bottom: 4px;
        }

        .processing-feedback__error-message {
          font-size: 14px;
          color: #7f1d1d;
          margin-bottom: 12px;
        }

        .processing-feedback__retry-button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .processing-feedback__retry-button:hover {
          background: #b91c1c;
        }

        .processing-feedback__success {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #f0fdf4;
          border: 1px solid #dcfce7;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .processing-feedback__success-icon {
          font-size: 20px;
        }

        .processing-feedback__success-content {
          flex: 1;
        }

        .processing-feedback__success-title {
          font-size: 16px;
          font-weight: 600;
          color: #166534;
          margin-bottom: 4px;
        }

        .processing-feedback__success-message {
          font-size: 14px;
          color: #15803d;
        }

        .processing-feedback__success-time {
          font-size: 12px;
          color: #16a34a;
          margin-top: 4px;
        }

        .processing-feedback__prototype-links {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .processing-feedback__prototype-links-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
          text-align: center;
        }

        .processing-feedback__prototype-links-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .processing-feedback__prototype-link {
          display: inline-block;
          padding: 8px 16px;
          background: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .processing-feedback__prototype-link:hover {
          background: #059669;
        }

        .processing-feedback__prototype-link:nth-child(2) {
          background: #3b82f6;
        }

        .processing-feedback__prototype-link:nth-child(2):hover {
          background: #2563eb;
        }

        .processing-feedback__prototype-link:nth-child(3) {
          background: #f59e0b;
        }

        .processing-feedback__prototype-link:nth-child(3):hover {
          background: #d97706;
        }

        .processing-feedback__current-step {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 8px;
          margin-top: 16px;
        }

        .processing-feedback__current-step-icon {
          font-size: 16px;
          animation: spin 2s linear infinite;
        }

        .processing-feedback__current-step-text {
          font-size: 14px;
          color: #1d4ed8;
          font-weight: 500;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .processing-feedback {
            padding: 12px;
          }

          .processing-feedback__container {
            padding: 16px;
          }

          .processing-feedback__title {
            font-size: 20px;
          }

          .processing-feedback__step {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
}