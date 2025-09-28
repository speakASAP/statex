#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.example exists
if [ ! -f .env.example ]; then
    echo -e "${YELLOW}Warning: .env.example not found. Creating a default one...${NC}"
    touch .env.example
fi

# Function to generate a random secret
generate_secret() {
    head -c 32 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 64
}

# Function to handle environment file creation
create_env_file() {
    local env_type=$1
    local env_file=".env.${env_type}"
    local domain="localhost"
    local node_env="development"
    local ssl_mode="development"
    local debug="true"
    local db_name="statex_${env_type}"
    
    if [ "$env_type" = "production" ]; then
        domain="yourdomain.com"
        node_env="production"
        ssl_mode="production"
        debug="false"
    fi

    # Check if file exists and prompt for overwrite
    if [ -f "$env_file" ]; then
        read -p "${YELLOW}Warning: $env_file already exists. Do you want to overwrite it? (y/N)${NC} " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Skipping $env_file creation${NC}"
            return
        fi
    fi

    echo -e "${GREEN}Creating $env_file...${NC}"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Process .env.example and replace values as needed
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip empty lines and comments
        if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
            echo "$line" >> "$temp_file"
            continue
        fi
        
        # Extract key and value
        key=$(echo "$line" | cut -d '=' -f1)
        value=$(echo "$line" | cut -d '=' -f2-)
        
        # Set environment-specific values
        case $key in
            NODE_ENV)
                value=$node_env
                ;;
            APP_NAME)
                value="StateX $env_type"
                ;;
            APP_URL)
                if [ "$env_type" = "production" ]; then
                    value="https://$domain"
                else
                    value="http://localhost:${FRONTEND_PORT:-3000}"
                fi
                ;;
            API_URL)
                if [ "$env_type" = "production" ]; then
                    value="https://api.$domain/api"
                else
                    value="http://localhost:4000/api"
                fi
                ;;
            VIRTUAL_HOST|LETSENCRYPT_HOST|DEFAULT_HOST)
                value=$domain
                ;;
            LETSENCRYPT_EMAIL)
                value="admin@$domain"
                ;;
            SSL_MODE)
                value=$ssl_mode
                ;;
            ALLOW_SELF_SIGNED)
                value=$([ "$env_type" = "development" ] && echo "true" || echo "false")
                ;;
            DEBUG)
                value=$debug
                ;;
            DB_NAME|DATABASE_URL)
                # Update database name in DATABASE_URL
                if [[ "$value" == *"statex_development"* || "$value" == *"statex_production"* ]]; then
                    value=$(echo "$value" | sed -e "s/statex_development/statex_${env_type}/g" \
                                             -e "s/statex_production/statex_${env_type}/g")
                fi
                ;;
            JWT_SECRET|COOKIE_SECRET|SESSION_SECRET)
                # Generate a random secret for production, use a default for development
                if [ "$env_type" = "production" ]; then
                    value=$(generate_secret)
                else
                    value="dev_$(echo "$key" | tr '[:upper:]' '[:lower:]' | tr '_' '-')-secret-key"
                fi
                ;;
            SMTP_USER)
                if [ "$env_type" = "production" ]; then
                    value="noreply@$domain"
                else
                    value="dev@localhost"
                fi
                ;;
            SMTP_HOST)
                if [ "$env_type" = "production" ]; then
                    value="smtp.sendgrid.net"  # or your production SMTP server
                else
                    value="mailhog"  # Using MailHog for local development
                fi
                ;;
            SMTP_PORT)
                if [ "$env_type" = "production" ]; then
                    value=587
                else
                    value=1025  # Default MailHog port
                fi
                ;;
            SMTP_SECURE)
                value=$([ "$env_type" = "production" ] && echo "true" || echo "false")
                ;;
        esac
        
        # Write the processed line to the temp file
        echo "${key}=${value}" >> "$temp_file"
    done < .env.example
    
    # Move the temp file to the final location
    mv "$temp_file" "$env_file"
    
    echo -e "${GREEN}Created $env_file${NC}"
}

# Create development environment file
echo -e "\n${GREEN}=== Setting up development environment ===${NC}"
create_env_file "development"

# Create production environment file
echo -e "\n${GREEN}=== Setting up production environment ===${NC}"
create_env_file "production"

# Create .env symlink to development by default
if [ ! -f .env ]; then
    ln -sf .env.development .env
    echo -e "\n${GREEN}Created symlink: .env -> .env.development${NC}" 
fi

# Create necessary directories
mkdir -p ssl logs emails uploads

# Generate default SSL certificates for development
if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
    echo -e "\n${GREEN}Generating self-signed SSL certificates for development...${NC}"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/CN=localhost" \
        -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" \
        2>/dev/null
    echo -e "${GREEN}SSL certificates generated in ssl/ directory${NC}"
fi

echo -e "\n${GREEN}✅ Environment setup complete!${NC}"
echo -e "\nNext steps:"
echo "1. Review and update the values in .env.development and .env.production"
echo "2. For production, update the domain and email settings in .env.production"
echo "3. Set up your SMTP credentials for email functionality"
echo -e "\nTo switch between environments, run: ${YELLOW}./scripts/switch_env.sh [development|production]${NC}"