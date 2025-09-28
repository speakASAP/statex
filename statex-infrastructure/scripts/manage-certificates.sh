#!/bin/sh

# Certificate Management Script for Let's Encrypt
# This script checks for existing certificates and only requests new ones when needed
# to avoid rate limiting issues during development rebuilds

set -e

DOMAIN=${VIRTUAL_HOST:-statex.cz}
EMAIL=${LETSENCRYPT_EMAIL}
SSL_DIR="/ssl"
LETSENCRYPT_DIR="/etc/letsencrypt"
WEBROOT_DIR="/var/www/html"

# Create necessary directories
mkdir -p "$WEBROOT_DIR/.well-known/acme-challenge"
chmod -R 755 "$WEBROOT_DIR/.well-known"

# Function to check if certificate exists and is valid
check_certificate_exists() {
    local cert_path="$LETSENCRYPT_DIR/live/$DOMAIN/fullchain.pem"
    local key_path="$LETSENCRYPT_DIR/live/$DOMAIN/privkey.pem"
    
    if [ -f "$cert_path" ] && [ -f "$key_path" ]; then
        # Check if certificate is valid and not expired (more than 30 days left)
        if openssl x509 -in "$cert_path" -checkend 2592000 -noout 2>/dev/null; then
            echo "✅ Valid certificate found for $DOMAIN (expires in more than 30 days)"
            return 0
        else
            echo "⚠️  Certificate for $DOMAIN exists but is expired or expires soon"
            return 1
        fi
    else
        echo "❌ No certificate found for $DOMAIN"
        return 1
    fi
}

# Function to copy certificates to nginx ssl directory
copy_certificates() {
    local source_dir="$LETSENCRYPT_DIR/live/$DOMAIN"
    local target_dir="$SSL_DIR"
    
    if [ -d "$source_dir" ]; then
        echo "📋 Copying certificates to nginx ssl directory..."
        cp "$source_dir/fullchain.pem" "$target_dir/" 2>/dev/null || true
        cp "$source_dir/privkey.pem" "$target_dir/" 2>/dev/null || true
        cp "$source_dir/chain.pem" "$target_dir/" 2>/dev/null || true
        
        # Set proper permissions
        chmod 644 "$target_dir/fullchain.pem" 2>/dev/null || true
        chmod 600 "$target_dir/privkey.pem" 2>/dev/null || true
        chmod 644 "$target_dir/chain.pem" 2>/dev/null || true
        
        echo "✅ Certificates copied successfully"
    else
        echo "❌ Source certificate directory not found: $source_dir"
        return 1
    fi
}

# Function to request new certificate
request_new_certificate() {
    echo "🔄 Requesting new certificate for $DOMAIN..."
    
    certbot certonly \
        --webroot \
        -w "$WEBROOT_DIR" \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        -d "api.$DOMAIN" \
        --email "$EMAIL" \
        --agree-tos \
        --non-interactive \
        --expand \
        --force-renewal \
        --staging 2>/dev/null || {
            echo "⚠️  Staging environment failed, trying production..."
            certbot certonly \
                --webroot \
                -w "$WEBROOT_DIR" \
                -d "$DOMAIN" \
                -d "www.$DOMAIN" \
                -d "api.$DOMAIN" \
                --email "$EMAIL" \
                --agree-tos \
                --non-interactive \
                --expand \
                --force-renewal
        }
}

# Function to renew existing certificate
renew_certificate() {
    echo "🔄 Renewing existing certificate for $DOMAIN..."
    certbot renew --webroot -w "$WEBROOT_DIR" --non-interactive
}

# Main logic
echo "🔐 Starting certificate management for $DOMAIN"
echo "📧 Email: $EMAIL"
echo "🌐 Domains: $DOMAIN, www.$DOMAIN, api.$DOMAIN"
echo ""

# Check if certificate already exists and is valid
if check_certificate_exists; then
    echo "✅ Using existing valid certificate"
    copy_certificates
else
    echo "🔄 Certificate needs to be obtained or renewed"
    
    # Try to renew first (in case it's just close to expiry)
    if [ -f "$LETSENCRYPT_DIR/live/$DOMAIN/fullchain.pem" ]; then
        echo "🔄 Attempting to renew existing certificate..."
        if renew_certificate; then
            echo "✅ Certificate renewed successfully"
            copy_certificates
        else
            echo "⚠️  Renewal failed, requesting new certificate..."
            request_new_certificate
            copy_certificates
        fi
    else
        echo "🆕 Requesting new certificate..."
        request_new_certificate
        copy_certificates
    fi
fi

# Start the renewal loop
echo ""
echo "🔄 Starting certificate renewal monitoring..."
echo "⏰ Checking for renewals every 12 hours..."

while true; do
    sleep 43200  # 12 hours
    
    echo "🔄 Checking certificate renewal..."
    if renew_certificate; then
        echo "✅ Certificate renewed successfully"
        copy_certificates
    else
        echo "⚠️  Certificate renewal check completed (no action needed or failed)"
    fi
done
