#!/bin/bash

echo "🚀 Setting up production environment..."

# Check if .env.production already exists
if [ -f .env.production ]; then
    echo "Warning: .env.production already exists!"
    echo "This script will not overwrite your existing production environment file."
    echo "If you want to create a new one, please backup and remove the existing file first."
    exit 1
fi

# Create .env.production from template
cp .env.example .env.production

# Set production-specific environment variables
echo "⚙️  Configuring production environment variables..."
# Use portable sed for macOS/Linux
if sed --version >/dev/null 2>&1; then
  sed -i 's/ENV=development/ENV=production/' .env.production
  sed -i 's/DEBUG=true/DEBUG=false/' .env.production
else
  sed -i '' 's/ENV=development/ENV=production/' .env.production
  sed -i '' 's/DEBUG=true/DEBUG=false/' .env.production
fi

# Ensure REDIS_PASSWORD exists (for redis healthcheck)
if ! grep -q '^REDIS_PASSWORD=' .env.production; then
  echo "REDIS_PASSWORD=$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 24)" >> .env.production
  echo "🔑 Added REDIS_PASSWORD to .env.production"
fi

# Update SSL configuration
echo "🔒 Configuring SSL settings..."
if sed --version >/dev/null 2>&1; then
  sed -i '/^DEFAULT_HOST=/c\DEFAULT_HOST=statex.cz' .env.production
  sed -i '/^VIRTUAL_HOST=/c\VIRTUAL_HOST=statex.cz' .env.production
  sed -i '/^LETSENCRYPT_HOST=/c\LETSENCRYPT_HOST=statex.cz' .env.production
  sed -i '/^LETSENCRYPT_EMAIL=/c\LETSENCRYPT_EMAIL=admin@statex.cz' .env.production
  sed -i '/^ALLOW_SELF_SIGNED=/c\ALLOW_SELF_SIGNED=false' .env.production
  sed -i '/^SSL_MODE=/c\SSL_MODE=production' .env.production
else
  sed -i '' '/^DEFAULT_HOST=/c\
DEFAULT_HOST=statex.cz' .env.production
  sed -i '' '/^VIRTUAL_HOST=/c\
VIRTUAL_HOST=statex.cz' .env.production
  sed -i '' '/^LETSENCRYPT_HOST=/c\
LETSENCRYPT_HOST=statex.cz' .env.production
  sed -i '' '/^LETSENCRYPT_EMAIL=/c\
LETSENCRYPT_EMAIL=admin@statex.cz' .env.production
  sed -i '' '/^ALLOW_SELF_SIGNED=/c\
ALLOW_SELF_SIGNED=false' .env.production
  sed -i '' '/^SSL_MODE=/c\
SSL_MODE=production' .env.production
fi

# Generate and update a secure random secret key using dedicated script
echo "🔑 Generating secure secret key..."
./scripts/update_secret_key.sh production

echo "✅ Production environment file has been created!"

# Create SSL data structure for Let's Encrypt persistence
echo "🔒 Setting up SSL data structure..."

# Create SSL directories if they don't exist
mkdir -p ssl-data/{certs,vhost.d,html,acme}
mkdir -p ssl

# Ensure safe permissions (do not change ownership by default)
echo "🔧 Enforcing maximum SSL security (root:root, strict perms)..."
if command -v sudo >/dev/null 2>&1; then
    # Ownership root:root
    sudo chown -R root:root ssl-data ssl 2>/dev/null || true
    # Directories 755
    sudo find ssl-data -type d -exec chmod 755 {} \; 2>/dev/null || true
    sudo find ssl -type d -exec chmod 755 {} \; 2>/dev/null || true
    # Keys 600, certs 644
    sudo find ssl-data -type f -name '*.key' -exec chmod 600 {} \; 2>/dev/null || true
    sudo find ssl -type f -name '*.key' -exec chmod 600 {} \; 2>/dev/null || true
    sudo find ssl-data -type f \( -name '*.crt' -o -name '*.pem' \) -exec chmod 644 {} \; 2>/dev/null || true
    sudo find ssl -type f \( -name '*.crt' -o -name '*.pem' \) -exec chmod 644 {} \; 2>/dev/null || true
else
    echo "⚠️  sudo not found. Applying best-effort permissions without ownership change..."
    find ssl-data -type d -exec chmod 755 {} \; 2>/dev/null || true
    find ssl -type d -exec chmod 755 {} \; 2>/dev/null || true
    find ssl-data -type f -name '*.key' -exec chmod 600 {} \; 2>/dev/null || true
    find ssl -type f -name '*.key' -exec chmod 600 {} \; 2>/dev/null || true
    find ssl-data -type f \( -name '*.crt' -o -name '*.pem' \) -exec chmod 644 {} \; 2>/dev/null || true
    find ssl -type f \( -name '*.crt' -o -name '*.pem' \) -exec chmod 644 {} \; 2>/dev/null || true
fi

OWNER_INFO_SD=$(stat -c "%U:%G" ssl-data 2>/dev/null || stat -f "%Su:%Sg" ssl-data 2>/dev/null || echo "unknown")
OWNER_INFO_SSL=$(stat -c "%U:%G" ssl 2>/dev/null || stat -f "%Su:%Sg" ssl 2>/dev/null || echo "unknown")
echo "ℹ️  ssl-data owner: $OWNER_INFO_SD"
echo "ℹ️  ssl owner: $OWNER_INFO_SSL"

echo "✅ SSL data structure created:"
echo "   - ssl-data/certs/    (SSL certificates and keys)"
echo "   - ssl-data/vhost.d/  (Virtual host configurations)"
echo "   - ssl-data/html/     (ACME HTTP-01 challenge files)"
echo "   - ssl-data/acme/     (Let's Encrypt account data - PERSISTENCE FIX!)"

echo ""
echo "🎉 Production environment setup completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Review and update values in .env.production if needed"
echo "   2. Switch to production: ./scripts/switch_env.sh production"
echo "   3. SSL certificates will be automatically managed by Let's Encrypt"
echo ""
echo "⚠️  IMPORTANT: Keep a secure backup of .env.production file!"
echo "💾 The ssl-data/ directory will persist SSL certificates between deployments"

# SSL certificates will be managed by the Docker setup
echo "🔒 SSL certificates will be managed by the Docker setup using the \${VIRTUAL_HOST}_ssl_data volume" 