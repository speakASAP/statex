# StateX Environment Variables Reference

This document provides a comprehensive reference for all environment variables used across the StateX platform.

## **🎯 Overview**

All hardcoded values have been replaced with environment variables to ensure consistency, maintainability, and flexibility across different deployment environments.

## **📊 Environment Variables by Category**

### **🏗️ Core Platform Services**

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `API_GATEWAY_CONTAINER_NAME` | `statex_api_gateway_dev` | API Gateway container name |
| `API_GATEWAY_EXTERNAL_PORT` | `8001` | External port for API Gateway |
| `API_GATEWAY_INTERNAL_PORT` | `80` | Internal port for API Gateway |
| `PLATFORM_MANAGEMENT_CONTAINER_NAME` | `statex_platform_management_dev` | Platform Management container name |
| `PLATFORM_MANAGEMENT_EXTERNAL_PORT` | `8000` | External port for Platform Management |
| `PLATFORM_MANAGEMENT_INTERNAL_PORT` | `8000` | Internal port for Platform Management |

### **🤖 AI Services**

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `AI_ORCHESTRATOR_CONTAINER_NAME` | `statex_ai_orchestrator_dev` | AI Orchestrator container name |
| `AI_ORCHESTRATOR_EXTERNAL_PORT` | `8010` | External port for AI Orchestrator |
| `AI_ORCHESTRATOR_INTERNAL_PORT` | `8000` | Internal port for AI Orchestrator |
| `AI_ORCHESTRATOR_URL` | `http://ai-orchestrator:8000` | AI Orchestrator URL for inter-service communication |
| `NLP_SERVICE_CONTAINER_NAME` | `statex_nlp_dev` | NLP Service container name |
| `NLP_SERVICE_EXTERNAL_PORT` | `8011` | External port for NLP Service |
| `NLP_SERVICE_INTERNAL_PORT` | `8000` | Internal port for NLP Service |
| `ASR_SERVICE_CONTAINER_NAME` | `statex_asr_dev` | ASR Service container name |
| `ASR_SERVICE_EXTERNAL_PORT` | `8012` | External port for ASR Service |
| `ASR_SERVICE_INTERNAL_PORT` | `8000` | Internal port for ASR Service |
| `DOCUMENT_AI_CONTAINER_NAME` | `statex_document_ai_dev` | Document AI container name |
| `DOCUMENT_AI_EXTERNAL_PORT` | `8013` | External port for Document AI |
| `DOCUMENT_AI_INTERNAL_PORT` | `8000` | Internal port for Document AI |
| `PROTOTYPE_GENERATOR_CONTAINER_NAME` | `statex_prototype_generator_dev` | Prototype Generator container name |
| `PROTOTYPE_GENERATOR_EXTERNAL_PORT` | `8014` | External port for Prototype Generator |
| `PROTOTYPE_GENERATOR_INTERNAL_PORT` | `8000` | Internal port for Prototype Generator |
| `TEMPLATE_REPOSITORY_CONTAINER_NAME` | `statex_template_repo_dev` | Template Repository container name |
| `TEMPLATE_REPOSITORY_EXTERNAL_PORT` | `8015` | External port for Template Repository |
| `TEMPLATE_REPOSITORY_INTERNAL_PORT` | `8000` | Internal port for Template Repository |
| `FREE_AI_SERVICE_CONTAINER_NAME` | `statex_free_ai_dev` | Free AI Service container name |
| `FREE_AI_SERVICE_EXTERNAL_PORT` | `8016` | External port for Free AI Service |
| `FREE_AI_SERVICE_INTERNAL_PORT` | `8000` | Internal port for Free AI Service |
| `AI_WORKERS_CONTAINER_NAME` | `statex_ai_workers_dev` | AI Workers container name |
| `AI_WORKERS_EXTERNAL_PORT` | `8017` | External port for AI Workers |
| `AI_WORKERS_INTERNAL_PORT` | `8000` | Internal port for AI Workers |

### **🌍 Website Services**

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `FRONTEND_CONTAINER_NAME` | `statex_frontend_dev` | Frontend container name |
| `FRONTEND_EXTERNAL_PORT` | `3000` | External port for Frontend |
| `FRONTEND_INTERNAL_PORT` | `3000` | Internal port for Frontend |
| `SUBMISSION_SERVICE_CONTAINER_NAME` | `statex_submission_dev` | Submission Service container name |
| `SUBMISSION_SERVICE_EXTERNAL_PORT` | `8002` | External port for Submission Service |
| `SUBMISSION_SERVICE_INTERNAL_PORT` | `8000` | Internal port for Submission Service |
| `USER_PORTAL_CONTAINER_NAME` | `statex_user_portal_dev` | User Portal container name |
| `USER_PORTAL_EXTERNAL_PORT` | `8006` | External port for User Portal |
| `USER_PORTAL_INTERNAL_PORT` | `8000` | Internal port for User Portal |
| `CONTENT_SERVICE_CONTAINER_NAME` | `statex_content_dev` | Content Service container name |
| `CONTENT_SERVICE_EXTERNAL_PORT` | `8009` | External port for Content Service |
| `CONTENT_SERVICE_INTERNAL_PORT` | `8000` | Internal port for Content Service |

### **📧 Communication Services**

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `NOTIFICATION_SERVICE_CONTAINER_NAME` | `statex_notification_dev` | Notification Service container name |
| `NOTIFICATION_SERVICE_EXTERNAL_PORT` | `8005` | External port for Notification Service |
| `NOTIFICATION_SERVICE_INTERNAL_PORT` | `8005` | Internal port for Notification Service |

### **📊 Monitoring & Observability**

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `PROMETHEUS_CONTAINER_NAME` | `statex_prometheus_dev` | Prometheus container name |
| `PROMETHEUS_EXTERNAL_PORT` | `9090` | External port for Prometheus |
| `PROMETHEUS_INTERNAL_PORT` | `9090` | Internal port for Prometheus |
| `GRAFANA_CONTAINER_NAME` | `statex_grafana_dev` | Grafana container name |
| `GRAFANA_EXTERNAL_PORT` | `3002` | External port for Grafana |
| `GRAFANA_INTERNAL_PORT` | `3000` | Internal port for Grafana |
| `LOKI_CONTAINER_NAME` | `statex_loki_dev` | Loki container name |
| `LOKI_EXTERNAL_PORT` | `3102` | External port for Loki |
| `LOKI_INTERNAL_PORT` | `3100` | Internal port for Loki |
| `LOKI_UI_CONTAINER_NAME` | `statex_loki_ui_dev` | Loki UI container name |
| `LOKI_UI_EXTERNAL_PORT` | `3100` | External port for Loki UI |
| `LOKI_UI_INTERNAL_PORT` | `80` | Internal port for Loki UI |
| `JAEGER_CONTAINER_NAME` | `statex_jaeger_dev` | Jaeger container name |
| `JAEGER_EXTERNAL_PORT` | `16686` | External port for Jaeger |
| `JAEGER_INTERNAL_PORT` | `16686` | Internal port for Jaeger |
| `JAEGER_COLLECTOR_CONTAINER_NAME` | `statex_jaeger_dev` | Jaeger Collector container name |
| `JAEGER_COLLECTOR_EXTERNAL_PORT` | `14268` | External port for Jaeger Collector |
| `JAEGER_COLLECTOR_INTERNAL_PORT` | `14268` | Internal port for Jaeger Collector |
| `ALERTMANAGER_CONTAINER_NAME` | `statex_alertmanager_dev` | AlertManager container name |
| `ALERTMANAGER_EXTERNAL_PORT` | `9093` | External port for AlertManager |
| `ALERTMANAGER_INTERNAL_PORT` | `9093` | Internal port for AlertManager |
| `NODE_EXPORTER_CONTAINER_NAME` | `statex_node_exporter_dev` | Node Exporter container name |
| `NODE_EXPORTER_EXTERNAL_PORT` | `9100` | External port for Node Exporter |
| `NODE_EXPORTER_INTERNAL_PORT` | `9100` | Internal port for Node Exporter |
| `CADVISOR_CONTAINER_NAME` | `statex_cadvisor_dev` | cAdvisor container name |
| `CADVISOR_EXTERNAL_PORT` | `8081` | External port for cAdvisor |
| `CADVISOR_INTERNAL_PORT` | `8080` | Internal port for cAdvisor |
| `BLACKBOX_EXPORTER_CONTAINER_NAME` | `statex_blackbox_dev` | Blackbox Exporter container name |
| `BLACKBOX_EXPORTER_EXTERNAL_PORT` | `9115` | External port for Blackbox Exporter |
| `BLACKBOX_EXPORTER_INTERNAL_PORT` | `9115` | Internal port for Blackbox Exporter |
| `MONITORING_SERVICE_CONTAINER_NAME` | `statex_monitoring_service_dev` | Monitoring Service container name |
| `MONITORING_SERVICE_EXTERNAL_PORT` | `8007` | External port for Monitoring Service |
| `MONITORING_SERVICE_INTERNAL_PORT` | `8000` | Internal port for Monitoring Service |
| `LOGGING_SERVICE_CONTAINER_NAME` | `statex_logging_service_dev` | Logging Service container name |
| `LOGGING_SERVICE_EXTERNAL_PORT` | `8008` | External port for Logging Service |
| `LOGGING_SERVICE_INTERNAL_PORT` | `8000` | Internal port for Logging Service |

### **🗄️ Infrastructure Services**

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `POSTGRES_CONTAINER_NAME` | `statex_postgres_dev` | PostgreSQL container name |
| `POSTGRES_EXTERNAL_PORT` | `5432` | External port for PostgreSQL |
| `POSTGRES_INTERNAL_PORT` | `5432` | Internal port for PostgreSQL |
| `REDIS_CONTAINER_NAME` | `statex_redis_dev` | Redis container name |
| `REDIS_EXTERNAL_PORT` | `6379` | External port for Redis |
| `REDIS_INTERNAL_PORT` | `6379` | Internal port for Redis |
| `RABBITMQ_CONTAINER_NAME` | `statex_rabbitmq_dev` | RabbitMQ container name |
| `RABBITMQ_EXTERNAL_PORT` | `5672` | External port for RabbitMQ |
| `RABBITMQ_INTERNAL_PORT` | `5672` | Internal port for RabbitMQ |
| `RABBITMQ_MANAGEMENT_EXTERNAL_PORT` | `15672` | External port for RabbitMQ Management |
| `RABBITMQ_MANAGEMENT_INTERNAL_PORT` | `15672` | Internal port for RabbitMQ Management |
| `MINIO_CONTAINER_NAME` | `statex_minio_dev` | MinIO container name |
| `MINIO_EXTERNAL_PORT` | `9000` | External port for MinIO |
| `MINIO_INTERNAL_PORT` | `9000` | Internal port for MinIO |
| `MINIO_CONSOLE_EXTERNAL_PORT` | `9001` | External port for MinIO Console |
| `MINIO_CONSOLE_INTERNAL_PORT` | `9001` | Internal port for MinIO Console |
| `ELASTICSEARCH_CONTAINER_NAME` | `statex_elasticsearch_dev` | Elasticsearch container name |
| `ELASTICSEARCH_EXTERNAL_PORT` | `9200` | External port for Elasticsearch |
| `ELASTICSEARCH_INTERNAL_PORT` | `9200` | Internal port for Elasticsearch |
| `ELASTICSEARCH_TRANSPORT_EXTERNAL_PORT` | `9300` | External port for Elasticsearch Transport |
| `ELASTICSEARCH_TRANSPORT_INTERNAL_PORT` | `9300` | Internal port for Elasticsearch Transport |
| `NGINX_CONTAINER_NAME` | `statex_nginx_dev` | Nginx container name |
| `NGINX_EXTERNAL_PORT` | `80` | External port for Nginx |
| `NGINX_INTERNAL_PORT` | `80` | Internal port for Nginx |
| `NGINX_HTTPS_EXTERNAL_PORT` | `443` | External port for Nginx HTTPS |
| `NGINX_HTTPS_INTERNAL_PORT` | `443` | Internal port for Nginx HTTPS |
| `OLLAMA_CONTAINER_NAME` | `statex_ollama_dev` | Ollama container name |
| `OLLAMA_EXTERNAL_PORT` | `11434` | External port for Ollama |
| `OLLAMA_INTERNAL_PORT` | `11434` | Internal port for Ollama |

### **🌐 DNS Services**

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `DNS_SERVICE_CONTAINER_NAME` | `statex-dns-service` | DNS Service container name |
| `DNS_SERVICE_EXTERNAL_PORT` | `8053` | External port for DNS Service |
| `DNS_SERVICE_INTERNAL_PORT` | `8053` | Internal port for DNS Service |
| `DNS_SERVER_EXTERNAL_PORT` | `5353` | External port for DNS Server |
| `DNS_SERVER_INTERNAL_PORT` | `5353` | Internal port for DNS Server |

## **🔧 Usage Examples**

### **Docker Compose Files**

```yaml
services:
  api-gateway:
    container_name: ${API_GATEWAY_CONTAINER_NAME:-statex_api_gateway_dev}
    ports:
      - "${API_GATEWAY_EXTERNAL_PORT:-8001}:${API_GATEWAY_INTERNAL_PORT:-80}"
```

### **Health Check Scripts**

```bash
# Check AI Orchestrator health
curl http://localhost:${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}/health

# Check all services
for port in ${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010} ${NLP_SERVICE_EXTERNAL_PORT:-8011} ${ASR_SERVICE_EXTERNAL_PORT:-8012}; do
  echo "Port $port: $(curl -s http://localhost:$port/health | jq -r '.status // "DOWN"')"
done
```

### **Service Management Scripts**

```bash
# Get container name for service
case "$service_name" in
  "ai-orchestrator") container_name="${AI_ORCHESTRATOR_CONTAINER_NAME:-statex_ai_orchestrator_dev}" ;;
  "nlp-service") container_name="${NLP_SERVICE_CONTAINER_NAME:-statex_nlp_dev}" ;;
esac
```

## **📁 Files Updated**

The following files have been updated to use environment variables:

### **Configuration Files**

- `statex-platform/services-registry.conf`
- `statex-platform/Makefile`
- `statex-platform/scripts/health-check.sh`
- `statex-platform/scripts/dev-manage.sh`

### **Docker Compose Files**

- `statex-platform/docker-compose.dev.yml`
- `statex-platform/docker-compose.yml`
- `statex-ai/docker-compose.dev.yml`
- `statex-website/docker-compose.dev.yml`
- `statex-website/docker-compose.yml`
- `statex-notification-service/docker-compose.dev.yml`
- `statex-notification-service/docker-compose.yml`
- `statex-dns-service/docker-compose.yml`
- `statex-infrastructure/docker-compose.dev.yml`
- `statex-monitoring/docker-compose.dev.yml`
- `statex-monitoring/docker-compose.yml`

### **Documentation Files**

- `statex-platform/docs/quick-reference.md`
- `statex-platform/docs/development-commands.md`
- `statex-platform/docs/DEPLOYMENT_SUMMARY.md`

### **Scripts**

- `scripts/start-dev-all.sh`
- `scripts/start-dev-parallel.sh`
- `scripts/stop-dev-all.sh`

## **🚀 Benefits**

### **1. Consistency**

- All services use the same environment variable naming convention
- Consistent port assignments across all configuration files
- Unified approach to service configuration

### **2. Maintainability**

- Easy to change ports by updating environment variables
- No need to search and replace hardcoded values
- Centralized configuration management

### **3. Flexibility**

- Different environments can use different ports
- Easy to run multiple instances with different configurations
- Simplified deployment and testing

### **4. Documentation**

- All documentation now reflects the actual configuration
- Environment variables are clearly documented
- Easy to understand service relationships

## **🔍 Verification**

### **Check Environment Variables**

```bash
# List all environment variables
env | grep -E "(API_GATEWAY|AI_ORCHESTRATOR|SUBMISSION_SERVICE|NOTIFICATION_SERVICE)"

# Check specific service
echo "AI Orchestrator: ${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}"
echo "Submission Service: ${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}"
```

### **Test Service URLs**

```bash
# Test with environment variables
curl http://localhost:${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}/health
curl http://localhost:${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}/health
curl http://localhost:${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}/health
```

## **📚 Related Documentation**

- [Comprehensive Hardcoded Values Migration](./COMPREHENSIVE_HARDCODED_VALUES_MIGRATION.md)
- [Port Corrections Summary](./PORT_CORRECTIONS_SUMMARY.md)
- [Core Platform Services Migration](./CORE_PLATFORM_SERVICES_ENV_MIGRATION.md)
- [Notification & DNS Services Migration](./NOTIFICATION_DNS_SERVICES_ENV_MIGRATION.md)
- [Website & Infrastructure Services Migration](./WEBSITE_INFRASTRUCTURE_SERVICES_ENV_MIGRATION.md)

---

**Last Updated**: September 29, 2025  
**Version**: 1.0.0  
**Maintainer**: StateX Development Team
