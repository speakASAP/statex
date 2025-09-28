#!/bin/bash

# Enhanced StateX Build Monitoring Script
# Run this in a separate terminal during deployment to prevent freezing

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
UPDATE_INTERVAL=5
LOG_TAIL=30
TIMEOUT_MINUTES=45

echo -e "${BLUE}🔍 Enhanced StateX Build Monitoring Script${NC}"
echo -e "${BLUE}===============================================${NC}"
echo -e "${YELLOW}This script monitors the entire deployment process${NC}"
echo -e "${YELLOW}Run this in a separate terminal while deploying${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop monitoring${NC}\n"

# Function to show timestamp
show_timestamp() {
    echo -e "${PURPLE}⏰ $(date '+%Y-%m-%d %H:%M:%S')${NC}"
}

# Function to show Docker build progress
show_build_progress() {
    echo -e "\n${CYAN}🏗️  Docker Build Progress:${NC}"
    echo -e "${CYAN}========================${NC}"
    
    # Show active Docker build processes
    echo -e "${YELLOW}Active Build Processes:${NC}"
    BUILD_PROCESSES=$(ps aux | grep -E "(docker|buildx)" | grep -v grep | grep -v "monitor-build" || true)
    if [ -n "$BUILD_PROCESSES" ]; then
        echo "$BUILD_PROCESSES"
    else
        echo -e "${GREEN}✅ No active build processes${NC}"
    fi
    
    # Show Docker build cache usage
    echo -e "\n${YELLOW}Build Cache Usage:${NC}"
    docker system df --format "table {{.Type}}\t{{.TotalCount}}\t{{.Size}}\t{{.Reclaimable}}" 2>/dev/null || echo -e "${RED}Could not get Docker system info${NC}"
    
    # Show Docker buildx builders
    echo -e "\n${YELLOW}BuildX Builders:${NC}"
    docker buildx ls 2>/dev/null || echo -e "${RED}Could not get buildx info${NC}"
}

# Function to show container status
show_container_status() {
    echo -e "\n${CYAN}🐳 Container Status:${NC}"
    echo -e "${CYAN}==================${NC}"
    
    # Show all StateX containers
    echo -e "${YELLOW}StateX Containers:${NC}"
    if docker ps --filter "name=statex" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Size}}" 2>/dev/null; then
        echo -e "${GREEN}✅ Container status retrieved${NC}"
    else
        echo -e "${RED}❌ Could not get container status${NC}"
    fi
    
    # Show stopped containers
    echo -e "\n${YELLOW}Stopped Containers:${NC}"
    docker ps -a --filter "name=statex" --filter "status=exited" --format "table {{.Names}}\t{{.Status}}\t{{.ExitCode}}" 2>/dev/null || echo -e "${RED}Could not get stopped containers${NC}"
}

# Function to show resource usage
show_resource_usage() {
    echo -e "\n${CYAN}💻 System Resources:${NC}"
    echo -e "${CYAN}==================${NC}"
    
    # Show Docker stats
    echo -e "${YELLOW}Container Resource Usage:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" 2>/dev/null || echo -e "${RED}Could not get resource stats${NC}"
    
    # Show system resources
    echo -e "\n${YELLOW}System Resources:${NC}"
    echo -e "CPU Load: $(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}')"
    echo -e "Memory: $(free -h | grep Mem | awk '{print $3"/"$2}')"
    echo -e "Disk: $(df -h / | tail -1 | awk '{print $3"/"$2" ("$5")"}')"
}

# Function to show detailed logs
show_detailed_logs() {
    echo -e "\n${CYAN}📋 Detailed Service Logs:${NC}"
    echo -e "${CYAN}========================${NC}"
    
    # Show frontend logs
    if docker ps --filter "name=statex-frontend" --format "{{.Names}}" | grep -q "statex-frontend"; then
        echo -e "\n${YELLOW}Frontend Logs (last $LOG_TAIL lines):${NC}"
        echo -e "${YELLOW}===============================${NC}"
        docker logs statex-frontend --tail $LOG_TAIL 2>/dev/null || echo -e "${RED}Could not get frontend logs${NC}"
    fi
    
    # Show backend logs
    if docker ps --filter "name=statex-backend" --format "{{.Names}}" | grep -q "statex-backend"; then
        echo -e "\n${YELLOW}Backend Logs (last $LOG_TAIL lines):${NC}"
        echo -e "${YELLOW}==============================${NC}"
        docker logs statex-backend --tail $LOG_TAIL 2>/dev/null || echo -e "${RED}Could not get backend logs${NC}"
    fi
    
    # Show nginx logs
    if docker ps --filter "name=statex-nginx" --format "{{.Names}}" | grep -q "statex-nginx"; then
        echo -e "\n${YELLOW}Nginx Logs (last $LOG_TAIL lines):${NC}"
        echo -e "${YELLOW}============================${NC}"
        docker logs statex-nginx --tail $LOG_TAIL 2>/dev/null || echo -e "${RED}Could not get nginx logs${NC}"
    fi
}

# Function to show error summary
show_error_summary() {
    echo -e "\n${CYAN}🚨 Error Summary:${NC}"
    echo -e "${CYAN}===============${NC}"
    
    # Check for recent errors in all containers
    echo -e "${YELLOW}Recent Errors (last 50 lines):${NC}"
    ERROR_COUNT=0
    
    # Check frontend errors
    if docker ps --filter "name=statex-frontend" --format "{{.Names}}" | grep -q "statex-frontend"; then
        FRONTEND_ERRORS=$(docker logs statex-frontend --tail 50 2>/dev/null | grep -i "error\|fail\|exception" || true)
        if [ -n "$FRONTEND_ERRORS" ]; then
            echo -e "${RED}Frontend Errors:${NC}"
            echo "$FRONTEND_ERRORS"
            ERROR_COUNT=$((ERROR_COUNT + 1))
        fi
    fi
    
    # Check backend errors
    if docker ps --filter "name=statex-backend" --format "{{.Names}}" | grep -q "statex-backend"; then
        BACKEND_ERRORS=$(docker logs statex-backend --tail 50 2>/dev/null | grep -i "error\|fail\|exception" || true)
        if [ -n "$BACKEND_ERRORS" ]; then
            echo -e "${RED}Backend Errors:${NC}"
            echo "$BACKEND_ERRORS"
            ERROR_COUNT=$((ERROR_COUNT + 1))
        fi
    fi
    
    if [ $ERROR_COUNT -eq 0 ]; then
        echo -e "${GREEN}✅ No recent errors found${NC}"
    else
        echo -e "${RED}❌ Found $ERROR_COUNT service(s) with errors${NC}"
    fi
}

# Function to show deployment progress
show_deployment_progress() {
    echo -e "\n${CYAN}🚀 Deployment Progress:${NC}"
    echo -e "${CYAN}=====================${NC}"
    
    # Check if deployment script is running
    if pgrep -f "deploy.sh.*deploy" > /dev/null; then
        echo -e "${GREEN}✅ Deployment script is running${NC}"
    else
        echo -e "${YELLOW}⚠️  Deployment script not detected${NC}"
    fi
    
    # Check if Docker Compose is running
    if pgrep -f "docker compose.*up.*build" > /dev/null; then
        echo -e "${GREEN}✅ Docker Compose build is running${NC}"
    else
        echo -e "${YELLOW}⚠️  Docker Compose build not detected${NC}"
    fi
    
    # Show build stages
    echo -e "\n${YELLOW}Build Stages:${NC}"
    if docker ps --filter "name=statex" --format "{{.Names}}" | grep -q "statex-frontend"; then
        echo -e "${GREEN}✅ Frontend container exists${NC}"
    else
        echo -e "${YELLOW}⏳ Frontend container not yet built${NC}"
    fi
    
    if docker ps --filter "name=statex" --format "{{.Names}}" | grep -q "statex-backend"; then
        echo -e "${GREEN}✅ Backend container exists${NC}"
    else
        echo -e "${YELLOW}⏳ Backend container not yet built${NC}"
    fi
}

# Function to show network status
show_network_status() {
    echo -e "\n${CYAN}🌐 Network Status:${NC}"
    echo -e "${CYAN}=================${NC}"
    
    # Show Docker networks
    echo -e "${YELLOW}Docker Networks:${NC}"
    docker network ls --filter "name=statex" --format "table {{.ID}}\t{{.Name}}\t{{.Driver}}\t{{.Scope}}" 2>/dev/null || echo -e "${RED}Could not get network info${NC}"
    
    # Show port bindings
    echo -e "\n${YELLOW}Port Bindings:${NC}"
    docker ps --filter "name=statex" --format "table {{.Names}}\t{{.Ports}}" 2>/dev/null || echo -e "${RED}Could not get port info${NC}"
}

# Function to show timeout warning
show_timeout_warning() {
    local elapsed_minutes=$1
    local max_minutes=$TIMEOUT_MINUTES
    
    if [ $elapsed_minutes -ge $max_minutes ]; then
        echo -e "\n${RED}⚠️  TIMEOUT WARNING! ⚠️${NC}"
        echo -e "${RED}Deployment has been running for ${elapsed_minutes} minutes${NC}"
        echo -e "${RED}Maximum expected time: ${max_minutes} minutes${NC}"
        echo -e "${YELLOW}Consider checking for hanging processes or network issues${NC}"
        echo -e "${YELLOW}Run: ./scripts/monitor-build.sh --kill-hanging${NC}"
    elif [ $elapsed_minutes -ge $((max_minutes - 5)) ]; then
        echo -e "\n${YELLOW}⚠️  Approaching timeout in $((max_minutes - elapsed_minutes)) minutes${NC}"
    fi
}

# Main monitoring loop
main() {
    local start_time=$(date +%s)
    local iteration=0
    
    while true; do
        iteration=$((iteration + 1))
        local current_time=$(date +%s)
        local elapsed_seconds=$((current_time - start_time))
        local elapsed_minutes=$((elapsed_seconds / 60))
        
        clear
        echo -e "${BLUE}🔍 Enhanced StateX Build Monitoring Script${NC}"
        echo -e "${BLUE}===============================================${NC}"
        show_timestamp
        echo -e "${PURPLE}🔄 Iteration: $iteration | ⏱️  Elapsed: ${elapsed_minutes}m ${elapsed_seconds}s${NC}"
        echo -e "${PURPLE}⏰ Update Interval: ${UPDATE_INTERVAL}s${NC}"
        
        # Show all monitoring sections
        show_build_progress
        show_container_status
        show_resource_usage
        show_deployment_progress
        show_network_status
        show_error_summary
        show_detailed_logs
        
        # Show timeout warning
        show_timeout_warning $elapsed_minutes
        
        echo -e "\n${BLUE}===============================================${NC}"
        echo -e "${YELLOW}🔄 Next update in ${UPDATE_INTERVAL} seconds... (Ctrl+C to exit)${NC}"
        echo -e "${YELLOW}💡 Use Ctrl+C to stop monitoring${NC}"
        echo -e "${BLUE}===============================================${NC}"
        
        sleep $UPDATE_INTERVAL
    done
}

# Handle command line arguments
case "${1:-}" in
    --help|-h)
        echo -e "${BLUE}Usage: $0 [options]${NC}"
        echo -e "${YELLOW}Options:${NC}"
        echo -e "  --kill-hanging    Kill hanging Docker processes"
        echo -e "  --help, -h        Show this help message"
        echo -e "  (no args)         Start monitoring"
        exit 0
        ;;
    --kill-hanging)
        echo -e "${RED}💀 Killing hanging Docker processes...${NC}"
        pkill -f "docker compose.*up.*build" 2>/dev/null || true
        pkill -f "buildx" 2>/dev/null || true
        docker system prune -f
        echo -e "${GREEN}✅ Hanging processes killed${NC}"
        exit 0
        ;;
    *)
        main
        ;;
esac
