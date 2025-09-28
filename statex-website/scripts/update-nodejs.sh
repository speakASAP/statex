#!/bin/bash

# Node.js Update Script for Production Server
# Updates Node.js to version 24+ and npm to latest

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root. Use sudo for specific commands."
    fi
}

# Check current Node.js version
check_current_version() {
    log "Checking current Node.js version..."
    
    if command -v node &> /dev/null; then
        CURRENT_NODE=$(node --version)
        CURRENT_NPM=$(npm --version)
        log "Current Node.js: $CURRENT_NODE"
        log "Current npm: $CURRENT_NPM"
        
        # Extract major version
        NODE_MAJOR=$(echo $CURRENT_NODE | sed 's/v\([0-9]*\).*/\1/')
        
        if [[ $NODE_MAJOR -ge 24 ]]; then
            success "Node.js $CURRENT_NODE is already version 24+"
            log "No update needed"
            exit 0
        fi
    else
        warning "Node.js not found, will install fresh"
    fi
}

# Backup current Node.js installation
backup_current() {
    log "Creating backup of current Node.js installation..."
    
    # Create backup directory
    BACKUP_DIR="$HOME/nodejs_backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup npm global packages
    if command -v npm &> /dev/null; then
        log "Backing up global npm packages..."
        npm list -g --depth=0 > "$BACKUP_DIR/global_packages.txt" 2>/dev/null || true
    fi
    
    # Backup Node.js binaries
    if command -v node &> /dev/null; then
        log "Backing up Node.js location..."
        which node > "$BACKUP_DIR/node_location.txt" 2>/dev/null || true
        which npm > "$BACKUP_DIR/npm_location.txt" 2>/dev/null || true
    fi
    
    success "Backup created in: $BACKUP_DIR"
}

# Remove old Node.js installation
remove_old_nodejs() {
    log "Removing old Node.js installation..."
    
    # Remove Node.js from package manager
    if command -v apt-get &> /dev/null; then
        log "Removing Node.js via apt-get..."
        sudo apt-get remove -y nodejs npm 2>/dev/null || true
        sudo apt-get autoremove -y 2>/dev/null || true
    fi
    
    # Remove NodeSource repository if exists
    if [ -f "/etc/apt/sources.list.d/nodesource.list" ]; then
        log "Removing old NodeSource repository..."
        sudo rm -f /etc/apt/sources.list.d/nodesource.list
    fi
    
    # Clean up any remaining Node.js files
    sudo rm -rf /usr/local/bin/node 2>/dev/null || true
    sudo rm -rf /usr/local/bin/npm 2>/dev/null || true
    sudo rm -rf /usr/local/lib/node_modules 2>/dev/null || true
    
    success "Old Node.js installation removed"
}

# Install Node.js 24 LTS
install_nodejs_24() {
    log "Installing Node.js 24 LTS..."
    
    # Update package list
    sudo apt-get update
    
    # Install required packages
    sudo apt-get install -y curl ca-certificates gnupg
    
    # Add NodeSource repository for Node.js 24
    log "Adding NodeSource repository for Node.js 24..."
    curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
    
    # Install Node.js 24
    log "Installing Node.js 24..."
    sudo apt-get install -y nodejs
    
    # Verify installation
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    if [[ $NODE_VERSION == v24* ]]; then
        success "Node.js $NODE_VERSION installed successfully"
        success "npm $NPM_VERSION installed successfully"
    else
        error "Failed to install Node.js 24. Current version: $NODE_VERSION"
    fi
}

# Update npm to latest version
update_npm() {
    log "Updating npm to latest version..."
    
    # Update npm itself
    sudo npm install -g npm@latest
    
    # Verify npm version
    NEW_NPM_VERSION=$(npm --version)
    success "npm updated to version $NEW_NPM_VERSION"
}

# Install global packages
install_global_packages() {
    log "Installing essential global packages..."
    
    # Install commonly used packages
    sudo npm install -g npm-check-updates
    sudo npm install -g pm2
    sudo npm install -g nodemon
    
    success "Global packages installed"
}

# Update USER_UID in .env
update_user_uid() {
    log "Updating USER_UID in .env file..."
    
    if [ -f ".env" ]; then
        CURRENT_UID=$(id -u)
        
        # Check if USER_UID already exists
        if grep -q "^USER_UID=" .env; then
            # Update existing USER_UID
            sed -i "s/^USER_UID=.*/USER_UID=$CURRENT_UID/" .env
            log "Updated USER_UID to $CURRENT_UID in .env"
        else
            # Add USER_UID if it doesn't exist
            echo "USER_UID=$CURRENT_UID" >> .env
            log "Added USER_UID=$CURRENT_UID to .env"
        fi
    else
        warning ".env file not found, skipping USER_UID update"
    fi
}

# Test Node.js installation
test_installation() {
    log "Testing Node.js installation..."
    
    # Test Node.js
    NODE_TEST=$(node -e "console.log('Node.js is working!')" 2>&1)
    if [[ $NODE_TEST == "Node.js is working!" ]]; then
        success "Node.js test passed"
    else
        error "Node.js test failed: $NODE_TEST"
    fi
    
    # Test npm
    NPM_TEST=$(npm --version 2>&1)
    if [[ $NPM_TEST =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        success "npm test passed"
    else
        error "npm test failed: $NPM_TEST"
    fi
}

# Main execution
main() {
    log "Starting Node.js update process..."
    
    check_root
    check_current_version
    backup_current
    remove_old_nodejs
    install_nodejs_24
    update_npm
    install_global_packages
    update_user_uid
    test_installation
    
    success "Node.js update completed successfully!"
    log "Current versions:"
    log "  Node.js: $(node --version)"
    log "  npm: $(npm --version)"
    log "  USER_UID: $(id -u)"
    
    log "You can now run: ./scripts/deploy.sh --deploy"
}

# Run main function
main "$@"
