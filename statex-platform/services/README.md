# Statex Platform Services

This directory contains detailed documentation for each microservice in the Statex platform. Each service is designed to be independently deployable and maintainable.

## Service Overview

| Service | Purpose | Technology | Repository |
|---------|---------|------------|------------|
| [User Portal](./user-portal/) | Authentication, user dashboard, request management | Django 5.1 | `portal-django` |
| [Submission Service](./submission-service/) | Form submission handling, file uploads | FastAPI | `svc-submission` |
| [AI Orchestrator](./ai-orchestrator/) | AI job management, workflow orchestration | FastAPI | `svc-ai-orchestrator` |
| [AI Workers](./ai-workers/) | AI processing agents and workers | Python 3.13 | `svc-ai-workers` |
| [Notification Service](./notification-service/) | Multi-channel notification delivery | FastAPI | `svc-notify` |
| [Content Service](./content-service/) | Markdown content management, static site generation | FastAPI | `svc-content` |
| [Logging Service](./logging-service/) | Centralized logging and audit trails | FastAPI | `svc-logging` |

## Service Communication

### Event-Driven Architecture
All services communicate through events published to a message broker (RabbitMQ/NATS). This ensures loose coupling and enables independent development and deployment.

### Event Types
- **User Events**: `user.registered`, `user.updated`, `user.deleted`
- **Request Events**: `request.created`, `request.processing`, `request.completed`, `request.failed`
- **AI Events**: `job.created`, `job.progress`, `job.completed`, `job.failed`
- **Notification Events**: `notification.sent`, `notification.failed`, `notification.delivered`
- **Content Events**: `content.published`, `content.updated`, `content.deleted`

### API Communication
Services also communicate through REST APIs for synchronous operations:
- **Authentication**: JWT token validation
- **Data Retrieval**: Direct API calls for real-time data
- **Health Checks**: Service health monitoring
- **Webhooks**: Callback notifications for async operations

## Development Standards

### Code Organization
Each service follows a consistent structure:
```
service-name/
├── app/
│   ├── main.py              # Application entry point
│   ├── api/                 # API routes and handlers
│   ├── domain/              # Business logic and models
│   ├── services/            # External service integrations
│   ├── adapters/            # Database and external adapters
│   └── telemetry/           # Logging, metrics, tracing
├── tests/                   # Unit and integration tests
├── docs/                    # Service-specific documentation
├── helm/                    # Kubernetes deployment charts
├── Dockerfile
├── requirements.txt
├── pyproject.toml
└── README.md
```

### Configuration Management
- **Environment Variables**: All configuration through environment variables
- **Default Values**: Sensible defaults for all configuration options
- **Validation**: Pydantic models for configuration validation
- **Secrets**: Secure handling of sensitive configuration

### Testing Strategy
- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test service interactions
- **Contract Tests**: Test API contracts between services
- **End-to-End Tests**: Test complete user workflows

### Monitoring and Observability
- **Structured Logging**: JSON-formatted logs with correlation IDs
- **Metrics**: Prometheus metrics for performance monitoring
- **Tracing**: OpenTelemetry distributed tracing
- **Health Checks**: Kubernetes-ready health check endpoints

## Deployment

### Container Strategy
- **Multi-stage Builds**: Optimized Docker images
- **Security Scanning**: Vulnerability scanning in CI/CD
- **Base Images**: Consistent base images across services
- **Resource Limits**: Appropriate resource limits and requests

### Kubernetes Deployment
- **Helm Charts**: Standardized deployment templates
- **ConfigMaps**: Configuration management
- **Secrets**: Secure secret management
- **Service Mesh**: Optional Istio integration

### CI/CD Pipeline
- **Automated Testing**: Run tests on every commit
- **Security Scanning**: Scan for vulnerabilities
- **Image Building**: Build and push Docker images
- **Deployment**: Automated deployment to environments
- **Rollback**: Automated rollback on failure

## Service Dependencies

### External Dependencies
- **PostgreSQL**: Primary database for all services
- **Redis**: Caching and session storage
- **S3/MinIO**: Object storage for files and artifacts
- **Message Broker**: RabbitMQ or NATS for event communication

### Internal Dependencies
- **User Portal**: Provides authentication and user management
- **Submission Service**: Entry point for user requests
- **AI Orchestrator**: Central coordinator for AI processing
- **Notification Service**: Handles all user communications

## Security Considerations

### Authentication
- **JWT Tokens**: Stateless authentication across services
- **Token Validation**: Centralized token validation service
- **Refresh Tokens**: Secure token refresh mechanism
- **Multi-factor Authentication**: Optional MFA support

### Authorization
- **Role-Based Access Control**: Granular permission system
- **API Keys**: Service-to-service authentication
- **Rate Limiting**: Prevent abuse and DoS attacks
- **Input Validation**: Comprehensive input sanitization

### Data Protection
- **Encryption**: Data encryption at rest and in transit
- **PII Handling**: Special handling for personal data
- **Audit Logging**: Comprehensive audit trails
- **Data Retention**: Configurable data retention policies

## Performance Considerations

### Scalability
- **Horizontal Scaling**: Stateless services for easy scaling
- **Load Balancing**: Distribute traffic across instances
- **Caching**: Multi-level caching strategy
- **Database Optimization**: Proper indexing and query optimization

### Performance Monitoring
- **Response Times**: Monitor API response times
- **Throughput**: Track requests per second
- **Error Rates**: Monitor and alert on error rates
- **Resource Usage**: Monitor CPU, memory, and disk usage

## Maintenance and Operations

### Logging
- **Centralized Logging**: All logs sent to centralized system
- **Log Levels**: Appropriate log levels for different environments
- **Correlation IDs**: Track requests across services
- **Log Retention**: Configurable log retention policies

### Monitoring
- **Health Checks**: Regular health check endpoints
- **Metrics Collection**: Prometheus metrics for all services
- **Alerting**: Proactive alerting on issues
- **Dashboards**: Grafana dashboards for visualization

### Backup and Recovery
- **Database Backups**: Regular automated backups
- **Configuration Backups**: Version control for all configuration
- **Disaster Recovery**: Documented recovery procedures
- **Testing**: Regular disaster recovery testing

## Development Workflow

### Local Development
- **Docker Compose**: Local development environment
- **Hot Reloading**: Fast development iteration
- **Debugging**: Integrated debugging tools
- **Testing**: Local test execution

### Code Quality
- **Linting**: Automated code linting
- **Formatting**: Consistent code formatting
- **Type Checking**: Static type checking
- **Security Scanning**: Automated security scanning

### Documentation
- **API Documentation**: OpenAPI/Swagger documentation
- **Code Comments**: Comprehensive code documentation
- **Architecture Decision Records**: Document architectural decisions
- **Runbooks**: Operational runbooks for each service
