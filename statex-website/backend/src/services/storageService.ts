import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Configuration
const STORAGE_CONFIG = {
  basePath: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB default
  allowedFileTypes: ['image/*', 'text/*', 'audio/*', 'video/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Interfaces
interface UserSession {
  userId: string;
  sessionId: string;
  timestamp: Date;
  formType: 'prototype' | 'contact';
  files: StoredFile[];
  voiceRecording?: StoredFile;
  formData: FormData;
}

interface StoredFile {
  originalName: string;
  storedName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadTime: Date;
}

interface FormData {
  description: string;
  name?: string;
  contactType?: string;
  contactValue?: string;
  hasRecording: boolean;
  recordingTime: number;
  formType: 'prototype' | 'contact';
}

class StorageService {
  private static instance: StorageService;
  private basePath: string;

  private constructor() {
    this.basePath = STORAGE_CONFIG.basePath;
    this.ensureStorageStructure();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Ensure base storage directory exists
  private async ensureStorageStructure(): Promise<void> {
    try {
      await fs.mkdir(this.basePath, { recursive: true });
      console.log(`Storage directory ensured: ${this.basePath}`);
    } catch (error) {
      console.error('Failed to create storage directory:', error);
    }
  }

  // Generate user ID based on IP and user agent
  public generateUserId(ip: string, userAgent: string): string {
    const hash = crypto.createHash('md5').update(`${ip}-${userAgent}`).digest('hex');
    return `user_${hash.substring(0, 8)}`;
  }

  // Generate session ID
  private generateSessionId(): string {
    return `session_${uuidv4().substring(0, 8)}`;
  }

  // Get user path
  private getUserPath(userId: string): string {
    return path.join(this.basePath, 'users', userId);
  }

  // Get session path
  private getSessionPath(userId: string, sessionId: string): string {
    return path.join(this.getUserPath(userId), 'sessions', sessionId);
  }

  // Create storage directories for user and session
  private async createStorageDirectories(userId: string, sessionId: string): Promise<void> {
    const userPath = this.getUserPath(userId);
    const sessionPath = this.getSessionPath(userId, sessionId);
    
    await fs.mkdir(userPath, { recursive: true });
    await fs.mkdir(path.join(userPath, 'sessions'), { recursive: true });
    await fs.mkdir(sessionPath, { recursive: true });
    await fs.mkdir(path.join(sessionPath, 'files'), { recursive: true });
    await fs.mkdir(path.join(sessionPath, 'voice'), { recursive: true });
  }

  // Store a file (attachment or voice recording)
  async storeFile(file: any, userId: string, sessionId: string, fileType: 'attachment' | 'voice'): Promise<StoredFile> {
    try {
      // Ensure directories exist
      await this.createStorageDirectories(userId, sessionId);
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomId = uuidv4().substring(0, 8);
      const extension = path.extname(file.filename || 'file');
      const storedName = `${timestamp}_${randomId}${extension}`;
      
      // Determine storage path
      const storageDir = fileType === 'voice' ? 'voice' : 'files';
      const filePath = path.join(this.getSessionPath(userId, sessionId), storageDir, storedName);
      
      // Get file content and size
      const buffer = await file.toBuffer();
      const fileSize = buffer.length;
      
      // Write file to disk
      await fs.writeFile(filePath, buffer);
      
      const storedFile: StoredFile = {
        originalName: file.filename || 'unknown',
        storedName,
        filePath,
        fileSize,
        mimeType: file.mimetype || 'application/octet-stream',
        uploadTime: new Date()
      };
      
      console.log(`File stored: ${storedFile.originalName} -> ${filePath}`);
      return storedFile;
    } catch (error) {
      console.error('Failed to store file:', error);
      throw error;
    }
  }

  // Store form data as markdown
  private async storeFormData(formData: FormData, userId: string, sessionId: string): Promise<void> {
    const sessionPath = this.getSessionPath(userId, sessionId);
    const formDataPath = path.join(sessionPath, 'form_data.md');
    
    const markdown = this.formatFormDataAsMarkdown(formData);
    await fs.writeFile(formDataPath, markdown, 'utf-8');
  }

  // Format form data as markdown
  private formatFormDataAsMarkdown(formData: FormData): string {
    const timestamp = new Date().toISOString();
    
    return `# Form Submission Data

**Timestamp:** ${timestamp}
**Form Type:** ${formData.formType}

## Contact Information
- **Name:** ${formData.name || 'Not provided'}
- **Contact Type:** ${formData.contactType || 'email'}
- **Contact Value:** ${formData.contactValue || 'Not provided'}

## Project Description
${formData.description}

## Voice Recording
- **Has Recording:** ${formData.hasRecording ? 'Yes' : 'No'}
- **Recording Duration:** ${formData.recordingTime} seconds

---
*Generated automatically by Statex Storage Service*`;
  }

  // Create user session from already uploaded file metadata
  async createUserSessionFromMetadata(
    formData: FormData,
    uploadedFiles: any[],
    voiceRecording?: any,
    ip?: string,
    userAgent?: string
  ): Promise<UserSession> {
    const userId = this.generateUserId(ip || 'unknown', userAgent || 'unknown');
    const sessionId = this.generateSessionId();
    
    // Create storage directories
    await this.createStorageDirectories(userId, sessionId);
    
    // Store form data
    await this.storeFormData(formData, userId, sessionId);
    
    // Move uploaded files from temp session to final session
    const storedFiles: StoredFile[] = [];
    for (const file of uploadedFiles) {
      // Extract the actual user ID and temp session from the tempSessionId
      const tempSessionParts = file.tempSessionId.split('_');
      const actualUserId = tempSessionParts.slice(1).join('_'); // Remove 'temp_' prefix
      const tempSessionId = file.tempSessionId;
      
      const tempFilePath = path.join(this.getSessionPath(actualUserId, tempSessionId), 'files', file.fileId);
      const finalFilePath = path.join(this.getSessionPath(userId, sessionId), 'files', file.fileId);
      
      try {
        // Move file from temp to final session
        await fs.rename(tempFilePath, finalFilePath);
        
        storedFiles.push({
          originalName: file.originalName || file.name,
          storedName: file.fileId,
          filePath: finalFilePath,
          fileSize: file.fileSize || file.size,
          mimeType: file.type || file.mimeType || 'application/octet-stream',
          uploadTime: new Date()
        });
      } catch (error) {
        console.error(`Failed to move file ${file.fileId}:`, error);
      }
    }
    
    // Move voice recording if provided
    let storedVoiceRecording: StoredFile | undefined;
    if (voiceRecording) {
      // Extract the actual user ID and temp session from the tempSessionId
      const tempSessionParts = voiceRecording.tempSessionId.split('_');
      const actualUserId = tempSessionParts.slice(1).join('_'); // Remove 'temp_' prefix
      const tempSessionId = voiceRecording.tempSessionId;
      
      const tempFilePath = path.join(this.getSessionPath(actualUserId, tempSessionId), 'voice', voiceRecording.fileId);
      const finalFilePath = path.join(this.getSessionPath(userId, sessionId), 'voice', voiceRecording.fileId);
      
      try {
        // Move voice recording from temp to final session
        await fs.rename(tempFilePath, finalFilePath);
        
        storedVoiceRecording = {
          originalName: voiceRecording.originalName || 'voice_recording',
          storedName: voiceRecording.fileId,
          filePath: finalFilePath,
          fileSize: voiceRecording.fileSize || voiceRecording.size,
          mimeType: voiceRecording.type || voiceRecording.mimeType || 'audio/webm',
          uploadTime: new Date()
        };
      } catch (error) {
        console.error(`Failed to move voice recording ${voiceRecording.fileId}:`, error);
      }
    }
    
    const userSession: UserSession = {
      userId,
      sessionId,
      timestamp: new Date(),
      formType: formData.formType || 'prototype',
      files: storedFiles,
      voiceRecording: storedVoiceRecording,
      formData
    };
    
    // Store session metadata
    await this.storeSessionMetadata(userSession);
    
    console.log(`User session created from metadata: ${userId}/${sessionId}`);
    return userSession;
  }

  // Clean up temp sessions after successful file movement
  async cleanupTempSessionsAfterMove(uploadedFiles: any[], voiceRecording?: any): Promise<void> {
    try {
      // Clean up temp sessions from the actual user who uploaded files
      for (const file of uploadedFiles) {
        const tempSessionParts = file.tempSessionId.split('_');
        const actualUserId = tempSessionParts.slice(1).join('_');
        await this.cleanupTempSessions(actualUserId);
      }
      if (voiceRecording) {
        const tempSessionParts = voiceRecording.tempSessionId.split('_');
        const actualUserId = tempSessionParts.slice(1).join('_');
        await this.cleanupTempSessions(actualUserId);
      }
    } catch (error) {
      console.error('Failed to cleanup temp sessions after move:', error);
    }
  }

  // Clean up temporary sessions for a user
  private async cleanupTempSessions(userId: string): Promise<void> {
    try {
      const userPath = this.getUserPath(userId);
      const sessionsPath = path.join(userPath, 'sessions');
      const sessionDirs = await fs.readdir(sessionsPath);
      
      for (const sessionDir of sessionDirs) {
        if (sessionDir.startsWith('temp_')) {
          const tempSessionPath = path.join(sessionsPath, sessionDir);
          await fs.rm(tempSessionPath, { recursive: true, force: true });
          console.log(`Cleaned up temp session: ${tempSessionPath}`);
        }
      }
    } catch (error) {
      console.error(`Failed to cleanup temp sessions for user ${userId}:`, error);
    }
  }

  // Store session metadata
  private async storeSessionMetadata(session: UserSession): Promise<void> {
    const sessionPath = this.getSessionPath(session.userId, session.sessionId);
    const metadataPath = path.join(sessionPath, 'session_metadata.json');
    
    const metadata = {
      userId: session.userId,
      sessionId: session.sessionId,
      timestamp: session.timestamp.toISOString(),
      formType: session.formType,
      fileCount: session.files.length,
      hasVoiceRecording: !!session.voiceRecording,
      recordingDuration: session.formData.recordingTime
    };
    
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
  }

  // Get user sessions
  async getUserSessions(userId: string): Promise<UserSession[]> {
    const userPath = this.getUserPath(userId);
    const sessionsPath = path.join(userPath, 'sessions');
    
    try {
      const sessionDirs = await fs.readdir(sessionsPath);
      const sessions: UserSession[] = [];
      
      for (const sessionDir of sessionDirs) {
        if (!sessionDir.startsWith('temp_')) {
          const metadataPath = path.join(sessionsPath, sessionDir, 'session_metadata.json');
          try {
            const metadataContent = await fs.readFile(metadataPath, 'utf-8');
            const metadata = JSON.parse(metadataContent);
            sessions.push(metadata as UserSession);
          } catch (error) {
            console.warn(`Failed to read session metadata for ${sessionDir}:`, error);
          }
        }
      }
      
      return sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error(`Failed to get user sessions for ${userId}:`, error);
      return [];
    }
  }

  // Clean up old sessions (for maintenance)
  async cleanupOldSessions(maxAgeDays: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);
    
    let cleanedCount = 0;
    
    try {
      const usersPath = path.join(this.basePath, 'users');
      const userDirs = await fs.readdir(usersPath);
      
      for (const userDir of userDirs) {
        const userPath = path.join(usersPath, userDir);
        const sessionsPath = path.join(userPath, 'sessions');
        const sessionDirs = await fs.readdir(sessionsPath);
        
        for (const sessionDir of sessionDirs) {
          if (!sessionDir.startsWith('temp_')) {
            const metadataPath = path.join(sessionsPath, sessionDir, 'session_metadata.json');
            try {
              const metadataContent = await fs.readFile(metadataPath, 'utf-8');
              const metadata = JSON.parse(metadataContent);
              const sessionDate = new Date(metadata.timestamp);
              
              if (sessionDate < cutoffDate) {
                const sessionPath = path.join(sessionsPath, sessionDir);
                await fs.rm(sessionPath, { recursive: true, force: true });
                cleanedCount++;
                console.log(`Cleaned up old session: ${sessionPath}`);
              }
            } catch (error) {
              console.warn(`Failed to process session ${sessionDir}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old sessions:', error);
    }
    
    return cleanedCount;
  }
}

export default StorageService;
