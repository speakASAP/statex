#!/bin/bash

# Comprehensive Version Check Script for StateX
# Checks Node.js, npm, and project compatibility (local and Docker)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 StateX Version Compatibility Check${NC}"
echo -e "${BLUE}=====================================${NC}"

# Function to check local versions
check_local_versions() {
    echo -e "${YELLOW}📋 Local Environment Versions:${NC}"
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "✅ Node.js: ${GREEN}$NODE_VERSION${NC}"
        
        # Extract major version
        NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
        
        if [[ $NODE_MAJOR -ge 24 ]]; then
            echo -e "✅ Node.js version is compatible (>=24)${NC}"
        else
            echo -e "❌ Node.js version is too old (<24)${NC}"
            echo -e "   Run: ${GREEN}./scripts/update-nodejs.sh${NC}"
        fi
    else
        echo -e "❌ Node.js not found${NC}"
        echo -e "   Run: ${GREEN}./scripts/update-nodejs.sh${NC}"
    fi

    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        echo -e "✅ npm: ${GREEN}$NPM_VERSION${NC}"
        
        # Extract major version
        NPM_MAJOR=$(echo $NPM_VERSION | sed 's/\([0-9]*\).*/\1/')
        
        if [[ $NPM_MAJOR -ge 11 ]]; then
            echo -e "✅ npm version is compatible (>=11)${NC}"
        else
            echo -e "❌ npm version is too old (<11)${NC}"
            echo -e "   Run: ${GREEN}./scripts/update-nodejs.sh${NC}"
        fi
    else
        echo -e "❌ npm not found${NC}"
        echo -e "   Run: ${GREEN}./scripts/update-nodejs.sh${NC}"
    fi

    # Check project requirements
    echo -e "\n${BLUE}📋 Project requirements:${NC}"
    echo -e "   Node.js: >=23.11.0"
    echo -e "   npm: >=11.5.2"

    # Check USER_UID
    if [ -f ".env" ]; then
        if grep -q "^USER_UID=" .env; then
            USER_UID=$(grep "^USER_UID=" .env | cut -d'=' -f2)
            echo -e "✅ USER_UID in .env: ${GREEN}$USER_UID${NC}"
        else
            echo -e "❌ USER_UID not found in .env${NC}"
            echo -e "   Run: ${GREEN}./scripts/update-nodejs.sh${NC}"
        fi
    else
        echo -e "❌ .env file not found${NC}"
    fi
}

# Function to check Docker container versions
check_docker_versions() {
    echo -e "\n${YELLOW}🐳 Docker Container Versions:${NC}"
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        echo -e "❌ Docker is not running${NC}"
        return
    fi
    
    # Check development environment
    if [ -f "docker-compose.development.yml" ]; then
        echo -e "\n${BLUE}📦 Development Environment:${NC}"
        
        echo -e "Frontend Container:"
        if docker compose -f docker-compose.development.yml ps frontend 2>/dev/null | grep -q "Up"; then
            echo -e "✅ Frontend is running${NC}"
            echo -e "📊 npm version:"
            docker compose -f docker-compose.development.yml exec frontend npm --version 2>/dev/null || echo -e "❌ Cannot get npm version${NC}"
            echo -e "📊 Node.js version:"
            docker compose -f docker-compose.development.yml exec frontend node --version 2>/dev/null || echo -e "❌ Cannot get Node.js version${NC}"
        else
            echo -e "❌ Frontend is not running${NC}"
        fi

        echo -e "\nBackend Container:"
        if docker compose -f docker-compose.development.yml ps backend 2>/dev/null | grep -q "Up"; then
            echo -e "✅ Backend is running${NC}"
            echo -e "📊 npm version:"
            docker compose -f docker-compose.development.yml exec backend npm --version 2>/dev/null || echo -e "❌ Cannot get npm version${NC}"
            echo -e "📊 Node.js version:"
            docker compose -f docker-compose.development.yml exec backend node --version 2>/dev/null || echo -e "❌ Cannot get Node.js version${NC}"
        else
            echo -e "❌ Backend is not running${NC}"
        fi

        echo -e "\n${BLUE}🌐 All development containers status:${NC}"
        docker compose -f docker-compose.development.yml ps 2>/dev/null || echo -e "❌ Cannot get container status${NC}"
    fi
    
    # Check production environment
    if [ -f "docker-compose.production.yml" ]; then
        echo -e "\n${BLUE}🚀 Production Environment:${NC}"
        echo -e "🌐 All production containers status:${NC}"
        docker compose -f docker-compose.production.yml ps 2>/dev/null || echo -e "❌ Cannot get container status${NC}"
    fi
}

# Function to show summary and next steps
show_summary() {
    echo -e "\n${BLUE}📊 Version Compatibility Summary:${NC}"
    
    # Check if versions are compatible
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        NODE_MAJOR=$(node --version | sed 's/v\([0-9]*\).*/\1/')
        NPM_MAJOR=$(npm --version | sed 's/\([0-9]*\).*/\1/')
        
        if [[ $NODE_MAJOR -ge 24 ]] && [[ $NPM_MAJOR -ge 11 ]]; then
            echo -e "✅ ${GREEN}Local versions are compatible!${NC}"
        else
            echo -e "❌ ${RED}Local versions need updating${NC}"
        fi
    else
        echo -e "❌ ${RED}Local Node.js/npm not available${NC}"
    fi
    
    echo -e "\n${BLUE}🚀 Next steps:${NC}"
    if [[ $NODE_MAJOR -ge 24 ]] && [[ $NPM_MAJOR -ge 11 ]]; then
        echo -e "   ✅ Versions are compatible!"
        echo -e "   Run: ${GREEN}./scripts/deploy.sh --deploy${NC}"
    else
        echo -e "   ❌ Update required first:"
        echo -e "   Run: ${GREEN}./scripts/update-nodejs.sh${NC}"
    fi
    
    echo -e "\n${BLUE}🔧 Other useful commands:${NC}"
    echo -e "   • Rebuild containers: ${GREEN}./scripts/rebuild.sh [environment]${NC}"
    echo -e "   • Check SSL status:   ${GREEN}./scripts/manage-ssl.sh --status${NC}"
    echo -e "   • Monitor build:      ${GREEN}./scripts/monitor-build.sh${NC}"
}

# Main execution
check_local_versions
check_docker_versions
show_summary
