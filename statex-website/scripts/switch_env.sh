#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Help function
show_help() {
    echo -e "${YELLOW}Usage: $0 [development|production|status]${NC}"
    echo -e "Switch between development and production environments or check status.\n"
    echo "Options:"
    echo "  development   Switch to development environment"
    echo "  production    Switch to production environment"
    echo "  status        Show status of all containers and current environment"
    echo "  --help        Show this help message"
    exit 0
}

# Check if environment argument is provided
if [ -z "$1" ] || [ "$1" = "--help" ]; then
    show_help
fi

ENV=$1

# Validate environment
if [ "$ENV" != "development" ] && [ "$ENV" != "production" ] && [ "$ENV" != "status" ]; then
    echo -e "${RED}Error: Environment must be either 'development', 'production', or 'status'${NC}"
    exit 1
fi

# Handle status command
if [ "$ENV" = "status" ]; then
    echo -e "${GREEN}=== StateX Environment Status ===${NC}"
    
    # Show current environment
    CURRENT_ENV=""
    if [ -L ".env" ]; then
        CURRENT_ENV=$(readlink -f .env | sed 's/.*\.env\.//')
        echo -e "Current Environment: ${GREEN}$CURRENT_ENV${NC}"
    else
        echo -e "Current Environment: ${RED}Not set${NC}"
    fi
    
    echo
    
    # Show all running containers
    echo -e "${YELLOW}=== Running Containers ===${NC}"
    ALL_RUNNING=$(docker ps -q 2>/dev/null | wc -l | tr -d ' ')
    if [ "$ALL_RUNNING" -gt 0 ]; then
        echo -e "Found $ALL_RUNNING running container(s):"
        docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Could not list containers"
    else
        echo -e "${GREEN}No containers are currently running${NC}"
    fi
    
    echo
    
    # Show environment file status
    echo -e "${YELLOW}=== Environment Files ===${NC}"
    if [ -f ".env.development" ]; then
        echo -e "✅ .env.development exists"
    else
        echo -e "❌ .env.development missing"
    fi
    
    if [ -f ".env.production" ]; then
        echo -e "✅ .env.production exists"
    else
        echo -e "❌ .env.production missing"
    fi
    
    if [ -L ".env" ]; then
        echo -e "✅ .env symlink exists -> .env.$CURRENT_ENV"
    else
        echo -e "❌ .env symlink missing"
    fi
    
    exit 0
fi

# Check if environment file exists
if [ ! -f ".env.$ENV" ]; then
    echo -e "${YELLOW}Environment file .env.$ENV not found!${NC}"
    read -p "Would you like to run setup to create it? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./scripts/setup_env.sh
        if [ ! -f ".env.$ENV" ]; then
            echo -e "${RED}Failed to create environment file. Please check the setup script.${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Aborted. Environment file .env.$ENV is required.${NC}"
        exit 1
    fi
fi

# Get current environment
CURRENT_ENV=""
if [ -L ".env" ]; then
    CURRENT_ENV=$(readlink -f .env | sed 's/.*\.env\.//')
fi

# Don't switch if already in the requested environment
if [ "$CURRENT_ENV" = "$ENV" ]; then
    echo -e "${YELLOW}Already in $ENV environment. No changes made.${NC}"
    exit 0
fi

# Backup current .env if it's not a symlink
if [ -f ".env" ] && [ ! -L ".env" ]; then
    echo -e "${YELLOW}Backing up existing .env to .env.backup${NC}"
    cp .env .env.backup
fi

# Create symlink to the appropriate environment file
echo -e "${GREEN}Switching to $ENV environment...${NC}"
ln -sf ".env.$ENV" .env

# Handle frontend environment configuration
if [ -d "frontend" ]; then
    echo -e "${YELLOW}Configuring frontend environment...${NC}"
    cd frontend
    
    # Remove any existing environment files to avoid conflicts
    rm -f .env .env.development .env.production
    
    # Create a symlink to the global environment file
    ln -sf "../.env" .env
    
    echo -e "${GREEN}✅ Frontend environment configured to use global .env${NC}"
    cd ..
else
    echo -e "${YELLOW}Frontend directory not found, skipping frontend environment configuration${NC}"
fi

# Handle backend environment configuration
if [ -d "backend" ]; then
    echo -e "${YELLOW}Configuring backend environment...${NC}"
    cd backend
    
    # Remove any existing environment files to avoid conflicts
    rm -f .env .env.development .env.production
    
    # Create a symlink to the global environment file
    ln -sf "../.env" .env
    
    echo -e "${GREEN}✅ Backend environment configured to use global .env${NC}"
    cd ..
else
    echo -e "${YELLOW}Backend directory not found, skipping backend environment configuration${NC}"
fi

# Auto-update USER_UID for the current environment
auto_update_uid() {
    echo -e "${YELLOW}Auto-updating USER_UID for $ENV environment...${NC}"
    CURRENT_UID=$(id -u)
    
    # Get the actual target file (not the symlink)
    local target_file=".env.$ENV"
    
    # Update USER_UID in the target environment file
    if grep -q "^USER_UID=" "$target_file"; then
        # Update existing USER_UID (macOS compatible)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS version
            sed -i '' "s/^USER_UID=.*/USER_UID=$CURRENT_UID/" "$target_file"
        else
            # Linux version
            sed -i "s/^USER_UID=.*/USER_UID=$CURRENT_UID/" "$target_file"
        fi
        echo -e "${GREEN}✅ Updated USER_UID to $CURRENT_UID for $ENV environment${NC}"
    else
        # Add USER_UID if it doesn't exist
        echo "USER_UID=$CURRENT_UID" >> "$target_file"
        echo -e "${GREEN}✅ Added USER_UID=$CURRENT_UID for $ENV environment${NC}"
    fi
}

# Update USER_UID for the current environment
auto_update_uid

# Export environment variable for current session
# Only export essential variables, skip lines with special characters
if [ -f .env ]; then
    # Source the environment file safely
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip empty lines, comments, and lines with special characters
        if [[ -n "$line" && ! "$line" =~ ^[[:space:]]*# && "$line" =~ ^[A-Z_][A-Z0-9_]*= ]]; then
            export "$line"
        fi
    done < .env
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}docker-compose not found, using docker compose${NC}"
    DOCKER_COMPOSE_CMD="docker compose"
else
    DOCKER_COMPOSE_CMD="docker-compose"
fi

# Select compose file based on environment
COMPOSE_FILE=""
if [ "$ENV" = "production" ]; then
    if [ -f "docker-compose.production.yml" ]; then
        COMPOSE_FILE="-f docker-compose.production.yml"
    fi
else
    if [ -f "docker-compose.development.yml" ]; then
        COMPOSE_FILE="-f docker-compose.development.yml"
    fi
fi

# Stop and remove existing containers if they're running
if [ -n "$COMPOSE_FILE" ]; then
    echo -e "Checking for running containers..."
    
    # Check for all running containers in the system
    ALL_RUNNING=$(docker ps -q 2>/dev/null | wc -l | tr -d ' ')
    if [ "$ALL_RUNNING" -gt 0 ]; then
        echo -e "${YELLOW}System-wide: Found $ALL_RUNNING running container(s)${NC}"
        docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Could not list all containers"
        echo
    fi
    
    # Check if there are any running containers for this compose file
    RUNNING_CONTAINERS=$($DOCKER_COMPOSE_CMD $COMPOSE_FILE ps -q 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$RUNNING_CONTAINERS" -gt 0 ]; then
        echo -e "${YELLOW}Found $RUNNING_CONTAINERS running container(s) for this environment:${NC}"
        $DOCKER_COMPOSE_CMD $COMPOSE_FILE ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        
        echo -e "\nStopping running containers..."
        # Stop containers gracefully first
        $DOCKER_COMPOSE_CMD $COMPOSE_FILE stop 2>/dev/null &
        STOP_PID=$!
        
        # Wait for up to 10 seconds for graceful stop
        for i in {1..10}; do
            if ! kill -0 $STOP_PID 2>/dev/null; then
                break
            fi
            sleep 1
        done
        
        # If still running, force kill
        if kill -0 $STOP_PID 2>/dev/null; then
            echo -e "${YELLOW}Graceful stop taking too long, force stopping...${NC}"
            kill -9 $STOP_PID 2>/dev/null || true
        fi
        
        # Wait for stop process to finish
        wait $STOP_PID 2>/dev/null || true
        
        # Now remove containers
        echo -e "Removing containers..."
        $DOCKER_COMPOSE_CMD $COMPOSE_FILE down --remove-orphans 2>/dev/null &
        DOWN_PID=$!
        
        # Wait for up to 5 seconds for down
        for i in {1..5}; do
            if ! kill -0 $DOWN_PID 2>/dev/null; then
                break
            fi
            sleep 1
        done
        
        # If still running, kill it
        if kill -0 $DOWN_PID 2>/dev/null; then
            echo -e "${YELLOW}Container removal taking too long, killing process...${NC}"
            kill -9 $DOWN_PID 2>/dev/null || true
            # Force kill any hanging docker processes
            pkill -f "docker compose" 2>/dev/null || true
        fi
        
        # Wait for down process to finish
        wait $DOWN_PID 2>/dev/null || true
        
        echo -e "${GREEN}Containers stopped and removed successfully${NC}"
    else
        echo -e "${GREEN}No running containers found for this environment${NC}"
    fi
fi

# Start containers with new environment if compose file exists
if [ -n "$COMPOSE_FILE" ]; then
    echo -e "Skipping container start due to Docker build issues..."
    echo -e "To start containers manually, run: $DOCKER_COMPOSE_CMD $COMPOSE_FILE up -d --build"
    
    # Show URLs without starting containers
    if [ "$ENV" = "development" ]; then
        echo -e "\n${GREEN}Development URLs (when containers are running):${NC}"
        echo -e "- Frontend:    http://localhost:${FRONTEND_PORT:-3000}"
        echo -e "- API:         http://localhost:4000"
        echo -e "- MailHog:     http://localhost:8025"
    else
        echo -e "\n${GREEN}Production environment activated.${NC}"
        echo -e "- Frontend:    https://$VIRTUAL_HOST"
        echo -e "- API:         https://api.$VIRTUAL_HOST"
    fi
else
    echo -e "${YELLOW}No compose file found for $ENV (expected docker-compose.development.yml or docker-compose.production.yml).${NC}"
fi

echo -e "\n${GREEN}✅ Successfully switched to $ENV environment${NC}"
echo -e "Environment variables are now loaded from .env.$ENV\n"

# Show next steps
echo -e "${YELLOW}Next steps:${NC}"
if [ "$ENV" = "production" ]; then
    echo "1. Ensure your domain's DNS is properly configured"
    echo "2. Set up SSL certificates (if not using Let's Encrypt)"
    echo "3. Verify all production settings in .env.production"
    echo -e "\nTo monitor logs: ${GREEN}docker compose -f docker-compose.yml -f docker-compose.production.yml logs -f${NC}"
else
    echo -e "To view logs: ${GREEN}docker compose logs -f${NC}"
    echo -e "To run tests: ${GREEN}npm test${NC}"
fi
