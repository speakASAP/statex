import { env } from '@/config/env';

// File upload and voice recording service
const API_BASE_URL = env.API_URL;

export interface UploadedFile {
  fileId: string;
  originalName: string;
  fileSize: number;
  type: string;
  tempSessionId: string;
}

export interface VoiceRecording {
  fileId: string;
  originalName: string;
  fileSize: number;
  recordingTime: number;
  tempSessionId: string;
}

// File upload service
export class FileUploadService {
  private static instance: FileUploadService;

  private constructor() {}

  public static getInstance(): FileUploadService {
    if (!FileUploadService.instance) {
      FileUploadService.instance = new FileUploadService();
    }
    return FileUploadService.instance;
  }

  // Upload a single file
  async uploadFile(file: File): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/forms/upload-files`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed: ${response.status}`);
    }

    const result = await response.json();
    return {
      fileId: result.fileId,
      originalName: result.originalName,
      fileSize: result.fileSize,
      type: file.type,
      tempSessionId: result.tempSessionId
    };
  }

  // Upload multiple files
  async uploadFiles(files: File[]): Promise<UploadedFile[]> {
    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  // Upload voice recording
  async uploadVoiceRecording(audioBlob: Blob, fileName: string = 'voice_recording.wav'): Promise<VoiceRecording> {
    const formData = new FormData();
    formData.append('file', audioBlob, fileName);

    const response = await fetch(`${API_BASE_URL}/forms/upload-voice`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Voice upload failed: ${response.status}`);
    }

    const result = await response.json();
    return {
      fileId: result.fileId,
      originalName: result.originalName,
      fileSize: result.fileSize,
      recordingTime: result.recordingTime,
      tempSessionId: result.tempSessionId
    };
  }
}

// Voice recording service using Web Audio API
export class VoiceRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private recordingStartTime: number = 0;

  // Check if voice recording is supported
  isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  // Get user-friendly instructions for enabling microphone
  getPermissionInstructions(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      return `To enable microphone access in Safari:
1. Click the microphone icon in the address bar
2. Select "Allow" for this website
3. Refresh the page
4. Or go to Safari → Preferences → Websites → Microphone and allow localhost:3000`;
    } else if (userAgent.includes('chrome')) {
      return `To enable microphone access in Chrome:
1. Click the microphone icon in the address bar
2. Select "Allow" for this website
3. Refresh the page
4. Or go to Settings → Privacy and Security → Site Settings → Microphone`;
    } else if (userAgent.includes('firefox')) {
      return `To enable microphone access in Firefox:
1. Click the microphone icon in the address bar
2. Select "Allow" for this website
3. Refresh the page
4. Or go to about:preferences#privacy and manage permissions`;
    } else {
      return `To enable microphone access:
1. Look for a microphone icon in your browser's address bar
2. Click it and select "Allow" for this website
3. Refresh the page
4. Check your browser's privacy settings if the icon doesn't appear`;
    }
  }

  // Check microphone permissions
  async checkPermissions(): Promise<{ granted: boolean; error?: string }> {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return { granted: result.state === 'granted' };
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return { granted: true };
      } catch (err) {
        return { granted: false, error: err instanceof Error ? err.message : 'Unknown error' };
      }
    }
  }

  // Start recording with better permission handling
  async startRecording(): Promise<void> {
    if (this.isRecording) {
      throw new Error('Recording already in progress');
    }

    try {
      // Check permissions first
      const permissionCheck = await this.checkPermissions();
      if (!permissionCheck.granted) {
        throw new Error(`Microphone access denied. Please allow microphone access in your browser settings and refresh the page. Error: ${permissionCheck.error || 'Permission denied'}`);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: this.getSupportedMimeType()
      });

      this.audioChunks = [];
      this.recordingStartTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(1000); // Collect data every second
      this.isRecording = true;

      console.log('Voice recording started');
    } catch (error) {
      console.error('Failed to start voice recording:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Microphone access denied. Please click the microphone icon in your browser\'s address bar and allow access, then refresh the page.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotSupportedError') {
          throw new Error('Voice recording is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
        }
      }
      
      throw new Error(`Failed to start voice recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get supported MIME type for recording
  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    
    return 'audio/webm'; // Fallback
  }

  // Stop recording
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        
        // Stop all tracks to release microphone
        if (this.mediaRecorder?.stream) {
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }

        // Create audio blob
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  // Get recording duration
  getRecordingDuration(): number {
    if (!this.recordingStartTime) return 0;
    return Math.floor((Date.now() - this.recordingStartTime) / 1000);
  }

  // Check if currently recording
  getIsRecording(): boolean {
    return this.isRecording;
  }

  // Convert audio blob to WAV format (optional enhancement)
  async convertToWav(audioBlob: Blob): Promise<Blob> {
    // This is a simplified conversion - in production you might want to use a proper audio library
    // For now, we'll return the original blob
    return audioBlob;
  }
}

// Utility functions
export const fileUploadService = FileUploadService.getInstance();
export const voiceRecordingService = new VoiceRecordingService();

// File validation
export function validateFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'audio/mpeg',
    'audio/wav',
    'audio/x-m4a'
  ];

  if (file.size > maxSize) {
    return { isValid: false, error: `File size exceeds 50MB limit` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type ${file.type} is not supported` };
  }

  return { isValid: true };
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
