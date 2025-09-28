#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load environment variables (.env symlink may point to .env.production) safely
load_env_safe() {
    local file="$1"
    while IFS= read -r raw_line || [ -n "$raw_line" ]; do
        # Strip CRLF
        line="${raw_line%$'\r'}"
        # Skip comments/empty
        [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
        # Must contain '='
        if [[ "$line" != *"="* ]]; then
            continue
        fi
        key="${line%%=*}"
        value="${line#*=}"
        # Trim whitespace around key
        key="$(echo "$key" | sed 's/^\s\+//;s/\s\+$//')"
        # Remove surrounding quotes from value if present
        if [[ "$value" =~ ^\".*\"$ ]]; then
            value="${value:1:${#value}-2}"
        elif [[ "$value" =~ ^\'.*\'$ ]]; then
            value="${value:1:${#value}-2}"
        fi
        export "$key=$value"
    done < "$file"
}

if [ -f .env ]; then
    load_env_safe .env
elif [ -f .env.production ]; then
    load_env_safe .env.production
else
    echo -e "${RED}Error: .env or .env.production file not found. Please run setup_production.sh first.${NC}"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$VIRTUAL_HOST" ]; then
    echo -e "${RED}Error: Required environment variable VIRTUAL_HOST not set.${NC}"
    echo "Please ensure VIRTUAL_HOST is set in your .env file."
    exit 1
fi

# Determine environment (development or production)
if [ -z "$NODE_ENV" ]; then
    if grep -q "NODE_ENV=production" .env 2>/dev/null || grep -q "NODE_ENV=production" .env.production 2>/dev/null; then
        NODE_ENV="production"
    else
        NODE_ENV="development"
    fi
    echo -e "${YELLOW}NODE_ENV not set, defaulting to '$NODE_ENV'${NC}"
fi

# Create SSL directory if it doesn't exist
SSL_DIR="./ssl"
mkdir -p "$SSL_DIR"

# Function to generate self-signed certificates for development
generate_self_signed() {
    local domain=$1
    echo -e "${YELLOW}Generating self-signed SSL certificate for $domain...${NC}"
    
    # Create a temporary directory
    TEMP_DIR=$(mktemp -d)
    trap 'rm -rf "$TEMP_DIR"' EXIT
    
    # Generate private key and certificate signing request
    openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
        -subj "/C=CZ/ST=Prague/L=Prague/O=StateX/CN=$domain" \
        -keyout "$TEMP_DIR/$domain.key" \
        -out "$TEMP_DIR/$domain.crt" \
        -addext "subjectAltName=DNS:$domain,DNS:*.$domain,IP:127.0.0.1" 2>/dev/null
    
    # Set proper permissions
    chmod 600 "$TEMP_DIR/$domain.key"
    chmod 644 "$TEMP_DIR/$domain.crt"
    
    # Copy certificates to SSL directory
    cp "$TEMP_DIR/$domain.key" "$SSL_DIR/"
    cp "$TEMP_DIR/$domain.crt" "$SSL_DIR/"
    
    echo -e "${GREEN}Self-signed certificates generated successfully!${NC}"
    echo -e "Key file: ${SSL_DIR}/$domain.key"
    echo -e "Cert file: ${SSL_DIR}/$domain.crt"
}

# Function to generate Let's Encrypt certificates for production
generate_letsencrypt() {
    if [ -z "$LETSENCRYPT_EMAIL" ] || [ -z "$VIRTUAL_HOST" ]; then
        echo -e "${RED}Error: LETSENCRYPT_EMAIL and VIRTUAL_HOST must be set for production.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Setting up Let's Encrypt certificates for $VIRTUAL_HOST...${NC}"
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        echo -e "${YELLOW}Certbot not found. Installing certbot...${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            brew install certbot
        else
            # Linux
            sudo apt-get update
            sudo apt-get install -y certbot python3-certbot-nginx
        fi
    fi
    
    # Create directory for webroot challenge
    mkdir -p "./letsencrypt/.well-known/acme-challenge"
    
    # Generate certificates using webroot plugin
    certbot certonly --webroot \
        -w "./letsencrypt" \
        -d "$VIRTUAL_HOST" \
        -d "www.$VIRTUAL_HOST" \
        -d "api.$VIRTUAL_HOST" \
        --email "$LETSENCRYPT_EMAIL" \
        --agree-tos \
        --non-interactive \
        --expand
    
    # Create symlinks in the ssl directory
    CERT_PATH="/etc/letsencrypt/live/$VIRTUAL_HOST"
    
    if [ -f "$CERT_PATH/fullchain.pem" ] && [ -f "$CERT_PATH/privkey.pem" ]; then
        # Ensure SSL directory exists
        mkdir -p "$SSL_DIR"
        
        # Copy certificates to project SSL directory
        sudo cp "$CERT_PATH/fullchain.pem" "$SSL_DIR/$VIRTUAL_HOST.crt"
        sudo cp "$CERT_PATH/privkey.pem" "$SSL_DIR/$VIRTUAL_HOST.key"
        
        # Set proper permissions and ownership (root:root for maximum security)
        sudo chown root:root "$SSL_DIR/$VIRTUAL_HOST.crt" "$SSL_DIR/$VIRTUAL_HOST.key"
        sudo chmod 600 "$SSL_DIR/$VIRTUAL_HOST.key"
        sudo chmod 644 "$SSL_DIR/$VIRTUAL_HOST.crt"
        
        echo -e "${GREEN}Let's Encrypt certificates generated successfully!${NC}"
        echo -e "Key file: ${SSL_DIR}/$VIRTUAL_HOST.key (600, root:root)"
        echo -e "Cert file: ${SSL_DIR}/$VIRTUAL_HOST.crt (644, root:root)"
        
        # Set up auto-renewal
        setup_renewal
    else
        echo -e "${RED}Failed to generate Let's Encrypt certificates.${NC}"
        exit 1
    fi
}

# Function to set up auto-renewal
setup_renewal() {
    echo -e "${YELLOW}Setting up automatic certificate renewal...${NC}"
    
    # Create renewal script
    RENEWAL_SCRIPT="/etc/cron.weekly/ssl-renewal"
    
    sudo bash -c "cat > $RENEWAL_SCRIPT << 'EOL'
#!/bin/bash

# Renew certificates
certbot renew --quiet --deploy-hook \"
    # Copy new certificates
    cp /etc/letsencrypt/live/$VIRTUAL_HOST/fullchain.pem $PWD/ssl/$VIRTUAL_HOST.crt && \
    cp /etc/letsencrypt/live/$VIRTUAL_HOST/privkey.pem $PWD/ssl/$VIRTUAL_HOST.key && \
    
    # Set proper permissions
    chown $(id -u):$(id -g) $PWD/ssl/$VIRTUAL_HOST.crt $PWD/ssl/$VIRTUAL_HOST.key && \
    chmod 600 $PWD/ssl/$VIRTUAL_HOST.key && \
    chmod 644 $PWD/ssl/$VIRTUAL_HOST.crt && \
    
    # Reload Nginx
    docker compose -f $PWD/docker-compose.yml -f $PWD/docker-compose.production.yml exec nginx nginx -s reload
"
EOL

    # Make the script executable
    sudo chmod +x "$RENEWAL_SCRIPT"
    
    # Test the renewal process (dry run)
    echo -e "${YELLOW}Testing certificate renewal (dry run)...${NC}"
    certbot renew --dry-run
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Certificate renewal is set up successfully!${NC}"
        echo -e "Certificates will be automatically renewed and Nginx will be reloaded when needed."
    else
        echo -e "${RED}There was an issue with the renewal setup. Please check the logs.${NC}"
    fi
}

# Main execution
if [ "$NODE_ENV" = "production" ]; then
    if [ "$1" = "--force-self-signed" ]; then
        echo -e "${YELLOW}Force generating self-signed certificate for production (not recommended)${NC}"
        generate_self_signed "$VIRTUAL_HOST"
        
        # Also generate for subdomains if they exist
        if [ -n "$VIRTUAL_HOST" ]; then
            generate_self_signed "www.$VIRTUAL_HOST"
            generate_self_signed "api.$VIRTUAL_HOST"
        fi
    else
        generate_letsencrypt
    fi
else
    echo -e "${YELLOW}Development environment detected. Generating self-signed certificates...${NC}"
    generate_self_signed "localhost"
fi

echo -e "\n${GREEN}✅ SSL certificate generation complete!${NC}"

# Update environment variables if needed
if [ "$NODE_ENV" = "production" ] && [ "$1" != "--force-self-signed" ]; then
    # Update env file with SSL paths (prefer .env.production)
    TARGET_ENV_FILE=".env.production"
    [ -f .env.production ] || TARGET_ENV_FILE=".env"
    if sed --version >/dev/null 2>&1; then
      sed -i "s|^SSL_CERT_PATH=.*|SSL_CERT_PATH=./ssl/$VIRTUAL_HOST.crt|" "$TARGET_ENV_FILE"
      sed -i "s|^SSL_KEY_PATH=.*|SSL_KEY_PATH=./ssl/$VIRTUAL_HOST.key|" "$TARGET_ENV_FILE"
      sed -i "s|^ALLOW_SELF_SIGNED=.*|ALLOW_SELF_SIGNED=false|" "$TARGET_ENV_FILE"
      sed -i "s|^SSL_MODE=.*|SSL_MODE=production|" "$TARGET_ENV_FILE"
    else
      sed -i '' "s|^SSL_CERT_PATH=.*|SSL_CERT_PATH=./ssl/$VIRTUAL_HOST.crt|" "$TARGET_ENV_FILE"
      sed -i '' "s|^SSL_KEY_PATH=.*|SSL_KEY_PATH=./ssl/$VIRTUAL_HOST.key|" "$TARGET_ENV_FILE"
      sed -i '' "s|^ALLOW_SELF_SIGNED=.*|ALLOW_SELF_SIGNED=false|" "$TARGET_ENV_FILE"
      sed -i '' "s|^SSL_MODE=.*|SSL_MODE=production|" "$TARGET_ENV_FILE"
    fi
    echo -e "\n${YELLOW}Updated $TARGET_ENV_FILE with production SSL paths.${NC}"
elif [ "$NODE_ENV" = "development" ]; then
    # Update env file for development
    TARGET_ENV_FILE=".env.development"
    [ -f .env.development ] || TARGET_ENV_FILE=".env"
    if sed --version >/dev/null 2>&1; then
      sed -i "s|^SSL_CERT_PATH=.*|SSL_CERT_PATH=./ssl/localhost.crt|" "$TARGET_ENV_FILE"
      sed -i "s|^SSL_KEY_PATH=.*|SSL_KEY_PATH=./ssl/localhost.key|" "$TARGET_ENV_FILE"
      sed -i "s|^ALLOW_SELF_SIGNED=.*|ALLOW_SELF_SIGNED=true|" "$TARGET_ENV_FILE"
      sed -i "s|^SSL_MODE=.*|SSL_MODE=development|" "$TARGET_ENV_FILE"
    else
      sed -i '' "s|^SSL_CERT_PATH=.*|SSL_CERT_PATH=./ssl/localhost.crt|" "$TARGET_ENV_FILE"
      sed -i '' "s|^SSL_KEY_PATH=.*|SSL_KEY_PATH=./ssl/localhost.key|" "$TARGET_ENV_FILE"
      sed -i '' "s|^ALLOW_SELF_SIGNED=.*|ALLOW_SELF_SIGNED=true|" "$TARGET_ENV_FILE"
      sed -i '' "s|^SSL_MODE=.*|SSL_MODE=development|" "$TARGET_ENV_FILE"
    fi
    echo -e "\n${YELLOW}Updated $TARGET_ENV_FILE with development SSL paths.${NC}"
fi

echo -e "\n${YELLOW}Note:${NC} For production, ensure your domain's DNS is properly configured to point to your server.\n"
