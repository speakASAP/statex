#!/usr/bin/env bash
# StateX Development Mode Startup Script
# Starts all microservices in local development mode (no Docker)

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

# Status indicators
STATUS_HEALTHY="🟢"
STATUS_WARNING="🟡"
STATUS_ERROR="🔴"
STATUS_STARTING="🔄"

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/../logs"
PID_DIR="$SCRIPT_DIR/pids"

# Create necessary directories
mkdir -p "$LOG_DIR" "$PID_DIR"

# Function to print colored output
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  StateX Development Mode${NC}"
    echo -e "${PURPLE}  Local Development Startup${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
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
        print_warning "Port $port is in use (PID: $pid). Killing process..."
        kill -9 $pid 2>/dev/null || true
        sleep 1
    fi
}

# Function to start infrastructure services (Docker)
start_infrastructure() {
    print_status "Starting infrastructure services (Docker)..."
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        return 1
    fi
    
    # Start infrastructure services
    cd statex-infrastructure
    docker compose -f docker-compose.dev.yml up -d
    cd ..
    
    print_success "Infrastructure services started"
}

# Function to start StateX Website Frontend
start_website_frontend() {
    local service_name="statex-website-frontend"
    local working_dir="$SCRIPT_DIR/statex-website/frontend"
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

# Function to start StateX Platform services
start_platform_services() {
    local services=(
        "platform-management:8000:python -m uvicorn services.platform-management.main:app --reload --host 0.0.0.0 --port 8000"
        "api-gateway:8001:python -m uvicorn shared.http_clients:app --reload --host 0.0.0.0 --port 8001"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name port start_command <<< "$service_info"
        local working_dir="$SCRIPT_DIR/statex-platform"
        
        if check_port $port; then
            kill_port $port
        fi
        
        # Check if virtual environment exists
        if [[ ! -d "$working_dir/venv" ]]; then
            print_status "Creating virtual environment for $service_name..."
            cd "$working_dir"
            python3 -m venv venv
            source venv/bin/activate
            pip install -r requirements.txt
            cd "$SCRIPT_DIR"
        fi
        
        start_service "$service_name" "source venv/bin/activate && $start_command" "$working_dir" "$port"
    done
}

# Function to start StateX AI services
start_ai_services() {
    local services=(
        "ai-orchestrator:8010:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
        "nlp-service:8011:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
        "asr-service:8012:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
        "document-ai:8013:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
        "prototype-generator:8014:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
        "template-repository:8015:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
        "free-ai-service:8016:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
        "ai-workers:8017:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name port start_command <<< "$service_info"
        local working_dir="$SCRIPT_DIR/statex-ai/services/$service_name"
        
        if check_port $port; then
            kill_port $port
        fi
        
        # Check if virtual environment exists
        if [[ ! -d "$working_dir/venv" ]]; then
            print_status "Creating virtual environment for $service_name..."
            cd "$working_dir"
            python3 -m venv venv
            source venv/bin/activate
            pip install -r requirements.txt
            cd "$SCRIPT_DIR"
        fi
        
        start_service "$service_name" "source venv/bin/activate && $start_command" "$working_dir" "$port"
    done
}

# Function to start StateX Website Backend services
start_website_services() {
    local services=(
        "submission-service:8002:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
        "user-portal:8006:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
        "content-service:8009:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name port start_command <<< "$service_info"
        local working_dir="$SCRIPT_DIR/statex-website/$service_name"
        
        if check_port $port; then
            kill_port $port
        fi
        
        # Check if virtual environment exists
        if [[ ! -d "$working_dir/venv" ]]; then
            print_status "Creating virtual environment for $service_name..."
            cd "$working_dir"
            python3 -m venv venv
            source venv/bin/activate
            pip install -r requirements.txt
            cd "$SCRIPT_DIR"
        fi
        
        start_service "$service_name" "source venv/bin/activate && $start_command" "$working_dir" "$port"
    done
}

# Function to start StateX Notification Service
start_notification_service() {
    local service_name="notification-service"
    local working_dir="$SCRIPT_DIR/statex-notification-service"
    local port="8005"
    
    if check_port $port; then
        kill_port $port
    fi
    
    # Check if virtual environment exists
    if [[ ! -d "$working_dir/venv" ]]; then
        print_status "Creating virtual environment for $service_name..."
        cd "$working_dir"
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd "$SCRIPT_DIR"
    fi
    
    start_service "$service_name" "source venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" "$working_dir" "$port"
}

# Function to start StateX DNS Service
start_dns_service() {
    local service_name="dns-service"
    local working_dir="$SCRIPT_DIR/statex-dns-service"
    local port="8053"
    
    if check_port $port; then
        kill_port $port
    fi
    
    # Check if node_modules exists
    if [[ ! -d "$working_dir/node_modules" ]]; then
        print_status "Installing DNS service dependencies..."
        cd "$working_dir"
        npm install
        cd "$SCRIPT_DIR"
    fi
    
    start_service "$service_name" "npm start" "$working_dir" "$port"
}

# Function to start StateX Monitoring services
start_monitoring_services() {
    local services=(
        "monitoring-service:8007:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
        "logging-service:8008:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name port start_command <<< "$service_info"
        local working_dir="$SCRIPT_DIR/statex-monitoring/$service_name"
        
        if check_port $port; then
            kill_port $port
        fi
        
        # Check if virtual environment exists
        if [[ ! -d "$working_dir/venv" ]]; then
            print_status "Creating virtual environment for $service_name..."
            cd "$working_dir"
            python3 -m venv venv
            source venv/bin/activate
            pip install -r requirements.txt
            cd "$SCRIPT_DIR"
        fi
        
        start_service "$service_name" "source venv/bin/activate && $start_command" "$working_dir" "$port"
    done
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    echo ""
    
    local services=(
        "statex-website-frontend:3000"
        "platform-management:8000"
        "api-gateway:8001"
        "submission-service:8002"
        "notification-service:8005"
        "user-portal:8006"
        "monitoring-service:8007"
        "logging-service:8008"
        "content-service:8009"
        "ai-orchestrator:8010"
        "nlp-service:8011"
        "asr-service:8012"
        "document-ai:8013"
        "prototype-generator:8014"
        "template-repository:8015"
        "free-ai-service:8016"
        "ai-workers:8017"
        "dns-service:8053"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name port <<< "$service_info"
        
        if check_port $port; then
            echo -e "  ${STATUS_HEALTHY} $service_name (:$port) - ${GREEN}Running${NC}"
        else
            echo -e "  ${STATUS_ERROR} $service_name (:$port) - ${RED}Stopped${NC}"
        fi
    done
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
            
            # Start infrastructure first
            start_infrastructure
            sleep 5
            
            # Start all application services
            start_website_frontend
            start_platform_services
            start_ai_services
            start_website_services
            start_notification_service
            start_dns_service
            start_monitoring_services
            
            echo ""
            print_success "All services started!"
            echo ""
            show_status
            echo ""
            print_status "Access URLs:"
            echo "  🌐 Website Frontend:     http://localhost:3000"
            echo "  🔗 API Gateway:          http://localhost:8001"
            echo "  📝 Submission Service:   http://localhost:8002"
            echo "  📧 Notification Service: http://localhost:8005"
            echo "  👤 User Portal:          http://localhost:8006"
            echo "  📊 Monitoring Service:   http://localhost:8007"
            echo "  📋 Logging Service:      http://localhost:8008"
            echo "  🤖 AI Orchestrator:      http://localhost:8010"
            echo ""
            print_status "Logs are available in: $LOG_DIR"
            print_status "PIDs are stored in: $PID_DIR"
            ;;
        stop)
            stop_all
            ;;
        status)
            show_status
            ;;
        restart)
            stop_all
            sleep 2
            main start
            ;;
        *)
            echo "StateX Development Mode Manager"
            echo "================================"
            echo ""
            echo "Usage: $0 [COMMAND]"
            echo ""
            echo "Commands:"
            echo "  start     Start all services in development mode"
            echo "  stop      Stop all services"
            echo "  restart   Restart all services"
            echo "  status    Show service status"
            echo ""
            echo "This script starts all StateX microservices in local development mode"
            echo "without using Docker containers for the application services."
            ;;
    esac
}

# Run main function with all arguments
main "$@"
