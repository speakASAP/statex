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
}

# Start StateX Website Frontend
start_frontend() {
    print_status "Starting StateX Website Frontend..."
    
    local port="3000"
    if check_port $port; then
        kill_port $port
    fi
    
    local working_dir="$SCRIPT_DIR/statex-website/frontend"
    
    # Check if node_modules exists
    if [[ ! -d "$working_dir/node_modules" ]]; then
        print_status "Installing frontend dependencies..."
        cd "$working_dir"
        npm install
        cd "$SCRIPT_DIR"
    fi
    
    # Start frontend
    cd "$working_dir"
    print_success "Starting frontend on port $port..."
    print_status "Frontend will be available at: http://localhost:$port"
    print_status "Press Ctrl+C to stop the frontend"
    echo ""
    
    npm run dev
}

# Start AI Orchestrator
start_ai_orchestrator() {
    print_status "Starting AI Orchestrator..."
    
    local port="8010"
    if check_port $port; then
        kill_port $port
    fi
    
    local working_dir="$SCRIPT_DIR/statex-ai/services/ai-orchestrator"
    
    # Check if virtual environment exists
    if [[ ! -d "$working_dir/venv" ]]; then
        print_status "Creating virtual environment for AI Orchestrator..."
        cd "$working_dir"
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd "$SCRIPT_DIR"
    fi
    
    # Start AI Orchestrator
    cd "$working_dir"
    print_success "Starting AI Orchestrator on port $port..."
    print_status "AI Orchestrator will be available at: http://localhost:$port"
    print_status "Press Ctrl+C to stop the AI Orchestrator"
    echo ""
    
    source venv/bin/activate
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

# Start Platform Management
start_platform_management() {
    print_status "Starting Platform Management..."
    
    local port="8000"
    if check_port $port; then
        kill_port $port
    fi
    
    local working_dir="$SCRIPT_DIR/statex-platform"
    
    # Check if virtual environment exists
    if [[ ! -d "$working_dir/venv" ]]; then
        print_status "Creating virtual environment for Platform Management..."
        cd "$working_dir"
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd "$SCRIPT_DIR"
    fi
    
    # Start Platform Management
    cd "$working_dir"
    print_success "Starting Platform Management on port $port..."
    print_status "Platform Management will be available at: http://localhost:$port"
    print_status "Press Ctrl+C to stop the Platform Management"
    echo ""
    
    source venv/bin/activate
    python -m uvicorn services.platform-management.main:app --reload --host 0.0.0.0 --port 8000
}

# Main function
main() {
    case "$1" in
        frontend)
            print_header
            start_infrastructure
            sleep 5
            start_frontend
            ;;
        ai)
            print_header
            start_infrastructure
            sleep 5
            start_ai_orchestrator
            ;;
        platform)
            print_header
            start_infrastructure
            sleep 5
            start_platform_management
            ;;
        *)
            echo "StateX Essential Development Mode Manager"
            echo "========================================="
            echo ""
            echo "Usage: $0 [SERVICE]"
            echo ""
            echo "Services:"
            echo "  frontend    Start StateX Website Frontend (Next.js)"
            echo "  ai          Start AI Orchestrator (Python/FastAPI)"
            echo "  platform    Start Platform Management (Python/FastAPI)"
            echo ""
            echo "Examples:"
            echo "  $0 frontend    # Start only the frontend"
            echo "  $0 ai          # Start only the AI orchestrator"
            echo "  $0 platform    # Start only the platform management"
            echo ""
            echo "This script starts individual services in development mode"
            echo "with hot reload enabled for faster development."
            ;;
    esac
}

# Run main function with all arguments
main "$@"
