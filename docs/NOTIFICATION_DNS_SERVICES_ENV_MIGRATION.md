# Notification & DNS Services Environment Variables Migration

This document outlines the migration of hardcoded values for Notification Service and DNS Services to environment variables.

## **🎯 Objective**

Replace all hardcoded values for Notification Service and DNS Services with environment variables to improve maintainability and flexibility.

## **📋 Services Migrated**

### **Notification Service**

- **Container Name**: `statex_notification_dev` → `${NOTIFICATION_SERVICE_CONTAINER_NAME:-statex_notification_dev}`
- **External Port**: `8005` → `${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}`
- **Internal Port**: `8005` → `${NOTIFICATION_SERVICE_INTERNAL_PORT:-8005}`
- **URL**: `http://localhost:8005` → `${NOTIFICATION_SERVICE_URL:-http://localhost:8005}`

### **DNS Service**

- **Container Name**: `statex-dns-service` → `${DNS_SERVICE_CONTAINER_NAME:-statex-dns-service}`
- **HTTP API External Port**: `8053` → `${DNS_SERVICE_EXTERNAL_PORT:-8053}`
- **HTTP API Internal Port**: `8053` → `${DNS_SERVICE_INTERNAL_PORT:-8053}`
- **DNS Server External Port**: `5353` → `${DNS_SERVER_EXTERNAL_PORT:-5353}`
- **DNS Server Internal Port**: `5353` → `${DNS_SERVER_INTERNAL_PORT:-5353}`
- **URL**: `http://localhost:8053` → `${DNS_SERVICE_URL:-http://localhost:8053}`

## **🔧 Files Modified**

### **Docker Compose Files**

- `statex-notification-service/docker-compose.dev.yml`
- `statex-notification-service/docker-compose.yml`
- `statex-dns-service/docker-compose.yml`

### **Scripts**

- `scripts/start-dev-all.sh`
- `scripts/stop-dev-all.sh`
- `statex-platform/scripts/dev-manage.sh`
- `statex-platform/scripts/health-check.sh`

### **Configuration Files**

- `statex-platform/services-registry.conf`
- `statex-platform/Makefile`
- `statex-infrastructure/nginx/api-gateway.conf`

### **Documentation**

- `docs/SERVICES_AND_PORTS_REFERENCE.md`

## **🌍 Environment Variables**

### **Notification Service Variables**

```bash
NOTIFICATION_SERVICE_CONTAINER_NAME=statex_notification_dev
NOTIFICATION_SERVICE_EXTERNAL_PORT=8005
NOTIFICATION_SERVICE_INTERNAL_PORT=8005
NOTIFICATION_SERVICE_URL=http://localhost:8005
NOTIFICATION_SERVICE_INTERNAL_URL=http://notification-service:8005
```

### **DNS Service Variables**

```bash
DNS_SERVICE_CONTAINER_NAME=statex-dns-service
DNS_SERVICE_EXTERNAL_PORT=8053
DNS_SERVICE_INTERNAL_PORT=8053
DNS_SERVICE_URL=http://localhost:8053
DNS_SERVICE_INTERNAL_URL=http://dns-service:8053

DNS_SERVER_EXTERNAL_PORT=5353
DNS_SERVER_INTERNAL_PORT=5353
```

## **📝 Usage Examples**

### **Setting Custom Ports for Notification Service**

```bash
# Set custom ports for development
export NOTIFICATION_SERVICE_EXTERNAL_PORT=9005
export NOTIFICATION_SERVICE_INTERNAL_PORT=9005

# Start notification service with custom ports
docker compose -f statex-notification-service/docker-compose.dev.yml up -d
```

### **Setting Custom Ports for DNS Service**

```bash
# Set custom ports for development
export DNS_SERVICE_EXTERNAL_PORT=9053
export DNS_SERVER_EXTERNAL_PORT=5354

# Start DNS service with custom ports
docker compose -f statex-dns-service/docker-compose.yml up -d
```

### **Production Configuration**

```bash
# Production environment
export NOTIFICATION_SERVICE_CONTAINER_NAME=statex_notification_prod
export DNS_SERVICE_CONTAINER_NAME=statex_dns_prod
export NOTIFICATION_SERVICE_EXTERNAL_PORT=8005
export DNS_SERVICE_EXTERNAL_PORT=8053
```

### **Health Checks with Variables**

```bash
# Check Notification Service health
curl http://localhost:${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}/health

# Check DNS Service health
curl http://localhost:${DNS_SERVICE_EXTERNAL_PORT:-8053}/health
```

## **🔄 Migration Benefits**

### **1. Flexibility**

- Easy port changes without code modifications
- Environment-specific configurations
- Container name customization

### **2. Maintainability**

- Centralized configuration
- Consistent variable naming
- Easy to update across all files

### **3. Scalability**

- Support for multiple environments
- Easy deployment configuration
- Container orchestration compatibility

### **4. Backward Compatibility**

- Default values maintain existing behavior
- Gradual migration possible
- No breaking changes

## **🚀 Next Steps**

### **Immediate Actions**

1. **Test the changes** with default values
2. **Verify all services start** correctly
3. **Check health endpoints** are accessible

### **Future Enhancements**

1. **Create .env files** for different environments
2. **Add validation** for environment variables
3. **Extend migration** to other services
4. **Add documentation** for environment setup

## **⚠️ Important Notes**

### **Default Values**

All environment variables have sensible defaults that maintain the current behavior:

- `NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005` (defaults to 8005)
- `DNS_SERVICE_EXTERNAL_PORT:-8053` (defaults to 8053)
- `DNS_SERVER_EXTERNAL_PORT:-5353` (defaults to 5353)

### **Docker Compose**

The `docker-compose` command will automatically substitute environment variables:

```bash
# This will use the environment variable or default
ports:
  - "${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}:${NOTIFICATION_SERVICE_INTERNAL_PORT:-8005}"
```

### **Script Compatibility**

All scripts now use environment variables with fallbacks, ensuring they work with or without custom configuration.

## **📊 Service Dependencies**

### **Notification Service Dependencies**

- PostgreSQL (for notification storage)
- Redis (for caching)
- RabbitMQ (for message queuing)
- AI Orchestrator (for AI notifications)

### **DNS Service Dependencies**

- None (standalone service)
- Optional: Database for subdomain storage

## **🔍 Testing the Migration**

### **Test Notification Service**

```bash
# Start with default ports
docker compose -f statex-notification-service/docker-compose.dev.yml up -d

# Check health
curl http://localhost:8005/health

# Test with custom ports
export NOTIFICATION_SERVICE_EXTERNAL_PORT=9005
docker compose -f statex-notification-service/docker-compose.dev.yml up -d
curl http://localhost:9005/health
```

### **Test DNS Service**

```bash
# Start with default ports
docker compose -f statex-dns-service/docker-compose.yml up -d

# Check health
curl http://localhost:8053/health

# Test with custom ports
export DNS_SERVICE_EXTERNAL_PORT=9053
docker compose -f statex-dns-service/docker-compose.yml up -d
curl http://localhost:9053/health
```

## **📚 Related Documentation**

- [Services & Ports Reference](./SERVICES_AND_PORTS_REFERENCE.md)
- [Core Platform Services Migration](./CORE_PLATFORM_SERVICES_ENV_MIGRATION.md)
- [Notification Service README](../statex-notification-service/README.md)
- [DNS Service Documentation](../statex-dns-service/README.md)

---

**Migration Date**: September 29, 2025  
**Version**: 1.0.0  
**Status**: Completed
