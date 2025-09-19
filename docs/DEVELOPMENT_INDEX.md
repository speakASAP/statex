# StateX Development Documentation Index

## Complete Guide to Optimized Development Environment

This index provides a comprehensive overview of all development-related documentation for the StateX platform.

## 🚀 Quick Start

### For New Developers

1. [Quick Start Guide](../QUICK_START_DEV.md) - Get up and running in 2-3 minutes
2. [Migration Guide](../MIGRATION_GUIDE.md) - Migrate from legacy development approach
3. [Development Optimization Plan](../DEVELOPMENT_OPTIMIZATION_PLAN.md) - Complete implementation plan

### For Experienced Developers

1. [Development Optimization Guide](development/DEVELOPMENT_OPTIMIZATION.md) - Detailed technical guide
2. [Service Documentation](#service-documentation) - Individual service guides
3. [Troubleshooting Guide](#troubleshooting) - Common issues and solutions

## 📚 Core Documentation

### Development Environment

- **[Development Optimization Guide](development/DEVELOPMENT_OPTIMIZATION.md)** - Complete technical guide
- **[Quick Start Guide](../QUICK_START_DEV.md)** - 2-3 minute setup
- **[Migration Guide](../MIGRATION_GUIDE.md)** - Legacy to optimized migration
- **[Development Optimization Plan](../DEVELOPMENT_OPTIMIZATION_PLAN.md)** - Implementation plan

### Architecture & Design

- **[Main README](../README.md)** - Project overview and architecture
- **[Architecture Diagram](../ARCHITECTURE_DIAGRAM.md)** - Visual system architecture
- **[Service Architecture](architecture/)** - Individual service architectures

### Configuration

- **[Environment Template](../env.development.template)** - Development environment configuration
- **[Docker Compose Files](#🛠️-development-tools)** - Service configurations
- **[Development Scripts](#🛠️-development-tools)** - Management and setup scripts

## 🔧 Service Documentation

### Platform Services

- **[StateX Platform](../statex-platform/README.md)** - Central management system
- **[API Gateway](api/api-gateway.md)** - Central routing and API management

### Website Services

- **[StateX Website](../statex-website/README.md)** - Frontend and core business services
- **[Frontend Development](frontend/)** - Next.js frontend development
- **[Backend Services](backend/)** - Python backend services

### AI Services

- **[StateX AI](../statex-ai/README.md)** - AI platform and services
- **[AI Orchestrator](ai/ai-orchestrator.md)** - Central AI coordination
- **[NLP Service](ai/nlp-service.md)** - Natural language processing
- **[ASR Service](ai/asr-service.md)** - Speech-to-text conversion
- **[Document AI](ai/document-ai.md)** - Document processing and OCR
- **[Prototype Generator](ai/prototype-generator.md)** - Website and app creation
- **[Template Repository](ai/template-repository.md)** - Template management
- **[Free AI Service](ai/free-ai-service.md)** - Free AI models integration
- **[AI Workers](ai/ai-workers.md)** - AI processing agents

### Communication Services

- **[Notification Service](../statex-notification-service/README.md)** - Multi-channel notifications
- **[Email Integration](communication/email.md)** - Email service configuration
- **[Telegram Integration](communication/telegram.md)** - Telegram bot setup
- **[WhatsApp Integration](communication/whatsapp.md)** - WhatsApp Business API

### Infrastructure Services

- **[StateX Infrastructure](../statex-infrastructure/README.md)** - Infrastructure management
- **[Database Configuration](infrastructure/database.md)** - PostgreSQL setup
- **[Cache Configuration](infrastructure/cache.md)** - Redis setup
- **[Message Queue](infrastructure/message-queue.md)** - RabbitMQ configuration
- **[Object Storage](infrastructure/object-storage.md)** - MinIO setup
- **[Reverse Proxy](infrastructure/reverse-proxy.md)** - Nginx configuration

### Monitoring Services

- **[StateX Monitoring](../statex-monitoring/README.md)** - Monitoring and observability
- **[Prometheus Configuration](monitoring/prometheus.md)** - Metrics collection
- **[Grafana Dashboards](monitoring/grafana.md)** - Visualization and dashboards
- **[Loki Configuration](monitoring/loki.md)** - Log aggregation
- **[Jaeger Configuration](monitoring/jaeger.md)** - Distributed tracing

## 🛠️ Development Tools

### Management Scripts

- **[dev-manage.sh](../statex-platform/dev-manage.sh)** - Master development management
- **[setup-dev.sh](../setup-dev.sh)** - Local development setup
- **[manage.sh](../statex-platform/manage.sh)** - Legacy production management

### Docker Compose Files

- **[Infrastructure](../statex-infrastructure/docker-compose.dev.yml)** - Infrastructure services
- **[Website](../statex-website/docker-compose.dev.yml)** - Website services
- **[AI Services](../statex-ai/docker-compose.dev.yml)** - AI services
- **[Notification](../statex-notification-service/docker-compose.dev.yml)** - Notification service
- **[Platform](../statex-platform/docker-compose.dev.yml)** - Platform services
- **[Monitoring](../statex-monitoring/docker-compose.dev.yml)** - Monitoring services

### Environment Configuration

- **[Environment Template](../env.development.template)** - Complete environment configuration
- **[Service Environments](configuration/)** - Service-specific configurations

## 🐛 Troubleshooting

### Common Issues

- **[Port Conflicts](troubleshooting/port-conflicts.md)** - Port already in use errors
- **[Service Connectivity](troubleshooting/connectivity.md)** - Services can't connect
- **[Hot Reload Issues](troubleshooting/hot-reload.md)** - Hot reload not working
- **[File Permissions](troubleshooting/permissions.md)** - Permission denied errors
- **[Environment Variables](troubleshooting/environment.md)** - Environment variable issues

### Performance Issues

- **[Slow Startup](troubleshooting/slow-startup.md)** - Services taking too long to start
- **[High Resource Usage](troubleshooting/high-resources.md)** - Excessive CPU/memory usage
- **[File System Issues](troubleshooting/filesystem.md)** - File system performance problems

### Debugging

- **[Service Logs](troubleshooting/logs.md)** - How to view and analyze logs
- **[Health Checks](troubleshooting/health-checks.md)** - Service health monitoring
- **[Network Debugging](troubleshooting/network.md)** - Network connectivity issues

## 📊 Performance Metrics

### Optimization Results

- **[Performance Comparison](performance/comparison.md)** - Before vs after optimization
- **[Benchmark Results](performance/benchmarks.md)** - Detailed performance metrics
- **[Resource Usage](performance/resources.md)** - CPU, memory, and disk usage

### Monitoring

- **[Grafana Dashboards](monitoring/grafana.md)** - Performance dashboards
- **[Prometheus Metrics](monitoring/prometheus.md)** - System and application metrics
- **[Alerting Rules](monitoring/alerting.md)** - Performance alerting configuration

## 🔄 Migration & Updates

### Migration Guides

- **[Legacy to Optimized](../MIGRATION_GUIDE.md)** - Complete migration guide
- **[Version Updates](migration/version-updates.md)** - Updating between versions
- **[Service Updates](migration/service-updates.md)** - Updating individual services

### Best Practices

- **[Development Workflow](best-practices/workflow.md)** - Recommended development workflow
- **[Code Organization](best-practices/code-organization.md)** - Code structure and organization
- **[Testing Strategies](best-practices/testing.md)** - Testing approaches and strategies

## 📖 API Documentation

### Service APIs

- **[API Gateway](api/api-gateway.md)** - Central API documentation
- **[Platform API](api/platform.md)** - Platform management API
- **[AI Services API](api/ai-services.md)** - AI services API documentation
- **[Website API](api/website.md)** - Website services API
- **[Notification API](api/notification.md)** - Notification service API
- **[Monitoring API](api/monitoring.md)** - Monitoring service API

### Integration

- **[Service Integration](integration/)** - How services integrate with each other
- **[External APIs](integration/external.md)** - Third-party API integrations
- **[Webhook Configuration](integration/webhooks.md)** - Webhook setup and configuration

## 🎯 Getting Started Paths

### For New Team Members

1. Read [Quick Start Guide](../QUICK_START_DEV.md)
2. Follow [Development Optimization Guide](development/DEVELOPMENT_OPTIMIZATION.md)
3. Set up local environment with [setup-dev.sh](../setup-dev.sh)
4. Start development with [dev-manage.sh](../statex-platform/dev-manage.sh)

### For Existing Team Members

1. Read [Migration Guide](../MIGRATION_GUIDE.md)
2. Migrate to optimized development approach
3. Update workflow to use new commands
4. Take advantage of hot reload and instant startup

### For DevOps/Infrastructure

1. Review [Development Optimization Plan](../DEVELOPMENT_OPTIMIZATION_PLAN.md)
2. Understand hybrid architecture approach
3. Configure monitoring and alerting
4. Set up CI/CD with optimized development

## 📞 Support & Resources

### Getting Help

- **Documentation**: This index and linked guides
- **Service Logs**: `./dev-manage.sh logs [service]`
- **Health Check**: `./dev-manage.sh health`
- **Status Check**: `./dev-manage.sh status`

### Additional Resources

- **GitHub Issues**: Service-specific issue tracking
- **Team Slack**: #statex-development channel
- **Code Reviews**: Pull request reviews and feedback
- **Knowledge Base**: Internal documentation and FAQs

---

## Happy developing! 🚀

*This documentation is continuously updated. Check back regularly for the latest information.*
