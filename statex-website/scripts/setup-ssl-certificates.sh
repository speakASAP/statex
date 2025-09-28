#!/bin/bash

# SSL Certificate Setup Script for StateX Platform
# Handles both development and production SSL certificate generation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CERT_DIR="./certificates"
DOMAIN="localhost"
WILDCARD_DOMAIN="*.localhost"

echo -e "${BLUE}🔐 StateX SSL Certificate Setup${NC}"
echo "=================================="

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo -e "${RED}❌ mkcert is not installed${NC}"
    echo "Please install mkcert first:"
    echo "  macOS: brew install mkcert"
    echo "  Linux: https://github.com/FiloSottile/mkcert#installation"
    exit 1
fi

# Create certificates directory
echo -e "${YELLOW}📁 Creating certificates directory...${NC}"
mkdir -p "$CERT_DIR"

# Install mkcert CA if not already installed
echo -e "${YELLOW}🔑 Installing mkcert CA...${NC}"
mkcert -install

# Generate development certificates
echo -e "${YELLOW}📜 Generating development certificates...${NC}"
mkcert -key-file "$CERT_DIR/localhost-key.pem" \
       -cert-file "$CERT_DIR/localhost-cert.pem" \
       "$WILDCARD_DOMAIN" "$DOMAIN"

# Set proper permissions
chmod 600 "$CERT_DIR/localhost-key.pem"
chmod 644 "$CERT_DIR/localhost-cert.pem"

echo -e "${GREEN}✅ SSL certificates generated successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Certificate Details:${NC}"
echo "  Certificate: $CERT_DIR/localhost-cert.pem"
echo "  Private Key: $CERT_DIR/localhost-key.pem"
echo "  Valid for: $WILDCARD_DOMAIN, $DOMAIN"
echo "  Expires: $(openssl x509 -in "$CERT_DIR/localhost-cert.pem" -noout -enddate | cut -d= -f2)"
echo ""

# Check if wildcard DNS is configured
echo -e "${YELLOW}🌐 Checking DNS configuration...${NC}"
if grep -q "127.0.0.1.*\*\.localhost" /etc/hosts 2>/dev/null; then
    echo -e "${GREEN}✅ Wildcard DNS already configured in /etc/hosts${NC}"
else
    echo -e "${YELLOW}⚠️  Wildcard DNS not found in /etc/hosts${NC}"
    echo "Please add this line to /etc/hosts:"
    echo "  127.0.0.1 *.localhost"
    echo ""
    echo "Or run:"
    echo "  echo '127.0.0.1 *.localhost' | sudo tee -a /etc/hosts"
fi

echo ""
echo -e "${GREEN}🚀 Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📖 Usage Instructions:${NC}"
echo ""
echo -e "${YELLOW}Development (npm):${NC}"
echo "  cd frontend && npm run dev:https"
echo ""
echo -e "${YELLOW}Development (Docker):${NC}"
echo "  docker-compose -f docker-compose.frontend-https.yml up"
echo ""
echo -e "${YELLOW}Production (Docker):${NC}"
echo "  docker build -f frontend/Dockerfile.https -t statex-frontend-https ."
echo "  docker run -p 3000:3000 -v \$(pwd)/certificates:/app/certificates statex-frontend-https"
echo ""
echo -e "${BLUE}🌐 Test URLs:${NC}"
echo "  https://localhost:3000/"
echo "  https://project-test.localhost:3000/"
echo "  https://project-customer123.localhost:3000/plan"
echo "  https://project-customer456.localhost:3000/offer"
echo ""
echo -e "${GREEN}✨ All set! Your dynamic subdomains are ready with SSL!${NC}"

