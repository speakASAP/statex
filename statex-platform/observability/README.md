# Observability Stack

## Overview

The Statex platform observability stack provides comprehensive monitoring, logging, and tracing capabilities across all services. Built on modern observability tools, it ensures system reliability, performance optimization, and rapid issue resolution.

## Observability Architecture

### Three Pillars of Observability

#### 1. Metrics (Prometheus)
- **System Metrics**: CPU, memory, disk, network usage
- **Application Metrics**: Request rates, response times, error rates
- **Business Metrics**: User requests, AI processing time, notification delivery
- **Custom Metrics**: Service-specific performance indicators

#### 2. Logs (Loki)
- **Structured Logging**: JSON-formatted logs with correlation IDs
- **Centralized Collection**: All service logs in one place
- **Log Aggregation**: Efficient log storage and retrieval
- **Log Analysis**: Pattern recognition and anomaly detection

#### 3. Traces (Jaeger)
- **Distributed Tracing**: Request flow across all services
- **Performance Analysis**: Identify bottlenecks and slow operations
- **Dependency Mapping**: Service interaction visualization
- **Error Tracking**: Trace errors to their source

## Monitoring Stack

### Core Components

| Component | Purpose | Type | Configuration |
|-----------|---------|------|---------------|
| [Prometheus](./prometheus/) | Metrics collection and storage | StatefulSet | [Config](./prometheus/config.yml) |
| [Grafana](./grafana/) | Visualization and dashboards | Deployment | [Dashboards](./grafana/dashboards/) |
| [Loki](./loki/) | Log aggregation and storage | StatefulSet | [Config](./loki/config.yml) |
| [Jaeger](./jaeger/) | Distributed tracing | StatefulSet | [Config](./jaeger/config.yml) |
| [AlertManager](./alertmanager/) | Alert routing and management | Deployment | [Config](./alertmanager/config.yml) |

### Service Integration

#### Application Services
- **OpenTelemetry SDK**: Automatic instrumentation
- **Custom Metrics**: Business-specific metrics
- **Health Checks**: Service health monitoring
- **Correlation IDs**: Request tracing across services

#### Infrastructure Services
- **Node Exporter**: System metrics collection
- **cAdvisor**: Container metrics
- **kube-state-metrics**: Kubernetes state metrics
- **Blackbox Exporter**: External service monitoring

## Metrics Collection

### Application Metrics

#### HTTP Metrics
```python
# Request rate
http_requests_total{method="POST",endpoint="/api/submissions",status="200"}

# Response time
http_request_duration_seconds{method="POST",endpoint="/api/submissions"}

# Error rate
http_requests_total{status=~"5.."}
```

#### Business Metrics
```python
# User requests
user_requests_total{type="prototype",status="completed"}

# AI processing time
ai_processing_duration_seconds{workflow="prototype_generation"}

# Notification delivery
notifications_sent_total{channel="email",status="delivered"}
```

#### System Metrics
```python
# CPU usage
container_cpu_usage_seconds_total

# Memory usage
container_memory_usage_bytes

# Disk usage
container_fs_usage_bytes
```

### Custom Dashboards

#### Platform Overview Dashboard
- **Request Rate**: Total requests per second across all services
- **Response Time**: 95th percentile response times
- **Error Rate**: Error percentage by service
- **Active Users**: Current active user sessions
- **AI Processing**: AI job completion rates and times

#### Service Health Dashboard
- **Service Status**: Health status of all services
- **Resource Usage**: CPU, memory, and disk usage per service
- **Dependencies**: Database, message broker, and storage health
- **Alerts**: Current active alerts and their status

#### Business Metrics Dashboard
- **User Engagement**: User registration and activity metrics
- **Request Processing**: Submission processing times and success rates
- **AI Performance**: AI processing times and accuracy metrics
- **Notification Delivery**: Email, SMS, and social media delivery rates

## Logging Strategy

### Log Levels
- **DEBUG**: Detailed debugging information
- **INFO**: General information about service operation
- **WARN**: Warning messages for potential issues
- **ERROR**: Error messages for failed operations
- **CRITICAL**: Critical errors requiring immediate attention

### Log Format
```json
{
  "timestamp": "2025-01-16T10:30:00Z",
  "level": "INFO",
  "service": "submission-service",
  "trace_id": "abc123def456",
  "user_id": "user-123",
  "message": "Submission processed successfully",
  "metadata": {
    "submission_id": "sub-456",
    "file_count": 3,
    "processing_time_ms": 150
  }
}
```

### Log Aggregation
- **Centralized Collection**: All logs sent to Loki
- **Structured Format**: JSON format for easy parsing
- **Correlation IDs**: Track requests across services
- **Retention Policy**: Configurable log retention periods

## Distributed Tracing

### Trace Structure
```
Request → User Portal → Submission Service → AI Orchestrator → AI Workers → Notification Service
```

### Trace Context
- **Trace ID**: Unique identifier for each request
- **Span ID**: Unique identifier for each operation
- **Parent Span**: Parent operation reference
- **Tags**: Key-value pairs for metadata
- **Logs**: Timestamped log entries

### Performance Analysis
- **Service Dependencies**: Visualize service interactions
- **Bottleneck Identification**: Find slow operations
- **Error Propagation**: Track error sources
- **Performance Trends**: Monitor performance over time

## Alerting Strategy

### Alert Levels

#### Critical Alerts
- **Service Down**: Any service is unavailable
- **Database Down**: Database connectivity issues
- **High Error Rate**: Error rate > 5% for 5 minutes
- **Resource Exhaustion**: CPU or memory usage > 90%

#### Warning Alerts
- **High Response Time**: Response time > 2 seconds
- **Queue Backlog**: Message queue depth > 1000
- **Disk Space**: Disk usage > 80%
- **Certificate Expiry**: SSL certificates expiring in 30 days

#### Info Alerts
- **Deployment Success**: Successful service deployment
- **Backup Completion**: Successful backup completion
- **Capacity Planning**: Resource usage trends

### Alert Routing
- **Slack**: Critical alerts to #alerts channel
- **Email**: Warning alerts to on-call team
- **PagerDuty**: Critical alerts for immediate response
- **Webhook**: Custom integrations for specific alerts

## Performance Monitoring

### Key Performance Indicators (KPIs)

#### System Performance
- **Availability**: 99.9% uptime target
- **Response Time**: < 500ms for 95% of requests
- **Throughput**: > 1000 requests per second
- **Error Rate**: < 0.1% error rate

#### Business Performance
- **User Satisfaction**: Response time and success rate
- **AI Processing**: Processing time and accuracy
- **Notification Delivery**: Delivery success rate
- **System Utilization**: Resource efficiency

### Performance Optimization
- **Bottleneck Identification**: Find performance bottlenecks
- **Resource Optimization**: Optimize CPU and memory usage
- **Caching Strategy**: Implement effective caching
- **Database Optimization**: Query and index optimization

## Security Monitoring

### Security Metrics
- **Authentication Failures**: Failed login attempts
- **Authorization Violations**: Unauthorized access attempts
- **Suspicious Activity**: Unusual patterns or behaviors
- **Security Events**: Security-related incidents

### Compliance Monitoring
- **Data Access**: Track data access patterns
- **Audit Logs**: Comprehensive audit trail
- **Privacy Compliance**: GDPR compliance monitoring
- **Security Scanning**: Regular vulnerability scans

## Troubleshooting

### Common Issues

#### High Response Times
1. Check service health and resource usage
2. Analyze trace data for bottlenecks
3. Review database query performance
4. Check message queue backlog

#### High Error Rates
1. Check service logs for error patterns
2. Verify external service dependencies
3. Check database connectivity
4. Review configuration changes

#### Resource Exhaustion
1. Check resource usage trends
2. Scale services horizontally
3. Optimize resource allocation
4. Review application efficiency

### Debug Tools
- **Grafana Dashboards**: Visual analysis of metrics
- **Log Queries**: Search and filter logs
- **Trace Analysis**: Detailed request tracing
- **Alert History**: Review past alerts and resolutions

## Maintenance

### Regular Tasks
- **Dashboard Updates**: Keep dashboards current
- **Alert Tuning**: Optimize alert thresholds
- **Log Cleanup**: Manage log retention
- **Performance Review**: Regular performance analysis

### Capacity Planning
- **Resource Trends**: Monitor resource usage trends
- **Growth Projections**: Plan for future growth
- **Cost Optimization**: Optimize resource costs
- **Scaling Decisions**: Make informed scaling decisions

## Related Documentation

- [Infrastructure Services](../infrastructure/README.md) - Infrastructure components
- [Deployment Guide](../docs/deployment.md) - Deployment procedures
- [Architecture Overview](../docs/architecture.md) - System architecture
- [Security Guidelines](../docs/security.md) - Security monitoring
- [Performance Tuning](../docs/performance.md) - Performance optimization

## Quick Start

### Deploy Observability Stack
```bash
# Deploy monitoring stack
kubectl apply -f observability/

# Check deployment status
kubectl get pods -n statex-observability

# Access Grafana
kubectl port-forward -n statex-observability svc/grafana 3000:3000
```

### View Dashboards
- **Grafana**: http://localhost:${GRAFANA_PORT:-3000} (admin/admin)
- **Prometheus**: http://localhost:9090
- **Jaeger**: http://localhost:16686
- **Loki**: http://localhost:3100

This observability stack provides comprehensive monitoring, logging, and tracing capabilities to ensure the Statex platform operates reliably and efficiently.
