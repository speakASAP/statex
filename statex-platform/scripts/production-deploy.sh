#!/bin/bash

# StateX Platform Production Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_TYPE=${1:-"application"}  # web or application
DOMAIN=${2:-"api.statex.cz"}
WEB_DOMAIN=${3:-"statex.cz"}

echo -e "${BLUE}🚀 Deploying StateX Platform to production...${NC}"
echo -e "${BLUE}Server Type: $SERVER_TYPE${NC}"
echo -e "${BLUE}Domain: $DOMAIN${NC}"

# Function to check if running as root
check_root() {
    if [ "$EUID" -eq 0 ]; then
        echo -e "${RED}❌ Please do not run this script as root${NC}"
        exit 1
    fi
}

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    
    # Check if running on supported OS
    if ! command -v apt &> /dev/null && ! command -v yum &> /dev/null; then
        echo -e "${RED}❌ Unsupported operating system${NC}"
        exit 1
    fi
    
    # Check if user has sudo access
    if ! sudo -n true 2>/dev/null; then
        echo -e "${RED}❌ This script requires sudo access${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Function to install system packages
install_packages() {
    echo "📦 Installing system packages..."
    
    if command -v apt &> /dev/null; then
        sudo apt update
        sudo apt install -y curl wget git nginx certbot python3-certbot-nginx ufw
    elif command -v yum &> /dev/null; then
        sudo yum update -y
        sudo yum install -y curl wget git nginx certbot python3-certbot-nginx firewalld
    fi
    
    echo -e "${GREEN}✅ System packages installed${NC}"
}

# Function to install Docker
install_docker() {
    echo "🐳 Installing Docker..."
    
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    
    echo -e "${GREEN}✅ Docker installed${NC}"
}

# Function to deploy web server
deploy_web_server() {
    echo "🌐 Deploying web server for $WEB_DOMAIN..."
    
    # Create web directory
    sudo mkdir -p /var/www/statex
    sudo chown $USER:$USER /var/www/statex
    cd /var/www/statex
    
    # Clone website repository
    if [ ! -d "website" ]; then
        git clone https://github.com/speakASAP/statex.git website
    else
        cd website
        git pull origin main
        cd ..
    fi
    
    # Configure Nginx
    sudo tee /etc/nginx/sites-available/$WEB_DOMAIN > /dev/null <<EOF
server {
    listen 80;
    server_name $WEB_DOMAIN www.$WEB_DOMAIN;
    
    root /var/www/statex/website;
    index index.html index.htm;
    
    location / {
        try_files \$uri \$uri/ =404;
    }
    
    # API proxy to application server
    location /api/ {
        proxy_pass http://$DOMAIN;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/$WEB_DOMAIN /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    
    # Get SSL certificate
    echo "🔐 Setting up SSL certificate..."
    sudo certbot --nginx -d $WEB_DOMAIN -d www.$WEB_DOMAIN --non-interactive --agree-tos --email admin@$WEB_DOMAIN
    
    echo -e "${GREEN}✅ Web server deployed${NC}"
}

# Function to deploy application server
deploy_application_server() {
    echo "⚙️ Deploying application server for $DOMAIN..."
    
    # Create application directory
    sudo mkdir -p /opt/statex-platform
    sudo chown $USER:$USER /opt/statex-platform
    cd /opt/statex-platform
    
    # Clone platform repository
    if [ ! -d ".git" ]; then
        git clone https://github.com/speakASAP/statex-platform.git .
    else
        git pull origin main
    fi
    
    # Set up environment
    if [ ! -f ".env" ]; then
        cp env.example .env
        
        # Generate secure passwords
        DB_PASSWORD=$(openssl rand -base64 32)
        REDIS_PASSWORD=$(openssl rand -base64 32)
        RABBITMQ_PASSWORD=$(openssl rand -base64 32)
        JWT_SECRET=$(openssl rand -base64 64)
        S3_SECRET=$(openssl rand -base64 32)
        
        # Update .env with production values
        sed -i "s/statex_password/$DB_PASSWORD/g" .env
        sed -i "s/dev-secret-key-change-in-production/$JWT_SECRET/g" .env
        sed -i "s/ENVIRONMENT=development/ENVIRONMENT=production/g" .env
        sed -i "s/DEBUG=true/DEBUG=false/g" .env
        sed -i "s/LOG_LEVEL=DEBUG/LOG_LEVEL=INFO/g" .env
    fi
    
    # Deploy with Docker Compose
    echo "🐳 Starting application services..."
    docker-compose up -d
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to start..."
    sleep 60
    
    # Configure Nginx for API
    sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<EOF
upstream statex_api {
    server localhost:8001;
    server localhost:8002;
    server localhost:8003;
    server localhost:8004;
    server localhost:8005;
    server localhost:8006;
    server localhost:8007;
}

server {
    listen 80;
    server_name $DOMAIN;
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # API routes
    location / {
        proxy_pass http://statex_api;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF
    
    # Enable API site
    sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    
    # Get SSL certificate for API
    echo "🔐 Setting up SSL certificate for API..."
    sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    echo -e "${GREEN}✅ Application server deployed${NC}"
}

# Function to set up monitoring
setup_monitoring() {
    echo "📊 Setting up monitoring..."
    
    # Create log directory
    mkdir -p logs
    
    # Set up log rotation
    sudo tee /etc/logrotate.d/statex-platform > /dev/null <<EOF
/opt/statex-platform/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF
    
    # Create health monitoring script
    cat > scripts/health-monitor.sh <<'EOF'
#!/bin/bash
LOG_FILE="/opt/statex-platform/logs/health-monitor.log"

check_service() {
    local service=$1
    local url=$2
    
    if curl -s -f "$url" > /dev/null; then
        echo "$(date): $service is healthy" >> $LOG_FILE
        return 0
    else
        echo "$(date): $service is DOWN" >> $LOG_FILE
        return 1
    fi
}

check_service "API Gateway" "https://api.statex.cz/health"
check_service "Submission Service" "https://api.statex.cz/api/submissions/health"
EOF
    
    chmod +x scripts/health-monitor.sh
    
    # Set up cron job for health monitoring
    (crontab -l 2>/dev/null; echo "*/5 * * * * /opt/statex-platform/scripts/health-monitor.sh") | crontab -
    
    echo -e "${GREEN}✅ Monitoring setup complete${NC}"
}

# Function to set up security
setup_security() {
    echo "🔒 Setting up security..."
    
    # Configure firewall
    if command -v ufw &> /dev/null; then
        sudo ufw --force enable
        sudo ufw allow ssh
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
    elif command -v firewall-cmd &> /dev/null; then
        sudo systemctl start firewalld
        sudo systemctl enable firewalld
        sudo firewall-cmd --permanent --add-service=ssh
        sudo firewall-cmd --permanent --add-service=http
        sudo firewall-cmd --permanent --add-service=https
        sudo firewall-cmd --reload
    fi
    
    # Set up automatic security updates
    if command -v apt &> /dev/null; then
        sudo apt install -y unattended-upgrades
        echo 'Unattended-Upgrade::Automatic-Reboot "false";' | sudo tee -a /etc/apt/apt.conf.d/50unattended-upgrades
    fi
    
    echo -e "${GREEN}✅ Security setup complete${NC}"
}

# Function to run health check
run_health_check() {
    echo "🏥 Running health check..."
    
    if [ "$SERVER_TYPE" = "application" ]; then
        # Check API endpoints
        if curl -s -f "https://$DOMAIN/health" > /dev/null; then
            echo -e "${GREEN}✅ API Gateway is healthy${NC}"
        else
            echo -e "${RED}❌ API Gateway is not responding${NC}"
        fi
        
        if curl -s -f "https://$DOMAIN/api/submissions/health" > /dev/null; then
            echo -e "${GREEN}✅ Submission Service is healthy${NC}"
        else
            echo -e "${RED}❌ Submission Service is not responding${NC}"
        fi
    fi
    
    if [ "$SERVER_TYPE" = "web" ]; then
        # Check web server
        if curl -s -f "https://$WEB_DOMAIN" > /dev/null; then
            echo -e "${GREEN}✅ Web server is healthy${NC}"
        else
            echo -e "${RED}❌ Web server is not responding${NC}"
        fi
    fi
}

# Main deployment logic
main() {
    check_root
    check_prerequisites
    install_packages
    install_docker
    
    case $SERVER_TYPE in
        web)
            deploy_web_server
            ;;
        application)
            deploy_application_server
            setup_monitoring
            setup_security
            ;;
        both)
            deploy_web_server
            deploy_application_server
            setup_monitoring
            setup_security
            ;;
        *)
            echo -e "${RED}❌ Unknown server type: $SERVER_TYPE${NC}"
            echo "Usage: $0 [web|application|both] [api-domain] [web-domain]"
            exit 1
            ;;
    esac
    
    run_health_check
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Update DNS records to point to this server"
    echo "2. Test the deployment: curl https://$DOMAIN/health"
    echo "3. Check logs: docker-compose logs -f"
    echo "4. Monitor services: tail -f logs/health-monitor.log"
    echo ""
    echo "Access URLs:"
    if [ "$SERVER_TYPE" = "web" ] || [ "$SERVER_TYPE" = "both" ]; then
        echo "  🌐 Website: https://$WEB_DOMAIN"
    fi
    if [ "$SERVER_TYPE" = "application" ] || [ "$SERVER_TYPE" = "both" ]; then
        echo "  🔧 API: https://$DOMAIN"
        echo "  📊 Prometheus: http://$DOMAIN:9090"
        echo "  📈 Grafana: http://$DOMAIN:3000"
    fi
}

# Run main function
main "$@"
