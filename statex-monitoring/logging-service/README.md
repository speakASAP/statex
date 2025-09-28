# Logging Service

## Overview

The Logging Service provides centralized logging, audit trails, and observability for the entire Statex platform. It collects, processes, stores, and analyzes logs from all microservices, providing a unified view of system behavior and performance.

## Purpose

- **Centralized Logging**: Collect logs from all microservices
- **Audit Trails**: Maintain comprehensive audit trails for compliance
- **Log Analysis**: Analyze logs for insights and troubleshooting
- **Alerting**: Generate alerts based on log patterns
- **Compliance**: Ensure logging meets regulatory requirements
- **Performance Monitoring**: Monitor system performance through logs

## Architecture

### Technology Stack
- **Framework**: FastAPI with Python 3.13
- **Log Storage**: Loki for log aggregation and storage
- **Database**: PostgreSQL for audit trails and metadata
- **Message Broker**: RabbitMQ or NATS for log streaming
- **Search**: Elasticsearch for log search and analysis
- **Visualization**: Grafana for log visualization and dashboards

### Service Dependencies
- **Message Broker**: Log streaming and event processing
- **Database**: Audit trail storage and metadata
- **Log Storage**: Centralized log storage (Loki)
- **Search Engine**: Log search and analysis (Elasticsearch)
- **All Microservices**: Log collection from all services

## API Endpoints

### Log Management Endpoints
```
POST /api/logs
  - Send log entry
  - Accept structured log data

GET /api/logs
  - Query logs
  - Filter by service, level, time range

GET /api/logs/{log_id}
  - Get specific log entry
  - Include full context

DELETE /api/logs/{log_id}
  - Delete log entry
  - Soft delete with retention
```

### Audit Trail Endpoints
```
GET /api/audit
  - Get audit trail
  - Filter by user, action, entity

GET /api/audit/{audit_id}
  - Get specific audit entry
  - Include full audit context

POST /api/audit
  - Create audit entry
  - Record business events
```

### Search and Analysis Endpoints
```
GET /api/search
  - Search logs
  - Full-text search with filters

GET /api/analytics
  - Get log analytics
  - Performance metrics and trends

GET /api/alerts
  - Get active alerts
  - Show alert status and history
```

### Health and Monitoring
```
GET /health
  - Service health check
  - Dependencies status

GET /metrics
  - Prometheus metrics
  - Performance indicators

GET /api/logs/stats
  - Log statistics
  - Volume and performance metrics
```

## Data Models

### Log Entry Model
```python
class LogEntry(BaseModel):
    id: UUID
    timestamp: datetime
    level: LogLevel
    service: str
    message: str
    context: Dict[str, Any] = {}
    trace_id: Optional[str] = None
    span_id: Optional[str] = None
    user_id: Optional[UUID] = None
    request_id: Optional[str] = None
    correlation_id: Optional[str] = None
    tags: List[str] = []
    created_at: datetime
```

### Audit Entry Model
```python
class AuditEntry(BaseModel):
    id: UUID
    timestamp: datetime
    actor: Dict[str, Any]  # User or service information
    action: str
    entity_type: str
    entity_id: UUID
    old_values: Optional[Dict[str, Any]] = None
    new_values: Optional[Dict[str, Any]] = None
    metadata: Dict[str, Any] = {}
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    trace_id: Optional[str] = None
    created_at: datetime
```

### Alert Model
```python
class Alert(BaseModel):
    id: UUID
    name: str
    description: str
    severity: AlertSeverity
    status: AlertStatus
    condition: str
    threshold: float
    current_value: float
    triggered_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    notification_sent: bool = False
    created_at: datetime
    updated_at: datetime
```

## Log Collection

### Log Ingestion
```python
class LogIngestionService:
    def __init__(self, broker: MessageBroker, storage: LogStorage):
        self.broker = broker
        self.storage = storage
        self.processors = {
            'application': ApplicationLogProcessor(),
            'audit': AuditLogProcessor(),
            'access': AccessLogProcessor(),
            'error': ErrorLogProcessor()
        }
    
    async def ingest_log(self, log_data: Dict[str, Any]) -> LogEntry:
        """Ingest and process log entry"""
        # Validate log data
        validated_data = self._validate_log_data(log_data)
        
        # Create log entry
        log_entry = LogEntry(**validated_data)
        
        # Process based on log type
        processor = self.processors.get(log_entry.service)
        if processor:
            log_entry = await processor.process(log_entry)
        
        # Store log entry
        await self.storage.store_log(log_entry)
        
        # Publish to message broker for real-time processing
        await self.broker.publish('log.ingested', log_entry.dict())
        
        return log_entry
    
    def _validate_log_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and sanitize log data"""
        required_fields = ['timestamp', 'level', 'service', 'message']
        for field in required_fields:
            if field not in data:
                raise ValidationError(f"Missing required field: {field}")
        
        # Sanitize sensitive data
        sanitized_data = self._sanitize_sensitive_data(data)
        
        return sanitized_data
```

### Log Processing
```python
class LogProcessor:
    def __init__(self):
        self.parsers = {
            'json': JSONLogParser(),
            'text': TextLogParser(),
            'structured': StructuredLogParser()
        }
    
    async def process_log(self, raw_log: str, log_type: str) -> LogEntry:
        """Process raw log into structured log entry"""
        parser = self.parsers.get(log_type, self.parsers['text'])
        parsed_data = await parser.parse(raw_log)
        
        # Enrich with additional context
        enriched_data = await self._enrich_log_data(parsed_data)
        
        # Create log entry
        log_entry = LogEntry(**enriched_data)
        
        return log_entry
    
    async def _enrich_log_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Enrich log data with additional context"""
        # Add correlation IDs
        if 'trace_id' not in data:
            data['trace_id'] = str(uuid.uuid4())
        
        # Add service metadata
        data['service_version'] = self._get_service_version(data.get('service'))
        
        # Add environment information
        data['environment'] = os.getenv('ENVIRONMENT', 'unknown')
        
        return data
```

## Audit Trail Management

### Audit Service
```python
class AuditService:
    def __init__(self, db: Database, broker: MessageBroker):
        self.db = db
        self.broker = broker
    
    async def record_audit_event(self, event: AuditEvent) -> AuditEntry:
        """Record audit event"""
        audit_entry = AuditEntry(
            id=uuid.uuid4(),
            timestamp=datetime.utcnow(),
            actor=event.actor,
            action=event.action,
            entity_type=event.entity_type,
            entity_id=event.entity_id,
            old_values=event.old_values,
            new_values=event.new_values,
            metadata=event.metadata,
            ip_address=event.ip_address,
            user_agent=event.user_agent,
            trace_id=event.trace_id
        )
        
        # Store in database
        await self.db.create_audit_entry(audit_entry)
        
        # Publish event for real-time processing
        await self.broker.publish('audit.recorded', audit_entry.dict())
        
        return audit_entry
    
    async def get_audit_trail(self, filters: AuditFilters) -> List[AuditEntry]:
        """Get audit trail with filters"""
        return await self.db.get_audit_entries(filters)
    
    async def get_entity_audit_trail(self, entity_type: str, entity_id: UUID) -> List[AuditEntry]:
        """Get audit trail for specific entity"""
        filters = AuditFilters(
            entity_type=entity_type,
            entity_id=entity_id
        )
        return await self.get_audit_trail(filters)
```

### Audit Event Types
```python
class AuditEventType(Enum):
    USER_LOGIN = "user.login"
    USER_LOGOUT = "user.logout"
    USER_CREATED = "user.created"
    USER_UPDATED = "user.updated"
    USER_DELETED = "user.deleted"
    
    REQUEST_CREATED = "request.created"
    REQUEST_UPDATED = "request.updated"
    REQUEST_DELETED = "request.deleted"
    
    CONTENT_CREATED = "content.created"
    CONTENT_UPDATED = "content.updated"
    CONTENT_DELETED = "content.deleted"
    
    NOTIFICATION_SENT = "notification.sent"
    NOTIFICATION_FAILED = "notification.failed"
    
    SYSTEM_ERROR = "system.error"
    SYSTEM_WARNING = "system.warning"
```

## Log Analysis and Alerting

### Log Analyzer
```python
class LogAnalyzer:
    def __init__(self, storage: LogStorage, alert_service: AlertService):
        self.storage = storage
        self.alert_service = alert_service
        self.patterns = {
            'error_rate': ErrorRatePattern(),
            'response_time': ResponseTimePattern(),
            'memory_usage': MemoryUsagePattern(),
            'disk_usage': DiskUsagePattern()
        }
    
    async def analyze_logs(self, time_range: TimeRange) -> AnalysisResult:
        """Analyze logs for patterns and anomalies"""
        logs = await self.storage.get_logs(time_range)
        
        analysis_result = AnalysisResult()
        
        # Analyze each pattern
        for pattern_name, pattern in self.patterns.items():
            pattern_result = await pattern.analyze(logs)
            analysis_result.add_pattern(pattern_name, pattern_result)
            
            # Check for alerts
            if pattern_result.should_alert():
                await self.alert_service.create_alert(
                    pattern_name, pattern_result
                )
        
        return analysis_result
    
    async def search_logs(self, query: LogQuery) -> List[LogEntry]:
        """Search logs with complex queries"""
        return await self.storage.search_logs(query)
```

### Alert Management
```python
class AlertService:
    def __init__(self, db: Database, notification_service: NotificationService):
        self.db = db
        self.notification_service = notification_service
    
    async def create_alert(self, alert_type: str, data: Dict[str, Any]) -> Alert:
        """Create new alert"""
        alert = Alert(
            id=uuid.uuid4(),
            name=f"{alert_type}_alert",
            description=data.get('description', ''),
            severity=AlertSeverity(data.get('severity', 'warning')),
            status=AlertStatus.ACTIVE,
            condition=alert_type,
            threshold=data.get('threshold', 0),
            current_value=data.get('current_value', 0),
            triggered_at=datetime.utcnow()
        )
        
        await self.db.create_alert(alert)
        
        # Send notification
        await self.notification_service.send_alert_notification(alert)
        
        return alert
    
    async def resolve_alert(self, alert_id: UUID) -> Alert:
        """Resolve alert"""
        alert = await self.db.get_alert(alert_id)
        alert.status = AlertStatus.RESOLVED
        alert.resolved_at = datetime.utcnow()
        
        await self.db.update_alert(alert)
        return alert
```

## Log Storage and Retrieval

### Log Storage Interface
```python
class LogStorage:
    def __init__(self, loki_client: LokiClient, elasticsearch: Elasticsearch):
        self.loki = loki_client
        self.elasticsearch = elasticsearch
    
    async def store_log(self, log_entry: LogEntry):
        """Store log entry in Loki"""
        loki_entry = {
            'timestamp': log_entry.timestamp.isoformat(),
            'labels': {
                'service': log_entry.service,
                'level': log_entry.level.value,
                'trace_id': log_entry.trace_id or '',
                'user_id': str(log_entry.user_id) if log_entry.user_id else ''
            },
            'line': json.dumps({
                'message': log_entry.message,
                'context': log_entry.context,
                'tags': log_entry.tags
            })
        }
        
        await self.loki.push_logs([loki_entry])
    
    async def get_logs(self, filters: LogFilters) -> List[LogEntry]:
        """Retrieve logs with filters"""
        query = self._build_loki_query(filters)
        loki_logs = await self.loki.query_logs(query)
        
        return [self._parse_loki_log(log) for log in loki_logs]
    
    async def search_logs(self, query: LogQuery) -> List[LogEntry]:
        """Search logs using Elasticsearch"""
        es_query = self._build_elasticsearch_query(query)
        response = await self.elasticsearch.search(
            index='logs',
            body=es_query
        )
        
        return [self._parse_elasticsearch_log(hit) for hit in response['hits']['hits']]
```

## Configuration

### Environment Variables
```bash
# Service Configuration
SERVICE_NAME=logging-service
SERVICE_PORT=8000
LOG_LEVEL=INFO
ENVIRONMENT=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/statex_logging
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=20

# Message Broker
BROKER_URL=amqp://user:password@localhost:5672
BROKER_TOPIC=logs
BROKER_RETRY_ATTEMPTS=3
BROKER_RETRY_DELAY=1000

# Log Storage
LOKI_URL=http://loki:3100
LOKI_TENANT_ID=statex
ELASTICSEARCH_URL=http://elasticsearch:9200
ELASTICSEARCH_INDEX=logs

# Log Processing
LOG_BATCH_SIZE=1000
LOG_BATCH_TIMEOUT=5
LOG_PROCESSING_WORKERS=4
LOG_RETENTION_DAYS=30

# Alerting
ALERT_CHECK_INTERVAL=60
ALERT_COOLDOWN=300
ALERT_NOTIFICATION_CHANNELS=email,sms

# Performance
MAX_LOG_SIZE=1048576  # 1MB
LOG_COMPRESSION_ENABLED=true
LOG_INDEXING_ENABLED=true

# Security
LOG_ENCRYPTION_ENABLED=true
LOG_ACCESS_CONTROL_ENABLED=true
AUDIT_LOG_ENABLED=true

# Monitoring
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090
HEALTH_CHECK_INTERVAL=30
METRICS_UPDATE_INTERVAL=10
```

## Deployment

### Docker Configuration
```dockerfile
FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Start application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: logging-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: logging-service
  template:
    metadata:
      labels:
        app: logging-service
    spec:
      containers:
      - name: logging-service
        image: statex/logging-service:latest
        ports:
        - containerPort: 8000
        - containerPort: 9090  # Prometheus metrics
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: LOKI_URL
          valueFrom:
            configMapKeyRef:
              name: loki-config
              key: url
        - name: ELASTICSEARCH_URL
          valueFrom:
            configMapKeyRef:
              name: elasticsearch-config
              key: url
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Monitoring and Observability

### Health Checks
- **Liveness Probe**: `/health` - Basic service health
- **Readiness Probe**: `/health/ready` - Service ready to accept traffic
- **Dependency Checks**: Database, Loki, Elasticsearch connectivity

### Metrics
- **Log Metrics**: Log volume, processing rate, storage usage
- **Alert Metrics**: Alert count, resolution rate, notification rate
- **Performance Metrics**: Processing time, query performance
- **Error Metrics**: Error rates, failure counts

### Logging
- **Structured Logging**: JSON-formatted logs
- **Service Logging**: Log all service operations
- **Audit Logging**: Log all audit events
- **Error Logging**: Log all errors and exceptions

### Tracing
- **Distributed Tracing**: OpenTelemetry integration
- **Log Tracing**: Trace log processing pipeline
- **Alert Tracing**: Trace alert generation and resolution
- **Performance Tracing**: Trace performance bottlenecks

## Performance Optimization

### Log Processing
- **Batch Processing**: Process logs in batches
- **Parallel Processing**: Use multiple workers for log processing
- **Compression**: Compress logs for storage efficiency
- **Indexing**: Optimize log indexing for fast retrieval

### Storage Optimization
- **Data Retention**: Implement data retention policies
- **Compression**: Compress old logs
- **Archiving**: Archive old logs to cold storage
- **Partitioning**: Partition logs by time and service

### Query Optimization
- **Indexing**: Optimize Elasticsearch indices
- **Query Caching**: Cache frequent queries
- **Query Optimization**: Optimize search queries
- **Result Pagination**: Implement efficient pagination

## Testing

### Test Categories
- **Unit Tests**: Test individual components
- **Integration Tests**: Test service interactions
- **Log Processing Tests**: Test log processing pipeline
- **Alert Tests**: Test alert generation and resolution

### Test Coverage
- **Code Coverage**: Minimum 80% code coverage
- **Log Coverage**: Test all log types
- **Alert Coverage**: Test all alert types
- **Search Coverage**: Test search functionality

### Test Data
- **Mock Logs**: Test log data for different scenarios
- **Mock Alerts**: Test alert data
- **Test Queries**: Test search queries
- **Performance Data**: Performance test data

## Troubleshooting

### Common Issues
- **Log Ingestion**: Check log format and validation
- **Storage Issues**: Check Loki and Elasticsearch connectivity
- **Alert Issues**: Check alert conditions and thresholds
- **Performance Issues**: Check log processing performance

### Debug Mode
- **Verbose Logging**: Enable detailed logging
- **Log Debug**: Debug log processing
- **Alert Debug**: Debug alert generation
- **Search Debug**: Debug search operations

## Future Enhancements

### Planned Features
- **Machine Learning**: ML-based log analysis
- **Real-time Dashboards**: Real-time log visualization
- **Advanced Alerting**: Complex alert conditions
- **Log Correlation**: Cross-service log correlation

### Technical Improvements
- **Stream Processing**: Real-time log processing
- **Advanced Analytics**: Advanced log analytics
- **Performance Monitoring**: Advanced performance monitoring
- **Auto-scaling**: Automatic scaling based on load
