# Notification Service Architecture

## 🎯 Overview

The StateX platform now uses a **microservice-based notification system** instead of a self-hosted email infrastructure. This architecture provides better scalability, maintainability, and separation of concerns by delegating all notification responsibilities to a dedicated external service.

## 🔗 Related Documentation

- [Backend Documentation](backend.md) - Fastify backend integration details
- [Architecture](architecture.md) - System architecture overview
- [Development Plan](../../development-plan.md) - Complete project plan

## 🏗 Notification Service Architecture

### Communication Pattern
```
StateX Backend → HTTP POST → External Notification Service → Email/SMS/Push
```

### Key Benefits
- **Separation of Concerns**: Email logic separated from main application
- **Scalability**: Independent scaling of notification service
- **Maintainability**: Single responsibility for notifications
- **Flexibility**: Easy to add new notification channels (SMS, Push, etc.)
- **Reliability**: Dedicated service with proper error handling

## 📡 API Communication

### HTTP REST API Integration
```typescript
// Notification service endpoint
POST http://notification-service:${FRONTEND_PORT:-3000}/api/notifications

// Request payload
{
  "type": "form_submission" | "prototype_request" | "contact_form",
  "recipient": {
    "email": "user@example.com",
    "phone": "+1234567890",
    "name": "John Doe"
  },
  "content": {
    "subject": "New Form Submission",
    "message": "Form content...",
    "metadata": { /* additional data */ }
  },
  "attachments": [
    {
      "name": "file.pdf",
      "size": 1024,
      "type": "application/pdf",
      "url": "https://..."
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "source": "statex-backend"
}
```

### Authentication
```typescript
// Headers
{
  "Authorization": "Bearer <API_KEY>",
  "Content-Type": "application/json",
  "User-Agent": "StateX-Backend/1.0"
}
```

## 🔧 Implementation Details

### NotificationService Class
```typescript
// backend/src/services/notificationService.ts
export class NotificationService {
  // Send generic notification
  async sendNotification(data: NotificationData): Promise<NotificationResult>
  
  // Send prototype request notification
  async sendPrototypeRequest(data: PrototypeRequestData): Promise<NotificationResult>
  
  // Send contact form notification
  async sendContactForm(data: ContactFormData): Promise<NotificationResult>
  
  // Test service connection
  async testConnection(): Promise<ConnectionTestResult>
}
```

### Configuration
```typescript
// Environment variables
NOTIFICATION_SERVICE_URL=http://notification-service:${FRONTEND_PORT:-3000}
NOTIFICATION_SERVICE_API_KEY=your-api-key-here
```

### Error Handling
- **Graceful Degradation**: Form submissions continue even if notifications fail
- **Retry Logic**: Built-in retry mechanism for failed requests
- **Timeout Protection**: 10-second timeout to prevent hanging requests
- **Comprehensive Logging**: Detailed error logging for debugging

## 📊 Form Integration

### Updated Form Routes
```typescript
// Before: Direct email sending
const emailResult = await emailService.sendPrototypeRequest(data);

// After: Notification service integration
const notificationResult = await notificationService.sendPrototypeRequest(data);
```

### Response Format
```typescript
// Updated API response
{
  "success": true,
  "message": "Prototype request submitted successfully",
  "notificationId": "notif_123456789",
  "notificationSent": true,
  "notificationError": null,
  "sessionId": "session_123",
  "userId": "user_123",
  "storedFiles": 2,
  "hasVoiceRecording": true
}
```

## 🧪 Testing

### Health Check Endpoint
```bash
# Test notification service connection
GET /api/forms/test-notification

# Response
{
  "success": true,
  "message": "Notification service is available",
  "service": "notification-service",
  "version": "1.0.0"
}
```

### Integration Testing
```typescript
// Test notification sending
const result = await notificationService.sendPrototypeRequest({
  name: "Test User",
  contactType: "email",
  contactValue: "test@example.com",
  description: "Test description",
  hasRecording: false,
  recordingTime: 0,
  files: []
});

expect(result.success).toBe(true);
expect(result.notificationId).toBeDefined();
```

## 🚀 Deployment Considerations

### Docker Network Communication
```yaml
# docker-compose.yml
services:
  backend:
    environment:
      - NOTIFICATION_SERVICE_URL=http://notification-service:${FRONTEND_PORT:-3000}
      - NOTIFICATION_SERVICE_API_KEY=${NOTIFICATION_SERVICE_API_KEY}
    networks:
      - statex_network

  # External notification service (separate repository)
  notification-service:
    image: your-notification-service:latest
    networks:
      - statex_network
```

### Environment Configuration
```bash
# Development
NOTIFICATION_SERVICE_URL=http://localhost:${FRONTEND_PORT:-3000}
NOTIFICATION_SERVICE_API_KEY=dev-api-key

# Production
NOTIFICATION_SERVICE_URL=http://notification-service:${FRONTEND_PORT:-3000}
NOTIFICATION_SERVICE_API_KEY=prod-secure-api-key
```

## 📈 Monitoring & Observability

### Logging
```typescript
// Success logging
console.log('✅ Notification sent successfully:', result.notificationId);

// Error logging
console.error('❌ Failed to send notification:', error);
console.error('Notification error details:', {
  message: error.message,
  name: error.name,
  stack: error.stack
});
```

### Metrics to Track
- **Notification Success Rate**: Percentage of successful notifications
- **Response Time**: Time to send notification
- **Error Rate**: Failed notification attempts
- **Service Availability**: Notification service uptime

## 🔒 Security Considerations

### API Key Management
- Store API keys in environment variables
- Use different keys for development/production
- Rotate keys regularly
- Never commit keys to version control

### Data Privacy
- Sensitive data is sent to external service
- Ensure notification service is GDPR compliant
- Implement data retention policies
- Use HTTPS for all communications

## 🎯 Next Steps

### For Notification Service Development
1. **Create separate repository** for notification service
2. **Implement email sending** (SMTP, SendGrid, etc.)
3. **Add SMS support** for phone notifications
4. **Implement push notifications** for mobile apps
5. **Add webhook support** for real-time notifications
6. **Create admin dashboard** for notification management

### For StateX Integration
1. **Test notification service** connection
2. **Monitor notification delivery** rates
3. **Implement retry logic** for failed notifications
4. **Add notification preferences** for users
5. **Create notification templates** for different types

## 📚 Migration Summary

### Removed Components
- ✅ **Docker Mailserver** - Self-hosted email server
- ✅ **Roundcube** - Webmail interface
- ✅ **EmailService** - Nodemailer-based email service
- ✅ **SMTP Configuration** - Email server settings
- ✅ **Mailserver Data** - Email storage volumes

### Added Components
- ✅ **NotificationService** - HTTP-based notification client
- ✅ **HTTP API Integration** - RESTful communication
- ✅ **Error Handling** - Graceful degradation
- ✅ **Health Checks** - Service availability testing
- ✅ **Configuration** - Environment-based setup

### Benefits Achieved
- **Simplified Architecture**: Removed complex email infrastructure
- **Better Separation**: Clear boundaries between services
- **Improved Maintainability**: Single responsibility principle
- **Enhanced Scalability**: Independent service scaling
- **Reduced Complexity**: Fewer moving parts in main application

---

This notification service architecture provides a clean, scalable, and maintainable solution for handling all notification requirements in the StateX platform.

