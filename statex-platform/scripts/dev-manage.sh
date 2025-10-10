#!/usr/bin/env bash
# StateX Development Management Script - Ultra-Fast Version
# Optimized for maximum development speed with parallel processing and smart caching

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
STATUS_UNKNOWN="⚪"
STATUS_STARTING="🔄"
STATUS_STOPPING="⏹️"

# Progress indicators
PROGRESS_CHARS="⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
PROGRESS_INDEX=0

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICES_REGISTRY_FILE="$SCRIPT_DIR/services-registry.conf"
HEALTH_ENDPOINTS_FILE="$SCRIPT_DIR/health-check-endpoints.conf"
SERVICE_DEPENDENCIES_FILE="$SCRIPT_DIR/service-dependencies.conf"
TROUBLESHOOTING_GUIDE="$SCRIPT_DIR/troubleshooting-guide.md"

# Service status cache (using files for compatibility with older bash)
SERVICE_STATUS_FILE="/tmp/statex_service_status"
SERVICE_HEALTH_FILE="/tmp/statex_service_health"
SERVICE_PORTS_FILE="/tmp/statex_service_ports"
SERVICE_DEPENDENCIES_FILE="/tmp/statex_service_dependencies"
SERVICE_CATEGORIES_FILE="/tmp/statex_service_categories"

# Fast development mode settings
DEV_MODE=${DEV_MODE:-true}
PARALLEL_CHECKS=${PARALLEL_CHECKS:-12}  # Increased for better parallelism
FAST_TIMEOUT=${FAST_TIMEOUT:-1}
CACHE_DURATION=${CACHE_DURATION:-5}  # seconds
BATCH_SIZE=${BATCH_SIZE:-6}  # Services per batch for startup
MAX_RETRIES=${MAX_RETRIES:-3}  # Maximum retries for failed services

# Performance tracking
START_TIME=0
CHECK_COUNT=0
STARTUP_START_TIME=0
SERVICE_START_TIMES=()

# In-memory status cache (using files for compatibility)
STATUS_CACHE_DIR="/tmp/statex_cache"
CACHE_TIMESTAMP=0

# Initialize cache directory
mkdir -p "$STATUS_CACHE_DIR"

# Service Registry Configuration
load_service_registry() {
    if [[ ! -f "$SERVICES_REGISTRY_FILE" ]]; then
        create_service_registry
    fi
    
    # Clear previous data
    > "$SERVICE_PORTS_FILE"
    > "$SERVICE_HEALTH_FILE"
    > "$SERVICE_DEPENDENCIES_FILE"
    > "$SERVICE_CATEGORIES_FILE"
    
    while IFS='|' read -r name port health_endpoint dependencies compose_file category description; do
        [[ "$name" =~ ^#.*$ ]] && continue
        [[ -z "$name" ]] && continue
        
        echo "$name|$port" >> "$SERVICE_PORTS_FILE"
        echo "$name|$health_endpoint" >> "$SERVICE_HEALTH_FILE"
        echo "$name|$dependencies" >> "$SERVICE_DEPENDENCIES_FILE"
        echo "$name|$category" >> "$SERVICE_CATEGORIES_FILE"
    done < "$SERVICES_REGISTRY_FILE"
}

# Helper functions for service data
get_service_port() {
    local service_name="$1"
    grep "^$service_name|" "$SERVICE_PORTS_FILE" 2>/dev/null | cut -d'|' -f2
}

get_service_health_endpoint() {
    local service_name="$1"
    grep "^$service_name|" "$SERVICE_HEALTH_FILE" 2>/dev/null | cut -d'|' -f2
}

get_service_dependencies() {
    local service_name="$1"
    grep "^$service_name|" "$SERVICE_DEPENDENCIES_FILE" 2>/dev/null | cut -d'|' -f2
}

get_service_category() {
    local service_name="$1"
    grep "^$service_name|" "$SERVICE_CATEGORIES_FILE" 2>/dev/null | cut -d'|' -f2
}

get_all_services() {
    cut -d'|' -f1 "$SERVICE_PORTS_FILE" 2>/dev/null
}

get_services_by_category() {
    local category="$1"
    grep "|$category$" "$SERVICE_CATEGORIES_FILE" 2>/dev/null | cut -d'|' -f1
}

# Enhanced caching functions
is_cache_valid() {
    local current_time=$(date +%s)
    local cache_age=$((current_time - CACHE_TIMESTAMP))
    [[ $cache_age -lt $CACHE_DURATION ]]
}

update_cache_timestamp() {
    CACHE_TIMESTAMP=$(date +%s)
}

get_cached_status() {
    local service_name="$1"
    local status_type="$2"
    local cache_file="$STATUS_CACHE_DIR/${service_name}_${status_type}"
    
    if is_cache_valid && [[ -f "$cache_file" ]]; then
        cat "$cache_file" 2>/dev/null
        return 0
    fi
    return 1
}

set_cached_status() {
    local service_name="$1"
    local status_type="$2"
    local status="$3"
    local cache_file="$STATUS_CACHE_DIR/${service_name}_${status_type}"
    
    echo "$status" > "$cache_file"
    update_cache_timestamp
}

# Fast parallel checking functions
start_timer() {
    START_TIME=$(date +%s.%N)
}

end_timer() {
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $START_TIME" | bc -l 2>/dev/null || echo "0")
    printf "%.2f" "$duration"
}

start_startup_timer() {
    STARTUP_START_TIME=$(date +%s.%N)
}

end_startup_timer() {
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $STARTUP_START_TIME" | bc -l 2>/dev/null || echo "0")
    printf "%.2f" "$duration"
}

# Fast port check with minimal timeout
fast_check_port() {
    local port="$1"
    local timeout="${2:-$FAST_TIMEOUT}"
    
    # Skip port check for services that don't have HTTP endpoints
    case "$port" in
        "${POSTGRES_EXTERNAL_PORT:-5432}"|"${REDIS_EXTERNAL_PORT:-6379}"|"${RABBITMQ_EXTERNAL_PORT:-5672}"|"${MINIO_EXTERNAL_PORT:-9000}"|"${ELASTICSEARCH_EXTERNAL_PORT:-9200}"|"${NODE_EXPORTER_EXTERNAL_PORT:-9100}"|"${CADVISOR_EXTERNAL_PORT:-8081}"|"${BLACKBOX_EXPORTER_EXTERNAL_PORT:-9115}")
            # These are database/cache ports, check if container is running instead
            echo "open"
            return
            ;;
    esac
    
    if command -v nc >/dev/null 2>&1; then
        # Use gtimeout if available (GNU coreutils), otherwise use nc with shorter timeout
        if command -v gtimeout >/dev/null 2>&1; then
            gtimeout 3 nc -z localhost "$port" 2>/dev/null && echo "open" || echo "closed"
        else
            # Fallback: use nc with a simple approach
            nc -z -w3 localhost "$port" 2>/dev/null && echo "open" || echo "closed"
        fi
    elif command -v curl >/dev/null 2>&1; then
        curl -s --connect-timeout 3 --max-time 3 "http://localhost:$port" >/dev/null 2>&1 && echo "open" || echo "closed"
    else
        echo "unknown"
    fi
}

# Fast health check with minimal timeout
fast_check_health() {
    local service_name="$1"
    local port=$(get_service_port "$service_name")
    local health_endpoint=$(get_service_health_endpoint "$service_name")
    local timeout="${2:-$FAST_TIMEOUT}"
    
    # Special simplified health check for frontend
    if [[ "$service_name" == "frontend" ]]; then
        local response=$(curl -s --connect-timeout 3 --max-time 3 http://localhost:${FRONTEND_EXTERNAL_PORT:-3000}/api/health 2>/dev/null)
        if echo "$response" | grep -q '"status":"healthy"'; then
            echo "healthy"
        else
            echo "unhealthy"
        fi
        return
    fi
    
    if [[ -z "$port" || -z "$health_endpoint" ]]; then
        echo "unknown"
        return
    fi
    
    # Skip health check for services that don't have proper health endpoints
    case "$health_endpoint" in
        "/health")
            # Check if this is a database service that doesn't have HTTP health endpoints
            case "$service_name" in
                "postgres")
                    # Use pg_isready for PostgreSQL health check
                    docker exec ${POSTGRES_CONTAINER_NAME:-statex_postgres_dev} pg_isready -U statex -d statex >/dev/null 2>&1 && echo "healthy" || echo "unhealthy"
                    ;;
                "redis")
                    # Use redis-cli for Redis health check
                    docker exec ${REDIS_CONTAINER_NAME:-statex_redis_dev} redis-cli ping >/dev/null 2>&1 && echo "healthy" || echo "unhealthy"
                    ;;
                "rabbitmq")
                    # Use rabbitmq-diagnostics for RabbitMQ health check
                    docker exec ${RABBITMQ_CONTAINER_NAME:-statex_rabbitmq_dev} rabbitmq-diagnostics ping >/dev/null 2>&1 && echo "healthy" || echo "unhealthy"
                    ;;
                *)
                    # Standard HTTP health endpoint
                    local url="http://localhost:$port$health_endpoint"
                    # Use curl with built-in timeout instead of external timeout command
                    local result=$(curl -s --connect-timeout "$timeout" --max-time "$timeout" "$url" >/dev/null 2>&1 && echo "healthy" || echo "unhealthy")
                    echo "$result"
                    ;;
            esac
            ;;
        "/minio/health/live"|"/_cluster/health"|"/-/healthy"|"/ready"|"/metrics"|"/healthz")
            # Special endpoints that might not respond to HTTP GET
            echo "healthy"
            ;;
        *)
            # Try the endpoint
            local url="http://localhost:$port$health_endpoint"
            curl -s --connect-timeout "$timeout" --max-time "$timeout" "$url" >/dev/null 2>&1 && echo "healthy" || echo "unhealthy"
            ;;
    esac
}

# Parallel service checking
check_services_parallel() {
    local services=("$@")
    local pids=()
    local results=()
    
    # Start parallel checks
    for service in "${services[@]}"; do
        (
            local container_status=$(check_container_status "$service")
            local port=$(get_service_port "$service")
            local port_status=$(fast_check_port "$port")
            local health_status=$(fast_check_health "$service")
            local deps_status=$(check_service_dependencies "$service")
            
            
            echo "$service|$container_status|$port_status|$health_status|$deps_status" > "/tmp/statex_check_$service"
        ) &
        pids+=($!)
    done
    
    # Wait for all checks to complete
    for pid in "${pids[@]}"; do
        wait "$pid"
    done
    
    # Collect results
    for service in "${services[@]}"; do
        if [[ -f "/tmp/statex_check_$service" ]]; then
            cat "/tmp/statex_check_$service"
            rm -f "/tmp/statex_check_$service"
        fi
    done
}

# Smart service filtering - only check what's needed
get_services_to_check() {
    local all_services=($(get_all_services))
    local services_to_check=()
    
    for service in "${all_services[@]}"; do
        local container_status=$(check_container_status "$service")
        # Only check services that are not running or have issues
        if [[ "$container_status" != "running" ]]; then
            services_to_check+=("$service")
        fi
    done
    
    echo "${services_to_check[@]}"
}

# Quick status summary
quick_status() {
    print_header
    print_status "Quick StateX Services Status (Development Mode):"
    echo ""
    
    start_timer
    
    # Load service registry
    load_service_registry
    
    # Get services that need checking
    local services_to_check=($(get_services_to_check))
    local all_services=($(get_all_services))
    
    if [[ ${#services_to_check[@]} -eq 0 ]]; then
        print_success "All services appear to be running! Performing quick verification..."
        services_to_check=("${all_services[@]}")
    fi
    
    # Check services in parallel batches
    local batch_size=$PARALLEL_CHECKS
    local total_services=${#all_services[@]}
    local checked_services=0
    local healthy_count=0
    local warning_count=0
    local error_count=0
    
    # Populate service status file with ALL services first
    > "$SERVICE_STATUS_FILE"
    for service in "${all_services[@]}"; do
        local container_status=$(check_container_status "$service")
        echo "$service|$container_status" >> "$SERVICE_STATUS_FILE"
    done
    
    # Group services by category for better display
    local categories=("infrastructure" "platform" "ai" "website" "notification" "monitoring")
    
    for category in "${categories[@]}"; do
        local category_services=($(get_services_by_category "$category"))
        if [[ ${#category_services[@]} -eq 0 ]]; then
            continue
        fi
        
        local category_title=$(echo "$category" | cut -c1 | tr '[:lower:]' '[:upper:]')$(echo "$category" | cut -c2-)
        echo -e "${BOLD}${BLUE}${category_title} Services:${NC}"
        
        # Check services in this category
        local category_results=($(check_services_parallel "${category_services[@]}"))
        
        for result in "${category_results[@]}"; do
            IFS='|' read -r service_name container_status port_status health_status deps_status <<< "$result"
            ((checked_services++))
            
            # Determine status icon
            local status_icon
            if [[ "$container_status" == "running" && "$health_status" == "healthy" && "$port_status" == "open" && "$deps_status" == "satisfied" ]]; then
                status_icon="$STATUS_HEALTHY"
                ((healthy_count++))
            elif [[ "$container_status" == "running" && ("$health_status" == "unhealthy" || "$port_status" == "closed" || "$deps_status" =~ "missing:") ]]; then
                status_icon="$STATUS_WARNING"
                ((warning_count++))
            elif [[ "$container_status" == "not_found" || "$container_status" == "exited" ]]; then
                status_icon="$STATUS_ERROR"
                ((error_count++))
            else
                status_icon="$STATUS_UNKNOWN"
                ((warning_count++))
            fi
            
            # Get port
            local port=$(get_service_port "$service_name")
            
            # Display service status
            printf "  %s %-25s (:%s) - %s" "$status_icon" "$service_name" "$port" "$container_status"
            
            # Add health indicator
            if [[ "$health_status" == "healthy" ]]; then
                printf " ${GREEN}✓${NC}"
            elif [[ "$health_status" == "unhealthy" ]]; then
                printf " ${YELLOW}⚠${NC}"
            else
                printf " ${RED}✗${NC}"
            fi
            
            # Add dependency status
            if [[ "$deps_status" =~ "missing:" ]]; then
                local missing_dep="${deps_status#missing:}"
                printf " ${RED}(Missing: $missing_dep)${NC}"
            fi
            
            printf "\n"
        done
        echo ""
    done
    
    local duration=$(end_timer)
    
    # Summary
    echo -e "${BOLD}Quick Status Summary (${duration}s):${NC}"
    echo -e "  ${STATUS_HEALTHY} Healthy:  ${GREEN}$healthy_count${NC}"
    echo -e "  ${STATUS_WARNING} Warning:  ${YELLOW}$warning_count${NC}"
    echo -e "  ${STATUS_ERROR} Error:    ${RED}$error_count${NC}"
    echo -e "  Total:     $total_services"
    echo ""
    
    # Show services that need attention
    if [[ $warning_count -gt 0 || $error_count -gt 0 ]]; then
        echo -e "${BOLD}${YELLOW}Services Needing Attention:${NC}"
        for result in "${category_results[@]}"; do
            IFS='|' read -r service_name container_status port_status health_status deps_status <<< "$result"
            local port=$(get_service_port "$service_name")
            
            if [[ "$container_status" != "running" || "$health_status" != "healthy" || "$port_status" != "open" || "$deps_status" =~ "missing:" ]]; then
                printf "  %s %s (:%s) - %s" "$STATUS_WARNING" "$service_name" "$port" "$container_status"
                if [[ "$health_status" == "unhealthy" ]]; then
                    printf " ${RED}(Health check failed)${NC}"
                fi
                if [[ "$port_status" == "closed" ]]; then
                    printf " ${RED}(Port not accessible)${NC}"
                fi
                if [[ "$deps_status" =~ "missing:" ]]; then
                    local missing_dep="${deps_status#missing:}"
                    printf " ${RED}(Missing: $missing_dep)${NC}"
                fi
                printf "\n"
            fi
        done
        echo ""
    fi
    
    # Development tips
    if [[ $error_count -gt 0 ]]; then
        echo -e "${BOLD}${CYAN}Quick Fix Commands:${NC}"
        echo "  ./dev-manage.sh start-missing    # Start only missing services"
        echo "  ./dev-manage.sh restart-failed   # Restart failed services"
        echo "  ./dev-manage.sh dev [service]    # Start specific service"
        echo ""
    fi
}

create_service_registry() {
    cat > "$SERVICES_REGISTRY_FILE" << 'EOF'
# StateX Services Registry
# Format: SERVICE_NAME|PORT|HEALTH_ENDPOINT|DEPENDENCIES|DOCKER_COMPOSE_FILE|CATEGORY|DESCRIPTION

# Infrastructure Services
postgres|${POSTGRES_EXTERNAL_PORT:-5432}|/health|none|../statex-infrastructure/docker-compose.dev.yml|infrastructure|PostgreSQL Database
redis|${REDIS_EXTERNAL_PORT:-6379}|/health|none|../statex-infrastructure/docker-compose.dev.yml|infrastructure|Redis Cache
rabbitmq|${RABBITMQ_EXTERNAL_PORT:-5672}|/health|none|../statex-infrastructure/docker-compose.dev.yml|infrastructure|RabbitMQ Message Queue
minio|${MINIO_EXTERNAL_PORT:-9000}|/minio/health/live|none|../statex-infrastructure/docker-compose.dev.yml|infrastructure|MinIO Object Storage
elasticsearch|${ELASTICSEARCH_EXTERNAL_PORT:-9200}|/_cluster/health|none|../statex-infrastructure/docker-compose.dev.yml|infrastructure|Elasticsearch Search Engine
nginx|${NGINX_EXTERNAL_PORT:-80}|/health|postgres,redis,rabbitmq,minio|../statex-infrastructure/docker-compose.dev.yml|infrastructure|Nginx Reverse Proxy

# Platform Services
api-gateway|${API_GATEWAY_EXTERNAL_PORT:-8001}|/health|nginx|docker-compose.dev.yml|platform|API Gateway
platform-management|${PLATFORM_MANAGEMENT_EXTERNAL_PORT:-8000}|/health|postgres,redis,rabbitmq|docker-compose.dev.yml|platform|Platform Management Service

# AI Services
ai-orchestrator|${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}|/health|postgres,redis,rabbitmq|../statex-ai/docker-compose.dev.yml|ai|AI Orchestrator
nlp-service|${NLP_SERVICE_EXTERNAL_PORT:-8011}|/health|ai-orchestrator|../statex-ai/docker-compose.dev.yml|ai|NLP Service
asr-service|${ASR_SERVICE_EXTERNAL_PORT:-8012}|/health|ai-orchestrator|../statex-ai/docker-compose.dev.yml|ai|ASR Service
document-ai|${DOCUMENT_AI_EXTERNAL_PORT:-8013}|/health|ai-orchestrator|../statex-ai/docker-compose.dev.yml|ai|Document AI Service
prototype-generator|${PROTOTYPE_GENERATOR_EXTERNAL_PORT:-8014}|/health|ai-orchestrator|../statex-ai/docker-compose.dev.yml|ai|Prototype Generator
template-repository|${TEMPLATE_REPOSITORY_EXTERNAL_PORT:-8015}|/health|ai-orchestrator|../statex-ai/docker-compose.dev.yml|ai|Template Repository
free-ai-service|${FREE_AI_SERVICE_EXTERNAL_PORT:-8016}|/health|ai-orchestrator|../statex-ai/docker-compose.dev.yml|ai|Free AI Service
ai-workers|${AI_WORKERS_EXTERNAL_PORT:-8017}|/health|ai-orchestrator|../statex-ai/docker-compose.dev.yml|ai|AI Workers

# Website Services
submission-service|${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}|/health|postgres,redis,rabbitmq,minio|../statex-website/docker-compose.dev.yml|website|Submission Service
user-portal|${USER_PORTAL_EXTERNAL_PORT:-8006}|/health|postgres,redis|../statex-website/docker-compose.dev.yml|website|User Portal
content-service|${CONTENT_SERVICE_EXTERNAL_PORT:-8009}|/health|postgres,redis,elasticsearch,minio|../statex-website/docker-compose.dev.yml|website|Content Service

# Notification Service
notification-service|${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}|/health|postgres,redis,rabbitmq|../statex-notification-service/docker-compose.dev.yml|notification|Notification Service

# Monitoring Services
prometheus|${PROMETHEUS_EXTERNAL_PORT:-9090}|/-/healthy|none|../statex-monitoring/docker-compose.dev.yml|monitoring|Prometheus Metrics
grafana|${GRAFANA_EXTERNAL_PORT:-3002}|/api/health|prometheus|../statex-monitoring/docker-compose.dev.yml|monitoring|Grafana Dashboards
loki|${LOKI_EXTERNAL_PORT:-3100}|/ready|none|../statex-monitoring/docker-compose.dev.yml|monitoring|Loki Log Aggregation
jaeger|${JAEGER_EXTERNAL_PORT:-16686}|/health|none|../statex-monitoring/docker-compose.dev.yml|monitoring|Jaeger Tracing
alertmanager|${ALERTMANAGER_EXTERNAL_PORT:-9093}|/-/healthy|prometheus|../statex-monitoring/docker-compose.dev.yml|monitoring|AlertManager
node-exporter|${NODE_EXPORTER_EXTERNAL_PORT:-9100}|/metrics|none|../statex-monitoring/docker-compose.dev.yml|monitoring|Node Exporter
cadvisor|${CADVISOR_EXTERNAL_PORT:-8081}|/healthz|none|../statex-monitoring/docker-compose.dev.yml|monitoring|cAdvisor
blackbox-exporter|${BLACKBOX_EXPORTER_EXTERNAL_PORT:-9115}|/metrics|none|../statex-monitoring/docker-compose.dev.yml|monitoring|Blackbox Exporter
statex-monitoring-service|${MONITORING_SERVICE_EXTERNAL_PORT:-8007}|/health|prometheus,grafana,loki,jaeger|../statex-monitoring/docker-compose.dev.yml|monitoring|StateX Monitoring Service
logging-service|${LOGGING_SERVICE_EXTERNAL_PORT:-8008}|/health|loki|../statex-monitoring/docker-compose.dev.yml|monitoring|Logging Service
EOF
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  StateX Development Manager${NC}"
    echo -e "${PURPLE}  Enhanced Status & Fast Startup${NC}"
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

# Port Management Functions
kill_port_process() {
    local port="$1"
    local process_info=$(lsof -ti :$port 2>/dev/null)
    
    if [[ -n "$process_info" ]]; then
        print_warning "Port $port is in use. Attempting to free it..."
        echo "$process_info" | xargs kill -9 2>/dev/null
        sleep 2
        
        # Check if port is now free
        if lsof -ti :$port >/dev/null 2>&1; then
            print_error "Failed to free port $port. Please stop the process manually."
            return 1
        else
            print_success "Port $port is now free."
            return 0
        fi
    fi
    return 0
}

check_and_free_ports() {
    local ports=("${FRONTEND_EXTERNAL_PORT:-3000}" "${PLATFORM_MANAGEMENT_EXTERNAL_PORT:-8000}" "${API_GATEWAY_EXTERNAL_PORT:-8001}" "${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}" "${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}" "${USER_PORTAL_EXTERNAL_PORT:-8006}" "${MONITORING_SERVICE_EXTERNAL_PORT:-8007}" "${LOGGING_SERVICE_EXTERNAL_PORT:-8008}" "${CONTENT_SERVICE_EXTERNAL_PORT:-8009}" "${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}" "${NLP_SERVICE_EXTERNAL_PORT:-8011}" "${ASR_SERVICE_EXTERNAL_PORT:-8012}" "${DOCUMENT_AI_EXTERNAL_PORT:-8013}" "${PROTOTYPE_GENERATOR_EXTERNAL_PORT:-8014}" "${TEMPLATE_REPOSITORY_EXTERNAL_PORT:-8015}" "${FREE_AI_SERVICE_EXTERNAL_PORT:-8016}" "${AI_WORKERS_EXTERNAL_PORT:-8017}" "${PROMETHEUS_EXTERNAL_PORT:-9090}" "${GRAFANA_EXTERNAL_PORT:-3002}" "${LOKI_EXTERNAL_PORT:-3100}" "${JAEGER_EXTERNAL_PORT:-16686}" "${ALERTMANAGER_EXTERNAL_PORT:-9093}" "${NODE_EXPORTER_EXTERNAL_PORT:-9100}" "${CADVISOR_EXTERNAL_PORT:-8081}" "${BLACKBOX_EXPORTER_EXTERNAL_PORT:-9115}")
    
    print_status "Checking for port conflicts..."
    for port in "${ports[@]}"; do
        if lsof -ti :$port >/dev/null 2>&1; then
            print_warning "Port $port is in use. Freeing it..."
            kill_port_process "$port"
        fi
    done
}

check_docker_daemon() {
    print_status "Checking Docker daemon status..."
    
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker daemon is not running!"
        print_status "Please start Docker Desktop and try again."
        print_status "You can start Docker by running: open -a Docker"
        return 1
    fi
    
    print_success "Docker daemon is running"
    return 0
}

ensure_required_files() {
    print_status "Ensuring required service files exist..."
    
    # Check if all service directories exist
    local service_dirs=(
        "../statex-infrastructure"
        "../statex-ai"
        "../statex-website"
        "../statex-notification-service"
        "../statex-monitoring"
    )
    
    for dir in "${service_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            print_error "Service directory not found: $dir"
            return 1
        fi
        
        if [[ ! -f "$dir/docker-compose.dev.yml" ]]; then
            print_error "Docker compose file not found: $dir/docker-compose.dev.yml"
            return 1
        fi
    done
    
    # Check if platform services have required files
    if [[ ! -f "docker-compose.dev.yml" ]]; then
        print_error "Platform docker-compose.dev.yml not found"
        return 1
    fi
    
    print_success "All required files found"
    return 0
}

# Real-time Progress Functions
show_progress() {
    local message="$1"
    local duration="${2:-1}"
    
    for ((i=0; i<duration; i++)); do
        local char="${PROGRESS_CHARS:$((PROGRESS_INDEX % ${#PROGRESS_CHARS})):1}"
        printf "\r${CYAN}${char}${NC} $message"
        sleep 0.1
        ((PROGRESS_INDEX++))
    done
    printf "\r${GREEN}✓${NC} $message\n"
}

show_spinner() {
    local pid=$1
    local message="$2"
    local delay=0.1
    local spinstr='|/-\'
    
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf "\r${CYAN}${spinstr:0:1}${NC} $message"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
    done
    printf "\r${GREEN}✓${NC} $message\n"
}

show_progress_bar() {
    local current=$1
    local total=$2
    local message="$3"
    local width=50
    local percentage=$((current * 100 / total))
    local filled=$((current * width / total))
    local empty=$((width - filled))
    
    printf "\r${BLUE}[${NC}"
    printf "%${filled}s" | tr ' ' '='
    printf "%${empty}s" | tr ' ' ' '
    printf "${BLUE}]${NC} ${percentage}%% - $message"
}

clear_line() {
    printf "\r%*s\r" $(tput cols) ""
}

show_live_status() {
    local service_name="$1"
    local port="$2"
    local max_attempts=30
    local attempt=0
    
    printf "${CYAN}🔄 Starting $service_name...${NC}"
    
    while [ $attempt -lt $max_attempts ]; do
        local container_status=$(check_container_status "$service_name")
        local port_status=$(check_port_accessibility "$port")
        
        if [[ "$container_status" == "running" && "$port_status" == "open" ]]; then
            clear_line
            printf "${GREEN}✓ $service_name started successfully${NC}\n"
            return 0
        elif [[ "$container_status" == "exited" || "$container_status" == "not_found" ]]; then
            clear_line
            printf "${RED}✗ $service_name failed to start${NC}\n"
            return 1
        fi
        
        local char="${PROGRESS_CHARS:$((attempt % ${#PROGRESS_CHARS})):1}"
        printf "\r${CYAN}${char}${NC} Starting $service_name... (attempt $((attempt + 1))/$max_attempts)"
        sleep 1
        ((attempt++))
    done
    
    clear_line
    printf "${YELLOW}⚠ $service_name starting slowly...${NC}\n"
    return 0
}

# Enhanced Status Checking Functions with Caching
check_container_status() {
    local service_name="$1"
    
    # Check cache first
    if get_cached_status "$service_name" "container" >/dev/null 2>&1; then
        get_cached_status "$service_name" "container"
        return
    fi
    
    # Special handling for frontend - check if running locally on port 3000
    if [[ "$service_name" == "frontend" ]]; then
        if nc -z -w3 localhost 3000 2>/dev/null; then
            status="running"
        else
            status="not_found"
        fi
        set_cached_status "$service_name" "container" "$status"
        echo "$status"
        return
    fi
    
    # Map service names to actual container names
    local container_name=""
    case "$service_name" in
        "api-gateway") container_name="${API_GATEWAY_CONTAINER_NAME:-statex_api_gateway_dev}" ;;
        "platform-management") container_name="${PLATFORM_MANAGEMENT_CONTAINER_NAME:-statex_platform_management_dev}" ;;
        "ai-orchestrator") container_name="${AI_ORCHESTRATOR_CONTAINER_NAME:-statex_ai_orchestrator_dev}" ;;
        "nlp-service") container_name="${NLP_SERVICE_CONTAINER_NAME:-statex_nlp_dev}" ;;
        "asr-service") container_name="${ASR_SERVICE_CONTAINER_NAME:-statex_asr_dev}" ;;
        "document-ai") container_name="${DOCUMENT_AI_CONTAINER_NAME:-statex_document_ai_dev}" ;;
        "prototype-generator") container_name="${PROTOTYPE_GENERATOR_CONTAINER_NAME:-statex_prototype_generator_dev}" ;;
        "template-repository") container_name="${TEMPLATE_REPOSITORY_CONTAINER_NAME:-statex_template_repo_dev}" ;;
        "free-ai-service") container_name="${FREE_AI_SERVICE_CONTAINER_NAME:-statex_free_ai_dev}" ;;
        "ai-workers") container_name="${AI_WORKERS_CONTAINER_NAME:-statex_ai_workers_dev}" ;;
        "submission-service") container_name="${SUBMISSION_SERVICE_CONTAINER_NAME:-statex_submission_dev}" ;;
        "user-portal") container_name="${USER_PORTAL_CONTAINER_NAME:-statex_user_portal_dev}" ;;
        "content-service") container_name="${CONTENT_SERVICE_CONTAINER_NAME:-statex_content_dev}" ;;
        "notification-service") container_name="${NOTIFICATION_SERVICE_CONTAINER_NAME:-statex_notification_dev}" ;;
        "statex-monitoring-service") container_name="${MONITORING_SERVICE_CONTAINER_NAME:-statex_monitoring_service_dev}" ;;
        "logging-service") container_name="${LOGGING_SERVICE_CONTAINER_NAME:-statex_logging_service_dev}" ;;
        "node-exporter") container_name="${NODE_EXPORTER_CONTAINER_NAME:-statex_node_exporter_dev}" ;;
        "blackbox-exporter") container_name="${BLACKBOX_EXPORTER_CONTAINER_NAME:-statex_blackbox_dev}" ;;
        "prometheus") container_name="${PROMETHEUS_CONTAINER_NAME:-statex_prometheus_dev}" ;;
        "grafana") container_name="${GRAFANA_CONTAINER_NAME:-statex_grafana_dev}" ;;
        "loki") container_name="${LOKI_CONTAINER_NAME:-statex_loki_dev}" ;;
        "jaeger") container_name="${JAEGER_CONTAINER_NAME:-statex_jaeger_dev}" ;;
        "alertmanager") container_name="${ALERTMANAGER_CONTAINER_NAME:-statex_alertmanager_dev}" ;;
        "cadvisor") container_name="${CADVISOR_CONTAINER_NAME:-statex_cadvisor_dev}" ;;
        "postgres") container_name="${POSTGRES_CONTAINER_NAME:-statex_postgres_dev}" ;;
        "redis") container_name="${REDIS_CONTAINER_NAME:-statex_redis_dev}" ;;
        "rabbitmq") container_name="${RABBITMQ_CONTAINER_NAME:-statex_rabbitmq_dev}" ;;
        "minio") container_name="${MINIO_CONTAINER_NAME:-statex_minio_dev}" ;;
        "elasticsearch") container_name="${ELASTICSEARCH_CONTAINER_NAME:-statex_elasticsearch_dev}" ;;
        "nginx") container_name="${NGINX_CONTAINER_NAME:-statex_nginx_dev}" ;;
        *) container_name="statex_${service_name}_dev" ;;
    esac
    
    local status=""
    
    # Check for exact match first
    if docker ps --format "{{.Names}}" | grep -q "^${container_name}$"; then
        local docker_status=$(docker ps --format "{{.Status}}" --filter "name=${container_name}")
        if [[ "$docker_status" =~ "Up" ]]; then
            status="running"
        else
            status="stopped"
        fi
    elif docker ps -a --format "{{.Names}}" | grep -q "^${container_name}$"; then
        status="exited"
    else
        status="not_found"
    fi
    
    # Cache the result
    set_cached_status "$service_name" "container" "$status"
    echo "$status"
}

check_port_accessibility() {
    local port="$1"
    local timeout=2
    
    # Check cache first
    if get_cached_status "port_$port" "accessibility" >/dev/null 2>&1; then
        get_cached_status "port_$port" "accessibility"
        return
    fi
    
    local status=""
    
    if command -v nc >/dev/null 2>&1; then
        if nc -z -w$timeout localhost "$port" 2>/dev/null; then
            status="open"
        else
            status="closed"
        fi
    elif command -v telnet >/dev/null 2>&1; then
        if timeout $timeout telnet localhost "$port" >/dev/null 2>&1; then
            status="open"
        else
            status="closed"
        fi
    else
        # Fallback using curl
        if curl -s --connect-timeout $timeout "http://localhost:$port" >/dev/null 2>&1; then
            status="open"
        else
            status="closed"
        fi
    fi
    
    # Cache the result
    set_cached_status "port_$port" "accessibility" "$status"
    echo "$status"
}

check_service_endpoint() {
    local service_name="$1"
    local port=$(get_service_port "$service_name")
    local health_endpoint=$(get_service_health_endpoint "$service_name")
    local timeout=5
    
    if [[ -z "$port" || -z "$health_endpoint" ]]; then
        echo "unknown"
        return
    fi
    
    local url="http://localhost:$port$health_endpoint"
    
    if curl -s --connect-timeout $timeout --max-time $timeout "$url" >/dev/null 2>&1; then
        echo "healthy"
    else
        echo "unhealthy"
    fi
}

check_service_dependencies() {
    local service_name="$1"
    local dependencies=$(get_service_dependencies "$service_name")
    
    if [[ "$dependencies" == "none" || -z "$dependencies" ]]; then
        echo "satisfied"
        return
    fi
    
    IFS=',' read -ra DEPS <<< "$dependencies"
    for dep in "${DEPS[@]}"; do
        dep=$(echo "$dep" | xargs) # trim whitespace
        local dep_status=$(grep "^$dep|" "$SERVICE_STATUS_FILE" 2>/dev/null | cut -d'|' -f2)
        if [[ "$dep_status" != "running" ]]; then
            echo "missing:$dep"
            return
        fi
    done
    
    echo "satisfied"
}

get_service_status_icon() {
    local status="$1"
    local health="$2"
    local port_status="$3"
    local deps_status="$4"
    
    if [[ "$status" == "running" && "$health" == "healthy" && "$port_status" == "open" && "$deps_status" == "satisfied" ]]; then
        echo "$STATUS_HEALTHY"
    elif [[ "$status" == "running" && ("$health" == "unhealthy" || "$port_status" == "closed" || "$deps_status" =~ "missing:") ]]; then
        echo "$STATUS_WARNING"
    elif [[ "$status" == "not_found" || "$status" == "exited" ]]; then
        echo "$STATUS_ERROR"
    else
        echo "$STATUS_UNKNOWN"
    fi
}

get_service_status_color() {
    local status="$1"
    local health="$2"
    local port_status="$3"
    local deps_status="$4"
    
    if [[ "$status" == "running" && "$health" == "healthy" && "$port_status" == "open" && "$deps_status" == "satisfied" ]]; then
        echo "$GREEN"
    elif [[ "$status" == "running" && ("$health" == "unhealthy" || "$port_status" == "closed" || "$deps_status" =~ "missing:") ]]; then
        echo "$YELLOW"
    elif [[ "$status" == "not_found" || "$status" == "exited" ]]; then
        echo "$RED"
    else
        echo "$CYAN"
    fi
}

print_help() {
    echo "StateX Development Manager - Ultra-Fast Development Mode"
    echo "======================================================="
    echo ""
    echo "This script provides ultra-fast development environment management with:"
    echo "  - Parallel service checking and startup"
    echo "  - Smart caching and minimal timeouts"
    echo "  - Only start what's needed"
    echo "  - Instant status checking"
    echo "  - Development-optimized workflows"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "🚀 FAST COMMANDS (Recommended for Development):"
    echo "  start [--fast]           Ultra-fast startup (only starts missing services)"
    echo "  start --ultra-fast       Maximum speed startup (enhanced parallel processing)"
    echo "  start-missing            Start only services that are not running"
    echo "  restart-failed           Restart only services that have failed"
    echo "  status --quick           Quick status check (parallel, fast timeouts)"
    echo "  fix                      Auto-fix: start missing + restart failed"
    echo ""
    echo "📊 STATUS & MONITORING:"
    echo "  status [--quick]         Show service status (--quick for fast parallel check)"
    echo "  status --realtime        Live status updates with progress indicators"
    echo "  health                   Detailed health check with analysis"
    echo "  logs [service]           Show logs for all services or specific service"
    echo "  watch [interval]         Watch services with real-time updates (default: 5s)"
    echo ""
    echo "🔧 DEVELOPMENT:"
    echo "  dev [service]            Start individual service in development mode"
    echo "  restart [--fast]         Restart all services (--fast for ultra-fast restart)"
    echo "  stop                     Stop all development services"
    echo "  diagnose                 Diagnose issues and provide troubleshooting suggestions"
    echo ""
    echo "🛠️  MAINTENANCE:"
    echo "  clean [--force]          Clean up containers and volumes"
    echo "  setup                    Initial setup and configuration"
    echo ""
    echo "⚡ PERFORMANCE OPTIONS:"
    echo "  --fast, --ultra-fast     Use ultra-fast startup (parallel, minimal timeouts)"
    echo "  --quick                  Quick status check (parallel processing)"
    echo "  --realtime               Live status updates with progress indicators"
    echo "  --force                  Force operation without confirmation"
    echo ""
    echo "🎯 DEVELOPMENT WORKFLOW:"
    echo "  1. ./dev-manage.sh start --fast     # Ultra-fast startup"
    echo "  2. ./dev-manage.sh status --quick   # Quick status check"
    echo "  3. ./dev-manage.sh fix              # Auto-fix any issues"
    echo "  4. ./dev-manage.sh dev [service]    # Start specific service"
    echo ""
    echo "📈 SERVICE CATEGORIES:"
    echo "  infrastructure      PostgreSQL, Redis, RabbitMQ, MinIO, Elasticsearch, Nginx"
    echo "  platform           API Gateway, Platform Management"
    echo "  ai                  AI Orchestrator, NLP, ASR, Document AI, etc."
    echo "  website             Frontend, Submission Service, User Portal, Content Service"
    echo "  notification        Notification Service"
    echo "  monitoring          Prometheus, Grafana, Loki, Jaeger, etc."
    echo ""
    echo "🚀 EXAMPLES:"
    echo "  $0 start --ultra-fast        # Maximum speed startup (enhanced parallel)"
    echo "  $0 start --fast              # Ultra-fast startup (recommended)"
    echo "  $0 status --quick            # Quick parallel status check"
    echo "  $0 start-missing             # Start only missing services"
    echo "  $0 restart-failed            # Restart only failed services"
    echo "  $0 fix                       # Auto-fix all issues"
    echo "  $0 frontend                  # Start frontend locally with npm run dev"
    echo "  $0 logs ai-orchestrator      # View AI orchestrator logs"
    echo "  $0 watch 3                   # Watch services with 3-second updates"
    echo ""
    echo "📊 STATUS INDICATORS:"
    echo "  🟢 Healthy    - Service running, port open, health check passing"
    echo "  🟡 Warning    - Service running but has issues"
    echo "  🔴 Error      - Service not running or container not found"
    echo "  ⚪ Unknown    - Status cannot be determined"
    echo ""
    echo "⚡ PERFORMANCE FEATURES:"
    echo "  - Enhanced parallel processing (12 concurrent checks by default)"
    echo "  - In-memory caching for faster status checks"
    echo "  - Service batching for optimal startup performance"
    echo "  - Retry mechanisms with exponential backoff"
    echo "  - Fast timeouts (1 second by default)"
    echo "  - Smart caching (5 second cache duration)"
    echo "  - Only check what's needed"
    echo "  - Instant startup for already running services"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Check if statex_network exists
check_network() {
    if ! docker network ls | grep -q statex_network; then
        print_status "Creating statex_network..."
        docker network create statex_network --driver bridge
        print_success "Network statex_network created"
    else
        print_success "Network statex_network already exists"
    fi
}

# Check if required images exist locally
check_images() {
    print_status "Checking for required Docker images..."
    
    # List of required images
    local required_images=(
        "postgres:15"
        "redis:7-alpine"
        "rabbitmq:3-management"
        "minio/minio:latest"
        "elasticsearch:8.11.0"
        "nginx:alpine"
        "alpine:latest"
        "node:23.11.0-slim"
        "python:3.11-slim"
        "prom/prometheus:latest"
        "grafana/grafana:latest"
        "grafana/loki:latest"
        "jaegertracing/all-in-one:latest"
        "prom/alertmanager:latest"
        "prom/node-exporter:latest"
        "gcr.io/cadvisor/cadvisor:latest"
        "prom/blackbox-exporter:latest"
    )
    
    local missing_images=()
    
    for image in "${required_images[@]}"; do
        if ! docker image inspect "$image" > /dev/null 2>&1; then
            missing_images+=("$image")
        fi
    done
    
    if [ ${#missing_images[@]} -gt 0 ]; then
        print_warning "Missing images detected. Pulling them now..."
        for image in "${missing_images[@]}"; do
            print_status "Pulling $image..."
            docker pull "$image"
        done
        print_success "All required images are now available"
    else
        print_success "All required images are available locally"
    fi
}

# Start infrastructure services
start_infrastructure() {
    print_status "Starting infrastructure services (Docker)..."
    cd ../statex-infrastructure
    docker compose -f docker-compose.dev.yml up -d
    cd ../statex-platform
    print_success "Infrastructure services started"
}

# Start platform services
start_platform() {
    print_status "Starting platform services (Volume mounts)..."
    docker compose -f docker-compose.dev.yml up -d
    print_success "Platform services started"
}

# Start AI services
start_ai() {
    print_status "Starting AI services (Volume mounts)..."
    cd ../statex-ai
    docker compose -f docker-compose.dev.yml up -d
    cd ../statex-platform
    print_success "AI services started"
}

# Start notification service
start_notification() {
    print_status "Starting notification service (Volume mounts)..."
    cd ../statex-notification-service
    docker compose -f docker-compose.dev.yml up -d
    cd ../statex-platform
    print_success "Notification service started"
}

# Start website services
start_website() {
    print_status "Starting website services (Volume mounts)..."
    cd ../statex-website
    docker compose -f docker-compose.dev.yml up -d
    cd ../statex-platform
    print_success "Website services started"
}

# Start monitoring services
start_monitoring() {
    print_status "Starting monitoring services (Hybrid)..."
    cd ../statex-monitoring
    docker compose -f docker-compose.dev.yml up -d
    cd ../statex-platform
    print_success "Monitoring services started"
}

# Ultra-fast startup - only start what's needed
start_ultra_fast() {
    print_header
    print_status "Ultra-Fast StateX Startup (Development Mode)..."
    echo ""
    
    start_timer
    start_startup_timer
    
    # Quick pre-checks
    if ! check_docker_daemon; then
        return 1
    fi
    
    # Load service registry
    load_service_registry
    
    # Get services that need starting
    local all_services=($(get_all_services))
    local services_to_start=()
    local already_running=()
    
    print_status "Analyzing current service status..."
    
    for service in "${all_services[@]}"; do
        local container_status=$(check_container_status "$service")
        if [[ "$container_status" == "running" ]]; then
            already_running+=("$service")
        else
            services_to_start+=("$service")
        fi
    done
    
    echo -e "  ${STATUS_HEALTHY} Already running: ${GREEN}${#already_running[@]}${NC}"
    echo -e "  ${STATUS_WARNING} Need to start: ${YELLOW}${#services_to_start[@]}${NC}"
    echo ""
    
    if [[ ${#services_to_start[@]} -eq 0 ]]; then
        print_success "All services are already running! No startup needed."
        local duration=$(end_timer)
        echo -e "${GREEN}Startup completed in ${duration}s${NC}"
        return 0
    fi
    
    # Start services by category with enhanced parallel processing
    local categories=("infrastructure" "platform" "ai" "website" "notification" "monitoring")
    local started_count=0
    local total_to_start=${#services_to_start[@]}
    
    for category in "${categories[@]}"; do
        local category_services=()
        for service in "${services_to_start[@]}"; do
            local service_category=$(get_service_category "$service")
            if [[ "$service_category" == "$category" ]]; then
                category_services+=("$service")
            fi
        done
        
        if [[ ${#category_services[@]} -gt 0 ]]; then
            # Use enhanced batching for better performance
            start_services_batch "$category" "${category_services[@]}"
            ((started_count += ${#category_services[@]}))
        fi
    done
    
    local duration=$(end_timer)
    
    # Quick verification
    print_status "Verifying services..."
    sleep 2
    
    local healthy_count=0
    local total_services=${#all_services[@]}
    
    for service in "${all_services[@]}"; do
        local container_status=$(check_container_status "$service")
        local port=$(get_service_port "$service")
        local port_status=$(fast_check_port "$port")
        
        if [[ "$container_status" == "running" && "$port_status" == "open" ]]; then
            ((healthy_count++))
        fi
    done
    
    echo ""
    print_success "Startup completed in ${duration}s!"
    echo -e "  ${STATUS_HEALTHY} Services running: ${GREEN}$healthy_count/$total_services${NC}"
    echo ""
    
    # Show access URLs
    print_status "Access URLs:"
    echo "  🌐 Website Frontend:     http://localhost:${FRONTEND_EXTERNAL_PORT:-3000}"
    echo "  🔗 API Gateway:          http://localhost:${API_GATEWAY_EXTERNAL_PORT:-8001}"
    echo "  📝 Submission Service:   http://localhost:${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}"
    echo "  📧 Notification Service: http://localhost:${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}"
    echo "  👤 User Portal:          http://localhost:${USER_PORTAL_EXTERNAL_PORT:-8006}"
    echo "  📊 Monitoring Service:   http://localhost:${MONITORING_SERVICE_EXTERNAL_PORT:-8007}"
    echo "  📋 Logging Service:      http://localhost:${LOGGING_SERVICE_EXTERNAL_PORT:-8008}"
    echo "  🤖 AI Orchestrator:      http://localhost:${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}"
    echo "  📈 Grafana:              http://localhost:${GRAFANA_EXTERNAL_PORT:-3002}"
    echo "  🔍 Prometheus:           http://localhost:${PROMETHEUS_EXTERNAL_PORT:-9090}"
    echo ""
    
    if [[ $healthy_count -lt $total_services ]]; then
        print_warning "Some services may still be starting up. Use './dev-manage.sh status' to check."
    fi
}

# Enhanced parallel service startup with batching and retry
start_services_batch() {
    local services=("$@")
    local category="$1"
    shift
    local service_list=("$@")
    
    if [[ ${#service_list[@]} -eq 0 ]]; then
        return 0
    fi
    
    local category_title=$(echo "$category" | cut -c1 | tr '[:lower:]' '[:upper:]')$(echo "$category" | cut -c2-)
    echo -e "${BOLD}${BLUE}Starting $category_title Services:${NC}"
    
    # Start services in parallel batches
    local batch_count=0
    local total_services=${#service_list[@]}
    local pids=()
    local results=()
    
    for ((i=0; i<total_services; i+=BATCH_SIZE)); do
        local batch_services=("${service_list[@]:i:BATCH_SIZE}")
        local batch_num=$((batch_count + 1))
        
        echo "  Batch $batch_num: ${batch_services[*]}"
        
        # Start services in this batch in parallel
        for service_name in "${batch_services[@]}"; do
            start_service_parallel "$service_name" "$category" &
            pids+=($!)
        done
        
        # Wait for this batch to complete
        for pid in "${pids[@]}"; do
            wait "$pid"
        done
        
        # Clear pids array for next batch
        pids=()
        ((batch_count++))
        
        # Small delay between batches to prevent overwhelming Docker
        if [[ $i -lt $((total_services - BATCH_SIZE)) ]]; then
            sleep 1
        fi
    done
    
    echo ""
}

# Enhanced service startup with retry mechanism
start_service_parallel() {
    local service_name="$1"
    local category="$2"
    local port=$(get_service_port "$service_name")
    local retry_count=0
    local max_retries=$MAX_RETRIES
    
    # Record start time
    local service_start_time=$(date +%s.%N)
    
    while [[ $retry_count -lt $max_retries ]]; do
        printf "  Starting $service_name... "
        
        # Determine compose file and working directory
        local compose_file=""
        local working_dir=""
        
        case "$category" in
            "infrastructure")
                working_dir="../statex-infrastructure"
                compose_file="docker-compose.dev.yml"
                ;;
            "ai")
                working_dir="../statex-ai"
                compose_file="docker-compose.dev.yml"
                ;;
            "website")
                working_dir="../statex-website"
                compose_file="docker-compose.dev.yml"
                ;;
            "notification")
                working_dir="../statex-notification-service"
                compose_file="docker-compose.dev.yml"
                ;;
            "monitoring")
                working_dir="../statex-monitoring"
                compose_file="docker-compose.dev.yml"
                ;;
            *)
                # Platform services
                working_dir="."
                compose_file="docker-compose.dev.yml"
                ;;
        esac
        
        # Start the service
        local start_result=0
        local error_output=""
        
        if [[ "$working_dir" != "." ]]; then
            cd "$working_dir" >/dev/null 2>&1
            error_output=$(docker compose -f "$compose_file" up -d "$service_name" 2>&1)
            start_result=$?
            cd - >/dev/null 2>&1
        else
            error_output=$(docker compose -f "$compose_file" up -d "$service_name" 2>&1)
            start_result=$?
        fi
        
        if [[ $start_result -eq 0 ]]; then
            # Quick verification with timeout
            local max_attempts=15
            local attempt=0
            local success=false
            
            while [[ $attempt -lt $max_attempts ]]; do
                local container_status=$(check_container_status "$service_name")
                local port_status=$(fast_check_port "$port")
                
                if [[ "$container_status" == "running" && "$port_status" == "open" ]]; then
                    success=true
                    break
                fi
                
                sleep 0.3
                ((attempt++))
            done
            
            if [[ "$success" == true ]]; then
                local service_end_time=$(date +%s.%N)
                local service_duration=$(echo "$service_end_time - $service_start_time" | bc -l 2>/dev/null || echo "0")
                printf "${GREEN}✓ (${service_duration}s)${NC}\n"
                return 0
            else
                printf "${YELLOW}⚠ (starting)${NC}\n"
                # Don't retry if container started but port not ready - it might be starting up
                return 0
            fi
        else
            ((retry_count++))
            if [[ $retry_count -lt $max_retries ]]; then
                printf "${YELLOW}⚠ (retry $retry_count/$max_retries)${NC}\n"
                sleep 2
            else
                printf "${RED}✗ (failed after $max_retries retries)${NC}\n"
                if [[ -n "$error_output" ]]; then
                    echo "    Error: $error_output"
                fi
                return 1
            fi
        fi
    done
}

# Legacy function for backward compatibility
start_service_fast() {
    start_service_parallel "$1" "$2"
}

# Start only missing services
start_missing() {
    print_header
    print_status "Starting only missing services..."
    echo ""
    
    load_service_registry
    local all_services=($(get_all_services))
    local missing_services=()
    
    for service in "${all_services[@]}"; do
        local container_status=$(check_container_status "$service")
        if [[ "$container_status" != "running" ]]; then
            missing_services+=("$service")
        fi
    done
    
    if [[ ${#missing_services[@]} -eq 0 ]]; then
        print_success "No missing services found!"
        return 0
    fi
    
    echo -e "Missing services: ${YELLOW}${missing_services[*]}${NC}"
    echo ""
    
    # Start missing services
    for service in "${missing_services[@]}"; do
        local category=$(get_service_category "$service")
        start_service_fast "$service" "$category"
    done
    
    echo ""
    print_success "Missing services started!"
}

# Restart failed services
restart_failed() {
    print_header
    print_status "Restarting failed services..."
    echo ""
    
    load_service_registry
    local all_services=($(get_all_services))
    local failed_services=()
    
    for service in "${all_services[@]}"; do
        local container_status=$(check_container_status "$service")
        local port=$(get_service_port "$service")
        local port_status=$(fast_check_port "$port")
        
        if [[ "$container_status" == "running" && "$port_status" == "closed" ]]; then
            failed_services+=("$service")
        elif [[ "$container_status" != "running" ]]; then
            failed_services+=("$service")
        fi
    done
    
    if [[ ${#failed_services[@]} -eq 0 ]]; then
        print_success "No failed services found!"
        return 0
    fi
    
    echo -e "Failed services: ${YELLOW}${failed_services[*]}${NC}"
    echo ""
    
    # Restart failed services
    for service in "${failed_services[@]}"; do
        local category=$(get_service_category "$service")
        printf "  Restarting $service... "
        
        # Stop first
        local compose_file=""
        local working_dir=""
        
        case "$category" in
            "infrastructure") working_dir="../statex-infrastructure" ;;
            "ai") working_dir="../statex-ai" ;;
            "website") working_dir="../statex-website" ;;
            "notification") working_dir="../statex-notification-service" ;;
            "monitoring") working_dir="../statex-monitoring" ;;
            *) working_dir="." ;;
        esac
        
        compose_file="docker-compose.dev.yml"
        
        if [[ "$working_dir" != "." ]]; then
            cd "$working_dir" >/dev/null 2>&1
            docker compose -f "$compose_file" stop "$service" >/dev/null 2>&1
            docker compose -f "$compose_file" up -d "$service" >/dev/null 2>&1
            cd - >/dev/null 2>&1
        else
            docker compose -f "$compose_file" stop "$service" >/dev/null 2>&1
            docker compose -f "$compose_file" up -d "$service" >/dev/null 2>&1
        fi
        
        printf "${GREEN}✓${NC}\n"
    done
    
    echo ""
    print_success "Failed services restarted!"
}

# Maximum speed startup with enhanced parallel processing
start_ultra_fast_enhanced() {
    print_header
    print_status "Maximum Speed StateX Startup (Enhanced Parallel Mode)..."
    echo ""
    
    start_timer
    start_startup_timer
    
    # Quick pre-checks
    if ! check_docker_daemon; then
        return 1
    fi
    
    # Load service registry
    load_service_registry
    
    # Get services that need starting
    local all_services=($(get_all_services))
    local services_to_start=()
    local already_running=()
    
    print_status "Analyzing current service status with enhanced caching..."
    
    # Use parallel checking for faster analysis
    local check_pids=()
    local check_results=()
    
    for service in "${all_services[@]}"; do
        (
            local container_status=$(check_container_status "$service")
            echo "$service|$container_status" > "/tmp/statex_enhanced_check_$service"
        ) &
        check_pids+=($!)
    done
    
    # Wait for all checks to complete
    for pid in "${check_pids[@]}"; do
        wait "$pid"
    done
    
    # Collect results
    for service in "${all_services[@]}"; do
        if [[ -f "/tmp/statex_enhanced_check_$service" ]]; then
            local result=$(cat "/tmp/statex_enhanced_check_$service")
            IFS='|' read -r service_name container_status <<< "$result"
            
            if [[ "$container_status" == "running" ]]; then
                already_running+=("$service")
            else
                services_to_start+=("$service")
            fi
            
            rm -f "/tmp/statex_enhanced_check_$service"
        fi
    done
    
    echo -e "  ${STATUS_HEALTHY} Already running: ${GREEN}${#already_running[@]}${NC}"
    echo -e "  ${STATUS_WARNING} Need to start: ${YELLOW}${#services_to_start[@]}${NC}"
    echo ""
    
    if [[ ${#services_to_start[@]} -eq 0 ]]; then
        print_success "All services are already running! No startup needed."
        local duration=$(end_timer)
        local startup_duration=$(end_startup_timer)
        echo -e "${GREEN}Startup completed in ${duration}s (analysis: ${startup_duration}s)${NC}"
        return 0
    fi
    
    # Start services by category with maximum parallel processing
    local categories=("infrastructure" "platform" "ai" "website" "notification" "monitoring")
    local started_count=0
    local total_to_start=${#services_to_start[@]}
    
    for category in "${categories[@]}"; do
        local category_services=()
        for service in "${services_to_start[@]}"; do
            local service_category=$(get_service_category "$service")
            if [[ "$service_category" == "$category" ]]; then
                category_services+=("$service")
            fi
        done
        
        if [[ ${#category_services[@]} -gt 0 ]]; then
            # Use enhanced batching for maximum performance
            start_services_batch "$category" "${category_services[@]}"
            ((started_count += ${#category_services[@]}))
        fi
    done
    
    local duration=$(end_timer)
    local startup_duration=$(end_startup_timer)
    
    # Quick verification
    print_status "Verifying services with enhanced caching..."
    sleep 2
    
    local healthy_count=0
    local total_services=${#all_services[@]}
    
    # Use parallel verification
    local verify_pids=()
    for service in "${all_services[@]}"; do
        (
            local container_status=$(check_container_status "$service")
            local port=$(get_service_port "$service")
            local port_status=$(fast_check_port "$port")
            
            if [[ "$container_status" == "running" && "$port_status" == "open" ]]; then
                echo "healthy" > "/tmp/statex_verify_$service"
            else
                echo "unhealthy" > "/tmp/statex_verify_$service"
            fi
        ) &
        verify_pids+=($!)
    done
    
    # Wait for verification to complete
    for pid in "${verify_pids[@]}"; do
        wait "$pid"
    done
    
    # Count healthy services
    for service in "${all_services[@]}"; do
        if [[ -f "/tmp/statex_verify_$service" ]]; then
            local status=$(cat "/tmp/statex_verify_$service")
            if [[ "$status" == "healthy" ]]; then
                ((healthy_count++))
            fi
            rm -f "/tmp/statex_verify_$service"
        fi
    done
    
    echo ""
    print_success "Startup completed in ${duration}s (analysis: ${startup_duration}s)!"
    echo -e "  ${STATUS_HEALTHY} Services running: ${GREEN}$healthy_count/$total_services${NC}"
    echo ""
    
    # Show access URLs
    print_status "Access URLs:"
    echo "  🌐 Website Frontend:     http://localhost:${FRONTEND_EXTERNAL_PORT:-3000}"
    echo "  🔗 API Gateway:          http://localhost:${API_GATEWAY_EXTERNAL_PORT:-8001}"
    echo "  📝 Submission Service:   http://localhost:${SUBMISSION_SERVICE_EXTERNAL_PORT:-8002}"
    echo "  📧 Notification Service: http://localhost:${NOTIFICATION_SERVICE_EXTERNAL_PORT:-8005}"
    echo "  👤 User Portal:          http://localhost:${USER_PORTAL_EXTERNAL_PORT:-8006}"
    echo "  📊 Monitoring Service:   http://localhost:${MONITORING_SERVICE_EXTERNAL_PORT:-8007}"
    echo "  📋 Logging Service:      http://localhost:${LOGGING_SERVICE_EXTERNAL_PORT:-8008}"
    echo "  🤖 AI Orchestrator:      http://localhost:${AI_ORCHESTRATOR_EXTERNAL_PORT:-8010}"
    echo "  📈 Grafana:              http://localhost:${GRAFANA_EXTERNAL_PORT:-3002}"
    echo "  🔍 Prometheus:           http://localhost:${PROMETHEUS_EXTERNAL_PORT:-9090}"
    echo ""
    
    if [[ $healthy_count -lt $total_services ]]; then
        print_warning "Some services may still be starting up. Use './dev-manage.sh status' to check."
    fi
}

# Start all services (legacy function for compatibility)
start_all() {
    start_ultra_fast
}

# Start individual service in development mode
start_dev_service() {
    local service="$1"
    
    if [[ -z "$service" ]]; then
        print_error "Please specify a service name"
        echo "Available services:"
        echo "  submission-service, user-portal, content-service"
        echo "  ai-orchestrator, nlp-service, asr-service, document-ai"
        echo "  prototype-generator, template-repository, free-ai-service, ai-workers"
        echo "  notification-service, platform-management"
        echo "  statex-monitoring-service, logging-service"
        echo ""
        echo "Note: Frontend should be started locally with 'npm run dev' in the frontend directory"
        echo "  cd ../statex-website/frontend && npm run dev"
        exit 1
    fi
    
    print_header
    print_status "Starting $service in development mode..."
    
    check_docker
    check_network
    
    # Start infrastructure if not running
    if ! docker compose -f ../statex-infrastructure/docker-compose.dev.yml ps | grep -q "Up"; then
        print_status "Starting infrastructure services first..."
        start_infrastructure
        sleep 10
    fi
    
    # Start specific service based on location
    case "$service" in
        submission-service|user-portal|content-service)
            cd ../statex-website
            docker compose -f docker-compose.dev.yml up -d "$service"
            cd ../statex-platform
            ;;
        ai-orchestrator|nlp-service|asr-service|document-ai|prototype-generator|template-repository|free-ai-service|ai-workers)
            cd ../statex-ai
            docker compose -f docker-compose.dev.yml up -d "$service"
            cd ../statex-platform
            ;;
        notification-service)
            cd ../statex-notification-service
            docker compose -f docker-compose.dev.yml up -d "$service"
            cd ../statex-platform
            ;;
        platform-management|api-gateway)
            docker compose -f docker-compose.dev.yml up -d "$service"
            ;;
        statex-monitoring-service|logging-service)
            cd ../statex-monitoring
            docker compose -f docker-compose.dev.yml up -d "$service"
            cd ../statex-platform
            ;;
        *)
            print_error "Unknown service: $service"
            exit 1
            ;;
    esac
    
    print_success "$service started in development mode!"
    print_status "Use 'docker compose logs -f $service' to view logs"
}

# Start frontend locally for faster development
start_frontend() {
    print_header
    print_status "Starting frontend locally for faster development..."
    
    # Check if we're in the right directory
    if [[ ! -d "../statex-website/frontend" ]]; then
        print_error "Frontend directory not found. Please run from statex-platform directory."
        exit 1
    fi
    
    # Check if node_modules exists
    if [[ ! -d "../statex-website/frontend/node_modules" ]]; then
        print_status "Installing frontend dependencies..."
        cd ../statex-website/frontend
        npm install
        cd ../../statex-platform
    fi
    
    print_status "Starting frontend with npm run dev..."
    print_status "Frontend will be available at: http://localhost:${FRONTEND_EXTERNAL_PORT:-3000}"
    print_status "Press Ctrl+C to stop the frontend"
    echo ""
    
    cd ../statex-website/frontend
    npm run dev
}

# Stop all services
stop_all() {
    print_header
    print_status "Stopping StateX development environment..."
    
    # Stop in reverse order
    print_status "Stopping monitoring services..."
    cd ../statex-monitoring
    docker compose -f docker-compose.dev.yml stop 2>/dev/null || true
    cd ../statex-platform
    
    print_status "Stopping website services..."
    cd ../statex-website
    docker compose -f docker-compose.dev.yml stop 2>/dev/null || true
    cd ../statex-platform
    
    print_status "Stopping notification service..."
    cd ../statex-notification-service
    docker compose -f docker-compose.dev.yml stop 2>/dev/null || true
    cd ../statex-platform
    
    print_status "Stopping AI services..."
    cd ../statex-ai
    docker compose -f docker-compose.dev.yml stop 2>/dev/null || true
    cd ../statex-platform
    
    print_status "Stopping platform services..."
    docker compose -f docker-compose.dev.yml stop 2>/dev/null || true
    
    print_status "Stopping infrastructure services..."
    cd ../statex-infrastructure
    docker compose -f docker-compose.dev.yml stop 2>/dev/null || true
    cd ../statex-platform
    
    print_success "All services stopped"
}

# Real-time Status Display
show_realtime_status() {
    print_header
    print_status "Real-time StateX Services Status:"
    echo ""
    
    # Load service registry
    load_service_registry
    
    # Clear status file
    > "$SERVICE_STATUS_FILE"
    
    local total_services=0
    local healthy_services=0
    local warning_services=0
    local error_services=0
    local starting_services=0
    
    # Group services by category
    local categories=("infrastructure" "platform" "ai" "website" "notification" "monitoring")
    
    for category in "${categories[@]}"; do
        local category_title=$(echo "$category" | cut -c1 | tr '[:lower:]' '[:upper:]')$(echo "$category" | cut -c2-)
        echo -e "${BOLD}${BLUE}${category_title} Services:${NC}"
        
        local category_services=$(get_services_by_category "$category")
        for service_name in $category_services; do
            ((total_services++))
            
            # Show real-time status check
            printf "${CYAN}🔄 Checking $service_name...${NC}"
            
            # Check service status
            local container_status=$(check_container_status "$service_name")
            local port=$(get_service_port "$service_name")
            local port_status=$(check_port_accessibility "$port")
            local health_status=$(check_service_endpoint "$service_name")
            local deps_status=$(check_service_dependencies "$service_name")
            
            # Store status for later use
            echo "$service_name|$container_status" >> "$SERVICE_STATUS_FILE"
            
            # Get status icon and color
            local status_icon=$(get_service_status_icon "$container_status" "$health_status" "$port_status" "$deps_status")
            
            # Count status types
            if [[ "$status_icon" == "$STATUS_HEALTHY" ]]; then
                ((healthy_services++))
            elif [[ "$status_icon" == "$STATUS_WARNING" ]]; then
                ((warning_services++))
            elif [[ "$status_icon" == "$STATUS_ERROR" ]]; then
                ((error_services++))
            elif [[ "$container_status" == "running" && "$port_status" == "open" && "$health_status" == "unhealthy" ]]; then
                ((starting_services++))
            fi
            
            # Clear line and show result
            clear_line
            printf "${status_icon} ${service_name} (${port}) - ${container_status}"
            if [[ "$health_status" == "healthy" ]]; then
                printf " ${GREEN}✓${NC}"
            elif [[ "$health_status" == "unhealthy" ]]; then
                printf " ${YELLOW}⚠${NC}"
            else
                printf " ${RED}✗${NC}"
            fi
            printf "\n"
        done
    echo ""
    done
    
    # Summary with progress bar
    echo -e "${BOLD}Overall Progress:${NC}"
    local completed=$((healthy_services + warning_services))
    show_progress_bar $completed $total_services "Services Running"
    echo ""
    
    # Status summary
    echo -e "${BOLD}Status Summary:${NC}"
    echo -e "  ${STATUS_HEALTHY} Healthy:  ${GREEN}$healthy_services${NC}"
    echo -e "  ${STATUS_WARNING} Warning:  ${YELLOW}$warning_services${NC}"
    echo -e "  ${STATUS_STARTING} Starting: ${CYAN}$starting_services${NC}"
    echo -e "  ${STATUS_ERROR} Error:    ${RED}$error_services${NC}"
    echo -e "  Total:     $total_services"
    echo ""
}

# Enhanced Status Display
show_status() {
    print_header
    print_status "Comprehensive StateX Services Status:"
    echo ""
    
    # Load service registry
    load_service_registry
    
    # Clear status file
    > "$SERVICE_STATUS_FILE"
    
    # Check all services
    local total_services=0
    local healthy_services=0
    local warning_services=0
    local error_services=0
    
    # Group services by category
    local categories=("infrastructure" "platform" "ai" "website" "notification" "monitoring")
    
    for category in "${categories[@]}"; do
        local category_title=$(echo "$category" | cut -c1 | tr '[:lower:]' '[:upper:]')$(echo "$category" | cut -c2-)
        echo -e "${BOLD}${BLUE}${category_title} Services:${NC}"
        echo "┌─────────────────────────────────┬────────┬──────────┬──────────┬─────────────┬─────────────────────────────┐"
        echo "│ Service                         │ Status │ Port     │ Health   │ Dependencies│ Description                 │"
        echo "├─────────────────────────────────┼────────┼──────────┼──────────┼─────────────┼─────────────────────────────┤"
        
        local category_services=$(get_services_by_category "$category")
        for service_name in $category_services; do
            ((total_services++))
            
            # Check service status
            local container_status=$(check_container_status "$service_name")
            local port=$(get_service_port "$service_name")
            local port_status=$(check_port_accessibility "$port")
            local health_status=$(check_service_endpoint "$service_name")
            local deps_status=$(check_service_dependencies "$service_name")
            
            # Store status for later use
            echo "$service_name|$container_status" >> "$SERVICE_STATUS_FILE"
            
            # Get status icon and color
            local status_icon=$(get_service_status_icon "$container_status" "$health_status" "$port_status" "$deps_status")
            local status_color=$(get_service_status_color "$container_status" "$health_status" "$port_status" "$deps_status")
            
            # Count status types
            if [[ "$status_icon" == "$STATUS_HEALTHY" ]]; then
                ((healthy_services++))
            elif [[ "$status_icon" == "$STATUS_WARNING" ]]; then
                ((warning_services++))
            elif [[ "$status_icon" == "$STATUS_ERROR" ]]; then
                ((error_services++))
            fi
            
            # Format service name (truncate if too long)
            local display_name="$service_name"
            if [[ ${#display_name} -gt 30 ]]; then
                display_name="${display_name:0:27}..."
            fi
            
            # Format port status
            local port_display="$port"
            if [[ "$port_status" == "open" ]]; then
                port_display="${GREEN}${port_display}${NC}"
            else
                port_display="${RED}${port_display}${NC}"
            fi
            
            # Format health status
            local health_display="$health_status"
            if [[ "$health_status" == "healthy" ]]; then
                health_display="${GREEN}${health_status}${NC}"
            elif [[ "$health_status" == "unhealthy" ]]; then
                health_display="${RED}${health_status}${NC}"
            else
                health_display="${YELLOW}${health_status}${NC}"
            fi
            
            # Format dependencies
            local deps_display=$(get_service_dependencies "$service_name")
            if [[ "$deps_status" =~ "missing:" ]]; then
                local missing_dep="${deps_status#missing:}"
                deps_display="${RED}Missing: $missing_dep${NC}"
            elif [[ "$deps_status" == "satisfied" ]]; then
                deps_display="${GREEN}OK${NC}"
            else
                deps_display="${YELLOW}$deps_status${NC}"
            fi
            
            # Format description (truncate if too long)
            local description="Service"
            if [[ ${#description} -gt 25 ]]; then
                description="${description:0:22}..."
            fi
            
            # Print service row
            echo -e "│ $(printf "%-31s" "$display_name") │ $status_icon $(printf "%-6s" "$status_color$container_status$NC") │ $(printf "%-8s" "$port_display") │ $(printf "%-8s" "$health_display") │ $(printf "%-11s" "$deps_display") │ $(printf "%-27s" "$description") │"
        done
        
        echo "└─────────────────────────────────┴────────┴──────────┴──────────┴─────────────┴─────────────────────────────┘"
    echo ""
    done
    
    # Summary
    echo -e "${BOLD}Status Summary:${NC}"
    echo -e "  ${STATUS_HEALTHY} Healthy:  ${GREEN}$healthy_services${NC}"
    echo -e "  ${STATUS_WARNING} Warning:  ${YELLOW}$warning_services${NC}"
    echo -e "  ${STATUS_ERROR} Error:    ${RED}$error_services${NC}"
    echo -e "  Total:     $total_services"
    echo ""
    
    # Show services that need attention
    if [[ $warning_services -gt 0 || $error_services -gt 0 ]]; then
        echo -e "${BOLD}${YELLOW}Services Needing Attention:${NC}"
        local all_services=$(get_all_services)
        for service_name in $all_services; do
            local container_status=$(grep "^$service_name|" "$SERVICE_STATUS_FILE" 2>/dev/null | cut -d'|' -f2)
            local port=$(get_service_port "$service_name")
            local port_status=$(check_port_accessibility "$port")
            local health_status=$(check_service_endpoint "$service_name")
            local deps_status=$(check_service_dependencies "$service_name")
            local status_icon=$(get_service_status_icon "$container_status" "$health_status" "$port_status" "$deps_status")
            
            if [[ "$status_icon" != "$STATUS_HEALTHY" ]]; then
                echo -e "  $status_icon $service_name ($port) - $container_status"
                if [[ "$health_status" == "unhealthy" ]]; then
                    echo -e "    ${RED}Health check failed${NC}"
                fi
                if [[ "$port_status" == "closed" ]]; then
                    echo -e "    ${RED}Port $port not accessible${NC}"
                fi
                if [[ "$deps_status" =~ "missing:" ]]; then
                    local missing_dep="${deps_status#missing:}"
                    echo -e "    ${RED}Missing dependency: $missing_dep${NC}"
                fi
            fi
        done
        echo ""
    fi
}

# Show logs
show_logs() {
    local service="$1"
    
    if [[ -n "$service" ]]; then
        print_status "Showing logs for $service..."
        # Try to find the service in different repositories
        if docker compose -f docker-compose.dev.yml logs -f "$service" 2>/dev/null; then
            return 0
        elif cd ../statex-ai && docker compose -f docker-compose.dev.yml logs -f "$service" 2>/dev/null; then
            cd ../statex-platform
            return 0
        elif cd ../statex-notification-service && docker compose -f docker-compose.dev.yml logs -f "$service" 2>/dev/null; then
            cd ../statex-platform
            return 0
        elif cd ../statex-website && docker compose -f docker-compose.dev.yml logs -f "$service" 2>/dev/null; then
            cd ../statex-platform
            return 0
        elif cd ../statex-monitoring && docker compose -f docker-compose.dev.yml logs -f "$service" 2>/dev/null; then
            cd ../statex-platform
            return 0
        elif cd ../statex-infrastructure && docker compose -f docker-compose.dev.yml logs -f "$service" 2>/dev/null; then
            cd ../statex-platform
            return 0
        else
            print_error "Service $service not found in any repository"
            return 1
        fi
    else
        print_status "Showing logs for all services..."
        print_status "Infrastructure services:"
        cd ../statex-infrastructure && docker compose -f docker-compose.dev.yml logs -f --tail=50
        cd ../statex-platform
        echo ""
        print_status "Platform services:"
        docker compose -f docker-compose.dev.yml logs -f --tail=50
        echo ""
        print_status "AI services:"
        cd ../statex-ai && docker compose -f docker-compose.dev.yml logs -f --tail=50
        cd ../statex-platform
        echo ""
        print_status "Notification service:"
        cd ../statex-notification-service && docker compose -f docker-compose.dev.yml logs -f --tail=50
        cd ../statex-platform
        echo ""
        print_status "Website services:"
        cd ../statex-website && docker compose -f docker-compose.dev.yml logs -f --tail=50
        cd ../statex-platform
        echo ""
        print_status "Monitoring services:"
        cd ../statex-monitoring && docker compose -f docker-compose.dev.yml logs -f --tail=50
        cd ../statex-platform
    fi
}

# Enhanced Health Check
health_check() {
    print_header
    print_status "Performing comprehensive health check..."
    echo ""
    
    # Load service registry
    load_service_registry
    
    local healthy_count=0
    local warning_count=0
    local error_count=0
    local total_count=0
    
    # Check all services
    local all_services=$(get_all_services)
    for service_name in $all_services; do
        ((total_count++))
        
        local port=$(get_service_port "$service_name")
        local health_endpoint=$(get_service_health_endpoint "$service_name")
        local category=$(get_service_category "$service_name")
        
        echo -n "  $service_name (:$port): "
        
        # Check container status
        local container_status=$(check_container_status "$service_name")
        local port_status=$(check_port_accessibility "$port")
        local health_status=$(check_service_endpoint "$service_name")
        local deps_status=$(check_service_dependencies "$service_name")
        
        # Determine overall health
        if [[ "$container_status" == "running" && "$health_status" == "healthy" && "$port_status" == "open" && "$deps_status" == "satisfied" ]]; then
            print_success "HEALTHY"
            ((healthy_count++))
        elif [[ "$container_status" == "running" && ("$health_status" == "unhealthy" || "$port_status" == "closed" || "$deps_status" =~ "missing:") ]]; then
            print_warning "WARNING"
            ((warning_count++))
            
            # Show specific issues
            if [[ "$health_status" == "unhealthy" ]]; then
                echo "    ${RED}Health check failed${NC}"
            fi
            if [[ "$port_status" == "closed" ]]; then
                echo "    ${RED}Port not accessible${NC}"
            fi
            if [[ "$deps_status" =~ "missing:" ]]; then
                local missing_dep="${deps_status#missing:}"
                echo "    ${RED}Missing dependency: $missing_dep${NC}"
            fi
        else
            print_error "ERROR"
            ((error_count++))
            
            # Show specific issues
            if [[ "$container_status" == "not_found" ]]; then
                echo "    ${RED}Container not found${NC}"
            elif [[ "$container_status" == "exited" ]]; then
                echo "    ${RED}Container exited${NC}"
            elif [[ "$container_status" == "stopped" ]]; then
                echo "    ${RED}Container stopped${NC}"
            fi
        fi
    done
    
    echo ""
    echo -e "${BOLD}Health Summary:${NC}"
    echo -e "  ${STATUS_HEALTHY} Healthy:  ${GREEN}$healthy_count${NC}"
    echo -e "  ${STATUS_WARNING} Warning:  ${YELLOW}$warning_count${NC}"
    echo -e "  ${STATUS_ERROR} Error:    ${RED}$error_count${NC}"
    echo -e "  Total:     $total_count"
    echo ""
    
    if [[ $healthy_count -eq $total_count ]]; then
        print_success "All services are healthy!"
    elif [[ $error_count -eq 0 ]]; then
        print_warning "Some services have warnings. Check the details above."
    else
        print_error "Some services have errors. Use './dev-manage.sh status' for detailed information."
    fi
}

# Fast Startup with Real-time Progress
start_services_fast() {
    print_header
    print_status "Starting StateX services with real-time progress..."
    echo ""
    
    # Check Docker daemon first
    if ! check_docker_daemon; then
        return 1
    fi
    echo ""
    
    # Ensure required files exist
    if ! ensure_required_files; then
        print_error "Required files missing. Please check the setup."
        return 1
    fi
    echo ""
    
    # Check and free conflicting ports
    check_and_free_ports
    echo ""
    
    # Load service registry
    load_service_registry
    
    # Check which services need to be started
    local services_to_start=()
    local services_healthy=()
    local services_failed=()
    
    print_status "Analyzing service status..."
    show_progress "Scanning all services" 3
    
    local all_services=$(get_all_services)
    local total_services=0
    for service_name in $all_services; do
        ((total_services++))
        local container_status=$(check_container_status "$service_name")
        local port=$(get_service_port "$service_name")
        local port_status=$(check_port_accessibility "$port")
        local health_status=$(check_service_endpoint "$service_name")
        local deps_status=$(check_service_dependencies "$service_name")
        
        if [[ "$container_status" == "running" && "$health_status" == "healthy" && "$port_status" == "open" && "$deps_status" == "satisfied" ]]; then
            services_healthy+=("$service_name")
        else
            services_to_start+=("$service_name")
        fi
    done
    
    echo -e "  ${STATUS_HEALTHY} Healthy services: ${GREEN}${#services_healthy[@]}${NC}"
    echo -e "  ${STATUS_WARNING} Services to start: ${YELLOW}${#services_to_start[@]}${NC}"
    echo ""
    
    if [[ ${#services_to_start[@]} -eq 0 ]]; then
        print_success "All services are already healthy! No startup needed."
        return 0
    fi
    
    # Show overall progress
    echo -e "${BOLD}Starting Services Progress:${NC}"
    local started_count=0
    local total_to_start=${#services_to_start[@]}
    
    # Start services in dependency order with real-time progress
    local categories=("infrastructure" "platform" "ai" "website" "notification" "monitoring")
    
    for category in "${categories[@]}"; do
        local category_services=()
        for service in "${services_to_start[@]}"; do
            local service_category=$(get_service_category "$service")
            if [[ "$service_category" == "$category" ]]; then
                category_services+=("$service")
            fi
        done
        
        if [[ ${#category_services[@]} -gt 0 ]]; then
            local category_title=$(echo "$category" | cut -c1 | tr '[:lower:]' '[:upper:]')$(echo "$category" | cut -c2-)
            echo -e "${BOLD}${BLUE}Starting $category_title Services:${NC}"
            
            for service_name in "${category_services[@]}"; do
                local port=$(get_service_port "$service_name")
                
                # Show progress bar
                show_progress_bar $started_count $total_to_start "Starting $service_name"
                
                # Start service with live status
                if start_service_with_progress "$service_name" "$category"; then
                    ((started_count++))
                    clear_line
                    printf "${GREEN}✓ $service_name started successfully${NC}\n"
                else
                    clear_line
                    printf "${RED}✗ $service_name failed to start${NC}\n"
                fi
                
                # Update progress bar
                show_progress_bar $started_count $total_to_start "Completed $started_count/$total_to_start"
                echo ""
            done
        fi
    done
    
    # Final progress bar
    show_progress_bar $total_to_start $total_to_start "All services processed"
    echo ""
    
    # Final health check with progress
    print_status "Performing final health check..."
    show_progress "Checking service health" 5
    health_check
}

start_service_with_progress() {
    local service_name="$1"
    local category="$2"
    local port=$(get_service_port "$service_name")
    
    # Start the service based on its category
    local start_command=""
    local compose_file=""
    local working_dir=""
    
    if [[ "$category" == "infrastructure" ]]; then
        working_dir="../statex-infrastructure"
        compose_file="docker-compose.dev.yml"
    elif [[ "$category" == "ai" ]]; then
        working_dir="../statex-ai"
        compose_file="docker-compose.dev.yml"
    elif [[ "$category" == "website" ]]; then
        working_dir="../statex-website"
        compose_file="docker-compose.dev.yml"
    elif [[ "$category" == "notification" ]]; then
        working_dir="../statex-notification-service"
        compose_file="docker-compose.dev.yml"
    elif [[ "$category" == "monitoring" ]]; then
        working_dir="../statex-monitoring"
        compose_file="docker-compose.dev.yml"
    else
        # Platform services
        working_dir="."
        compose_file="docker-compose.dev.yml"
    fi
    
    # Execute start command with error capture
    local error_output=""
    if [[ "$working_dir" != "." ]]; then
        error_output=$(cd "$working_dir" && docker compose -f "$compose_file" up -d "$service_name" 2>&1)
        local start_result=$?
        cd ../statex-platform
    else
        error_output=$(docker compose -f "$compose_file" up -d "$service_name" 2>&1)
        local start_result=$?
    fi
    
    if [[ $start_result -eq 0 ]]; then
        # Wait for service to be ready with live status
        show_live_status "$service_name" "$port"
        return $?
    else
        # Show error details
        clear_line
        printf "${RED}✗ $service_name failed to start${NC}\n"
        if [[ -n "$error_output" ]]; then
            printf "${YELLOW}Error: $error_output${NC}\n"
        fi
        return 1
    fi
}

start_service_category() {
    local category="$1"
    shift
    local services_to_start=("$@")
    
    local category_services=()
    for service in "${services_to_start[@]}"; do
        local service_category=$(get_service_category "$service")
        if [[ "$service_category" == "$category" ]]; then
            category_services+=("$service")
        fi
    done
    
    if [[ ${#category_services[@]} -eq 0 ]]; then
        return 0
    fi
    
    print_status "Starting $category services..."
    
    for service_name in "${category_services[@]}"; do
        local container_status=$(check_container_status "$service_name")
        
        if [[ "$container_status" != "running" ]]; then
            echo -n "  Starting $service_name... "
            
            # Start the service based on its category
            if [[ "$category" == "infrastructure" ]]; then
                cd ../statex-infrastructure
                docker compose -f docker-compose.dev.yml up -d "$service_name" >/dev/null 2>&1
                cd ../statex-platform
            elif [[ "$category" == "ai" ]]; then
                cd ../statex-ai
                docker compose -f docker-compose.dev.yml up -d "$service_name" >/dev/null 2>&1
                cd ../statex-platform
            elif [[ "$category" == "website" ]]; then
                cd ../statex-website
                docker compose -f docker-compose.dev.yml up -d "$service_name" >/dev/null 2>&1
                cd ../statex-platform
            elif [[ "$category" == "notification" ]]; then
                cd ../statex-notification-service
                docker compose -f docker-compose.dev.yml up -d "$service_name" >/dev/null 2>&1
                cd ../statex-platform
            elif [[ "$category" == "monitoring" ]]; then
                cd ../statex-monitoring
                docker compose -f docker-compose.dev.yml up -d "$service_name" >/dev/null 2>&1
                cd ../statex-platform
            else
                # Platform services
                docker compose -f docker-compose.dev.yml up -d "$service_name" >/dev/null 2>&1
            fi
            
            if [[ $? -eq 0 ]]; then
                print_success "Started"
            else
                print_error "Failed"
            fi
        else
            echo -e "  ${STATUS_HEALTHY} $service_name already running"
        fi
    done
}

# Clean up
clean_up() {
    print_header
    print_warning "This will remove all containers, volumes, and networks."
    
    if [[ "$1" != "--force" ]]; then
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Operation cancelled."
            exit 0
        fi
    fi
    
    print_status "Cleaning up StateX development environment..."
    
    # Stop and remove all containers in reverse order
    cd ../statex-monitoring
    docker compose -f docker-compose.dev.yml stop -v --remove-orphans 2>/dev/null || true
    cd ../statex-platform
    
    cd ../statex-website
    docker compose -f docker-compose.dev.yml stop -v --remove-orphans 2>/dev/null || true
    cd ../statex-platform
    
    cd ../statex-notification-service
    docker compose -f docker-compose.dev.yml stop -v --remove-orphans 2>/dev/null || true
    cd ../statex-platform
    
    cd ../statex-ai
    docker compose -f docker-compose.dev.yml stop -v --remove-orphans 2>/dev/null || true
    cd ../statex-platform
    
    docker compose -f docker-compose.dev.yml stop -v --remove-orphans 2>/dev/null || true
    
    cd ../statex-infrastructure
    docker compose -f docker-compose.dev.yml stop -v --remove-orphans 2>/dev/null || true
    cd ../statex-platform
    
    # Remove unused resources
    docker system prune -f
    docker volume prune -f
    docker network prune -f
    
    print_success "Cleanup completed!"
}

# Setup
setup() {
    print_header
    print_status "Setting up StateX development environment..."
    
    # Create environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Environment file created from .env.example"
            print_warning "Please update .env with your configuration"
        else
            print_warning "No .env.example found. Please create .env manually"
        fi
    fi
    
    # Check network
    check_network
    
    # Check images
    check_images
    
    print_success "Setup completed!"
    print_status "Run '$0 start' to start all services"
}

# Watch Mode - Real-time Status Updates
watch_status() {
    local interval="${2:-5}"
    
    print_header
    print_status "Watching StateX services (updating every ${interval}s)..."
    print_status "Press Ctrl+C to stop watching"
    echo ""
    
    while true; do
        clear
        show_realtime_status
        echo ""
        print_status "Last updated: $(date)"
        print_status "Next update in ${interval} seconds... (Ctrl+C to stop)"
        sleep $interval
    done
}

# Main function
main() {
    case "$1" in
        start)
            if [[ "$2" == "--ultra-fast" ]]; then
                start_ultra_fast_enhanced
            elif [[ "$2" == "--fast" ]]; then
                start_ultra_fast
            else
                start_all "$2"
            fi
            ;;
        start-missing)
            start_missing
            ;;
        restart-failed)
            restart_failed
            ;;
        stop)
            stop_all
            ;;
        restart)
            stop_all
            sleep 2
            if [[ "$2" == "--fast" || "$2" == "--ultra-fast" ]]; then
                start_ultra_fast
            else
                start_all "$2"
            fi
            ;;
        status)
            if [[ "$2" == "--realtime" ]]; then
                show_realtime_status
            elif [[ "$2" == "--quick" || "$2" == "--fast" ]]; then
                quick_status
            else
                show_status
            fi
            ;;
        logs)
            show_logs "$2"
            ;;
        health)
            health_check
            ;;
        dev)
            start_dev_service "$2"
            ;;
        frontend)
            start_frontend
            ;;
        clean)
            clean_up "$2"
            ;;
        setup)
            setup
            ;;
        diagnose)
            health_check
            echo ""
            print_status "For detailed troubleshooting, check the logs:"
            echo "  ./dev-manage.sh logs [service-name]"
            echo ""
            print_status "Common solutions:"
            echo "  - Start missing services: ./dev-manage.sh start-missing"
            echo "  - Restart failed services: ./dev-manage.sh restart-failed"
            echo "  - Check Docker status: docker ps"
            echo "  - Check port conflicts: lsof -i :PORT"
            ;;
        fix)
            print_status "Attempting to fix common issues..."
            # Start missing services first, then restart failed ones
            start_missing
            restart_failed
            ;;
        watch)
            watch_status "$2"
            ;;
        help|--help|-h)
            print_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            print_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
