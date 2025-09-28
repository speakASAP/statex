# Production Setup Manual - Step by Step

## 🎯 Overview

This manual provides a complete step-by-step guide for setting up the StateX production environment from scratch using **Docker containers for all services**. This approach ensures consistency, scalability, and easy maintenance.

### 🐳 Docker-First Architecture

All services run in Docker containers:
- **Frontend**: Next.js application container
- **Backend**: Node.js API container  
- **Database**: PostgreSQL container
- **Cache**: Redis container
- **Reverse Proxy**: Nginx container
- **SSL**: Certbot container for Let's Encrypt

### 🚀 Benefits of Docker Setup

- ✅ **Consistency**: Same environment across development and production
- ✅ **Isolation**: Each service runs in its own container
- ✅ **Scalability**: Easy to scale individual services
- ✅ **Portability**: Can be deployed on any Docker-compatible server
- ✅ **Maintenance**: Simple updates and rollbacks
- ✅ **Security**: Container isolation and security best practices
- ✅ **Monitoring**: Built-in health checks and logging

Follow these steps in order to ensure a successful production deployment.

## 📋 Prerequisites

### Required Accounts & Services
- ✅ **Domain registrar** (e.g., Namecheap, GoDaddy, Cloudflare)
- ✅ **VPS/Cloud server** (e.g., DigitalOcean, AWS, Vultr)
- ✅ **Email service** (SendGrid, Mailgun, or similar)
- ✅ **CDN service** (Cloudflare recommended)

**Note**: Database (PostgreSQL) and Redis will run in Docker containers, so no external services are required.

### Server Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 20GB SSD
- **CPU**: 2+ cores
- **Network**: Stable internet connection

### Domain Requirements
- **Primary domain**: `statex.cz` (or your domain)
- **Subdomain**: `api.statex.cz` (for backend API)
- **DNS access**: Ability to configure DNS records

## 🚀 Step-by-Step Setup

### Step 1: Server Preparation

#### 1.1 Server Access Setup
```bash
# Connect to your server
ssh root@your-server-ip

# Create a new user (recommended)
adduser statex
usermod -aG sudo statex

# Switch to the new user
su - statex
```

#### 1.2 System Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

#### 1.3 Install Docker & Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker compose --version
```

#### 1.4 Install Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Configure firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Step 2: Domain & DNS Configuration

#### 2.1 Domain DNS Setup
Configure the following DNS records in your domain registrar:

```bash
# A Records
statex.cz          → YOUR_SERVER_IP
api.statex.cz      → YOUR_SERVER_IP
www.statex.cz      → YOUR_SERVER_IP

# CNAME Records (if needed)
*.statex.cz        → statex.cz
```

#### 2.2 Verify DNS Propagation
```bash
# Check DNS propagation
nslookup statex.cz
nslookup api.statex.cz
dig statex.cz
dig api.statex.cz
```

### Step 3: SSL Certificate Setup

#### 3.1 Install Certbot
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

#### 3.2 Generate SSL Certificates
```bash
# Generate certificate for main domain
sudo certbot --nginx -d statex.cz -d www.statex.cz

# Generate certificate for API subdomain
sudo certbot --nginx -d api.statex.cz

# Test certificate renewal
sudo certbot renew --dry-run
```

#### 3.3 Configure Auto-Renewal
```bash
# Add to crontab for auto-renewal
sudo crontab -e

# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

### Step 4: Project Setup

#### 4.1 Clone Repository
```bash
# Navigate to home directory
cd ~

# Clone the repository
git clone https://github.com/your-username/statex.git
cd statex

# Set proper permissions
sudo chown -R $USER:$USER .
```

#### 4.2 Environment Configuration
```bash
# Run environment setup
./scripts/setup_env.sh

# Switch to production environment
./scripts/switch_env.sh production

# Verify environment
ls -la .env
source .env && echo "DEBUG: $DEBUG, BASE_URL: $BASE_URL"
```

#### 4.3 Configure Production Environment
Edit the production environment files:

```bash
# Edit main production environment
nano .env.production
```

**Required changes in `.env.production`:**
```env
# Domain configuration
VIRTUAL_HOST=statex.cz
LETSENCRYPT_HOST=statex.cz
DEFAULT_HOST=statex.cz

# Debug configuration
DEBUG=false

# SSL configuration
SSL_MODE=production
ALLOW_SELF_SIGNED=false

# Email configuration (update with your email service)
MAIL_SERVER=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-sendgrid-username
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_DEFAULT_SENDER=noreply@statex.cz

# Database configuration (if using external database)
DATABASE_URL=postgresql://username:password@host:port/database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=statex_production
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_SSL=true

# Redis configuration (if using external Redis)
REDIS_URL=redis://your-redis-host:6379
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Base URL
BASE_URL=https://statex.cz
```

#### 4.4 Configure Frontend Environment
```bash
# Edit frontend production environment
nano frontend/.env.production
```

**Add to `frontend/.env.production`:**
```env
DEBUG=false
BASE_URL=https://statex.cz
NEXT_PUBLIC_BASE_URL=https://statex.cz
```

#### 4.5 Configure Backend Environment
```bash
# Edit backend production environment
nano backend/.env.production
```

**Add to `backend/.env.production`:**
```env
DEBUG=false
BASE_URL=https://statex.cz
NODE_ENV=production
```

### Step 5: Docker Compose Configuration

#### 5.1 Create Production Docker Compose
```bash
# Create production Docker Compose file
nano docker-compose.production.yml
```

**Add this production configuration:**
```yaml
services:
  # PostgreSQL Database (Pre-built image)
  postgres:
    image: postgres:15-alpine
    container_name: statex_postgres_prod
    restart: unless-stopped
    environment:
      POSTGRES_DB: statex_production
      POSTGRES_USER: statex_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U statex_user -d statex_production"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache (Pre-built image)
  redis:
    image: redis:7-alpine
    container_name: statex_redis_prod
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Backend API (Pre-built Node.js image)
  backend:
    image: node:18-alpine
    container_name: statex_backend_prod
    restart: unless-stopped
    working_dir: /app
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://statex_user:${DB_PASSWORD}@postgres:5432/statex_production
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      DEBUG: false
      BASE_URL: https://statex.cz
    volumes:
      - ./backend:/app
      - backend_node_modules:/app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    command: sh -c "npm install && npx prisma generate && npm start"

  # Frontend Application (Pre-built Node.js image)
  frontend:
    image: node:18-alpine
    container_name: statex_frontend_prod
    restart: unless-stopped
    working_dir: /app
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_BASE_URL: https://statex.cz
      DEBUG: false
    volumes:
      - ./frontend:/app
      - frontend_node_modules:/app/node_modules
      - frontend_next_cache:/app/.next
    depends_on:
      - backend
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:${FRONTEND_PORT:-3000}"]
      interval: 30s
      timeout: 10s
      retries: 3
    command: sh -c "npm install && npm run build && npm start"

  # Nginx Reverse Proxy (Pre-built image)
  nginx:
    image: nginx:alpine
    container_name: statex_nginx_prod
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - frontend
      - backend
    networks:
      - app-network
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
  backend_node_modules:
    driver: local
  frontend_node_modules:
    driver: local
  frontend_next_cache:
    driver: local

networks:
  app-network:
    driver: bridge
```

#### 5.2 Update Environment Variables
```bash
# Update .env.production for Docker setup
nano .env.production
```

**Update with Docker-specific variables:**
```env
# Domain configuration
VIRTUAL_HOST=statex.cz
LETSENCRYPT_HOST=statex.cz
DEFAULT_HOST=statex.cz

# Debug configuration
DEBUG=false

# SSL configuration
SSL_MODE=production
ALLOW_SELF_SIGNED=false

# Database configuration (Docker)
DATABASE_URL=postgresql://statex_user:${DB_PASSWORD}@postgres:5432/statex_production
DB_HOST=postgres
DB_PORT=5432
DB_NAME=statex_production
DB_USER=statex_user
DB_PASSWORD=your-secure-db-password
DB_SSL=false

# Redis configuration (Docker)
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-redis-password

# Email configuration
MAIL_SERVER=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-sendgrid-username
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_DEFAULT_SENDER=noreply@statex.cz

# Base URL
BASE_URL=https://statex.cz
```

### Step 6: Pre-built Docker Images (No Custom Builds Required)

#### 6.1 Rapid Deployment Setup

**All services use pre-built Docker Hub images:**
- **PostgreSQL**: `postgres:15-alpine` (Official)
- **Redis**: `redis:7-alpine` (Official)
- **Node.js**: `node:18-alpine` (Official)
- **Nginx**: `nginx:alpine` (Official)
- **Certbot**: `certbot/certbot` (Official)

**Benefits of pre-built images:**
- ✅ **Instant deployment** - No build time required
- ✅ **Automatic updates** - Pull latest images anytime
- ✅ **Consistent environments** - Same images across all servers
- ✅ **Fast scaling** - Deploy to new servers in seconds
- ✅ **Reduced complexity** - No custom Dockerfile maintenance

#### 6.2 Optional: Minimal Dockerfiles (For Advanced Customization)

If you need custom configurations, create minimal Dockerfiles:

```bash
# Create backend Dockerfile (optional)
nano backend/Dockerfile.prod
```

**Minimal backend Dockerfile:**
```dockerfile
# Minimal Backend Dockerfile (Optional)
FROM node:23-slim

WORKDIR /app

# Install only essential packages
RUN apk add --no-cache wget

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["npm", "start"]
```

```bash
# Create frontend Dockerfile (optional)
nano frontend/Dockerfile.prod
```

**Minimal frontend Dockerfile:**
```dockerfile
# Minimal Frontend Dockerfile (Optional)
FROM node:23-slim

WORKDIR /app

# Install only essential packages
RUN apk add --no-cache wget

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${FRONTEND_PORT:-3000} || exit 1

CMD ["npm", "start"]
```

**Note**: These Dockerfiles are optional. The pre-built image approach above works without any custom Dockerfiles.

#### 6.2 Create Nginx Configuration
```bash
# Create Nginx configuration directory
mkdir -p nginx/conf.d

# Create main Nginx configuration
nano nginx/nginx.conf
```

**Add main Nginx configuration:**
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Include server configurations
    include /etc/nginx/conf.d/*.conf;
}
```

```bash
# Create frontend server configuration
nano nginx/conf.d/frontend.conf
```

**Add frontend Nginx configuration:**
```nginx
# Frontend server configuration
server {
    listen 80;
    server_name statex.cz www.statex.cz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name statex.cz www.statex.cz;

    # SSL configuration
    ssl_certificate /etc/nginx/ssl/live/statex.cz/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/live/statex.cz/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend proxy
    location / {
        proxy_pass http://frontend:${FRONTEND_PORT:-3000};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static assets with caching
    location /_next/static/ {
        proxy_pass http://frontend:${FRONTEND_PORT:-3000};
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

```bash
# Create API server configuration
nano nginx/conf.d/api.conf
```

**Add API Nginx configuration:**
```nginx
# API server configuration
server {
    listen 80;
    server_name api.statex.cz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.statex.cz;

    # SSL configuration
    ssl_certificate /etc/nginx/ssl/live/api.statex.cz/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/live/api.statex.cz/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rate limiting
    limit_req zone=api burst=20 nodelay;

    # API proxy
    location / {
        proxy_pass http://backend:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 75;
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://backend:4000/health;
    }
}
```

### Step 7: Email Service Setup

#### 7.1 SendGrid Setup (Recommended)
```bash
# Sign up for SendGrid account
# Create API key with full access
# Verify domain ownership
# Update .env.production with SendGrid credentials
```

#### 7.2 Alternative Email Services
- **Mailgun**: Similar setup process
- **Amazon SES**: AWS integration
- **Postmark**: Transactional email service

### Step 8: Rapid Docker Deployment

#### 8.1 Create Required Directories
```bash
# Create directories for Docker volumes and logs
mkdir -p logs/nginx logs/certbot ssl database backups

# Set proper permissions
sudo chown -R $USER:$USER logs ssl database backups
```

#### 8.2 Instant Deployment (No Build Required)
```bash
# Navigate to project root
cd ~/statex

# Pull latest pre-built images
docker compose -f docker-compose.production.yml pull

# Start all containers instantly
docker compose -f docker-compose.production.yml up -d

# Check container status
docker compose -f docker-compose.production.yml ps

# View logs
docker compose -f docker-compose.production.yml logs -f
```

#### 8.3 Rapid Scaling Commands
```bash
# Deploy to new server in seconds
git clone https://github.com/your-repo/statex.git
cd statex
./scripts/switch_env.sh production
docker compose -f docker-compose.production.yml up -d

# Update all services instantly
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up -d

# Scale specific service
docker compose -f docker-compose.production.yml up -d --scale frontend=3

# Rollback to previous version
docker compose -f docker-compose.production.yml down
docker image tag statex_frontend:previous statex_frontend:latest
docker compose -f docker-compose.production.yml up -d
```

#### 8.4 Verify Deployment
```bash
# Check all containers are running
docker ps

# Check container health
docker compose -f docker-compose.production.yml ps

# Test frontend
curl -I http://localhost:${FRONTEND_PORT:-3000}

# Test backend
curl -I http://localhost:4000/health

# Check database connection
docker exec statex_postgres_prod pg_isready -U statex_user -d statex_production

# Check Redis connection
docker exec statex_redis_prod redis-cli --raw incr ping
```

### Step 9: SSL Certificate Setup

#### 9.1 Initial SSL Setup
```bash
# Create SSL directories with proper permissions
mkdir -p ssl/accounts ssl/archive ssl/live ssl/renewal logs/certbot
chmod 700 ssl/accounts ssl/archive ssl/live ssl/renewal
chown -R $USER:$USER ssl logs

# Start containers without SSL first
docker compose -f docker-compose.production.yml up -d nginx

# Generate SSL certificates
docker compose -f docker-compose.production.yml run --rm certbot

# Restart Nginx with SSL
docker compose -f docker-compose.production.yml restart nginx
```

#### 9.2 SSL Auto-Renewal
```bash
# Create SSL renewal script
nano ~/ssl-renew.sh
```

**Add SSL renewal script:**
```bash
#!/bin/bash
echo "=== SSL Certificate Renewal ==="
echo "Date: $(date)"

# Ensure SSL directories exist with proper permissions
mkdir -p ssl/accounts ssl/archive ssl/live ssl/renewal logs/certbot
chmod 700 ssl/accounts ssl/archive ssl/live ssl/renewal

# Stop Nginx temporarily
docker compose -f docker-compose.production.yml stop nginx

# Renew certificates (preserves existing certificates)
docker compose -f docker-compose.production.yml run --rm certbot renew --keep-until-expiring

# Start Nginx with new certificates
docker compose -f docker-compose.production.yml start nginx

echo "SSL renewal completed"
```

```bash
# Make executable
chmod +x ~/ssl-renew.sh

# Add to crontab for auto-renewal
crontab -e

# Add this line for weekly renewal:
0 2 * * 0 ~/ssl-renew.sh >> ~/ssl-renewal.log 2>&1
```

#### 9.3 SSL Certificate Persistence & Backup

**SSL certificates are stored in local directories and persist across container restarts:**

```bash
# SSL directory structure
ssl/
├── accounts/          # Let's Encrypt account keys (persistent)
├── archive/           # Certificate archives (persistent)
├── live/              # Current certificates (persistent)
└── renewal/           # Renewal configuration (persistent)

# Backup SSL certificates
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz ssl/

# Restore SSL certificates
tar -xzf ssl-backup-20241201.tar.gz
chmod 700 ssl/accounts ssl/archive ssl/live ssl/renewal
```

#### 9.4 Verify SSL
```bash
# Test SSL certificates
docker compose -f docker-compose.production.yml exec nginx nginx -t

# Check certificate status
docker compose -f docker-compose.production.yml run --rm certbot certificates

# Test HTTPS endpoints
curl -I https://statex.cz
curl -I https://api.statex.cz

# Verify certificate persistence
ls -la ssl/live/statex.cz/
ls -la ssl/accounts/
```

### Step 10: Monitoring & Logging

#### 10.1 Setup Log Rotation
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/statex
```

**Add this configuration:**
```
/home/statex/statex/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 statex statex
    postrotate
        systemctl reload nginx
    endscript
}
```

#### 10.2 Setup Monitoring
```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Setup basic monitoring script
nano ~/monitor.sh
```

**Add monitoring script:**
```bash
#!/bin/bash
echo "=== StateX Production Monitoring ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "Memory: $(free -h)"
echo "Disk: $(df -h /)"
echo "Docker containers:"
docker ps
echo "Nginx status:"
sudo systemctl status nginx --no-pager
echo "SSL certificates:"
sudo certbot certificates
```

```bash
# Make executable
chmod +x ~/monitor.sh

# Add to crontab for regular monitoring
crontab -e

# Add this line for hourly monitoring:
0 * * * * ~/monitor.sh >> ~/monitoring.log 2>&1
```

### Step 11: Security Hardening

#### 11.1 Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 443/tcp
sudo ufw enable

# Check firewall status
sudo ufw status verbose
```

#### 11.2 Fail2ban Setup
```bash
# Install Fail2ban
sudo apt install -y fail2ban

# Configure Fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Start Fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

#### 11.3 Regular Security Updates
```bash
# Setup automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Configure automatic updates
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

### Step 12: Backup Strategy

#### 12.1 Database Backup
```bash
# Create backup script
nano ~/backup-db.sh
```

**Add backup script:**
```bash
#!/bin/bash
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

```bash
# Make executable
chmod +x ~/backup-db.sh

# Add to crontab for daily backups
crontab -e

# Add this line for daily backup at 2 AM:
0 2 * * * ~/backup-db.sh >> ~/backup.log 2>&1
```

#### 12.2 Application Backup
```bash
# Create application backup script
nano ~/backup-app.sh
```

**Add application backup script:**
```bash
#!/bin/bash
BACKUP_DIR="/home/statex/backups"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/home/statex/statex"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C $APP_DIR .

# Keep only last 7 days of backups
find $BACKUP_DIR -name "app_backup_*.tar.gz" -mtime +7 -delete

echo "Application backup completed: app_backup_$DATE.tar.gz"
```

```bash
# Make executable
chmod +x ~/backup-app.sh

# Add to crontab for weekly backups
crontab -e

# Add this line for weekly backup on Sunday at 3 AM:
0 3 * * 0 ~/backup-app.sh >> ~/backup.log 2>&1
```

### Step 13: Performance Optimization

#### 13.1 Nginx Optimization
```bash
# Optimize Nginx configuration
sudo nano /etc/nginx/nginx.conf
```

**Add to http block:**
```nginx
# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml+rss
    application/atom+xml
    image/svg+xml;

# Client caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### 13.2 Docker Optimization
```bash
# Optimize Docker daemon
sudo nano /etc/docker/daemon.json
```

**Add Docker optimization:**
```json
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "storage-driver": "overlay2",
    "storage-opts": [
        "overlay2.override_kernel_check=true"
    ]
}
```

```bash
# Restart Docker
sudo systemctl restart docker
```

### Step 14: Final Verification

#### 14.1 Health Checks
```bash
# Test all services
echo "=== Production Health Check ==="

# Test frontend
curl -I https://statex.cz
curl -I https://www.statex.cz

# Test API
curl -I https://api.statex.cz

# Test SSL certificates
docker compose -f docker-compose.production.yml run --rm certbot certificates

# Test database connection
docker exec statex_postgres_prod pg_isready -U statex_user -d statex_production

# Test Redis connection
docker exec statex_redis_prod redis-cli --raw incr ping

# Check Docker containers
docker ps
docker compose -f docker-compose.production.yml logs --tail=50

# Check container health
docker compose -f docker-compose.production.yml ps
```

#### 14.2 Performance Tests
```bash
# Install testing tools
sudo apt install -y apache2-utils

# Test frontend performance
ab -n 100 -c 10 https://statex.cz/

# Test API performance
ab -n 100 -c 10 https://api.statex.cz/

# Check resource usage
htop
df -h
free -h
```

#### 14.3 Security Tests
```bash
# Test SSL configuration
curl -I https://statex.cz
openssl s_client -connect statex.cz:443 -servername statex.cz

# Test firewall
sudo ufw status verbose

# Test Fail2ban
sudo fail2ban-client status
```

### Step 15: Documentation & Maintenance

#### 15.1 Create Production Documentation
```bash
# Create production documentation
nano ~/production-info.md
```

**Document production details:**
```markdown
# StateX Production Environment

## Server Information
- **IP Address**: YOUR_SERVER_IP
- **Domain**: statex.cz
- **API Domain**: api.statex.cz
- **SSL Provider**: Let's Encrypt

## Service Credentials
- **Database**: PostgreSQL (host:port/database)
- **Redis**: Redis (host:port)
- **Email**: SendGrid
- **CDN**: Cloudflare

## Backup Information
- **Database**: Daily at 2 AM
- **Application**: Weekly on Sunday at 3 AM
- **Location**: /home/statex/backups/

## Monitoring
- **Script**: ~/monitor.sh
- **Logs**: ~/monitoring.log
- **Cron**: Hourly monitoring

## Emergency Contacts
- **Admin**: admin@statex.cz
- **Support**: support@statex.cz
```

#### 15.2 Setup Maintenance Schedule
```bash
# Create maintenance script
nano ~/maintenance.sh
```

**Add maintenance script:**
```bash
#!/bin/bash
echo "=== StateX Production Maintenance ==="
echo "Date: $(date)"

# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker compose -f docker-compose.production.yml pull

# Restart services
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml up -d

# Clean up Docker
docker system prune -f

# Renew SSL certificates
docker compose -f docker-compose.production.yml run --rm certbot renew

# Restart Nginx with new certificates
docker compose -f docker-compose.production.yml restart nginx

echo "Maintenance completed"
```

```bash
# Make executable
chmod +x ~/maintenance.sh

# Add to crontab for weekly maintenance
crontab -e

# Add this line for weekly maintenance on Saturday at 4 AM:
0 4 * * 6 ~/maintenance.sh >> ~/maintenance.log 2>&1
```

## 🎉 Production Setup Complete!

### Final Checklist

- ✅ **Server**: Ubuntu 20.04+ with 2GB+ RAM
- ✅ **Domain**: DNS configured and propagated
- ✅ **Docker**: All services containerized
- ✅ **Environment**: Production environment configured
- ✅ **Database**: PostgreSQL container running
- ✅ **Redis**: Redis container running
- ✅ **Email**: SendGrid or similar configured
- ✅ **Frontend**: Next.js container running
- ✅ **Backend**: Node.js API container running
- ✅ **Nginx**: Reverse proxy container configured
- ✅ **SSL**: Let's Encrypt certificates in containers
- ✅ **Monitoring**: Health checks and logging
- ✅ **Security**: Firewall and container security
- ✅ **Backup**: Automated Docker-based backup strategy
- ✅ **Performance**: Optimized container configurations
- ✅ **Documentation**: Production info documented

### Next Steps

1. **Monitor** the application for 24-48 hours
2. **Test** all functionality thoroughly
3. **Configure** analytics and error tracking
4. **Set up** CI/CD pipeline for future deployments
5. **Train** team members on maintenance procedures

### Support & Maintenance

- **Monitoring**: Check `~/monitoring.log` regularly
- **Backups**: Verify backups in `~/backups/` directory
- **Updates**: Run maintenance script weekly
- **Security**: Monitor Fail2ban logs and SSL certificates
- **Performance**: Monitor resource usage and response times

---

**Last Updated**: July 31, 2024  
**Maintainer**: Development Team  
**Status**: ✅ Production Ready 