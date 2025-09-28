#!/bin/bash

# StateX Infrastructure Deployment Script

set -e

echo "🚀 Deploying StateX Infrastructure..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Load environment variables
source .env

# Create external network if it doesn't exist
echo "📡 Creating external network..."
docker network create statex_network 2>/dev/null || echo "Network already exists"

# Create SSL volume if it doesn't exist
echo "🔐 Creating SSL volume..."
docker volume create statex_ssl_data 2>/dev/null || echo "SSL volume already exists"

# Deploy infrastructure
echo "🐳 Starting infrastructure services..."
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
docker compose ps

echo "✅ StateX Infrastructure deployed successfully!"
echo ""
echo "🌐 Services available at:"
echo "  - Website: https://${VIRTUAL_HOST}"
echo "  - API: https://api.${VIRTUAL_HOST}"
echo "  - WWW redirect: https://www.${VIRTUAL_HOST}"
echo ""
echo "📊 To view logs: docker compose logs -f"
echo "🛑 To stop: docker compose down"
