#!/bin/bash

# StateX Monitoring Service Setup Script
# This script sets up the complete monitoring stack for StateX microservices

echo "🔍 Setting up StateX Monitoring Service..."

# Check if we're in the monitoring directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the statex-monitoring directory"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

echo "🐳 Starting monitoring stack..."

# Start the monitoring services
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Prometheus (Port 9090)
if curl -s http://localhost:9090/-/healthy > /dev/null; then
    echo "✅ Prometheus (9090) - Ready"
else
    echo "❌ Prometheus (9090) - Not ready"
fi

# Grafana (Port 3000)
if curl -s http://localhost:${GRAFANA_PORT:-3000}/api/health > /dev/null; then
    echo "✅ Grafana (3000) - Ready"
else
    echo "❌ Grafana (3000) - Not ready"
fi

# Loki (Port 3100)
if curl -s http://localhost:3100/ready > /dev/null; then
    echo "✅ Loki (3100) - Ready"
else
    echo "❌ Loki (3100) - Not ready"
fi

# Jaeger (Port 16686)
if curl -s http://localhost:16686/api/services > /dev/null; then
    echo "✅ Jaeger (16686) - Ready"
else
    echo "❌ Jaeger (16686) - Not ready"
fi

# StateX Monitoring Service (Port 8007)
if curl -s http://localhost:8007/health > /dev/null; then
    echo "✅ StateX Monitoring Service (8007) - Ready"
else
    echo "❌ StateX Monitoring Service (8007) - Not ready"
fi

# Node Exporter (Port 9100)
if curl -s http://localhost:9100/metrics > /dev/null; then
    echo "✅ Node Exporter (9100) - Ready"
else
    echo "❌ Node Exporter (9100) - Not ready"
fi

# cAdvisor (Port 8081)
if curl -s http://localhost:8081/metrics > /dev/null; then
    echo "✅ cAdvisor (8081) - Ready"
else
    echo "❌ cAdvisor (8081) - Not ready"
fi

# Blackbox Exporter (Port 9115)
if curl -s http://localhost:9115/metrics > /dev/null; then
    echo "✅ Blackbox Exporter (9115) - Ready"
else
    echo "❌ Blackbox Exporter (9115) - Not ready"
fi

echo ""
echo "🎉 StateX Monitoring Service Setup Complete!"
echo ""
echo "📋 Available Monitoring Interfaces:"
echo "  • Grafana: http://localhost:${GRAFANA_PORT:-3000} (admin/statex123)"
echo "  • Prometheus: http://localhost:9090"
echo "  • Jaeger: http://localhost:16686"
echo "  • Loki: http://localhost:3100"
echo "  • StateX Monitoring API: http://localhost:8007"
echo ""
echo "📊 Available Dashboards:"
echo "  • AI Agents Dashboard: http://localhost:${GRAFANA_PORT:-3000}/d/ai-agents"
echo "  • System Overview: http://localhost:${GRAFANA_PORT:-3000}/d/system-overview"
echo "  • Service Health: http://localhost:${GRAFANA_PORT:-3000}/d/service-health"
echo ""
echo "🔧 To test the monitoring:"
echo "  curl http://localhost:8007/api/status"
echo "  curl http://localhost:8007/api/ai-agents"
echo "  curl http://localhost:8007/metrics"
echo ""
echo "📊 To view service status:"
echo "  docker compose ps"
echo ""
echo "🛑 To stop services:"
echo "  docker compose down"
echo ""
echo "📚 For more information, see README.md"
