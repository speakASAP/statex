# Multi-Agent Workflow - Troubleshooting Runbook

This runbook provides step-by-step procedures for diagnosing and resolving common issues in the multi-agent contact form workflow system.

## Table of Contents

1. [Quick Diagnostic Commands](#quick-diagnostic-commands)
2. [Service Health Checks](#service-health-checks)
3. [Common Issues](#common-issues)
4. [Performance Issues](#performance-issues)
5. [Database Issues](#database-issues)
6. [AI Service Issues](#ai-service-issues)
7. [Network and Connectivity](#network-and-connectivity)
8. [Monitoring and Alerting](#monitoring-and-alerting)
9. [Emergency Procedures](#emergency-procedures)
10. [Log Analysis](#log-analysis)

## Quick Diagnostic Commands

### System Status Overview
```bash
# Check all service status
docker-compose ps

# Check system resources
docker stats --no-stream

# Check disk space
df -h

# Check memory usage
free -h

# Check network connectivity
netstat -tlnp | grep -E ':(3000|8002|8010|8011|8012|8013|8016|8005|5432|6379|5672|9000)'
```

### Service Health Check Script
```bash
#!/bin/bash
# quick-health-check.sh

echo "🔍 Quick Health Check"
echo "===================="

SERVICES=(
    "http://localhost:3000/api/health:Website Frontend"
    "http://localhost:8002/health:Submission Service"
    "http://localhost:8010/health:AI Orchestrator"
    "http://localhost:8011/health:NLP Service"
    "http://localhost:8012/health:ASR Service"
    "http://localhost:8013/health:Document AI"
    "http://localhost:8016/health:Free AI Service"
    "http://localhost:8005/health:Notification Service"
)

for service in "${SERVICES[@]}"; do
    IFS=':' read -r url name <<< "$service"
    
    if curl -f -s -m 5 "$url" > /dev/null 2>&1; then
        echo "✅ $name"
    else
        echo "❌ $name"
    fi
done

echo ""
echo "Infrastructure Services:"
docker exec statex_postgres pg_isready -U statex_user && echo "✅ PostgreSQL" || echo "❌ PostgreSQL"
docker exec statex_redis redis-cli ping > /dev/null 2>&1 && echo "✅ Redis" || echo "❌ Redis"
docker exec statex_rabbitmq rabbitmqctl status > /dev/null 2>&1 && echo "✅ RabbitMQ" || echo "❌ RabbitMQ"
```

## Service Health Checks

### Individual Service Diagnostics

#### Website Frontend (Port 3000)
```bash
# Check service status
curl -I http://localhost:3000

# Check health endpoint
curl http://localhost:3000/api/health

# Check logs
docker logs statex_website_frontend --tail=50

# Check container status
docker inspect statex_website_frontend

# Test contact form endpoint
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test"}'
```

#### AI Orchestrator (Port 8010)
```bash
# Check health
curl http://localhost:8010/health

# Check metrics
curl http://localhost:8010/metrics

# Check active workflows
curl http://localhost:8010/api/workflows/active

# Check logs for errors
docker logs statex_ai_orchestrator --tail=100 | grep -i error

# Check database connectivity
docker exec statex_ai_orchestrator psql -h postgres -U statex_user -d statex_db -c "SELECT 1;"
```

#### NLP Service (Port 8011)
```bash
# Check health
curl http://localhost:8011/health

# Test analysis endpoint
curl -X POST http://localhost:8011/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"text_content":"Test business analysis","requirements":"Test"}'

# Check Free AI Service connectivity
docker exec statex_nlp_service curl -f http://free-ai-service:8016/health

# Check logs
docker logs statex_nlp_service --tail=50
```

#### Free AI Service (Port 8016)
```bash
# Check health
curl http://localhost:8016/health

# Check Ollama status
ollama list
ollama ps

# Test model availability
curl -X POST http://localhost:8016/analyze \
  -H "Content-Type: application/json" \
  -d '{"text_content":"Test","analysis_type":"business_analysis"}'

# Check model loading
docker logs statex_free_ai_service --tail=100 | grep -i "model"
```

#### Database (PostgreSQL)
```bash
# Check connection
docker exec statex_postgres pg_isready -U statex_user

# Check database size
docker exec statex_postgres psql -U statex_user -d statex_db -c "
SELECT pg_size_pretty(pg_database_size('statex_db')) as database_size;"

# Check active connections
docker exec statex_postgres psql -U statex_user -d statex_db -c "
SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';"

# Check slow queries
docker exec statex_postgres psql -U statex_user -d statex_db -c "
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 5;"
```

## Common Issues

### Issue 1: Service Won't Start

#### Symptoms
- Docker container exits immediately
- Service not responding on expected port
- Health check fails

#### Diagnosis
```bash
# Check container status
docker ps -a | grep statex

# Check container logs
docker logs <container_name> --tail=100

# Check resource usage
docker stats --no-stream

# Check port conflicts
netstat -tlnp | grep <port>
```

#### Resolution
```bash
# Restart specific service
docker-compose restart <service_name>

# Rebuild and restart
docker-compose up -d --build <service_name>

# Check and fix configuration
nano .env
docker-compose up -d <service_name>

# Clear and restart if needed
docker-compose down
docker system prune -f
docker-compose up -d
```

### Issue 2: High Response Times

#### Symptoms
- API requests taking > 30 seconds
- Timeout errors in logs
- Poor user experience

#### Diagnosis
```bash
# Check system resources
htop
iotop

# Check database performance
docker exec statex_postgres psql -U statex_user -d statex_db -c "
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Check Redis performance
docker exec statex_redis redis-cli info stats

# Check AI service response times
time curl http://localhost:8011/health
time curl http://localhost:8016/health
```

#### Resolution
```bash
# Optimize database
docker exec statex_postgres psql -U statex_user -d statex_db -c "VACUUM ANALYZE;"

# Clear Redis cache if needed
docker exec statex_redis redis-cli FLUSHDB

# Restart AI services
docker-compose restart nlp-service asr-service document-ai free-ai-service

# Run performance optimization
python tests/performance_optimization.py
```

### Issue 3: Memory Issues

#### Symptoms
- Out of memory errors
- Services being killed
- System becoming unresponsive

#### Diagnosis
```bash
# Check memory usage
free -h
docker stats --no-stream

# Check swap usage
swapon -s

# Check for memory leaks
docker exec <container> ps aux --sort=-%mem | head -10
```

#### Resolution
```bash
# Restart memory-intensive services
docker-compose restart ai-orchestrator nlp-service free-ai-service

# Add swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Optimize Docker memory limits
# Add to docker-compose.yml:
services:
  ai-orchestrator:
    mem_limit: 2g
    memswap_limit: 2g
```

## Performance Issues

### Slow Workflow Processing

#### Diagnosis Steps
1. **Check AI Service Response Times**
```bash
# Test individual services
time curl -X POST http://localhost:8011/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"text_content":"Test","requirements":"Test"}'

time curl -X POST http://localhost:8016/analyze \
  -H "Content-Type: application/json" \
  -d '{"text_content":"Test","analysis_type":"business_analysis"}'
```

2. **Check Database Performance**
```bash
# Check slow queries
docker exec statex_postgres psql -U statex_user -d statex_db -c "
SELECT query, mean_time, calls, total_time 
FROM pg_stat_statements 
WHERE mean_time > 1000 
ORDER BY mean_time DESC;"

# Check database locks
docker exec statex_postgres psql -U statex_user -d statex_db -c "
SELECT blocked_locks.pid AS blocked_pid,
       blocked_activity.usename AS blocked_user,
       blocking_locks.pid AS blocking_pid,
       blocking_activity.usename AS blocking_user,
       blocked_activity.query AS blocked_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;"
```

3. **Check System Resources**
```bash
# CPU usage by service
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# I/O usage
iotop -o -d 1
```

#### Resolution Steps
1. **Optimize Database**
```bash
# Update statistics
docker exec statex_postgres psql -U statex_user -d statex_db -c "ANALYZE;"

# Reindex if needed
docker exec statex_postgres psql -U statex_user -d statex_db -c "REINDEX DATABASE statex_db;"
```

2. **Optimize AI Services**
```bash
# Restart AI services to clear memory
docker-compose restart free-ai-service nlp-service asr-service

# Check Ollama model loading
ollama ps
ollama list
```

3. **Scale Services**
```bash
# Scale AI workers
docker-compose up -d --scale ai-workers=3
```

## Database Issues

### Connection Pool Exhaustion

#### Symptoms
- "too many connections" errors
- New requests hanging
- Connection timeout errors

#### Diagnosis
```bash
# Check active connections
docker exec statex_postgres psql -U statex_user -d statex_db -c "
SELECT count(*) as total_connections,
       count(*) FILTER (WHERE state = 'active') as active_connections,
       count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity;"

# Check connection limits
docker exec statex_postgres psql -U statex_user -d statex_db -c "SHOW max_connections;"
```

#### Resolution
```bash
# Kill idle connections
docker exec statex_postgres psql -U statex_user -d statex_db -c "
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
AND state_change < now() - interval '5 minutes';"

# Restart services to reset connection pools
docker-compose restart ai-orchestrator submission-service

# Increase connection limit if needed
# Edit postgresql.conf:
max_connections = 200
```

### Database Corruption

#### Symptoms
- Data inconsistency errors
- Index corruption messages
- Query failures

#### Diagnosis
```bash
# Check database integrity
docker exec statex_postgres psql -U statex_user -d statex_db -c "
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE schemaname = 'public';"

# Check for corruption
docker exec statex_postgres pg_dump -U statex_user -d statex_db --schema-only > /tmp/schema_check.sql
```

#### Resolution
```bash
# Backup current data
docker exec statex_postgres pg_dump -U statex_user -d statex_db > /tmp/backup_$(date +%Y%m%d_%H%M%S).sql

# Reindex database
docker exec statex_postgres psql -U statex_user -d statex_db -c "REINDEX DATABASE statex_db;"

# If corruption is severe, restore from backup
# docker exec -i statex_postgres psql -U statex_user -d statex_db < /path/to/backup.sql
```

## AI Service Issues

### Ollama Model Loading Issues

#### Symptoms
- "Model not found" errors
- Slow AI responses
- Free AI Service health check fails

#### Diagnosis
```bash
# Check Ollama status
ollama list
ollama ps

# Check model files
ls -la ~/.ollama/models/

# Check Free AI Service logs
docker logs statex_free_ai_service --tail=100 | grep -i "model\|error"
```

#### Resolution
```bash
# Pull missing models
ollama pull llama2:7b
ollama pull mistral:7b
ollama pull codellama:7b

# Restart Ollama service
sudo systemctl restart ollama

# Restart Free AI Service
docker-compose restart free-ai-service

# Verify model loading
curl -X POST http://localhost:8016/analyze \
  -H "Content-Type: application/json" \
  -d '{"text_content":"Test model loading","analysis_type":"business_analysis"}'
```

### AI Service Timeout Issues

#### Symptoms
- Request timeout errors
- Partial workflow completion
- Agent coordination failures

#### Diagnosis
```bash
# Check service response times
time curl http://localhost:8011/health
time curl http://localhost:8016/health

# Check timeout configurations
docker exec statex_ai_orchestrator env | grep -i timeout

# Check workflow status
curl http://localhost:8010/api/workflows/active
```

#### Resolution
```bash
# Increase timeout values in configuration
# Edit AI Orchestrator config:
AGENT_TIMEOUT=90
WORKFLOW_TIMEOUT=600

# Restart services with new config
docker-compose restart ai-orchestrator

# Optimize AI model performance
# Reduce model size or switch to faster models
```

## Network and Connectivity

### Service Discovery Issues

#### Symptoms
- Services cannot reach each other
- DNS resolution failures
- Connection refused errors

#### Diagnosis
```bash
# Check Docker network
docker network ls
docker network inspect statex_default

# Test service discovery
docker exec statex_ai_orchestrator nslookup postgres
docker exec statex_ai_orchestrator nslookup redis
docker exec statex_ai_orchestrator nslookup free-ai-service

# Check port accessibility
docker exec statex_ai_orchestrator nc -zv postgres 5432
docker exec statex_ai_orchestrator nc -zv redis 6379
```

#### Resolution
```bash
# Recreate Docker network
docker-compose down
docker network prune
docker-compose up -d

# Check firewall rules
sudo ufw status

# Verify service names in docker-compose.yml match connection strings
```

### External API Connectivity

#### Symptoms
- HuggingFace API failures
- External service timeouts
- SSL certificate errors

#### Diagnosis
```bash
# Test external connectivity
curl -I https://api.huggingface.co
curl -I https://api.openai.com

# Check DNS resolution
nslookup api.huggingface.co
nslookup api.openai.com

# Test from container
docker exec statex_nlp_service curl -I https://api.huggingface.co
```

#### Resolution
```bash
# Check proxy settings if behind corporate firewall
export https_proxy=http://proxy.company.com:8080

# Update CA certificates
docker exec statex_nlp_service apt-get update && apt-get install -y ca-certificates

# Restart networking
sudo systemctl restart docker
```

## Monitoring and Alerting

### Prometheus Not Collecting Metrics

#### Symptoms
- Empty Grafana dashboards
- No metrics in Prometheus
- Scrape failures

#### Diagnosis
```bash
# Check Prometheus status
curl http://localhost:9090/-/healthy

# Check targets
curl http://localhost:9090/api/v1/targets

# Check service metrics endpoints
curl http://localhost:8010/metrics
curl http://localhost:8011/metrics
```

#### Resolution
```bash
# Restart Prometheus
docker-compose restart prometheus

# Check Prometheus configuration
docker exec statex_prometheus cat /etc/prometheus/prometheus.yml

# Verify service metrics endpoints are accessible
docker exec statex_prometheus wget -qO- http://ai-orchestrator:8010/metrics
```

### Grafana Dashboard Issues

#### Symptoms
- Dashboards not loading
- No data in panels
- Connection errors

#### Diagnosis
```bash
# Check Grafana health
curl http://localhost:3002/api/health

# Check data source connectivity
curl -u admin:admin http://localhost:3002/api/datasources

# Check Grafana logs
docker logs statex_grafana --tail=50
```

#### Resolution
```bash
# Restart Grafana
docker-compose restart grafana

# Reset admin password
docker exec statex_grafana grafana-cli admin reset-admin-password newpassword

# Reimport dashboards
# Access http://localhost:3002 and import dashboard JSON files
```

## Emergency Procedures

### Complete System Failure

#### Immediate Actions
1. **Assess the situation**
```bash
# Check system status
systemctl status docker
docker ps -a
df -h
free -h
```

2. **Stop all services safely**
```bash
# Graceful shutdown
docker-compose down

# Force stop if needed
docker stop $(docker ps -aq)
```

3. **Check system resources**
```bash
# Check disk space
df -h

# Check memory
free -h

# Check system logs
journalctl -xe --since "1 hour ago"
```

#### Recovery Steps
1. **Start infrastructure services first**
```bash
cd statex-infrastructure
docker-compose up -d postgres redis rabbitmq minio
```

2. **Wait for infrastructure to be ready**
```bash
# Wait for PostgreSQL
until docker exec statex_postgres pg_isready -U statex_user; do sleep 2; done

# Wait for Redis
until docker exec statex_redis redis-cli ping; do sleep 2; done
```

3. **Start application services**
```bash
cd ../statex-ai
docker-compose up -d

cd ../statex-website
docker-compose up -d

cd ../statex-notification-service
docker-compose up -d
```

4. **Verify system health**
```bash
./scripts/health-check.sh
```

### Data Recovery

#### Database Recovery
```bash
# Stop all services
docker-compose down

# Start only PostgreSQL
docker-compose up -d postgres

# Restore from latest backup
gunzip -c /backups/latest/database.sql.gz | docker exec -i statex_postgres psql -U statex_user -d statex_db

# Verify data integrity
docker exec statex_postgres psql -U statex_user -d statex_db -c "SELECT count(*) FROM submissions;"
```

#### File Recovery
```bash
# Restore files from backup
docker exec statex_minio mc mirror /backups/latest/files/ local/submissions/

# Verify file integrity
docker exec statex_minio mc ls local/submissions/
```

## Log Analysis

### Centralized Log Collection
```bash
# View all service logs
docker-compose logs -f

# View logs for specific time period
docker-compose logs --since="2023-01-01T00:00:00" --until="2023-01-01T23:59:59"

# Search for errors across all services
docker-compose logs | grep -i "error\|exception\|failed"

# Export logs for analysis
docker-compose logs --since="1h" > /tmp/system_logs_$(date +%Y%m%d_%H%M%S).txt
```

### Log Analysis Scripts
```bash
#!/bin/bash
# analyze-logs.sh

echo "🔍 Analyzing system logs..."

# Count errors by service
echo "Error count by service:"
docker-compose logs --since="1h" | grep -i error | awk '{print $1}' | sort | uniq -c | sort -nr

# Find most common errors
echo "Most common errors:"
docker-compose logs --since="1h" | grep -i error | awk '{$1=$2=$3=""; print $0}' | sort | uniq -c | sort -nr | head -10

# Check for memory issues
echo "Memory-related issues:"
docker-compose logs --since="1h" | grep -i "out of memory\|oom\|memory"

# Check for timeout issues
echo "Timeout issues:"
docker-compose logs --since="1h" | grep -i "timeout\|timed out"
```

### Performance Log Analysis
```bash
#!/bin/bash
# performance-analysis.sh

echo "📊 Performance Analysis"

# AI service response times
echo "AI Service Response Times:"
docker logs statex_ai_orchestrator --since="1h" | grep -o "processing_time: [0-9.]*" | awk '{sum+=$2; count++} END {print "Average:", sum/count, "seconds"}'

# Database query times
echo "Database Performance:"
docker exec statex_postgres psql -U statex_user -d statex_db -c "
SELECT query, mean_time, calls 
FROM pg_stat_statements 
WHERE calls > 10 
ORDER BY mean_time DESC 
LIMIT 5;"

# Memory usage trends
echo "Memory Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}\t{{.MemPerc}}"
```

This troubleshooting runbook provides comprehensive procedures for diagnosing and resolving issues in the multi-agent workflow system. Keep this document updated as new issues are discovered and resolved.