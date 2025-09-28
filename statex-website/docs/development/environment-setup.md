# Environment Setup Guide

## 🎯 Overview

StateX uses a sophisticated environment management system that automatically handles configuration switching between development and production environments. The system provides seamless environment transitions with proper DEBUG settings, URL configurations, and Docker integration.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Environment Architecture](#-environment-architecture)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [Frontend Integration](#-frontend-integration)
- [Backend Integration](#-backend-integration)
- [Docker Integration](#-docker-integration)
- [Troubleshooting](#-troubleshooting)
- [Best Practices](#-best-practices)

## 🚀 Quick Start

### Basic Environment Commands

```bash
# Switch to development environment
./scripts/switch_env.sh development

# Switch to production environment
./scripts/switch_env.sh production

# Check current environment
ls -la .env
source .env && echo "DEBUG: $DEBUG, BASE_URL: $BASE_URL"
```

### Environment Status

| Environment | DEBUG | BASE_URL | SSL Mode | Self-Signed SSL |
|-------------|-------|----------|----------|-----------------|
| **Development** | `true` | `http://localhost:3000` | `development` | `true` |
| **Production** | `false` | `https://statex.cz` | `production` | `false` |

## 🏗️ Environment Architecture

### File Structure

```
statex/
├── .env → .env.development (symlink)
├── .env.development (DEBUG=true, localhost config)
├── .env.production (DEBUG=false, production config)
├── docker-compose.production.yml (Production Docker orchestration)
├── frontend/
│   ├── .env.development (DEBUG=true)
│   ├── .env.production (DEBUG=false)
│   └── Dockerfile.prod (Production container)
├── backend/
│   ├── .env.development (DEBUG=true)
│   ├── .env.production (DEBUG=false)
│   └── Dockerfile.prod (Production container)
├── nginx/
│   ├── nginx.conf (Main Nginx configuration)
│   └── conf.d/ (Server configurations)
└── scripts/
    ├── setup_env.sh (Environment file creation)
    ├── switch_env.sh (Environment switching)
    └── setup_production.sh (Production setup)
```

### Symlink System

The project uses a symlink system where `.env` points to either `.env.development` or `.env.production`:

```bash
# Development environment
.env → .env.development

# Production environment  
.env → .env.production
```

## 🔧 Available Scripts

### 1. Environment Setup (`scripts/setup_env.sh`)

Creates environment files from `.env.example` template.

```bash
./scripts/setup_env.sh
```

**Features:**
- Creates `.env.development` and `.env.production` files
- Generates secure secrets for production
- Sets up SSL certificates for development
- Configures email settings
- Creates necessary directories

### 2. Environment Switching (`scripts/switch_env.sh`)

Switches between development and production environments.

```bash
# Switch to development
./scripts/switch_env.sh development

# Switch to production
./scripts/switch_env.sh production

# Show help
./scripts/switch_env.sh --help
```

**Features:**
- Automatic symlink management
- Docker container management
- Environment variable export
- Status reporting
- Error handling

### 3. Production Setup (`scripts/setup_production.sh`)

Configures production-specific settings.

```bash
./scripts/setup_production.sh
```

## 🔑 Environment Variables

### Core Variables

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `DEBUG` | `true` | `false` | Enable/disable debug mode |
| `BASE_URL` | `http://localhost:3000` | `https://statex.cz` | Application base URL |
| `NODE_ENV` | `development` | `production` | Node.js environment |
| `SSL_MODE` | `development` | `production` | SSL configuration mode |
| `ALLOW_SELF_SIGNED` | `true` | `false` | Allow self-signed certificates |

### Domain Configuration

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `VIRTUAL_HOST` | `localhost` | `statex.cz` | Nginx virtual host |
| `LETSENCRYPT_HOST` | `statex.cz` | `statex.cz` | SSL certificate domain |
| `DEFAULT_HOST` | `localhost` | `statex.cz` | Default hostname |

### Email Configuration

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `MAIL_SERVER` | `smtp.gmail.com` | `smtp.sendgrid.net` | SMTP server |
| `MAIL_PORT` | `587` | `587` | SMTP port |
| `MAIL_USE_TLS` | `true` | `true` | Use TLS encryption |
| `MAIL_USERNAME` | `dev@localhost` | `noreply@statex.cz` | SMTP username |

## 🎨 Frontend Integration

### Environment Configuration (`frontend/src/config/env.ts`)

The frontend uses a centralized environment configuration:

```typescript
export const env = {
  // Base URL for the application
  BASE_URL: process.env['BASE_URL'] || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://statex.cz' 
      : 'http://localhost:3000'),
  
  // Debug mode
  DEBUG: process.env['DEBUG'] === 'true' || process.env.NODE_ENV === 'development',
  
  // Contact emails
  CONTACT_EMAIL: 'contact@statex.cz',
  SUPPORT_EMAIL: 'support@statex.cz',
  LEGAL_EMAIL: 'legal@statex.cz',
  PRIVACY_EMAIL: 'privacy@statex.cz',
  DPO_EMAIL: 'dpo@statex.cz',
} as const;
```

### Helper Functions

```typescript
// Get full URL for a path
export const getFullUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${env.BASE_URL}${cleanPath}`;
};

// Get email link with subject
export const getEmailLink = (email: string, subject?: string): string => {
  const baseLink = `mailto:${email}`;
  return subject ? `${baseLink}?subject=${encodeURIComponent(subject)}` : baseLink;
};
```

### Usage in Components

```typescript
import { env, getFullUrl } from '@/config/env';

// Use environment variables
const apiUrl = getFullUrl('/api/data');
const isDebug = env.DEBUG;

// Use in JSX
<a href={getFullUrl('/contact')}>Contact Us</a>
```

## ⚙️ Backend Integration

### Environment Files

The backend has separate environment files for each environment:

```bash
# Development
backend/.env.development
DEBUG=true
BASE_URL=http://localhost:3000

# Production
backend/.env.production
DEBUG=false
BASE_URL=https://statex.cz
```

### CORS Configuration

The backend automatically configures CORS based on the environment:

```typescript
// Register CORS
server.register(cors, {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.BASE_URL || 'https://statex.cz'] 
    : ['http://localhost:3000'],
  credentials: true,
});
```

## 🐳 Docker Integration

### Production Docker Orchestration

The project uses a **Docker-first approach** for production deployment:

```bash
# Deploy all production containers
docker compose -f docker-compose.production.yml up -d --build

# Check container health
docker compose -f docker-compose.production.yml ps

# View logs
docker compose -f docker-compose.production.yml logs -f
```

### Container Architecture

**Production containers include:**
- **Frontend**: Next.js application container
- **Backend**: Node.js API container
- **Database**: PostgreSQL container
- **Cache**: Redis container
- **Reverse Proxy**: Nginx container
- **SSL**: Certbot container for Let's Encrypt

### Docker Compose Files

The system uses environment-specific Docker Compose configurations:

- `docker-compose.yml` - Base configuration (development)
- `docker-compose.production.yml` - Production orchestration with all services

## 🧪 Testing

### Environment Testing

The project includes comprehensive environment testing:

```bash
# Run environment tests
cd frontend && npx vitest run src/config/env.test.ts
```

### Test Coverage

- ✅ Environment variable access
- ✅ URL generation functions
- ✅ Email link generation
- ✅ DEBUG configuration
- ✅ Environment switching

## 🔍 Troubleshooting

### Common Issues

#### 1. Environment Not Switching

```bash
# Check current symlink
ls -la .env

# Force recreate symlink
rm .env
ln -sf .env.development .env
```

#### 2. DEBUG Not Working

```bash
# Check environment variable
source .env && echo $DEBUG

# Verify frontend environment
cat frontend/.env.development
```

#### 3. Docker Containers Not Starting

```bash
# Check Docker Compose files
ls -la docker-compose*.yml

# Manual Docker start
docker compose up -d
```

#### 4. SSL Certificate Issues

```bash
# Regenerate development certificates
./scripts/setup_env.sh
```

### Debug Commands

```bash
# Check all environment files
ls -la | grep env

# Verify environment variables
source .env && env | grep -E "(DEBUG|BASE_URL|NODE_ENV)"

# Test environment switching
./scripts/switch_env.sh development && source .env && echo "DEBUG: $DEBUG"
./scripts/switch_env.sh production && source .env && echo "DEBUG: $DEBUG"
```

## 📚 Best Practices

### 1. Environment Management

- ✅ Always use `./scripts/switch_env.sh` to change environments
- ✅ Never edit `.env` directly (it's a symlink)
- ✅ Use environment-specific files (`.env.development`, `.env.production`)
- ✅ Test environment switching before deployment

### 2. Development Workflow

```bash
# Start development
./scripts/switch_env.sh development
cd frontend && npm run dev

# Test production locally
./scripts/switch_env.sh production
cd frontend && npm run build && npm start
```

### 3. Deployment

```bash
# Prepare for production
./scripts/switch_env.sh production
./scripts/setup_production.sh

# Deploy
./scripts/deploy.sh
```

### 4. Security

- ✅ Never commit `.env` files to version control
- ✅ Use strong secrets in production
- ✅ Enable SSL in production
- ✅ Disable DEBUG in production

### 5. Monitoring

```bash
# Check environment status
echo "Environment: $(readlink -f .env | sed 's/.*\.env\.//')"
echo "DEBUG: $(source .env && echo $DEBUG)"
echo "BASE_URL: $(source .env && echo $BASE_URL)"

# Monitor logs
docker compose logs -f
```

## 🔗 Related Documentation

- [Architecture Guide](architecture.md) - System architecture overview
- [Frontend Guide](frontend.md) - Frontend development guide
- [Backend Guide](backend.md) - Backend API documentation
- [Testing Guide](testing-guidelines.md) - Testing strategies
- [Deployment Guide](../DEPLOYMENT.md) - Production deployment

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Environment switching system implemented
- ✅ DEBUG configuration for development/production
- ✅ Frontend and backend environment integration
- ✅ Docker integration with environment switching
- ✅ Comprehensive testing coverage
- ✅ SSL certificate management
- ✅ Email configuration per environment

---

**Last Updated**: July 31, 2024  
**Maintainer**: Development Team  
**Status**: ✅ Production Ready 