#!/bin/bash
set -e

echo "Generating initial Let's Encrypt certificates..."

# Set variables with defaults
VIRTUAL_HOST="${VIRTUAL_HOST:-statex.cz}"
LETSENCRYPT_EMAIL="${LETSENCRYPT_EMAIL:-admin@statex.cz}"

echo "Domain: $VIRTUAL_HOST"
echo "Email: $LETSENCRYPT_EMAIL"

# Create webroot directory
mkdir -p /var/www/html/.well-known/acme-challenge

# Generate SSL certificates
certbot certonly --webroot \
  -w /var/www/html \
  -d "$VIRTUAL_HOST" \
  -d "www.$VIRTUAL_HOST" \
  -d "api.$VIRTUAL_HOST" \
  --email "$LETSENCRYPT_EMAIL" \
  --agree-tos \
  --non-interactive \
  --expand

echo "Copying certificates to local SSL directory..."

if [ -f "/etc/letsencrypt/live/$VIRTUAL_HOST/fullchain.pem" ]; then
    cp /etc/letsencrypt/live/"$VIRTUAL_HOST"/fullchain.pem /ssl/fullchain.pem
    cp /etc/letsencrypt/live/"$VIRTUAL_HOST"/privkey.pem /ssl/privkey.pem
    chmod 644 /ssl/fullchain.pem
    chmod 600 /ssl/privkey.pem
    echo "Certificates generated and copied successfully!"
else
    echo "ERROR: Certificates not found in /etc/letsencrypt/live/$VIRTUAL_HOST/"
    exit 1
fi
