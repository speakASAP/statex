# User Portal Service

## Overview

The User Portal Service is the main entry point for users to interact with the Statex platform. It provides authentication, user management, personal dashboard, and request history functionality. Built with Django 5.1, it serves as both a web application and an API service for other microservices.

## Purpose

- **User Authentication**: Login, registration, password management
- **Personal Dashboard**: User's request history, status tracking, results viewing
- **User Management**: Profile management, preferences, settings
- **API Gateway**: Provides authentication tokens and user context for other services
- **Admin Interface**: Administrative functions for user and system management

## Architecture

### Technology Stack
- **Framework**: Django 5.1 with Django REST Framework
- **Database**: PostgreSQL (primary), Redis (sessions/cache)
- **Authentication**: JWT tokens with refresh mechanism
- **Frontend**: Django templates with modern JavaScript
- **API**: RESTful API with OpenAPI documentation

### Service Dependencies
- **PostgreSQL**: User data, request metadata, audit logs
- **Redis**: Session storage, caching, rate limiting
- **Message Broker**: Publishes user events
- **Object Storage**: User avatars, document storage

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### User Management Endpoints
```
GET /api/me
PUT /api/me
GET /api/me/requests
GET /api/me/requests/{id}
POST /api/me/requests
PUT /api/me/requests/{id}
DELETE /api/me/requests/{id}
```

### Admin Endpoints
```
GET /api/admin/users
GET /api/admin/users/{id}
PUT /api/admin/users/{id}
DELETE /api/admin/users/{id}
GET /api/admin/requests
GET /api/admin/requests/{id}
```

## Data Models

### User Model
```python
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.URLField(blank=True)
    preferences = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)
```

### Request Model
```python
class UserRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    request_type = models.CharField(max_length=50)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
```

## Authentication Flow

### JWT Token Strategy
1. **Access Token**: Short-lived (15 minutes) for API access
2. **Refresh Token**: Long-lived (7 days) for token renewal
3. **Token Storage**: HttpOnly cookies for web, localStorage for mobile
4. **Token Validation**: Centralized validation service

### Multi-Factor Authentication
- **SMS**: Phone number verification
- **Email**: Email verification
- **TOTP**: Time-based one-time passwords
- **Backup Codes**: Recovery codes for account access

## User Dashboard Features

### Request Management
- **Request History**: Chronological list of all user requests
- **Status Tracking**: Real-time status updates
- **Result Viewing**: Download and view AI-generated results
- **Request Creation**: Submit new requests through the portal

### Profile Management
- **Personal Information**: Name, email, phone, avatar
- **Preferences**: Notification settings, language, timezone
- **Security Settings**: Password change, MFA setup
- **API Keys**: Generate and manage API keys for external access

### Notification Center
- **In-app Notifications**: Real-time notifications in the dashboard
- **Email Preferences**: Configure email notification settings
- **SMS Preferences**: Configure SMS notification settings
- **Push Notifications**: Web push notifications (future)

## Security Features

### Input Validation
- **Form Validation**: Django form validation
- **API Validation**: Pydantic model validation
- **XSS Protection**: Automatic XSS protection
- **CSRF Protection**: CSRF tokens for all forms

### Rate Limiting
- **Login Attempts**: Limit failed login attempts
- **API Requests**: Rate limiting per user/IP
- **Password Reset**: Limit password reset requests
- **Registration**: Limit new account creation

### Audit Logging
- **User Actions**: Log all user actions
- **Admin Actions**: Log administrative actions
- **Security Events**: Log security-related events
- **Data Changes**: Log all data modifications

## Integration Points

### Submission Service
- **Request Creation**: Create new requests
- **Status Updates**: Receive status updates via webhooks
- **File Uploads**: Handle file uploads for requests

### Notification Service
- **User Preferences**: Provide notification preferences
- **Delivery Status**: Track notification delivery status
- **Template Management**: Manage notification templates

### AI Orchestrator
- **Request Processing**: Submit requests for AI processing
- **Result Retrieval**: Retrieve AI processing results
- **Status Monitoring**: Monitor processing status

## Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/statex_portal
REDIS_URL=redis://localhost:6379/0

# Authentication
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_LIFETIME=900
JWT_REFRESH_TOKEN_LIFETIME=604800

# External Services
SUBMISSION_SERVICE_URL=http://submission-service:8000
NOTIFICATION_SERVICE_URL=http://notification-service:8000
AI_ORCHESTRATOR_URL=http://ai-orchestrator:8000

# Security
ALLOWED_HOSTS=localhost,127.0.0.1,portal.statex.cz
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://statex.cz
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## Deployment

### Docker Configuration
```dockerfile
FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Run migrations
RUN python manage.py migrate

# Start application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "statex_portal.wsgi:application"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-portal
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-portal
  template:
    metadata:
      labels:
        app: user-portal
    spec:
      containers:
      - name: user-portal
        image: statex/user-portal:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: redis-config
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## Monitoring and Observability

### Health Checks
- **Liveness Probe**: `/health/live` - Basic service health
- **Readiness Probe**: `/health/ready` - Service ready to accept traffic
- **Database Check**: Verify database connectivity
- **Redis Check**: Verify Redis connectivity

### Metrics
- **Request Metrics**: Request count, duration, status codes
- **User Metrics**: Active users, registration rate, login rate
- **Error Metrics**: Error rates, exception counts
- **Performance Metrics**: Response times, database query times

### Logging
- **Structured Logging**: JSON-formatted logs
- **Request Logging**: Log all HTTP requests
- **User Activity**: Log user actions and changes
- **Error Logging**: Log all errors and exceptions

## Testing

### Test Categories
- **Unit Tests**: Test individual components
- **Integration Tests**: Test service interactions
- **API Tests**: Test API endpoints
- **End-to-End Tests**: Test complete user workflows

### Test Coverage
- **Code Coverage**: Minimum 80% code coverage
- **API Coverage**: Test all API endpoints
- **Security Tests**: Test authentication and authorization
- **Performance Tests**: Test under load

## Development Workflow

### Local Development
1. **Setup**: Clone repository and install dependencies
2. **Database**: Setup PostgreSQL and Redis
3. **Environment**: Configure environment variables
4. **Migrations**: Run database migrations
5. **Development Server**: Start Django development server

### Code Quality
- **Linting**: Black, isort, flake8
- **Type Checking**: mypy for type checking
- **Security**: bandit for security scanning
- **Testing**: pytest for testing

### CI/CD Pipeline
1. **Code Quality**: Run linting and type checking
2. **Testing**: Run all tests
3. **Security**: Run security scans
4. **Building**: Build Docker image
5. **Deployment**: Deploy to staging/production

## Troubleshooting

### Common Issues
- **Database Connection**: Check database URL and connectivity
- **Redis Connection**: Check Redis URL and connectivity
- **JWT Issues**: Check JWT secret key and algorithm
- **CORS Issues**: Check CORS configuration

### Debug Mode
- **Django Debug**: Enable Django debug mode for development
- **Logging Level**: Set appropriate logging level
- **Database Logging**: Enable database query logging
- **Performance Profiling**: Use Django Debug Toolbar

## Future Enhancements

### Planned Features
- **Social Login**: OAuth integration with Google, Facebook, etc.
- **Advanced Analytics**: User behavior analytics
- **Mobile App**: Native mobile application
- **API Versioning**: API versioning strategy

### Technical Improvements
- **Caching**: Advanced caching strategies
- **Performance**: Database optimization and query optimization
- **Security**: Enhanced security features
- **Monitoring**: Advanced monitoring and alerting
