#!/bin/bash

# StateX PRODUCTION Platform Management Script
# Unified production management for all StateX microservices on development
# Use it only after development phase completed and we need to deploy to production
# This script is only for testing production services on development before real production deployment
# For development DON'T USE THIS SCRIPT, USE ../QUICK_START_DEV.md instead

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  StateX Platform Management${NC}"
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

print_help() {
    echo "StateX PRODUCTION Platform Management - Single Point of Truth"
    echo "=================================================="
    echo ""
    echo "This is the ONLY way to test production StateX services on development."
    echo "For real production, use Kubernetes: kubectl apply -f infrastructure/"
    echo "For development DON'T USE THIS SCRIPT, USE ../QUICK_START_DEV.md instead"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  start           Start all StateX services (development only)"
    echo "  stop            Stop all StateX services"
    echo "  restart         Restart all StateX services"
    echo "  status          Show status of all services"
    echo "  logs            Show logs for all services"
    echo "  logs [service]  Show logs for specific service"
    echo "  health          Check health of all services"
    echo "  test            Run architecture tests"
    echo "  clean           Clean up containers and volumes"
    echo "  setup           Initial setup and configuration"
    echo "  update          Update all services"
    echo "  backup          Create backup of all data"
    echo "  restore         Restore from backup"
    echo ""
    echo "Options:"
    echo "  --force         Force operation without confirmation"
    echo ""
    echo "Examples:"
    echo "  $0 start        # Start all services for development"
    echo "  $0 logs         # View all service logs"
    echo "  $0 health       # Check service health"
    echo "  $0 test         # Run architecture tests"
    echo "  $0 status       # Show service status"
    echo ""
    echo "Production Deployment:"
    echo "  kubectl apply -f infrastructure/  # Deploy to Kubernetes"
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

# Check if standalone Ollama is running
check_ollama() {
    print_status "Checking standalone Ollama service..."
    
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        print_success "Standalone Ollama is running on port 11434"
        
        # Check if required models are available
        local models=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
        local required_models=("llama2:7b" "mistral:7b" "codellama:7b")
        local missing_models=()
        
        for model in "${required_models[@]}"; do
            if ! echo "$models" | grep -q "$model"; then
                missing_models+=("$model")
            fi
        done
        
        if [ ${#missing_models[@]} -gt 0 ]; then
            print_warning "Some recommended models are missing. You can download them with:"
            for model in "${missing_models[@]}"; do
                print_status "  ollama pull $model"
            done
        else
            print_success "All recommended models are available"
        fi
    else
        print_error "Standalone Ollama is not running on port 11434"
        print_status "Please start Ollama with: ollama serve"
        print_status "Then download models with: ollama pull llama2:7b"
        exit 1
    fi
}

# Start all services
start_services() {
    print_header
    print_status "Starting StateX services in proper order..."
    
    check_docker
    check_network
    check_images
    # check_ollama  # Ollama disabled
    
    # Start infrastructure first
    print_status "Starting infrastructure services..."
    cd ../statex-infrastructure
    docker compose up -d
    cd ../statex-platform
    
    # Start platform services
    print_status "Starting platform services..."
    docker compose up -d
    
    # Start AI services
    print_status "Starting AI services..."
    cd ../statex-ai
    docker compose up -d
    cd ../statex-platform
    
    # Start notification service
    print_status "Starting notification service..."
    cd ../statex-notification-service
    docker compose up -d
    cd ../statex-platform
    
    # Start website services (includes core business services)
    print_status "Starting website services (Frontend, Submission)..."
    cd ../statex-website
    docker compose up -d
    cd ../statex-platform
    
    # Start monitoring services
    print_status "Starting monitoring services..."
    cd ../statex-monitoring
    docker compose up -d
    cd ../statex-platform
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service status
    print_status "Checking service status..."
    docker compose ps
    
    print_success "All services started successfully!"
    print_status "Access URLs:"
    frontend_port=${FRONTEND_PORT:-3000}
    echo "  - Website Frontend: http://localhost:${frontend_port}"
    echo "  - API Gateway: http://localhost:8001"
    echo "  - Submission Service: http://localhost:8002 (Website)"
    echo "  - Notification Service: http://localhost:8005"
    echo "  - AI Orchestrator: http://localhost:8010"
    echo "  - Grafana: http://localhost:3002"
    echo "  - Prometheus: http://localhost:9090"
}

# Stop all services
stop_services() {
    print_header
    print_status "Stopping StateX services in reverse order..."
    
    # Stop monitoring services
    print_status "Stopping monitoring services..."
    cd ../statex-monitoring
    docker compose stop 2>/dev/null || true
    cd ../statex-platform
    
    # Stop website services (includes core business services)
    print_status "Stopping website services (Frontend, Submission)..."
    cd ../statex-website
    docker compose stop 2>/dev/null || true
    cd ../statex-platform
    
    # Stop notification service
    print_status "Stopping notification service..."
    cd ../statex-notification-service
    docker compose stop 2>/dev/null || true
    cd ../statex-platform
    
    # Stop AI services
    print_status "Stopping AI services..."
    cd ../statex-ai
    docker compose stop 2>/dev/null || true
    cd ../statex-platform
    
    # Stop platform services
    print_status "Stopping platform services..."
    docker compose stop 2>/dev/null || true
    
    # Stop infrastructure
    print_status "Stopping infrastructure services..."
    cd ../statex-infrastructure
    docker compose stop 2>/dev/null || true
    cd ../statex-platform
    
    print_success "All services stopped successfully!"
}

# Show service status
show_status() {
    print_header
    print_status "StateX Services Status:"
    echo ""
    
    # Check infrastructure
    print_status "Infrastructure Services:"
    cd ../statex-infrastructure
    docker compose ps
    cd ../statex-platform
    echo ""
    
    # Check platform services
    print_status "Platform Services:"
    docker compose ps
    echo ""
    
    # Check AI services
    print_status "AI Services:"
    cd ../statex-ai
    docker compose ps
    cd ../statex-platform
    echo ""
    
    # Check notification service
    print_status "Notification Service:"
    cd ../statex-notification-service
    docker compose ps
    cd ../statex-platform
    echo ""
    
    # Check website services (includes core business services)
    print_status "Website Services (Frontend, Submission):"
    cd ../statex-website
    docker compose ps
    cd ../statex-platform
    echo ""
    
    # Check monitoring services
    print_status "Monitoring Services:"
    cd ../statex-monitoring
    docker compose ps
    cd ../statex-platform
    echo ""
    
    # Check individual services
    print_status "Service Health Check:"
    services=(
        "8001:API Gateway"
        "8002:Submission Service (Website)"
        "8005:Notification Service"
        "8007:Monitoring Service"
        "8008:Logging Service"
        "8010:AI Orchestrator"
        "8011:NLP Service"
        "8012:ASR Service"
        "8013:Document AI"
        "8014:Prototype Generator"
        "8015:Template Repository"
        "8016:Free AI Service"
        "8017:AI Workers"
        "3000:Website Frontend"
        "3002:Grafana"
        "9090:Prometheus"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r port name <<< "$service_info"
        echo -n "  $name (:$port): "
        if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
            print_success "UP"
        else
            print_error "DOWN"
        fi
    done
}

# Show logs
show_logs() {
    local service="$1"
    
    if [[ -n "$service" ]]; then
        print_status "Showing logs for $service..."
        # Try to find the service in different repositories
        if docker compose logs -f "$service" 2>/dev/null; then
            return 0
        elif cd ../statex-ai && docker compose logs -f "$service" 2>/dev/null; then
            cd ../statex-platform
            return 0
        elif cd ../statex-notification-service && docker compose logs -f "$service" 2>/dev/null; then
            cd ../statex-platform
            return 0
        elif cd ../statex-website && docker compose logs -f "$service" 2>/dev/null; then
            cd ../statex-platform
            return 0
        elif cd ../statex-monitoring && docker compose logs -f "$service" 2>/dev/null; then
            cd ../statex-platform
            return 0
        elif cd ../statex-infrastructure && docker compose logs -f "$service" 2>/dev/null; then
            cd ../statex-platform
            return 0
        else
            print_error "Service $service not found in any repository"
            return 1
        fi
    else
        print_status "Showing logs for all services..."
        print_status "Platform services:"
        docker compose logs -f --tail=50
        echo ""
        print_status "AI services:"
        cd ../statex-ai && docker compose logs -f --tail=50
        cd ../statex-platform
        echo ""
        print_status "Notification service:"
        cd ../statex-notification-service && docker compose logs -f --tail=50
        cd ../statex-platform
        echo ""
        print_status "Website services (Frontend, Submission):"
        cd ../statex-website && docker compose logs -f --tail=50
        cd ../statex-platform
        echo ""
        print_status "Monitoring services:"
        cd ../statex-monitoring && docker compose logs -f --tail=50
        cd ../statex-platform
        echo ""
        print_status "Infrastructure services:"
        cd ../statex-infrastructure && docker compose logs -f --tail=50
        cd ../statex-platform
    fi
}

# Health check
health_check() {
    print_header
    print_status "Performing comprehensive health check..."
    echo ""
    
    # Simple health check using curl
    print_status "Checking service health endpoints..."
    services=(
        "8001:API Gateway"
        "8002:Submission Service (Website)"
        "8005:Notification Service"
        "8007:Monitoring Service"
        "8008:Logging Service"
        "8010:AI Orchestrator"
        "8011:NLP Service"
        "8012:ASR Service"
        "8013:Document AI"
        "8014:Prototype Generator"
        "8015:Template Repository"
        "8016:Free AI Service"
        "8017:AI Workers"
        "3000:Website Frontend"
        "3002:Grafana"
        "9090:Prometheus"
    )
    
    healthy_count=0
    total_count=${#services[@]}
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r port name <<< "$service_info"
        echo -n "  $name (:$port): "
        if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
            print_success "UP"
            ((healthy_count++))
        else
            print_error "DOWN"
        fi
    done
    
    echo ""
    print_status "Health Summary: $healthy_count/$total_count services healthy"
    
    if [ $healthy_count -eq $total_count ]; then
        print_success "All services are healthy!"
    elif [ $healthy_count -gt 0 ]; then
        print_warning "Some services are down. Check the status above."
    else
        print_error "No services are responding. Try starting services with './manage.sh start'"
    fi
}

# Run tests
run_tests() {
    print_header
    print_status "Running StateX architecture tests..."
    
    if [ -f "test_microservices_architecture.py" ]; then
        python3 test_microservices_architecture.py
        test_exit_code=$?
        
        if [ $test_exit_code -eq 0 ]; then
            print_success "All tests passed!"
        else
            print_warning "Some tests failed. Check the output above."
        fi
    else
        print_error "Test script not found: test_microservices_architecture.py"
        exit 1
    fi
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
    
    print_status "Cleaning up StateX services..."
    
    # Stop and remove all containers in reverse order
    cd ../statex-monitoring
    docker compose stop -v --remove-orphans 2>/dev/null || true
    cd ../statex-platform
    
    cd ../statex-website
    docker compose stop -v --remove-orphans 2>/dev/null || true
    cd ../statex-platform
    
    cd ../statex-notification-service
    docker compose stop -v --remove-orphans 2>/dev/null || true
    cd ../statex-platform
    
    cd ../statex-ai
    docker compose stop -v --remove-orphans 2>/dev/null || true
    cd ../statex-platform
    
    docker compose stop -v --remove-orphans 2>/dev/null || true
    
    cd ../statex-infrastructure
    docker compose stop -v --remove-orphans 2>/dev/null || true
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
    print_status "Setting up StateX platform..."
    
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
    
    print_success "Setup completed!"
}

# Main script logic
main() {
    case "$1" in
        start)
            start_services "$2"
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            sleep 5
            start_services "$2"
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs "$2"
            ;;
        health)
            health_check
            ;;
        test)
            run_tests
            ;;
        clean)
            clean_up "$2"
            ;;
        setup)
            setup
            ;;
        update)
            print_status "Updating all services..."
            
            # Update infrastructure
            cd ../statex-infrastructure
            docker compose pull
            cd ../statex-platform
            
            # Update platform
            docker compose pull
            
            # Update AI services
            cd ../statex-ai
            docker compose pull
            cd ../statex-platform
            
            # Update notification service
            cd ../statex-notification-service
            docker compose pull
            cd ../statex-platform
            
            # Update website services (includes core business services)
            cd ../statex-website
            docker compose pull
            cd ../statex-platform
            
            # Update monitoring services
            cd ../statex-monitoring
            docker compose pull
            cd ../statex-platform
            
            print_success "All services updated!"
            ;;
        backup)
            print_status "Creating backup..."
            # TODO: Implement backup functionality
            print_warning "Backup functionality not yet implemented"
            ;;
        restore)
            print_status "Restoring from backup..."
            # TODO: Implement restore functionality
            print_warning "Restore functionality not yet implemented"
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
