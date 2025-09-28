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
| API Gateway | http://localhost | 80, 443 |
| User Portal | http://localhost:8001 | 8001 |
| Submission Service | http://localhost:8002 | 8002 |
| AI Orchestrator | http://localhost:8003 | 8003 |
| AI Workers | http://localhost:8004 | 8004 |
| Notification Service | http://localhost:8005 | 8005 |
| Content Service | http://localhost:8006 | 8006 |
| Logging Service | http://localhost:8007 | 8007 |
| Prometheus | http://localhost:9090 | 9090 |
| Grafana | http://localhost:${GRAFANA_PORT:-3000} | ${GRAFANA_PORT:-3000} |

## 🗄️ Infrastructure URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| PostgreSQL | localhost:5432 | statex/statex |
| Redis | localhost:6379 | - |
| RabbitMQ | http://localhost:15672 | admin/admin |
| MinIO | http://localhost:9001 | minioadmin/minioadmin |
| Elasticsearch | http://localhost:9200 | - |

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
for port in 8001 8002 8003 8004 8005 8006 8007; do
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
