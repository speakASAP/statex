#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to display usage information
show_help() {
    echo -e "${YELLOW}Usage: $0 [options]${NC}"
    echo -e "${RED}⚠️  WARNING: This script is for PRODUCTION environment only!${NC}"
    echo -e "For development, use: ${GREEN}./scripts/dev-deploy.sh${NC}\n"
    echo -e "Deploy the StateX application to production\n"
    echo "Options:"
    echo "  --setup           Run initial setup (create .env files, generate SSL certs)"
    echo "  --deploy          Deploy the application"
    echo "  --restart         Restart all services"
    echo "  --status          Show status of all services"
    echo "  --logs [service]  Show logs for all or specific service"
    echo "  --help            Show this help message"
    
    echo -e "\n${YELLOW}🌐 Application URLs & Endpoints:${NC}"
    echo -e "${BLUE}Production URLs (Live):${NC}"
    echo -e "  • Main Website:     https://\${VIRTUAL_HOST}"
    echo -e "  • API Endpoint:     https://api.\${VIRTUAL_HOST}"
    echo -e "  • Platform:         StateX Platform microservices"
    echo -e "  • WWW Subdomain:    https://www.\${VIRTUAL_HOST}"
    echo -e "  • API Backend:      https://api.\${VIRTUAL_HOST}"
    echo -e "  • Health Check:     https://api.\${VIRTUAL_HOST}/health"
    
    echo -e "\n${BLUE}API Endpoints:${NC}"
    echo -e "  • Health Check:     GET /health - Service health status"
    echo -e "  • API Test:         GET /api/test - Backend connectivity test"
    echo -e "  • Notification Test: GET /api/forms/test-notification - Notification service test"
    echo -e "  • Prototype Form:   POST /api/forms/prototype - Prototype requests"
    echo -e "  • Contact Form:     POST /api/forms/contact - General contact"
    
    echo -e "\n${BLUE}Container Management:${NC}"
    echo -e "  • Status:           docker compose -f docker-compose.production.yml ps"
    echo -e "  • Logs:             docker compose -f docker-compose.production.yml logs"
    echo -e "  • Rebuild:          docker compose -f docker-compose.production.yml build --no-cache"
    
    echo -e "\n${BLUE}Health Check Endpoints:${NC}"
    echo -e "  • Backend Health:   https://api.${VIRTUAL_HOST}/health (Production API)"
    echo -e "  • Frontend Health:  https://${VIRTUAL_HOST} (Production Website)"
    echo -e "  • PostgreSQL:       pg_isready command (Docker internal health check)"
    echo -e "  • Redis:            redis-cli ping command (Docker internal health check)"
    
    exit 0
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check environment
check_environment() {
    # Check if we're in production environment
    if [ -L ".env" ]; then
        CURRENT_ENV=$(readlink -f .env | sed 's/.*\.env\.//')
        if [ "$CURRENT_ENV" != "production" ]; then
            echo -e "${RED}❌ ERROR: This script is for PRODUCTION environment only!${NC}"
            echo -e "Current environment: ${YELLOW}$CURRENT_ENV${NC}"
            echo -e "For development, use: ${GREEN}./scripts/dev-deploy.sh${NC}"
            echo -e "To switch to production: ${GREEN}./scripts/switch_env.sh production${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ ERROR: No environment configured!${NC}"
        echo -e "Please run: ${GREEN}./scripts/switch_env.sh production${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Production environment confirmed${NC}"
}

# Function to auto-detect and set USER_UID
auto_detect_uid() {
    echo -e "${YELLOW}Auto-detecting user UID...${NC}"
    CURRENT_UID=$(id -u)
    
    # Get the actual target file (not the symlink)
    local target_file=".env"
    if [ -L ".env" ]; then
        target_file=$(readlink -f .env)
    fi
    
    # Check if USER_UID exists in target file and update it
    if grep -q "^USER_UID=" "$target_file"; then
        # Update existing USER_UID (macOS compatible)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS version
            sed -i '' "s/^USER_UID=.*/USER_UID=$CURRENT_UID/" "$target_file"
        else
            # Linux version
            sed -i "s/^USER_UID=.*/USER_UID=$CURRENT_UID/" "$target_file"
        fi
        echo -e "${GREEN}✅ Updated USER_UID to $CURRENT_UID in $target_file${NC}"
    else
        # Add USER_UID if it doesn't exist
        echo "USER_UID=$CURRENT_UID" >> "$target_file"
        echo -e "${GREEN}✅ Added USER_UID=$CURRENT_UID to $target_file${NC}"
    fi
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

# Function to load environment variables
load_env() {
    # Load defaults first
    if [ -f config/defaults.env ]; then
        echo -e "${YELLOW}Loading default configuration from config/defaults.env...${NC}"
        set -a
        source config/defaults.env
        set +a
    fi
    
    # Prefer production env if present
    if [ -f .env.production ]; then
        set -a
        source .env.production
        set +a
    elif [ -f .env ]; then
        set -a
        source .env
        set +a
    else
        echo -e "${YELLOW}No .env(.production) file found. Creating from .env.example...${NC}"
        cp .env.example .env
        set -a
        source .env
        set +a
    fi
    # Set default values if not set
    export NODE_ENV=${NODE_ENV:-production}
    export VIRTUAL_HOST=${VIRTUAL_HOST:-localhost}
}

# Function to run initial setup
run_setup() {
    echo -e "${GREEN}🚀 Starting initial setup...${NC}"
    
    # Create necessary directories
    echo -e "${YELLOW}Creating necessary directories...${NC}"
    mkdir -p ssl logs uploads database/backups
    mkdir -p logs/nginx logs/certbot
    mkdir -p webroot/.well-known/acme-challenge
    mkdir -p config
    
    # Set up environment files
    if [ ! -f .env.production ]; then
        echo -e "${YELLOW}Creating production environment file...${NC}"
        ./scripts/setup_env.sh
    fi
    
    # Ensure config/defaults.env exists
    if [ ! -f config/defaults.env ]; then
        echo -e "${RED}❌ config/defaults.env not found${NC}"
        echo -e "${YELLOW}This file should be committed to the repository. Please check:${NC}"
        echo -e "${YELLOW}1. The file exists in the repository${NC}"
        echo -e "${YELLOW}2. The file is not being ignored by .gitignore${NC}"
        echo -e "${YELLOW}3. The file has been committed and pushed${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ config/defaults.env exists${NC}"
    fi
    
    # Switch to production environment
    echo -e "${YELLOW}Switching to production environment...${NC}"
    ./scripts/switch_env.sh production
    
    # SSL certificates configuration
    echo -e "${YELLOW}Configuring SSL certificates...${NC}"
    if [ "$NODE_ENV" = "production" ]; then
        echo -e "${GREEN}Production environment detected. Using existing SSL certificates.${NC}"
        echo -e "${YELLOW}SSL certificates from ./ssl directory will be used (no automatic generation).${NC}"
        
    else
        ./scripts/generate_ssl.sh
    fi
    
    echo -e "${GREEN}✅ Setup completed successfully!${NC}"
}

# Function to deploy the application
deploy() {
    local start_time=$(date +%s)
    local step=0
    local total_steps=10
    
    echo -e "${GREEN}🚀 Deploying StateX application to PRODUCTION...${NC}"
    echo -e "${BLUE}===============================================${NC}"
    echo -e "${YELLOW}Start time: $(date)${NC}"
    echo -e "${YELLOW}Total steps: $total_steps${NC}\n"
    
    # Step 1: Check environment
    step=$((step + 1))
    echo -e "${CYAN}📋 Step $step/$total_steps: Checking production environment...${NC}"
    check_environment
    echo -e "${GREEN}✅ Step $step completed: Environment verified${NC}\n"
    
    # Step 2: Check Docker
    step=$((step + 1))
    echo -e "${CYAN}📋 Step $step/$total_steps: Checking Docker status...${NC}"
    check_docker
    echo -e "${GREEN}✅ Step $step completed: Docker is running${NC}\n"
    
    # Step 3: Auto-detect user UID
    step=$((step + 1))
    echo -e "${CYAN}📋 Step $step/$total_steps: Auto-detecting user UID...${NC}"
    auto_detect_uid
    echo -e "${GREEN}✅ Step $step completed: User UID configured${NC}\n"
    
    # Step 4: Load environment variables
    step=$((step + 1))
    echo -e "${CYAN}📋 Step $step/$total_steps: Loading environment variables...${NC}"
    load_env
    echo -e "${GREEN}✅ Step $step completed: Environment variables loaded${NC}\n"
    
    # Step 5: Pull latest changes
    step=$((step + 1))
    echo -e "${CYAN}📋 Step $step/$total_steps: Pulling latest changes from git...${NC}"
    echo -e "${YELLOW}Current branch: $(git branch --show-current)${NC}"
    echo -e "${YELLOW}Current commit: $(git rev-parse --short HEAD)${NC}"
    
    if git pull; then
        echo -e "${GREEN}✅ Step $step completed: Git pull successful${NC}"
        echo -e "${YELLOW}New commit: $(git rev-parse --short HEAD)${NC}"
    else
        echo -e "${RED}❌ Step $step failed: Git pull failed${NC}"
        exit 1
    fi
    echo ""
    
    # Step 6: Initialize SSL volume (if needed)
    step=$((step + 1))
    echo -e "${CYAN}📋 Step $step/$total_steps: Initializing SSL volume...${NC}"
    
    # Check if SSL volume exists and has certificates
    if ! docker volume inspect ${VIRTUAL_HOST}_ssl_data >/dev/null 2>&1; then
        echo -e "${YELLOW}SSL volume not found. Creating and initializing...${NC}"
        ./scripts/manage-ssl.sh --init
    else
        echo -e "${GREEN}✅ SSL volume already exists${NC}"
    fi
    echo -e "${GREEN}✅ Step $step completed: SSL volume ready${NC}\n"
    
    # Step 7: Verify configuration files
    step=$((step + 1))
    echo -e "${CYAN}📋 Step $step/$total_steps: Verifying configuration files...${NC}"
    
    # Ensure config directory and defaults.env exist
    if [ ! -d "config" ]; then
        echo -e "${YELLOW}Creating config directory...${NC}"
        mkdir -p config
    fi
    
    if [ ! -f "config/defaults.env" ]; then
        echo -e "${RED}❌ config/defaults.env not found${NC}"
        echo -e "${YELLOW}This file should be committed to the repository. Please check:${NC}"
        echo -e "${YELLOW}1. The file exists in the repository${NC}"
        echo -e "${YELLOW}2. The file is not being ignored by .gitignore${NC}"
        echo -e "${YELLOW}3. The file has been committed and pushed${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ config/defaults.env exists${NC}"
    fi
    echo -e "${GREEN}✅ Step $step completed: Configuration files verified${NC}\n"
    
    # Step 8: Build and start containers with comprehensive monitoring
    step=$((step + 1))
    echo -e "${CYAN}📋 Step $step/$total_steps: Building and starting containers...${NC}"
    echo -e "${YELLOW}This is the most time-consuming step. Building with comprehensive monitoring...${NC}"
    
    # Set timeout for the entire build process (45 minutes)
    TIMEOUT_SECONDS=2700
    BUILD_CMD="docker compose -f docker-compose.production.yml up -d --build --remove-orphans"
    
    echo -e "${BLUE}🔧 Build command: $BUILD_CMD${NC}"
    echo -e "${BLUE}⏱️  Timeout: ${TIMEOUT_SECONDS} seconds (${TIMEOUT_SECONDS}/60 minutes)${NC}"
    echo -e "${BLUE}📊 Progress will be shown every 30 seconds${NC}\n"
    
    # Start build with progress monitoring
    local build_start_time=$(date +%s)
    local progress_counter=0
    
    # Run build with timeout and detailed progress monitoring
    if timeout $TIMEOUT_SECONDS bash -c "
        echo '🚀 Starting Docker build process...'
        echo '📋 Build started at: $(date)'
        
        # Start the build in background and monitor progress
        $BUILD_CMD &
        BUILD_PID=\$!
        
        # Monitor build progress
        while kill -0 \$BUILD_PID 2>/dev/null; do
            progress_counter=\$((progress_counter + 1))
            elapsed=\$((\$(date +%s) - $build_start_time))
            echo \"⏱️  Build progress update #\$progress_counter (elapsed: \${elapsed}s)\"
            
            # Show Docker processes
            echo \"🔍 Active Docker processes:\"
            ps aux | grep -E \"(docker|buildx)\" | grep -v grep | head -5 || echo \"No active processes\"
            
            # Show container status with color coding
            echo \"🐳 Container status:\"
            docker ps --filter \"name=${VIRTUAL_HOST}\" --format \"table {{.Names}}\t{{.Status}}\t{{.Ports}}\" 2>/dev/null | while IFS= read -r line; do
                if echo \"\$line\" | grep -q \"(unhealthy)\"; then
                    echo -e \"\${RED}\$line\${NC}\"
                elif echo \"\$line\" | grep -q \"(healthy)\"; then
                    echo -e \"\${GREEN}\$line\${NC}\"
                else
                    echo \"\$line\"
                fi
            done || echo \"No containers yet\"
            
            echo \"⏳ Waiting 30 seconds for next update...\"
            sleep 30
        done
        
        # Wait for build to complete
        wait \$BUILD_PID
        BUILD_EXIT_CODE=\$?
        
        if [ \$BUILD_EXIT_CODE -eq 0 ]; then
            echo '✅ Build completed successfully'
            echo '📋 Build finished at: $(date)'
        else
            echo \"❌ Build failed with exit code \$BUILD_EXIT_CODE\"
            exit \$BUILD_EXIT_CODE
        fi
    "; then
        local build_end_time=$(date +%s)
        local build_duration=$((build_end_time - build_start_time))
        local build_minutes=$((build_duration / 60))
        local build_seconds=$((build_duration % 60))
        
        echo -e "${GREEN}✅ Step $step completed: Docker build successful!${NC}"
        echo -e "${BLUE}📊 Build duration: ${build_minutes}m ${build_seconds}s${NC}"
        echo -e "${BLUE}�� Build finished at: $(date)${NC}"
    else
        local build_exit_code=$?
        if [ $build_exit_code -eq 124 ]; then
            echo -e "${RED}❌ Step $step failed: Build timed out after ${TIMEOUT_SECONDS} seconds!${NC}"
            echo -e "${YELLOW}This usually indicates:${NC}"
            echo -e "${YELLOW}  - Docker build hanging on a specific step${NC}"
            echo -e "${YELLOW}  - Network connectivity issues${NC}"
            echo -e "${YELLOW}  - Insufficient system resources${NC}"
            echo -e "${YELLOW}  - Package installation problems${NC}"
            echo -e "${YELLOW}Check the monitor-build.sh script output for details${NC}"
            echo -e "${YELLOW}Run: ./scripts/monitor-build.sh --kill-hanging${NC}"
            exit 1
        else
            echo -e "${RED}❌ Step $step failed: Docker build failed with exit code $build_exit_code${NC}"
            echo -e "${YELLOW}Check the error messages above for details${NC}"
            exit 1
        fi
    fi
    echo ""
    
    # Step 9: Verify containers are running
    step=$((step + 1))
    echo -e "${CYAN}📋 Step $step/$total_steps: Verifying container status...${NC}"
    
    echo -e "${YELLOW}Waiting 10 seconds for containers to stabilize...${NC}"
    sleep 10
    
    echo -e "${YELLOW}Container status:${NC}"
    # Show container status with color coding
    docker compose -f docker-compose.production.yml ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | while IFS= read -r line; do
        if echo "$line" | grep -q "(unhealthy)"; then
            echo -e "${RED}$line${NC}"
        elif echo "$line" | grep -q "(healthy)"; then
            echo -e "${GREEN}$line${NC}"
        else
            echo "$line"
        fi
    done
    
    # Check if any containers are unhealthy
    if docker compose -f docker-compose.production.yml ps --format "{{.Status}}" | grep -q "(unhealthy)"; then
        echo -e "${RED}❌ Step $step failed: Some containers are unhealthy${NC}"
        echo -e "${YELLOW}Check logs for unhealthy containers:${NC}"
        echo -e "${YELLOW}  docker compose -f docker-compose.production.yml logs${NC}"
        exit 1
    elif docker compose -f docker-compose.production.yml ps --format "{{.Status}}" | grep -q "Up"; then
        echo -e "${GREEN}✅ Step $step completed: All containers are running${NC}"
    else
        echo -e "${RED}❌ Step $step failed: Some containers are not running${NC}"
        exit 1
    fi
    echo ""
    
    # Step 10: Run database migrations
    step=$((step + 1))
    echo -e "${CYAN}📋 Step $step/$total_steps: Running database migrations...${NC}"
    
    echo -e "${YELLOW}Checking if backend container is ready...${NC}"
    local migration_attempts=0
    local max_migration_attempts=5
    
    while [ $migration_attempts -lt $max_migration_attempts ]; do
        migration_attempts=$((migration_attempts + 1))
        echo -e "${YELLOW}Migration attempt $migration_attempts/$max_migration_attempts...${NC}"
        
        if docker compose -f docker-compose.production.yml exec backend npx prisma migrate deploy; then
            echo -e "${GREEN}✅ Step $step completed: Database migrations successful${NC}"
            break
        else
            if [ $migration_attempts -eq $max_migration_attempts ]; then
                echo -e "${RED}❌ Step $step failed: Database migration failed after $max_migration_attempts attempts${NC}"
                echo -e "${YELLOW}Check the backend logs for migration errors:${NC}"
                echo -e "${YELLOW}  docker compose -f docker-compose.production.yml logs backend${NC}"
                exit 1
            else
                echo -e "${YELLOW}⚠️  Migration attempt $migration_attempts failed, retrying in 10 seconds...${NC}"
                sleep 10
            fi
        fi
    done
    echo ""
    
    # Final success summary
    local end_time=$(date +%s)
    local total_duration=$((end_time - start_time))
    local total_minutes=$((total_duration / 60))
    local total_seconds=$((total_duration % 60))
    
    echo -e "${GREEN}🎉 DEPLOYMENT COMPLETED SUCCESSFULLY! 🎉${NC}"
    echo -e "${BLUE}===============================================${NC}"
    echo -e "${GREEN}✅ All $total_steps steps completed successfully${NC}"
    echo -e "${BLUE}📊 Total deployment time: ${total_minutes}m ${total_seconds}s${NC}"
    echo -e "${BLUE}📋 Deployment finished at: $(date)${NC}"
    echo -e "\n${YELLOW}Application URLs:${NC}"
    echo -e "- Frontend:            https://${VIRTUAL_HOST}"
    echo -e "- API:                 https://api.${VIRTUAL_HOST}"
    
    echo -e "\n${YELLOW}🌐 Comprehensive Application URLs & Endpoints:${NC}"
    echo -e "${BLUE}Production URLs (Live):${NC}"
    echo -e "  • Main Website:      https://${VIRTUAL_HOST}"
    echo -e "  • WWW Subdomain:     https://www.${VIRTUAL_HOST}"
    echo -e "  • API Backend:       https://api.${VIRTUAL_HOST}"
    echo -e "  • Health Check:      https://api.${VIRTUAL_HOST}/health"
    
    echo -e "\n${BLUE}Nginx Configuration:${NC}"
    echo -e "  • Nginx Service:     docker compose -f docker-compose.production.yml ps nginx"
    echo -e "  • Nginx Logs:        docker compose -f docker-compose.production.yml logs nginx"
    echo -e "  • SSL Management:    ./scripts/manage-ssl.sh --help"
    echo -e "  • SSL Status:        ./scripts/manage-ssl.sh --status"
    
    echo -e "\n${BLUE}API Endpoints:${NC}"
    echo -e "  • Health Check:      GET /health - Service health status"
    echo -e "  • API Test:          GET /api/test - Backend connectivity test"
    echo -e "  • Notification Test: GET /api/forms/test-notification - Notification service test"
    echo -e "  • Prototype Form:    POST /api/forms/prototype - Prototype requests"
    echo -e "  • Contact Form:      POST /api/forms/contact - General contact"
    
    echo -e "\n${BLUE}Container Management:${NC}"
    echo -e "  • Status:            docker compose -f docker-compose.production.yml ps"
    echo -e "  • Logs:              docker compose -f docker-compose.production.yml logs"
    echo -e "  • Logs ongoing:      docker compose -f docker-compose.production.yml logs -f --tail=100"
    echo -e "  • Rebuild:           docker compose -f docker-compose.production.yml build --no-cache"
    echo -e "  • Backend API logs:  docker compose -f docker-compose.production.yml logs -f --tail=50 backend"
    echo -e "  • Frontend logs:     docker compose -f docker-compose.production.yml logs -f --tail=50 frontend"
    echo -e "  • PostgreSQL logs:   docker compose -f docker-compose.production.yml logs -f --tail=50 postgres"
    echo -e "  • Redis logs:        docker compose -f docker-compose.production.yml logs -f --tail=50 redis"
    echo -e "  • Multiple Services: docker compose -f docker-compose.production.yml logs -f --tail=50 backend frontend"
    
    echo -e "\n${BLUE}Health Check Endpoints:${NC}"
    echo -e "  • Backend Health:    https://api.${VIRTUAL_HOST}/health (Production API)"
    echo -e "  • Frontend Health:   https://${VIRTUAL_HOST} (Production Website)"
    echo -e "  • PostgreSQL:        pg_isready command (Docker internal health check)"
    echo -e "  • Redis:             redis-cli ping command (Docker internal health check)"
    
    echo -e "\n${YELLOW}Useful commands:${NC}"
    echo -e "- View logs:           ${GREEN}./scripts/deploy.sh --logs${NC}"
    echo -e "- Check status:        ${GREEN}./scripts/deploy.sh --status${NC}"
    echo -e "- Monitor:             ${GREEN}./scripts/monitor-build.sh${NC}"
}

# Function to restart services
restart_services() {
    echo -e "${YELLOW}Restarting services...${NC}"
    docker compose -f docker-compose.production.yml restart
    echo -e "${GREEN}✅ Services restarted successfully!${NC}"
}

# Function to show service status
show_status() {
    echo -e "${YELLOW}Service status:${NC}"
    # Show container status with color coding
    docker compose -f docker-compose.production.yml ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | while IFS= read -r line; do
        if echo "$line" | grep -q "(unhealthy)"; then
            echo -e "${RED}$line${NC}"
        elif echo "$line" | grep -q "(healthy)"; then
            echo -e "${GREEN}$line${NC}"
        else
            echo "$line"
        fi
    done
}

# Function to show service logs
show_logs() {
    local service=$1
    if [ -z "$service" ]; then
        echo -e "${YELLOW}Showing logs for all services:${NC}"
        docker compose -f docker-compose.production.yml logs -f --tail=100
    else
        echo -e "${YELLOW}Showing logs for $service:${NC}"
        docker compose -f docker-compose.production.yml logs -f --tail=100 "$service"
    fi
}

# Main script execution
case "$1" in
    --setup)
        run_setup
        ;;
    --deploy)
        deploy
        ;;
    --restart)
        restart_services
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
