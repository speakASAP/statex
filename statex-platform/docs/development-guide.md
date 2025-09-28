# Development Guide

## Overview

This guide provides comprehensive instructions for developers working on the Statex platform. It covers development setup, coding standards, testing procedures, and contribution guidelines.

## Development Environment Setup

### Prerequisites

- **Python 3.13**: Latest Python version
- **Docker & Docker Compose**: For containerized development
- **Git**: Version control
- **IDE**: VS Code, PyCharm, or similar
- **Node.js**: For frontend development (optional)

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/statex/platform.git
cd platform
```

#### 2. Environment Configuration
```bash
# Copy environment file
cp .env.development .env

# Edit environment variables
nano .env
```

#### 3. Start Development Environment

**🚀 Ultra-Fast Development (Recommended)**
```bash
# Ultra-fast startup (only starts missing services)
./dev-manage.sh start --fast

# Quick status check
./dev-manage.sh status --quick

# Start only missing services
./dev-manage.sh start-missing
```

**Traditional Docker Compose**
```bash
# Start all services
docker-compose up -d

# Check service health
docker-compose ps

# View logs
docker-compose logs -f [service-name]
```

> **💡 Pro Tip**: Use the ultra-fast development script for maximum development speed. See [Ultra-Fast Development Script](ultra-fast-development-script.md) for detailed documentation.

#### 4. Database Setup
```bash
# Run migrations
docker-compose exec user-portal python manage.py migrate

# Create superuser
docker-compose exec user-portal python manage.py createsuperuser

# Seed test data
docker-compose exec user-portal python manage.py loaddata fixtures/test_data.json
```

## Service Development

### Service Structure

Each microservice follows a consistent structure:

```
service-name/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── api/                 # API routes and handlers
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── dependencies.py
│   ├── domain/              # Business logic and models
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── services.py
│   │   └── events.py
│   ├── services/            # External service integrations
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── message_broker.py
│   │   └── storage.py
│   ├── adapters/            # Database and external adapters
│   │   ├── __init__.py
│   │   ├── postgres.py
│   │   ├── redis.py
│   │   └── s3.py
│   └── telemetry/           # Logging, metrics, tracing
│       ├── __init__.py
│       ├── logging.py
│       ├── metrics.py
│       └── tracing.py
├── tests/                   # Unit and integration tests
│   ├── __init__.py
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docs/                    # Service-specific documentation
│   ├── README.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── helm/                    # Kubernetes deployment charts
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
├── Dockerfile
├── requirements.txt
├── pyproject.toml
├── .env.example
└── README.md
```

### Creating a New Service

#### 1. Initialize Service
```bash
# Create service directory
mkdir services/new-service
cd services/new-service

# Initialize Python project
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn pydantic python-dotenv
```

#### 2. Create Basic Structure
```bash
# Create directory structure
mkdir -p app/{api,domain,services,adapters,telemetry}
mkdir -p tests/{unit,integration,fixtures}
mkdir -p docs helm/templates

# Create __init__.py files
find . -type d -name "app" -o -name "tests" -o -name "api" -o -name "domain" -o -name "services" -o -name "adapters" -o -name "telemetry" | xargs -I {} touch {}/__init__.py
```

#### 3. Create Main Application
```python
# app/main.py
from fastapi import FastAPI
from app.api.routes import router
from app.telemetry.logging import setup_logging
from app.telemetry.metrics import setup_metrics
from app.telemetry.tracing import setup_tracing

app = FastAPI(
    title="New Service",
    description="Service description",
    version="1.0.0"
)

# Setup telemetry
setup_logging()
setup_metrics()
setup_tracing()

# Include routers
app.include_router(router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### 4. Create API Routes
```python
# app/api/routes.py
from fastapi import APIRouter, Depends
from app.domain.models import ServiceModel
from app.domain.services import ServiceService

router = APIRouter()

@router.get("/")
async def get_items(service: ServiceService = Depends()):
    return await service.get_all_items()

@router.post("/")
async def create_item(item: ServiceModel, service: ServiceService = Depends()):
    return await service.create_item(item)
```

#### 5. Create Domain Models
```python
# app/domain/models.py
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class ServiceModel(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
```

#### 6. Create Domain Services
```python
# app/domain/services.py
from app.domain.models import ServiceModel, ServiceCreate
from app.adapters.database import DatabaseAdapter

class ServiceService:
    def __init__(self, db: DatabaseAdapter):
        self.db = db
    
    async def get_all_items(self) -> List[ServiceModel]:
        return await self.db.get_all_items()
    
    async def create_item(self, item: ServiceCreate) -> ServiceModel:
        return await self.db.create_item(item)
```

## Coding Standards

### Python Code Style

#### 1. Code Formatting
```bash
# Install formatting tools
pip install black isort flake8 mypy

# Format code
black app/
isort app/

# Check code quality
flake8 app/
mypy app/
```

#### 2. Code Style Guidelines
- **Line Length**: Maximum 88 characters (Black default)
- **Imports**: Use absolute imports, group by standard library, third-party, local
- **Naming**: Use snake_case for variables and functions, PascalCase for classes
- **Type Hints**: Use type hints for all function parameters and return values
- **Docstrings**: Use Google-style docstrings for all public functions and classes

#### 3. Example Code
```python
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field

class UserService:
    """Service for managing users."""
    
    def __init__(self, db_adapter: DatabaseAdapter):
        """Initialize user service.
        
        Args:
            db_adapter: Database adapter instance
        """
        self.db = db_adapter
    
    async def get_user(self, user_id: UUID) -> Optional[User]:
        """Get user by ID.
        
        Args:
            user_id: User identifier
            
        Returns:
            User instance if found, None otherwise
        """
        return await self.db.get_user(user_id)
    
    async def create_user(self, user_data: UserCreate) -> User:
        """Create new user.
        
        Args:
            user_data: User creation data
            
        Returns:
            Created user instance
            
        Raises:
            ValidationError: If user data is invalid
            DuplicateError: If user already exists
        """
        if await self.db.user_exists(user_data.email):
            raise DuplicateError("User with this email already exists")
        
        return await self.db.create_user(user_data)
```

### API Design Standards

#### 1. RESTful Endpoints
```python
# Good examples
GET /api/users              # List users
GET /api/users/{id}         # Get specific user
POST /api/users             # Create user
PUT /api/users/{id}         # Update user
DELETE /api/users/{id}      # Delete user

# Bad examples
GET /api/getUsers           # Not RESTful
POST /api/users/update      # Use PUT instead
GET /api/users/delete/{id}  # Use DELETE instead
```

#### 2. Response Format
```python
# Standard response format
{
    "success": true,
    "data": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
    },
    "message": "User created successfully",
    "timestamp": "2025-01-27T12:00:00Z"
}

# Error response format
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": {
            "email": "Invalid email format"
        }
    },
    "timestamp": "2025-01-27T12:00:00Z"
}
```

#### 3. Status Codes
- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests
- **204 No Content**: Successful DELETE requests
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict
- **422 Unprocessable Entity**: Validation error
- **500 Internal Server Error**: Server error

## Testing

### Test Structure

#### 1. Unit Tests
```python
# tests/unit/test_user_service.py
import pytest
from unittest.mock import Mock, AsyncMock
from app.domain.services import UserService
from app.domain.models import User, UserCreate

class TestUserService:
    """Test cases for UserService."""
    
    @pytest.fixture
    def mock_db(self):
        """Mock database adapter."""
        return Mock()
    
    @pytest.fixture
    def user_service(self, mock_db):
        """User service instance with mocked dependencies."""
        return UserService(mock_db)
    
    @pytest.mark.asyncio
    async def test_get_user_success(self, user_service, mock_db):
        """Test successful user retrieval."""
        # Arrange
        user_id = "123e4567-e89b-12d3-a456-426614174000"
        expected_user = User(id=user_id, name="John Doe", email="john@example.com")
        mock_db.get_user.return_value = expected_user
        
        # Act
        result = await user_service.get_user(user_id)
        
        # Assert
        assert result == expected_user
        mock_db.get_user.assert_called_once_with(user_id)
    
    @pytest.mark.asyncio
    async def test_get_user_not_found(self, user_service, mock_db):
        """Test user not found scenario."""
        # Arrange
        user_id = "123e4567-e89b-12d3-a456-426614174000"
        mock_db.get_user.return_value = None
        
        # Act
        result = await user_service.get_user(user_id)
        
        # Assert
        assert result is None
        mock_db.get_user.assert_called_once_with(user_id)
```

#### 2. Integration Tests
```python
# tests/integration/test_user_api.py
import pytest
from httpx import AsyncClient
from app.main import app

class TestUserAPI:
    """Integration tests for user API endpoints."""
    
    @pytest.fixture
    async def client(self):
        """Async HTTP client."""
        async with AsyncClient(app=app, base_url="http://test") as ac:
            yield ac
    
    @pytest.mark.asyncio
    async def test_create_user_success(self, client):
        """Test successful user creation."""
        # Arrange
        user_data = {
            "name": "John Doe",
            "email": "john@example.com"
        }
        
        # Act
        response = await client.post("/api/users", json=user_data)
        
        # Assert
        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["data"]["name"] == user_data["name"]
        assert data["data"]["email"] == user_data["email"]
    
    @pytest.mark.asyncio
    async def test_create_user_validation_error(self, client):
        """Test user creation with validation error."""
        # Arrange
        user_data = {
            "name": "",  # Invalid: empty name
            "email": "invalid-email"  # Invalid: bad email format
        }
        
        # Act
        response = await client.post("/api/users", json=user_data)
        
        # Assert
        assert response.status_code == 422
        data = response.json()
        assert data["success"] is False
        assert "validation" in data["error"]["message"].lower()
```

#### 3. End-to-End Tests
```python
# tests/e2e/test_user_workflow.py
import pytest
from httpx import AsyncClient
from app.main import app

class TestUserWorkflow:
    """End-to-end tests for user workflow."""
    
    @pytest.mark.asyncio
    async def test_complete_user_workflow(self):
        """Test complete user lifecycle."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            # 1. Create user
            user_data = {
                "name": "John Doe",
                "email": "john@example.com"
            }
            create_response = await client.post("/api/users", json=user_data)
            assert create_response.status_code == 201
            user_id = create_response.json()["data"]["id"]
            
            # 2. Get user
            get_response = await client.get(f"/api/users/{user_id}")
            assert get_response.status_code == 200
            assert get_response.json()["data"]["name"] == user_data["name"]
            
            # 3. Update user
            update_data = {"name": "Jane Doe"}
            update_response = await client.put(f"/api/users/{user_id}", json=update_data)
            assert update_response.status_code == 200
            assert update_response.json()["data"]["name"] == update_data["name"]
            
            # 4. Delete user
            delete_response = await client.delete(f"/api/users/{user_id}")
            assert delete_response.status_code == 204
            
            # 5. Verify deletion
            get_response = await client.get(f"/api/users/{user_id}")
            assert get_response.status_code == 404
```

### Running Tests

#### 1. Test Commands
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/unit/test_user_service.py

# Run tests with coverage
pytest --cov=app --cov-report=html

# Run tests in parallel
pytest -n auto

# Run tests with verbose output
pytest -v

# Run only failed tests
pytest --lf
```

#### 2. Test Configuration
```python
# pytest.ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    --strict-markers
    --strict-config
    --cov=app
    --cov-report=term-missing
    --cov-report=html
    --cov-fail-under=80
markers =
    unit: Unit tests
    integration: Integration tests
    e2e: End-to-end tests
    slow: Slow running tests
```

## Database Management

### Migrations

#### 1. Django Migrations (User Portal)
```bash
# Create migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Check migration status
python manage.py showmigrations

# Rollback migration
python manage.py migrate app_name 0001
```

#### 2. Alembic Migrations (FastAPI Services)
```bash
# Create migration
alembic revision --autogenerate -m "Add user table"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# Check current revision
alembic current
```

### Database Seeding

#### 1. Create Seed Data
```python
# fixtures/seed_data.py
from app.domain.models import User, UserCreate
from app.adapters.database import DatabaseAdapter

async def seed_users(db: DatabaseAdapter):
    """Seed user data."""
    users = [
        UserCreate(name="Admin User", email="admin@statex.cz"),
        UserCreate(name="Test User", email="test@statex.cz"),
    ]
    
    for user_data in users:
        await db.create_user(user_data)
```

#### 2. Run Seed Script
```bash
# Run seed script
python -m fixtures.seed_data

# Or via Docker
docker-compose exec user-portal python -m fixtures.seed_data
```

## Message Broker Integration

### Event Publishing

#### 1. Event Publisher
```python
# app/services/message_broker.py
import json
import asyncio
from typing import Dict, Any
from app.domain.events import BaseEvent

class MessageBroker:
    """Message broker for event publishing."""
    
    def __init__(self, broker_url: str):
        self.broker_url = broker_url
        self.connection = None
    
    async def connect(self):
        """Connect to message broker."""
        # Implementation depends on broker (RabbitMQ, NATS, etc.)
        pass
    
    async def publish_event(self, event: BaseEvent, topic: str):
        """Publish event to topic."""
        message = {
            "event": event.event,
            "event_id": str(event.event_id),
            "occurred_at": event.occurred_at.isoformat(),
            "data": event.data
        }
        
        await self._publish(topic, json.dumps(message))
    
    async def _publish(self, topic: str, message: str):
        """Publish message to topic."""
        # Implementation depends on broker
        pass
```

#### 2. Event Subscriber
```python
# app/services/event_subscriber.py
import json
from typing import Callable, Dict, Any
from app.domain.events import BaseEvent

class EventSubscriber:
    """Event subscriber for processing events."""
    
    def __init__(self, broker_url: str):
        self.broker_url = broker_url
        self.handlers: Dict[str, Callable] = {}
    
    def register_handler(self, event_type: str, handler: Callable):
        """Register event handler."""
        self.handlers[event_type] = handler
    
    async def start_listening(self, topics: List[str]):
        """Start listening to topics."""
        # Implementation depends on broker
        pass
    
    async def handle_event(self, event_data: Dict[str, Any]):
        """Handle incoming event."""
        event_type = event_data.get("event")
        handler = self.handlers.get(event_type)
        
        if handler:
            await handler(event_data)
```

## Monitoring and Observability

### Logging

#### 1. Structured Logging
```python
# app/telemetry/logging.py
import logging
import json
from datetime import datetime
from typing import Dict, Any

class StructuredLogger:
    """Structured logger for consistent log format."""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        # Configure JSON formatter
        handler = logging.StreamHandler()
        formatter = JSONFormatter()
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
    
    def info(self, message: str, **kwargs):
        """Log info message with structured data."""
        self.logger.info(message, extra=self._create_extra(kwargs))
    
    def error(self, message: str, **kwargs):
        """Log error message with structured data."""
        self.logger.error(message, extra=self._create_extra(kwargs))
    
    def _create_extra(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create extra data for logging."""
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "service": "user-portal",
            **data
        }

class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging."""
    
    def format(self, record):
        log_data = {
            "timestamp": record.created,
            "level": record.levelname,
            "message": record.getMessage(),
            **record.__dict__.get("extra", {})
        }
        return json.dumps(log_data)
```

#### 2. Request Logging
```python
# app/middleware/logging.py
import time
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for request/response logging."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request
        self.logger.info(
            "Request started",
            method=request.method,
            url=str(request.url),
            client_ip=request.client.host
        )
        
        # Process request
        response = await call_next(request)
        
        # Log response
        process_time = time.time() - start_time
        self.logger.info(
            "Request completed",
            method=request.method,
            url=str(request.url),
            status_code=response.status_code,
            process_time=process_time
        )
        
        return response
```

### Metrics

#### 1. Prometheus Metrics
```python
# app/telemetry/metrics.py
from prometheus_client import Counter, Histogram, Gauge, start_http_server

# Request metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status_code']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint']
)

# Business metrics
USER_CREATED = Counter(
    'users_created_total',
    'Total users created'
)

ACTIVE_USERS = Gauge(
    'active_users',
    'Number of active users'
)

def record_request(method: str, endpoint: str, status_code: int, duration: float):
    """Record request metrics."""
    REQUEST_COUNT.labels(method=method, endpoint=endpoint, status_code=status_code).inc()
    REQUEST_DURATION.labels(method=method, endpoint=endpoint).observe(duration)

def record_user_created():
    """Record user creation."""
    USER_CREATED.inc()

def update_active_users(count: int):
    """Update active users count."""
    ACTIVE_USERS.set(count)
```

#### 2. Metrics Collection
```python
# app/middleware/metrics.py
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.telemetry.metrics import record_request

class MetricsMiddleware(BaseHTTPMiddleware):
    """Middleware for metrics collection."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Process request
        response = await call_next(request)
        
        # Record metrics
        duration = time.time() - start_time
        record_request(
            method=request.method,
            endpoint=request.url.path,
            status_code=response.status_code,
            duration=duration
        )
        
        return response
```

## Deployment

### Docker Development

#### 1. Dockerfile
```dockerfile
FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 2. Docker Compose
```yaml
# docker-compose.dev.yml
services:
  service-name:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/statex
      - REDIS_URL=redis://redis:6379/0
      - BROKER_URL=amqp://user:password@rabbitmq:5672
    volumes:
      - .:/app
    depends_on:
      - postgres
      - redis
      - rabbitmq
```

### Kubernetes Development

#### 1. Helm Chart
```yaml
# helm/service-name/Chart.yaml
apiVersion: v2
name: service-name
description: Service Name Helm Chart
type: application
version: 1.0.0
appVersion: "1.0.0"

# helm/service-name/values.yaml
replicaCount: 1

image:
  repository: service-name
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 8000

resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

#### 2. Deployment Commands
```bash
# Install chart
helm install service-name ./helm/service-name

# Upgrade chart
helm upgrade service-name ./helm/service-name

# Uninstall chart
helm uninstall service-name
```

## Troubleshooting

### Common Issues

#### 1. Service Not Starting
```bash
# Check service logs
docker-compose logs service-name

# Check service status
docker-compose ps

# Restart service
docker-compose restart service-name
```

#### 2. Database Connection Issues
```bash
# Check database status
docker-compose exec postgres pg_isready

# Check database logs
docker-compose logs postgres

# Test database connection
docker-compose exec postgres psql -U statex -d statex -c "SELECT 1"
```

#### 3. Message Broker Issues
```bash
# Check broker status
docker-compose exec rabbitmq rabbitmq-diagnostics status

# Check broker logs
docker-compose logs rabbitmq

# Test broker connection
docker-compose exec rabbitmq rabbitmq-diagnostics ping
```

### Debug Commands

#### 1. Service Debug
```bash
# Access service shell
docker-compose exec service-name bash

# Check service health
curl http://localhost:8000/health

# Check metrics
curl http://localhost:8000/metrics
```

#### 2. Database Debug
```bash
# Access database shell
docker-compose exec postgres psql -U statex -d statex

# Check database size
SELECT pg_size_pretty(pg_database_size('statex'));

# Check active connections
SELECT * FROM pg_stat_activity;
```

## Contribution Guidelines

### Pull Request Process

#### 1. Create Feature Branch
```bash
# Create and switch to feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push branch
git push origin feature/new-feature
```

#### 2. Create Pull Request
- Use descriptive title and description
- Reference related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Request code review

#### 3. Code Review Process
- Address review comments
- Update documentation if needed
- Ensure CI/CD pipeline passes
- Merge after approval

### Commit Message Format

#### 1. Conventional Commits
```
feat: add new user registration endpoint
fix: resolve database connection timeout
docs: update API documentation
style: format code with black
refactor: extract user service logic
test: add unit tests for user service
chore: update dependencies
```

#### 2. Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting
- **refactor**: Code refactoring
- **test**: Test additions/changes
- **chore**: Maintenance tasks

### Code Review Checklist

#### 1. Code Quality
- [ ] Code follows style guidelines
- [ ] Type hints are used correctly
- [ ] Error handling is appropriate
- [ ] Code is well-documented
- [ ] No hardcoded values

#### 2. Testing
- [ ] Unit tests cover new functionality
- [ ] Integration tests are included
- [ ] Test coverage meets requirements
- [ ] All tests pass

#### 3. Security
- [ ] Input validation is implemented
- [ ] Authentication/authorization is correct
- [ ] Sensitive data is handled properly
- [ ] No security vulnerabilities

#### 4. Performance
- [ ] Database queries are optimized
- [ ] Caching is used appropriately
- [ ] No performance bottlenecks
- [ ] Resource usage is reasonable

This comprehensive development guide provides everything needed for developers to contribute effectively to the Statex platform.
