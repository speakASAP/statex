# StateX Platform - Quick Reference Card

## 🚀 Most Used Commands

### Development

```bash
# Start everything
make dev

# Check status
make status

# View logs
make logs

# Stop everything
make stop

# Restart everything
make restart
```

### Service Management

```bash
# View logs for specific service
make logs-service SERVICE=submission-service

# Restart specific service
make restart-service SERVICE=user-portal

# Execute command in service
make exec SERVICE=submission-service COMMAND="python -c 'print(\"Hello\")'"

# Access service shell
make shell SERVICE=user-portal
```

### Health & Monitoring

```bash
# Quick health check
make health-check

# Detailed health check
make health-check-detailed

# Open monitoring dashboards
make monitor

# View resource usage
make resources
```

### Database

```bash
# Connect to database
make db-connect

# Create backup
make db-backup

# Restore backup
make db-restore BACKUP_FILE=backup.sql
```

### Production Deployment

```bash
# Deploy everything
make deploy-prod DOMAIN=api.statex.cz WEB_DOMAIN=statex.cz

# Deploy web server only
make deploy-web DOMAIN=statex.cz

# Deploy app server only
make deploy-app DOMAIN=api.statex.cz
```

## 🔧 Service URLs

| Service | URL | Port |
|---------|-----|------|
| API Gateway | <http://localhost> | 80, 443 |
| User Portal | <http://localhost:${USER_PORTAL_EXTERNAL_PORT:-8001}> | ${USER_PORTAL_EXTERNAL_PORT:-8001} |
| Submission Service | <http://localhost:${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}> | ${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002} |
| AI Orchestrator | <http://localhost:${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}> | ${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010} |
| AI Workers | <http://localhost:${AI_WORKERS_EXTERNAL_PORT:-8017}> | ${AI_WORKERS_EXTERNAL_PORT:-8017} |
| Notification Service | <http://localhost:${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}> | ${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005} |
| Content Service | <http://localhost:${CONTENT_SERVICE_EXTERNAL_PORT:-8006}> | ${CONTENT_SERVICE_EXTERNAL_PORT:-8006} |
| Logging Service | <http://localhost:${LOGGING_SERVICE_EXTERNAL_PORT:-8007}> | ${LOGGING_SERVICE_EXTERNAL_PORT:-8007} |
| Prometheus | <http://localhost:${PROMETHEUS_EXTERNAL_PORT:-9090}> | ${PROMETHEUS_EXTERNAL_PORT:-9090} |
| Grafana | <http://localhost:${GRAFANA_PORT:-3000}> | ${GRAFANA_PORT:-3000} |

## 🗄️ Infrastructure URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| PostgreSQL | localhost:${POSTGRES_EXTERNAL_PORT:-5432} | statex/statex |
| Redis | localhost:${REDIS_EXTERNAL_PORT:-6379} | - |
| RabbitMQ | <http://localhost:${RABBITMQ_MANAGEMENT_EXTERNAL_PORT:-15672}> | admin/admin |
| MinIO | <http://localhost:${MINIO_CONSOLE_EXTERNAL_PORT:-9001}> | minioadmin/minioadmin |
| Elasticsearch | <http://localhost:${ELASTICSEARCH_EXTERNAL_PORT:-9200}> | - |

## 🆘 Emergency Commands

```bash
# Stop everything immediately
make stop

# Clean up everything
make clean-all

# Restart from scratch
make clean && make dev

# Check what's running
docker ps
```

## 📊 Health Check Endpoints

```bash
# Test all services
for port in ${USER_PORTAL_EXTERNAL_PORT:-8001} ${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002} ${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005} ${CONTENT_SERVICE_EXTERNAL_PORT:-8006} ${LOGGING_SERVICE_EXTERNAL_PORT:-8007} ${MONITORING_SERVICE_EXTERNAL_PORT:-8007} ${CONTENT_SERVICE_EXTERNAL_PORT:-8009} ${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010} ${NLP_SERVICE_EXTERNAL_PORT:-8011} ${ASR_SERVICE_EXTERNAL_PORT:-8012} ${DOCUMENT_AI_EXTERNAL_PORT:-8013} ${PROTOTYPE_GENERATOR_EXTERNAL_PORT:-8014} ${TEMPLATE_REPOSITORY_EXTERNAL_PORT:-8015} ${FREE_AI_SERVICE_EXTERNAL_PORT:-8016} ${AI_WORKERS_EXTERNAL_PORT:-8017}; do
  echo "Port $port: $(curl -s http://localhost:$port/health | jq -r '.status // "DOWN"')"
done
```

## 🔍 Debugging

```bash
# View container logs
docker logs <container_name>

# Follow logs
docker logs -f <container_name>

# Check container status
docker ps -a

# Check resource usage
docker stats
```

## 📝 Examples

```bash
# View submission service logs
make logs-service SERVICE=submission-service

# Run Python command in user portal
make exec SERVICE=user-portal COMMAND="python manage.py shell"

# Scale submission service to 3 replicas
make scale SERVICE=submission-service REPLICAS=3

# Deploy to production
make deploy-prod DOMAIN=api.statex.cz WEB_DOMAIN=statex.cz
```

---

For complete documentation, see [development-commands.md](development-commands.md)
