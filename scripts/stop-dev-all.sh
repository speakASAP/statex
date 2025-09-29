#!/usr/bin/env bash
# StateX Development Mode Stop Script
# Stops all services started in development mode

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
LOG_DIR="$SCRIPT_DIR/../logs"
PID_DIR="$SCRIPT_DIR/../pids"

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  StateX Development Mode${NC}"
    echo -e "${PURPLE}  Stop All Services${NC}"
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
        print_status "Killing process on port $port (PID: $pid)..."
        kill -9 $pid 2>/dev/null || true
        sleep 1
    fi
}

# Stop infrastructure services
stop_infrastructure() {
    print_status "Stopping infrastructure services (Docker)..."
    
    if docker info >/dev/null 2>&1; then
        cd statex-infrastructure
        docker compose -f docker-compose.dev.yml down
        cd ..
        print_success "Infrastructure services stopped"
    else
        print_warning "Docker is not running, skipping infrastructure services"
    fi
}

# Stop all local services
stop_local_services() {
    print_status "Stopping local development services..."
    
    # Stop services by PID files
    if [[ -d "$PID_DIR" ]]; then
        for pid_file in "$PID_DIR"/*.pid; do
            if [[ -f "$pid_file" ]]; then
                local pid=$(cat "$pid_file")
                local service_name=$(basename "$pid_file" .pid)
                
                if kill -0 $pid 2>/dev/null; then
                    print_status "Stopping $service_name (PID: $pid)..."
                    kill $pid 2>/dev/null || true
                    sleep 1
                    kill -9 $pid 2>/dev/null || true
                    print_success "$service_name stopped"
                else
                    print_warning "$service_name was not running"
                fi
                
                rm -f "$pid_file"
            fi
        done
    fi
    
    # Kill any remaining processes on our ports
    local ports=(3000 8000 8001 8002 8005 8006 8007 8008 8009 8010 8011 8012 8013 8014 8015 8016 8017)
    for port in "${ports[@]}"; do
        if check_port $port; then
            kill_port $port
        fi
    done
    
    print_success "Local services stopped"
}

# Show final status
show_status() {
    print_status "Final Service Status:"
    echo ""
    
    local services=(
        "frontend:3000"
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
    )
    
    local running_count=0
    local total_count=${#services[@]}
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name port <<< "$service_info"
        
        if check_port $port; then
            echo -e "  🔴 $service_name (:$port) - ${RED}Still Running${NC}"
            ((running_count++))
        else
            echo -e "  🟢 $service_name (:$port) - ${GREEN}Stopped${NC}"
        fi
    done
    
    echo ""
    if [[ $running_count -eq 0 ]]; then
        print_success "All services stopped successfully!"
    else
        print_warning "$running_count services are still running"
    fi
}

# Main function
main() {
    print_header
    
    stop_infrastructure
    stop_local_services
    
    echo ""
    show_status
    
    # Clean up log and PID directories
    if [[ -d "$LOG_DIR" ]]; then
        print_status "Logs are available in: $LOG_DIR"
    fi
    
    if [[ -d "$PID_DIR" ]]; then
        print_status "Cleaning up PID files..."
        rm -f "$PID_DIR"/*.pid
    fi
}

# Run main function
main "$@"
