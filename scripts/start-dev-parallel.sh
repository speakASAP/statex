#!/usr/bin/env bash
# StateX Parallel Development Mode Startup Script
# Starts all services in parallel for maximum development speed

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
    echo -e "${PURPLE}  StateX Parallel Development${NC}"
    echo -e "${PURPLE}  Fast Startup Mode${NC}"
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

# Function to start a service in background
start_service_bg() {
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
    sleep 1
    if kill -0 $pid 2>/dev/null; then
        print_success "$service_name started (PID: $pid)"
    else
        print_error "$service_name failed to start"
        return 1
    fi
    
    cd "$SCRIPT_DIR"
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

# Start infrastructure services (Docker)
start_infrastructure() {
    print_status "Starting infrastructure services (Docker)..."
    
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        return 1
    fi
    
    cd statex-infrastructure
    docker compose -f docker-compose.dev.yml up -d
    cd ..
    
    print_success "Infrastructure services started"
    sleep 3
}

# Start all services in parallel
start_all_services() {
    print_status "Starting all services in parallel..."
    
    # Kill any existing processes on our ports
    local ports=(3000 8000 8001 8002 8005 8006 8007 8008 8009 8010 8011 8012 8013 8014 8015 8016 8017)
    for port in "${ports[@]}"; do
        if check_port $port; then
            kill_port $port
        fi
    done
    
    # Start services in parallel
    local pids=()
    
    # Frontend
    if [[ ! -d "statex-website/frontend/node_modules" ]]; then
        print_status "Installing frontend dependencies..."
        cd statex-website/frontend
        npm install
        cd ../..
    fi
    start_service_bg "frontend" "npm run dev" "statex-website/frontend" "3000" &
    pids+=($!)
    
    # Platform Management
    if [[ ! -d "statex-platform/venv" ]]; then
        print_status "Creating platform virtual environment..."
        cd statex-platform
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd ..
    fi
    start_service_bg "platform-management" "source venv/bin/activate && python -m uvicorn services.platform-management.main:app --reload --host 0.0.0.0 --port 8000" "statex-platform" "8000" &
    pids+=($!)
    
    # AI Orchestrator
    if [[ ! -d "statex-ai/services/ai-orchestrator/venv" ]]; then
        print_status "Creating AI orchestrator virtual environment..."
        cd statex-ai/services/ai-orchestrator
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd ../../..
    fi
    start_service_bg "ai-orchestrator" "source venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8010" "statex-ai/services/ai-orchestrator" "8010" &
    pids+=($!)
    
    # Wait for all background processes to start
    print_status "Waiting for services to start..."
    sleep 5
    
    # Check which services are running
    print_status "Service Status:"
    local services=(
        "frontend:3000"
        "platform-management:8000"
        "${AI_ORCHESTRATOR_HOST:-host.docker.internal}:${AI_ORCHESTRATOR_PORT:-8010}"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name port <<< "$service_info"
        
        if check_port $port; then
            echo -e "  🟢 $service_name (:$port) - ${GREEN}Running${NC}"
        else
            echo -e "  🔴 $service_name (:$port) - ${RED}Stopped${NC}"
        fi
    done
    
    print_success "Core services started!"
    echo ""
    print_status "Access URLs:"
    echo "  🌐 Website Frontend:     http://localhost:3000"
    echo "  🔗 Platform Management:  http://localhost:8000"
    echo "  🤖 AI Orchestrator:      http://localhost:8010"
    echo ""
    print_status "Logs are available in: $LOG_DIR"
    print_status "PIDs are stored in: $PID_DIR"
    echo ""
    print_status "To stop all services, run: ./stop-dev-all.sh"
}

# Function to stop all services
stop_all() {
    print_status "Stopping all services..."
    
    # Stop infrastructure services
    cd statex-infrastructure
    docker compose -f docker-compose.dev.yml down
    cd ..
    
    # Stop all local services
    for pid_file in "$PID_DIR"/*.pid; do
        if [[ -f "$pid_file" ]]; then
            local pid=$(cat "$pid_file")
            local service_name=$(basename "$pid_file" .pid)
            
            if kill -0 $pid 2>/dev/null; then
                print_status "Stopping $service_name (PID: $pid)..."
                kill $pid 2>/dev/null || true
                sleep 1
                kill -9 $pid 2>/dev/null || true
            fi
            
            rm -f "$pid_file"
        fi
    done
    
    print_success "All services stopped"
}

# Main function
main() {
    case "$1" in
        start)
            print_header
            start_infrastructure
            start_all_services
            ;;
        stop)
            stop_all
            ;;
        *)
            echo "StateX Parallel Development Mode Manager"
            echo "======================================="
            echo ""
            echo "Usage: $0 [COMMAND]"
            echo ""
            echo "Commands:"
            echo "  start     Start all core services in parallel"
            echo "  stop      Stop all services"
            echo ""
            echo "This script starts the core StateX services in parallel"
            echo "for maximum development speed with hot reload enabled."
            ;;
    esac
}

# Run main function with all arguments
main "$@"
