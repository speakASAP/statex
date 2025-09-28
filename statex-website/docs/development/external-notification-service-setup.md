# External Notification Service Setup Guide

## 🎯 Overview

This guide explains how to configure StateX to connect to your external notification service. The system is designed to be flexible and work with any notification service that implements the required API endpoints.

## 🔧 Configuration Variables

### Required Variables
```bash
# Service URL - where your notification service is running
NOTIFICATION_SERVICE_URL=http://localhost:${FRONTEND_PORT:-3000}

# API Key for authentication
NOTIFICATION_SERVICE_API_KEY=your-api-key-here

# Enable/disable the service
NOTIFICATION_SERVICE_ENABLED=true
```

### Optional Variables
```bash
# Request timeout in milliseconds (default: 10000)
NOTIFICATION_SERVICE_TIMEOUT=10000

# Number of retry attempts (default: 3)
NOTIFICATION_SERVICE_RETRIES=3

# API endpoints (defaults provided)
NOTIFICATION_SERVICE_HEALTH_ENDPOINT=/api/health
NOTIFICATION_SERVICE_NOTIFY_ENDPOINT=/api/notifications
NOTIFICATION_SERVICE_VERSION_ENDPOINT=/api/version
```

## 📡 Required API Endpoints

Your notification service must implement these endpoints:

### 1. Health Check Endpoint
```http
GET /api/health
Authorization: Bearer <API_KEY>
```

**Response:**
```json
{
  "status": "healthy",
  "service": "notification-service",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Send Notification Endpoint
```http
POST /api/notifications
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "prototype_request",
  "recipient": {
    "email": "user@example.com",
    "name": "John Doe"
  },
  "content": {
    "subject": "New Prototype Request",
    "message": "A new prototype request has been received...",
    "metadata": {
      "formType": "prototype",
      "hasRecording": false,
      "fileCount": 2
    }
  },
  "attachments": [
    {
      "name": "document.pdf",
      "size": 1024,
      "type": "application/pdf"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "source": "statex-backend"
}
```

**Response:**
```json
{
  "id": "notif_123456789",
  "status": "queued",
  "message": "Notification queued successfully"
}
```

### 3. Version Endpoint (Optional)
```http
GET /api/version
Authorization: Bearer <API_KEY>
```

**Response:**
```json
{
  "version": "1.0.0",
  "build": "20240101-120000",
  "environment": "production"
}
```

## 🚀 Setup Instructions

### Step 1: Configure Environment Variables

Copy the appropriate configuration from `config/notification-service-examples.env` to your environment file:

```bash
# For development
cp config/notification-service-examples.env .env.development

# For production
cp config/notification-service-examples.env .env.production
```

### Step 2: Update Configuration

Edit your `.env` file with your notification service details:

```bash
# Update these values for your setup
NOTIFICATION_SERVICE_URL=http://your-notification-service:${FRONTEND_PORT:-3000}
NOTIFICATION_SERVICE_API_KEY=your-secure-api-key
NOTIFICATION_SERVICE_ENABLED=true
```

### Step 3: Test Connection

Start your StateX backend and test the connection:

```bash
# Test notification service connection
curl http://localhost:4000/api/forms/test-notification

# Get service status and configuration
curl http://localhost:4000/api/forms/notification-status
```

### Step 4: Verify Integration

Submit a test form to verify notifications are being sent:

```bash
curl -X POST http://localhost:4000/api/forms/prototype \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "contactType": "email",
    "contactValue": "test@example.com",
    "description": "Test notification"
  }'
```

## 🔧 Docker Configuration

### Development with Docker Compose

Add your notification service to `docker-compose.development.yml`:

```yaml
services:
  # Your existing services...
  
  # Your notification service
  notification-service:
    image: your-notification-service:latest
    ports:
      - "${FRONTEND_PORT:-3000}:3000"
    environment:
      - API_KEY=dev-notification-api-key
    networks:
      - statex-network
```

### Production with External Service

For production, configure StateX to connect to your external notification service:

```yaml
# docker-compose.production.yml
services:
  backend:
    environment:
      - NOTIFICATION_SERVICE_URL=https://notifications.yourdomain.com
      - NOTIFICATION_SERVICE_API_KEY=${NOTIFICATION_SERVICE_API_KEY}
      - NOTIFICATION_SERVICE_ENABLED=true
```

## 🧪 Testing

### Health Check
```bash
# Test if notification service is reachable
curl -H "Authorization: Bearer your-api-key" \
     http://your-notification-service:${FRONTEND_PORT:-3000}/api/health
```

### Send Test Notification
```bash
curl -X POST http://your-notification-service:${FRONTEND_PORT:-3000}/api/notifications \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "test",
    "recipient": {"email": "test@example.com"},
    "content": {
      "subject": "Test Notification",
      "message": "This is a test notification"
    }
  }'
```

## 🔒 Security Considerations

### API Key Management
- Store API keys in environment variables
- Use different keys for development/production
- Rotate keys regularly
- Never commit keys to version control

### Network Security
- Use HTTPS in production
- Implement proper authentication
- Consider IP whitelisting
- Use secure communication channels

## 📊 Monitoring

### Check Service Status
```bash
# Get detailed status information
curl http://localhost:4000/api/forms/notification-status
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "message": "Notification service is available",
  "config": {
    "enabled": true,
    "url": "http://localhost:${FRONTEND_PORT:-3000}",
    "timeout": 10000,
    "retries": 3,
    "endpoints": {
      "health": "/api/health",
      "notify": "/api/notifications",
      "version": "/api/version"
    },
    "hasApiKey": true
  },
  "health": {
    "success": true,
    "message": "Notification service is available",
    "service": "notification-service",
    "version": "1.0.0"
  }
}
```

### Logs
Monitor your application logs for notification service activity:

```bash
# Success logs
✅ Notification sent successfully: notif_123456789

# Error logs
❌ Failed to send notification: Connection timeout
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Connection Refused
```
Error: fetch failed: ECONNREFUSED
```
**Solution:** Check if your notification service is running and accessible.

#### 2. Authentication Failed
```
Error: 401 Unauthorized
```
**Solution:** Verify your API key is correct and properly configured.

#### 3. Timeout Errors
```
Error: Request timeout
```
**Solution:** Increase `NOTIFICATION_SERVICE_TIMEOUT` or check network connectivity.

#### 4. Service Disabled
```
📧 Notification service is disabled, skipping notification
```
**Solution:** Set `NOTIFICATION_SERVICE_ENABLED=true` in your environment.

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=notification-service
```

## 📈 Performance Tuning

### Timeout Configuration
```bash
# For local development (faster)
NOTIFICATION_SERVICE_TIMEOUT=5000

# For production (more reliable)
NOTIFICATION_SERVICE_TIMEOUT=15000
```

### Retry Configuration
```bash
# For unreliable networks
NOTIFICATION_SERVICE_RETRIES=5

# For reliable networks
NOTIFICATION_SERVICE_RETRIES=2
```

## 🔄 Migration from Email System

If you're migrating from the old email system:

1. **Disable old email system** (already done)
2. **Set up your notification service** with the required API endpoints
3. **Configure environment variables** for your service
4. **Test the connection** using the provided endpoints
5. **Verify form submissions** are working correctly

## 📚 Next Steps

1. **Implement your notification service** with the required API endpoints
2. **Configure StateX** to connect to your service
3. **Test the integration** thoroughly
4. **Monitor performance** and adjust timeouts/retries as needed
5. **Set up monitoring** for your notification service

---

This configuration allows you to easily switch between different notification services or disable notifications entirely by simply changing environment variables.

