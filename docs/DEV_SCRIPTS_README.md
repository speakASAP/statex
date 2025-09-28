# StateX Development Scripts

This directory contains scripts to start all StateX microservices in local development mode for maximum development speed.

## 🚀 Quick Start

### Option 1: Start Essential Services (Recommended)

```bash
# Start only the most essential services
./start-dev-essential.sh frontend    # Start frontend only
./start-dev-essential.sh ai          # Start AI orchestrator only
./start-dev-essential.sh platform    # Start platform management only
```

### Option 2: Start All Services in Parallel

```bash
# Start all core services in parallel
./start-dev-parallel.sh start
```

### Option 3: Start All Services (Full Stack)

```bash
# Start all microservices
./start-dev-all.sh start
```

### Stop All Services

```bash
# Stop all services
./stop-dev-all.sh
```

## 📋 Available Scripts

### 1. `start-dev-essential.sh` - Essential Services

**Purpose**: Start individual essential services for focused development

**Usage**:

```bash
./start-dev-essential.sh [SERVICE]
```

**Services**:

- `frontend` - StateX Website Frontend (Next.js) on port 3000
- `ai` - AI Orchestrator (Python/FastAPI) on port 8010
- `platform` - Platform Management (Python/FastAPI) on port 8000

**Example**:

```bash
# Start only the frontend for UI development
./start-dev-essential.sh frontend
```

### 2. `start-dev-parallel.sh` - Parallel Startup

**Purpose**: Start core services in parallel for maximum speed

**Usage**:

```bash
./start-dev-parallel.sh start
```

**Services Started**:

- Frontend (Next.js) - Port 3000
- Platform Management (Python/FastAPI) - Port 8000
- AI Orchestrator (Python/FastAPI) - Port 8010

### 3. `start-dev-all.sh` - Full Stack

**Purpose**: Start all microservices in development mode

**Usage**:

```bash
./start-dev-all.sh start
```

**All Services**:

- Frontend (Next.js) - Port 3000
- Platform Management (Python/FastAPI) - Port 8000
- API Gateway (Python/FastAPI) - Port 8001
- Submission Service (Python/FastAPI) - Port 8002
- Notification Service (Python/FastAPI) - Port 8005
- User Portal (Python/FastAPI) - Port 8006
- Monitoring Service (Python/FastAPI) - Port 8007
- Logging Service (Python/FastAPI) - Port 8008
- Content Service (Python/FastAPI) - Port 8009
- AI Orchestrator (Python/FastAPI) - Port 8010
- NLP Service (Python/FastAPI) - Port 8011
- ASR Service (Python/FastAPI) - Port 8012
- Document AI (Python/FastAPI) - Port 8013
- Prototype Generator (Python/FastAPI) - Port 8014
- Template Repository (Python/FastAPI) - Port 8015
- Free AI Service (Python/FastAPI) - Port 8016
- AI Workers (Python/FastAPI) - Port 8017
- DNS Service (Node.js) - Port 8053

### 4. `stop-dev-all.sh` - Stop All Services

**Purpose**: Stop all running development services

**Usage**:

```bash
./stop-dev-all.sh
```

## 🏗️ Architecture

### Infrastructure Services (Docker)

- PostgreSQL (Port 5432)
- Redis (Port 6379)
- RabbitMQ (Port 5672)
- MinIO (Port 9000)
- Elasticsearch (Port 9200)
- Nginx (Port 80)

### Application Services (Local Development)

- **Frontend**: Next.js with hot reload
- **Backend Services**: Python/FastAPI with auto-reload
- **AI Services**: Python/FastAPI with auto-reload

## 🔧 Prerequisites

### Required Software

- **Docker Desktop** - For infrastructure services
- **Node.js 23.11.0+** - For frontend and DNS service
- **Python 3.11+** - For backend services
- **npm** - For Node.js package management
- **pip** - For Python package management

### Environment Setup

The scripts automatically:

- Create Python virtual environments
- Install dependencies
- Set up hot reload
- Configure ports

## 📁 Directory Structure

```text
statex/
├── start-dev-essential.sh      # Essential services script
├── start-dev-parallel.sh       # Parallel startup script
├── start-dev-all.sh           # Full stack script
├── stop-dev-all.sh            # Stop all services script
├── logs/                      # Service logs
├── pids/                      # Process IDs
├── statex-website/
│   └── frontend/              # Next.js frontend
├── statex-platform/           # Platform services
├── statex-ai/                 # AI services
├── statex-notification-service/
├── statex-monitoring/
└── statex-dns-service/
```

## 🚀 Development Workflow

### 1. Start Infrastructure

```bash
# Start Docker infrastructure services
cd statex-infrastructure
docker compose -f docker-compose.dev.yml up -d
cd ..
```

### 2. Start Application Services

```bash
# Option A: Start essential services
./start-dev-essential.sh frontend

# Option B: Start all services in parallel
./start-dev-parallel.sh start

# Option C: Start full stack
./start-dev-all.sh start
```

### 3. Access Services

- **Frontend**: <http://localhost:3000>
- **Platform Management**: <http://localhost:8000>
- **AI Orchestrator**: <http://localhost:8010>
- **API Gateway**: <http://localhost:8001>

### 4. Stop Services

```bash
# Stop all services
./stop-dev-all.sh
```

## 🔍 Monitoring

### Service Status

```bash
# Check which services are running
./start-dev-parallel.sh status
```

### Logs

- **Service Logs**: `./logs/[service-name].log`
- **Process IDs**: `./pids/[service-name].pid`

### Port Status

```bash
# Check if ports are in use
lsof -i :3000  # Frontend
lsof -i :8000  # Platform Management
lsof -i :8010  # AI Orchestrator
```

## 🛠️ Troubleshooting

### Port Already in Use

The scripts automatically kill processes on required ports before starting services.

### Service Won't Start

1. Check logs in `./logs/[service-name].log`
2. Verify dependencies are installed
3. Check if virtual environment exists
4. Ensure Docker is running for infrastructure services

### Virtual Environment Issues

```bash
# Recreate virtual environment
rm -rf [service-directory]/venv
./start-dev-essential.sh [service-name]
```

### Node.js Issues

```bash
# Reinstall dependencies
cd statex-website/frontend
rm -rf node_modules package-lock.json
npm install
```

## 📊 Performance

### Startup Times

- **Essential Services**: 10-15 seconds
- **Parallel Startup**: 20-30 seconds
- **Full Stack**: 60-90 seconds

### Hot Reload

- **Frontend**: Instant (Next.js)
- **Backend**: 1-2 seconds (FastAPI)
- **AI Services**: 1-2 seconds (FastAPI)

## 🎯 Best Practices

### For Frontend Development

```bash
./start-dev-essential.sh frontend
```

### For Backend Development

```bash
./start-dev-essential.sh platform
```

### For AI Development

```bash
./start-dev-essential.sh ai
```

### For Full Stack Development

```bash
./start-dev-parallel.sh start
```

### For Testing All Services

```bash
./start-dev-all.sh start
```

## 🔄 Continuous Development

The scripts are designed for continuous development with:

- **Hot Reload**: Automatic restart on code changes
- **Port Management**: Automatic port conflict resolution
- **Process Management**: Automatic PID tracking
- **Log Management**: Centralized logging
- **Error Handling**: Graceful error recovery

## 📝 Notes

- All services run in development mode with hot reload enabled
- Infrastructure services (PostgreSQL, Redis, etc.) run in Docker
- Application services run locally for maximum development speed
- Scripts automatically handle dependencies and virtual environments
- Logs and PIDs are stored in `./logs/` and `./pids/` directories
