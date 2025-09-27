#!/bin/bash

# Setup local DNS resolution for StateX subdomains
# This script configures the system to use our DNS service for *.localhost domains

set -e

echo "🔧 Setting up local DNS resolution for StateX subdomains..."

# Check if running on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 Detected macOS - configuring dscacheutil"
    
    # Backup original hosts file
    if [ ! -f /etc/hosts.backup ]; then
        sudo cp /etc/hosts /etc/hosts.backup
        echo "✅ Backed up /etc/hosts to /etc/hosts.backup"
    fi
    
    # Add wildcard localhost entry
    if ! grep -q "127.0.0.1 \*.localhost" /etc/hosts; then
        echo "127.0.0.1 *.localhost" | sudo tee -a /etc/hosts
        echo "✅ Added wildcard localhost entry to /etc/hosts"
    else
        echo "ℹ️  Wildcard localhost entry already exists in /etc/hosts"
    fi
    
    # Flush DNS cache
    sudo dscacheutil -flushcache
    sudo killall -HUP mDNSResponder
    echo "✅ Flushed DNS cache"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Detected Linux - configuring systemd-resolved"
    
    # Check if systemd-resolved is available
    if command -v systemd-resolve &> /dev/null; then
        # Configure systemd-resolved
        sudo mkdir -p /etc/systemd/resolved.conf.d
        cat << EOF | sudo tee /etc/systemd/resolved.conf.d/statex.conf
[Resolve]
DNS=127.0.0.1:5353
Domains=~localhost
EOF
        echo "✅ Configured systemd-resolved"
        
        # Restart systemd-resolved
        sudo systemctl restart systemd-resolved
        echo "✅ Restarted systemd-resolved"
    else
        echo "⚠️  systemd-resolved not available, falling back to /etc/hosts"
        
        # Backup original hosts file
        if [ ! -f /etc/hosts.backup ]; then
            sudo cp /etc/hosts /etc/hosts.backup
            echo "✅ Backed up /etc/hosts to /etc/hosts.backup"
        fi
        
        # Add wildcard localhost entry
        if ! grep -q "127.0.0.1 \*.localhost" /etc/hosts; then
            echo "127.0.0.1 *.localhost" | sudo tee -a /etc/hosts
            echo "✅ Added wildcard localhost entry to /etc/hosts"
        else
            echo "ℹ️  Wildcard localhost entry already exists in /etc/hosts"
        fi
    fi
    
else
    echo "❌ Unsupported operating system: $OSTYPE"
    echo "Please manually configure DNS resolution for *.localhost domains"
    exit 1
fi

echo ""
echo "🎉 DNS setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the DNS service: npm start"
echo "2. Test with: nslookup project-test.localhost"
echo "3. Register a subdomain: curl -X POST http://localhost:8053/api/subdomains \\"
echo "   -H 'Content-Type: application/json' \\"
echo "   -d '{\"subdomain\":\"project-test\",\"customerId\":\"customer-123\"}'"
echo ""
echo "To revert changes:"
echo "sudo cp /etc/hosts.backup /etc/hosts"
echo "sudo dscacheutil -flushcache  # macOS"
echo "sudo systemctl restart systemd-resolved  # Linux"

