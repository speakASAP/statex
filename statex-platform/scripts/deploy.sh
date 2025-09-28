#!/bin/bash

# StateX Platform Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-development}
REGISTRY=${REGISTRY:-ghcr.io}
IMAGE_NAME=${IMAGE_NAME:-statex/platform}
VERSION=${VERSION:-latest}

echo -e "${BLUE}🚀 Deploying StateX Platform to $ENVIRONMENT environment...${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

if [ "$ENVIRONMENT" = "production" ]; then
    if ! command_exists kubectl; then
        echo -e "${RED}❌ kubectl is not installed${NC}"
        exit 1
    fi
    
    if ! command_exists helm; then
        echo -e "${RED}❌ Helm is not installed${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Function to deploy to development
deploy_development() {
    echo "🐳 Deploying to development environment..."
    
    # Stop existing containers
    echo "🛑 Stopping existing containers..."
    docker-compose down || true
    
    # Build images
    echo "🔨 Building Docker images..."
    docker-compose build --no-cache
    
    # Start services
    echo "🚀 Starting services..."
    docker-compose up -d
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to be ready..."
    sleep 30
    
    # Run health check
    echo "🏥 Running health check..."
    ./scripts/health-check.sh
    
    echo -e "${GREEN}✅ Development deployment completed!${NC}"
}

# Function to deploy to production
deploy_production() {
    echo "☸️ Deploying to production environment..."
    
    # Check if kubeconfig is available
    if [ -z "$KUBECONFIG" ] && [ ! -f ~/.kube/config ]; then
        echo -e "${RED}❌ Kubernetes configuration not found${NC}"
        exit 1
    fi
    
    # Build and push images
    echo "🔨 Building and pushing Docker images..."
    docker buildx build --platform linux/amd64,linux/arm64 \
        -t $REGISTRY/$IMAGE_NAME:$VERSION \
        -t $REGISTRY/$IMAGE_NAME:latest \
        --push .
    
    # Deploy to Kubernetes
    echo "☸️ Deploying to Kubernetes..."
    kubectl apply -f infrastructure/kubernetes/namespaces/
    kubectl apply -f infrastructure/kubernetes/secrets/
    kubectl apply -f infrastructure/kubernetes/configmaps/
    kubectl apply -f infrastructure/kubernetes/services/
    kubectl apply -f infrastructure/kubernetes/deployments/
    kubectl apply -f infrastructure/kubernetes/ingress/
    
    # Wait for deployments to be ready
    echo "⏳ Waiting for deployments to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/submission-service -n statex
    kubectl wait --for=condition=available --timeout=300s deployment/user-portal -n statex
    kubectl wait --for=condition=available --timeout=300s deployment/ai-orchestrator -n statex
    
    # Run health check
    echo "🏥 Running health check..."
    kubectl get pods -n statex
    kubectl get services -n statex
    
    echo -e "${GREEN}✅ Production deployment completed!${NC}"
}

# Function to deploy with Helm
deploy_helm() {
    echo "📦 Deploying with Helm..."
    
    # Add Helm repositories
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo update
    
    # Deploy infrastructure
    echo "🏗️ Deploying infrastructure services..."
    helm upgrade --install postgresql bitnami/postgresql \
        --namespace statex-infrastructure \
        --create-namespace \
        --set auth.postgresPassword=statex_password \
        --set auth.database=statex
    
    helm upgrade --install redis bitnami/redis \
        --namespace statex-infrastructure \
        --create-namespace \
        --set auth.password=statex_password
    
    helm upgrade --install rabbitmq bitnami/rabbitmq \
        --namespace statex-infrastructure \
        --create-namespace \
        --set auth.username=statex \
        --set auth.password=statex_password
    
    # Deploy application
    echo "🚀 Deploying application services..."
    helm upgrade --install statex-platform ./helm/statex-platform \
        --namespace statex \
        --create-namespace \
        --set global.imageTag=$VERSION \
        --set global.environment=production
    
    echo -e "${GREEN}✅ Helm deployment completed!${NC}"
}

# Main deployment logic
case $ENVIRONMENT in
    development)
        deploy_development
        ;;
    production)
        deploy_production
        ;;
    helm)
        deploy_helm
        ;;
    *)
        echo -e "${RED}❌ Unknown environment: $ENVIRONMENT${NC}"
        echo "Usage: $0 [development|production|helm]"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}🎉 Deployment completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Check service status: make status"
echo "2. View logs: make logs"
echo "3. Run health check: make health-check"
echo "4. Access monitoring: make monitor"
