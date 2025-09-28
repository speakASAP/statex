# StateX Unified SSL Management Guide

## Overview

This guide covers the unified SSL certificate management system for StateX Platform, handling both production (`*.statex.cz`) and development (`*.localhost`) wildcard certificates from a single source of truth.

## Architecture

### Single Source of Truth: `statex-infrastructure/`

All SSL management is centralized in the `statex-infrastructure/` directory:

```text
statex-infrastructure/
├── ssl/
│   ├── production/          # Production certificates (*.statex.cz)
│   │   └── statex.cz/       # Let's Encrypt certificates
│   ├── development/         # Development certificates (*.localhost)
│   │   └── localhost/       # mkcert certificates
│   ├── shared/              # Unified certificates for nginx
│   └── dynamic/             # Dynamic subdomain certificates
│       ├── production/      # Production subdomains
│       └── development/     # Development subdomains
├── scripts/
│   ├── ssl-manager.sh       # Unified SSL management
│   └── cleanup-ssl-conflicts.sh # Conflict cleanup
├── docker-compose.ssl.yml   # SSL-only services
└── config/
    └── cloudflare.ini       # Cloudflare DNS credentials
```

## Features

### ✅ Unified Management

- **Single Script**: `ssl-manager.sh` handles all SSL operations
- **Environment Aware**: Automatically detects production vs development
- **Wildcard Support**: Both `*.statex.cz` and `*.localhost`
- **Dynamic Subdomains**: Automatic SSL for form-generated subdomains

### ✅ Certificate Types

- **Production**: Let's Encrypt wildcard certificates via DNS challenge
- **Development**: mkcert self-signed certificates for localhost
- **Dynamic**: Auto-generated certificates for customer subdomains

### ✅ Integration

- **DNS Service**: Automatic SSL generation when subdomains are created
- **Nginx**: Unified certificate serving for all environments
- **Docker**: Persistent certificate storage across container restarts

## Quick Start

### 1. Setup Development SSL

```bash
cd statex-infrastructure
./scripts/ssl-manager.sh --setup-development
```

This creates:

- Wildcard certificate for `*.localhost`
- Unified certificates in `ssl/shared/`
- Ready for local development

### 2. Setup Production SSL

```bash
# First, update Cloudflare credentials
nano config/cloudflare.ini

# Then setup production SSL
./scripts/ssl-manager.sh --setup-production
```

This creates:

- Wildcard certificate for `*.statex.cz`
- Let's Encrypt certificates via DNS challenge
- Auto-renewal setup

### 3. Setup All SSL

```bash
./scripts/ssl-manager.sh --setup-all
```

## SSL Manager Commands

### Basic Commands

```bash
# Setup development SSL (*.localhost)
./scripts/ssl-manager.sh --setup-development

# Setup production SSL (*.statex.cz)
./scripts/ssl-manager.sh --setup-production

# Setup specific production domains
./scripts/ssl-manager.sh --setup-specific

# Setup all SSL certificates
./scripts/ssl-manager.sh --setup-all

# Show certificate status
./scripts/ssl-manager.sh --status

# Backup certificates
./scripts/ssl-manager.sh --backup

# Renew production certificates
./scripts/ssl-manager.sh --renew
```

### Certificate Management

```bash
# Check status
./scripts/ssl-manager.sh --status

# Backup certificates
./scripts/ssl-manager.sh --backup

# Renew production certificates
./scripts/ssl-manager.sh --renew
```

## Dynamic Subdomain SSL

### Automatic SSL Generation

When a customer submits a form at `http://localhost:3000/contact`, the system:

1. **Creates Subdomain**: `project1345.localhost` (development) or `project1345.statex.cz` (production)
2. **Generates SSL**: Automatic certificate creation via `statex-dns-service`
3. **Updates Nginx**: Certificate is available for HTTPS immediately

### Manual SSL Management

```bash
# Check SSL status for a subdomain
curl http://localhost:8053/ssl/status/project1345

# Regenerate SSL for a subdomain
curl -X POST http://localhost:8053/ssl/regenerate/project1345

# List all SSL certificates
curl http://localhost:8053/ssl/list
```

## Configuration

### Environment Variables

```bash
# Production domain
PRODUCTION_DOMAIN=statex.cz

# Development domain
DEVELOPMENT_DOMAIN=localhost

# SSL base directory
SSL_BASE_DIR=/ssl

# Let's Encrypt email
LETSENCRYPT_EMAIL=admin@statex.cz

# Node environment
NODE_ENV=development  # or production
```

### Cloudflare Configuration

Create `config/cloudflare.ini`:

```ini
dns_cloudflare_email = admin@statex.cz
dns_cloudflare_api_token = YOUR_CLOUDFLARE_API_TOKEN
```

To get your API token:

1. Go to <https://dash.cloudflare.com/profile/api-tokens>
2. Create a custom token with Zone:Edit permissions
3. Replace `YOUR_CLOUDFLARE_API_TOKEN` with your actual token

## Docker Integration

### SSL-Only Services

```bash
# Start SSL services only
docker-compose -f docker-compose.ssl.yml up -d

# Start with profiles
docker-compose -f docker-compose.ssl.yml --profile production up -d
docker-compose -f docker-compose.ssl.yml --profile development up -d
```

### Production Deployment

```bash
# Start production SSL
docker-compose -f docker-compose.ssl.yml --profile production up -d

# Check SSL status
docker logs statex.cz_ssl_prod

# Renew certificates
docker-compose -f docker-compose.ssl.yml exec ssl-production certbot renew
```

### Development Deployment

```bash
# Start development SSL
docker-compose -f docker-compose.ssl.yml --profile development up -d

# Check SSL status
docker logs statex.cz_ssl_dev
```

## Troubleshooting

### Common Issues

#### 1. Certificate Generation Fails

```bash
# Check logs
docker logs statex.cz_ssl_prod

# Verify Cloudflare credentials
cat config/cloudflare.ini

# Test DNS resolution
nslookup statex.cz
```

#### 2. Development SSL Not Working

```bash
# Install mkcert
brew install mkcert  # macOS
# or
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"

# Install CA
mkcert -install

# Regenerate certificates
./scripts/ssl-manager.sh --setup-development
```

#### 3. Nginx SSL Errors

```bash
# Check certificate files
ls -la ssl/shared/

# Verify certificate validity
openssl x509 -in ssl/shared/prod-fullchain.pem -text -noout

# Test nginx configuration
docker-compose -f docker-compose.ssl.yml exec nginx-ssl nginx -t
```

### Log Locations

- **SSL Production**: `logs/ssl/production.log`
- **SSL Development**: `logs/ssl/development.log`
- **Nginx**: `logs/nginx/access.log`, `logs/nginx/error.log`
- **Docker**: `docker logs [container_name]`

## Security Considerations

### Certificate Storage

- **Permissions**: Private keys are `600`, certificates are `644`
- **Backup**: Regular backups to `ssl/backup/`
- **Git**: SSL directories are excluded from version control

### Production Security

- **Cloudflare API**: Store credentials securely
- **Renewal**: Automatic renewal every 12 hours
- **Monitoring**: Certificate expiration monitoring
- **Backup**: Regular certificate backups

## Migration from Old System

### 1. Run Cleanup Script

```bash
cd statex-infrastructure
./scripts/cleanup-ssl-conflicts.sh
```

This removes:

- Conflicting wildcard SSL scripts
- Duplicate Docker Compose files
- Old SSL directory structures

### 2. Setup New SSL

```bash
# Setup development
./scripts/ssl-manager.sh --setup-development

# Setup production (after updating Cloudflare credentials)
./scripts/ssl-manager.sh --setup-production
```

### 3. Update Services

- **DNS Service**: Already updated with SSL integration
- **Nginx**: Uses unified certificates from `ssl/shared/`
- **Docker**: Uses new SSL services

## API Reference

### DNS Service SSL Endpoints

```bash
# Get SSL status for subdomain
GET /ssl/status/:subdomain

# Regenerate SSL for subdomain
POST /ssl/regenerate/:subdomain

# Remove SSL for subdomain
DELETE /ssl/:subdomain

# List all SSL certificates
GET /ssl/list

# Check SSL health
GET /ssl/health
```

### SSL Manager API

```bash
# Status check
./scripts/ssl-manager.sh --status

# Backup certificates
./scripts/ssl-manager.sh --backup

# Renew certificates
./scripts/ssl-manager.sh --renew
```

## Best Practices

### 1. Certificate Management

- **Regular Backups**: Run `--backup` before major changes
- **Monitor Expiration**: Check `--status` regularly
- **Test Renewal**: Test renewal in staging before production

### 2. Development Workflow

- **Use mkcert**: For local development SSL
- **Test Subdomains**: Verify dynamic subdomain SSL generation
- **Clean Up**: Remove unused development certificates

### 3. Production Workflow

- **Cloudflare Setup**: Ensure DNS API access
- **Monitor Renewal**: Check renewal logs regularly
- **Backup Strategy**: Implement certificate backup strategy

## Support

For issues or questions:

1. **Check Logs**: Review relevant log files
2. **Run Status**: Use `./scripts/ssl-manager.sh --status`
3. **Test Commands**: Try individual SSL commands
4. **Documentation**: Refer to this guide and inline help

## Changelog

### v1.0.0 - Unified SSL Management

- ✅ Single source of truth in `statex-infrastructure/`
- ✅ Wildcard SSL for both production and development
- ✅ Dynamic subdomain SSL generation
- ✅ DNS service integration
- ✅ Unified certificate management
- ✅ Conflict cleanup and migration tools
