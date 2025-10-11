#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display usage information
show_help() {
    echo -e "${YELLOW}Usage: $0 [options]${NC}"
    echo -e "${GREEN}Development environment deployment script${NC}\n"
    echo "Options:"
    echo "  --start           Start all development services"
    echo "  --stop            Stop all development services"
    echo "  --restart         Restart all development services"
    echo "  --status          Show status of all development services"
    echo "  --logs [service]  Show logs for all or specific service"
    echo "  --build           Build and start development services"
    echo "  --clean           Stop and remove all development containers and volumes"
    echo "  --help            Show this help message"
    exit 0
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check environment
check_environment() {
    # Check if we're in development environment
    if [ -L ".env" ]; then
        CURRENT_ENV=$(readlink -f .env | sed 's/.*\.env\.//')
        if [ "$CURRENT_ENV" != "development" ]; then
            echo -e "${RED}❌ ERROR: This script is for DEVELOPMENT environment only!${NC}"
            echo -e "Current environment: ${YELLOW}$CURRENT_ENV${NC}"
            echo -e "For production, use: ${GREEN}./scripts/deploy.sh${NC}"
            echo -e "To switch to development: ${GREEN}./scripts/switch_env.sh development${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ ERROR: No environment configured!${NC}"
        echo -e "Please run: ${GREEN}./scripts/switch_env.sh development${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Development environment confirmed${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! command_exists docker; then
        echo -e "${RED}Error: Docker is not installed.${NC}"
        exit 1
    fi
    
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running.${NC}"
        exit 1
    fi
}

# Function to start development services
start_services() {
    echo -e "${GREEN}🚀 Starting development services...${NC}"
    
    # Check environment
    check_environment
    
    # Check Docker
    check_docker
    
    # Start services
    docker compose -f docker-compose.development.yml up -d
    
    echo -e "${GREEN}✅ Development services started successfully!${NC}"
    echo -e "\n${YELLOW}Development URLs:${NC}"
    echo -e "- Frontend:    http://localhost:${FRONTEND_PORT:-3000}"
    echo -e "- API:         http://localhost:4000"
    echo -e "- MailHog:     http://localhost:8025"
    echo -e "- PostgreSQL:  localhost:5432"
    echo -e "- Redis:       localhost:6379"
}

# Function to stop development services
stop_services() {
    echo -e "${YELLOW}🛑 Stopping development services...${NC}"
    
    # Check environment
    check_environment
    
    docker compose -f docker-compose.development.yml down
    
    echo -e "${GREEN}✅ Development services stopped successfully!${NC}"
}

# Function to restart development services
restart_services() {
    echo -e "${YELLOW}🔄 Restarting development services...${NC}"
    
    # Check environment
    check_environment
    
    docker compose -f docker-compose.development.yml restart
    
    echo -e "${GREEN}✅ Development services restarted successfully!${NC}"
}

# Function to build and start development services
build_and_start() {
    echo -e "${GREEN}🔨 Building and starting development services...${NC}"
    
    # Check environment
    check_environment
    
    # Check Docker
    check_docker
    
    # Build and start services
    docker compose -f docker-compose.development.yml up -d --build
    
    echo -e "${GREEN}✅ Development services built and started successfully!${NC}"
    echo -e "\n${YELLOW}Development URLs:${NC}"
    echo -e "- Frontend:    http://localhost:${FRONTEND_PORT:-3000}"
    echo -e "- API:         http://localhost:4000"
    echo -e "- MailHog:     http://localhost:8025"
    echo -e "- PostgreSQL:  localhost:5432"
    echo -e "- Redis:       localhost:6379"
}

# Function to clean up development environment
clean_environment() {
    echo -e "${YELLOW}🧹 Cleaning up development environment...${NC}"
    
    # Check environment
    check_environment
    
    echo -e "${YELLOW}This will remove all containers, networks, and volumes. Continue? (y/N)${NC}"
    read -p "" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker compose -f docker-compose.development.yml stop -v --remove-orphans
        echo -e "${GREEN}✅ Development environment cleaned successfully!${NC}"
    else
        echo -e "${YELLOW}Cleanup cancelled${NC}"
    fi
}

# Function to show service status
show_status() {
    echo -e "${YELLOW}Development service status:${NC}"
    docker compose -f docker-compose.development.yml ps
}

# Function to show service logs
show_logs() {
    local service=$1
    if [ -z "$service" ]; then
        echo -e "${YELLOW}Showing logs for all development services:${NC}"
        docker compose -f docker-compose.development.yml logs -f --tail=100
    else
        echo -e "${YELLOW}Showing logs for $service:${NC}"
        docker compose -f docker-compose.development.yml logs -f --tail=100 "$service"
    fi
}

# Main script execution
case "$1" in
    --start)
        start_services
        ;;
    --stop)
        stop_services
        ;;
    --restart)
        restart_services
        ;;
    --build)
        build_and_start
        ;;
    --clean)
        clean_environment
        ;;
    --status)
        show_status
        ;;
    --logs)
        show_logs "$2"
        ;;
    --help|*)
        show_help
        ;;
esac

exit 0
