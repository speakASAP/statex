#!/bin/bash

# Unified SSL Certificate Management for StateX Platform
# Handles both production (*.statex.cz) and development (*.localhost) wildcard certificates
# Single source of truth for all SSL operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PRODUCTION_DOMAIN="statex.cz"
DEVELOPMENT_DOMAIN="localhost"
EMAIL="admin@statex.cz"
SSL_BASE_DIR="./ssl"
PROD_SSL_DIR="$SSL_BASE_DIR/production"
DEV_SSL_DIR="$SSL_BASE_DIR/development"
SHARED_SSL_DIR="$SSL_BASE_DIR/shared"

# Load environment variables
if [ -f config/defaults.env ]; then
    set -a
    source config/defaults.env
    set +a
fi

echo -e "${BLUE}🔐 StateX Unified SSL Certificate Manager${NC}"
echo -e "${BLUE}==========================================${NC}"

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        exit 1
    fi
    
    # Check certbot
    if ! docker run --rm certbot/certbot --version &> /dev/null; then
        echo -e "${YELLOW}⚠️  Pulling certbot image...${NC}"
        docker pull certbot/certbot:latest
    fi
    
    # Check mkcert for development
    if ! command -v mkcert &> /dev/null; then
        echo -e "${YELLOW}⚠️  mkcert not found. Installing...${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install mkcert
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
            chmod +x mkcert-v*-linux-amd64
            sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
        fi
    fi
    
    echo -e "${GREEN}✅ Prerequisites check completed${NC}"
}

# Function to create SSL directory structure
create_ssl_structure() {
    echo -e "${YELLOW}📁 Creating SSL directory structure...${NC}"
    
    mkdir -p "$PROD_SSL_DIR/statex.cz"
    mkdir -p "$PROD_SSL_DIR/specific"
    mkdir -p "$DEV_SSL_DIR/localhost"
    mkdir -p "$SHARED_SSL_DIR"
    mkdir -p "$SSL_BASE_DIR/backup"
    
    # Set proper permissions
    chmod 700 "$SSL_BASE_DIR"
    chmod 600 "$PROD_SSL_DIR" "$DEV_SSL_DIR" "$SHARED_SSL_DIR" 2>/dev/null || true
    
    echo -e "${GREEN}✅ SSL directory structure created${NC}"
}

# Function to setup production wildcard SSL
setup_production_wildcard() {
    echo -e "${YELLOW}🌐 Setting up production wildcard SSL for *.$PRODUCTION_DOMAIN${NC}"
    
    # Check if Cloudflare credentials exist
    if [ ! -f "config/cloudflare.ini" ]; then
        echo -e "${YELLOW}⚠️  Cloudflare credentials not found. Creating template...${NC}"
        cat > config/cloudflare.ini << EOF
dns_cloudflare_email = $EMAIL
dns_cloudflare_api_token = YOUR_CLOUDFLARE_API_TOKEN
EOF
        echo -e "${RED}❌ Please update config/cloudflare.ini with your Cloudflare API token${NC}"
        echo -e "${YELLOW}Then run: $0 --setup-production${NC}"
        return 1
    fi
    
    # Request wildcard certificate using DNS challenge
    echo -e "${YELLOW}🔄 Requesting wildcard certificate...${NC}"
    docker run --rm \
        -v "$(pwd)/$PROD_SSL_DIR/statex.cz:/etc/letsencrypt" \
        -v "$(pwd)/config/cloudflare.ini:/cloudflare.ini" \
        certbot/certbot certonly \
        --dns-cloudflare \
        --dns-cloudflare-credentials /cloudflare.ini \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$PRODUCTION_DOMAIN" \
        -d "*.$PRODUCTION_DOMAIN" \
        --config-dir /etc/letsencrypt \
        --work-dir /etc/letsencrypt \
        --logs-dir /etc/letsencrypt
    
    # Copy certificates to shared location
    if [ -f "$PROD_SSL_DIR/statex.cz/live/$PRODUCTION_DOMAIN/fullchain.pem" ]; then
        cp "$PROD_SSL_DIR/statex.cz/live/$PRODUCTION_DOMAIN/fullchain.pem" "$SHARED_SSL_DIR/prod-fullchain.pem"
        cp "$PROD_SSL_DIR/statex.cz/live/$PRODUCTION_DOMAIN/privkey.pem" "$SHARED_SSL_DIR/prod-privkey.pem"
        chmod 644 "$SHARED_SSL_DIR/prod-fullchain.pem"
        chmod 600 "$SHARED_SSL_DIR/prod-privkey.pem"
        echo -e "${GREEN}✅ Production wildcard certificate setup completed${NC}"
    else
        echo -e "${RED}❌ Failed to setup production wildcard certificate${NC}"
        return 1
    fi
}

# Function to setup development wildcard SSL
setup_development_wildcard() {
    echo -e "${YELLOW}🛠️  Setting up development wildcard SSL for *.$DEVELOPMENT_DOMAIN${NC}"
    
    # Install mkcert CA if not already installed
    mkcert -install
    
    # Generate wildcard certificate for localhost
    mkcert -key-file "$DEV_SSL_DIR/localhost/localhost-key.pem" \
           -cert-file "$DEV_SSL_DIR/localhost/localhost-cert.pem" \
           "*.$DEVELOPMENT_DOMAIN" "$DEVELOPMENT_DOMAIN"
    
    # Copy to shared location
    cp "$DEV_SSL_DIR/localhost/localhost-cert.pem" "$SHARED_SSL_DIR/dev-fullchain.pem"
    cp "$DEV_SSL_DIR/localhost/localhost-key.pem" "$SHARED_SSL_DIR/dev-privkey.pem"
    
    chmod 644 "$SHARED_SSL_DIR/dev-fullchain.pem"
    chmod 600 "$SHARED_SSL_DIR/dev-privkey.pem"
    
    echo -e "${GREEN}✅ Development wildcard certificate setup completed${NC}"
}

# Function to setup specific production domains
setup_production_specific() {
    echo -e "${YELLOW}🌐 Setting up specific production domains${NC}"
    
    # Use webroot challenge for specific domains
    docker run --rm \
        -v "$(pwd)/$PROD_SSL_DIR/specific:/etc/letsencrypt" \
        -v "$(pwd)/webroot:/var/www/html" \
        certbot/certbot certonly \
        --webroot \
        -w /var/www/html \
        -d "$PRODUCTION_DOMAIN" \
        -d "www.$PRODUCTION_DOMAIN" \
        -d "api.$PRODUCTION_DOMAIN" \
        --email "$EMAIL" \
        --agree-tos \
        --non-interactive \
        --expand \
        --config-dir /etc/letsencrypt \
        --work-dir /etc/letsencrypt \
        --logs-dir /etc/letsencrypt
    
    echo -e "${GREEN}✅ Specific production domains setup completed${NC}"
}

# Function to create unified certificate for nginx
create_unified_certificates() {
    echo -e "${YELLOW}🔗 Creating unified certificates for nginx...${NC}"
    
    # Create production unified certificate
    if [ -f "$SHARED_SSL_DIR/prod-fullchain.pem" ] && [ -f "$SHARED_SSL_DIR/prod-privkey.pem" ]; then
        cp "$SHARED_SSL_DIR/prod-fullchain.pem" "$SHARED_SSL_DIR/nginx-fullchain.pem"
        cp "$SHARED_SSL_DIR/prod-privkey.pem" "$SHARED_SSL_DIR/nginx-privkey.pem"
        echo -e "${GREEN}✅ Production unified certificate created${NC}"
    fi
    
    # Create development unified certificate
    if [ -f "$SHARED_SSL_DIR/dev-fullchain.pem" ] && [ -f "$SHARED_SSL_DIR/dev-privkey.pem" ]; then
        cp "$SHARED_SSL_DIR/dev-fullchain.pem" "$SHARED_SSL_DIR/nginx-dev-fullchain.pem"
        cp "$SHARED_SSL_DIR/dev-privkey.pem" "$SHARED_SSL_DIR/nginx-dev-privkey.pem"
        echo -e "${GREEN}✅ Development unified certificate created${NC}"
    fi
}

# Function to setup auto-renewal
setup_auto_renewal() {
    echo -e "${YELLOW}🔄 Setting up auto-renewal...${NC}"
    
    # Create renewal script
    cat > "$SSL_BASE_DIR/renewal.sh" << 'EOF'
#!/bin/bash
# Auto-renewal script for StateX SSL certificates

SSL_BASE_DIR="./ssl"
PROD_SSL_DIR="$SSL_BASE_DIR/production"
SHARED_SSL_DIR="$SSL_BASE_DIR/shared"

# Renew production wildcard certificate
if [ -f "$PROD_SSL_DIR/statex.cz/live/statex.cz/fullchain.pem" ]; then
    docker run --rm \
        -v "$(pwd)/$PROD_SSL_DIR/statex.cz:/etc/letsencrypt" \
        -v "$(pwd)/config/cloudflare.ini:/cloudflare.ini" \
        certbot/certbot renew \
        --dns-cloudflare \
        --dns-cloudflare-credentials /cloudflare.ini \
        --config-dir /etc/letsencrypt \
        --work-dir /etc/letsencrypt \
        --logs-dir /etc/letsencrypt
    
    # Update shared certificates
    if [ -f "$PROD_SSL_DIR/statex.cz/live/statex.cz/fullchain.pem" ]; then
        cp "$PROD_SSL_DIR/statex.cz/live/statex.cz/fullchain.pem" "$SHARED_SSL_DIR/prod-fullchain.pem"
        cp "$PROD_SSL_DIR/statex.cz/live/statex.cz/privkey.pem" "$SHARED_SSL_DIR/prod-privkey.pem"
        chmod 644 "$SHARED_SSL_DIR/prod-fullchain.pem"
        chmod 600 "$SHARED_SSL_DIR/prod-privkey.pem"
        echo "Production certificates renewed and updated"
    fi
fi

# Development certificates don't need renewal (mkcert)
echo "SSL renewal check completed"
EOF
    
    chmod +x "$SSL_BASE_DIR/renewal.sh"
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "0 12 * * * cd $(pwd) && ./ssl/renewal.sh") | crontab -
    
    echo -e "${GREEN}✅ Auto-renewal setup completed${NC}"
}

# Function to show status
show_status() {
    echo -e "${YELLOW}📊 SSL Certificate Status:${NC}"
    
    echo -e "\n${BLUE}Production Certificates:${NC}"
    if [ -f "$SHARED_SSL_DIR/prod-fullchain.pem" ]; then
        echo -e "${GREEN}✅ Production wildcard certificate exists${NC}"
        openssl x509 -in "$SHARED_SSL_DIR/prod-fullchain.pem" -text -noout | grep -E "(Subject:|Not Before:|Not After:)"
    else
        echo -e "${RED}❌ Production wildcard certificate not found${NC}"
    fi
    
    echo -e "\n${BLUE}Development Certificates:${NC}"
    if [ -f "$SHARED_SSL_DIR/dev-fullchain.pem" ]; then
        echo -e "${GREEN}✅ Development wildcard certificate exists${NC}"
        openssl x509 -in "$SHARED_SSL_DIR/dev-fullchain.pem" -text -noout | grep -E "(Subject:|Not Before:|Not After:)"
    else
        echo -e "${RED}❌ Development wildcard certificate not found${NC}"
    fi
    
    echo -e "\n${BLUE}Nginx Certificates:${NC}"
    if [ -f "$SHARED_SSL_DIR/nginx-fullchain.pem" ]; then
        echo -e "${GREEN}✅ Nginx production certificate ready${NC}"
    else
        echo -e "${RED}❌ Nginx production certificate not ready${NC}"
    fi
    
    if [ -f "$SHARED_SSL_DIR/nginx-dev-fullchain.pem" ]; then
        echo -e "${GREEN}✅ Nginx development certificate ready${NC}"
    else
        echo -e "${RED}❌ Nginx development certificate not ready${NC}"
    fi
}

# Function to backup certificates
backup_certificates() {
    local backup_dir="$SSL_BASE_DIR/backup/$(date +%Y%m%d_%H%M%S)"
    
    echo -e "${YELLOW}💾 Backing up certificates to $backup_dir...${NC}"
    
    mkdir -p "$backup_dir"
    cp -r "$SSL_BASE_DIR/production" "$backup_dir/"
    cp -r "$SSL_BASE_DIR/development" "$backup_dir/"
    cp -r "$SSL_BASE_DIR/shared" "$backup_dir/"
    
    echo -e "${GREEN}✅ Certificates backed up to $backup_dir${NC}"
}

# Function to show help
show_help() {
    echo -e "${YELLOW}Usage: $0 [options]${NC}"
    echo -e "\nOptions:"
    echo -e "  --setup-production        Setup production wildcard SSL (*.statex.cz)"
    echo -e "  --setup-development       Setup development wildcard SSL (*.localhost)"
    echo -e "  --setup-specific          Setup specific production domains"
    echo -e "  --setup-all              Setup all SSL certificates"
    echo -e "  --status                 Show certificate status"
    echo -e "  --backup                 Backup all certificates"
    echo -e "  --renew                  Renew production certificates"
    echo -e "  --help                   Show this help message"
    echo -e "\nExamples:"
    echo -e "  $0 --setup-development   # Setup development SSL"
    echo -e "  $0 --setup-production    # Setup production SSL"
    echo -e "  $0 --setup-all          # Setup all SSL certificates"
    echo -e "  $0 --status             # Show status"
    echo -e "  $0 --backup             # Backup certificates"
}

# Main script execution
case "$1" in
    --setup-production)
        check_prerequisites
        create_ssl_structure
        setup_production_wildcard
        create_unified_certificates
        setup_auto_renewal
        ;;
    --setup-development)
        check_prerequisites
        create_ssl_structure
        setup_development_wildcard
        create_unified_certificates
        ;;
    --setup-specific)
        check_prerequisites
        create_ssl_structure
        setup_production_specific
        create_unified_certificates
        ;;
    --setup-all)
        check_prerequisites
        create_ssl_structure
        setup_development_wildcard
        setup_production_wildcard
        setup_production_specific
        create_unified_certificates
        setup_auto_renewal
        ;;
    --status)
        show_status
        ;;
    --backup)
        backup_certificates
        ;;
    --renew)
        "$SSL_BASE_DIR/renewal.sh"
        ;;
    --help|*)
        show_help
        ;;
esac

exit 0
