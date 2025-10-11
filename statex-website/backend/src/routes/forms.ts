import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { platformClient } from '../services/platformClient';
import StorageService from '../services/storageService';

// Request body schemas for validation
const prototypeSchema = {
  type: 'object',
  required: ['description', 'contactValue'],
  properties: {
    name: { type: 'string' },
    contactType: { type: 'string', default: 'email' },
    description: { type: 'string' },
    contactValue: { type: 'string' },
    hasRecording: { type: 'boolean', default: false },
    recordingTime: { type: 'number', default: 0 },
    files: { type: 'array', default: [] },
    voiceRecording: { 
      oneOf: [
        { type: 'object' },
        { type: 'null' }
      ]
    }
  }
};

const contactSchema = {
  type: 'object',
  required: ['description', 'contactValue'],
  properties: {
    name: { type: 'string' },
    contactType: { type: 'string', default: 'email' },
    description: { type: 'string' },
    contactValue: { type: 'string' },
    hasRecording: { type: 'boolean', default: false },
    recordingTime: { type: 'number', default: 0 },
    files: { type: 'array', default: [] },
    voiceRecording: { 
      oneOf: [
        { type: 'object' },
        { type: 'null' }
      ]
    }
  }
};

// Register form routes with Fastify
export async function registerFormRoutes(fastify: FastifyInstance) {
  const storageService = StorageService.getInstance();

  // Test notification service connection
  fastify.get('/api/forms/test-notification', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = { success: true, message: 'Platform client connected' };
      return reply.send(result);
    } catch (error) {
      console.error('Notification service test failed:', error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Notification service test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get notification service status and configuration
  fastify.get('/api/forms/notification-status', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const status = { status: 'healthy', service: 'platform-client' };
      return reply.send({
        success: true,
        ...status
      });
    } catch (error) {
      console.error('Failed to get notification service status:', error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Failed to get notification service status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Handle prototype form submission with file uploads
  fastify.post('/api/forms/prototype', {
    schema: {
      body: prototypeSchema
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const {
        name,
        contactType,
        contactValue,
        description,
        hasRecording = false,
        recordingTime = 0,
        files = []
      } = body;

      // Get client IP and user agent for user identification
      const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
      const userAgent = request.headers['user-agent'] || 'unknown';

      // Create form data object
      const formData = {
        description,
        name,
        contactType: contactType || 'email',
        contactValue,
        hasRecording,
        recordingTime,
        formType: 'prototype' as const
      };

      // Store all data in the storage service
      // Note: files are already uploaded and stored, so we just pass the metadata
      const userSession = await storageService.createUserSessionFromMetadata(
        formData,
        files,
        body.voiceRecording, // Pass voice recording metadata
        ip as string,
        userAgent as string
      );

      // Send notification with file information (improved error handling)
      const notificationResult = await platformClient.sendPrototypeRequest({
        name,
        contactType: contactType || 'email',
        contactValue,
        description,
        hasRecording,
        recordingTime,
        files: userSession.files.map(file => ({
          name: file.originalName,
          size: file.fileSize,
          type: file.mimeType
        }))
      });

      // Log notification result
      if (notificationResult.success) {
        console.log('✅ Notification sent successfully:', notificationResult.notificationId);
      } else {
        console.warn('⚠️ Notification sending failed but form submission continues:', notificationResult.error);
      }

      // Clean up temp sessions after successful form submission
      await storageService.cleanupTempSessionsAfterMove(files, body.voiceRecording);

      return reply.send({
        success: true,
        message: 'Prototype request submitted successfully',
        notificationId: notificationResult.notificationId,
        notificationSent: notificationResult.success,
        notificationError: notificationResult.success ? null : notificationResult.error,
        sessionId: userSession.sessionId,
        userId: userSession.userId,
        storedFiles: userSession.files.length,
        hasVoiceRecording: !!userSession.voiceRecording
      });
    } catch (error) {
      console.error('Prototype form submission failed:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to submit prototype request',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Handle contact form submission with file uploads
  fastify.post('/api/forms/contact', {
    schema: {
      body: contactSchema
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const {
        name,
        contactType,
        contactValue,
        description,
        hasRecording = false,
        recordingTime = 0,
        files = []
      } = body;

      // Get client IP and user agent for user identification
      const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
      const userAgent = request.headers['user-agent'] || 'unknown';

      // Create form data object
      const formData = {
        description,
        name,
        contactType: contactType || 'email',
        contactValue,
        hasRecording,
        recordingTime,
        formType: 'contact' as const
      };

      // Store all data in the storage service
      // Note: files are already uploaded and stored, so we just pass the metadata
      const userSession = await storageService.createUserSessionFromMetadata(
        formData,
        files,
        body.voiceRecording, // Pass voice recording metadata
        ip as string,
        userAgent as string
      );

      // Send immediate notification with file information
      const result = await platformClient.sendNotification({
        user_id: userSession.userId,
        type: 'contact_form',
        title: 'New Contact Form Submission - StateX',
        message: `New contact form submission:\n\nName: ${name || 'Not provided'}\nContact: ${contactValue} (${contactType || 'email'})\nDescription: ${description}\nFiles: ${userSession.files.length} files attached`,
        contact_type: contactType || 'email',
        contact_value: contactValue,
        user_name: name || 'User'
      });

      // Clean up temp sessions after successful form submission
      await storageService.cleanupTempSessionsAfterMove(files, body.voiceRecording);

      return reply.send({
        success: true,
        message: 'Contact form submitted successfully',
        notificationId: result.notificationId,
        sessionId: userSession.sessionId,
        userId: userSession.userId,
        storedFiles: userSession.files.length,
        hasVoiceRecording: !!userSession.voiceRecording
      });
    } catch (error) {
      console.error('Contact form submission failed:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to submit contact form',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Handle file uploads (for the prototype form)
  fastify.post('/api/forms/upload-files', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Get client IP and user agent
      const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
      const userAgent = request.headers['user-agent'] || 'unknown';
      
      // Generate user ID and use a single temp session
      const userId = storageService.generateUserId(ip as string, userAgent as string);
      const sessionId = `temp_${userId}`;
      
      // Store the uploaded file
      const storedFile = await storageService.storeFile(
        data,
        userId,
        sessionId,
        'attachment'
      );

      return reply.send({
        success: true,
        message: 'File uploaded successfully',
        fileId: storedFile.storedName,
        originalName: storedFile.originalName,
        fileSize: storedFile.fileSize,
        tempSessionId: sessionId
      });
    } catch (error) {
      console.error('File upload failed:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Handle voice recording uploads
  fastify.post('/api/forms/upload-voice', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({
          success: false,
          error: 'No voice recording uploaded'
        });
      }

      // Get client IP and user agent
      const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
      const userAgent = request.headers['user-agent'] || 'unknown';
      
      // Generate user ID and use a single temp session
      const userId = storageService.generateUserId(ip as string, userAgent as string);
      const sessionId = `temp_${userId}`;
      
      // Store the voice recording
      const storedFile = await storageService.storeFile(
        data,
        userId,
        sessionId,
        'voice'
      );

      return reply.send({
        success: true,
        message: 'Voice recording uploaded successfully',
        fileId: storedFile.storedName,
        originalName: storedFile.originalName,
        fileSize: storedFile.fileSize,
        recordingTime: storedFile.fileSize, // Approximate recording time based on file size
        tempSessionId: sessionId
      });
    } catch (error) {
      console.error('Voice recording upload failed:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to upload voice recording',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get user sessions (for admin/debug purposes)
  fastify.get('/api/forms/user-sessions/:userId', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = request.params as { userId: string };
      const sessions = await storageService.getUserSessions(userId);
      
      return reply.send({
        success: true,
        userId,
        sessions,
        totalSessions: sessions.length
      });
    } catch (error) {
      console.error('Failed to get user sessions:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get user sessions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Cleanup old sessions (admin endpoint)
  fastify.post('/api/forms/cleanup-sessions', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { maxAgeDays = 30 } = request.body as { maxAgeDays?: number };
      const cleanedCount = await storageService.cleanupOldSessions(maxAgeDays);
      
      return reply.send({
        success: true,
        message: `Cleaned up ${cleanedCount} old sessions`,
        cleanedCount
      });
    } catch (error) {
      console.error('Failed to cleanup sessions:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to cleanup sessions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}
