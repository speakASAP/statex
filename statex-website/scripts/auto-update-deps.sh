#!/bin/bash

# Auto-update dependencies script
# This script automatically updates all packages to their latest versions

set -e

echo "🚀 Starting automatic dependency update..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Get current date
CURRENT_DATE=$(date '+%Y-%m-%d %H:%M:%S')
print_status "Update started at: $CURRENT_DATE"

# Update root dependencies
print_status "Updating root dependencies..."
npm run update-deps:check
if [ $? -eq 0 ]; then
    npm run update-deps
    print_success "Root dependencies updated successfully"
else
    print_warning "No updates available for root dependencies"
fi

# Update frontend dependencies
print_status "Updating frontend dependencies..."
cd frontend
npm run update-deps:check
if [ $? -eq 0 ]; then
    npm run update-deps
    print_success "Frontend dependencies updated successfully"
else
    print_warning "No updates available for frontend dependencies"
fi
cd ..

# Update backend dependencies
print_status "Updating backend dependencies..."
cd backend
npm run update-deps:check
if [ $? -eq 0 ]; then
    npm run update-deps
    print_success "Backend dependencies updated successfully"
else
    print_warning "No updates available for backend dependencies"
fi
cd ..

# Copy updated package-lock.json to frontend for Docker builds
print_status "Copying updated package-lock.json to frontend..."
cp package-lock.json frontend/

# Test if the project still builds
print_status "Testing project build..."
if docker compose -f docker-compose.development.yml up --build -d; then
    print_success "Project builds successfully after updates!"
else
    print_error "Project build failed after updates. Please check for compatibility issues."
    exit 1
fi

# Create update log
echo "[$CURRENT_DATE] Dependencies updated successfully" >> scripts/update-log.txt

print_success "🎉 All dependencies updated successfully!"
print_status "Update completed at: $(date '+%Y-%m-%d %H:%M:%S')"
print_status "You can now commit the updated package.json and package-lock.json files"
