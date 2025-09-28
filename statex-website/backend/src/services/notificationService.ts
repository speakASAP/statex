import { FastifyInstance } from 'fastify';

// Interfaces for external notification service responses
interface NotificationServiceResponse {
  id?: string;
  status?: string;
  message?: string;
}

interface HealthCheckResponse {
  service?: string;
  version?: string;
  status?: string;
  message?: string;
}

// Notification service configuration with flexible environment support
const notificationConfig = {
  url: process.env.NOTIFICATION_SERVICE_URL || `http://localhost:${process.env.FRONTEND_PORT || '3000'}`,
  apiKey: process.env.NOTIFICATION_SERVICE_API_KEY || 'dev-notification-api-key',
  timeout: parseInt(process.env.NOTIFICATION_SERVICE_TIMEOUT || '10000'),
  retries: parseInt(process.env.NOTIFICATION_SERVICE_RETRIES || '3'),
  enabled: process.env.NOTIFICATION_SERVICE_ENABLED === 'true' || process.env.NOTIFICATION_SERVICE_ENABLED === '1',
  endpoints: {
    health: process.env.NOTIFICATION_SERVICE_HEALTH_ENDPOINT || '/api/health',
    notify: process.env.NOTIFICATION_SERVICE_NOTIFY_ENDPOINT || '/api/notifications',
    version: process.env.NOTIFICATION_SERVICE_VERSION_ENDPOINT || '/api/version'
  }
};

// Notification service class
export class NotificationService {
  private static instance: NotificationService;
  private fastify: FastifyInstance | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public setFastifyInstance(fastify: FastifyInstance): void {
    this.fastify = fastify;
  }

  // Send notification to external notification service
  async sendNotification(data: {
    type: 'form_submission' | 'prototype_request' | 'contact_form';
    recipient: {
      email?: string;
      phone?: string;
      name?: string;
    };
    content: {
      subject: string;
      message: string;
      metadata?: any;
    };
    attachments?: Array<{
      name: string;
      size: number;
      type: string;
      url?: string;
    }>;
  }) {
    // Check if notification service is enabled
    if (!notificationConfig.enabled) {
      console.log('📧 Notification service is disabled, skipping notification');
      return { 
        success: true, 
        notificationId: 'disabled',
        status: 'disabled',
        message: 'Notification service is disabled'
      };
    }

    try {
      const payload = {
        type: data.type,
        recipient: data.recipient,
        content: data.content,
        attachments: data.attachments || [],
        timestamp: new Date().toISOString(),
        source: 'statex-backend'
      };

      const response = await fetch(`${notificationConfig.url}${notificationConfig.endpoints.notify}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${notificationConfig.apiKey}`,
          'User-Agent': 'StateX-Backend/1.0'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(notificationConfig.timeout)
      });

      if (!response.ok) {
        throw new Error(`Notification service responded with status: ${response.status}`);
      }

      const result = await response.json() as NotificationServiceResponse;
      console.log('✅ Notification sent successfully:', result.id);
      
      return { 
        success: true, 
        notificationId: result.id,
        status: result.status
      };
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.error('Notification error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      
      // Return error instead of throwing - prevents 500 errors
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown notification error',
        notificationId: null,
        details: 'Notification service unavailable - form data saved successfully'
      };
    }
  }

  // Send prototype request notification
  async sendPrototypeRequest(data: {
    name?: string;
    contactType: string;
    contactValue: string;
    description: string;
    hasRecording: boolean;
    recordingTime: number;
    files: any[];
  }) {
    try {
      const recipient = {
        name: data.name,
        [data.contactType]: data.contactValue
      };

      const content = {
        subject: 'New Prototype Request - StateX',
        message: `
          New prototype request received:
          
          Name: ${data.name || 'Not provided'}
          Contact: ${data.contactValue} (${data.contactType})
          Description: ${data.description}
          Has Recording: ${data.hasRecording ? 'Yes' : 'No'}
          Recording Time: ${data.recordingTime} seconds
          Files: ${data.files.length} files attached
        `,
        metadata: {
          formType: 'prototype',
          hasRecording: data.hasRecording,
          recordingTime: data.recordingTime,
          fileCount: data.files.length
        }
      };

      const attachments = data.files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));

      return await this.sendNotification({
        type: 'prototype_request',
        recipient,
        content,
        attachments
      });
    } catch (error) {
      console.error('❌ Failed to send prototype request notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        notificationId: null
      };
    }
  }

  // Send contact form notification
  async sendContactForm(data: {
    name?: string;
    contactType: string;
    contactValue: string;
    description: string;
    hasRecording: boolean;
    recordingTime: number;
    files: any[];
  }) {
    try {
      const recipient = {
        name: data.name,
        [data.contactType]: data.contactValue
      };

      const content = {
        subject: 'New Contact Form Submission - StateX',
        message: `
          New contact form submission:
          
          Name: ${data.name || 'Not provided'}
          Contact: ${data.contactValue} (${data.contactType})
          Description: ${data.description}
          Has Recording: ${data.hasRecording ? 'Yes' : 'No'}
          Recording Time: ${data.recordingTime} seconds
          Files: ${data.files.length} files attached
        `,
        metadata: {
          formType: 'contact',
          hasRecording: data.hasRecording,
          recordingTime: data.recordingTime,
          fileCount: data.files.length
        }
      };

      const attachments = data.files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));

      return await this.sendNotification({
        type: 'contact_form',
        recipient,
        content,
        attachments
      });
    } catch (error) {
      console.error('❌ Failed to send contact form notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        notificationId: null
      };
    }
  }

  // Test notification service connection
  async testConnection() {
    // Check if notification service is enabled
    if (!notificationConfig.enabled) {
      return { 
        success: true, 
        message: 'Notification service is disabled',
        service: 'notification-service',
        version: 'disabled',
        status: 'disabled'
      };
    }

    try {
      const response = await fetch(`${notificationConfig.url}${notificationConfig.endpoints.health}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${notificationConfig.apiKey}`,
          'User-Agent': 'StateX-Backend/1.0'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Health check failed with status: ${response.status}`);
      }

      const result = await response.json() as HealthCheckResponse;
      console.log('✅ Notification service connection test successful');
      
      return { 
        success: true, 
        message: 'Notification service is available',
        service: result.service || 'notification-service',
        version: result.version || 'unknown'
      };
    } catch (error) {
      console.error('❌ Notification service connection test failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Notification service is not available'
      };
    }
  }

  // Get notification service configuration info
  getConfiguration() {
    return {
      enabled: notificationConfig.enabled,
      url: notificationConfig.url,
      timeout: notificationConfig.timeout,
      retries: notificationConfig.retries,
      endpoints: notificationConfig.endpoints,
      hasApiKey: !!notificationConfig.apiKey
    };
  }

  // Get service status
  async getServiceStatus() {
    const config = this.getConfiguration();
    
    if (!config.enabled) {
      return {
        status: 'disabled',
        message: 'Notification service is disabled',
        config: config
      };
    }

    const healthCheck = await this.testConnection();
    
    return {
      status: healthCheck.success ? 'healthy' : 'unhealthy',
      message: healthCheck.message,
      config: config,
      health: healthCheck
    };
  }
}
