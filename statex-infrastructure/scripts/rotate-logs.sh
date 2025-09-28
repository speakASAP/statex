#!/bin/bash

# Log rotation script for StateX Infrastructure
# This script cleans up old log files to prevent disk space issues

set -e

LOG_DIR="./logs"
CERTBOT_LOG_DIR="$LOG_DIR/certbot"
NGINX_LOG_DIR="$LOG_DIR/nginx"

echo "🧹 Starting log rotation for StateX Infrastructure..."

# Clean up old certbot logs (keep only current and 5 most recent)
if [ -d "$CERTBOT_LOG_DIR" ]; then
    echo "📋 Cleaning up certbot logs..."
    cd "$CERTBOT_LOG_DIR"
    
    # Remove old rotated logs (keep only current and 5 most recent)
    ls -t letsencrypt.log.* 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true
    
    # Compress old logs to save space
    find . -name "letsencrypt.log.*" -mtime +1 -exec gzip {} \; 2>/dev/null || true
    
    echo "✅ Certbot logs cleaned up"
    cd - > /dev/null
fi

# Clean up old nginx logs
if [ -d "$NGINX_LOG_DIR" ]; then
    echo "📋 Cleaning up nginx logs..."
    cd "$NGINX_LOG_DIR"
    
    # Remove old rotated logs (keep only current and 5 most recent)
    ls -t *.log.* 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true
    
    # Compress old logs to save space
    find . -name "*.log.*" -mtime +1 -exec gzip {} \; 2>/dev/null || true
    
    echo "✅ Nginx logs cleaned up"
    cd - > /dev/null
fi

# Show current log sizes
echo ""
echo "📊 Current log directory sizes:"
if [ -d "$LOG_DIR" ]; then
    du -sh "$LOG_DIR"/* 2>/dev/null || echo "No log directories found"
else
    echo "No logs directory found"
fi

echo ""
echo "✅ Log rotation completed!"
echo ""
echo "💡 To automate this, add to crontab:"
echo "   0 2 * * * /path/to/statex-infrastructure/scripts/rotate-logs.sh"


