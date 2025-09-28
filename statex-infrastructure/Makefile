# StateX Infrastructure Management
# Makefile for managing development and production environments

.PHONY: help dev prod stop clean setup-dev setup-prod logs status

# Default target
help:
	@echo "StateX Infrastructure Management"
	@echo "================================"
	@echo ""
	@echo "Available commands:"
	@echo "  make dev          - Start development environment (self-signed certificates)"
	@echo "  make prod         - Start production environment (Let's Encrypt certificates)"
	@echo "  make stop         - Stop all infrastructure services"
	@echo "  make clean        - Clean up containers and volumes"
	@echo "  make setup-dev    - Setup development environment"
	@echo "  make setup-prod   - Setup production environment"
	@echo "  make logs         - Show logs for all services"
	@echo "  make logs-clean   - Clean up old log files"
	@echo "  make logs-size    - Show log directory sizes"
	@echo "  make logs-tail    - Follow logs in real-time"
	@echo "  make status       - Show status of all services"
	@echo ""

# Development environment
dev:
	@echo "🚀 Starting development environment..."
	@echo "📋 Using self-signed certificates for localhost"
	docker compose -f docker-compose.dev.yml --env-file env.dev up -d
	@echo "✅ Development environment started!"
	@echo "🌐 Access your application at:"
	@echo "   - http://localhost"
	@echo "   - https://localhost (with self-signed certificate warning)"

# Production environment
prod:
	@echo "🚀 Starting production environment..."
	@echo "📋 Using Let's Encrypt certificates for $(shell grep VIRTUAL_HOST env.prod | cut -d'=' -f2)"
	docker compose -f docker-compose.prod.yml --env-file env.prod up -d
	@echo "✅ Production environment started!"
	@echo "🌐 Access your application at:"
	@echo "   - http://$(shell grep VIRTUAL_HOST env.prod | cut -d'=' -f2)"
	@echo "   - https://$(shell grep VIRTUAL_HOST env.prod | cut -d'=' -f2)"

# Stop all services
stop:
	@echo "🛑 Stopping all infrastructure services..."
	docker compose -f docker-compose.dev.yml down 2>/dev/null || true
	docker compose -f docker-compose.prod.yml down 2>/dev/null || true
	@echo "✅ All services stopped"

# Clean up
clean: stop
	@echo "🧹 Cleaning up containers and volumes..."
	docker system prune -f
	@echo "✅ Cleanup completed"

# Setup development environment
setup-dev:
	@echo "🔧 Setting up development environment..."
	@echo "📁 Creating necessary directories..."
	mkdir -p ssl-dev logs/nginx logs/certbot webroot
	@echo "🔐 Generating self-signed certificates..."
	chmod +x scripts/generate-self-signed.sh
	./scripts/generate-self-signed.sh
	@echo "✅ Development environment setup completed!"

# Setup production environment
setup-prod:
	@echo "🔧 Setting up production environment..."
	chmod +x scripts/setup-certificate-storage.sh
	./scripts/setup-certificate-storage.sh
	@echo "✅ Production environment setup completed!"

# Show logs
logs:
	@echo "📋 Showing logs for all services..."
	docker compose -f docker-compose.dev.yml logs -f 2>/dev/null || \
	docker compose -f docker-compose.prod.yml logs -f 2>/dev/null || \
	echo "No services running"

# Show status
status:
	@echo "📊 Infrastructure Status"
	@echo "========================"
	@echo ""
	@echo "🐳 Docker Containers:"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep statex || echo "No StateX containers running"
	@echo ""
	@echo "🌐 Network Status:"
	@docker network ls | grep statex_network || echo "StateX network not found"
	@echo ""
	@echo "💾 Volumes:"
	@docker volume ls | grep statex || echo "No StateX volumes found"

# Log management
logs-clean:
	@echo "🧹 Cleaning up old log files..."
	@./scripts/rotate-logs.sh

logs-size:
	@echo "📊 Log directory sizes:"
	@du -sh logs/* 2>/dev/null || echo "No logs found"

logs-tail:
	@echo "📋 Following logs (Ctrl+C to stop)..."
	@docker compose -f docker-compose.dev.yml logs -f 2>/dev/null || \
	docker compose -f docker-compose.prod.yml logs -f 2>/dev/null || \
	echo "No services running"
