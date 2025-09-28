import { env } from '@/config/env';

const API_BASE_URL = env.API_URL;

export interface FormSubmissionData {
  name?: string;
  contactType: string;
  contactValue: string;
  description: string;
  hasRecording: boolean;
  recordingTime: number;
  files: any[];
  voiceRecording?: any;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  messageId?: string;
  error?: string;
  details?: string;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Test email service connection
export async function testEmailService(): Promise<ApiResponse> {
  return apiRequest<ApiResponse>('/forms/test-email');
}

// Submit prototype form
export async function submitPrototypeForm(data: FormSubmissionData): Promise<ApiResponse> {
  // Use multipart/form-data for mixed content (text + files)
  const formData = new FormData();
  formData.append('user_email', data.contactValue || '');
  formData.append('user_name', data.name || '');
  formData.append('request_type', 'prototype');
  formData.append('description', data.description);
  formData.append('priority', 'normal');

  // Add voice recording if present
  if (data.voiceRecording && data.voiceRecording.file) {
    formData.append('voice_file', data.voiceRecording.file);
  }

  // Add file attachments
  if (data.files && data.files.length > 0) {
    data.files.forEach((file, index) => {
      if (file.file) {
        formData.append('files', file.file);
      }
    });
  }

  const response = await fetch(`${API_BASE_URL}/submissions/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Submit contact form
export async function submitContactForm(data: FormSubmissionData): Promise<ApiResponse> {
  // Use multipart/form-data for mixed content (text + files)
  const formData = new FormData();
  formData.append('user_email', data.contactValue || '');
  formData.append('user_name', data.name || '');
  formData.append('request_type', 'contact');
  formData.append('description', data.description);
  formData.append('priority', 'normal');

  // Add voice recording if present
  if (data.voiceRecording && data.voiceRecording.file) {
    formData.append('voice_file', data.voiceRecording.file);
  }

  // Add file attachments
  if (data.files && data.files.length > 0) {
    data.files.forEach((file, index) => {
      if (file.file) {
        formData.append('files', file.file);
      }
    });
  }

  const response = await fetch(`${API_BASE_URL}/submissions/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Utility function to prepare form data for submission
export function prepareFormData(formData: {
  description: string;
  name?: string;
  contactType?: string;
  contactValue?: string;
  hasRecording: boolean;
  recordingTime: number;
  files: any[];
  voiceRecording?: any;
}): FormSubmissionData {
  return {
    name: formData.name || '',
    contactType: formData.contactType || 'email',
    contactValue: formData.contactValue || '',
    description: formData.description,
    hasRecording: formData.hasRecording,
    recordingTime: formData.recordingTime,
    files: formData.files.map(file => ({
      fileId: file.fileId,
      originalName: file.originalName,
      fileSize: file.fileSize,
      type: file.type,
      tempSessionId: file.tempSessionId
    })),
    voiceRecording: formData.voiceRecording ? {
      fileId: formData.voiceRecording.fileId,
      originalName: formData.voiceRecording.originalName,
      fileSize: formData.voiceRecording.fileSize,
      recordingTime: formData.voiceRecording.recordingTime,
      tempSessionId: formData.voiceRecording.tempSessionId
    } : undefined
  };
}
