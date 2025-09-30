# Core Platform Services Environment Variables Migration

This document outlines the migration of hardcoded values for Core Platform Services to environment variables.

## **🎯 Objective**

Replace all hardcoded values for Core Platform Services (API Gateway and Platform Management) with environment variables to improve maintainability and flexibility.

## **📋 Services Migrated**

### **API Gateway**

- **Container Name**: `statex_api_gateway_dev` → `${API_GATEWAY_CONTAINER_NAME:-statex_api_gateway_dev}`
- **External Port**: `8001` → `${API_GATEWAY_EXTERNAL_PORT:-8001}`
- **Internal Port**: `80` → `${API_GATEWAY_INTERNAL_PORT:-80}`
- **URL**: `http://localhost:8001` → `${API_GATEWAY_URL:-http://localhost:8001}`

### **Platform Management**

- **Container Name**: `statex_platform_management_dev` → `${PLATFORM_MANAGEMENT_CONTAINER_NAME:-statex_platform_management_dev}`
- **External Port**: `8000` → `${PLATFORM_MANAGEMENT_EXTERNAL_PORT:-8000}`
- **Internal Port**: `8000` → `${PLATFORM_MANAGEMENT_INTERNAL_PORT:-8000}`
- **URL**: `http://localhost:8000` → `${PLATFORM_MANAGEMENT_URL:-http://localhost:8000}`

## **🔧 Files Modified**

### **Docker Compose Files**

- `statex-platform/docker-compose.dev.yml`
- `statex-platform/docker-compose.yml`

### **Scripts**

- `scripts/start-dev-all.sh`
- `scripts/stop-dev-all.sh`
- `scripts/start-dev-parallel.sh`
- `statex-platform/scripts/dev-manage.sh`
- `statex-platform/scripts/health-check.sh`

### **Configuration Files**

- `statex-platform/services-registry.conf`
- `statex-platform/Makefile`

### **Documentation**

- `docs/SERVICES_AND_PORTS_REFERENCE.md`

## **🌍 Environment Variables**

### **API Gateway Variables**

```bash
API_GATEWAY_CONTAINER_NAME=statex_api_gateway_dev
API_GATEWAY_EXTERNAL_PORT=8001
API_GATEWAY_INTERNAL_PORT=80
API_GATEWAY_URL=http://localhost:8001
API_GATEWAY_INTERNAL_URL=http://api-gateway:80
```

### **Platform Management Variables**

```bash
PLATFORM_MANAGEMENT_CONTAINER_NAME=statex_platform_management_dev
PLATFORM_MANAGEMENT_EXTERNAL_PORT=8000
PLATFORM_MANAGEMENT_INTERNAL_PORT=8000
PLATFORM_MANAGEMENT_URL=http://localhost:8000
PLATFORM_MANAGEMENT_INTERNAL_URL=http://platform-management:8000
```

### **Legacy Compatibility**

```bash
PLATFORM_URL=${PLATFORM_MANAGEMENT_URL}
```

## **📝 Usage Examples**

### **Setting Custom Ports**

```bash
# Set custom ports for development
export API_GATEWAY_EXTERNAL_PORT=9001
export PLATFORM_MANAGEMENT_EXTERNAL_PORT=9000

# Start services with custom ports
docker compose -f statex-platform/docker-compose.dev.yml up -d
```

### **Production Configuration**

```bash
# Production environment
export API_GATEWAY_CONTAINER_NAME=statex_api_gateway_prod
export PLATFORM_MANAGEMENT_CONTAINER_NAME=statex_platform_management_prod
export API_GATEWAY_EXTERNAL_PORT=80
export PLATFORM_MANAGEMENT_EXTERNAL_PORT=8000
```

### **Health Checks with Variables**

```bash
# Check API Gateway health
curl http://localhost:${API_GATEWAY_EXTERNAL_PORT:-8001}/health

# Check Platform Management health
curl http://localhost:${PLATFORM_MANAGEMENT_EXTERNAL_PORT:-8000}/health
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

- `API_GATEWAY_EXTERNAL_PORT:-8001` (defaults to 8001)
- `PLATFORM_MANAGEMENT_EXTERNAL_PORT:-8000` (defaults to 8000)

### **Docker Compose**

The `docker-compose` command will automatically substitute environment variables:

```bash
# This will use the environment variable or default
ports:
  - "${API_GATEWAY_EXTERNAL_PORT:-8001}:${API_GATEWAY_INTERNAL_PORT:-80}"
```

### **Script Compatibility**

All scripts now use environment variables with fallbacks, ensuring they work with or without custom configuration.

## **📚 Related Documentation**

- [Services & Ports Reference](./SERVICES_AND_PORTS_REFERENCE.md)
- [Environment Setup Guide](../statex-platform/docs/environment-configuration.md)
- [Development Guide](../statex-platform/docs/development-guide.md)

---

**Migration Date**: September 29, 2025  
**Version**: 1.0.0  
**Status**: Completed
