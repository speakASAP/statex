#!/bin/bash

# StateX Platform Health Check Script

set -e

echo "🏥 Performing health check on StateX Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $service_name... "
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null); then
        if [ "$response" = "$expected_status" ]; then
            echo -e "${GREEN}✓ Healthy${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠ Status $response${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ Unreachable${NC}"
        return 1
    fi
}

# Function to check Docker container
check_container() {
    local container_name=$1
    
    echo -n "Checking container $container_name... "
    
    if docker ps --format "table {{.Names}}" | grep -q "^$container_name$"; then
        if docker ps --format "table {{.Status}}" --filter "name=$container_name" | grep -q "Up"; then
            echo -e "${GREEN}✓ Running${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠ Not running${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ Not found${NC}"
        return 1
    fi
}

echo "🐳 Checking Docker containers..."
check_container "statex-platform_postgres_1"
check_container "statex-platform_redis_1"
check_container "statex-platform_rabbitmq_1"
check_container "statex-platform_minio_1"
check_container "statex-platform_elasticsearch_1"
check_container "statex-platform_submission-service_1"
check_container "statex-platform_api-gateway_1"

echo ""
echo "🌐 Checking service endpoints..."

# Wait a moment for services to be ready
sleep 2

# Check service health endpoints
check_service "API Gateway" "http://localhost/health" 200
check_service "Submission Service" "http://localhost:8002/health" 200
check_service "User Portal" "http://localhost:8001/health" 200
check_service "AI Orchestrator" "http://localhost:8003/health" 200
check_service "AI Workers" "http://localhost:8004/health" 200
check_service "Notification Service" "http://localhost:8005/health" 200
check_service "Content Service" "http://localhost:8006/health" 200
check_service "Logging Service" "http://localhost:8007/health" 200

echo ""
echo "📊 Checking monitoring services..."
check_service "Prometheus" "http://localhost:9090/-/healthy" 200
check_service "Grafana" "http://localhost:${GRAFANA_PORT:-3000}/api/health" 200

echo ""
echo "🔍 Checking database connectivity..."
if docker exec statex-platform_postgres_1 pg_isready -U statex -d statex > /dev/null 2>&1; then
    echo -e "PostgreSQL: ${GREEN}✓ Connected${NC}"
else
    echo -e "PostgreSQL: ${RED}✗ Connection failed${NC}"
fi

echo ""
echo "🔍 Checking Redis connectivity..."
if docker exec statex-platform_redis_1 redis-cli ping > /dev/null 2>&1; then
    echo -e "Redis: ${GREEN}✓ Connected${NC}"
else
    echo -e "Redis: ${RED}✗ Connection failed${NC}"
fi

echo ""
echo "🔍 Checking RabbitMQ connectivity..."
if docker exec statex-platform_rabbitmq_1 rabbitmq-diagnostics ping > /dev/null 2>&1; then
    echo -e "RabbitMQ: ${GREEN}✓ Connected${NC}"
else
    echo -e "RabbitMQ: ${RED}✗ Connection failed${NC}"
fi

echo ""
echo "🔍 Checking MinIO connectivity..."
if docker exec statex-platform_minio_1 curl -f http://localhost:9000/minio/health/live > /dev/null 2>&1; then
    echo -e "MinIO: ${GREEN}✓ Connected${NC}"
else
    echo -e "MinIO: ${RED}✗ Connection failed${NC}"
fi

echo ""
echo "🔍 Checking Elasticsearch connectivity..."
if docker exec statex-platform_elasticsearch_1 curl -f http://localhost:9200/_cluster/health > /dev/null 2>&1; then
    echo -e "Elasticsearch: ${GREEN}✓ Connected${NC}"
else
    echo -e "Elasticsearch: ${RED}✗ Connection failed${NC}"
fi

echo ""
echo "📈 System resource usage:"
echo "Memory usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep statex-platform

echo ""
echo "💾 Disk usage:"
df -h | grep -E "(Filesystem|/dev/)"

echo ""
echo "✅ Health check completed!"
echo ""
echo "Access URLs:"
echo "  🌐 Main Platform: http://localhost"
echo "  📊 Prometheus: http://localhost:9090"
echo "  📈 Grafana: http://localhost:${GRAFANA_PORT:-3000} (admin/admin)"
echo "  🔧 RabbitMQ Management: http://localhost:15672 (statex/statex_password)"
echo "  📁 MinIO Console: http://localhost:9001 (statex/statex_password)"
