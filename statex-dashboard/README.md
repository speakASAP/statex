# StateX Service Management Dashboard

A comprehensive web-based dashboard for managing StateX microservices in both development and container modes.

## Features

- **Dual Mode Support**: Choose between development and container modes for each service
- **Real-time Monitoring**: Live status updates via WebSocket
- **Service Management**: Start, stop, and restart individual services or groups
- **Intelligent Dependencies**: Automatic handling of service dependencies
- **Modern UI**: Beautiful, responsive interface with real-time updates
- **Bulk Operations**: Start, stop, or restart all services at once

## Quick Start

### Development Mode (Recommended for Development)

```bash
# Start the dashboard in development mode
./start-dashboard.sh dev

# Access the dashboard
open http://localhost:8020
```

### Container Mode (Recommended for Production)

```bash
# Start the dashboard in container mode
./start-dashboard.sh container

# Access the dashboard
open http://localhost:8020
```

## Service Categories

### Infrastructure Services

- **PostgreSQL**: Database
- **Redis**: Cache
- **RabbitMQ**: Message queue
- **MinIO**: Object storage
- **Elasticsearch**: Search engine
- **Ollama**: Local AI models

### Platform Services

- **Platform Management**: Central orchestration
- **API Gateway**: Central routing

### AI Services

- **AI Orchestrator**: Central AI coordination
- **NLP Service**: Natural Language Processing
- **ASR Service**: Speech-to-text
- **Document AI**: Document analysis
- **Prototype Generator**: Code generation
- **Template Repository**: Template management
- **Free AI Service**: Free AI models
- **AI Workers**: AI processing agents

### Website Services

- **Submission Service**: Form processing
- **User Portal**: User management
- **Content Service**: Content management
- **Frontend**: React application

### Communication Services

- **Notification Service**: Email and notifications
- **DNS Service**: Dynamic DNS management

### Monitoring Services

- **Monitoring Service**: System monitoring
- **Logging Service**: Centralized logging

## Usage

### Starting Services

1. **Select Mode**: Choose between "dev" or "container" for each service
2. **Start Service**: Click the "Start" button for the desired service
3. **Monitor Status**: Watch real-time status updates in the dashboard

### Service Modes

#### Development Mode

- **Pros**: Hot reload, faster startup, easier debugging
- **Cons**: Requires local dependencies, less isolated
- **Best for**: Active development, debugging, testing

#### Container Mode

- **Pros**: Isolated environment, consistent deployment, easier scaling
- **Cons**: Slower startup, requires Docker, less flexible for development
- **Best for**: Production, stable services, integration testing

### Bulk Operations

- **Start All**: Start all services in their default modes
- **Stop All**: Stop all running services
- **Restart All**: Restart all services

## Configuration

### Environment Variables

The dashboard automatically detects and uses the following environment variables:

- `DOCKER_HOST`: Docker daemon URL (default: unix:///var/run/docker.sock)
- `LOG_LEVEL`: Logging level (default: info)
- `PROJECT_ROOT`: Path to StateX project root

### Service Configuration

Services are configured in `app/main.py` in the `SERVICES` dictionary. Each service can specify:

- **Modes**: Available modes (dev, container, or both)
- **Ports**: Service ports
- **Commands**: Development mode commands
- **Docker Compose**: Container mode configuration
- **Dependencies**: Service dependencies

## API Endpoints

### REST API

- `GET /api/services` - List all services
- `GET /api/services/{service_id}/status` - Get service status
- `GET /api/services/status` - Get all services status
- `POST /api/services/{service_id}/action` - Perform action on service

### WebSocket

- `WS /ws` - Real-time status updates

## Development

### Prerequisites

- Python 3.11+
- Docker (for container mode)
- Node.js (for frontend development)

### Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start in development mode
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8020
```

### Project Structure

```
statex-dashboard/
├── app/
│   └── main.py              # FastAPI backend
├── static/
│   └── index.html           # React frontend
├── requirements.txt         # Python dependencies
├── Dockerfile              # Container configuration
├── docker-compose.dev.yml  # Docker Compose configuration
├── start-dashboard.sh      # Startup script
└── README.md              # This file
```

## Troubleshooting

### Common Issues

1. **Docker not running**: Start Docker Desktop or Docker daemon
2. **Port conflicts**: Check if port 8020 is available
3. **Permission issues**: Ensure proper permissions for Docker socket
4. **Service not starting**: Check logs in the `logs/` directory

### Logs

- **Dashboard logs**: `logs/dashboard.log`
- **Service logs**: `logs/{service_name}.log`
- **Docker logs**: `docker logs statex_dashboard_dev`

### Health Checks

- **Dashboard health**: `http://localhost:8020/health`
- **Service status**: Check the dashboard UI
- **Docker status**: `docker ps | grep statex`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the StateX platform and follows the same licensing terms.
