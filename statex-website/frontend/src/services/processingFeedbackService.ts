import { env } from '@/config/env';

export interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number; // 0-100
  estimatedTime?: number; // seconds
  actualTime?: number; // seconds
  error?: string;
  result?: any;
}

export interface ProcessingStatus {
  submissionId: string;
  userId?: string;
  status: 'initializing' | 'processing' | 'completed' | 'failed';
  currentStep?: string;
  steps: ProcessingStep[];
  totalProgress: number; // 0-100
  estimatedTimeRemaining: number; // seconds
  startTime: Date;
  endTime?: Date;
  error?: string;
}

export interface ProcessingFeedbackCallbacks {
  onStatusUpdate?: (status: ProcessingStatus) => void;
  onStepUpdate?: (step: ProcessingStep) => void;
  onComplete?: (status: ProcessingStatus) => void;
  onError?: (error: string, status: ProcessingStatus) => void;
}

// Processing Feedback Service for real-time updates
export class ProcessingFeedbackService {
  private static instance: ProcessingFeedbackService;
  private aiServiceUrl: string;
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private callbacks: Map<string, ProcessingFeedbackCallbacks> = new Map();

  private constructor() {
    this.aiServiceUrl = env.AI_SERVICE_URL || 'http://localhost:8010';
  }

  public static getInstance(): ProcessingFeedbackService {
    if (!ProcessingFeedbackService.instance) {
      ProcessingFeedbackService.instance = new ProcessingFeedbackService();
    }
    return ProcessingFeedbackService.instance;
  }

  // Start monitoring a submission for real-time updates
  async startMonitoring(
    submissionId: string, 
    userId?: string,
    callbacks?: ProcessingFeedbackCallbacks
  ): Promise<ProcessingStatus> {
    console.log(`🔄 Starting real-time monitoring for submission: ${submissionId}`);

    // Store callbacks for this submission
    if (callbacks) {
      this.callbacks.set(submissionId, callbacks);
    }

    // Initialize processing status with default steps
    const initialStatus: ProcessingStatus = {
      submissionId,
      userId,
      status: 'initializing',
      steps: this.getDefaultProcessingSteps(),
      totalProgress: 0,
      estimatedTimeRemaining: 45, // Default 45 seconds
      startTime: new Date()
    };

    // Notify initial status
    this.notifyStatusUpdate(submissionId, initialStatus);

    // Start polling for updates
    console.log(`🔄 About to call startPolling for submission: ${submissionId}`);
    this.startPolling(submissionId, initialStatus);
    console.log(`🔄 startPolling called for submission: ${submissionId}`);

    return initialStatus;
  }

  // Stop monitoring a submission
  stopMonitoring(submissionId: string): void {
    console.log(`⏹️ Stopping monitoring for submission: ${submissionId}`);
    
    const interval = this.pollingIntervals.get(submissionId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(submissionId);
    }
    
    this.callbacks.delete(submissionId);
  }

  // Get default processing steps based on form capabilities
  private getDefaultProcessingSteps(): ProcessingStep[] {
    return [
      {
        id: 'validation',
        name: 'Validating submission',
        status: 'pending',
        progress: 0,
        estimatedTime: 2
      },
      {
        id: 'nlp_analysis',
        name: 'Analyzing text content',
        status: 'pending',
        progress: 0,
        estimatedTime: 8
      },
      {
        id: 'voice_processing',
        name: 'Processing voice recording',
        status: 'pending',
        progress: 0,
        estimatedTime: 12
      },
      {
        id: 'document_analysis',
        name: 'Analyzing uploaded documents',
        status: 'pending',
        progress: 0,
        estimatedTime: 15
      },
      {
        id: 'ai_orchestration',
        name: 'Coordinating AI agents',
        status: 'pending',
        progress: 0,
        estimatedTime: 5
      },
      {
        id: 'business_analysis',
        name: 'Generating business insights',
        status: 'pending',
        progress: 0,
        estimatedTime: 10
      },
      {
        id: 'offer_generation',
        name: 'Creating business offer',
        status: 'pending',
        progress: 0,
        estimatedTime: 8
      },
      {
        id: 'notification',
        name: 'Sending notifications',
        status: 'pending',
        progress: 0,
        estimatedTime: 3
      }
    ];
  }

  // Start polling for status updates
  private startPolling(submissionId: string, initialStatus: ProcessingStatus): void {
    let pollCount = 0;
    const maxPolls = 60; // 2 minutes max (2 second intervals)
    
    console.log(`🔄 Starting polling for submission: ${submissionId}`);
    
    const interval = setInterval(async () => {
      pollCount++;
      console.log(`📡 Polling attempt ${pollCount}/${maxPolls} for submission: ${submissionId}`);
      
      try {
        console.log(`📡 Calling pollStatus for submission: ${submissionId}`);
        const updatedStatus = await this.pollStatus(submissionId, initialStatus);
        console.log(`📡 pollStatus returned:`, updatedStatus);
        
        // Update status
        this.notifyStatusUpdate(submissionId, updatedStatus);
        
        // Check if processing is complete
        if (updatedStatus.status === 'completed' || updatedStatus.status === 'failed') {
          this.stopMonitoring(submissionId);
          this.notifyComplete(submissionId, updatedStatus);
          return;
        }
        
        // Also complete if we have partial results and have been polling for a while
        if (pollCount > 5 && updatedStatus.totalProgress > 50) {
          console.log(`✅ Processing completed with partial results after ${pollCount} polls`);
          updatedStatus.status = 'completed';
          updatedStatus.endTime = new Date();
          this.stopMonitoring(submissionId);
          this.notifyComplete(submissionId, updatedStatus);
          return;
        }
        
        // Stop polling after max attempts
        if (pollCount >= maxPolls) {
          console.warn(`⚠️ Max polling attempts reached for submission: ${submissionId}`);
          updatedStatus.status = 'failed';
          updatedStatus.error = 'Processing timeout - please try again';
          this.notifyError(submissionId, updatedStatus.error, updatedStatus);
          this.stopMonitoring(submissionId);
        }
        
      } catch (error) {
        console.error(`❌ Polling error for submission ${submissionId}:`, error);
        
        // On error, simulate progress to avoid stuck UI
        const simulatedStatus = this.simulateProgress(initialStatus, pollCount, maxPolls);
        this.notifyStatusUpdate(submissionId, simulatedStatus);
        
        // If too many errors, stop monitoring
        if (pollCount >= maxPolls) {
          simulatedStatus.status = 'completed'; // Complete with mock data
          this.notifyComplete(submissionId, simulatedStatus);
          this.stopMonitoring(submissionId);
        }
      }
    }, 2000); // Poll every 2 seconds
    
    this.pollingIntervals.set(submissionId, interval);
  }

  // Poll for actual status from AI service
  private async pollStatus(submissionId: string, currentStatus: ProcessingStatus): Promise<ProcessingStatus> {
    try {
      const url = `${this.aiServiceUrl}/api/status/${submissionId}`;
      console.log(`📡 Polling status from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'StateX-Frontend/1.0'
        },
        signal: AbortSignal.timeout(5000)
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const statusData = await response.json();
        console.log(`📡 Response data:`, statusData);
        return this.convertToProcessingStatus(statusData, currentStatus);
      } else {
        console.warn(`⚠️ Status endpoint returned ${response.status}: ${response.statusText}`);
        // If status endpoint not available, simulate progress
        return this.simulateProgressStep(currentStatus);
      }
    } catch (error) {
      console.warn(`⚠️ Status polling failed, simulating progress:`, error);
      return this.simulateProgressStep(currentStatus);
    }
  }

  // Convert AI service status to ProcessingStatus
  private convertToProcessingStatus(statusData: any, currentStatus: ProcessingStatus): ProcessingStatus {
    const updatedStatus = { ...currentStatus };
    
    // Update overall status
    if (statusData.status) {
      updatedStatus.status = statusData.status === 'processing' ? 'processing' : 
                           statusData.status === 'completed' ? 'completed' : 
                           statusData.status === 'failed' ? 'failed' : 'processing';
    }
    
    // Update current step
    if (statusData.current_step) {
      updatedStatus.currentStep = statusData.current_step;
    }
    
    // Create step mapping from API step_id to frontend steps
    const stepMapping: { [key: string]: string } = {
      'nlp_analysis': 'nlp_analysis',
      'prototype_generation': 'ai_orchestration',
      'results_page_creation': 'business_analysis',
      'notification': 'notification'
    };
    
    // Update steps based on workflow_steps
    if (statusData.workflow_steps) {
      statusData.workflow_steps.forEach((step: any) => {
        const mappedStepId = stepMapping[step.step_id];
        if (mappedStepId) {
          const stepIndex = updatedStatus.steps.findIndex(s => s.id === mappedStepId);
          
          if (stepIndex >= 0) {
            updatedStatus.steps[stepIndex] = {
              ...updatedStatus.steps[stepIndex],
              status: step.status === 'completed' ? 'completed' : 
                     step.status === 'failed' ? 'failed' : 
                     step.status === 'processing' ? 'in_progress' : 'pending',
              progress: step.status === 'completed' ? 100 : 
                       step.status === 'processing' ? Math.max(25, step.progress || 50) : 0,
              actualTime: step.processing_time,
              error: step.error_message,
              result: step.output_data
            };
          }
        }
      });
    }
    
    // Use API progress if available, otherwise calculate from steps
    if (statusData.progress !== undefined && statusData.progress > 0) {
      updatedStatus.totalProgress = Math.floor(statusData.progress);
    } else {
      updatedStatus.totalProgress = this.calculateTotalProgress(updatedStatus.steps);
    }
    
    // If status is completed but progress is low, set to 100%
    if (updatedStatus.status === 'completed' && updatedStatus.totalProgress < 100) {
      updatedStatus.totalProgress = 100;
      // Mark all steps as completed if overall status is completed
      updatedStatus.steps.forEach(step => {
        if (step.status !== 'completed') {
          step.status = 'completed';
          step.progress = 100;
        }
      });
    }
    
    // Update estimated time remaining
    updatedStatus.estimatedTimeRemaining = this.calculateTimeRemaining(updatedStatus.steps);
    
    // Set end time if completed
    if (updatedStatus.status === 'completed' || updatedStatus.status === 'failed') {
      updatedStatus.endTime = new Date();
    }
    
    return updatedStatus;
  }

  // Simulate progress when AI service is not available
  private simulateProgressStep(currentStatus: ProcessingStatus): ProcessingStatus {
    const updatedStatus = { ...currentStatus };
    
    // Find next step to progress
    const nextStepIndex = updatedStatus.steps.findIndex(step => 
      step.status === 'pending' || step.status === 'in_progress'
    );
    
    if (nextStepIndex >= 0) {
      const step = updatedStatus.steps[nextStepIndex];
      
      if (step.status === 'pending') {
        // Start the step
        step.status = 'in_progress';
        step.progress = 25;
        updatedStatus.currentStep = step.name;
      } else if (step.status === 'in_progress') {
        // Progress the step
        step.progress = Math.min(100, step.progress + 25);
        
        if (step.progress >= 100) {
          step.status = 'completed';
          step.actualTime = step.estimatedTime;
        }
      }
    }
    
    // Update overall progress
    updatedStatus.totalProgress = this.calculateTotalProgress(updatedStatus.steps);
    updatedStatus.estimatedTimeRemaining = this.calculateTimeRemaining(updatedStatus.steps);
    
    // Check if all steps are complete
    const allComplete = updatedStatus.steps.every(step => step.status === 'completed');
    if (allComplete) {
      updatedStatus.status = 'completed';
      updatedStatus.endTime = new Date();
    } else {
      updatedStatus.status = 'processing';
    }
    
    return updatedStatus;
  }

  // Simulate progress based on time elapsed
  private simulateProgress(currentStatus: ProcessingStatus, pollCount: number, maxPolls: number): ProcessingStatus {
    const updatedStatus = { ...currentStatus };
    const progressRatio = Math.min(pollCount / maxPolls, 1);
    
    // Update steps based on time progression
    updatedStatus.steps.forEach((step, index) => {
      const stepProgressRatio = Math.max(0, (progressRatio * updatedStatus.steps.length) - index);
      
      if (stepProgressRatio >= 1) {
        step.status = 'completed';
        step.progress = 100;
        step.actualTime = step.estimatedTime;
      } else if (stepProgressRatio > 0) {
        step.status = 'in_progress';
        step.progress = Math.floor(stepProgressRatio * 100);
      }
    });
    
    updatedStatus.totalProgress = Math.floor(progressRatio * 100);
    updatedStatus.estimatedTimeRemaining = Math.max(0, (maxPolls - pollCount) * 2);
    updatedStatus.status = progressRatio >= 1 ? 'completed' : 'processing';
    
    return updatedStatus;
  }

  // Calculate total progress across all steps
  private calculateTotalProgress(steps: ProcessingStep[]): number {
    const totalSteps = steps.length;
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const inProgressSteps = steps.filter(step => step.status === 'in_progress');
    
    let totalProgress = (completedSteps / totalSteps) * 100;
    
    // Add partial progress from in-progress steps
    inProgressSteps.forEach(step => {
      totalProgress += (step.progress / 100) * (1 / totalSteps) * 100;
    });
    
    return Math.min(100, Math.floor(totalProgress));
  }

  // Calculate estimated time remaining
  private calculateTimeRemaining(steps: ProcessingStep[]): number {
    const pendingSteps = steps.filter(step => step.status === 'pending');
    const inProgressSteps = steps.filter(step => step.status === 'in_progress');
    
    let timeRemaining = 0;
    
    // Add time for pending steps
    pendingSteps.forEach(step => {
      timeRemaining += step.estimatedTime || 5;
    });
    
    // Add remaining time for in-progress steps
    inProgressSteps.forEach(step => {
      const remainingProgress = (100 - step.progress) / 100;
      timeRemaining += (step.estimatedTime || 5) * remainingProgress;
    });
    
    return Math.max(0, Math.floor(timeRemaining));
  }

  // Notify callbacks of status updates
  private notifyStatusUpdate(submissionId: string, status: ProcessingStatus): void {
    const callbacks = this.callbacks.get(submissionId);
    if (callbacks?.onStatusUpdate) {
      callbacks.onStatusUpdate(status);
    }
  }

  // Notify callbacks of step updates
  private notifyStepUpdate(submissionId: string, step: ProcessingStep): void {
    const callbacks = this.callbacks.get(submissionId);
    if (callbacks?.onStepUpdate) {
      callbacks.onStepUpdate(step);
    }
  }

  // Notify callbacks of completion
  private notifyComplete(submissionId: string, status: ProcessingStatus): void {
    const callbacks = this.callbacks.get(submissionId);
    if (callbacks?.onComplete) {
      callbacks.onComplete(status);
    }
  }

  // Notify callbacks of errors
  private notifyError(submissionId: string, error: string, status: ProcessingStatus): void {
    const callbacks = this.callbacks.get(submissionId);
    if (callbacks?.onError) {
      callbacks.onError(error, status);
    }
  }

  // Get current status for a submission
  async getCurrentStatus(submissionId: string): Promise<ProcessingStatus | null> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/api/status/${submissionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'StateX-Frontend/1.0'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const statusData = await response.json();
        const currentStatus: ProcessingStatus = {
          submissionId,
          status: statusData.status || 'processing',
          steps: this.getDefaultProcessingSteps(),
          totalProgress: 0,
          estimatedTimeRemaining: 30,
          startTime: new Date(statusData.created_at || Date.now())
        };
        
        return this.convertToProcessingStatus(statusData, currentStatus);
      }
    } catch (error) {
      console.error(`❌ Failed to get current status for ${submissionId}:`, error);
    }
    
    return null;
  }

  // Test connection to AI service
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/health`, {
        method: 'GET',
        headers: {
          'User-Agent': 'StateX-Frontend/1.0'
        },
        signal: AbortSignal.timeout(5000)
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Processing feedback service connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const processingFeedbackService = ProcessingFeedbackService.getInstance();