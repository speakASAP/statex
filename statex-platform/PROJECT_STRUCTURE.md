# Statex Platform - Project Structure

## Overview

This document provides a comprehensive overview of the Statex platform project structure, including all directories, files, and their purposes.

## Root Directory Structure

```
statex-platform/
├── README.md                           # Main project documentation
├── PROJECT_STRUCTURE.md               # This file - project structure overview
├── .env.development                   # Development environment variables
├── .env.production                    # Production environment variables
├── .gitignore                         # Git ignore rules
├── docker-compose.yml                 # Local development environment
├── docker-compose.prod.yml            # Production environment
├── requirements.txt                   # Python dependencies
├── pyproject.toml                     # Python project configuration
├── Makefile                           # Development commands
├── .github/                           # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml                     # Continuous Integration
│       ├── cd.yml                     # Continuous Deployment
│       └── security.yml               # Security scanning
├── docs/                              # Project documentation
│   ├── architecture.md                # System architecture
│   ├── architecture-diagrams.md       # Visual diagrams
│   ├── api-contracts.md               # API specifications
│   ├── deployment.md                  # Deployment guide
│   └── development-guide.md           # Development guide
├── services/                          # Microservices
│   ├── README.md                      # Services overview
│   ├── user-portal/                   # User Portal Service
│   ├── submission-service/            # Submission Service
│   ├── ai-orchestrator/               # AI Orchestrator Service
│   ├── ai-workers/                    # AI Workers Service
│   ├── notification-service/          # Notification Service
│   ├── content-service/               # Content Service
│   └── logging-service/               # Logging Service
├── infrastructure/                    # Infrastructure as Code
│   ├── kubernetes/                    # Kubernetes manifests
│   ├── helm/                          # Helm charts
│   ├── terraform/                     # Terraform configurations
│   └── monitoring/                    # Monitoring configurations
├── shared/                            # Shared libraries and utilities
│   ├── common/                        # Common utilities
│   ├── events/                        # Event schemas
│   ├── models/                        # Shared data models
│   └── clients/                       # Service clients
└── scripts/                           # Utility scripts
    ├── setup.sh                       # Environment setup
    ├── deploy.sh                      # Deployment script
    └── backup.sh                      # Backup script
```

## Services Directory Structure

Each microservice follows a consistent structure:

```
services/service-name/
├── README.md                          # Service documentation
├── app/                               # Application code
│   ├── main.py                        # FastAPI application entry point
│   ├── api/                           # API routes and handlers
│   │   ├── __init__.py
│   │   ├── routes.py                  # API route definitions
│   │   ├── dependencies.py            # API dependencies
│   │   └── middleware.py              # Custom middleware
│   ├── domain/                        # Business logic and models
│   │   ├── __init__.py
│   │   ├── models.py                  # Pydantic models
│   │   ├── services.py                # Business logic services
│   │   ├── events.py                  # Domain events
│   │   └── exceptions.py              # Custom exceptions
│   ├── services/                      # External service integrations
│   │   ├── __init__.py
│   │   ├── database.py                # Database service
│   │   ├── message_broker.py          # Message broker service
│   │   ├── storage.py                 # Object storage service
│   │   └── external_apis.py           # External API integrations
│   ├── adapters/                      # Database and external adapters
│   │   ├── __init__.py
│   │   ├── postgres.py                # PostgreSQL adapter
│   │   ├── redis.py                   # Redis adapter
│   │   ├── s3.py                      # S3 adapter
│   │   └── rabbitmq.py                # RabbitMQ adapter
│   └── telemetry/                     # Logging, metrics, tracing
│       ├── __init__.py
│       ├── logging.py                 # Structured logging
│       ├── metrics.py                 # Prometheus metrics
│       └── tracing.py                 # OpenTelemetry tracing
├── tests/                             # Test suite
│   ├── __init__.py
│   ├── unit/                          # Unit tests
│   │   ├── __init__.py
│   │   ├── test_models.py
│   │   ├── test_services.py
│   │   └── test_api.py
│   ├── integration/                   # Integration tests
│   │   ├── __init__.py
│   │   ├── test_database.py
│   │   ├── test_message_broker.py
│   │   └── test_external_apis.py
│   ├── e2e/                           # End-to-end tests
│   │   ├── __init__.py
│   │   └── test_workflows.py
│   └── fixtures/                      # Test data and fixtures
│       ├── __init__.py
│       ├── test_data.json
│       └── mock_responses.py
├── docs/                              # Service-specific documentation
│   ├── README.md                      # Service overview
│   ├── API.md                         # API documentation
│   ├── DEPLOYMENT.md                  # Deployment guide
│   └── TROUBLESHOOTING.md             # Troubleshooting guide
├── helm/                              # Kubernetes Helm chart
│   ├── Chart.yaml                     # Chart metadata
│   ├── values.yaml                    # Default values
│   ├── values-dev.yaml                # Development values
│   ├── values-prod.yaml               # Production values
│   └── templates/                     # Kubernetes templates
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── ingress.yaml
│       ├── configmap.yaml
│       └── secret.yaml
├── migrations/                        # Database migrations
│   ├── alembic.ini                    # Alembic configuration
│   ├── env.py                         # Alembic environment
│   └── versions/                      # Migration files
│       ├── 001_initial_migration.py
│       └── 002_add_user_table.py
├── Dockerfile                         # Docker image definition
├── requirements.txt                   # Python dependencies
├── requirements-dev.txt               # Development dependencies
├── pyproject.toml                     # Python project configuration
├── .env.example                       # Environment variables example
├── .dockerignore                      # Docker ignore rules
├── .gitignore                         # Git ignore rules
└── Makefile                           # Service-specific commands
```

## Documentation Structure

```
docs/
├── architecture.md                    # System architecture overview
├── architecture-diagrams.md           # Visual architecture diagrams
├── api-contracts.md                   # API contracts and schemas
├── deployment.md                      # Deployment and infrastructure guide
├── development-guide.md               # Development workflow guide
├── security.md                        # Security guidelines
├── monitoring.md                      # Monitoring and observability
├── troubleshooting.md                 # Common issues and solutions
└── contributing.md                    # Contribution guidelines
```

## Infrastructure Structure

```
infrastructure/
├── kubernetes/                        # Kubernetes manifests
│   ├── namespaces/                    # Namespace definitions
│   ├── configmaps/                    # Configuration maps
│   ├── secrets/                       # Secret definitions
│   ├── services/                      # Service definitions
│   ├── deployments/                   # Deployment manifests
│   ├── ingress/                       # Ingress configurations
│   └── network-policies/              # Network security policies
├── helm/                              # Helm charts
│   ├── statex-platform/               # Main platform chart
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   └── dependencies/                  # External dependencies
│       ├── postgresql/
│       ├── redis/
│       └── rabbitmq/
├── terraform/                         # Terraform configurations
│   ├── environments/                  # Environment-specific configs
│   │   ├── dev/
│   │   ├── staging/
│   │   └── prod/
│   ├── modules/                       # Reusable modules
│   │   ├── kubernetes/
│   │   ├── database/
│   │   └── networking/
│   └── variables.tf                   # Global variables
└── monitoring/                        # Monitoring configurations
    ├── prometheus/                    # Prometheus configuration
    │   ├── prometheus.yml
    │   └── rules/
    ├── grafana/                       # Grafana dashboards
    │   ├── dashboards/
    │   └── provisioning/
    ├── loki/                          # Loki configuration
    │   └── loki.yml
    └── jaeger/                        # Jaeger configuration
        └── jaeger.yml
```

## Shared Libraries Structure

```
shared/
├── common/                            # Common utilities
│   ├── __init__.py
│   ├── config.py                      # Configuration utilities
│   ├── validators.py                  # Data validators
│   ├── decorators.py                  # Common decorators
│   └── helpers.py                     # Helper functions
├── events/                            # Event schemas and handlers
│   ├── __init__.py
│   ├── base.py                        # Base event classes
│   ├── user_events.py                 # User-related events
│   ├── request_events.py              # Request-related events
│   └── notification_events.py         # Notification events
├── models/                            # Shared data models
│   ├── __init__.py
│   ├── base.py                        # Base model classes
│   ├── user.py                        # User models
│   ├── request.py                     # Request models
│   └── notification.py                # Notification models
└── clients/                           # Service clients
    ├── __init__.py
    ├── base.py                        # Base client class
    ├── user_portal_client.py          # User Portal client
    ├── submission_client.py           # Submission Service client
    └── notification_client.py         # Notification Service client
```

## Scripts Structure

```
scripts/
├── setup.sh                           # Environment setup script
├── deploy.sh                          # Deployment script
├── backup.sh                          # Backup script
├── restore.sh                         # Restore script
├── health-check.sh                    # Health check script
├── migrate.sh                         # Database migration script
├── seed.sh                            # Database seeding script
└── cleanup.sh                         # Cleanup script
```

## GitHub Actions Structure

```
.github/
└── workflows/
    ├── ci.yml                         # Continuous Integration
    ├── cd.yml                         # Continuous Deployment
    ├── security.yml                   # Security scanning
    ├── test.yml                       # Testing workflow
    ├── build.yml                      # Build workflow
    └── release.yml                    # Release workflow
```

## Key Files and Their Purposes

### Root Level Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation and overview |
| `PROJECT_STRUCTURE.md` | This file - project structure documentation |
| `.env.development` | Development environment variables |
| `.env.production` | Production environment variables |
| `docker-compose.yml` | Local development environment setup |
| `requirements.txt` | Python dependencies for the entire platform |
| `pyproject.toml` | Python project configuration and metadata |
| `Makefile` | Common development commands and shortcuts |

### Service Level Files

| File | Purpose |
|------|---------|
| `app/main.py` | FastAPI application entry point |
| `app/api/routes.py` | API route definitions |
| `app/domain/models.py` | Pydantic data models |
| `app/domain/services.py` | Business logic services |
| `app/services/database.py` | Database service integration |
| `app/telemetry/logging.py` | Structured logging configuration |
| `tests/` | Complete test suite (unit, integration, e2e) |
| `Dockerfile` | Docker image definition |
| `requirements.txt` | Service-specific Python dependencies |
| `helm/` | Kubernetes Helm chart for deployment |

### Documentation Files

| File | Purpose |
|------|---------|
| `docs/architecture.md` | System architecture and design patterns |
| `docs/api-contracts.md` | API contracts and communication protocols |
| `docs/deployment.md` | Infrastructure and deployment guide |
| `services/*/README.md` | Individual service documentation |

## Development Workflow

### 1. Local Development
```bash
# Clone repository
git clone https://github.com/statex/platform.git
cd platform

# Setup environment
make setup

# Start development environment
make dev

# Run tests
make test

# Run linting
make lint
```

### 2. Service Development
```bash
# Navigate to service
cd services/service-name

# Install dependencies
pip install -r requirements.txt

# Run service locally
python -m app.main

# Run tests
pytest

# Run linting
black app/
isort app/
flake8 app/
```

### 3. Deployment
```bash
# Deploy to development
make deploy-dev

# Deploy to production
make deploy-prod

# Run health checks
make health-check
```

## Best Practices

### 1. Code Organization
- Follow the established directory structure
- Keep related functionality together
- Use clear, descriptive names for files and directories
- Maintain consistent naming conventions

### 2. Documentation
- Keep documentation up to date
- Use clear, concise language
- Include examples where helpful
- Document all public APIs

### 3. Testing
- Write tests for all new functionality
- Maintain high test coverage
- Use appropriate test types (unit, integration, e2e)
- Keep tests fast and reliable

### 4. Security
- Never commit secrets or sensitive data
- Use environment variables for configuration
- Implement proper authentication and authorization
- Regular security audits and updates

### 5. Performance
- Monitor performance metrics
- Optimize database queries
- Use caching appropriately
- Implement proper error handling

This project structure provides a solid foundation for developing, deploying, and maintaining the Statex platform microservices architecture.
