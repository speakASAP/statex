#!/bin/bash

# Setup script for wildcard SSL certificates in production
# This script sets up Let's Encrypt wildcard certificates for dynamic subdomains

set -e

DOMAIN="yourdomain.com"
EMAIL="admin@yourdomain.com"

echo "Setting up wildcard SSL certificates for $DOMAIN"

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install certbot
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install certbot
    fi
fi

# Create credentials file for DNS provider (example for Cloudflare)
cat > /tmp/cloudflare.ini << EOF
dns_cloudflare_email = $EMAIL
dns_cloudflare_api_token = YOUR_CLOUDFLARE_API_TOKEN
EOF

# Request wildcard certificate
echo "Requesting wildcard certificate for *.$DOMAIN"
sudo certbot certonly \
    --dns-cloudflare \
    --dns-cloudflare-credentials /tmp/cloudflare.ini \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d "*.$DOMAIN"

# Set up auto-renewal
echo "Setting up auto-renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "Wildcard SSL certificate setup complete!"
echo "Certificate location: /etc/letsencrypt/live/$DOMAIN/"
echo "Files:"
echo "  - cert.pem (certificate)"
echo "  - privkey.pem (private key)"
echo "  - fullchain.pem (certificate + chain)"

# Clean up
rm /tmp/cloudflare.ini
