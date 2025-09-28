#!/bin/bash

# StateX Platform Setup Script

set -e

echo "🚀 Setting up StateX Platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p data/postgres
mkdir -p data/redis
mkdir -p data/rabbitmq
mkdir -p data/minio
mkdir -p data/elasticsearch
mkdir -p web/ssl
mkdir -p web/static

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp env.example .env
    echo "✅ Environment file created. Please update .env with your configuration."
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOF
# Environment
.env
.env.local
.env.production

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Data
data/
*.db
*.sqlite

# SSL certificates
web/ssl/*.pem
web/ssl/*.key
web/ssl/*.crt

# Docker
.dockerignore

# Coverage
htmlcov/
.coverage
.coverage.*
coverage.xml
*.cover
.hypothesis/
.pytest_cache/

# Security
bandit-report.json
trivy-results.sarif
EOF
fi

# Set up Python virtual environment
echo "🐍 Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

# Create SSL certificates for local development
echo "🔐 Creating SSL certificates for local development..."
if [ ! -f web/ssl/cert.pem ]; then
    openssl req -x509 -newkey rsa:4096 -keyout web/ssl/key.pem -out web/ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    echo "✅ SSL certificates created for local development."
fi

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Run 'make dev' to start the development environment"
echo "3. Visit http://localhost to access the platform"
echo ""
echo "Available commands:"
echo "  make dev          - Start development environment"
echo "  make test         - Run tests"
echo "  make lint         - Run linting"
echo "  make clean        - Clean up containers"
echo "  make logs         - View logs"
echo "  make status       - Check service status"
