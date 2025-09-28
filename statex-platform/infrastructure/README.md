# Infrastructure Services

## Overview

The Statex platform infrastructure consists of containerized services deployed via Kubernetes, providing a robust, scalable, and maintainable foundation for the entire platform. All infrastructure services are designed for zero manual intervention and rapid recovery.

## Infrastructure Architecture

### Core Infrastructure Services

| Service | Purpose | Type | Replicas | Storage | Clustering |
|---------|---------|------|----------|---------|------------|
| [PostgreSQL](./postgresql/) | Primary database | StatefulSet | 3 | Persistent | Yes |
| [RabbitMQ](./rabbitmq/) | Message broker | StatefulSet | 3 | Persistent | Yes |
| [Redis](./redis/) | Cache and sessions | StatefulSet | 3 | Persistent | Yes |
| [MinIO](./minio/) | Object storage | StatefulSet | 4 | Persistent | Yes |
| [Elasticsearch](./elasticsearch/) | Search engine | StatefulSet | 3 | Persistent | Yes |

### Monitoring Infrastructure

| Service | Purpose | Type | Replicas | Storage |
|---------|---------|------|----------|---------|
| [Prometheus](./prometheus/) | Metrics collection | StatefulSet | 1 | Persistent |
| [Grafana](./grafana/) | Visualization | Deployment | 2 | Persistent |
| [Loki](./loki/) | Log aggregation | StatefulSet | 1 | Persistent |
| [Jaeger](./jaeger/) | Distributed tracing | StatefulSet | 1 | Persistent |

### Email Infrastructure

| Service | Purpose | Type | Replicas | Storage |
|---------|---------|------|----------|---------|
| [Postfix](./postfix/) | SMTP server | StatefulSet | 2 | Persistent |
| [Dovecot](./dovecot/) | IMAP server | StatefulSet | 2 | Persistent |
| [Roundcube](./roundcube/) | Webmail panel | Deployment | 2 | Persistent |
| [Mailcow](./mailcow/) | Email management | Deployment | 1 | Persistent |

## Deployment Strategy

### Zero Manual Intervention
- **Infrastructure as Code**: All services deployed via Kubernetes manifests
- **Automated Scaling**: Horizontal Pod Autoscaler (HPA) for all services
- **Self-Healing**: Automatic pod restarts and failover
- **Rolling Updates**: Zero-downtime deployments
- **Health Monitoring**: Automatic health checks and recovery

### GitOps Workflow
- **Automated Deployment**: GitHub Actions triggers deployment on code changes
- **Configuration Management**: All configuration stored in Git
- **Secret Management**: Kubernetes secrets with encryption
- **Backup Automation**: Automated database and storage backups
- **SSL Certificate Management**: Automatic Let's Encrypt certificate renewal

## Service Dependencies

### Database Layer
- **PostgreSQL**: Primary database for all application services
- **Redis**: Caching layer and session storage
- **Elasticsearch**: Full-text search and analytics

### Message Layer
- **RabbitMQ**: Event-driven communication backbone
- **Dead Letter Queues**: Error handling and retry mechanisms

### Storage Layer
- **MinIO**: S3-compatible object storage for files and artifacts
- **Persistent Volumes**: High-performance storage for databases

### Monitoring Layer
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards
- **Loki**: Centralized logging
- **Jaeger**: Distributed tracing

## Security Configuration

### Network Security
- **Network Policies**: Kubernetes network segmentation
- **Service Mesh**: Optional Istio integration
- **TLS Encryption**: All communications encrypted
- **mTLS**: Mutual TLS for service-to-service communication

### Data Protection
- **Encryption at Rest**: Database and storage encryption
- **Encryption in Transit**: TLS for all communications
- **Secret Management**: Kubernetes secrets with encryption
- **Audit Logging**: Comprehensive audit trails

## Performance Optimization

### Resource Management
- **Resource Requests**: Appropriate CPU and memory requests
- **Resource Limits**: Prevent resource exhaustion
- **Horizontal Scaling**: Auto-scaling based on metrics
- **Vertical Scaling**: Resource optimization

### Storage Optimization
- **SSD Storage**: Fast storage for databases
- **Storage Classes**: Different storage tiers
- **Backup Strategy**: Regular automated backups
- **Data Retention**: Configurable retention policies

## Monitoring and Observability

### Three Pillars of Observability
1. **Metrics**: Quantitative data about system performance
2. **Logs**: Detailed event records
3. **Traces**: Request flow through distributed systems

### Key Metrics
- **Infrastructure Metrics**: CPU, memory, disk, network usage
- **Application Metrics**: Request rates, response times, error rates
- **Business Metrics**: User requests, AI processing time, notification delivery

### Alerting Strategy
- **Critical Alerts**: System down, data loss, security breaches
- **Warning Alerts**: Performance degradation, resource constraints
- **Info Alerts**: Deployment notifications, capacity planning

## Backup and Recovery

### Backup Strategy
- **Database Backups**: Daily automated backups with retention
- **Object Storage**: Cross-region replication
- **Configuration**: Infrastructure as Code versioning
- **Code**: Git repository backups

### Recovery Procedures
- **RTO (Recovery Time Objective)**: < 1 hour for critical services
- **RPO (Recovery Point Objective)**: < 15 minutes data loss
- **Failover**: Automated failover to backup regions
- **Testing**: Regular disaster recovery drills

## Maintenance

### Regular Maintenance
- **Security Updates**: Automated security patch deployment
- **Version Updates**: Regular service version updates
- **Capacity Planning**: Resource usage monitoring and planning
- **Performance Tuning**: Continuous performance optimization

### Operational Procedures
- **Health Checks**: Regular service health verification
- **Log Analysis**: Proactive issue identification
- **Capacity Monitoring**: Resource usage tracking
- **Security Audits**: Regular security assessments

## Troubleshooting

### Common Issues
- **Service Startup**: Pod startup and readiness issues
- **Database Connectivity**: Connection pool and timeout issues
- **Message Broker**: Queue and message delivery issues
- **Storage**: Disk space and performance issues

### Debug Commands
- **Service Status**: `kubectl get pods -n statex-infrastructure`
- **Service Logs**: `kubectl logs -n statex-infrastructure <pod-name>`
- **Service Events**: `kubectl describe pod -n statex-infrastructure <pod-name>`
- **Resource Usage**: `kubectl top pods -n statex-infrastructure`

## Related Documentation

- [Deployment Guide](../docs/deployment.md) - Complete deployment instructions
- [Architecture Overview](../docs/architecture.md) - System architecture details
- [Monitoring Setup](../docs/monitoring.md) - Monitoring configuration
- [Security Guidelines](../docs/security.md) - Security best practices
- [Backup Procedures](../docs/backup.md) - Backup and recovery procedures

## Quick Start

### Deploy Infrastructure
```bash
# Deploy all infrastructure services
kubectl apply -f infrastructure/

# Check deployment status
kubectl get pods -n statex-infrastructure

# View service logs
kubectl logs -n statex-infrastructure -l app=postgresql
```

### Access Services
```bash
# Port forward for local access
kubectl port-forward -n statex-infrastructure svc/postgresql 5432:5432
kubectl port-forward -n statex-infrastructure svc/rabbitmq 15672:15672
kubectl port-forward -n statex-infrastructure svc/grafana 3000:3000
```

This infrastructure provides a solid foundation for the Statex platform with enterprise-grade reliability, security, and performance.
