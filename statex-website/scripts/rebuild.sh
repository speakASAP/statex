#!/bin/bash

# Rebuild script for statex.cz production environment
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to show usage
show_usage() {
    echo -e "${YELLOW}Usage: $0 [environment]${NC}"
    echo -e "\nEnvironments:"
    echo -e "  production     Rebuild production containers (default)"
    echo -e "  development    Rebuild development containers"
    echo -e "  --help         Show this help message"
    echo -e "\nExamples:"
    echo -e "  $0              # Rebuild production"
    echo -e "  $0 production   # Rebuild production"
    echo -e "  $0 development  # Rebuild development"
}

# Check arguments
ENVIRONMENT=${1:-production}

case "$ENVIRONMENT" in
    --help|-h)
        show_usage
        exit 0
        ;;
    production|prod)
        ENVIRONMENT="production"
        COMPOSE_FILE="docker-compose.production.yml"
        ;;
    development|dev)
        ENVIRONMENT="development"
        COMPOSE_FILE="docker-compose.development.yml"
        ;;
    *)
        echo -e "${RED}❌ Error: Invalid environment '$ENVIRONMENT'${NC}"
        show_usage
        exit 1
        ;;
esac

echo -e "${BLUE}🚀 Starting rebuild process for StateX ($ENVIRONMENT)...${NC}"

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}❌ Error: $COMPOSE_FILE not found in current directory${NC}"
    exit 1
fi

# Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes from git...${NC}"
git pull

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose -f "$COMPOSE_FILE" down

# Remove existing images to force rebuild (for development)
if [ "$ENVIRONMENT" = "development" ]; then
    echo -e "${YELLOW}🗑️  Removing existing images to force rebuild...${NC}"
    docker compose -f "$COMPOSE_FILE" down --rmi all
fi

# Build and start services
echo -e "${YELLOW}🔨 Building and starting services...${NC}"
docker compose -f "$COMPOSE_FILE" up -d --build

echo -e "${GREEN}✅ Rebuild completed successfully!${NC}"

# Show service status
echo -e "${BLUE}🔍 Service status:${NC}"
docker compose -f "$COMPOSE_FILE" ps

echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  • Check status:  ${GREEN}docker compose -f $COMPOSE_FILE ps${NC}"
echo -e "  • View logs:     ${GREEN}docker compose -f $COMPOSE_FILE logs -f${NC}"
echo -e "  • Rebuild again: ${GREEN}$0 $ENVIRONMENT${NC}"

if [ "$ENVIRONMENT" = "development" ]; then
    echo ""
    echo -e "${YELLOW}📊 To verify npm version:${NC}"
    echo -e "  docker compose -f $COMPOSE_FILE logs frontend | grep 'npm notice'"
    echo -e "  docker compose -f $COMPOSE_FILE logs backend | grep 'npm notice'"
fi
