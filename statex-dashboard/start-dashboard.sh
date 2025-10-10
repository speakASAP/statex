#!/usr/bin/env bash
# StateX Dashboard Startup Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load environment variables
if [[ -f "$PROJECT_ROOT/statex-infrastructure/env.dev" ]]; then
    source "$PROJECT_ROOT/statex-infrastructure/env.dev"
fi

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  StateX Dashboard Manager${NC}"
    echo -e "${PURPLE}  Service Management Dashboard${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Function to start dashboard in development mode
start_dev() {
    print_header
    print_status "Starting StateX Dashboard in development mode..."
    
    cd "$SCRIPT_DIR"
    
    # Check if virtual environment exists
    if [[ ! -d "venv" ]]; then
        print_status "Creating virtual environment..."
        python3 -m venv venv
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
    else
        print_status "Activating virtual environment..."
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
    fi
    
    print_status "Starting dashboard server..."
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8020
}

# Function to start dashboard in container mode
start_container() {
    print_header
    print_status "Starting StateX Dashboard in container mode..."
    
    cd "$SCRIPT_DIR"
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Create statex_network if it doesn't exist
    if ! docker network ls | grep -q statex_network; then
        print_status "Creating statex_network..."
        docker network create statex_network
    fi
    
    print_status "Starting dashboard container..."
    docker compose -f docker-compose.dev.yml up -d
    
    print_success "Dashboard started successfully!"
    print_status "Access the dashboard at: http://localhost:8020"
}

# Function to stop dashboard
stop_dashboard() {
    print_status "Stopping StateX Dashboard..."
    
    cd "$SCRIPT_DIR"
    
    # Stop container if running
    if docker compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        print_status "Stopping dashboard container..."
        docker compose -f docker-compose.dev.yml stop
    fi
    
    # Stop development process if running
    local pid_file="$PROJECT_ROOT/pids/dashboard.pid"
    if [[ -f "$pid_file" ]]; then
        local pid=$(cat "$pid_file")
        if kill -0 $pid 2>/dev/null; then
            print_status "Stopping dashboard process (PID: $pid)..."
            kill -9 $pid 2>/dev/null || true
        fi
        rm -f "$pid_file"
    fi
    
    # Kill by port
    local pids=$(lsof -ti :8020 2>/dev/null)
    if [[ -n "$pids" ]]; then
        print_status "Stopping processes on port 8020 (PIDs: $pids)..."
        echo "$pids" | xargs kill -9 2>/dev/null || true
    fi
    
    print_success "Dashboard stopped"
}

# Function to show status
show_status() {
    print_status "Dashboard Status:"
    echo ""
    
    # Check container status
    cd "$SCRIPT_DIR"
    if docker compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        echo -e "  🟢 Container Mode - ${GREEN}Running${NC}"
    else
        echo -e "  🔴 Container Mode - ${RED}Stopped${NC}"
    fi
    
    # Check development process
    local pid_file="$PROJECT_ROOT/pids/dashboard.pid"
    if [[ -f "$pid_file" ]]; then
        local pid=$(cat "$pid_file")
        if kill -0 $pid 2>/dev/null; then
            echo -e "  🟢 Development Mode - ${GREEN}Running${NC} (PID: $pid)"
        else
            echo -e "  🔴 Development Mode - ${RED}Stopped${NC}"
        fi
    else
        echo -e "  🔴 Development Mode - ${RED}Stopped${NC}"
    fi
    
    # Check port
    if lsof -ti :8020 >/dev/null 2>&1; then
        echo -e "  🟢 Port 8020 - ${GREEN}In Use${NC}"
    else
        echo -e "  🔴 Port 8020 - ${RED}Free${NC}"
    fi
}

# Main function
main() {
    case "$1" in
        dev)
            start_dev
            ;;
        container)
            start_container
            ;;
        stop)
            stop_dashboard
            ;;
        status)
            show_status
            ;;
        restart)
            stop_dashboard
            sleep 2
            if [[ "$2" == "container" ]]; then
                start_container
            else
                start_dev
            fi
            ;;
        *)
            echo "StateX Dashboard Manager"
            echo "======================"
            echo ""
            echo "Usage: $0 [COMMAND]"
            echo ""
            echo "Commands:"
            echo "  dev        Start dashboard in development mode (with hot reload)"
            echo "  container  Start dashboard in container mode"
            echo "  stop       Stop dashboard (both modes)"
            echo "  restart    Restart dashboard (add 'container' for container mode)"
            echo "  status     Show dashboard status"
            echo ""
            echo "Examples:"
            echo "  $0 dev              # Start in development mode"
            echo "  $0 container        # Start in container mode"
            echo "  $0 restart container # Restart in container mode"
            echo ""
            echo "Access the dashboard at: http://localhost:8020"
            ;;
    esac
}

# Run main function with all arguments
main "$@"
