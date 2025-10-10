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
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
PID_DIR="$PROJECT_ROOT/pids"

# Load environment variables
if [[ -f "$PROJECT_ROOT/statex-infrastructure/env.dev" ]]; then
    source "$PROJECT_ROOT/statex-infrastructure/env.dev"
fi

# Create necessary directories
mkdir -p "$LOG_DIR" "$PID_DIR"

# Function to clean up PID files
cleanup_pids() {
    print_status "Cleaning up PID files..."
    rm -f "$PID_DIR"/*.pid 2>/dev/null || true
}

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
    
    cd "$PROJECT_ROOT"
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
    local pids=$(lsof -ti :$port 2>/dev/null)
    if [[ -n "$pids" ]]; then
        print_warning "Port $port is in use. Killing processes: $pids"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 2
        # Double-check and force kill if still running
        local remaining_pids=$(lsof -ti :$port 2>/dev/null)
        if [[ -n "$remaining_pids" ]]; then
            echo "$remaining_pids" | xargs kill -9 2>/dev/null || true
            sleep 1
        fi
    fi
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

# Function to start infrastructure services (Docker)
start_infrastructure() {
    print_status "Starting infrastructure services (Docker)..."
    
    # Start Docker if needed
    if ! start_docker_if_needed; then
        print_error "Failed to start Docker. Please start Docker manually and try again."
        return 1
    fi
    
    # Start infrastructure services
    cd "$PROJECT_ROOT/statex-infrastructure"
    docker compose -f docker-compose.dev.yml up -d
    cd "$PROJECT_ROOT"
    
    print_success "Infrastructure services started"
    
    # Wait for key infrastructure services to be ready
    wait_for_service "PostgreSQL" 5432
    wait_for_service "Redis" 6379
    wait_for_service "RabbitMQ" 5672
}

# Function to start StateX Website Frontend
start_website_frontend() {
    local service_name="statex-website-frontend"
    local working_dir="$PROJECT_ROOT/statex-website/frontend"
    local port="${FRONTEND_EXTERNAL_PORT:-3000}"
    
    if check_port $port; then
        kill_port $port
    fi
    
    # Check if node_modules exists
    if [[ ! -d "$working_dir/node_modules" ]]; then
        print_status "Installing frontend dependencies..."
        cd "$working_dir"
        npm install
        cd "$PROJECT_ROOT"
    fi
    
    start_service "$service_name" "npm run dev" "$working_dir" "$port"
}

# Function to start StateX Platform services
start_platform_services() {
    local services=(
        "platform-management:${PLATFORM_MANAGEMENT_EXTERNAL_PORT:-8000}:python -m uvicorn services.platform-management.main:app --reload --host 0.0.0.0 --port ${PLATFORM_MANAGEMENT_INTERNAL_PORT:-8000}"
        "api-gateway:${API_GATEWAY_EXTERNAL_PORT:-8001}:python -m uvicorn services.platform-management.main:app --reload --host 0.0.0.0 --port ${API_GATEWAY_INTERNAL_PORT:-8001}"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name port start_command <<< "$service_info"
        local working_dir="$PROJECT_ROOT/statex-platform"
        
        if check_port $port; then
            kill_port $port
        fi
        
        # Check if virtual environment exists
        if [[ ! -d "$working_dir/venv" ]]; then
            print_status "Creating virtual environment for $service_name..."
            cd "$working_dir"
            python3 -m venv venv
            source venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
            cd "$PROJECT_ROOT"
        else
            # Ensure dependencies are up to date
            print_status "Updating dependencies for $service_name..."
            cd "$working_dir"
            source venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
            cd "$PROJECT_ROOT"
        fi
        
        start_service "$service_name" "source venv/bin/activate && $start_command" "$working_dir" "$port"
    done
}

# Function to start StateX AI services
start_ai_services() {
    local services=(
        "ai-orchestrator:${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${AI_ORCHESTRATOR_INTERNAL_PORT:-8010}"
        "nlp-service:${NLP_SERVICE_EXTERNAL_PORT:-8011}:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${NLP_SERVICE_INTERNAL_PORT:-8011}"
        "asr-service:${ASR_SERVICE_EXTERNAL_PORT:-8012}:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${ASR_SERVICE_INTERNAL_PORT:-8012}"
        "document-ai:${DOCUMENT_AI_EXTERNAL_PORT:-8013}:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${DOCUMENT_AI_INTERNAL_PORT:-8013}"
        "prototype-generator:${PROTOTYPE_GENERATOR_EXTERNAL_PORT:-8014}:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${PROTOTYPE_GENERATOR_INTERNAL_PORT:-8014}"
        "template-repository:${TEMPLATE_REPOSITORY_EXTERNAL_PORT:-8015}:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${TEMPLATE_REPOSITORY_INTERNAL_PORT:-8015}"
        "free-ai-service:${FREE_AI_SERVICE_EXTERNAL_PORT:-8016}:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${FREE_AI_SERVICE_INTERNAL_PORT:-8016}"
        "ai-workers:${AI_WORKERS_EXTERNAL_PORT:-8017}:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${AI_WORKERS_INTERNAL_PORT:-8017}"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name port start_command <<< "$service_info"
        local working_dir="$PROJECT_ROOT/statex-ai/services/$service_name"
        
        if check_port $port; then
            kill_port $port
        fi
        
        # Check if virtual environment exists
        if [[ ! -d "$working_dir/venv" ]]; then
            print_status "Creating virtual environment for $service_name..."
            cd "$working_dir"
            python3 -m venv venv
            source venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
            cd "$PROJECT_ROOT"
        else
            # Ensure dependencies are up to date
            print_status "Updating dependencies for $service_name..."
            cd "$working_dir"
            source venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
            cd "$PROJECT_ROOT"
        fi
        
        start_service "$service_name" "source venv/bin/activate && $start_command" "$working_dir" "$port"
    done
}

# Function to start StateX Website Backend services
start_website_services() {
    local services=(
        # submission-service has entrypoint at main.py (module "main:app")
        "submission-service:${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}:python -m uvicorn main:app --reload --host 0.0.0.0 --port ${SUBMISSION_SERVICE_INTERNAL_PORT:-8002}"
        # user-portal has entrypoint at app/main.py (module "app.main:app")
        "user-portal:${USER_PORTAL_EXTERNAL_PORT:-8006}:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${USER_PORTAL_INTERNAL_PORT:-8006}"
        # content-service has entrypoint at app/main.py (module "app.main:app")
        "content-service:${CONTENT_SERVICE_EXTERNAL_PORT:-8009}:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${CONTENT_SERVICE_INTERNAL_PORT:-8009}"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name port start_command <<< "$service_info"
        if [[ "$service_name" == "submission-service" ]]; then
            local working_dir="$PROJECT_ROOT/statex-website/services/submission-service"
        elif [[ "$service_name" == "user-portal" ]]; then
            local working_dir="$PROJECT_ROOT/statex-website/user-portal"
        elif [[ "$service_name" == "content-service" ]]; then
            local working_dir="$PROJECT_ROOT/statex-website/content-service"
        else
            local working_dir="$PROJECT_ROOT/statex-website/$service_name"
        fi
        
        if check_port $port; then
            kill_port $port
        fi
        
        # Check if virtual environment exists
        if [[ ! -d "$working_dir/venv" ]]; then
            print_status "Creating virtual environment for $service_name..."
            cd "$working_dir"
            python3 -m venv venv
            source venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
            cd "$PROJECT_ROOT"
        else
            # Ensure dependencies are up to date
            print_status "Updating dependencies for $service_name..."
            cd "$working_dir"
            source venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
            cd "$PROJECT_ROOT"
        fi
        
        start_service "$service_name" "source venv/bin/activate && $start_command" "$working_dir" "$port"
    done
}

# Function to start StateX Notification Service
start_notification_service() {
    local service_name="notification-service"
    local working_dir="$PROJECT_ROOT/statex-notification-service"
    local port="${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}"
    
    if check_port $port; then
        kill_port $port
    fi
    
    # Check if virtual environment exists
    if [[ ! -d "$working_dir/venv" ]]; then
        print_status "Creating virtual environment for $service_name..."
        cd "$working_dir"
        python3 -m venv venv
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
        cd "$PROJECT_ROOT"
    else
        # Ensure dependencies are up to date
        print_status "Updating dependencies for $service_name..."
        cd "$working_dir"
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
        cd "$PROJECT_ROOT"
    fi
    
    start_service "$service_name" "source venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${NOTIFICATION_SERVICE_INTERNAL_PORT:-8005}" "$working_dir" "$port"
}

# Function to start StateX DNS Service
start_dns_service() {
    local service_name="dns-service"
    local working_dir="$PROJECT_ROOT/statex-dns-service"
    local port="${DNS_SERVICE_EXTERNAL_PORT:-8053}"
    local ssl_dir="${SSL_BASE_DIR:-$PROJECT_ROOT/statex-dns-service/ssl}"
    local dns_port="${DNS_PORT:-5354}"
    local node_env="${NODE_ENV:-development}"
    
    if check_port $port; then
        kill_port $port
    fi
    
    # Create SSL directories
    mkdir -p "$ssl_dir"/dynamic/{production,development} "$ssl_dir"/shared
    
    # Check if node_modules exists
    if [[ ! -d "$working_dir/node_modules" ]]; then
        print_status "Installing DNS service dependencies..."
        cd "$working_dir"
        npm install
        cd "$PROJECT_ROOT"
    fi
    
    # Start with proper environment variables
    SSL_BASE_DIR="$ssl_dir" NODE_ENV="$node_env" DNS_PORT="$dns_port" start_service "$service_name" "npm start" "$working_dir" "$port"
}

# Function to start StateX Dashboard
start_dashboard() {
    local service_name="dashboard"
    local working_dir="$PROJECT_ROOT/statex-dashboard"
    local port="${DASHBOARD_EXTERNAL_PORT:-8020}"
    
    if check_port $port; then
        kill_port $port
    fi
    
    # Check if virtual environment exists
    if [[ ! -d "$working_dir/venv" ]]; then
        print_status "Creating virtual environment for $service_name..."
        cd "$working_dir"
        python3 -m venv venv
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
        cd "$PROJECT_ROOT"
    else
        # Ensure dependencies are up to date
        print_status "Updating dependencies for $service_name..."
        cd "$working_dir"
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
        cd "$PROJECT_ROOT"
    fi
    
    start_service "$service_name" "source venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${DASHBOARD_INTERNAL_PORT:-8020}" "$working_dir" "$port"
}

# Function to start StateX Monitoring services
start_monitoring_services() {
    local services=(
        "monitoring-service:${MONITORING_SERVICE_EXTERNAL_PORT:-8007}:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${MONITORING_SERVICE_INTERNAL_PORT:-8007}"
        "logging-service:${LOGGING_SERVICE_EXTERNAL_PORT:-8008}:python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${LOGGING_SERVICE_INTERNAL_PORT:-8008}"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name port start_command <<< "$service_info"
        local working_dir="$PROJECT_ROOT/statex-monitoring/$service_name"
        
        if check_port $port; then
            kill_port $port
        fi
        
        # Check if virtual environment exists
        if [[ ! -d "$working_dir/venv" ]]; then
            print_status "Creating virtual environment for $service_name..."
            cd "$working_dir"
            python3 -m venv venv
            source venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
            cd "$PROJECT_ROOT"
        else
            # Ensure dependencies are up to date
            print_status "Updating dependencies for $service_name..."
            cd "$working_dir"
            source venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
            cd "$PROJECT_ROOT"
        fi
        
        start_service "$service_name" "source venv/bin/activate && $start_command" "$working_dir" "$port"
    done
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    echo ""
    
    local services=(
        "statex-website-frontend:${FRONTEND_EXTERNAL_PORT:-3000}"
        "platform-management:${PLATFORM_MANAGEMENT_EXTERNAL_PORT:-8000}"
        "api-gateway:${API_GATEWAY_EXTERNAL_PORT:-8001}"
        "submission-service:${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}"
        "notification-service:${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}"
        "user-portal:${USER_PORTAL_EXTERNAL_PORT:-8006}"
        # "monitoring-service:${MONITORING_SERVICE_EXTERNAL_PORT:-8007}"  # TEMPORARILY DISABLED
        # "logging-service:${LOGGING_SERVICE_EXTERNAL_PORT:-8008}"  # TEMPORARILY DISABLED
        "content-service:${CONTENT_SERVICE_EXTERNAL_PORT:-8009}"
        "ai-orchestrator:${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}"
        "nlp-service:${NLP_SERVICE_EXTERNAL_PORT:-8011}"
        "asr-service:${ASR_SERVICE_EXTERNAL_PORT:-8012}"
        "document-ai:${DOCUMENT_AI_EXTERNAL_PORT:-8013}"
        "prototype-generator:${PROTOTYPE_GENERATOR_EXTERNAL_PORT:-8014}"
        "template-repository:${TEMPLATE_REPOSITORY_EXTERNAL_PORT:-8015}"
        "free-ai-service:${FREE_AI_SERVICE_EXTERNAL_PORT:-8016}"
        "ai-workers:${AI_WORKERS_EXTERNAL_PORT:-8017}"
        "dns-service:${DNS_SERVICE_EXTERNAL_PORT:-8053}"
        "dashboard:${DASHBOARD_EXTERNAL_PORT:-8020}"
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
    
    # Stop infrastructure services (if Docker is running)
    if docker info >/dev/null 2>&1; then
        print_status "Stopping infrastructure services (Docker)..."
        cd "$PROJECT_ROOT/statex-infrastructure"
        docker compose -f docker-compose.dev.yml stop
        cd "$PROJECT_ROOT"
        print_success "Infrastructure services stopped"
    else
        print_status "Docker is not running - infrastructure services already stopped"
    fi
    
    # Define all service ports (monitoring services 8007 and 8008 temporarily disabled)
    local ports=(3000 8000 8001 8002 8005 8006 8009 8010 8011 8012 8013 8014 8015 8016 8017 8020 8053)
    
    # Stop services by port (more reliable than PID files)
    for port in "${ports[@]}"; do
        local pids=$(lsof -ti :$port 2>/dev/null)
        if [[ -n "$pids" ]]; then
            print_status "Stopping service on port $port (PIDs: $pids)..."
            echo "$pids" | xargs kill -9 2>/dev/null || true
        fi
    done
    
    # Stop all local services by PID files
    for pid_file in "$PID_DIR"/*.pid; do
        if [[ -f "$pid_file" ]]; then
            local pid=$(cat "$pid_file")
            local service_name=$(basename "$pid_file" .pid)
            
            if kill -0 $pid 2>/dev/null; then
                print_status "Stopping $service_name (PID: $pid)..."
                kill -9 $pid 2>/dev/null || true
            fi
            
            rm -f "$pid_file"
        fi
    done
    
    # Clean up any remaining processes
    sleep 2
    for port in "${ports[@]}"; do
        local pids=$(lsof -ti :$port 2>/dev/null)
        if [[ -n "$pids" ]]; then
            print_status "Force stopping remaining processes on port $port (PIDs: $pids)..."
            echo "$pids" | xargs kill -9 2>/dev/null || true
        fi
    done
    
    print_success "All services stopped"
}

# Main function
main() {
    case "$1" in
        start)
            print_header
            
            # Clean up any existing processes
            cleanup_pids
            
            # Start infrastructure first
            start_infrastructure
            sleep 5
            
            # Start services in dependency order
            
            # Phase 1: Core Platform Services (depend on infrastructure)
            print_status "Phase 1: Starting core platform services..."
            start_platform_services
            sleep 3
            
            # Phase 2: AI Services (depend on platform services)
            print_status "Phase 2: Starting AI services..."
            start_ai_services
            sleep 3
            
            # Phase 3: Website Services (depend on platform and AI services)
            print_status "Phase 3: Starting website services..."
            start_website_services
            sleep 3
            
            # Phase 4: Communication Services (independent)
            print_status "Phase 4: Starting communication services..."
            start_notification_service
            start_dns_service
            sleep 3
            
            # Phase 5: Monitoring Services (independent) - TEMPORARILY DISABLED
            # print_status "Phase 5: Starting monitoring services..."
            # start_monitoring_services
            # sleep 3
            
            # Phase 6: Frontend (depends on all backend services)
            print_status "Phase 6: Starting frontend..."
            start_website_frontend
            sleep 3
            
            # Phase 7: Dashboard (depends on all services)
            print_status "Phase 7: Starting dashboard..."
            start_dashboard
            
            echo ""
            print_success "All services started!"
            echo ""
            show_status
            echo ""
            print_status "Access URLs:"
            echo "  🎛️  Service Dashboard:    http://localhost:${DASHBOARD_EXTERNAL_PORT:-8020}"
            echo "  🌐 Website Frontend:     http://localhost:${FRONTEND_EXTERNAL_PORT:-3000}"
            echo "  🔗 API Gateway:          http://localhost:${API_GATEWAY_EXTERNAL_PORT:-8001}"
            echo "  📝 Submission Service:   http://localhost:${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}"
            echo "  📧 Notification Service: http://localhost:${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}"
            echo "  👤 User Portal:          http://localhost:${USER_PORTAL_EXTERNAL_PORT:-8006}"
            echo "  📊 Monitoring Service:   http://localhost:${MONITORING_SERVICE_EXTERNAL_PORT:-8007}  # TEMPORARILY DISABLED"
            echo "  📋 Logging Service:      http://localhost:${LOGGING_SERVICE_EXTERNAL_PORT:-8008}  # TEMPORARILY DISABLED"
            echo "  🤖 AI Orchestrator:      http://localhost:${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}"
            echo ""
            print_status "Logs are available in: $LOG_DIR"
            print_status "PIDs are stored in: $PID_DIR"
            ;;
        quick)
            print_header
            echo -e "${YELLOW}Starting essential services only (fastest mode)${NC}"
            
            # Clean up any existing processes
            cleanup_pids
            
            # Start infrastructure first
            start_infrastructure
            sleep 5
            
            # Start only essential services
            print_status "Starting essential services..."
            
            # Platform Management (Core)
            print_status "Starting platform management..."
            local service_name="platform-management"
            local working_dir="$PROJECT_ROOT/statex-platform"
            local port="${PLATFORM_MANAGEMENT_EXTERNAL_PORT:-8000}"
            
            if [[ ! -d "$working_dir/venv" ]]; then
                print_status "Creating virtual environment for $service_name..."
                cd "$working_dir"
                python3 -m venv venv
                source venv/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt
                cd "$PROJECT_ROOT"
            else
                print_status "Updating dependencies for $service_name..."
                cd "$working_dir"
                source venv/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt
                cd "$PROJECT_ROOT"
            fi
            
            start_service "$service_name" "source venv/bin/activate && python -m uvicorn services.platform-management.main:app --reload --host 0.0.0.0 --port ${PLATFORM_MANAGEMENT_INTERNAL_PORT:-8000}" "$working_dir" "$port"
            sleep 3
            
            # AI Orchestrator (Core AI)
            print_status "Starting AI orchestrator..."
            service_name="ai-orchestrator"
            working_dir="$PROJECT_ROOT/statex-ai/services/ai-orchestrator"
            port="${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}"
            
            if [[ ! -d "$working_dir/venv" ]]; then
                print_status "Creating virtual environment for $service_name..."
                cd "$working_dir"
                python3 -m venv venv
                source venv/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt
                cd "$PROJECT_ROOT"
            else
                print_status "Updating dependencies for $service_name..."
                cd "$working_dir"
                source venv/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt
                cd "$PROJECT_ROOT"
            fi
            
            start_service "$service_name" "source venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port ${AI_ORCHESTRATOR_INTERNAL_PORT:-8010}" "$working_dir" "$port"
            sleep 3
            
            # Frontend (User Interface)
            print_status "Starting frontend..."
            service_name="frontend"
            working_dir="$PROJECT_ROOT/statex-website/frontend"
            port="${FRONTEND_EXTERNAL_PORT:-3000}"
            
            if [[ ! -d "$working_dir/node_modules" ]]; then
                print_status "Installing frontend dependencies..."
                cd "$working_dir"
                npm install
                cd "$PROJECT_ROOT"
            fi
            
            start_service "$service_name" "npm run dev" "$working_dir" "$port"
            sleep 3
            
            # Dashboard (for service management)
            print_status "Starting dashboard..."
            start_dashboard
            
            echo ""
            print_success "Essential services started!"
            echo ""
            show_status
            echo ""
            print_status "Access URLs:"
            echo "  🎛️  Service Dashboard:    http://localhost:${DASHBOARD_EXTERNAL_PORT:-8020}"
            echo "  🌐 Website Frontend:     http://localhost:3000"
            echo "  🔗 Platform Management:  http://localhost:8000"
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
            echo "  start     Start all services in development mode (complete)"
            echo "  quick     Start essential services only (fastest - 2-3 min)"
            echo "  stop      Stop all services"
            echo "  restart   Restart all services"
            echo "  status    Show service status"
            echo ""
            echo "Modes:"
            echo "  start     - All 18 services (5-10 minutes)"
            echo "  quick     - Essential services only (2-3 minutes)"
            echo "            - Platform Management + AI Orchestrator + Frontend"
            echo ""
            echo "This script starts StateX microservices in local development mode"
            echo "with proper dependency management and port conflict resolution."
            ;;
    esac
}

# Run main function with all arguments
main "$@"
