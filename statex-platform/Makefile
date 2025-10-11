# StateX Platform Makefile

.PHONY: help setup dev build test lint clean deploy status logs health-check stop restart logs-follow logs-service exec shell db-connect db-migrate db-backup db-restore restart-service service-logs deploy-web deploy-app security-scan quality format monitor shell-db

# Default target
help:
	@echo "StateX Platform - Available Commands:"
	@echo ""
	@echo "Setup:"
	@echo "  setup          Set up development environment"
	@echo "  install        Install dependencies"
	@echo "  clean          Clean up containers and volumes"
	@echo ""
	@echo "Development:"
	@echo "  dev            Use './manage.sh start' instead"
	@echo "  stop           Use './manage.sh stop' instead"
	@echo "  restart        Use './manage.sh restart' instead"
	@echo "  build          Build all services"
	@echo "  test           Run all tests"
	@echo "  lint           Run linting and formatting"
	@echo "  format         Format code with black and isort"
	@echo "  quality        Run all quality checks (test + lint + security)"
	@echo "  security-scan  Run security vulnerability scan"
	@echo ""
	@echo "Service Management:"
	@echo "  status         Use './manage.sh status' instead"
	@echo "  logs           Use './manage.sh logs' instead"
	@echo "  logs-follow    Follow service logs in real-time"
	@echo "  logs-service   View logs for specific service (SERVICE=name)"
	@echo "  restart-service Restart specific service (SERVICE=name)"
	@echo "  service-logs   View logs for specific service (SERVICE=name)"
	@echo "  exec           Execute command in service container (SERVICE=name COMMAND='cmd')"
	@echo "  shell          Access service shell (SERVICE=name)"
	@echo ""
	@echo "Database Operations:"
	@echo "  db-connect     Connect to PostgreSQL database"
	@echo "  db-migrate     Run database migrations"
	@echo "  db-backup      Create database backup"
	@echo "  db-restore     Restore database from backup (BACKUP_FILE=file.sql)"
	@echo "  shell-db       Open database shell"
	@echo ""
	@echo "Monitoring:"
	@echo "  health-check   Use './manage.sh health' instead"
	@echo "  monitor        Open monitoring dashboards (Prometheus + Grafana)"
	@echo ""
	@echo "Deployment:"
	@echo "  deploy-dev     Deploy to development"
	@echo "  deploy-prod    Deploy to production (DOMAIN=api.statex.cz WEB_DOMAIN=statex.cz)"
	@echo "  deploy-web     Deploy web server only (DOMAIN=statex.cz)"
	@echo "  deploy-app     Deploy application server only (DOMAIN=api.statex.cz)"
	@echo "  deploy-full-stack Deploy everything (infrastructure + platform + website)"
	@echo ""
	@echo "Maintenance:"
	@echo "  backup         Create backup"
	@echo "  restore        Restore from backup"
	@echo ""
	@echo "Examples:"
	@echo "  make logs-service SERVICE=submission-service"
	@echo "  make exec SERVICE=user-portal COMMAND='python manage.py shell'"
	@echo "  make deploy-prod DOMAIN=api.statex.cz WEB_DOMAIN=statex.cz"

# Setup
setup: install
	@echo "Setting up StateX Platform..."
	@cp .env.example .env
	@echo "Environment file created. Please update .env with your configuration."
	@echo "Setup complete!"

install:
	@echo "Installing dependencies..."
	@python3 -m pip install --upgrade pip
	@python3 -m pip install -r requirements.txt
	@echo "Dependencies installed!"

# Development - Use ./manage.sh start instead
dev:
	@echo "Use './manage.sh start' to start all services"
	@echo "This ensures proper service orchestration and startup order"

build:
	@echo "Building all services..."
	@docker compose build
	@echo "Build complete!"

# Testing
test:
	@echo "Running tests..."
	@docker compose exec user-portal python -m pytest tests/ -v
	@docker compose exec submission-service python -m pytest tests/ -v
	@docker compose exec ai-orchestrator python -m pytest tests/ -v
	@docker compose exec ai-workers python -m pytest tests/ -v
	@docker compose exec notification-service python -m pytest tests/ -v
	@docker compose exec content-service python -m pytest tests/ -v
	@docker compose exec logging-service python -m pytest tests/ -v
	@echo "Tests completed!"

lint:
	@echo "Running linting..."
	@docker compose exec user-portal python -m black app/ --check
	@docker compose exec user-portal python -m isort app/ --check-only
	@docker compose exec user-portal python -m flake8 app/
	@echo "Linting completed!"

format:
	@echo "Formatting code..."
	@docker compose exec user-portal python -m black app/
	@docker compose exec user-portal python -m isort app/
	@echo "Code formatted!"

# Deployment
deploy-dev:
	@echo "Deploying to development..."
	@docker compose -f docker compose.yml up -d
	@echo "Development deployment complete!"

# Status and Monitoring
status:
	@echo "Checking service status..."
	@docker compose ps
	@echo ""
	@echo "Service health:"
	@curl -s http://localhost:${API_GATEWAY_EXTERNAL_PORT:-8001}/health || echo "API Gateway: DOWN"
	@curl -s http://localhost:${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}/health || echo "Submission Service: DOWN"
	@curl -s http://localhost:${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}/health || echo "AI Orchestrator: DOWN"
	@curl -s http://localhost:${AI_WORKERS_EXTERNAL_PORT:-8017}/health || echo "AI Workers: DOWN"
	@curl -s http://localhost:${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}/health || echo "Notification Service: DOWN"
	@curl -s http://localhost:${CONTENT_SERVICE_EXTERNAL_PORT:-8006}/health || echo "Content Service: DOWN"
	@curl -s http://localhost:${LOGGING_SERVICE_EXTERNAL_PORT:-8007}/health || echo "Logging Service: DOWN"

logs:
	@echo "Viewing service logs..."
	@docker compose logs -f

health-check:
	@echo "Performing health check..."
	@./scripts/health-check.sh

# Maintenance
clean:
	@echo "Cleaning up..."
	@docker compose stop -v
	@docker system prune -f
	@echo "Cleanup complete!"

backup:
	@echo "Creating backup..."
	@./scripts/backup.sh
	@echo "Backup complete!"

restore:
	@echo "Restoring from backup..."
	@./scripts/restore.sh
	@echo "Restore complete!"

# Database operations
migrate:
	@echo "Running database migrations..."
	@docker compose exec user-portal python manage.py migrate
	@docker compose exec submission-service python -m alembic upgrade head
	@echo "Migrations complete!"

seed:
	@echo "Seeding database..."
	@docker compose exec user-portal python manage.py loaddata fixtures/initial_data.json
	@echo "Database seeded!"

# Service-specific operations
restart-service:
	@echo "Restarting service: $(SERVICE)"
	@docker compose restart $(SERVICE)

scale-service:
	@echo "Scaling service: $(SERVICE) to $(REPLICAS) replicas"
	@docker compose up -d --scale $(SERVICE)=$(REPLICAS)

# Development helpers
shell:
	@echo "Opening shell for service: $(SERVICE)"
	@docker compose exec $(SERVICE) /bin/bash

shell-db:
	@echo "Opening database shell..."
	@docker compose exec postgres psql -U statex -d statex

# Monitoring
monitor:
	@echo "Opening monitoring dashboards..."
	@echo "Prometheus: http://localhost:${PROMETHEUS_EXTERNAL_PORT:-9090}"
	@echo "Grafana: http://localhost:${GRAFANA_EXTERNAL_PORT:-3000} (admin/admin)"
	@open http://localhost:${PROMETHEUS_EXTERNAL_PORT:-9090} || true
	@open http://localhost:${GRAFANA_EXTERNAL_PORT:-3000} || true

# Service Management - Use ./manage.sh instead
stop:
	@echo "Use './manage.sh stop' to stop all services"
	@echo "This ensures proper service shutdown order"

restart:
	@echo "Use './manage.sh restart' to restart all services"
	@echo "This ensures proper service orchestration"

logs-follow:
	@echo "Following service logs..."
	@docker compose logs -f

logs-service:
	@echo "Viewing logs for service: $(SERVICE)"
	@docker compose logs -f $(SERVICE)

service-logs:
	@echo "Viewing logs for service: $(SERVICE)"
	@docker compose logs -f $(SERVICE)

exec:
	@echo "Executing command in service: $(SERVICE)"
	@docker compose exec $(SERVICE) $(COMMAND)

# Database Operations
db-connect:
	@echo "Connecting to PostgreSQL database..."
	@docker compose exec postgres psql -U statex -d statex

db-migrate:
	@echo "Running database migrations..."
	@docker compose exec user-portal python manage.py migrate
	@docker compose exec submission-service python -m alembic upgrade head
	@echo "Migrations complete!"

db-backup:
	@echo "Creating database backup..."
	@mkdir -p backups
	@docker compose exec postgres pg_dump -U statex statex > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Database backup created in backups/ directory"

db-restore:
	@echo "Restoring database from backup: $(BACKUP_FILE)"
	@docker compose exec -i postgres psql -U statex -d statex < $(BACKUP_FILE)
	@echo "Database restored from $(BACKUP_FILE)"

# Quality Assurance
security-scan:
	@echo "Running security vulnerability scan..."
	@docker compose exec user-portal python -m safety check
	@docker compose exec submission-service python -m safety check
	@docker compose exec ai-orchestrator python -m safety check
	@docker compose exec ai-workers python -m safety check
	@docker compose exec notification-service python -m safety check
	@docker compose exec content-service python -m safety check
	@docker compose exec logging-service python -m safety check
	@echo "Security scan completed!"

quality: test lint security-scan
	@echo "All quality checks completed!"

# Production Deployment Commands
deploy-web:
	@echo "Deploying web server to: $(DOMAIN)"
	@./scripts/production-deploy.sh web $(DOMAIN)

deploy-app:
	@echo "Deploying application server to: $(DOMAIN)"
	@./scripts/production-deploy.sh application $(DOMAIN)

# Enhanced Production Deployment
deploy-prod:
	@echo "Deploying to production..."
	@if [ -z "$(DOMAIN)" ] || [ -z "$(WEB_DOMAIN)" ]; then \
		echo "Usage: make deploy-prod DOMAIN=api.statex.cz WEB_DOMAIN=statex.cz"; \
		exit 1; \
	fi
	@./scripts/production-deploy.sh both $(DOMAIN) $(WEB_DOMAIN)

deploy-full-stack:
	@echo "Deploying full stack (infrastructure + platform + website)..."
	@./scripts/deploy-full-stack.sh

# Service Health Check with Details
health-check-detailed:
	@echo "Performing detailed health check..."
	@echo "=========================================="
	@echo "Service Health Status:"
	@echo "=========================================="
	@for port in 8001 8002 8005 8006 8007 8008 8009 8010 8011 8012 8013 8014 8015 8016 8017; do \
		echo -n "Port $$port: "; \
		curl -s http://localhost:$$port/health | jq -r '.status // "DOWN"' 2>/dev/null || echo "DOWN"; \
	done
	@echo "=========================================="
	@echo "Infrastructure Health:"
	@echo "=========================================="
	@echo -n "PostgreSQL: "; docker compose exec postgres pg_isready -U statex >/dev/null 2>&1 && echo "UP" || echo "DOWN"
	@echo -n "Redis: "; docker compose exec redis redis-cli ping >/dev/null 2>&1 && echo "UP" || echo "DOWN"
	@echo -n "RabbitMQ: "; curl -s http://localhost:${RABBITMQ_MANAGEMENT_EXTERNAL_PORT:-15672}/api/overview >/dev/null 2>&1 && echo "UP" || echo "DOWN"
	@echo -n "MinIO: "; curl -s http://localhost:${MINIO_EXTERNAL_PORT:-9000}/minio/health/live >/dev/null 2>&1 && echo "UP" || echo "DOWN"
	@echo -n "Elasticsearch: "; curl -s http://localhost:${ELASTICSEARCH_EXTERNAL_PORT:-9200}/_cluster/health >/dev/null 2>&1 && echo "UP" || echo "DOWN"
	@echo -n "Prometheus: "; curl -s http://localhost:${PROMETHEUS_EXTERNAL_PORT:-9090}/-/healthy >/dev/null 2>&1 && echo "UP" || echo "DOWN"
	@echo -n "Grafana: "; curl -s http://localhost:${GRAFANA_EXTERNAL_PORT:-3002}/api/health >/dev/null 2>&1 && echo "UP" || echo "DOWN"

# Resource Monitoring
resources:
	@echo "Docker resource usage:"
	@docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

# Cleanup Commands
clean-all:
	@echo "Cleaning up everything..."
	@docker compose stop -v --remove-orphans
	@docker system prune -a -f
	@docker volume prune -f
	@docker network prune -f
	@echo "Complete cleanup finished!"

# Development Helpers
dev-logs:
	@echo "Following development logs (last 100 lines)..."
	@docker compose logs --tail=100 -f

dev-status:
	@echo "Development environment status:"
	@docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

# Service Scaling
scale:
	@echo "Scaling service: $(SERVICE) to $(REPLICAS) replicas"
	@docker compose up -d --scale $(SERVICE)=$(REPLICAS)

# Network Operations
network-info:
	@echo "Docker networks:"
	@docker network ls
	@echo ""
	@echo "StateX network details:"
	@docker network inspect statex-platform_default

# Volume Management
volumes:
	@echo "Docker volumes:"
	@docker volume ls
	@echo ""
	@echo "StateX volumes:"
	@docker volume ls | grep statex-platform

# Image Management
images:
	@echo "Docker images:"
	@docker images | grep statex-platform

clean-images:
	@echo "Cleaning up StateX images..."
	@docker images | grep statex-platform | awk '{print $$3}' | xargs docker rmi -f
	@echo "StateX images cleaned!"

# Port Information
ports:
	@echo "Service ports:"
	@echo "Website: http://localhost:$${FRONTEND_PORT:-3000}"
	@echo "API Gateway: http://localhost (80, 443)"
	@echo "API Gateway: http://localhost:${API_GATEWAY_EXTERNAL_PORT:-8001}"
	@echo "Submission Service: http://localhost:${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}"
	@echo "AI Orchestrator: http://localhost:${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}"
	@echo "AI Workers: http://localhost:${AI_WORKERS_EXTERNAL_PORT:-8017}"
	@echo "Notification Service: http://localhost:${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}"
	@echo "Content Service: http://localhost:${CONTENT_SERVICE_EXTERNAL_PORT:-8006}"
	@echo "Logging Service: http://localhost:${LOGGING_SERVICE_EXTERNAL_PORT:-8007}"
	@echo "Prometheus: http://localhost:${PROMETHEUS_EXTERNAL_PORT:-9090}"
	@echo "Grafana: http://localhost:${GRAFANA_EXTERNAL_PORT:-3002}"
	@echo "PostgreSQL: localhost:${POSTGRES_EXTERNAL_PORT:-5432}"
	@echo "Redis: localhost:${REDIS_EXTERNAL_PORT:-6379}"
	@echo "RabbitMQ: localhost:${RABBITMQ_MANAGEMENT_EXTERNAL_PORT:-15672} (Management UI)"
	@echo "MinIO: localhost:${MINIO_EXTERNAL_PORT:-9000}-${MINIO_CONSOLE_EXTERNAL_PORT:-9001}"
	@echo "Elasticsearch: localhost:${ELASTICSEARCH_EXTERNAL_PORT:-9200}"
