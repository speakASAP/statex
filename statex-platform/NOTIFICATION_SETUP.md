# StateX Notification System Setup Guide

This guide will help you set up real notifications for the StateX platform.

**IMPORTANT**: All client communications are handled by the standalone notification service (`statex-notification-service`). This is the single source of truth for all notification configurations.

## 🔧 Configuration Location

**All notification configurations must be set in the standalone notification service:**

- **Location**: `/Users/sergiystashok/Documents/GitHub/statex/statex-notification-service/.env`
- **Service**: `statex-notification-service` (standalone microservice)
- **Purpose**: Single source of truth for all client communications

## 📧 Email Notifications (SMTP)

Configure in `statex-notification-service/.env`:

```bash
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 📱 WhatsApp Notifications

Configure in `statex-notification-service/.env`:

```bash
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
```

## ✈️ Telegram Notifications

Configure in `statex-notification-service/.env`:

```bash
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
TELEGRAM_BOT_USERNAME=your-bot-username
```

## 🧪 Testing Notifications

### Quick Test

Run the test script to test all configured channels:

```bash
python3 test-notifications.py
```

### Manual API Test

Test individual channels via API:

```bash
# Email test
curl -X POST http://localhost:8005/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user",
    "type": "confirmation",
    "title": "Test Email",
    "message": "This is a test email notification",
    "contact_type": "email",
    "contact_value": "your-email@example.com",
    "user_name": "Test User"
  }'
```

## 🔧 Environment Configuration

### Docker Compose

Add environment variables to your `docker-compose.yml`:

```yaml
services:
  notification-service:
    environment:
      - SMTP_USERNAME=${SMTP_USERNAME}
      - SMTP_PASSWORD=${SMTP_PASSWORD}
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
      - WHATSAPP_ACCESS_TOKEN=${WHATSAPP_ACCESS_TOKEN}
      - WHATSAPP_PHONE_NUMBER_ID=${WHATSAPP_PHONE_NUMBER_ID}
```

### Local Development

Create a `.env` file in the notification service directory:

```bash
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
WHATSAPP_ACCESS_TOKEN=your-access-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
```

## 🚀 Production Deployment

For production, use secure environment variable management:

- **Docker Swarm**: Use Docker secrets
- **Kubernetes**: Use Kubernetes secrets
- **Cloud Platforms**: Use platform-specific secret management

## 📊 Monitoring

Check notification statistics:

```bash
curl http://localhost:8005/api/notifications/stats
```

View all notifications:

```bash
curl http://localhost:8005/api/notifications
```

## 🔒 Security Notes

- Never commit credentials to version control
- Use environment variables or secret management
- Rotate credentials regularly
- Monitor API usage and costs
- Implement rate limiting for production use
