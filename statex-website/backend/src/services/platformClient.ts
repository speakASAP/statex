/**
 * StateX Platform Client
 * 
 * This service communicates with the StateX Platform API Gateway
 * instead of calling the notification service directly.
 * This eliminates code duplication and centralizes notification logic.
 */

interface NotificationResponse {
  success: boolean;
  notificationId?: string;
  message: string;
  error?: string;
}

interface PrototypeRequestData {
  name?: string;
  contactType: string;
  contactValue: string;
  description: string;
  hasRecording: boolean;
  recordingTime: number;
  files: any[];
  voiceRecording?: any;
  userId?: string;
  submissionId?: string;
}

class PlatformClient {
  private static instance: PlatformClient;
  private baseUrl: string;
  private apiKey: string;

  private constructor() {
    // Use statex-platform API Gateway
    this.baseUrl = process.env.PLATFORM_API_URL || 'http://localhost:8000';
    this.apiKey = process.env.PLATFORM_API_KEY || 'dev-platform-api-key';
  }

  public static getInstance(): PlatformClient {
    if (!PlatformClient.instance) {
      PlatformClient.instance = new PlatformClient();
    }
    return PlatformClient.instance;
  }

  /**
   * Send prototype request notification via StateX Platform API
   */
  async sendPrototypeRequest(data: PrototypeRequestData): Promise<NotificationResponse> {
    try {
      console.log('📤 Sending prototype request via StateX Platform API...');

      const response = await fetch(`${this.baseUrl}/api/notifications/prototype-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'StateX-Backend/1.0'
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Prototype request notification sent successfully:', result.notificationId);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to send prototype request notification:', error);
      return { 
        success: false, 
        message: 'Failed to send notification',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send generic notification via StateX Platform API
   */
  async sendNotification(data: {
    user_id: string;
    type: string;
    title: string;
    message: string;
    contact_type: string;
    contact_value: string;
    user_name: string;
  }): Promise<NotificationResponse> {
    try {
      console.log('📤 Sending notification via StateX Platform API...');

      const response = await fetch(`${this.baseUrl}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'StateX-Backend/1.0'
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Notification sent successfully:', result.notificationId);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
      return { 
        success: false, 
        message: 'Failed to send notification',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const platformClient = PlatformClient.getInstance();
export default platformClient;
