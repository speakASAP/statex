# StateX Platform - Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the StateX Platform to production. The deployment separates the web server (for the existing website) from the application server (for microservices).

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Server    │    │  Application    │    │  Infrastructure │
│   (statex.cz)   │    │     Server      │    │    Services     │
│                 │    │                 │    │                 │
│  - Nginx        │    │  - API Gateway  │    │  - PostgreSQL   │
│  - Static Site  │    │  - Microservices│    │  - Redis        │
│  - SSL/TLS      │    │  - Load Balancer│    │  - RabbitMQ     │
│                 │    │                 │    │  - MinIO        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

### Server Requirements

#### Web Server (statex.cz)
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **CPU**: 2+ cores
- **RAM**: 4+ GB
- **Storage**: 50+ GB SSD
- **Network**: Public IP with domain pointing to it

#### Application Server (api.statex.cz)
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **CPU**: 8+ cores
- **RAM**: 16+ GB
- **Storage**: 200+ GB SSD
- **Network**: Private network access to web server

### Software Requirements
- Docker 20.10+
- Docker Compose 2.0+
- Git
- Nginx (for web server)
- SSL certificates (Let's Encrypt)

## Deployment Steps

### Step 1: Web Server Setup (statex.cz)

#### 1.1 Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx git certbot python3-certbot-nginx

# Create application directory
sudo mkdir -p /var/www/statex
sudo chown $USER:$USER /var/www/statex
cd /var/www/statex
```

#### 1.2 Clone and Setup Website
```bash
# Clone the existing website repository
git clone https://github.com/speakASAP/statex.git website

# Set up Nginx configuration
sudo tee /etc/nginx/sites-available/statex.cz > /dev/null <<EOF
server {
    listen 80;
    server_name statex.cz www.statex.cz;
    
    root /var/www/statex/website;
    index index.html index.htm;
    
    location / {
        try_files \$uri \$uri/ =404;
    }
    
    # API proxy to application server
    location /api/ {
        proxy_pass http://api.statex.cz;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/statex.cz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 1.3 SSL Certificate Setup
```bash
# Get SSL certificate
sudo certbot --nginx -d statex.cz -d www.statex.cz

# Test certificate renewal
sudo certbot renew --dry-run
```

### Step 2: Application Server Setup (api.statex.cz)

#### 2.1 Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /opt/statex-platform
cd /opt/statex-platform
```

#### 2.2 Clone and Setup Platform
```bash
# Clone the platform repository
git clone https://github.com/speakASAP/statex-platform.git .

# Set up environment
cp env.example .env
nano .env  # Update with production values
```

#### 2.3 Production Environment Configuration
```bash
# Update .env for production
cat > .env <<EOF
# Environment
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql://statex:$(openssl rand -base64 32)@postgres:5432/statex
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=30

# Redis
REDIS_URL=redis://redis:6379
REDIS_POOL_SIZE=20

# Message Broker
BROKER_URL=amqp://statex:$(openssl rand -base64 32)@rabbitmq:5672
BROKER_TOPIC=statex

# Object Storage
S3_ENDPOINT=http://minio:9000
S3_BUCKET=statex-prod
S3_ACCESS_KEY=statex
S3_SECRET_KEY=$(openssl rand -base64 32)
S3_REGION=us-east-1

# Security
JWT_SECRET_KEY=$(openssl rand -base64 64)
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_LIFETIME=900
JWT_REFRESH_TOKEN_LIFETIME=604800

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=StateX Platform
CORS_ORIGINS=["https://statex.cz", "https://www.statex.cz"]

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=txt,pdf,doc,docx,jpg,jpeg,png,mp3,wav,mp4,zip
UPLOAD_PATH=/app/storage
EOF
```

#### 2.4 Deploy Application
```bash
# Build and start services
docker-compose up -d

# Wait for services to be ready
sleep 60

# Run health check
./scripts/health-check.sh

# Check logs
docker-compose logs -f
```

### Step 3: Nginx Configuration for Application Server

#### 3.1 Install and Configure Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/api.statex.cz > /dev/null <<EOF
upstream statex_api {
    server localhost:8001;
    server localhost:8002;
    server localhost:8003;
    server localhost:8004;
    server localhost:8005;
    server localhost:8006;
    server localhost:8007;
}

server {
    listen 80;
    server_name api.statex.cz;
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # API routes
    location / {
        proxy_pass http://statex_api;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/api.statex.cz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3.2 SSL Certificate for API Server
```bash
# Get SSL certificate
sudo certbot --nginx -d api.statex.cz

# Test certificate renewal
sudo certbot renew --dry-run
```

### Step 4: Monitoring and Logging Setup

#### 4.1 Configure Prometheus
```bash
# Create Prometheus configuration
mkdir -p observability/prometheus
cat > observability/prometheus/prometheus.yml <<EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'statex-services'
    static_configs:
      - targets: ['submission-service:8000', 'user-portal:8000', 'ai-orchestrator:8000']
    metrics_path: /metrics
    scrape_interval: 5s
EOF
```

#### 4.2 Configure Grafana
```bash
# Create Grafana configuration
mkdir -p observability/grafana/dashboards
mkdir -p observability/grafana/provisioning/dashboards
mkdir -p observability/grafana/provisioning/datasources

# Create datasource configuration
cat > observability/grafana/provisioning/datasources/prometheus.yml <<EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF
```

### Step 5: Database Setup and Migration

#### 5.1 Initialize Database
```bash
# Run database migrations
docker-compose exec user-portal python manage.py migrate
docker-compose exec submission-service python -m alembic upgrade head

# Create superuser
docker-compose exec user-portal python manage.py createsuperuser

# Load initial data
docker-compose exec user-portal python manage.py loaddata fixtures/initial_data.json
```

#### 5.2 Backup Configuration
```bash
# Create backup script
cat > scripts/backup.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/opt/statex-platform/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
docker-compose exec -T postgres pg_dump -U statex statex > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
EOF

chmod +x scripts/backup.sh

# Set up cron job for daily backups
echo "0 2 * * * /opt/statex-platform/scripts/backup.sh" | sudo crontab -
```

### Step 6: Security Hardening

#### 6.1 Firewall Configuration
```bash
# Install UFW
sudo apt install -y ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

#### 6.2 SSL/TLS Hardening
```bash
# Update Nginx SSL configuration
sudo tee -a /etc/nginx/sites-available/api.statex.cz > /dev/null <<EOF

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
EOF
```

### Step 7: Monitoring and Alerting

#### 7.1 Set up Log Rotation
```bash
# Configure logrotate
sudo tee /etc/logrotate.d/statex-platform > /dev/null <<EOF
/opt/statex-platform/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF
```

#### 7.2 Health Monitoring
```bash
# Create health check script
cat > scripts/health-monitor.sh <<'EOF'
#!/bin/bash
LOG_FILE="/opt/statex-platform/logs/health-monitor.log"

check_service() {
    local service=$1
    local url=$2
    
    if curl -s -f "$url" > /dev/null; then
        echo "$(date): $service is healthy" >> $LOG_FILE
        return 0
    else
        echo "$(date): $service is DOWN" >> $LOG_FILE
        # Send alert (implement your alerting mechanism)
        return 1
    fi
}

check_service "API Gateway" "https://api.statex.cz/health"
check_service "Submission Service" "https://api.statex.cz/api/submissions/health"
EOF

chmod +x scripts/health-monitor.sh

# Set up cron job for health monitoring
echo "*/5 * * * * /opt/statex-platform/scripts/health-monitor.sh" | sudo crontab -
```

## Post-Deployment Verification

### 1. Service Health Checks
```bash
# Check all services
curl https://api.statex.cz/health
curl https://api.statex.cz/api/submissions/health
curl https://statex.cz

# Check monitoring
curl http://api.statex.cz:9090/-/healthy  # Prometheus
curl http://api.statex.cz:3000/api/health  # Grafana
```

### 2. Test Form Submission
```bash
# Test form submission
curl -X POST https://api.statex.cz/api/submissions/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "user_name": "Test User",
    "request_type": "general",
    "description": "Test submission"
  }'
```

### 3. Monitor Logs
```bash
# View application logs
docker-compose logs -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Maintenance and Updates

### 1. Application Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Run health check
./scripts/health-check.sh
```

### 2. Database Maintenance
```bash
# Run database migrations
docker-compose exec user-portal python manage.py migrate

# Create backup before major changes
./scripts/backup.sh
```

### 3. SSL Certificate Renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Manual renewal if needed
sudo certbot renew
sudo systemctl reload nginx
```

## Troubleshooting

### Common Issues

#### 1. Services Not Starting
```bash
# Check Docker status
docker-compose ps

# Check logs
docker-compose logs [service-name]

# Restart specific service
docker-compose restart [service-name]
```

#### 2. Database Connection Issues
```bash
# Check database status
docker-compose exec postgres pg_isready -U statex

# Check database logs
docker-compose logs postgres
```

#### 3. Nginx Issues
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# Reload Nginx
sudo systemctl reload nginx
```

## Security Considerations

1. **Regular Updates**: Keep all packages and Docker images updated
2. **Backup Strategy**: Implement regular automated backups
3. **Monitoring**: Set up comprehensive monitoring and alerting
4. **Access Control**: Use strong passwords and SSH keys
5. **SSL/TLS**: Keep SSL certificates updated
6. **Firewall**: Configure proper firewall rules
7. **Logs**: Monitor logs for suspicious activity

## Performance Optimization

1. **Caching**: Implement Redis caching for frequently accessed data
2. **CDN**: Use CDN for static content delivery
3. **Load Balancing**: Configure proper load balancing
4. **Database Optimization**: Optimize database queries and indexes
5. **Resource Monitoring**: Monitor CPU, memory, and disk usage

This deployment guide provides a comprehensive approach to deploying the StateX Platform in production with proper separation of concerns between the web server and application server.
