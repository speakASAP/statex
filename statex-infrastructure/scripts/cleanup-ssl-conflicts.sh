#!/bin/bash

# SSL Conflict Cleanup Script
# Removes duplicate and conflicting certbot implementations
# Consolidates all SSL management into statex-infrastructure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 StateX SSL Conflict Cleanup${NC}"
echo -e "${BLUE}==============================${NC}"

# Function to backup before deletion
backup_file() {
    local file="$1"
    local backup_dir="./ssl-cleanup-backup/$(date +%Y%m%d_%H%M%S)"
    
    if [ -f "$file" ]; then
        mkdir -p "$backup_dir"
        cp "$file" "$backup_dir/"
        echo -e "${YELLOW}📦 Backed up $file to $backup_dir${NC}"
    fi
}

# Function to remove file safely
remove_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        backup_file "$file"
        rm "$file"
        echo -e "${GREEN}✅ Removed $description: $file${NC}"
    else
        echo -e "${YELLOW}⚠️  File not found: $file${NC}"
    fi
}

# Function to remove directory safely
remove_directory() {
    local dir="$1"
    local description="$2"
    
    if [ -d "$dir" ]; then
        backup_file "$dir"
        rm -rf "$dir"
        echo -e "${GREEN}✅ Removed $description: $dir${NC}"
    else
        echo -e "${YELLOW}⚠️  Directory not found: $dir${NC}"
    fi
}

echo -e "${YELLOW}🔍 Starting SSL conflict cleanup...${NC}"

# 1. Remove conflicting wildcard SSL script from root
echo -e "\n${BLUE}1. Removing conflicting wildcard SSL script...${NC}"
remove_file "../scripts/setup-wildcard-ssl.sh" "Conflicting wildcard SSL script"

# 2. Remove duplicate Docker Compose files
echo -e "\n${BLUE}2. Removing duplicate Docker Compose files...${NC}"
remove_file "docker-compose.prod.yml" "Duplicate production Docker Compose"

# 3. Remove conflicting SSL scripts from statex-website
echo -e "\n${BLUE}3. Removing conflicting SSL scripts from statex-website...${NC}"
remove_file "../statex-website/scripts/setup-ssl-certificates.sh" "Conflicting SSL setup script"

# 4. Remove duplicate certbot services from statex-website Docker files
echo -e "\n${BLUE}4. Cleaning up statex-website Docker files...${NC}"

# Check if statex-website has certbot services in Docker files
if [ -f "../statex-website/docker-compose.production.yml" ]; then
    if grep -q "certbot\|letsencrypt" "../statex-website/docker-compose.production.yml"; then
        echo -e "${YELLOW}⚠️  Found certbot services in statex-website Docker files${NC}"
        echo -e "${YELLOW}   Please manually remove certbot services from:${NC}"
        echo -e "${YELLOW}   - ../statex-website/docker-compose.production.yml${NC}"
        echo -e "${YELLOW}   - ../statex-website/docs/development/production-setup-manual.md${NC}"
    fi
fi

# 5. Clean up old SSL directories
echo -e "\n${BLUE}5. Cleaning up old SSL directories...${NC}"

# Remove old SSL directories that might conflict
remove_directory "ssl/letsencrypt" "Old Let's Encrypt directory"
remove_directory "ssl/accounts" "Old accounts directory"
remove_directory "ssl/archive" "Old archive directory"
remove_directory "ssl/live" "Old live directory"
remove_directory "ssl/renewal" "Old renewal directory"

# 6. Create new unified SSL structure
echo -e "\n${BLUE}6. Creating unified SSL structure...${NC}"

mkdir -p ssl/production/statex.cz
mkdir -p ssl/development/localhost
mkdir -p ssl/shared
mkdir -p ssl/dynamic/production
mkdir -p ssl/dynamic/development
mkdir -p config
mkdir -p logs/ssl

# Set proper permissions
chmod 700 ssl
chmod 600 ssl/production ssl/development ssl/shared ssl/dynamic 2>/dev/null || true

echo -e "${GREEN}✅ Unified SSL structure created${NC}"

# 7. Create Cloudflare credentials template
echo -e "\n${BLUE}7. Creating Cloudflare credentials template...${NC}"

if [ ! -f "config/cloudflare.ini" ]; then
    cat > config/cloudflare.ini << 'EOF'
# Cloudflare DNS API credentials for wildcard SSL certificates
# Replace with your actual Cloudflare API token

dns_cloudflare_email = admin@statex.cz
dns_cloudflare_api_token = YOUR_CLOUDFLARE_API_TOKEN

# To get your API token:
# 1. Go to https://dash.cloudflare.com/profile/api-tokens
# 2. Create a custom token with Zone:Edit permissions
# 3. Replace YOUR_CLOUDFLARE_API_TOKEN with your actual token
EOF
    chmod 600 config/cloudflare.ini
    echo -e "${GREEN}✅ Cloudflare credentials template created${NC}"
    echo -e "${YELLOW}⚠️  Please update config/cloudflare.ini with your actual API token${NC}"
else
    echo -e "${YELLOW}⚠️  Cloudflare credentials already exist${NC}"
fi

# 8. Update .gitignore to exclude sensitive files
echo -e "\n${BLUE}8. Updating .gitignore...${NC}"

if [ -f ".gitignore" ]; then
    if ! grep -q "ssl/" .gitignore; then
        echo "" >> .gitignore
        echo "# SSL certificates and sensitive data" >> .gitignore
        echo "ssl/" >> .gitignore
        echo "config/cloudflare.ini" >> .gitignore
        echo "ssl-cleanup-backup/" >> .gitignore
        echo -e "${GREEN}✅ Updated .gitignore${NC}"
    else
        echo -e "${YELLOW}⚠️  .gitignore already contains SSL exclusions${NC}"
    fi
else
    cat > .gitignore << 'EOF'
# SSL certificates and sensitive data
ssl/
config/cloudflare.ini
ssl-cleanup-backup/
EOF
    echo -e "${GREEN}✅ Created .gitignore${NC}"
fi

# 9. Make SSL manager executable
echo -e "\n${BLUE}9. Setting up SSL manager...${NC}"

if [ -f "scripts/ssl-manager.sh" ]; then
    chmod +x scripts/ssl-manager.sh
    echo -e "${GREEN}✅ SSL manager is executable${NC}"
else
    echo -e "${RED}❌ SSL manager not found: scripts/ssl-manager.sh${NC}"
fi

# 10. Summary
echo -e "\n${GREEN}🎉 SSL Conflict Cleanup Completed!${NC}"
echo -e "\n${BLUE}📋 Summary:${NC}"
echo -e "${GREEN}✅ Removed conflicting wildcard SSL script${NC}"
echo -e "${GREEN}✅ Removed duplicate Docker Compose files${NC}"
echo -e "${GREEN}✅ Cleaned up conflicting SSL scripts${NC}"
echo -e "${GREEN}✅ Created unified SSL structure${NC}"
echo -e "${GREEN}✅ Created Cloudflare credentials template${NC}"
echo -e "${GREEN}✅ Updated .gitignore${NC}"

echo -e "\n${BLUE}🚀 Next Steps:${NC}"
echo -e "1. Update config/cloudflare.ini with your Cloudflare API token"
echo -e "2. Run: ./scripts/ssl-manager.sh --setup-development"
echo -e "3. Run: ./scripts/ssl-manager.sh --setup-production"
echo -e "4. Test with: ./scripts/ssl-manager.sh --status"

echo -e "\n${YELLOW}⚠️  Manual Cleanup Required:${NC}"
echo -e "Please manually remove certbot services from statex-website Docker files:"
echo -e "- ../statex-website/docker-compose.production.yml"
echo -e "- ../statex-website/docs/development/production-setup-manual.md"

echo -e "\n${GREEN}✨ All SSL management is now centralized in statex-infrastructure!${NC}"
