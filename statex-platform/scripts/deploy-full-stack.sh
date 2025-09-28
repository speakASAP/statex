#!/bin/bash

# StateX Full Stack Deployment Script
# This script deploys all three components: infrastructure, platform, and website

set -e

echo "🚀 Deploying StateX Full Stack..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INFRASTRUCTURE_DIR="/Users/sergiystashok/Documents/GitHub/statex-infrastructure"
PLATFORM_DIR="/Users/sergiystashok/Documents/GitHub/statex-platform"
WEBSITE_DIR="/Users/sergiystashok/Documents/GitHub/statex-website"

# Check if directories exist
check_directories() {
    echo -e "${BLUE}📁 Checking directories...${NC}"
    
    if [ ! -d "$INFRASTRUCTURE_DIR" ]; then
        echo -e "${RED}❌ Infrastructure directory not found: $INFRASTRUCTURE_DIR${NC}"
        exit 1
    fi
    
    if [ ! -d "$PLATFORM_DIR" ]; then
        echo -e "${RED}❌ Platform directory not found: $PLATFORM_DIR${NC}"
        exit 1
    fi
    
    if [ ! -d "$WEBSITE_DIR" ]; then
        echo -e "${RED}❌ Website directory not found: $WEBSITE_DIR${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All directories found${NC}"
}

# Deploy infrastructure
deploy_infrastructure() {
    echo -e "${BLUE}🏗️  Deploying infrastructure...${NC}"
    cd "$INFRASTRUCTURE_DIR"
    
    # Check if .env exists
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️  .env file not found, creating from example...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Please edit .env file with your configuration${NC}"
    fi
    
    # Deploy infrastructure
    ./scripts/deploy.sh
    
    echo -e "${GREEN}✅ Infrastructure deployed${NC}"
}

# Deploy platform
deploy_platform() {
    echo -e "${BLUE}⚙️  Deploying platform...${NC}"
    cd "$PLATFORM_DIR"
    
    # Deploy platform
    make deploy-prod DOMAIN=api.statex.cz WEB_DOMAIN=statex.cz
    
    echo -e "${GREEN}✅ Platform deployed${NC}"
}

# Deploy website
deploy_website() {
    echo -e "${BLUE}🌐 Deploying website...${NC}"
    cd "$WEBSITE_DIR"
    
    # Check if website has docker-compose
    if [ -f docker-compose.yml ]; then
        echo -e "${BLUE}🐳 Starting website services...${NC}"
        docker compose up -d
    else
        echo -e "${YELLOW}⚠️  No docker-compose.yml found in website directory${NC}"
        echo -e "${YELLOW}⚠️  Website will be served by platform${NC}"
    fi
    
    echo -e "${GREEN}✅ Website deployed${NC}"
}

# Check service health
check_health() {
    echo -e "${BLUE}🔍 Checking service health...${NC}"
    
    # Check infrastructure
    echo -e "${BLUE}📊 Infrastructure status:${NC}"
    cd "$INFRASTRUCTURE_DIR"
    docker compose ps
    
    # Check platform
    echo -e "${BLUE}📊 Platform status:${NC}"
    cd "$PLATFORM_DIR"
    make status
    
    echo -e "${GREEN}✅ Health check completed${NC}"
}

# Main deployment function
main() {
    echo -e "${GREEN}🎯 StateX Full Stack Deployment${NC}"
    echo "=================================="
    
    check_directories
    deploy_infrastructure
    deploy_platform
    deploy_website
    check_health
    
    echo ""
    echo -e "${GREEN}🎉 Full stack deployment completed!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Services available at:${NC}"
    echo "  - Website: https://statex.cz"
    echo "  - API: https://api.statex.cz"
    echo "  - WWW: https://www.statex.cz (redirects to statex.cz)"
    echo ""
    echo -e "${BLUE}📊 Management commands:${NC}"
    echo "  - Infrastructure: cd $INFRASTRUCTURE_DIR && docker compose logs -f"
    echo "  - Platform: cd $PLATFORM_DIR && make logs"
    echo "  - Website: cd $WEBSITE_DIR && docker compose logs -f"
    echo ""
    echo -e "${BLUE}🛑 To stop all services:${NC}"
    echo "  - Infrastructure: cd $INFRASTRUCTURE_DIR && docker compose down"
    echo "  - Platform: cd $PLATFORM_DIR && make stop"
    echo "  - Website: cd $WEBSITE_DIR && docker compose down"
}

# Run main function
main "$@"
