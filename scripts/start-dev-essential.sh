#!/usr/bin/env bash
# StateX Essential Development Mode Startup Script
# Starts only the most essential services for development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/../logs"
PID_DIR="$SCRIPT_DIR/../pids"

# Create necessary directories
mkdir -p "$LOG_DIR" "$PID_DIR"

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  StateX Essential Services${NC}"
    echo -e "${PURPLE}  Development Mode Startup${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if port is in use
check_port() {
    local port="$1"
    if lsof -ti :$port >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    local port="$1"
    local pid=$(lsof -ti :$port 2>/dev/null)
    if [[ -n "$pid" ]]; then
        print_status "Port $port is in use (PID: $pid). Killing process..."
        kill -9 $pid 2>/dev/null || true
        sleep 1
    fi
}

# Function to start a service in background
start_service() {
    local service_name="$1"
    local start_command="$2"
    local working_dir="$3"
    local port="$4"
    local log_file="$LOG_DIR/${service_name}.log"
    local pid_file="$PID_DIR/${service_name}.pid"
    
    print_status "Starting $service_name on port $port..."
    
    # Change to working directory and start service
    cd "$working_dir"
    
    # Start service in background using bash to handle source command
    nohup bash -c "$start_command" > "$log_file" 2>&1 &
    local pid=$!
    
    # Save PID
    echo $pid > "$pid_file"
    
    # Wait a moment and check if process is still running
    sleep 2
    if kill -0 $pid 2>/dev/null; then
        print_success "$service_name started (PID: $pid)"
        echo "  Log: $log_file"
        echo "  Port: $port"
    else
        print_error "$service_name failed to start"
        echo "  Check log: $log_file"
        return 1
    fi
    
    cd "$SCRIPT_DIR"
}

# Function to detect operating system
detect_os() {
    case "$(uname -s)" in
        Darwin*)
            echo "macos"
            ;;
        Linux*)
            echo "linux"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

# Function to wait for Docker to become available
wait_for_docker() {
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for Docker to become available..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker info >/dev/null 2>&1; then
            print_success "Docker is now running"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo ""
    print_error "Docker failed to start within 60 seconds"
    return 1
}

# Function to start Docker if needed
start_docker_if_needed() {
    # Check if Docker is already running
    if docker info >/dev/null 2>&1; then
        print_success "Docker is already running"
        return 0
    fi
    
    print_status "Docker is not running. Attempting to start Docker..."
    
    local os=$(detect_os)
    
    case "$os" in
        macos)
            print_status "Starting Docker Desktop on macOS..."
            if command -v open >/dev/null 2>&1; then
                open -a Docker
                wait_for_docker
            else
                print_error "Cannot start Docker Desktop automatically. Please start Docker Desktop manually."
                return 1
            fi
            ;;
        linux)
            print_status "Starting Docker on Linux..."
            if command -v systemctl >/dev/null 2>&1; then
                sudo systemctl start docker
                wait_for_docker
            elif command -v service >/dev/null 2>&1; then
                sudo service docker start
                wait_for_docker
            else
                print_error "Cannot start Docker automatically. Please start Docker manually."
                return 1
            fi
            ;;
        *)
            print_error "Unsupported operating system. Please start Docker manually."
            return 1
            ;;
    esac
}

# Function to wait for service to be ready
wait_for_service() {
    local service_name="$1"
    local port="$2"
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service_name to be ready on port $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if check_port $port; then
            print_success "$service_name is ready"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo ""
    print_warning "$service_name may not be fully ready, but continuing..."
    return 1
}

# Start infrastructure services (Docker)
start_infrastructure() {
    print_status "Starting infrastructure services (Docker)..."
    
    # Start Docker if needed
    if ! start_docker_if_needed; then
        print_error "Failed to start Docker. Please start Docker manually and try again."
        return 1
    fi
    
    cd statex-infrastructure
    docker compose -f docker-compose.dev.yml up -d
    cd ..
    
    print_success "Infrastructure services started"
    
    # Wait for key infrastructure services to be ready
    wait_for_service "PostgreSQL" 5432
    wait_for_service "Redis" 6379
    wait_for_service "RabbitMQ" 5672
}

# Start StateX Website Frontend
start_frontend() {
    local service_name="statex-website-frontend"
    local working_dir="$SCRIPT_DIR/../statex-website/frontend"
    local port="3000"
    
    if check_port $port; then
        kill_port $port
    fi
    
    # Check if node_modules exists
    if [[ ! -d "$working_dir/node_modules" ]]; then
        print_status "Installing frontend dependencies..."
        cd "$working_dir"
        npm install
        cd "$SCRIPT_DIR"
    fi
    
    start_service "$service_name" "npm run dev" "$working_dir" "$port"
}

# Start AI Orchestrator
start_ai_orchestrator() {
    local service_name="ai-orchestrator"
    local working_dir="$SCRIPT_DIR/../statex-ai/services/ai-orchestrator"
    local port="8010"
    
    if check_port $port; then
        kill_port $port
    fi
    
    # Check if virtual environment exists
    if [[ ! -d "$working_dir/venv" ]]; then
        print_status "Creating virtual environment for AI Orchestrator..."
        cd "$working_dir"
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd "$SCRIPT_DIR"
    fi
    
    start_service "$service_name" "source venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port $port" "$working_dir" "$port"
}

# Start Platform Management
start_platform_management() {
    local service_name="platform-management"
    local working_dir="$SCRIPT_DIR/../statex-platform"
    local port="8000"
    
    if check_port $port; then
        kill_port $port
    fi
    
    # Check if virtual environment exists
    if [[ ! -d "$working_dir/venv" ]]; then
        print_status "Creating virtual environment for Platform Management..."
        cd "$working_dir"
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd "$SCRIPT_DIR"
    fi
    
    start_service "$service_name" "source venv/bin/activate && python -m uvicorn services.platform-management.main:app --reload --host 0.0.0.0 --port $port" "$working_dir" "$port"
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    echo ""
    
    local services=(
        "statex-website-frontend:3000"
        "platform-management:8000"
        "ai-orchestrator:8010"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name port <<< "$service_info"
        
        if check_port $port; then
            echo -e "  🟢 $service_name (:$port) - ${GREEN}Running${NC}"
        else
            echo -e "  🔴 $service_name (:$port) - ${RED}Stopped${NC}"
        fi
    done
}

# Main function
main() {
    case "$1" in
        frontend)
            print_header
            start_infrastructure
            sleep 5
            
            # Start platform management first (dependency)
            print_status "Starting platform management (dependency)..."
            start_platform_management
            wait_for_service "Platform Management" 8000
            
            # Start AI orchestrator (dependency)
            print_status "Starting AI orchestrator (dependency)..."
            start_ai_orchestrator
            wait_for_service "AI Orchestrator" 8010
            
            # Start frontend
            print_status "Starting frontend..."
            start_frontend
            
            echo ""
            show_status
            echo ""
            print_status "Frontend is available at: http://localhost:3000"
            print_status "Logs are available in: $LOG_DIR"
            ;;
        ai)
            print_header
            start_infrastructure
            sleep 5
            
            # Start platform management first (dependency)
            print_status "Starting platform management (dependency)..."
            start_platform_management
            wait_for_service "Platform Management" 8000
            
            # Start AI orchestrator
            print_status "Starting AI orchestrator..."
            start_ai_orchestrator
            wait_for_service "AI Orchestrator" 8010
            
            echo ""
            show_status
            echo ""
            print_status "AI Orchestrator is available at: http://localhost:8010"
            print_status "Logs are available in: $LOG_DIR"
            ;;
        platform)
            print_header
            start_infrastructure
            sleep 5
            
            # Start platform management
            print_status "Starting platform management..."
            start_platform_management
            
            echo ""
            show_status
            echo ""
            print_status "Platform Management is available at: http://localhost:8000"
            print_status "Logs are available in: $LOG_DIR"
            ;;
        status)
            show_status
            ;;
        *)
            echo "StateX Essential Development Mode Manager"
            echo "========================================="
            echo ""
            echo "Usage: $0 [COMMAND]"
            echo ""
            echo "Commands:"
            echo "  frontend    Start StateX Website Frontend (Next.js)"
            echo "  ai          Start AI Orchestrator (Python/FastAPI)"
            echo "  platform    Start Platform Management (Python/FastAPI)"
            echo "  status      Show service status"
            echo ""
            echo "Examples:"
            echo "  $0 frontend    # Start only the frontend"
            echo "  $0 ai          # Start only the AI orchestrator"
            echo "  $0 platform    # Start only the platform management"
            echo "  $0 status      # Show current service status"
            echo ""
            echo "This script starts individual services in development mode"
            echo "with hot reload enabled for faster development."
            ;;
    esac
}

# Run main function with all arguments
main "$@"
