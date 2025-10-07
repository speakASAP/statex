#!/bin/bash

# StateX Kubernetes Production Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
KUBECONFIG=${KUBECONFIG:-$HOME/.kube/config}
NAMESPACE="statex-production"
ENVIRONMENT=${1:-"production"}

echo -e "${BLUE}🚀 Deploying StateX to Kubernetes ($ENVIRONMENT)...${NC}"

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."

    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}❌ kubectl is not installed${NC}"
        exit 1
    fi

    # Check if kubeconfig exists
    if [ ! -f "$KUBECONFIG" ]; then
        echo -e "${RED}❌ Kubernetes config not found at $KUBECONFIG${NC}"
        exit 1
    fi

    # Check if cluster is accessible
    if ! kubectl cluster-info &> /dev/null; then
        echo -e "${RED}❌ Cannot connect to Kubernetes cluster${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Function to setup cert-manager (if not already installed)
setup_cert_manager() {
    echo "🔒 Setting up cert-manager..."

    if ! kubectl get crd certificates.cert-manager.io &> /dev/null; then
        echo "Installing cert-manager..."
        kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
        echo "Waiting for cert-manager to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment --all -n cert-manager
    else
        echo "cert-manager already installed"
    fi
}

# Function to setup NGINX Ingress Controller
setup_ingress_controller() {
    echo "🌐 Setting up NGINX Ingress Controller..."

    if ! kubectl get deployment ingress-nginx-controller -n ingress-nginx &> /dev/null; then
        echo "Installing NGINX Ingress Controller..."
        kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
        echo "Waiting for ingress controller to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment ingress-nginx-controller -n ingress-nginx
    else
        echo "NGINX Ingress Controller already installed"
    fi
}

# Function to create secrets from environment
create_secrets() {
    echo "🔐 Setting up secrets..."

    # Database password
    if [ -n "$DB_PASSWORD" ]; then
        kubectl create secret generic statex-secrets \
            --namespace=$NAMESPACE \
            --from-literal=DB_PASSWORD="$DB_PASSWORD" \
            --dry-run=client -o yaml | kubectl apply -f -
    fi

    # Redis password
    if [ -n "$REDIS_PASSWORD" ]; then
        kubectl patch secret statex-secrets \
            --namespace=$NAMESPACE \
            --type='add' \
            --patch="$(kubectl create secret generic redis-temp --from-literal=REDIS_PASSWORD="$REDIS_PASSWORD" --dry-run=client -o jsonpath='{.data}' | jq -r '.[0]')"

    # Add other secrets as needed
}

# Function to deploy base infrastructure
deploy_infrastructure() {
    echo "🏗️  Deploying base infrastructure..."

    # Create namespace and RBAC
    kubectl apply -k k8s/base/

    # Wait for base resources to be ready
    kubectl wait --for=condition=available --timeout=300s deployment --all -n $NAMESPACE
}

# Function to deploy application
deploy_application() {
    echo "🚀 Deploying StateX application..."

    # Deploy production overlay
    kubectl apply -k k8s/overlays/$ENVIRONMENT/

    # Wait for all deployments to be ready
    kubectl wait --for=condition=available --timeout=600s deployment --all -n $NAMESPACE
}

# Function to verify deployment
verify_deployment() {
    echo "✅ Verifying deployment..."

    # Check all deployments
    kubectl get deployments -n $NAMESPACE

    # Check all services
    kubectl get services -n $NAMESPACE

    # Check ingress
    kubectl get ingress -n $NAMESPACE

    # Check certificate status
    kubectl get certificates -n $NAMESPACE

    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo "🌐 Access your application:"
    echo "  Website: https://statex.cz"
    echo "  API: https://api.statex.cz"
    echo "  Grafana: https://grafana.statex.cz (admin/statex123)"
    echo ""
}

# Main deployment flow
main() {
    check_prerequisites
    setup_cert_manager
    setup_ingress_controller
    deploy_infrastructure
    deploy_application
    verify_deployment
}

# Run main function
main
