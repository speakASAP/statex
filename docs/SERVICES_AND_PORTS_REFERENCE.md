# StateX Services & Ports Reference

This document provides a comprehensive reference for all StateX microservices, their ports, and communication patterns.

## **🌐 Core Platform Services**

| Service | Container Name | External Port | Internal Port | Purpose |
|---------|----------------|---------------|---------------|---------|
| **API Gateway** | `statex_api_gateway_dev` | `8001` | `80` | Central routing for all services |
| **Platform Management** | `statex_platform_management_dev` | `8000` | `8000` | Central orchestration hub |

## **🤖 AI Services**

| Service | Container Name | External Port | Internal Port | Purpose |
|---------|----------------|---------------|---------------|---------|
| **AI Orchestrator** | `statex_ai_orchestrator_dev` | `8010` | `8000` | Central AI coordination |
| **NLP Service** | `statex_nlp_dev` | `8011` | `8000` | Text analysis and generation |
| **ASR Service** | `statex_asr_dev` | `8012` | `8000` | Speech-to-text conversion |
| **Document AI** | `statex_document_ai_dev` | `8013` | `8000` | Document processing |
| **Prototype Generator** | `statex_prototype_generator_dev` | `8014` | `8000` | Website prototype creation |
| **Template Repository** | `statex_template_repo_dev` | `8015` | `8000` | Template management |
| **Free AI Service** | `statex_free_ai_dev` | `8016` | `8000` | Free AI operations |
| **AI Workers** | `statex_ai_workers_dev` | `8017` | `8000` | Background AI processing |

## **🌍 Website Services**

| Service | Container Name | External Port | Internal Port | Purpose |
|---------|----------------|---------------|---------------|---------|
| **Frontend** | `statex_frontend_dev` | `3000` | `3000` | Next.js React application |
| **Submission Service** | `statex_submission_dev` | `8002` | `8000` | Form submission processing |
| **User Portal** | `statex_user_portal_dev` | `8006` | `8000` | User management portal |
| **Content Service** | `statex_content_dev` | `8009` | `8000` | Content management |

## **📧 Communication Services**

| Service | Container Name | External Port | Internal Port | Purpose |
|---------|----------------|---------------|---------------|---------|
| **Notification Service** | `statex_notification_dev` | `8005` | `8005` | Multi-channel notifications |

## **📊 Monitoring & Observability**

| Service | Container Name | External Port | Internal Port | Purpose |
|---------|----------------|---------------|---------------|---------|
| **Prometheus** | `statex_prometheus_dev` | `9090` | `9090` | Metrics collection |
| **Grafana** | `statex_grafana_dev` | `3002` | `3000` | Dashboards & visualization |
| **Loki** | `statex_loki_dev` | `3102` | `3100` | Log aggregation |
| **Loki UI** | `statex_loki_ui_dev` | `3100` | `80` | Log viewing interface |
| **Jaeger** | `statex_jaeger_dev` | `16686` | `16686` | Distributed tracing |
| **Jaeger Collector** | `statex_jaeger_dev` | `14268` | `14268` | Trace collection |
| **Alertmanager** | `statex_alertmanager_dev` | `9093` | `9093` | Alert management |
| **Node Exporter** | `statex_node_exporter_dev` | `9100` | `9100` | System metrics |
| **cAdvisor** | `statex_cadvisor_dev` | `8081` | `8080` | Container metrics |
| **Blackbox Exporter** | `statex_blackbox_dev` | `9115` | `9115` | Blackbox monitoring |
| **Monitoring Service** | `statex_monitoring_dev` | `8007` | `8000` | Custom StateX monitoring |
| **Logging Service** | `statex_logging_dev` | `8008` | `8000` | Centralized logging |

## **🗄️ Infrastructure Services**

| Service | Container Name | External Port | Internal Port | Purpose |
|---------|----------------|---------------|---------------|---------|
| **PostgreSQL** | `statex_postgres_dev` | `5432` | `5432` | Primary database |
| **Redis** | `statex_redis_dev` | `6379` | `6379` | Caching & sessions |
| **RabbitMQ** | `statex_rabbitmq_dev` | `5672` | `5672` | Message queue |
| **RabbitMQ Management** | `statex_rabbitmq_dev` | `15672` | `15672` | Queue management UI |
| **MinIO** | `statex_minio_dev` | `9000` | `9000` | Object storage API |
| **MinIO Console** | `statex_minio_dev` | `9001` | `9001` | Storage management UI |
| **Nginx** | `statex_nginx_dev` | `80` | `80` | Reverse proxy |
| **Nginx HTTPS** | `statex_nginx_dev` | `443` | `443` | SSL termination |
| **Elasticsearch** | `statex_elasticsearch_dev` | `9200` | `9200` | Search engine |
| **Elasticsearch Transport** | `statex_elasticsearch_dev` | `9300` | `9300` | Cluster communication |
| **Ollama** | `statex_ollama_dev` | `11434` | `11434` | Local AI models |

## **🌐 DNS Services**

| Service | Container Name | External Port | Internal Port | Purpose |
|---------|----------------|---------------|---------------|---------|
| **DNS Service** | `statex-dns-service` | `8053` | `8053` | HTTP API |
| **DNS Server** | `statex-dns-service` | `5353` | `5353` | DNS server (UDP/TCP) |

## **🔗 Service Communication**

### **Internal Docker Network Communication:**

- **AI Orchestrator**: `http://ai-orchestrator:8000` (internal)
- **External Access**: `http://localhost:8010` (external)

### **Key Service URLs:**

- **Frontend**: <http://localhost:3000>
- **API Gateway**: <http://localhost:8001>
- **Platform Management**: <http://localhost:8000>
- **AI Orchestrator**: <http://localhost:8010>
- **Submission Service**: <http://localhost:8002>
- **Notification Service**: <http://localhost:8005>
- **User Portal**: <http://localhost:8006>
- **Monitoring Service**: <http://localhost:8007>
- **Logging Service**: <http://localhost:8008>
- **Content Service**: <http://localhost:8009>

### **Monitoring URLs:**

- **Grafana**: <http://localhost:3002> (admin/statex123)
- **Prometheus**: <http://localhost:9090>
- **Jaeger**: <http://localhost:16686>
- **Loki UI**: <http://localhost:3100>

### **Infrastructure URLs:**

- **RabbitMQ Management**: <http://localhost:15672>
- **MinIO Console**: <http://localhost:9001>
- **Elasticsearch**: <http://localhost:9200>

## **🚀 Quick Start Commands**

### **Start All Services:**

```bash
# Start infrastructure first
cd statex-infrastructure && docker compose -f docker-compose.dev.yml up -d

# Start AI services
cd ../statex-ai && docker compose -f docker-compose.dev.yml up -d

# Start website services
cd ../statex-website && docker compose -f docker-compose.dev.yml up -d

# Start platform services
cd ../statex-platform && docker compose -f docker-compose.dev.yml up -d

# Start monitoring
cd ../statex-monitoring && docker compose -f docker-compose.dev.yml up -d

# Start notifications
cd ../statex-notification-service && docker compose -f docker-compose.dev.yml up -d
```

### **Check Service Status:**

```bash
# Check all running containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check specific service logs
docker logs statex_ai_orchestrator_dev --tail 20

# Check service health
curl http://localhost:8010/health
```

### **Service Health Checks:**

```bash
# Core services
curl http://localhost:8000/health  # Platform Management
curl http://localhost:8010/health  # AI Orchestrator
curl http://localhost:8002/health  # Submission Service

# AI services
curl http://localhost:8011/health  # NLP Service
curl http://localhost:8012/health  # ASR Service
curl http://localhost:8014/health  # Prototype Generator

# Monitoring
curl http://localhost:9090/-/healthy  # Prometheus
curl http://localhost:3002/api/health  # Grafana
```

## **🔧 Environment Variables**

### **Key Environment Variables:**

```bash
# AI Orchestrator URL (used across all services)
AI_ORCHESTRATOR_URL=http://ai-orchestrator:8000

# Database
DATABASE_URL=postgresql://statex:statex_password@host.docker.internal:5432/statex

# Cache
REDIS_URL=redis://host.docker.internal:6379

# Message Queue
RABBITMQ_URL=amqp://statex:statex_password@host.docker.internal:5672

# Object Storage
S3_ENDPOINT=http://host.docker.internal:9000
S3_ACCESS_KEY=statex
S3_SECRET_KEY=statex_password
```

## **📋 Port Ranges**

### **Service Port Ranges:**

- **8000-8009**: Core platform services
- **8010-8019**: AI services
- **3000-3009**: Frontend and UI services
- **9000-9009**: Infrastructure services
- **5000-5999**: Monitoring and observability
- **10000+**: External integrations

### **Reserved Ports:**

- **80/443**: Nginx reverse proxy
- **5432**: PostgreSQL
- **6379**: Redis
- **5672**: RabbitMQ
- **9200**: Elasticsearch

## **🛠️ Troubleshooting**

### **Common Issues:**

1. **Port Conflicts:**

   ```bash
   # Check if port is in use
   lsof -i :8010
   
   # Kill process using port
   sudo kill -9 $(lsof -t -i:8010)
   ```

2. **Service Not Starting:**

   ```bash
   # Check container logs
   docker logs statex_ai_orchestrator_dev
   
   # Check container status
   docker ps -a | grep statex
   ```

3. **Network Connectivity:**

   ```bash
   # Test internal network connectivity
   docker exec statex_submission_dev curl http://ai-orchestrator:8000/health
   
   # Check Docker network
   docker network inspect statex_network
   ```

### **Service Dependencies:**

1. **Infrastructure** (PostgreSQL, Redis, RabbitMQ, MinIO)
2. **AI Services** (AI Orchestrator, NLP, ASR, etc.)
3. **Platform Services** (Submission, Notification, etc.)
4. **Frontend** (React application)
5. **Monitoring** (Prometheus, Grafana, etc.)

## **📚 Related Documentation**

- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Troubleshooting Runbook](./TROUBLESHOOTING_RUNBOOK.md)
- [Development Guide](./development/DEVELOPMENT_OPTIMIZATION.md)

---

**Last Updated**: September 29, 2025  
**Version**: 2.0.0  
**Maintainer**: StateX Development Team
