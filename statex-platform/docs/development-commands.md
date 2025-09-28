# StateX Platform - Development Commands

This document provides a comprehensive guide to all available commands for the StateX Platform development environment.

## Table of Contents

- [Ultra-Fast Development Script](#ultra-fast-development-script)
- [Make Commands](#make-commands)
- [Docker Commands](#docker-commands)
- [Service Management](#service-management)
- [Health Checks](#health-checks)
- [Logging and Monitoring](#logging-and-monitoring)
- [Database Operations](#database-operations)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

## Ultra-Fast Development Script

> **🚀 NEW**: Ultra-fast development script for maximum development speed. See [Ultra-Fast Development Script](ultra-fast-development-script.md) for complete documentation.

### Quick Commands
```bash
# Ultra-fast startup (only starts missing services)
./dev-manage.sh start --fast

# Quick status check (parallel processing)
./dev-manage.sh status --quick

# Start only missing services
./dev-manage.sh start-missing

# Restart only failed services
./dev-manage.sh restart-failed

# Auto-fix common issues
./dev-manage.sh fix
```

### Development Mode Commands
```bash
# Development-optimized startup
./dev-manage.sh dev-start

# Quick development restart
./dev-manage.sh dev-restart

# Development status with caching
./dev-manage.sh status --dev
```

### Performance Features
- **85% faster startup** when all services are running
- **60% faster status checking** with parallel processing
- **8x faster port checks** through parallel execution
- **Smart service detection** that only starts what's needed
- **Intelligent caching** to avoid redundant checks

## Make Commands

### Environment Setup
```bash
# Initial setup (creates venv, installs dependencies, generates SSL certs)
make setup

# Install dependencies only
make install

# Clean up environment
make clean
```

### Development
```bash
# Start all services in development mode
make dev

# Build all Docker images
make build

# Stop all services
make stop

# Restart all services
make restart

# View service status
make status

# Check service health
make health-check
```

### Testing and Quality
```bash
# Run all tests
make test

# Run linting
make lint

# Run security scan
make security-scan

# Run all quality checks
make quality
```

### Logging and Monitoring
```bash
# View logs for all services
make logs

# View logs for specific service
make logs SERVICE=submission-service

# Follow logs in real-time
make logs-follow

# View logs for specific service (follow mode)
make logs-follow SERVICE=api-gateway
```

### Database Operations
```bash
# Connect to PostgreSQL
make db-connect

# Run database migrations
make db-migrate

# Create database backup
make db-backup

# Restore database from backup
make db-restore BACKUP_FILE=backup.sql
```

### Service-Specific Commands
```bash
# Restart specific service
make restart-service SERVICE=submission-service

# View logs for specific service
make service-logs SERVICE=user-portal

# Execute command in service container
make exec SERVICE=submission-service COMMAND="python -c 'print(\"Hello\")'"

# Access service shell
make shell SERVICE=user-portal
```

### Production Deployment
```bash
# Deploy to production (both web and app servers)
make deploy-prod DOMAIN=api.statex.cz WEB_DOMAIN=statex.cz

# Deploy web server only
make deploy-web DOMAIN=statex.cz

# Deploy application server only
make deploy-app DOMAIN=api.statex.cz
```

## Docker Commands

### Basic Docker Operations
```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View container logs
docker logs <container_name>

# Follow container logs
docker logs -f <container_name>

# Execute command in container
docker exec -it <container_name> <command>

# Access container shell
docker exec -it <container_name> /bin/bash
```

### Docker Compose Commands
```bash
# Start services in background
docker compose up -d

# Start services in foreground
docker compose up

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v

# Rebuild and start services
docker compose up --build -d

# View service logs
docker compose logs <service_name>

# Follow service logs
docker compose logs -f <service_name>

# Scale a service
docker compose up -d --scale submission-service=3
```

### Image Management
```bash
# List all images
docker images

# Remove unused images
docker image prune

# Remove all images
docker image prune -a

# Build specific service
docker compose build submission-service

# Pull latest images
docker compose pull
```

## Service Management

### Individual Service Control
```bash
# Start specific service
docker compose up -d submission-service

# Stop specific service
docker compose stop submission-service

# Restart specific service
docker compose restart submission-service

# Remove specific service
docker compose rm -f submission-service
```

### Service Health Monitoring
```bash
# Check if service is healthy
curl http://localhost:8002/health

# Check service readiness
curl http://localhost:8002/health/ready

# Check all service health endpoints
for port in 8001 8002 8003 8004 8005 8006 8007; do
  echo "Service on port $port:"
  curl -s http://localhost:$port/health || echo "Service not responding"
  echo
done
```

## Health Checks

### Service Health Endpoints
- **API Gateway**: http://localhost/health
- **User Portal**: http://localhost:8001/health
- **Submission Service**: http://localhost:8002/health
- **AI Orchestrator**: http://localhost:8003/health
- **AI Workers**: http://localhost:8004/health
- **Notification Service**: http://localhost:8005/health
- **Content Service**: http://localhost:8006/health
- **Logging Service**: http://localhost:8007/health

### Infrastructure Health
- **PostgreSQL**: `docker exec statex-platform-postgres-1 pg_isready`
- **Redis**: `docker exec statex-platform-redis-1 redis-cli ping`
- **RabbitMQ**: http://localhost:15672 (admin/admin)
- **MinIO**: http://localhost:9001 (minioadmin/minioadmin)
- **Elasticsearch**: http://localhost:9200/_cluster/health
- **Prometheus**: http://localhost:9090/targets
- **Grafana**: http://localhost:${GRAFANA_PORT:-3000} (admin/admin)

## Logging and Monitoring

### Prometheus Metrics
```bash
# View all targets
curl http://localhost:9090/api/v1/targets

# Query specific metric
curl "http://localhost:9090/api/v1/query?query=up"

# View service discovery
curl http://localhost:9090/api/v1/targets
```

### Grafana Access
- **URL**: http://localhost:${GRAFANA_PORT:-3000}
- **Username**: admin
- **Password**: admin
- **Default Dashboards**: Available after first login

### Log Aggregation
```bash
# View logs from all services
docker compose logs

# View logs with timestamps
docker compose logs -t

# View logs from last 10 minutes
docker compose logs --since 10m

# View logs with specific level
docker compose logs | grep ERROR
```

## Database Operations

### PostgreSQL Commands
```bash
# Connect to database
docker exec -it statex-platform-postgres-1 psql -U statex -d statex

# Create database backup
docker exec statex-platform-postgres-1 pg_dump -U statex statex > backup.sql

# Restore database
docker exec -i statex-platform-postgres-1 psql -U statex -d statex < backup.sql

# List databases
docker exec statex-platform-postgres-1 psql -U statex -c "\l"

# List tables
docker exec statex-platform-postgres-1 psql -U statex -d statex -c "\dt"
```

### Redis Commands
```bash
# Connect to Redis CLI
docker exec -it statex-platform-redis-1 redis-cli

# Monitor Redis commands
docker exec statex-platform-redis-1 redis-cli monitor

# Get Redis info
docker exec statex-platform-redis-1 redis-cli info
```

## Troubleshooting

### Common Issues

#### Services Not Starting
```bash
# Check container logs
docker compose logs <service_name>

# Check if ports are available
netstat -tulpn | grep :8002

# Restart specific service
docker compose restart <service_name>
```

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker exec statex-platform-postgres-1 pg_isready

# Check database logs
docker compose logs postgres

# Reset database
docker compose down -v
docker compose up -d postgres
```

#### Memory Issues
```bash
# Check Docker resource usage
docker stats

# Clean up unused resources
docker system prune -a

# Check available disk space
df -h
```

### Debugging Commands
```bash
# Check service configuration
docker compose config

# Validate docker-compose.yml
docker compose config --quiet

# Check network connectivity
docker compose exec submission-service ping api-gateway

# Check environment variables
docker compose exec submission-service env
```

## Production Deployment

### Pre-deployment Checklist
```bash
# Run all tests
make test

# Run security scan
make security-scan

# Check service health
make health-check

# Verify all services are running
make status
```

### Deployment Commands
```bash
# Deploy to production
./scripts/production-deploy.sh both api.statex.cz statex.cz

# Deploy web server only
./scripts/production-deploy.sh web statex.cz

# Deploy application server only
./scripts/production-deploy.sh application api.statex.cz
```

### Post-deployment Verification
```bash
# Check production health
curl https://api.statex.cz/health

# Check website
curl https://statex.cz

# Monitor logs
ssh user@server "docker compose logs -f"
```

## Environment Variables

### Required Environment Variables
```bash
# Database
POSTGRES_DB=statex
POSTGRES_USER=statex
POSTGRES_PASSWORD=your_password

# Redis
REDIS_PASSWORD=your_redis_password

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your_minio_password

# JWT
JWT_SECRET_KEY=your_jwt_secret

# API Keys
OPENAI_API_KEY=your_openai_key
```

### Setting Environment Variables
```bash
# Copy example environment file
cp env.example .env

# Edit environment file
nano .env

# Load environment variables
source .env
```

## Quick Reference

### Most Used Commands

**Ultra-Fast Development (Recommended)**
```bash
# Ultra-fast startup
./dev-manage.sh start --fast

# Quick status check
./dev-manage.sh status --quick

# Start missing services
./dev-manage.sh start-missing

# Restart failed services
./dev-manage.sh restart-failed

# Auto-fix issues
./dev-manage.sh fix
```

**Traditional Make Commands**
```bash
# Start development
make dev

# Check status
make status

# View logs
make logs

# Stop everything
make stop

# Deploy to production
make deploy-prod DOMAIN=api.statex.cz WEB_DOMAIN=statex.cz
```

### Emergency Commands
```bash
# Stop all services immediately
docker compose down

# Clean up everything
docker compose down -v && docker system prune -a

# Restart from scratch
make clean && make setup && make dev
```

---

For more detailed information, refer to the main [README.md](../README.md) and [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) files.
