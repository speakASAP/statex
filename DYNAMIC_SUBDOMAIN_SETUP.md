# Dynamic Subdomain Management System

This document describes the complete solution for managing dynamic subdomains in the StateX platform without manual `/etc/hosts` entries.

## Overview

The system consists of:

1. **DNS Microservice** - Handles subdomain registration and DNS resolution
2. **Database** - Stores subdomain mappings and customer information
3. **DNS Server** - Resolves `*.localhost` domains to `127.0.0.1`
4. **Frontend Integration** - Automatic subdomain generation and management

## Architecture

```text
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   DNS Service    │    │   DNS Server    │
│   (Next.js)     │───▶│   (Port 8053)    │───▶│   (Port 5353)   │
│                 │    │                  │    │                 │
│ - Register      │    │ - API Endpoints  │    │ - *.localhost   │
│ - Manage        │    │ - Database       │    │ - Resolution    │
│ - Resolve       │    │ - Validation     │    │ - Caching       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   SQLite DB     │
                       │                 │
                       │ - Subdomains    │
                       │ - Customers     │
                       │ - Metadata      │
                       └─────────────────┘
```

## Quick Start

### 1. Install DNS Service

```bash
cd statex-dns-service
npm install
```

### 2. Setup Local DNS Resolution

```bash
# macOS
./scripts/setup-local-dns.sh

# Linux
sudo ./scripts/setup-local-dns.sh
```

### 3. Start DNS Service

```bash
# Development
npm run dev

# Production
npm start

# Docker
docker-compose up -d
```

### 4. Test the System

```bash
# Register a subdomain
curl -X POST http://localhost:8053/api/subdomains \
  -H 'Content-Type: application/json' \
  -d '{
    "subdomain": "project-test",
    "customerId": "customer-123",
    "prototypeId": "proto-456",
    "targetUrl": "http://localhost:3000/prototype-results/proto-456"
  }'

# Test DNS resolution
nslookup project-test.localhost

# Should return: 127.0.0.1
```

## API Reference

### Register Subdomain

```http
POST /api/subdomains
Content-Type: application/json

{
  "subdomain": "project-abc123",
  "customerId": "customer-456",
  "prototypeId": "proto-789",
  "targetUrl": "http://project-abc123.localhost:3000",
  "expiresAt": "2024-12-31T23:59:59Z",
  "metadata": {
    "type": "prototype",
    "priority": "high"
  }
}
```

**Important**: The `targetUrl` should be the subdomain itself, not a redirect path. The system serves content directly on the subdomain without redirects to `/prototype-results/` paths.

### Get Subdomain Info

```http
GET /api/subdomains/project-abc123
```

### List Subdomains

```http
GET /api/subdomains?customerId=customer-456&status=active&limit=10&offset=0
```

### Update Subdomain

```http
PUT /api/subdomains/project-abc123
Content-Type: application/json

{
  "status": "inactive",
  "targetUrl": "http://localhost:3000/new-path"
}
```

### Delete Subdomain

```http
DELETE /api/subdomains/project-abc123
```

### Resolve Domain

```http
GET /api/resolve/project-abc123.localhost
```

## Frontend Integration

### Using the DNS Service

```typescript
import { dnsService } from '@/lib/services/dnsService';

// Register a prototype subdomain
const subdomain = await dnsService.registerPrototypeSubdomain(
  'proto-123',
  'customer-456'
);

// Get subdomain URL
const url = dnsService.getPrototypeUrl('proto-123', subdomain.subdomain);

// Check if current request is from subdomain
if (dnsService.isSubdomainRequest(window.location.hostname)) {
  const subdomain = dnsService.extractSubdomain(window.location.hostname);
  // Handle subdomain-specific logic
}
```

### Environment Configuration

Add to your `.env` file:

```env
NEXT_PUBLIC_DNS_SERVICE_URL=http://localhost:8053
```

## Database Schema

### Subdomains Table

```sql
CREATE TABLE subdomains (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subdomain TEXT UNIQUE NOT NULL,
  customer_id TEXT NOT NULL,
  prototype_id TEXT,
  target_url TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  metadata TEXT
);
```

### Customers Table

```sql
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active',
  metadata TEXT
);
```

## Production Deployment

### 1. DNS Configuration

For production, you'll need to configure your DNS provider to point `*.statex.cz` to your server.

### 2. SSL Certificates

Use Let's Encrypt with wildcard certificates:

```bash
certbot certonly --manual --preferred-challenges dns -d "*.statex.cz"
```

### 3. Environment Variables

```env
NODE_ENV=production
DNS_SERVICE_PORT=8053
DNS_PORT=53
DATABASE_PATH=/app/data/subdomains.db
LOG_LEVEL=info
```

### 4. Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring and Maintenance

### Health Checks

```bash
# Check service health
curl http://localhost:8053/health

# Check DNS resolution
nslookup project-test.localhost
```

### Logs

```bash
# View logs
tail -f logs/combined.log
tail -f logs/error.log
```

### Database Maintenance

```bash
# Backup database
cp data/subdomains.db data/subdomains.db.backup

# Cleanup expired subdomains
curl -X POST http://localhost:8053/api/cleanup
```

## Troubleshooting

### Common Issues

1. **DNS not resolving**: Check if DNS service is running and local DNS is configured
2. **Subdomain not found**: Verify subdomain is registered and active
3. **Database errors**: Check database file permissions and disk space
4. **Port conflicts**: Ensure ports 8053 and 5353 are available

### Debug Mode

```bash
LOG_LEVEL=debug npm start
```

### Reset System

```bash
# Stop services
docker-compose down

# Remove database
rm -rf data/

# Restart
docker-compose up -d
```

## Security Considerations

1. **API Authentication**: Implement API keys for production
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Input Validation**: Validate all subdomain inputs
4. **Database Security**: Use proper database permissions
5. **Network Security**: Use HTTPS in production

## Performance Optimization

1. **DNS Caching**: Implement DNS response caching
2. **Database Indexing**: Add indexes for common queries
3. **Connection Pooling**: Use database connection pooling
4. **Load Balancing**: Distribute DNS queries across multiple servers

## Future Enhancements

1. **Multi-tenant Support**: Separate subdomains by tenant
2. **Custom Domains**: Support for customer-owned domains
3. **Analytics**: Track subdomain usage and performance
4. **Auto-cleanup**: Automatic cleanup of expired subdomains
5. **Webhook Support**: Notify external services of subdomain changes
