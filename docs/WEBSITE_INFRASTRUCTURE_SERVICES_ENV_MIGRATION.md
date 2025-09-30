# Website & Infrastructure Services Environment Variables Migration

This document outlines the migration of hardcoded values for Website Services and Infrastructure Services to environment variables.

## **🎯 Objective**

Replace all hardcoded values for Website Services and Infrastructure Services with environment variables to improve maintainability and flexibility.

## **📋 Services Migrated**

### **Website Services**

#### **Frontend**

- **Container Name**: `statex_frontend_dev` → `${FRONTEND_CONTAINER_NAME:-statex_frontend_dev}`
- **External Port**: `3000` → `${FRONTEND_EXTERNAL_PORT:-3000}`
- **Internal Port**: `3000` → `${FRONTEND_INTERNAL_PORT:-3000}`
- **URL**: `http://localhost:3000` → `${FRONTEND_URL:-http://localhost:3000}`

#### **Submission Service**

- **Container Name**: `statex_submission_dev` → `${SUBMISSION_SERVICE_CONTAINER_NAME:-statex_submission_dev}`
- **External Port**: `8002` → `${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}`
- **Internal Port**: `8000` → `${SUBMISSION_SERVICE_INTERNAL_PORT:-8000}`
- **URL**: `http://localhost:8002` → `${SUBMISSION_SERVICE_URL:-http://localhost:8002}`

#### **User Portal**

- **Container Name**: `statex_user_portal_dev` → `${USER_PORTAL_CONTAINER_NAME:-statex_user_portal_dev}`
- **External Port**: `8006` → `${USER_PORTAL_EXTERNAL_PORT:-8006}`
- **Internal Port**: `8000` → `${USER_PORTAL_INTERNAL_PORT:-8000}`
- **URL**: `http://localhost:8006` → `${USER_PORTAL_URL:-http://localhost:8006}`

#### **Content Service**

- **Container Name**: `statex_content_dev` → `${CONTENT_SERVICE_CONTAINER_NAME:-statex_content_dev}`
- **External Port**: `8009` → `${CONTENT_SERVICE_EXTERNAL_PORT:-8009}`
- **Internal Port**: `8000` → `${CONTENT_SERVICE_INTERNAL_PORT:-8000}`
- **URL**: `http://localhost:8009` → `${CONTENT_SERVICE_URL:-http://localhost:8009}`

### **Infrastructure Services**

#### **PostgreSQL**

- **Container Name**: `statex_postgres_dev` → `${POSTGRES_CONTAINER_NAME:-statex_postgres_dev}`
- **External Port**: `5432` → `${POSTGRES_EXTERNAL_PORT:-5432}`
- **Internal Port**: `5432` → `${POSTGRES_INTERNAL_PORT:-5432}`
- **URL**: `postgresql://localhost:5432` → `${POSTGRES_URL:-postgresql://localhost:5432}`

#### **Redis**

- **Container Name**: `statex_redis_dev` → `${REDIS_CONTAINER_NAME:-statex_redis_dev}`
- **External Port**: `6379` → `${REDIS_EXTERNAL_PORT:-6379}`
- **Internal Port**: `6379` → `${REDIS_INTERNAL_PORT:-6379}`
- **URL**: `redis://localhost:6379` → `${REDIS_URL:-redis://localhost:6379}`

#### **RabbitMQ**

- **Container Name**: `statex_rabbitmq_dev` → `${RABBITMQ_CONTAINER_NAME:-statex_rabbitmq_dev}`
- **External Port**: `5672` → `${RABBITMQ_EXTERNAL_PORT:-5672}`
- **Internal Port**: `5672` → `${RABBITMQ_INTERNAL_PORT:-5672}`
- **Management External Port**: `15672` → `${RABBITMQ_MANAGEMENT_EXTERNAL_PORT:-15672}`
- **Management Internal Port**: `15672` → `${RABBITMQ_MANAGEMENT_INTERNAL_PORT:-15672}`
- **URL**: `amqp://localhost:5672` → `${RABBITMQ_URL:-amqp://localhost:5672}`

#### **MinIO**

- **Container Name**: `statex_minio_dev` → `${MINIO_CONTAINER_NAME:-statex_minio_dev}`
- **External Port**: `9000` → `${MINIO_EXTERNAL_PORT:-9000}`
- **Internal Port**: `9000` → `${MINIO_INTERNAL_PORT:-9000}`
- **Console External Port**: `9001` → `${MINIO_CONSOLE_EXTERNAL_PORT:-9001}`
- **Console Internal Port**: `9001` → `${MINIO_CONSOLE_INTERNAL_PORT:-9001}`
- **URL**: `http://localhost:9000` → `${MINIO_URL:-http://localhost:9000}`

#### **Nginx**

- **Container Name**: `statex_nginx_dev` → `${NGINX_CONTAINER_NAME:-statex_nginx_dev}`
- **HTTP External Port**: `80` → `${NGINX_EXTERNAL_PORT:-80}`
- **HTTP Internal Port**: `80` → `${NGINX_INTERNAL_PORT:-80}`
- **HTTPS External Port**: `443` → `${NGINX_HTTPS_EXTERNAL_PORT:-443}`
- **HTTPS Internal Port**: `443` → `${NGINX_HTTPS_INTERNAL_PORT:-443}`

#### **Elasticsearch**

- **Container Name**: `statex_elasticsearch_dev` → `${ELASTICSEARCH_CONTAINER_NAME:-statex_elasticsearch_dev}`
- **External Port**: `9200` → `${ELASTICSEARCH_EXTERNAL_PORT:-9200}`
- **Internal Port**: `9200` → `${ELASTICSEARCH_INTERNAL_PORT:-9200}`
- **Transport External Port**: `9300` → `${ELASTICSEARCH_TRANSPORT_EXTERNAL_PORT:-9300}`
- **Transport Internal Port**: `9300` → `${ELASTICSEARCH_TRANSPORT_INTERNAL_PORT:-9300}`
- **URL**: `http://localhost:9200` → `${ELASTICSEARCH_URL:-http://localhost:9200}`

#### **Ollama**

- **Container Name**: `statex_ollama_dev` → `${OLLAMA_CONTAINER_NAME:-statex_ollama_dev}`
- **External Port**: `11434` → `${OLLAMA_EXTERNAL_PORT:-11434}`
- **Internal Port**: `11434` → `${OLLAMA_INTERNAL_PORT:-11434}`
- **URL**: `http://localhost:11434` → `${OLLAMA_URL:-http://localhost:11434}`

## **🔧 Files Modified**

### **Docker Compose Files**

- `statex-website/docker-compose.dev.yml`
- `statex-website/docker-compose.yml`
- `statex-infrastructure/docker-compose.dev.yml`

### **Scripts**

- `scripts/start-dev-all.sh`
- `scripts/stop-dev-all.sh`
- `statex-platform/scripts/dev-manage.sh`

### **Configuration Files**

- `statex-platform/services-registry.conf`

### **Documentation**

- `docs/SERVICES_AND_PORTS_REFERENCE.md`

## **🌍 Environment Variables**

### **Website Services Variables**

```bash
# Frontend
FRONTEND_CONTAINER_NAME=statex_frontend_dev
FRONTEND_EXTERNAL_PORT=3000
FRONTEND_INTERNAL_PORT=3000
FRONTEND_URL=http://localhost:3000
FRONTEND_INTERNAL_URL=http://frontend:3000

# Submission Service
SUBMISSION_SERVICE_CONTAINER_NAME=statex_submission_dev
SUBMISSION_SERVICE_EXTERNAL_PORT=8002
SUBMISSION_SERVICE_INTERNAL_PORT=8000
SUBMISSION_SERVICE_URL=http://localhost:8002
SUBMISSION_SERVICE_INTERNAL_URL=http://submission-service:8000

# User Portal
USER_PORTAL_CONTAINER_NAME=statex_user_portal_dev
USER_PORTAL_EXTERNAL_PORT=8006
USER_PORTAL_INTERNAL_PORT=8000
USER_PORTAL_URL=http://localhost:8006
USER_PORTAL_INTERNAL_URL=http://user-portal:8000

# Content Service
CONTENT_SERVICE_CONTAINER_NAME=statex_content_dev
CONTENT_SERVICE_EXTERNAL_PORT=8009
CONTENT_SERVICE_INTERNAL_PORT=8000
CONTENT_SERVICE_URL=http://localhost:8009
CONTENT_SERVICE_INTERNAL_URL=http://content-service:8000
```

### **Infrastructure Services Variables**

```bash
# PostgreSQL
POSTGRES_CONTAINER_NAME=statex_postgres_dev
POSTGRES_EXTERNAL_PORT=5432
POSTGRES_INTERNAL_PORT=5432
POSTGRES_URL=postgresql://statex:statex_password@localhost:5432/statex
POSTGRES_INTERNAL_URL=postgresql://statex:statex_password@postgres:5432/statex

# Redis
REDIS_CONTAINER_NAME=statex_redis_dev
REDIS_EXTERNAL_PORT=6379
REDIS_INTERNAL_PORT=6379
REDIS_URL=redis://localhost:6379
REDIS_INTERNAL_URL=redis://redis:6379

# RabbitMQ
RABBITMQ_CONTAINER_NAME=statex_rabbitmq_dev
RABBITMQ_EXTERNAL_PORT=5672
RABBITMQ_INTERNAL_PORT=5672
RABBITMQ_MANAGEMENT_EXTERNAL_PORT=15672
RABBITMQ_MANAGEMENT_INTERNAL_PORT=15672
RABBITMQ_URL=amqp://statex:statex_password@localhost:5672
RABBITMQ_INTERNAL_URL=amqp://statex:statex_password@rabbitmq:5672

# MinIO
MINIO_CONTAINER_NAME=statex_minio_dev
MINIO_EXTERNAL_PORT=9000
MINIO_INTERNAL_PORT=9000
MINIO_CONSOLE_EXTERNAL_PORT=9001
MINIO_CONSOLE_INTERNAL_PORT=9001
MINIO_URL=http://localhost:9000
MINIO_INTERNAL_URL=http://minio:9000

# Nginx
NGINX_CONTAINER_NAME=statex_nginx_dev
NGINX_EXTERNAL_PORT=80
NGINX_INTERNAL_PORT=80
NGINX_HTTPS_EXTERNAL_PORT=443
NGINX_HTTPS_INTERNAL_PORT=443
NGINX_URL=http://localhost:80
NGINX_INTERNAL_URL=http://nginx:80

# Elasticsearch
ELASTICSEARCH_CONTAINER_NAME=statex_elasticsearch_dev
ELASTICSEARCH_EXTERNAL_PORT=9200
ELASTICSEARCH_INTERNAL_PORT=9200
ELASTICSEARCH_TRANSPORT_EXTERNAL_PORT=9300
ELASTICSEARCH_TRANSPORT_INTERNAL_PORT=9300
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_INTERNAL_URL=http://elasticsearch:9200

# Ollama
OLLAMA_CONTAINER_NAME=statex_ollama_dev
OLLAMA_EXTERNAL_PORT=11434
OLLAMA_INTERNAL_PORT=11434
OLLAMA_URL=http://localhost:11434
OLLAMA_INTERNAL_URL=http://ollama:11434
```

## **📝 Usage Examples**

### **Setting Custom Ports for Website Services**

```bash
# Set custom ports for development
export FRONTEND_EXTERNAL_PORT=3001
export SUBMISSION_SERVICE_EXTERNAL_PORT=8003
export USER_PORTAL_EXTERNAL_PORT=8007
export CONTENT_SERVICE_EXTERNAL_PORT=8010

# Start website services with custom ports
docker compose -f statex-website/docker-compose.dev.yml up -d
```

### **Setting Custom Ports for Infrastructure Services**

```bash
# Set custom ports for development
export POSTGRES_EXTERNAL_PORT=5433
export REDIS_EXTERNAL_PORT=6380
export RABBITMQ_EXTERNAL_PORT=5673
export MINIO_EXTERNAL_PORT=9002

# Start infrastructure services with custom ports
docker compose -f statex-infrastructure/docker-compose.dev.yml up -d
```

### **Production Configuration**

```bash
# Production environment
export FRONTEND_CONTAINER_NAME=statex_frontend_prod
export SUBMISSION_SERVICE_CONTAINER_NAME=statex_submission_prod
export POSTGRES_CONTAINER_NAME=statex_postgres_prod
export REDIS_CONTAINER_NAME=statex_redis_prod
```

### **Health Checks with Variables**

```bash
# Check Website Services health
curl http://localhost:${FRONTEND_EXTERNAL_PORT:-3000}/api/health
curl http://localhost:${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}/health
curl http://localhost:${USER_PORTAL_EXTERNAL_PORT:-8006}/health
curl http://localhost:${CONTENT_SERVICE_EXTERNAL_PORT:-8009}/health

# Check Infrastructure Services health
curl http://localhost:${ELASTICSEARCH_EXTERNAL_PORT:-9200}/_cluster/health
curl http://localhost:${MINIO_CONSOLE_EXTERNAL_PORT:-9001}/minio/health/live
```

## **🔄 Migration Benefits**

### **1. Flexibility**

- Easy port changes without code modifications
- Environment-specific configurations
- Container name customization

### **2. Maintainability**

- Centralized configuration
- Consistent variable naming
- Easy to update across all files

### **3. Scalability**

- Support for multiple environments
- Easy deployment configuration
- Container orchestration compatibility

### **4. Backward Compatibility**

- Default values maintain existing behavior
- Gradual migration possible
- No breaking changes

## **🚀 Next Steps**

### **Immediate Actions**

1. **Test the changes** with default values
2. **Verify all services start** correctly
3. **Check health endpoints** are accessible

### **Future Enhancements**

1. **Create .env files** for different environments
2. **Add validation** for environment variables
3. **Extend migration** to monitoring services
4. **Add documentation** for environment setup

## **⚠️ Important Notes**

### **Default Values**

All environment variables have sensible defaults that maintain the current behavior:

- `FRONTEND_EXTERNAL_PORT:-3000` (defaults to 3000)
- `SUBMISSION_SERVICE_EXTERNAL_PORT:-8002` (defaults to 8002)
- `POSTGRES_EXTERNAL_PORT:-5432` (defaults to 5432)
- `REDIS_EXTERNAL_PORT:-6379` (defaults to 6379)

### **Docker Compose**

The `docker-compose` command will automatically substitute environment variables:

```bash
# This will use the environment variable or default
ports:
  - "${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}:${SUBMISSION_SERVICE_INTERNAL_PORT:-8000}"
```

### **Script Compatibility**

All scripts now use environment variables with fallbacks, ensuring they work with or without custom configuration.

## **📊 Service Dependencies**

### **Website Services Dependencies**

- **Frontend**: API Gateway, Submission Service
- **Submission Service**: PostgreSQL, Redis, RabbitMQ, MinIO, AI Orchestrator
- **User Portal**: PostgreSQL, Redis
- **Content Service**: PostgreSQL, Redis, Elasticsearch, MinIO

### **Infrastructure Services Dependencies**

- **PostgreSQL**: None (standalone)
- **Redis**: None (standalone)
- **RabbitMQ**: None (standalone)
- **MinIO**: None (standalone)
- **Nginx**: All other services (reverse proxy)
- **Elasticsearch**: None (standalone)
- **Ollama**: None (standalone)

## **🔍 Testing the Migration**

### **Test Website Services**

```bash
# Start with default ports
docker compose -f statex-website/docker-compose.dev.yml up -d

# Check health
curl http://localhost:3000/api/health
curl http://localhost:8002/health
curl http://localhost:8006/health
curl http://localhost:8009/health

# Test with custom ports
export FRONTEND_EXTERNAL_PORT=3001
export SUBMISSION_SERVICE_EXTERNAL_PORT=8003
docker compose -f statex-website/docker-compose.dev.yml up -d
curl http://localhost:3001/api/health
curl http://localhost:8003/health
```

### **Test Infrastructure Services**

```bash
# Start with default ports
docker compose -f statex-infrastructure/docker-compose.dev.yml up -d

# Check health
curl http://localhost:9200/_cluster/health
curl http://localhost:9001/minio/health/live

# Test with custom ports
export POSTGRES_EXTERNAL_PORT=5433
export REDIS_EXTERNAL_PORT=6380
docker compose -f statex-infrastructure/docker-compose.dev.yml up -d
```

## **📚 Related Documentation**

- [Services & Ports Reference](./SERVICES_AND_PORTS_REFERENCE.md)
- [Core Platform Services Migration](./CORE_PLATFORM_SERVICES_ENV_MIGRATION.md)
- [Notification & DNS Services Migration](./NOTIFICATION_DNS_SERVICES_ENV_MIGRATION.md)
- [Website Services README](../statex-website/README.md)
- [Infrastructure Services README](../statex-infrastructure/README.md)

---

**Migration Date**: September 29, 2025  
**Version**: 1.0.0  
**Status**: Completed
