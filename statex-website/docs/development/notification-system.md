# Notification System Documentation

## 🎯 Overview

The Statex notification system provides comprehensive multi-channel communication capabilities including email, SMS, push notifications, and in-app messaging. Built on our **Fastify** backend with **BullMQ** job processing, **Amazon SES** for email delivery, and **PostgreSQL + Prisma** for data management, ensuring reliable, scalable, and EU-compliant communication.

## 🔗 Related Documentation

- [Technology Stack](technology.md) - Complete technology decisions and cost analysis
- [Architecture](architecture.md) - System architecture overview
- [Backend Documentation](backend.md) - Fastify API implementation details
- [Frontend Documentation](frontend.md) - Next.js 14+ notification integration
- [Email System](email-system.md) - Email delivery and templates
- [Scheduled Tasks](scheduled-tasks.md) - BullMQ job processing
- [Testing](testing.md) - Vitest testing framework
- [Monitoring System](monitoring-system.md) - Sentry error tracking
- [CRM System](crm-system.md) - Customer relationship management
- [Social Media Integration](social-media-integration.md) - Social platform notifications
- [EU Compliance](eu-compliance.md) - Legal and regulatory requirements
- [Development Plan](../../development-plan.md) - Complete project plan

## 🏗 **System Architecture**

### **Technology Stack Integration**
```typescript
// Notification system with our technology stack
const NOTIFICATION_SYSTEM_STACK = {
  backend: 'Fastify (65k req/sec) with TypeScript',
  database: 'PostgreSQL 15+ with Prisma ORM',
  queue_system: 'BullMQ for reliable job processing',
  email_service: {
    primary: 'Amazon SES (€0.10 per 1,000 emails)',
    fallback: 'SendGrid or Mailgun',
    templates: 'React Email with TypeScript'
  },
  sms_service: {
    primary: 'Twilio',
    eu_alternative: 'MessageBird',
    cost: '€0.045 per SMS'
  },
  push_notifications: {
    web: 'Web Push API with service workers',
    mobile: 'Firebase Cloud Messaging (FCM)',
    desktop: 'Electron notifications'
  },
  testing: 'Vitest with 10x performance improvement',
  monitoring: 'Sentry for error tracking and performance'
};
```

### **Multi-Channel Notification Architecture**
```typescript
const NOTIFICATION_CHANNELS = {
  email: {
    service: 'Amazon SES',
    features: ['templates', 'tracking', 'bounce_handling', 'complaints'],
    delivery_rate: '99.9%',
    cost_effective: true,
    eu_compliant: true
  },
  
  sms: {
    primary_service: 'Twilio',
    features: ['international', 'delivery_status', 'shortcodes'],
    delivery_rate: '99.5%',
    use_cases: ['2fa', 'urgent_alerts', 'appointment_reminders']
  },
  
  push_web: {
    technology: 'Web Push API + Service Worker',
    features: ['real_time', 'offline_capable', 'rich_content'],
    browsers: ['Chrome', 'Firefox', 'Safari', 'Edge']
  },
  
  push_mobile: {
    service: 'Firebase Cloud Messaging',
    features: ['cross_platform', 'targeting', 'analytics'],
    platforms: ['iOS', 'Android', 'Web']
  },
  
  in_app: {
    technology: 'WebSocket + Next.js state management',
    features: ['real_time', 'persistent', 'actionable'],
    integration: 'React Context + Zustand'
  },
  
  social_media: {
    platforms: ['LinkedIn', 'Facebook', 'Twitter', 'Instagram'],
    automation: 'BullMQ scheduled posts and responses',
    integration: 'Social Media Integration system'
  }
};
```

## 🗄️ **PostgreSQL Database Schema with Prisma**

### **Notification System Tables**
```sql
-- Notification templates and management
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Template Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category notification_category_enum NOT NULL,
    channel notification_channel_enum NOT NULL,
    
    -- Template Content
    subject VARCHAR(500), -- For email/SMS
    content_text TEXT NOT NULL,
    content_html TEXT, -- For email/in-app
    content_push JSONB, -- Push notification payload
    
    -- Localization
    language VARCHAR(10) DEFAULT 'en',
    localized_versions JSONB, -- Links to other languages
    
    -- Template Configuration
    variables JSONB, -- Available template variables
    default_values JSONB, -- Default variable values
    validation_rules JSONB, -- Variable validation
    
    -- Styling and Layout
    template_style notification_style_enum DEFAULT 'default',
    custom_css TEXT,
    branding_config JSONB,
    
    -- Status and Versioning
    is_active BOOLEAN DEFAULT TRUE,
    version INTEGER DEFAULT 1,
    is_default BOOLEAN DEFAULT FALSE,
    
    -- System Fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User Relationship
    user_id UUID REFERENCES users(id) NOT NULL,
    
    -- Channel Preferences
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    push_web_enabled BOOLEAN DEFAULT TRUE,
    push_mobile_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    
    -- Category Preferences (GDPR compliant)
    marketing_emails BOOLEAN DEFAULT FALSE, -- Requires explicit consent
    transactional_emails BOOLEAN DEFAULT TRUE, -- Always enabled
    system_alerts BOOLEAN DEFAULT TRUE,
    project_updates BOOLEAN DEFAULT TRUE,
    payment_notifications BOOLEAN DEFAULT TRUE,
    
    -- Contact Information
    email VARCHAR(255),
    phone VARCHAR(50),
    timezone VARCHAR(50) DEFAULT 'Europe/Prague',
    
    -- Push Notification Tokens
    web_push_tokens JSONB, -- Array of push subscription objects
    mobile_push_tokens JSONB, -- Array of FCM tokens
    
    -- Frequency Controls
    digest_frequency digest_frequency_enum DEFAULT 'daily',
    quiet_hours JSONB, -- {start: "22:00", end: "08:00"}
    
    -- System Fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Recipient Information
    user_id UUID REFERENCES users(id),
    external_recipient VARCHAR(255), -- For non-user notifications
    
    -- Notification Details
    template_id UUID REFERENCES notification_templates(id),
    category notification_category_enum NOT NULL,
    channel notification_channel_enum NOT NULL,
    priority notification_priority_enum DEFAULT 'medium',
    
    -- Content
    subject VARCHAR(500),
    content_text TEXT NOT NULL,
    content_html TEXT,
    content_data JSONB, -- Template variables and data
    
    -- Delivery Configuration
    send_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    max_attempts INTEGER DEFAULT 3,
    attempt_count INTEGER DEFAULT 0,
    
    -- Status Tracking
    status notification_status_enum DEFAULT 'pending',
    delivery_status delivery_status_enum,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    
    -- BullMQ Integration
    job_id VARCHAR(255), -- BullMQ job identifier
    queue_name VARCHAR(100) DEFAULT 'notifications',
    
    -- External Service Integration
    external_id VARCHAR(255), -- SES Message ID, Twilio SID, etc.
    external_response JSONB, -- Raw API response
    
    -- Error Handling
    error_message TEXT,
    retry_at TIMESTAMP,
    failed_at TIMESTAMP,
    
    -- Analytics and Tracking
    tracking_pixel_url VARCHAR(500),
    utm_parameters JSONB,
    click_tracking JSONB,
    
    -- System Fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notification_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Event Information
    notification_id UUID REFERENCES notifications(id) NOT NULL,
    event_type notification_event_enum NOT NULL,
    event_data JSONB,
    
    -- Tracking Information
    ip_address INET,
    user_agent TEXT,
    location_data JSONB,
    
    -- System Fields
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enums for notification system
CREATE TYPE notification_category_enum AS ENUM (
    'transactional', 'marketing', 'system', 'security', 
    'project_updates', 'payment', 'support', 'social'
);

CREATE TYPE notification_channel_enum AS ENUM (
    'email', 'sms', 'push_web', 'push_mobile', 'in_app', 'social'
);

CREATE TYPE notification_priority_enum AS ENUM (
    'low', 'medium', 'high', 'critical'
);

CREATE TYPE notification_status_enum AS ENUM (
    'pending', 'queued', 'sending', 'sent', 'delivered', 
    'opened', 'clicked', 'failed', 'expired'
);

CREATE TYPE delivery_status_enum AS ENUM (
    'queued', 'sent', 'delivered', 'bounced', 'complained', 'rejected'
);

CREATE TYPE notification_event_enum AS ENUM (
    'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed'
);

CREATE TYPE notification_style_enum AS ENUM (
    'default', 'minimal', 'branded', 'custom'
);

CREATE TYPE digest_frequency_enum AS ENUM (
    'immediate', 'hourly', 'daily', 'weekly', 'never'
);
```

## 🚀 **Fastify API Implementation**

### **Notification API Routes**
```typescript
// routes/notifications/index.ts - Fastify notification routes
import { FastifyPluginAsync } from 'fastify';
import { notificationService } from '../../services/notificationService';
import { authPlugin } from '../../plugins/auth';

const notificationRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authPlugin);

  // Send notification
  fastify.post('/send', {
    schema: {
      body: {
        type: 'object',
        required: ['templateId', 'recipientId', 'channel'],
        properties: {
          templateId: { type: 'string' },
          recipientId: { type: 'string' },
          channel: { 
            type: 'string', 
            enum: ['email', 'sms', 'push_web', 'push_mobile', 'in_app'] 
          },
          data: { type: 'object' },
          priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
          },
          sendAt: { type: 'string', format: 'date-time' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            notificationId: { type: 'string' },
            jobId: { type: 'string' },
            estimatedDelivery: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { templateId, recipientId, channel, data, priority, sendAt } = request.body;

    try {
      const notification = await notificationService.sendNotification({
        templateId,
        recipientId,
        channel,
        data,
        priority,
        sendAt: sendAt ? new Date(sendAt) : new Date(),
        createdBy: request.user.id
      });

      return {
        success: true,
        notificationId: notification.id,
        jobId: notification.jobId,
        estimatedDelivery: notification.sendAt
      };
    } catch (error) {
      fastify.log.error('Notification sending failed:', error);
      reply.status(500).send({
        success: false,
        error: 'Failed to send notification'
      });
    }
  });

  // Get user notification preferences
  fastify.get('/preferences', async (request, reply) => {
    const userId = request.user.id;

    try {
      const preferences = await notificationService.getUserPreferences(userId);
      return { success: true, data: preferences };
    } catch (error) {
      fastify.log.error('Failed to get notification preferences:', error);
      reply.status(500).send({
        success: false,
        error: 'Failed to retrieve preferences'
      });
    }
  });

  // Update user notification preferences
  fastify.put('/preferences', {
    schema: {
      body: {
        type: 'object',
        properties: {
          emailEnabled: { type: 'boolean' },
          smsEnabled: { type: 'boolean' },
          pushWebEnabled: { type: 'boolean' },
          pushMobileEnabled: { type: 'boolean' },
          inAppEnabled: { type: 'boolean' },
          marketingEmails: { type: 'boolean' },
          digestFrequency: { 
            type: 'string', 
            enum: ['immediate', 'hourly', 'daily', 'weekly', 'never'] 
          },
          quietHours: {
            type: 'object',
            properties: {
              start: { type: 'string' },
              end: { type: 'string' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id;
    const preferences = request.body;

    try {
      const updatedPreferences = await notificationService.updateUserPreferences(
        userId, 
        preferences
      );

      return { success: true, data: updatedPreferences };
    } catch (error) {
      fastify.log.error('Failed to update notification preferences:', error);
      reply.status(500).send({
        success: false,
        error: 'Failed to update preferences'
      });
    }
  });

  // Get notification history
  fastify.get('/history', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          channel: { type: 'string' },
          status: { type: 'string' },
          category: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id;
    const { page, limit, channel, status, category } = request.query;

    try {
      const history = await notificationService.getNotificationHistory(userId, {
        page,
        limit,
        channel,
        status,
        category
      });

      return { success: true, data: history };
    } catch (error) {
      fastify.log.error('Failed to get notification history:', error);
      reply.status(500).send({
        success: false,
        error: 'Failed to retrieve history'
      });
    }
  });

  // Mark notification as read
  fastify.post('/:notificationId/read', {
    schema: {
      params: {
        type: 'object',
        properties: {
          notificationId: { type: 'string' }
        },
        required: ['notificationId']
      }
    }
  }, async (request, reply) => {
    const { notificationId } = request.params;
    const userId = request.user.id;

    try {
      await notificationService.markAsRead(notificationId, userId);
      return { success: true };
    } catch (error) {
      fastify.log.error('Failed to mark notification as read:', error);
      reply.status(500).send({
        success: false,
        error: 'Failed to mark as read'
      });
    }
  });
};

export default notificationRoutes;
```

## 📬 **BullMQ Job Processing Integration**

### **Notification Job Processing**
```typescript
// queues/notification-jobs.ts - BullMQ notification processing
import { Queue, Worker } from 'bullmq';
import { notificationService } from '../services/notificationService';
import { emailService } from '../services/emailService';
import { smsService } from '../services/smsService';
import { pushService } from '../services/pushService';

const notificationQueue = new Queue('notifications', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
});

const notificationWorker = new Worker('notifications', async (job) => {
  const { type, data } = job.data;

  switch (type) {
    case 'send-email':
      return await emailService.sendEmail(data);
    
    case 'send-sms':
      return await smsService.sendSMS(data);
    
    case 'send-push-web':
      return await pushService.sendWebPush(data);
    
    case 'send-push-mobile':
      return await pushService.sendMobilePush(data);
    
    case 'send-in-app':
      return await notificationService.sendInAppNotification(data);
    
    case 'process-digest':
      return await notificationService.processDigestNotifications(data);
    
    case 'cleanup-expired':
      return await notificationService.cleanupExpiredNotifications();
    
    case 'update-delivery-status':
      return await notificationService.updateDeliveryStatus(data);
    
    default:
      throw new Error(`Unknown notification job type: ${type}`);
  }
}, {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  },
  concurrency: parseInt(process.env.NOTIFICATION_WORKER_CONCURRENCY || '10')
});

// Add event listeners for monitoring
notificationWorker.on('completed', (job) => {
  console.log(`Notification job ${job.id} completed`);
});

notificationWorker.on('failed', (job, err) => {
  console.error(`Notification job ${job.id} failed:`, err);
});

export { notificationQueue, notificationWorker };
```

### **Amazon SES Email Service Integration**
```typescript
// services/emailService.ts - Amazon SES integration
import { SESClient, SendEmailCommand, SendBulkEmailCommand } from '@aws-sdk/client-ses';
import { render } from '@react-email/render';
import { prisma } from '../lib/prisma';

export class EmailService {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({
      region: process.env.AWS_SES_REGION || 'eu-west-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
  }

  async sendEmail({
    to,
    subject,
    htmlContent,
    textContent,
    templateData,
    notificationId
  }: SendEmailParams) {
    try {
      const command = new SendEmailCommand({
        Source: process.env.FROM_EMAIL || 'noreply@statex.cz',
        Destination: {
          ToAddresses: Array.isArray(to) ? to : [to]
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: htmlContent,
              Charset: 'UTF-8'
            },
            Text: {
              Data: textContent,
              Charset: 'UTF-8'
            }
          }
        },
        Tags: [
          {
            Name: 'Source',
            Value: 'StatexNotificationSystem'
          },
          {
            Name: 'NotificationId',
            Value: notificationId
          }
        ]
      });

      const result = await this.sesClient.send(command);

      // Update notification with external ID
      await prisma.notifications.update({
        where: { id: notificationId },
        data: {
          externalId: result.MessageId,
          status: 'sent',
          externalResponse: result
        }
      });

      return {
        success: true,
        messageId: result.MessageId,
        provider: 'amazon-ses'
      };
    } catch (error) {
      // Update notification with error
      await prisma.notifications.update({
        where: { id: notificationId },
        data: {
          status: 'failed',
          errorMessage: error.message,
          attemptCount: { increment: 1 }
        }
      });

      throw error;
    }
  }

  async sendBulkEmail({
    destinations,
    subject,
    templateData,
    defaultTemplate
  }: SendBulkEmailParams) {
    try {
      const command = new SendBulkEmailCommand({
        Source: process.env.FROM_EMAIL || 'noreply@statex.cz',
        Template: defaultTemplate,
        DefaultTemplateData: JSON.stringify(templateData),
        Destinations: destinations.map(dest => ({
          Destination: {
            ToAddresses: [dest.email]
          },
          ReplacementTemplateData: JSON.stringify(dest.templateData)
        }))
      });

      const result = await this.sesClient.send(command);
      
      return {
        success: true,
        messageId: result.MessageId,
        status: result.Status,
        provider: 'amazon-ses'
      };
    } catch (error) {
      throw error;
    }
  }

  async handleWebhook(payload: any) {
    // Handle SES bounces, complaints, and delivery confirmations
    const { eventType, bounce, complaint, delivery } = payload;

    switch (eventType) {
      case 'bounce':
        await this.handleBounce(bounce);
        break;
      case 'complaint':
        await this.handleComplaint(complaint);
        break;
      case 'delivery':
        await this.handleDelivery(delivery);
        break;
    }
  }

  private async handleBounce(bounce: any) {
    const { bounceType, bouncedRecipients, timestamp } = bounce;
    
    for (const recipient of bouncedRecipients) {
      await prisma.notifications.updateMany({
        where: {
          externalId: bounce.feedbackId,
          status: 'sent'
        },
        data: {
          deliveryStatus: 'bounced',
          errorMessage: recipient.diagnosticCode
        }
      });
    }
  }

  private async handleComplaint(complaint: any) {
    const { complainedRecipients, timestamp } = complaint;
    
    for (const recipient of complainedRecipients) {
      await prisma.notifications.updateMany({
        where: {
          externalId: complaint.feedbackId,
          status: 'sent'
        },
        data: {
          deliveryStatus: 'complained'
        }
      });

      // Add recipient to suppression list
      await this.addToSuppressionList(recipient.emailAddress, 'complaint');
    }
  }
}
```

## 📱 **Next.js 14+ Frontend Integration**

### **Notification Center Component**
```typescript
// components/notifications/NotificationCenter.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api';
import { Bell, Check, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Notification {
  id: string;
  subject: string;
  contentText: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  openedAt?: string;
}

export function NotificationCenter() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      loadNotifications();
      // Set up WebSocket for real-time notifications
      setupRealTimeNotifications();
    }
  }, [session]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/notifications/history?limit=50');
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeNotifications = () => {
    // WebSocket connection for real-time notifications
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/notifications`);
    
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.subject, {
          body: notification.contentText,
          icon: '/favicon-32x32.png',
          badge: '/badge-icon.png'
        });
      }
    };

    return () => ws.close();
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await apiClient.post(`/api/notifications/${notificationId}/read`);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: 'opened', openedAt: new Date().toISOString() }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.post('/api/notifications/mark-all-read');
      
      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          status: 'opened', 
          openedAt: new Date().toISOString() 
        }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                  >
                    <Check size={16} />
                    Mark all read
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.openedAt ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{notification.subject}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(notification.priority)}`}>
                      {notification.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.contentText}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="capitalize">{notification.category}</span>
                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setIsOpen(false);
                // Navigate to notification settings
                window.location.href = '/settings/notifications';
              }}
            >
              <Settings size={16} className="mr-2" />
              Notification Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 🧪 **Vitest Testing Implementation**

### **Notification Service Tests**
```typescript
// __tests__/services/notificationService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notificationService } from '../../src/services/notificationService';
import { emailService } from '../../src/services/emailService';
import { prisma } from '../../src/lib/prisma';

vi.mock('../../src/lib/prisma', () => ({
  prisma: {
    notifications: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn()
    },
    notificationPreferences: {
      findUnique: vi.fn(),
      upsert: vi.fn()
    },
    notificationTemplates: {
      findUnique: vi.fn()
    }
  }
}));

vi.mock('../../src/services/emailService', () => ({
  emailService: {
    sendEmail: vi.fn()
  }
}));

describe('Notification Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send an email notification', async () => {
    const mockTemplate = {
      id: 'template-id',
      subject: 'Test Subject',
      contentText: 'Test content',
      contentHtml: '<p>Test content</p>'
    };

    const mockPreferences = {
      emailEnabled: true,
      email: 'test@example.com'
    };

    vi.mocked(prisma.notificationTemplates.findUnique).mockResolvedValueOnce(mockTemplate);
    vi.mocked(prisma.notificationPreferences.findUnique).mockResolvedValueOnce(mockPreferences);
    vi.mocked(prisma.notifications.create).mockResolvedValueOnce({
      id: 'notification-id',
      jobId: 'job-id'
    });
    vi.mocked(emailService.sendEmail).mockResolvedValueOnce({
      success: true,
      messageId: 'ses-message-id'
    });

    const result = await notificationService.sendNotification({
      templateId: 'template-id',
      recipientId: 'user-id',
      channel: 'email',
      data: { name: 'John Doe' }
    });

    expect(result.success).toBe(true);
    expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
    expect(prisma.notifications.create).toHaveBeenCalledTimes(1);
  });

  it('should respect user notification preferences', async () => {
    const mockPreferences = {
      emailEnabled: false,
      email: 'test@example.com'
    };

    vi.mocked(prisma.notificationPreferences.findUnique).mockResolvedValueOnce(mockPreferences);

    const result = await notificationService.sendNotification({
      templateId: 'template-id',
      recipientId: 'user-id',
      channel: 'email',
      data: { name: 'John Doe' }
    });

    expect(result.success).toBe(false);
    expect(result.reason).toBe('User has disabled email notifications');
    expect(emailService.sendEmail).not.toHaveBeenCalled();
  });

  it('should update notification preferences', async () => {
    const mockUpdatedPreferences = {
      id: 'pref-id',
      userId: 'user-id',
      emailEnabled: false,
      marketingEmails: false
    };

    vi.mocked(prisma.notificationPreferences.upsert).mockResolvedValueOnce(mockUpdatedPreferences);

    const result = await notificationService.updateUserPreferences('user-id', {
      emailEnabled: false,
      marketingEmails: false
    });

    expect(result.emailEnabled).toBe(false);
    expect(result.marketingEmails).toBe(false);
    expect(prisma.notificationPreferences.upsert).toHaveBeenCalledTimes(1);
  });
});
```

## 📊 **Enhanced Analytics and Monitoring**

### **Sentry Integration and Performance Monitoring**
```typescript
// Notification system monitoring with Sentry
import * as Sentry from '@sentry/node';

const NOTIFICATION_MONITORING = {
  delivery_metrics: {
    success_rate: 'Track successful vs failed notifications by channel',
    delivery_time: 'Monitor average delivery time per channel',
    bounce_rate: 'Email bounce and complaint rates',
    engagement_rate: 'Open and click-through rates'
  },
  
  performance_metrics: {
    queue_processing: 'BullMQ job processing time and throughput',
    api_response_time: 'Notification API endpoint performance',
    database_queries: 'Prisma query performance optimization',
    template_rendering: 'React Email template rendering time'
  },
  
  error_tracking: {
    delivery_failures: 'Failed notification attempts with reasons',
    service_outages: 'External service (SES, Twilio) outages',
    rate_limiting: 'API rate limit exceeded notifications',
    template_errors: 'Template rendering and validation errors'
  },
  
  cost_optimization: {
    ses_costs: 'Amazon SES email delivery costs (€0.10/1000)',
    sms_costs: 'Twilio SMS costs (€0.045/SMS)',
    infrastructure: 'Redis and database costs for queue processing'
  }
};
```

---

This comprehensive notification system leverages our **Fastify** backend for high-performance API processing, **BullMQ** for reliable job processing, **Amazon SES** for cost-effective email delivery, **PostgreSQL + Prisma** for robust data management, and **Next.js 14+** for a modern user experience, all tested with **Vitest** for superior performance and monitored with **Sentry** for operational excellence. 