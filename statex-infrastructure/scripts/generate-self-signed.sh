#!/bin/sh

# Generate self-signed certificates for development
echo "Generating self-signed certificates for development..."

# Determine SSL directory (local or container)
if [ -d "./ssl-dev" ]; then
    SSL_DIR="./ssl-dev"
elif [ -d "/ssl" ]; then
    SSL_DIR="/ssl"
else
    SSL_DIR="./ssl-dev"
    mkdir -p "$SSL_DIR"
fi

echo "Using SSL directory: $SSL_DIR"

# Generate private key
openssl genrsa -out "$SSL_DIR/privkey.pem" 2048

# Generate certificate signing request
openssl req -new -key "$SSL_DIR/privkey.pem" -out "$SSL_DIR/cert.csr" -subj "/C=CZ/ST=Prague/L=Prague/O=StateX/OU=Development/CN=localhost/emailAddress=admin@localhost"

# Generate self-signed certificate
openssl x509 -req -days 365 -in "$SSL_DIR/cert.csr" -signkey "$SSL_DIR/privkey.pem" -out "$SSL_DIR/fullchain.pem"

# Create chain file (same as fullchain for self-signed)
cp "$SSL_DIR/fullchain.pem" "$SSL_DIR/chain.pem"

# Set proper permissions
chmod 600 "$SSL_DIR/privkey.pem"
chmod 644 "$SSL_DIR/fullchain.pem"
chmod 644 "$SSL_DIR/chain.pem"

# Clean up CSR file
rm "$SSL_DIR/cert.csr"

echo "Self-signed certificates generated successfully!"
echo "Certificate files:"
echo "  - privkey.pem (private key)"
echo "  - fullchain.pem (certificate + chain)"
echo "  - chain.pem (certificate chain)"
echo ""
echo "You can now access the application at:"
echo "  - http://localhost (HTTP)"
echo "  - https://localhost (HTTPS with self-signed certificate)"
echo ""
echo "Note: Your browser will show a security warning for the self-signed certificate."
echo "This is normal for development. Click 'Advanced' and 'Proceed to localhost' to continue."
