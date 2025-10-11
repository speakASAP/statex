# Docker Production Guide

## 🎯 Overview

This guide provides detailed information about the **Docker-first production architecture** used in the StateX project. All services run in Docker containers, ensuring consistency, scalability, and easy maintenance.

## 📋 Table of Contents

- [Container Architecture](#-container-architecture)
- [Docker Compose Configuration](#-docker-compose-configuration)
- [Production Dockerfiles](#-production-dockerfiles)
- [Container Management](#-container-management)
- [Health Checks](#-health-checks)
- [Logging & Monitoring](#-logging--monitoring)
- [Backup & Recovery](#-backup--recovery)
- [Security](#-security)
- [Performance Optimization](#-performance-optimization)
- [Troubleshooting](#-troubleshooting)

## 🐳 Container Architecture

### Service Overview

The production environment consists of 8 main containers using **pre-built Docker Hub images** with **environment-driven configuration**:

| Service | Container Name | Image | Port | Purpose |
|---------|----------------|-------|------|---------|
| **Frontend** | `${VIRTUAL_HOST}` | `node:18-alpine` | `${FRONTEND_PORT:-3000}` | Next.js application |
| **Backend** | `api.${VIRTUAL_HOST}` | `node:18-alpine` | `${BACKEND_PORT:-4000}` | Node.js API |
| **Database** | `${VIRTUAL_HOST}_postgres_prod` | `postgres:15-alpine` | 5432 | PostgreSQL database |
| **Cache** | `${VIRTUAL_HOST}_redis_prod` | `redis:7-alpine` | 6379 | Redis cache |
| **Nginx** | `${VIRTUAL_HOST}_nginx` | `nginx:alpine` | `${NGINX_HTTP_PORT:-80}/${NGINX_HTTPS_PORT:-443}` | Reverse proxy & SSL |
| **Mailserver** | `${VIRTUAL_HOST}_mailserver` | `mailserver/docker-mailserver:latest` | 25/143/465/587/993/995 | Self-hosted email |
| **Roundcube** | `${VIRTUAL_HOST}_roundcube` | `roundcube/roundcubemail:latest` | 80 | Webmail interface |
| **Certbot** | `${VIRTUAL_HOST}_letsencrypt` | `certbot/certbot` | - | SSL certificate management |

### Pre-built Image Benefits

**🚀 Rapid Deployment:**
- ✅ **Instant startup** - No build time required
- ✅ **Consistent environments** - Same images across all servers
- ✅ **Automatic updates** - Pull latest security patches anytime
- ✅ **Fast scaling** - Deploy to new servers in seconds
- ✅ **Reduced complexity** - No custom Dockerfile maintenance

**🔧 Zero Installation:**
- ✅ **Only Docker required** - No need to install Node.js, PostgreSQL, Redis, or Nginx
- ✅ **Pre-configured images** - All dependencies and tools included
- ✅ **Security optimized** - Official images with security best practices
- ✅ **Size optimized** - Alpine-based images for minimal footprint

### Network Architecture

```
Internet → Nginx (80/443) → Frontend (3000) / Backend (4000) / Mail (25/143/465/587/993/995)
                              ↓
                        Database (5432) / Redis (6379)
```

### Environment-Driven Configuration

**Single Source of Truth**: All configuration is driven by environment variables with centralized defaults:

- **Primary Variable**: `VIRTUAL_HOST` (e.g., `statex.cz`)
- **Default Configuration**: `config/defaults.env` contains all fallback values
- **Pattern**: `${VARIABLE:-${DEFAULT_VARIABLE}}` for all configuration values
- **No Hardcoded Values**: All domain names, container names, and ports use environment variables

## 🚀 Docker Compose Configuration

### Main Configuration File

**File**: `docker-compose.production.yml`

```yaml
services:
  # PostgreSQL Database (Pre-built image)
  postgres:
    image: postgres:15-alpine
    container_name: ${VIRTUAL_HOST}_postgres_prod
    restart: unless-stopped
    env_file:
      - ./config/defaults.env
    environment:
      POSTGRES_DB: ${DB_NAME:-${DEFAULT_DB_NAME}}
      POSTGRES_USER: ${DB_USER:-${DEFAULT_DB_USER}}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-${DEFAULT_DB_PASSWORD}}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - ${VIRTUAL_HOST}_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-${DEFAULT_DB_USER}} -d ${DB_NAME:-${DEFAULT_DB_NAME}}"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache (Pre-built image)
  redis:
    image: redis:7-alpine
    container_name: ${VIRTUAL_HOST}_redis_prod
    restart: unless-stopped
    env_file:
      - ./config/defaults.env
    command: ["redis-server", "--requirepass", "${REDIS_PASSWORD:-${DEFAULT_REDIS_PASSWORD}}"]
    environment:
      REDIS_PASSWORD: ${REDIS_PASSWORD:-${DEFAULT_REDIS_PASSWORD}}
    volumes:
      - redis_data:/data
    networks:
      - ${VIRTUAL_HOST}_network
    healthcheck:
      test: ["CMD-SHELL", "redis-cli -h 127.0.0.1 -p 6379 -a \"${REDIS_PASSWORD:-${DEFAULT_REDIS_PASSWORD}}\" ping | grep PONG"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  # Backend API (Pre-built Node.js image)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
      args:
        USER_UID: ${USER_UID:-${DEFAULT_USER_UID}}
    container_name: api.${VIRTUAL_HOST}
    restart: unless-stopped
    ports:
      - "${BACKEND_PORT:-${DEFAULT_BACKEND_PORT}}:4000"
    volumes:
      - ${UPLOAD_DIR:-./uploads}:/app/uploads
    env_file:
      - ./config/defaults.env
    environment:
      NODE_ENV: ${NODE_ENV}
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      DEBUG: ${DEBUG}
      BASE_URL: ${BASE_URL}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - ${VIRTUAL_HOST}_network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend Application (Pre-built Node.js image)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
      args:
        BUILD_DATE: ${BUILD_DATE:-${DEFAULT_BUILD_DATE}}
        PACKAGE_VERSION: ${PACKAGE_VERSION:-${DEFAULT_PACKAGE_VERSION}}
        USER_UID: ${USER_UID:-${DEFAULT_USER_UID}}
    container_name: ${VIRTUAL_HOST}
    restart: unless-stopped
    ports:
      - "${FRONTEND_PORT:-${DEFAULT_FRONTEND_PORT}}:3000"
    env_file:
      - ./config/defaults.env
    environment:
      NODE_ENV: ${NODE_ENV}
      NEXT_PUBLIC_BASE_URL: ${BASE_URL}
      NEXT_PUBLIC_API_URL: ${API_URL}
      DEBUG: ${DEBUG}
    command: ["npm", "start"]
    depends_on:
      - backend
    networks:
      - ${VIRTUAL_HOST}_network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:${FRONTEND_PORT:-3000}"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx Reverse Proxy (Pre-built image)
  nginx:
    image: nginx:alpine
    container_name: ${VIRTUAL_HOST}_nginx
    restart: unless-stopped
    ports:
      - "${NGINX_HTTP_PORT:-${DEFAULT_NGINX_HTTP_PORT}}:80"
      - "${NGINX_HTTPS_PORT:-${DEFAULT_NGINX_HTTPS_PORT}}:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/statex-reverse-proxy.conf:/etc/nginx/conf.d/statex.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
      - ./webroot:/var/www/html
    environment:
      - DEFAULT_HOST=${DEFAULT_HOST}
      - ALLOW_SELF_SIGNED=${ALLOW_SELF_SIGNED:-${DEFAULT_ALLOW_SELF_SIGNED}}
    env_file:
      - ./.env.nginx.production
      - ./config/defaults.env
    depends_on:
      - backend
      - frontend
    networks:
      - ${VIRTUAL_HOST}_network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Certbot for SSL (Pre-built image)
  certbot:
    image: certbot/certbot
    container_name: statex_certbot_prod
    volumes:
      - ./ssl:/etc/letsencrypt:rw
      - ./logs/certbot:/var/log/letsencrypt:rw
      - ./ssl/accounts:/var/lib/letsencrypt:rw
      - ./ssl/archive:/etc/letsencrypt/archive:rw
      - ./ssl/live:/etc/letsencrypt/live:rw
      - ./ssl/renewal:/etc/letsencrypt/renewal:rw
    command: certonly --webroot --webroot-path=/var/www/html --email admin@statex.cz --agree-tos --no-eff-email --keep-until-expiring -d statex.cz -d www.statex.cz -d api.statex.cz
    depends_on:
      - nginx
    networks:
      - app-network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  ${VIRTUAL_HOST}_ssl_data:
    driver: local
  ${VIRTUAL_HOST}_mailserver_data:
    driver: local
  ${VIRTUAL_HOST}_roundcube_data:
    driver: local

networks:
  ${VIRTUAL_HOST}_network:
    driver: bridge
```

## ⚙️ Environment Configuration System

### Single Source of Truth

The StateX production environment uses a **centralized configuration system** with environment variables as the single source of truth:

#### Primary Configuration Variable
```bash
# Main domain - controls all other naming
VIRTUAL_HOST=statex.cz
```

#### Default Configuration File
**File**: `config/defaults.env`
```bash
# Database Defaults
DEFAULT_DB_NAME=statex_production
DEFAULT_DB_USER=statex
DEFAULT_DB_PASSWORD=statexpass

# Redis Defaults
DEFAULT_REDIS_PASSWORD=

# Application Port Defaults
DEFAULT_FRONTEND_PORT=3000
DEFAULT_BACKEND_PORT=4000

# Nginx Defaults
DEFAULT_NGINX_HTTP_PORT=80
DEFAULT_NGINX_HTTPS_PORT=443

# SSL Defaults
DEFAULT_ALLOW_SELF_SIGNED=false

# Build Defaults
DEFAULT_BUILD_DATE=20250902-143000
DEFAULT_PACKAGE_VERSION=1.0.0
DEFAULT_USER_UID=1001
```

#### Configuration Pattern
All configuration values use the pattern: `${VARIABLE:-${DEFAULT_VARIABLE}}`

**Examples**:
- `${DB_PASSWORD:-${DEFAULT_DB_PASSWORD}}` → Uses `DB_PASSWORD` if set, otherwise `statexpass`
- `${FRONTEND_PORT:-${DEFAULT_FRONTEND_PORT}}` → Uses `FRONTEND_PORT` if set, otherwise `3000`
- `${VIRTUAL_HOST}` → Always required, no fallback

#### Auto-Generated Names
Based on `VIRTUAL_HOST=statex.cz`:

**Container Names**:
- Frontend: `statex.cz`
- Backend: `api.statex.cz`
- Database: `statex_postgres_prod`
- Redis: `statex_redis_prod`
- Nginx: `statex_nginx`
- Mailserver: `statex_mailserver`
- Roundcube: `statex_roundcube`
- Let's Encrypt: `statex_letsencrypt`

**Network Names**:
- Main Network: `statex_network`

**Volume Names**:
- SSL Data: `statex_ssl_data`
- Mailserver Data: `statex_mailserver_data`
- Roundcube Data: `statex_roundcube_data`

**Domain Names**:
- Main: `statex.cz`
- API: `api.statex.cz`
- Mail: `mail.statex.cz`
- WWW: `www.statex.cz`

### Benefits

1. **Single Source of Truth**: Only `VIRTUAL_HOST` needs to be changed to deploy to a different domain
2. **No Hardcoded Values**: All configuration is driven by environment variables with proper defaults
3. **Centralized Defaults**: All default values in one file (`config/defaults.env`)
4. **Environment Separation**: Different configurations for development and production
5. **Service Separation**: Each service has its own configuration file
6. **Consistency**: All naming follows the same pattern
7. **Portability**: Easy to deploy to different environments
8. **Maintainability**: Centralized configuration management
9. **Flexibility**: Override any default value by setting the corresponding environment variable

## 🔧 Production Dockerfiles

### Frontend Dockerfile

**File**: `frontend/Dockerfile.prod`

```dockerfile
# Frontend Production Dockerfile
FROM node:23-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:23-slim AS production

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${FRONTEND_PORT:-3000} || exit 1

# Start application
CMD ["node", "server.js"]
```

### Backend Dockerfile

**File**: `backend/Dockerfile.prod`

```dockerfile
# Backend Production Dockerfile
FROM node:23-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Production stage
FROM node:23-slim AS production

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start application
CMD ["npm", "start"]
```

## 🛠️ Container Management

### Rapid Deployment Commands

```bash
# Set environment variables
export VIRTUAL_HOST=statex.cz
export NODE_ENV=production

# Pull latest pre-built images and start instantly
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up -d

# Deploy to new server in seconds
git clone https://github.com/your-repo/statex.git
cd statex
export VIRTUAL_HOST=yourdomain.com
./scripts/switch_env.sh production
docker compose -f docker-compose.production.yml up -d

# Update all services instantly
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up -d

# Scale specific service
docker compose -f docker-compose.production.yml up -d --scale frontend=3

# Rollback to previous version
docker compose -f docker-compose.production.yml down
docker image tag ${VIRTUAL_HOST}:previous ${VIRTUAL_HOST}:latest
docker compose -f docker-compose.production.yml up -d
```

### Standard Management Commands

```bash
# Start specific service
docker compose -f docker-compose.production.yml up -d frontend

# Stop all containers
docker compose -f docker-compose.production.yml down

# Restart specific service
docker compose -f docker-compose.production.yml restart backend

# View logs
docker compose -f docker-compose.production.yml logs -f

# View logs for specific service
docker compose -f docker-compose.production.yml logs -f frontend
```

### Container Operations

```bash
# Check container status
docker compose -f docker-compose.production.yml ps

# Execute command in container
docker exec -it ${VIRTUAL_HOST} sh
docker exec -it api.${VIRTUAL_HOST} sh

# Copy files from/to container
docker cp ${VIRTUAL_HOST}:/app/logs ./local-logs
docker cp ./config.json api.${VIRTUAL_HOST}:/app/config.json

# View container resources
docker stats ${VIRTUAL_HOST} api.${VIRTUAL_HOST}
```

## 🔍 Health Checks

### Built-in Health Checks

All containers include health checks that monitor service availability:

```bash
# Check health status
docker compose -f docker-compose.production.yml ps

# Manual health check
docker exec ${VIRTUAL_HOST} curl -f http://localhost:${FRONTEND_PORT:-3000}
docker exec api.${VIRTUAL_HOST} curl -f http://localhost:4000/health
docker exec ${VIRTUAL_HOST}_postgres_prod pg_isready -U ${DB_USER:-${DEFAULT_DB_USER}} -d ${DB_NAME:-${DEFAULT_DB_NAME}}
docker exec ${VIRTUAL_HOST}_redis_prod redis-cli -a "${REDIS_PASSWORD:-${DEFAULT_REDIS_PASSWORD}}" ping
```

### Custom Health Check Script

```bash
#!/bin/bash
# health-check.sh

echo "=== StateX Production Health Check ==="
echo "Date: $(date)"
echo "Domain: ${VIRTUAL_HOST}"

# Check all containers
docker compose -f docker-compose.production.yml ps

# Test frontend
echo "Testing frontend..."
curl -I https://${VIRTUAL_HOST}

# Test backend
echo "Testing backend..."
curl -I https://api.${VIRTUAL_HOST}

# Test mail
echo "Testing mail..."
curl -I https://mail.${VIRTUAL_HOST}

# Test database
echo "Testing database..."
docker exec ${VIRTUAL_HOST}_postgres_prod pg_isready -U ${DB_USER:-${DEFAULT_DB_USER}} -d ${DB_NAME:-${DEFAULT_DB_NAME}}

# Test Redis
echo "Testing Redis..."
docker exec ${VIRTUAL_HOST}_redis_prod redis-cli -a "${REDIS_PASSWORD:-${DEFAULT_REDIS_PASSWORD}}" ping

echo "Health check completed"
```

## 📊 Logging & Monitoring

### Log Management

```bash
# View all logs
docker compose -f docker-compose.production.yml logs -f

# View specific service logs
docker compose -f docker-compose.production.yml logs -f frontend
docker compose -f docker-compose.production.yml logs -f backend

# View logs with timestamps
docker compose -f docker-compose.production.yml logs -f -t

# View last 100 lines
docker compose -f docker-compose.production.yml logs --tail=100
```

### Log Rotation

```bash
# Create log rotation configuration
sudo nano /etc/logrotate.d/docker-statex

# Add configuration
/home/statex/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 statex statex
    postrotate
        docker compose -f docker-compose.production.yml restart nginx
    endscript
}
```

## 💾 Backup & Recovery

### Database Backup

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/home/statex/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="statex_production"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database using Docker
docker exec statex_postgres_prod pg_dump -U statex_user $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Database backup completed: db_backup_$DATE.sql.gz"
```

### SSL Certificate Backup

```bash
#!/bin/bash
# backup-ssl.sh

BACKUP_DIR="/home/statex/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup SSL certificates and keys
tar -czf $BACKUP_DIR/ssl_backup_$DATE.tar.gz ssl/

# Keep only last 30 days of SSL backups
find $BACKUP_DIR -name "ssl_backup_*.tar.gz" -mtime +30 -delete

echo "SSL backup completed: ssl_backup_$DATE.tar.gz"
```

### Complete System Backup

```bash
#!/bin/bash
# backup-all.sh

BACKUP_DIR="/home/statex/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker exec statex_postgres_prod pg_dump -U statex_user statex_production > $BACKUP_DIR/db_backup_$DATE.sql
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Backup SSL certificates
tar -czf $BACKUP_DIR/ssl_backup_$DATE.tar.gz ssl/

# Backup Docker volumes
docker run --rm -v statex_postgres_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/postgres_vol_$DATE.tar.gz -C /data .
docker run --rm -v statex_redis_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/redis_vol_$DATE.tar.gz -C /data .

# Backup configuration files
tar -czf $BACKUP_DIR/config_backup_$DATE.tar.gz docker-compose.production.yml .env.production nginx/ database/

echo "Complete system backup completed: $DATE"
```

### Volume Backup

```bash
# Backup Docker volumes
docker run --rm -v statex_postgres_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/postgres_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

docker run --rm -v statex_redis_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/redis_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
```

### Recovery

```bash
# Restore database
gunzip -c backups/db_backup_20241201_120000.sql.gz | docker exec -i statex_postgres_prod psql -U statex_user -d statex_production

# Restore volumes
docker run --rm -v statex_postgres_data:/data -v $(pwd)/backups:/backup alpine tar xzf /backup/postgres_20241201_120000.tar.gz -C /data
```

## 🔒 Security

### Container Security

```bash
# Run containers as non-root users
# Already configured in Dockerfiles

# Use read-only root filesystem where possible
# Implemented in production Dockerfiles

# Scan for vulnerabilities
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image statex_frontend_prod
```

### SSL Certificate Security

**Persistent SSL Storage:**
```bash
# SSL certificates are stored in local directories
ssl/
├── accounts/          # Let's Encrypt account keys (700 permissions)
├── archive/           # Certificate archives (700 permissions)
├── live/              # Current certificates (700 permissions)
└── renewal/           # Renewal configuration (700 permissions)

# Set proper permissions
chmod 700 ssl/accounts ssl/archive ssl/live ssl/renewal
chown -R $USER:$USER ssl/

# Backup SSL certificates
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz ssl/

# Restore SSL certificates
tar -xzf ssl-backup-20241201.tar.gz
chmod 700 ssl/accounts ssl/archive ssl/live ssl/renewal
```

**Certificate Persistence Benefits:**
- ✅ **Never lost** - Certificates persist across container restarts
- ✅ **Automatic renewal** - Existing certificates are preserved
- ✅ **Easy backup** - Simple tar backup/restore process
- ✅ **Secure storage** - Proper file permissions (700)
- ✅ **Account persistence** - Let's Encrypt account keys preserved

### Network Security

```bash
# Restrict container communication
# Only necessary ports exposed

# Use internal Docker network
# app-network isolates containers

# Implement rate limiting in Nginx
# Configured in nginx/conf.d/*.conf
```

### Secrets Management

```bash
# Use environment variables for secrets
# Store in .env.production (not in version control)

# Consider Docker secrets for production
# For more sensitive deployments
```

## ⚡ Performance Optimization

### Container Optimization

```bash
# Use multi-stage builds
# Reduce image size significantly

# Optimize layer caching
# Copy package files first

# Use Alpine Linux base images
# Smaller footprint
```

### Resource Limits

```bash
# Add to docker-compose.production.yml
services:
  frontend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### Monitoring

```bash
# Monitor container resources
docker stats

# Set up Prometheus/Grafana
# For advanced monitoring

# Use Docker's built-in metrics
# Available via Docker API
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check logs
docker compose -f docker-compose.production.yml logs service_name

# Check resource usage
docker stats

# Verify environment variables
docker compose -f docker-compose.production.yml config
```

#### 2. Health Check Failures

```bash
# Check service availability
docker exec container_name curl -f http://localhost:port

# Verify dependencies
docker compose -f docker-compose.production.yml ps

# Check network connectivity
docker exec container_name ping other_service
```

#### 3. SSL Certificate Issues

```bash
# Check certificate status
docker compose -f docker-compose.production.yml run --rm certbot certificates

# Renew certificates (preserves existing ones)
docker compose -f docker-compose.production.yml run --rm certbot renew --keep-until-expiring

# Check Nginx configuration
docker exec statex_nginx_prod nginx -t

# Verify SSL certificate persistence
ls -la ssl/live/statex.cz/
ls -la ssl/accounts/

# Check SSL directory permissions
ls -la ssl/
chmod 700 ssl/accounts ssl/archive ssl/live ssl/renewal

# Backup and restore SSL certificates
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz ssl/
tar -xzf ssl-backup-20241201.tar.gz
chmod 700 ssl/accounts ssl/archive ssl/live ssl/renewal
```

#### 4. Database Connection Issues

```bash
# Test database connectivity
docker exec statex_backend_prod pg_isready -h postgres -p 5432

# Check database logs
docker compose -f docker-compose.production.yml logs postgres

# Verify environment variables
docker exec statex_backend_prod env | grep DATABASE
```

### Debug Commands

```bash
# Enter container for debugging
docker exec -it statex_frontend_prod sh
docker exec -it statex_backend_prod sh

# Check container filesystem
docker exec statex_frontend_prod ls -la /app

# Monitor real-time logs
docker compose -f docker-compose.production.yml logs -f --tail=50

# Check network connectivity
docker network inspect statex_app-network
```

## 📚 Additional Resources

### Documentation Links

- [Production Setup Manual](production-setup-manual.md) - Complete deployment guide
- [Environment Setup](environment-setup.md) - Environment configuration
- [Nginx Configuration](../nginx/) - Reverse proxy setup
- [SSL Management](../ssl/) - Certificate management

### Docker Best Practices

- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security/)

### Monitoring Tools

- [Prometheus](https://prometheus.io/) - Metrics collection
- [Grafana](https://grafana.com/) - Visualization
- [cAdvisor](https://github.com/google/cadvisor) - Container monitoring

---

**Status**: ✅ Production Ready  
**Last Updated**: December 2024  
**Version**: 1.0 