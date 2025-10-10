# Deployment and Infrastructure Guide

## Overview

This document provides comprehensive guidance for deploying the Statex platform microservices architecture. It covers local development, staging, and production environments using Docker, Kubernetes, and cloud infrastructure.

## Infrastructure Architecture

### Production Environment
- **Kubernetes Cluster**: Managed Kubernetes service (EKS, GKE, AKS) with auto-scaling
- **Load Balancer**: Cloud load balancer with SSL termination and health checks
- **CDN**: Content delivery network for static assets with global distribution
- **Database**: PostgreSQL deployed as StatefulSet with persistent volumes
- **Object Storage**: MinIO deployed as StatefulSet with persistent storage
- **Message Broker**: RabbitMQ deployed as StatefulSet with clustering
- **Cache**: Redis deployed as StatefulSet with clustering
- **Search Engine**: Elasticsearch deployed as StatefulSet with clustering
- **Monitoring**: Prometheus, Grafana, Loki, Jaeger all containerized
- **Logging**: Centralized logging with ELK stack containerized
- **Infrastructure as Code**: All infrastructure deployed via Kubernetes manifests
- **Zero Manual Intervention**: Fully automated deployment and scaling

### Staging Environment
- **Kubernetes Cluster**: Smaller cluster for testing
- **Database**: Single PostgreSQL instance
- **Object Storage**: S3-compatible storage
- **Message Broker**: Single message broker instance
- **Monitoring**: Basic monitoring setup

### Development Environment
- **Docker Compose**: Local development with all services
- **Database**: Local PostgreSQL instance
- **Object Storage**: Local MinIO instance
- **Message Broker**: Local RabbitMQ instance
- **Monitoring**: Basic monitoring setup

## Prerequisites

### System Requirements
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **kubectl**: Version 1.21 or higher
- **Helm**: Version 3.0 or higher
- **Git**: Version 2.0 or higher

### Cloud Requirements
- **Kubernetes Cluster**: 3+ nodes with 4+ CPU cores and 8+ GB RAM each
- **Storage**: Persistent volumes for databases and logs
- **Network**: VPC with proper security groups
- **DNS**: Domain name and DNS configuration
- **SSL**: SSL certificates for HTTPS

## Local Development Setup

### Docker Compose Configuration

#### docker-compose.yml
```yaml
services:
  # Database
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: statex
      POSTGRES_USER: statex
      POSTGRES_PASSWORD: statex_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U statex"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Message Broker
  rabbitmq:
    image: rabbitmq:3-management
    environment:
      RABBITMQ_DEFAULT_USER: statex
      RABBITMQ_DEFAULT_PASS: statex_password
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Object Storage
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: statex
      MINIO_ROOT_PASSWORD: statex_password
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 10s
      timeout: 5s
      retries: 5

  # User Portal
  user-portal:
    build: ./services/user-portal
    ports:
      - "8001:8000"
    environment:
      - DATABASE_URL=postgresql://statex:statex_password@postgres:5432/statex
      - REDIS_URL=redis://redis:6379/0
      - BROKER_URL=amqp://statex:statex_password@rabbitmq:5672
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  # Submission Service
  submission-service:
    build: ./services/submission-service
    ports:
      - "8002:8000"
    environment:
      - DATABASE_URL=postgresql://statex:statex_password@postgres:5432/statex
      - REDIS_URL=redis://redis:6379/1
      - BROKER_URL=amqp://statex:statex_password@rabbitmq:5672
      - S3_ENDPOINT=http://minio:9000
      - S3_ACCESS_KEY=statex
      - S3_SECRET_KEY=statex_password
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
      minio:
        condition: service_healthy

  # AI Orchestrator
  ai-orchestrator:
    build: ./services/ai-orchestrator
    ports:
      - "8003:8000"
    environment:
      - DATABASE_URL=postgresql://statex:statex_password@postgres:5432/statex
      - REDIS_URL=redis://redis:6379/2
      - BROKER_URL=amqp://statex:statex_password@rabbitmq:5672
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  # AI Workers
  ai-workers:
    build: ./services/ai-workers
    ports:
      - "8004:8000"
    environment:
      - DATABASE_URL=postgresql://statex:statex_password@postgres:5432/statex
      - REDIS_URL=redis://redis:6379/3
      - BROKER_URL=amqp://statex:statex_password@rabbitmq:5672
      - S3_ENDPOINT=http://minio:9000
      - S3_ACCESS_KEY=statex
      - S3_SECRET_KEY=statex_password
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
      minio:
        condition: service_healthy

  # Notification Service
  notification-service:
    build: ./services/notification-service
    ports:
      - "8005:8000"
    environment:
      - DATABASE_URL=postgresql://statex:statex_password@postgres:5432/statex
      - REDIS_URL=redis://redis:6379/4
      - BROKER_URL=amqp://statex:statex_password@rabbitmq:5672
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  # Content Service
  content-service:
    build: ./services/content-service
    ports:
      - "8006:8000"
    environment:
      - DATABASE_URL=postgresql://statex:statex_password@postgres:5432/statex
      - REDIS_URL=redis://redis:6379/5
      - BROKER_URL=amqp://statex:statex_password@rabbitmq:5672
      - S3_ENDPOINT=http://minio:9000
      - S3_ACCESS_KEY=statex
      - S3_SECRET_KEY=statex_password
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
      minio:
        condition: service_healthy

  # Logging Service
  logging-service:
    build: ./services/logging-service
    ports:
      - "8007:8000"
    environment:
      - DATABASE_URL=postgresql://statex:statex_password@postgres:5432/statex
      - REDIS_URL=redis://redis:6379/6
      - BROKER_URL=amqp://statex:statex_password@rabbitmq:5672
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  # Monitoring
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'

  grafana:
    image: grafana/grafana
    ports:
      - "${FRONTEND_PORT:-3000}:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/var/lib/grafana/dashboards
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
  minio_data:
  prometheus_data:
  grafana_data:
```

### Environment Configuration

#### .env.development
```bash
# Environment
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=DEBUG

# Database
DATABASE_URL=postgresql://statex:statex_password@localhost:5432/statex
DATABASE_POOL_SIZE=5
DATABASE_MAX_OVERFLOW=10

# Redis
REDIS_URL=redis://localhost:6379
REDIS_POOL_SIZE=5

# Message Broker
BROKER_URL=amqp://statex:statex_password@localhost:5672
BROKER_TOPIC=statex
BROKER_RETRY_ATTEMPTS=3
BROKER_RETRY_DELAY=1000

# Object Storage
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=statex-dev
S3_ACCESS_KEY=statex
S3_SECRET_KEY=statex_password
S3_REGION=us-east-1

# Security
JWT_SECRET_KEY=dev-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_LIFETIME=900
JWT_REFRESH_TOKEN_LIFETIME=604800

# Monitoring
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090
GRAFANA_URL=http://localhost:${GRAFANA_PORT:-3000}
```

### Local Development Commands

#### Start Development Environment
```bash
# Clone repository
git clone https://github.com/statex/platform.git
cd platform

# Copy environment file
cp .env.development .env

# Start all services
docker-compose up -d

# Check service health
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose stop -v
```

#### Database Management
```bash
# Run migrations
docker-compose exec user-portal python manage.py migrate

# Create superuser
docker-compose exec user-portal python manage.py createsuperuser

# Access database
docker-compose exec postgres psql -U statex -d statex
```

## Infrastructure Services

### Infrastructure as Code (IaC)

All infrastructure services are deployed as containerized services via Kubernetes with zero manual intervention required.

#### Infrastructure Services Overview
```yaml
# Infrastructure services deployed via Kubernetes
infrastructure_services:
  database:
    service: postgresql
    type: StatefulSet
    replicas: 3
    storage: persistent_volume
    clustering: true
    backup: automated
  
  message_broker:
    service: rabbitmq
    type: StatefulSet
    replicas: 3
    storage: persistent_volume
    clustering: true
    management: enabled
  
  cache:
    service: redis
    type: StatefulSet
    replicas: 3
    storage: persistent_volume
    clustering: true
    persistence: enabled
  
  object_storage:
    service: minio
    type: StatefulSet
    replicas: 4
    storage: persistent_volume
    clustering: true
    distributed: true
  
  search_engine:
    service: elasticsearch
    type: StatefulSet
    replicas: 3
    storage: persistent_volume
    clustering: true
    master_nodes: 3
  
  monitoring:
    prometheus:
      type: StatefulSet
      storage: persistent_volume
    grafana:
      type: Deployment
      storage: persistent_volume
    loki:
      type: StatefulSet
      storage: persistent_volume
    jaeger:
      type: StatefulSet
      storage: persistent_volume
  
  email_services:
    smtp_server:
      service: postfix
      type: StatefulSet
      replicas: 2
      storage: persistent_volume
      clustering: true
    imap_server:
      service: dovecot
      type: StatefulSet
      replicas: 2
      storage: persistent_volume
      clustering: true
    webmail_panel:
      service: roundcube
      type: Deployment
      replicas: 2
      storage: persistent_volume
      web_interface: true
    email_management:
      service: mailcow
      type: Deployment
      replicas: 1
      storage: persistent_volume
      admin_panel: true
```

### Database Infrastructure

#### PostgreSQL StatefulSet
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgresql
  namespace: statex-infrastructure
spec:
  serviceName: postgresql
  replicas: 3
  selector:
    matchLabels:
      app: postgresql
  template:
    metadata:
      labels:
        app: postgresql
    spec:
      containers:
      - name: postgresql
        image: postgres:15
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: statex
        - name: POSTGRES_USER
          value: statex
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        - name: PGDATA
          value: /var/lib/postgresql/data/pgdata
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - statex
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - statex
          initialDelaySeconds: 5
          periodSeconds: 5
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi
      storageClassName: fast-ssd

---
apiVersion: v1
kind: Service
metadata:
  name: postgresql
  namespace: statex-infrastructure
spec:
  clusterIP: None
  selector:
    app: postgresql
  ports:
  - port: 5432
    targetPort: 5432
```

### Message Broker Infrastructure

#### RabbitMQ StatefulSet
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: rabbitmq
  namespace: statex-infrastructure
spec:
  serviceName: rabbitmq
  replicas: 3
  selector:
    matchLabels:
      app: rabbitmq
  template:
    metadata:
      labels:
        app: rabbitmq
    spec:
      containers:
      - name: rabbitmq
        image: rabbitmq:3-management
        ports:
        - containerPort: 5672
          name: amqp
        - containerPort: 15672
          name: management
        env:
        - name: RABBITMQ_ERLANG_COOKIE
          valueFrom:
            secretKeyRef:
              name: rabbitmq-secret
              key: erlang-cookie
        - name: RABBITMQ_DEFAULT_USER
          value: statex
        - name: RABBITMQ_DEFAULT_PASS
          valueFrom:
            secretKeyRef:
              name: rabbitmq-secret
              key: password
        - name: RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS
          value: "-rabbit cluster_formation.peer_discovery_backend rabbit_peer_discovery_k8s"
        - name: K8S_SERVICE_NAME
          value: rabbitmq
        - name: K8S_HOSTNAME_SUFFIX
          value: .rabbitmq.statex-infrastructure.svc.cluster.local
        volumeMounts:
        - name: rabbitmq-storage
          mountPath: /var/lib/rabbitmq
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          exec:
            command:
            - rabbitmq-diagnostics
            - ping
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          exec:
            command:
            - rabbitmq-diagnostics
            - check_port_connectivity
          initialDelaySeconds: 20
          periodSeconds: 10
  volumeClaimTemplates:
  - metadata:
      name: rabbitmq-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 50Gi
      storageClassName: fast-ssd

---
apiVersion: v1
kind: Service
metadata:
  name: rabbitmq
  namespace: statex-infrastructure
spec:
  clusterIP: None
  selector:
    app: rabbitmq
  ports:
  - port: 5672
    targetPort: 5672
    name: amqp
  - port: 15672
    targetPort: 15672
    name: management
```

### Cache Infrastructure

#### Redis StatefulSet
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: statex-infrastructure
spec:
  serviceName: redis
  replicas: 3
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        command:
        - redis-server
        - /etc/redis/redis.conf
        - --cluster-enabled
        - "yes"
        - --cluster-config-file
        - /data/nodes.conf
        - --cluster-node-timeout
        - "5000"
        - --appendonly
        - "yes"
        volumeMounts:
        - name: redis-storage
          mountPath: /data
        - name: redis-config
          mountPath: /etc/redis
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          exec:
            command:
            - redis-cli
            - ping
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - redis-cli
            - ping
          initialDelaySeconds: 5
          periodSeconds: 5
  volumeClaimTemplates:
  - metadata:
      name: redis-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 20Gi
      storageClassName: fast-ssd

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-config
  namespace: statex-infrastructure
data:
  redis.conf: |
    cluster-enabled yes
    cluster-config-file /data/nodes.conf
    cluster-node-timeout 5000
    appendonly yes
    appendfsync everysec
```

### Object Storage Infrastructure

#### MinIO StatefulSet
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: minio
  namespace: statex-infrastructure
spec:
  serviceName: minio
  replicas: 4
  selector:
    matchLabels:
      app: minio
  template:
    metadata:
      labels:
        app: minio
    spec:
      containers:
      - name: minio
        image: minio/minio:latest
        ports:
        - containerPort: 9000
          name: api
        - containerPort: 9001
          name: console
        command:
        - server
        - /data
        - --console-address
        - ":9001"
        env:
        - name: MINIO_ROOT_USER
          value: statex
        - name: MINIO_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: minio-secret
              key: password
        - name: MINIO_DISTRIBUTED_MODE_ENABLED
          value: "yes"
        - name: MINIO_DISTRIBUTED_NODES
          value: "minio-0,minio-1,minio-2,minio-3"
        volumeMounts:
        - name: minio-storage
          mountPath: /data
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /minio/health/live
            port: 9000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /minio/health/ready
            port: 9000
          initialDelaySeconds: 5
          periodSeconds: 5
  volumeClaimTemplates:
  - metadata:
      name: minio-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi
      storageClassName: fast-ssd

---
apiVersion: v1
kind: Service
metadata:
  name: minio
  namespace: statex-infrastructure
spec:
  clusterIP: None
  selector:
    app: minio
  ports:
  - port: 9000
    targetPort: 9000
    name: api
  - port: 9001
    targetPort: 9001
    name: console
```

### Search Engine Infrastructure

#### Elasticsearch StatefulSet
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
  namespace: statex-infrastructure
spec:
  serviceName: elasticsearch
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
      - name: elasticsearch
        image: elasticsearch:8.11.0
        ports:
        - containerPort: 9200
          name: http
        - containerPort: 9300
          name: transport
        env:
        - name: cluster.name
          value: statex-cluster
        - name: node.name
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: discovery.seed_hosts
          value: elasticsearch-0.elasticsearch.statex-infrastructure.svc.cluster.local,elasticsearch-1.elasticsearch.statex-infrastructure.svc.cluster.local,elasticsearch-2.elasticsearch.statex-infrastructure.svc.cluster.local
        - name: cluster.initial_master_nodes
          value: elasticsearch-0,elasticsearch-1,elasticsearch-2
        - name: ES_JAVA_OPTS
          value: "-Xms2g -Xmx2g"
        - name: xpack.security.enabled
          value: "false"
        volumeMounts:
        - name: elasticsearch-storage
          mountPath: /usr/share/elasticsearch/data
        resources:
          requests:
            memory: "4Gi"
            cpu: "1000m"
          limits:
            memory: "8Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /_cluster/health
            port: 9200
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /_cluster/health
            port: 9200
          initialDelaySeconds: 30
          periodSeconds: 10
  volumeClaimTemplates:
  - metadata:
      name: elasticsearch-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi
      storageClassName: fast-ssd

---
apiVersion: v1
kind: Service
metadata:
  name: elasticsearch
  namespace: statex-infrastructure
spec:
  clusterIP: None
  selector:
    app: elasticsearch
  ports:
  - port: 9200
    targetPort: 9200
    name: http
  - port: 9300
    targetPort: 9300
    name: transport
```

### Email Services Infrastructure

#### SMTP Server (Postfix)
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postfix
  namespace: statex-infrastructure
spec:
  serviceName: postfix
  replicas: 2
  selector:
    matchLabels:
      app: postfix
  template:
    metadata:
      labels:
        app: postfix
    spec:
      containers:
      - name: postfix
        image: catatnight/postfix:latest
        ports:
        - containerPort: 25
          name: smtp
        - containerPort: 587
          name: submission
        env:
        - name: maildomain
          value: statex.cz
        - name: smtp_user
          value: contact@statex.cz
        - name: smtp_pass
          valueFrom:
            secretKeyRef:
              name: postfix-secret
              key: password
        volumeMounts:
        - name: postfix-storage
          mountPath: /var/spool/postfix
        - name: postfix-config
          mountPath: /etc/postfix
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          exec:
            command:
            - postfix
            - status
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          exec:
            command:
            - postfix
            - status
          initialDelaySeconds: 10
          periodSeconds: 10
  volumeClaimTemplates:
  - metadata:
      name: postfix-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 20Gi
      storageClassName: fast-ssd

---
apiVersion: v1
kind: Service
metadata:
  name: postfix
  namespace: statex-infrastructure
spec:
  clusterIP: None
  selector:
    app: postfix
  ports:
  - port: 25
    targetPort: 25
    name: smtp
  - port: 587
    targetPort: 587
    name: submission
```

#### IMAP Server (Dovecot)
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: dovecot
  namespace: statex-infrastructure
spec:
  serviceName: dovecot
  replicas: 2
  selector:
    matchLabels:
      app: dovecot
  template:
    metadata:
      labels:
        app: dovecot
    spec:
      containers:
      - name: dovecot
        image: dovecot/dovecot:latest
        ports:
        - containerPort: 143
          name: imap
        - containerPort: 993
          name: imaps
        env:
        - name: DOVECOT_DB
          value: postgresql://statex:password@postgresql:5432/statex
        volumeMounts:
        - name: dovecot-storage
          mountPath: /var/mail
        - name: dovecot-config
          mountPath: /etc/dovecot
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          exec:
            command:
            - doveadm
            - status
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          exec:
            command:
            - doveadm
            - status
          initialDelaySeconds: 10
          periodSeconds: 10
  volumeClaimTemplates:
  - metadata:
      name: dovecot-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 50Gi
      storageClassName: fast-ssd

---
apiVersion: v1
kind: Service
metadata:
  name: dovecot
  namespace: statex-infrastructure
spec:
  clusterIP: None
  selector:
    app: dovecot
  ports:
  - port: 143
    targetPort: 143
    name: imap
  - port: 993
    targetPort: 993
    name: imaps
```

#### Webmail Panel (Roundcube)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: roundcube
  namespace: statex-infrastructure
spec:
  replicas: 2
  selector:
    matchLabels:
      app: roundcube
  template:
    metadata:
      labels:
        app: roundcube
    spec:
      containers:
      - name: roundcube
        image: roundcube/roundcubemail:latest
        ports:
        - containerPort: 80
        env:
        - name: ROUNDCUBEMAIL_DB_TYPE
          value: postgres
        - name: ROUNDCUBEMAIL_DB_HOST
          value: postgresql
        - name: ROUNDCUBEMAIL_DB_NAME
          value: roundcube
        - name: ROUNDCUBEMAIL_DB_USER
          value: roundcube
        - name: ROUNDCUBEMAIL_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: roundcube-secret
              key: password
        - name: ROUNDCUBEMAIL_DEFAULT_HOST
          value: dovecot
        - name: ROUNDCUBEMAIL_DEFAULT_PORT
          value: "143"
        - name: ROUNDCUBEMAIL_SMTP_SERVER
          value: postfix
        - name: ROUNDCUBEMAIL_SMTP_PORT
          value: "587"
        volumeMounts:
        - name: roundcube-storage
          mountPath: /var/www/html
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
  volumeClaimTemplates:
  - metadata:
      name: roundcube-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
      storageClassName: fast-ssd

---
apiVersion: v1
kind: Service
metadata:
  name: roundcube
  namespace: statex-infrastructure
spec:
  selector:
    app: roundcube
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

#### Email Management Panel (Mailcow)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mailcow
  namespace: statex-infrastructure
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mailcow
  template:
    metadata:
      labels:
        app: mailcow
    spec:
      containers:
      - name: mailcow
        image: mailcow/mailcow:latest
        ports:
        - containerPort: 80
          name: http
        - containerPort: 443
          name: https
        env:
        - name: MAILCOW_HOSTNAME
          value: mail.statex.cz
        - name: MAILCOW_DB
          value: postgresql://statex:password@postgresql:5432/statex
        volumeMounts:
        - name: mailcow-storage
          mountPath: /var/lib/mailcow
        - name: mailcow-config
          mountPath: /etc/mailcow
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
            port: 80
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /ready
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
  volumeClaimTemplates:
  - metadata:
      name: mailcow-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi
      storageClassName: fast-ssd

---
apiVersion: v1
kind: Service
metadata:
  name: mailcow
  namespace: statex-infrastructure
spec:
  selector:
    app: mailcow
  ports:
  - port: 80
    targetPort: 80
    name: http
  - port: 443
    targetPort: 443
    name: https
  type: ClusterIP
```

### Email Configuration

#### Email Routing Configuration
```yaml
# email-routing.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: email-routing
  namespace: statex-infrastructure
data:
  postfix-main.cf: |
    # Basic configuration
    myhostname = mail.statex.cz
    mydomain = statex.cz
    myorigin = $mydomain
    inet_interfaces = all
    inet_protocols = ipv4
    
    # Authentication
    smtpd_sasl_auth_enable = yes
    smtpd_sasl_type = cyrus
    smtpd_sasl_path = smtpd
    smtpd_sasl_security_options = noanonymous
    smtpd_sasl_local_domain = $myhostname
    smtpd_sasl_authenticated_header = yes
    
    # TLS
    smtpd_tls_security_level = may
    smtpd_tls_auth_only = no
    smtpd_tls_cert_file = /etc/ssl/certs/ssl-cert-snakeoil.pem
    smtpd_tls_key_file = /etc/ssl/private/ssl-cert-snakeoil.key
    smtpd_tls_received_header = yes
    smtpd_tls_session_cache_timeout = 3600s
    tls_random_source = dev:/dev/urandom
    
    # Relay configuration
    relayhost = [smtp.gmail.com]:587
    smtp_sasl_auth_enable = yes
    smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
    smtp_sasl_security_options = noanonymous
    smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
    smtp_use_tls = yes
    
    # Mailbox configuration
    home_mailbox = Maildir/
    mailbox_command = 
    
    # Security
    smtpd_recipient_restrictions = 
        permit_mynetworks,
        permit_sasl_authenticated,
        reject_unauth_destination
```

#### Notification Service Integration
```yaml
# notification-service-email.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: notification-service
  namespace: statex-services
spec:
  replicas: 2
  selector:
    matchLabels:
      app: notification-service
  template:
    metadata:
      labels:
        app: notification-service
    spec:
      containers:
      - name: notification-service
        image: statex/notification-service:latest
        ports:
        - containerPort: 8000
        env:
        - name: SMTP_HOST
          value: postfix.statex-infrastructure.svc.cluster.local
        - name: SMTP_PORT
          value: "587"
        - name: SMTP_USER
          value: contact@statex.cz
        - name: SMTP_PASSWORD
          valueFrom:
            secretKeyRef:
              name: smtp-secret
              key: password
        - name: IMAP_HOST
          value: dovecot.statex-infrastructure.svc.cluster.local
        - name: IMAP_PORT
          value: "143"
        - name: IMAP_USER
          value: contact@statex.cz
        - name: IMAP_PASSWORD
          valueFrom:
            secretKeyRef:
              name: imap-secret
              key: password
        - name: COMPANY_EMAIL
          value: contact@statex.cz
        - name: WEBMAIL_URL
          value: https://mail.statex.cz
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

## Kubernetes Deployment

### Cluster Configuration

#### cluster-config.yaml
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: statex
  labels:
    name: statex
    environment: production

---
apiVersion: v1
kind: Secret
metadata:
  name: database-secret
  namespace: statex
type: Opaque
data:
  url: cG9zdGdyZXNxbDovL3N0YXRleDpzdGF0ZXhfcGFzc3dvcmRAcG9zdGdyZXM6NTQzMi9zdGF0ZXg=
  password: c3RhdGV4X3Bhc3N3b3Jk

---
apiVersion: v1
kind: Secret
metadata:
  name: redis-secret
  namespace: statex
type: Opaque
data:
  url: cmVkaXM6Ly9yZWRpczpzdGF0ZXhfcGFzc3dvcmRAbG9jYWxob3N0OjYzNzkvMA==

---
apiVersion: v1
kind: Secret
metadata:
  name: s3-secret
  namespace: statex
type: Opaque
data:
  access-key: c3RhdGV4
  secret-key: c3RhdGV4X3Bhc3N3b3Jk

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: statex
data:
  ENVIRONMENT: "production"
  LOG_LEVEL: "INFO"
  BROKER_URL: "amqp://statex:statex_password@rabbitmq:5672"
  S3_ENDPOINT: "https://s3.amazonaws.com"
  S3_BUCKET: "statex-prod"
  S3_REGION: "us-east-1"
```

### Service Deployments

#### user-portal-deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-portal
  namespace: statex
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-portal
  template:
    metadata:
      labels:
        app: user-portal
    spec:
      containers:
      - name: user-portal
        image: statex/user-portal:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
        - name: BROKER_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: BROKER_URL
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: user-portal-service
  namespace: statex
spec:
  selector:
    app: user-portal
  ports:
  - port: 8000
    targetPort: 8000
  type: ClusterIP
```

### Ingress Configuration

#### ingress.yaml
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: statex-ingress
  namespace: statex
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - api.statex.cz
    - portal.statex.cz
    - static.statex.cz
    secretName: statex-tls
  rules:
  - host: api.statex.cz
    http:
      paths:
      - path: /api/users
        pathType: Prefix
        backend:
          service:
            name: user-portal-service
            port:
              number: 8000
      - path: /api/submissions
        pathType: Prefix
        backend:
          service:
            name: submission-service
            port:
              number: 8000
      - path: /api/notifications
        pathType: Prefix
        backend:
          service:
            name: notification-service
            port:
              number: 8000
  - host: portal.statex.cz
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: user-portal-service
            port:
              number: 8000
  - host: static.statex.cz
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: content-service
            port:
              number: 8000
```

### Helm Charts

#### Chart.yaml
```yaml
apiVersion: v2
name: statex-platform
description: Statex Platform Microservices
type: application
version: 1.0.0
appVersion: "1.0.0"
dependencies:
- name: postgresql
  version: 12.1.2
  repository: https://charts.bitnami.com/bitnami
  condition: postgresql.enabled
- name: redis
  version: 17.3.7
  repository: https://charts.bitnami.com/bitnami
  condition: redis.enabled
- name: rabbitmq
  version: 11.1.3
  repository: https://charts.bitnami.com/bitnami
  condition: rabbitmq.enabled
```

#### values.yaml
```yaml
# Global configuration
global:
  environment: production
  domain: statex.cz
  imageRegistry: ghcr.io/statex
  imageTag: latest

# Service configurations
userPortal:
  enabled: true
  replicaCount: 3
  image:
    repository: user-portal
    tag: latest
  service:
    type: ClusterIP
    port: 8000
  resources:
    requests:
      memory: "512Mi"
      cpu: "250m"
    limits:
      memory: "1Gi"
      cpu: "500m"

submissionService:
  enabled: true
  replicaCount: 3
  image:
    repository: submission-service
    tag: latest
  service:
    type: ClusterIP
    port: 8000
  resources:
    requests:
      memory: "512Mi"
      cpu: "250m"
    limits:
      memory: "1Gi"
      cpu: "500m"

# Database configuration
postgresql:
  enabled: true
  auth:
    postgresPassword: statex_password
    database: statex
  primary:
    persistence:
      enabled: true
      size: 20Gi
    resources:
      requests:
        memory: "1Gi"
        cpu: "500m"
      limits:
        memory: "2Gi"
        cpu: "1000m"

# Redis configuration
redis:
  enabled: true
  auth:
    enabled: true
    password: statex_password
  master:
    persistence:
      enabled: true
      size: 10Gi
    resources:
      requests:
        memory: "512Mi"
        cpu: "250m"
      limits:
        memory: "1Gi"
        cpu: "500m"

# RabbitMQ configuration
rabbitmq:
  enabled: true
  auth:
    username: statex
    password: statex_password
  persistence:
    enabled: true
    size: 10Gi
  resources:
    requests:
      memory: "512Mi"
      cpu: "250m"
    limits:
      memory: "1Gi"
      cpu: "500m"

# Ingress configuration
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
  hosts:
  - host: api.statex.cz
    paths:
    - path: /
      pathType: Prefix
  - host: portal.statex.cz
    paths:
    - path: /
      pathType: Prefix
  tls:
  - secretName: statex-tls
    hosts:
    - api.statex.cz
    - portal.statex.cz
```

## CI/CD Pipeline

### GitHub Actions Workflow

#### .github/workflows/deploy.yml
```yaml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: statex

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.13'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        pytest tests/ --cov=app --cov-report=xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push images
      run: |
        for service in user-portal submission-service ai-orchestrator ai-workers notification-service content-service logging-service; do
          docker buildx build \
            --platform linux/amd64,linux/arm64 \
            --push \
            --tag ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/$service:${{ github.sha }} \
            --tag ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/$service:latest \
            ./services/$service/
        done

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'v1.21.0'
    
    - name: Configure kubectl
      run: |
        echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
        export KUBECONFIG=kubeconfig
    
    - name: Deploy to Kubernetes
      run: |
        helm upgrade --install statex-platform ./helm/statex-platform \
          --namespace statex \
          --create-namespace \
          --set global.imageTag=${{ github.sha }} \
          --set global.environment=production
```

### Dockerfile Template

#### services/service-name/Dockerfile
```dockerfile
FROM python:3.13-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Production stage
FROM python:3.13-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from builder
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Zero Manual Intervention

### Infrastructure as Code (IaC) Automation

All infrastructure services are deployed automatically via Kubernetes with zero manual intervention required. The system supports:

- **Automatic Scaling**: Horizontal Pod Autoscaler (HPA) for all services
- **Self-Healing**: Automatic pod restarts and failover
- **Rolling Updates**: Zero-downtime deployments
- **Health Monitoring**: Automatic health checks and recovery
- **Backup Automation**: Automated database and storage backups
- **SSL Certificate Management**: Automatic Let's Encrypt certificate renewal
- **Service Discovery**: Automatic service registration and discovery

### Automated Deployment Pipeline

#### GitOps Workflow
```yaml
# .github/workflows/deploy-infrastructure.yml
name: Deploy Infrastructure
on:
  push:
    branches: [main]
    paths: ['infrastructure/**']
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  deploy-infrastructure:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'
          
      - name: Deploy Infrastructure
        run: |
          # Deploy infrastructure services
          kubectl apply -f infrastructure/namespaces/
          kubectl apply -f infrastructure/secrets/
          kubectl apply -f infrastructure/configmaps/
          kubectl apply -f infrastructure/postgresql/
          kubectl apply -f infrastructure/rabbitmq/
          kubectl apply -f infrastructure/redis/
          kubectl apply -f infrastructure/minio/
          kubectl apply -f infrastructure/elasticsearch/
          kubectl apply -f infrastructure/email-services/
          kubectl apply -f infrastructure/monitoring/
          
      - name: Wait for Services
        run: |
          kubectl wait --for=condition=ready pod -l app=postgresql --timeout=300s
          kubectl wait --for=condition=ready pod -l app=rabbitmq --timeout=300s
          kubectl wait --for=condition=ready pod -l app=redis --timeout=300s
          kubectl wait --for=condition=ready pod -l app=minio --timeout=300s
          
      - name: Health Check
        run: |
          ./scripts/health-check.sh
          
      - name: Notify Success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: 'Infrastructure deployed successfully'
          
      - name: Notify Failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          text: 'Infrastructure deployment failed'
```

### Automated Scaling Configuration

#### Horizontal Pod Autoscaler
```yaml
# infrastructure/hpa/postgresql-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: postgresql-hpa
  namespace: statex-infrastructure
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: StatefulSet
    name: postgresql
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

### Automated Backup and Recovery

#### Database Backup Automation
```yaml
# infrastructure/backup/postgresql-backup.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgresql-backup
  namespace: statex-infrastructure
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: postgresql-backup
            image: postgres:15
            command:
            - /bin/bash
            - -c
            - |
              # Create backup
              pg_dump -h postgresql -U statex -d statex > /backup/statex-$(date +%Y%m%d_%H%M%S).sql
              
              # Upload to MinIO
              mc alias set minio http://minio:9000 $MINIO_ACCESS_KEY $MINIO_SECRET_KEY
              mc cp /backup/*.sql minio/backups/postgresql/
              
              # Cleanup old backups (keep 30 days)
              find /backup -name "*.sql" -mtime +30 -delete
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: password
            - name: MINIO_ACCESS_KEY
              valueFrom:
                secretKeyRef:
                  name: minio-secret
                  key: access-key
            - name: MINIO_SECRET_KEY
              valueFrom:
                secretKeyRef:
                  name: minio-secret
                  key: secret-key
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-storage
          restartPolicy: OnFailure
```

### Automated SSL Certificate Management

#### Let's Encrypt Integration
```yaml
# infrastructure/ssl/cert-manager.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@statex.cz
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: statex-tls
  namespace: statex-infrastructure
spec:
  secretName: statex-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - statex.cz
  - www.statex.cz
  - api.statex.cz
  - mail.statex.cz
  - admin.statex.cz
```

## Monitoring and Observability

### Prometheus Configuration

#### monitoring/prometheus.yml
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
      action: replace
      target_label: __metrics_path__
      regex: (.+)
    - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
      action: replace
      regex: ([^:]+)(?::\d+)?;(\d+)
      replacement: $1:$2
      target_label: __address__
    - action: labelmap
      regex: __meta_kubernetes_pod_label_(.+)
    - source_labels: [__meta_kubernetes_namespace]
      action: replace
      target_label: kubernetes_namespace
    - source_labels: [__meta_kubernetes_pod_name]
      action: replace
      target_label: kubernetes_pod_name

  - job_name: 'kubernetes-services'
    kubernetes_sd_configs:
    - role: service
    relabel_configs:
    - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
      action: keep
      regex: true
    - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scheme]
      action: replace
      target_label: __scheme__
      regex: (https?)
    - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
      action: replace
      target_label: __metrics_path__
      regex: (.+)
    - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
      action: replace
      regex: ([^:]+)(?::\d+)?;(\d+)
      replacement: $1:$2
      target_label: __address__
    - action: labelmap
      regex: __meta_kubernetes_service_label_(.+)
    - source_labels: [__meta_kubernetes_namespace]
      action: replace
      target_label: kubernetes_namespace
    - source_labels: [__meta_kubernetes_service_name]
      action: replace
      target_label: kubernetes_service_name
```

### Grafana Dashboards

#### monitoring/grafana/dashboards/overview.json
```json
{
  "dashboard": {
    "id": null,
    "title": "Statex Platform Overview",
    "tags": ["statex", "overview"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "id": 2,
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "id": 3,
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "{{service}}"
          }
        ]
      }
    ]
  }
}
```

## Security Configuration

### Network Policies

#### network-policies.yaml
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: statex-network-policy
  namespace: statex
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: statex
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: statex
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
  - to: []
    ports:
    - protocol: TCP
      port: 443
```

### Pod Security Policies

#### pod-security-policy.yaml
```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: statex-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
```

## Backup and Recovery

### Database Backup

#### backup-script.sh
```bash
#!/bin/bash

# Database backup script
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="statex_backup_${DATE}.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
kubectl exec -n statex postgres-0 -- pg_dump -U statex statex > $BACKUP_DIR/$BACKUP_FILE

# Compress backup
gzip $BACKUP_DIR/$BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_DIR/${BACKUP_FILE}.gz s3://statex-backups/postgres/

# Clean up old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

### Disaster Recovery

#### disaster-recovery.md
```markdown
# Disaster Recovery Procedures

## Database Recovery
1. Stop all services
2. Restore database from backup
3. Run database migrations
4. Start services in order

## Service Recovery
1. Check service health
2. Restart failed services
3. Verify service connectivity
4. Check logs for errors

## Full Platform Recovery
1. Restore infrastructure
2. Restore database
3. Deploy services
4. Verify functionality
5. Update DNS records
```

## Troubleshooting

### Common Issues

#### Service Not Starting
```bash
# Check pod status
kubectl get pods -n statex

# Check pod logs
kubectl logs -n statex <pod-name>

# Check pod events
kubectl describe pod -n statex <pod-name>
```

#### Database Connection Issues
```bash
# Check database status
kubectl exec -n statex postgres-0 -- pg_isready -U statex

# Check database logs
kubectl logs -n statex postgres-0

# Test database connection
kubectl exec -n statex postgres-0 -- psql -U statex -d statex -c "SELECT 1"
```

#### Service Communication Issues
```bash
# Check service endpoints
kubectl get endpoints -n statex

# Test service connectivity
kubectl exec -n statex <pod-name> -- curl http://service-name:8000/health

# Check network policies
kubectl get networkpolicies -n statex
```

### Debug Commands

#### Service Debug
```bash
# Get service details
kubectl get svc -n statex -o wide

# Check service logs
kubectl logs -n statex -l app=service-name

# Port forward for local access
kubectl port-forward -n statex svc/service-name 8000:8000
```

#### Database Debug
```bash
# Access database shell
kubectl exec -n statex postgres-0 -- psql -U statex -d statex

# Check database size
kubectl exec -n statex postgres-0 -- psql -U statex -d statex -c "SELECT pg_size_pretty(pg_database_size('statex'));"

# Check active connections
kubectl exec -n statex postgres-0 -- psql -U statex -d statex -c "SELECT * FROM pg_stat_activity;"
```

## Performance Optimization

### Resource Optimization

#### Resource Requests and Limits
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

#### Horizontal Pod Autoscaling
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-portal-hpa
  namespace: statex
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-portal
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Database Optimization

#### Connection Pooling
```yaml
env:
- name: DATABASE_POOL_SIZE
  value: "10"
- name: DATABASE_MAX_OVERFLOW
  value: "20"
```

#### Read Replicas
```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-read
  namespace: statex
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  type: ClusterIP
```

## Maintenance

### Rolling Updates

#### Update Strategy
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 1
    maxSurge: 1
```

#### Blue-Green Deployment
```bash
# Deploy new version
kubectl apply -f new-version.yaml

# Switch traffic
kubectl patch service user-portal-service -p '{"spec":{"selector":{"version":"v2"}}}'

# Verify new version
kubectl get pods -l app=user-portal

# Rollback if needed
kubectl patch service user-portal-service -p '{"spec":{"selector":{"version":"v1"}}}'
```

### Monitoring and Alerting

#### Alert Rules
```yaml
groups:
- name: statex.rules
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value }} errors per second"
  
  - alert: HighMemoryUsage
    expr: (container_memory_usage_bytes / container_spec_memory_limit_bytes) > 0.8
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High memory usage detected"
      description: "Memory usage is {{ $value }}% of limit"
```

This comprehensive deployment guide provides everything needed to deploy and maintain the Statex platform in various environments, from local development to production Kubernetes clusters.
