# StateX Configuration Guide

## 🎯 Overview

The StateX project implements a **centralized configuration system** that uses environment variables as the single source of truth. This system eliminates hardcoded values and provides a flexible, maintainable approach to configuration management across different environments.

## 🔧 Core Principles

### 1. Single Source of Truth
- **Primary Variable**: `VIRTUAL_HOST` controls all domain-related naming
- **Environment Variables**: All configuration values come from environment variables
- **No Hardcoded Values**: Zero hardcoded fallbacks in configuration files

### 2. Centralized Defaults
- **Default Configuration**: `config/defaults.env` contains all fallback values
- **Pattern**: `${VARIABLE:-${DEFAULT_VARIABLE}}` for all configuration values
- **Consistency**: All services use the same configuration pattern

### 3. Environment Separation
- **Development**: Uses development-specific values
- **Production**: Uses production-specific values
- **Service Separation**: Each service has its own configuration file

## 📁 Configuration Files

### Primary Configuration Files

| File | Purpose | Environment |
|------|---------|-------------|
| `config/defaults.env` | Centralized default values | All |
| `.env.production` | Production environment variables | Production |
| `.env.development` | Development environment variables | Development |
| `config/mailserver.env` | Mailserver-specific configuration | Production |
| `.env.nginx.production` | Nginx-specific configuration | Production |

### Service Configuration Files

| Service | Configuration File | Purpose |
|---------|-------------------|---------|
| **Docker Compose** | `docker-compose.production.yml` | Container orchestration |
| **Nginx** | `nginx/statex-reverse-proxy.conf` | Reverse proxy configuration |
| **Mailserver** | `config/mailserver.env` | Email server configuration |
| **Backend** | `.env.production` | API configuration |
| **Frontend** | `.env.production` | Frontend configuration |

## 🔑 Environment Variables

### Core Domain Configuration

```bash
# Primary variable - controls all naming
VIRTUAL_HOST=statex.cz
```

### Database Configuration

```bash
# Optional: Override defaults if needed
DB_NAME=statex_production
DB_USER=statex
DB_PASSWORD=statexpass
DATABASE_URL=postgresql://statex:statexpass@postgres:5432/statex_production
```

### Redis Configuration

```bash
# Optional: Override defaults if needed
REDIS_PASSWORD=your_redis_password
REDIS_URL=redis://redis:6379
```

### Port Configuration

```bash
# Optional: Override defaults if needed
FRONTEND_PORT=3000
BACKEND_PORT=4000
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443
```

### Application Configuration

```bash
NODE_ENV=production
APP_NAME=Statex
APP_URL=https://statex.cz
API_URL=https://api.statex.cz
PORT=3000
```

### SSL Configuration

```bash
SSL_MODE=production
DEFAULT_HOST=statex.cz
ALLOW_SELF_SIGNED=false
LETSENCRYPT_EMAIL=admin@statex.cz
```

### Build Configuration

```bash
BUILD_DATE=20250902-143000
PACKAGE_VERSION=1.0.0
USER_UID=1001
```

### Upload Configuration

```bash
UPLOAD_DIR=./uploads
```

## 🏗️ Default Configuration System

### Default Configuration File

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

# Application Defaults
DEFAULT_NODE_ENV=production
DEFAULT_APP_NAME=Statex
DEFAULT_PORT=3000

# Domain Defaults (should be overridden in environment-specific configs)
DEFAULT_VIRTUAL_HOST=localhost
DEFAULT_DEFAULT_HOST=localhost
DEFAULT_LETSENCRYPT_EMAIL=admin@localhost

# Authentication Defaults (should be overridden in production)
DEFAULT_JWT_SECRET=dev-jwt-secret-key
DEFAULT_COOKIE_SECRET=dev-cookie-secret-key
DEFAULT_SESSION_SECRET=dev-session-secret-key

# Email Defaults
DEFAULT_SMTP_HOST=localhost
DEFAULT_SMTP_PORT=1025
DEFAULT_SMTP_SECURE=false
DEFAULT_SMTP_USER=dev@localhost
DEFAULT_SMTP_PASS=dev-password

# Rate Limiting Defaults
DEFAULT_RATE_LIMIT_WINDOW_MS=900000
DEFAULT_RATE_LIMIT_MAX=100

# CORS Defaults
DEFAULT_CORS_ORIGIN=http://localhost:3000
DEFAULT_CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
DEFAULT_CORS_CREDENTIALS=true
DEFAULT_CORS_MAX_AGE=86400

# Logging Defaults
DEFAULT_LOG_LEVEL=info
DEFAULT_LOG_FORMAT=combined
DEFAULT_LOG_FILE=logs/app.log

# File Upload Defaults
DEFAULT_MAX_FILE_SIZE=50MB
DEFAULT_MAX_FILES=10

# Session Defaults
DEFAULT_SESSION_COOKIE_MAX_AGE=2592000000
DEFAULT_USER_UID=1001
```

### Configuration Pattern

All configuration values use the pattern: `${VARIABLE:-${DEFAULT_VARIABLE}}`

**Examples**:
- `${DB_PASSWORD:-${DEFAULT_DB_PASSWORD}}` → Uses `DB_PASSWORD` if set, otherwise `statexpass`
- `${FRONTEND_PORT:-${DEFAULT_FRONTEND_PORT}}` → Uses `FRONTEND_PORT` if set, otherwise `3000`
- `${VIRTUAL_HOST}` → Always required, no fallback

## 🏷️ Auto-Generated Configuration

Based on `VIRTUAL_HOST=statex.cz`, the system automatically generates:

### Domains
- Main: `statex.cz`
- API: `api.statex.cz`
- Mail: `mail.statex.cz`
- WWW: `www.statex.cz`

### Container Names
- Frontend: `statex.cz`
- Backend: `api.statex.cz`
- Nginx: `statex_nginx`
- PostgreSQL: `statex_postgres_prod`
- Redis: `statex_redis_prod`
- Mailserver: `statex_mailserver`
- Roundcube: `statex_roundcube`
- Let's Encrypt: `statex_letsencrypt`

### Network Names
- Main Network: `statex_network`

### Volume Names
- SSL Data: `statex_ssl_data`
- Mailserver Data: `statex_mailserver_data`
- Roundcube Data: `statex_roundcube_data`

## 🌍 Environment-Specific Configuration

### Development Environment

Create `.env.development`:
```bash
VIRTUAL_HOST=localhost
NODE_ENV=development
DB_NAME=statex_development
SSL_MODE=development
ALLOW_SELF_SIGNED=true
```

### Production Environment

Create `.env.production`:
```bash
VIRTUAL_HOST=statex.cz
NODE_ENV=production
DB_NAME=statex_production
SSL_MODE=production
ALLOW_SELF_SIGNED=false
```

## 🔧 Service-Specific Configuration

### Mailserver Configuration (`config/mailserver.env`)

Uses environment variables:
```bash
HOSTNAME=mail.${VIRTUAL_HOST}
DOMAINNAME=${VIRTUAL_HOST}
CONTAINER_NAME=${VIRTUAL_HOST}_mailserver
POSTMASTER_ADDRESS=admin@${VIRTUAL_HOST}
OVERRIDE_HOSTNAME=mail.${VIRTUAL_HOST}
SRS_DOMAINNAME=${VIRTUAL_HOST}
```

### Nginx Configuration (`nginx/statex-reverse-proxy.conf`)

Uses environment variables:
```bash
server_name ${VIRTUAL_HOST};
server_name api.${VIRTUAL_HOST};
server_name mail.${VIRTUAL_HOST};
server_name www.${VIRTUAL_HOST};
```

## 📋 Configuration Implementation

### Docker Compose (`docker-compose.production.yml`)

- All container names use `${VIRTUAL_HOST}_service_name`
- All network names use `${VIRTUAL_HOST}_network`
- All volume names use `${VIRTUAL_HOST}_volume_name`
- All services load `config/defaults.env`
- No hardcoded values or fallbacks

### Nginx Configuration (`nginx/statex-reverse-proxy.conf`)

- All server names use `${VIRTUAL_HOST}` and subdomains
- All proxy passes use `${VIRTUAL_HOST}_container_name`
- All log file names use `${VIRTUAL_HOST}`

### Mailserver Configuration (`config/mailserver.env`)

- All domain references use `${VIRTUAL_HOST}`
- All hostname references use `mail.${VIRTUAL_HOST}`

## ✅ Benefits

1. **Single Source of Truth**: Only `VIRTUAL_HOST` needs to be changed to deploy to a different domain
2. **No Hardcoded Values**: All configuration is driven by environment variables with proper defaults
3. **Default Configuration**: Centralized defaults in `config/defaults.env` for all services
4. **Environment Separation**: Different configurations for development and production
5. **Service Separation**: Each service has its own configuration file
6. **Consistency**: All naming follows the same pattern
7. **Portability**: Easy to deploy to different environments
8. **Maintainability**: Centralized configuration management
9. **Flexibility**: Override any default value by setting the corresponding environment variable

## 🚀 Deployment

### Quick Deployment

1. Set `VIRTUAL_HOST` to your domain
2. Configure other environment variables as needed
3. Run deployment script: `./scripts/deploy.sh --deploy`
4. All containers, networks, and volumes will be created with consistent naming

### Environment Setup

```bash
# Set primary domain
export VIRTUAL_HOST=statex.cz

# Set environment
export NODE_ENV=production

# Deploy
docker compose -f docker-compose.production.yml up -d
```

## 🔍 Validation

### Check for Hardcoded Values

To ensure no hardcoded values remain:

```bash
# Search for hardcoded domain references
grep -r "statex\.cz" docker-compose.production.yml nginx/ config/ scripts/deploy.sh

# Search for hardcoded fallback values
grep -r ":-.*}" docker-compose.production.yml nginx/ config/
```

All results should be empty or only in documentation files.

### Configuration Validation

```bash
# Validate Docker Compose configuration
docker compose -f docker-compose.production.yml config

# Check environment variables
docker compose -f docker-compose.production.yml config --services
```

## 📚 Related Documentation

- [Docker Production Guide](docker-production-guide.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Production Setup Manual](production-setup-manual.md)

---

**Status**: ✅ Production Ready  
**Last Updated**: December 2024  
**Version**: 1.0
