#!/bin/bash

# Setup script for persistent certificate storage
# This script creates the necessary directories and sets up permissions
# for Let's Encrypt certificate storage on the production server

set -e

CERT_STORAGE_DIR="/opt/statex/letsencrypt"
SSL_DIR="./ssl"
LOG_DIR="./logs"

echo "🔐 Setting up persistent certificate storage..."

# Create certificate storage directory
echo "📁 Creating certificate storage directory: $CERT_STORAGE_DIR"
sudo mkdir -p "$CERT_STORAGE_DIR"
sudo chown -R 1000:1000 "$CERT_STORAGE_DIR"
sudo chmod -R 755 "$CERT_STORAGE_DIR"

# Create local SSL directory for nginx
echo "📁 Creating local SSL directory: $SSL_DIR"
mkdir -p "$SSL_DIR"
chmod 755 "$SSL_DIR"

# Create log directories
echo "📁 Creating log directories: $LOG_DIR"
mkdir -p "$LOG_DIR/nginx"
mkdir -p "$LOG_DIR/certbot"
chmod 755 "$LOG_DIR/nginx"
chmod 755 "$LOG_DIR/certbot"

# Create webroot directory
echo "📁 Creating webroot directory: ./webroot"
mkdir -p "./webroot"
chmod 755 "./webroot"

# Set up proper permissions for the certificate management script
echo "🔧 Setting up certificate management script permissions..."
chmod +x "./scripts/manage-certificates.sh"
# chmod +x "./scripts/generate-self-signed.sh"  # Self-signed cert generation disabled

echo ""
echo "✅ Certificate storage setup completed!"
echo ""
echo "📋 Directory structure:"
echo "   $CERT_STORAGE_DIR  - Persistent Let's Encrypt certificates"
echo "   $SSL_DIR           - Nginx SSL certificates (symlinked from persistent storage)"
echo "   $LOG_DIR           - Application logs"
echo "   ./webroot          - Web root for ACME challenges"
echo ""
echo "🔐 Certificate management features:"
echo "   ✅ Persistent storage across container rebuilds"
echo "   ✅ Automatic certificate renewal"
echo "   ✅ Rate limit protection (reuses existing certificates)"
echo "   ✅ Staging environment fallback"
echo "   ✅ Certificate validation before requesting new ones"
echo ""
echo "🚀 You can now start the production environment with:"
echo "   docker compose -f docker-compose.prod.yml up -d"
