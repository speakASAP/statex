# StateX Platform - Central Management System

## Overview

The StateX Platform is a comprehensive microservices-based system that serves as the central management hub for all StateX services. This project orchestrates multiple microservices, manages infrastructure, and provides a unified interface for the entire StateX ecosystem.

**StateX** is a **modern AI-powered business automation platform** that provides rapid prototype generation, AI chat integration, AI-powered automation and comprehensive business solutions for the EU and UAE markets.

## Architecture

### Central Management Hub

- **API Gateway**: Single entry point for all microservices
- **Service Orchestration**: Manages and coordinates all microservices
- **Infrastructure Management**: Automated deployment and scaling
- **Monitoring & Observability**: Centralized monitoring and logging
- **Configuration Management**: Centralized configuration for all services

### Microservices Ecosystem

- **User Portal**: User management and authentication
- **Submission Service**: Form submission and file handling
- **AI Orchestrator**: AI workflow management
- **AI Workers**: AI processing and analysis
- **Notification Service**: Multi-channel notifications
- **Content Service**: Content management and delivery
- **Logging Service**: Centralized logging and audit

## Project Structure

```text
statex-platform/
├── README.md                           # This file
├── docker-compose.yml                  # Local development environment
├── docker-compose.prod.yml             # Production environment
├── requirements.txt                    # Python dependencies
├── pyproject.toml                      # Python project configuration
├── Makefile                           # Development commands
├── .github/                           # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml                     # Continuous Integration
│       ├── cd.yml                     # Continuous Deployment
│       └── security.yml               # Security scanning
├── docs/                              # Project documentation
│   ├── architecture.md                # System architecture
│   ├── deployment.md                  # Deployment guide
│   ├── implementation-plan.md         # Implementation plan
│   └── website-integration-plan.md    # Website integration plan
├── services/                          # Core Platform Services
│   ├── user-portal/                   # User Portal Service
│   ├── submission-service/            # Submission Service
│   └── content-service/               # Content Service
├── infrastructure/                    # Infrastructure as Code
│   ├── kubernetes/                    # Kubernetes manifests
│   ├── helm/                          # Helm charts
│   └── monitoring/                    # Monitoring configurations
├── observability/                     # Observability stack
│   ├── prometheus/                    # Prometheus configuration
│   ├── grafana/                       # Grafana dashboards
│   ├── loki/                          # Loki configuration
│   └── jaeger/                        # Jaeger configuration
├── shared/                            # Shared libraries
│   ├── common/                        # Common utilities
│   ├── events/                        # Event schemas
│   ├── models/                        # Shared data models
│   └── clients/                       # Service clients
├── scripts/                           # Utility scripts
│   ├── setup.sh                       # Environment setup
│   ├── deploy.sh                      # Deployment script
│   └── backup.sh                      # Backup script
└── web/                               # Web server and static content
    ├── nginx/                         # Nginx configuration
    ├── static/                        # Static website files
    └── ssl/                           # SSL certificates
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 23.11.0 (for frontend development)
- Python 3.11 (for backend development)
- Kubernetes cluster (for production)
- Git

### ⚡ Ultra-Fast Development Setup (30 seconds - 2 minutes)

StateX Platform now features an **ultra-fast development script** for maximum development speed:

```bash
# Clone repository
git clone https://github.com/speakASAP/statex-platform.git
cd statex-platform

# Copy environment template
cp ../env.development.template .env.development
# Edit .env.development with your API keys

# 🚀 Ultra-fast startup (only starts missing services)
./dev-manage.sh start --fast

# Quick status check (parallel processing)
./dev-manage.sh status --quick

# Access your services:
# - API Gateway: http://localhost:8001
# - Platform Management: http://localhost:8000
# - Website: http://localhost:3000
# - AI Orchestrator: http://localhost:8010
```

### 🚀 Ultra-Fast Development Commands

**New ultra-fast development workflow:**

- **Ultra-fast startup**: `./dev-manage.sh start --fast` (30s-2min vs 1+ hour)
- **Quick status check**: `./dev-manage.sh status --quick` (6-8s vs 15-20s)
- **Start missing services**: `./dev-manage.sh start-missing`
- **Restart failed services**: `./dev-manage.sh restart-failed`
- **Auto-fix issues**: `./dev-manage.sh fix`
- **Frontend development**: `./dev-manage.sh frontend` (runs locally for faster development)
- **Development mode**: `./dev-manage.sh dev-start`

> **💡 Pro Tip**: See [Ultra-Fast Development Script](docs/ultra-fast-development-script.md) for complete documentation and performance optimizations.

### 🎨 Frontend Development

**For faster frontend development, the frontend runs locally instead of in Docker:**

```bash
# Start frontend locally (recommended for development)
./dev-manage.sh frontend

# Or manually:
cd ../statex-website/frontend
npm install  # Only needed on first run
npm run dev
```

**Frontend Features:**

- Hot reload enabled
- TypeScript support
- Tailwind CSS
- Next.js 15.5.3 with Turbopack
- Available at: <http://localhost:3000>

> **📝 Note**: The frontend is configured to run locally for faster development. All backend services still run in Docker containers.

### Traditional Development Management

**Legacy development workflow:**

- **Start all services**: `./dev-manage.sh start` (2-3 minutes)
- **Start individual service**: `./dev-manage.sh dev [service-name]`
- **Stop all services**: `./dev-manage.sh stop`
- **Check status**: `./dev-manage.sh status`
- **View logs**: `./dev-manage.sh logs [service]`
- **Health check**: `./dev-manage.sh health`

### Legacy Development (Production-like)

```bash
# Set up environment
./manage.sh setup

# Start all services
./manage.sh start --full

# Check service health
./manage.sh health

# View service status
./manage.sh status

# View logs
./manage.sh logs

# Stop all services
./manage.sh stop
```

### Production Deployment

```bash
# Deploy to production
make deploy-prod

# Check deployment status
make status

# View logs
make logs
```

## Services

### Core Platform Services

- **Platform Management** (8000): Central orchestration and coordination
- **API Gateway** (8001): Unified API access point for all services

### All Services Managed by StateX Platform

- **AI Orchestrator**: Port 8010 (orchestrated by statex-platform)
- **AI Services**: Ports 8011-8017 (orchestrated by statex-platform)
- **Notification Service**: Port 8005 (orchestrated by statex-platform)
- **Monitoring Service**: Port 8007 (orchestrated by statex-platform)
- **Logging Service**: Port 8008 (orchestrated by statex-platform)
- **Infrastructure**: Managed by statex-infrastructure (nginx, databases, etc.)

### Services Managed by StateX Website

- **Submission Service**: Port 8002 (managed by statex-website)
- **User Portal**: Port 8006 (managed by statex-website)
- **Content Service**: Port 8009 (managed by statex-website)
- **Website Frontend**: Port 3000 (managed by statex-website)

### Infrastructure Services

- **PostgreSQL**: Primary database with clustering
- **Redis**: Caching and session storage
- **RabbitMQ**: Message broker with clustering
- **MinIO**: S3-compatible object storage
- **Elasticsearch**: Search and analytics engine

## Monitoring and Observability

### Metrics

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Custom Metrics**: Business and application metrics

### Logging

- **Loki**: Log aggregation and storage
- **Structured Logging**: JSON-formatted logs with correlation IDs
- **Centralized Collection**: All service logs in one place

### Tracing

- **Jaeger**: Distributed tracing
- **OpenTelemetry**: Automatic instrumentation
- **Performance Analysis**: Bottleneck identification

## Security

### Authentication & Authorization

- **JWT Tokens**: Stateless authentication
- **OAuth 2.0**: Third-party authentication
- **RBAC**: Role-based access control
- **mTLS**: Mutual TLS for service communication

### Data Protection

- **Encryption at Rest**: Database and storage encryption
- **Encryption in Transit**: TLS for all communications
- **PII Handling**: Special handling for personal data
- **Audit Logging**: Comprehensive audit trails

## Deployment

### Environments

- **Development**: Local Docker Compose environment
- **Staging**: Kubernetes staging cluster
- **Production**: Kubernetes production cluster

### CI/CD Pipeline

- **GitHub Actions**: Automated testing and deployment
- **Docker**: Containerization of all services
- **Kubernetes**: Container orchestration
- **Helm**: Package management

## API Documentation

### Endpoints

- **API Gateway**: <http://localhost:8001> (unified access to all services)
- **Platform Management**: <http://localhost:8000>
- **User Portal**: <http://localhost:8006>
- **Submission Service**: <http://localhost:8002>
- **Content Service**: <http://localhost:8009>
- **Website Frontend**: <http://localhost:${FRONTEND_PORT:-3000}>

### Authentication

All API endpoints require authentication via JWT tokens.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- **Documentation**: [docs.statex.cz](https://docs.statex.cz)
- **Issues**: [GitHub Issues](https://github.com/speakASAP/statex-platform/issues)
- **Email**: <support@statex.cz>

## Management Commands

The StateX Platform includes a unified management script (`manage.sh`) for easy service management:

```bash
# Start all services
./manage.sh start --full

# Stop all services
./manage.sh stop

# Restart all services
./manage.sh restart

# Check service status
./manage.sh status

# View logs
./manage.sh logs [service-name]

# Health check
./manage.sh health

# Run tests
./manage.sh test

# Clean up
./manage.sh clean

# Setup
./manage.sh setup

# Help
./manage.sh help
```

## Roadmap

- [x] Complete microservices implementation
- [x] Centralized API Gateway
- [x] Unified service management
- [x] Health checks and monitoring
- [ ] Advanced AI processing capabilities
- [ ] Multi-region deployment
- [ ] Advanced analytics and reporting
- [ ] Mobile application integration

---

**StateX Platform** - Central Management System for Microservices Architecture
