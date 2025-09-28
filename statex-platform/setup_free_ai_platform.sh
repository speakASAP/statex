#!/bin/bash

# StateX Platform Free AI Services Setup Script
# This script sets up free AI services in the platform

echo "🆓 Setting up StateX Platform Free AI Services..."

# Check if we're in the platform directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the statex-platform directory"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

echo "🐳 Starting platform services with free AI..."

# Start the platform services
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Check service health
echo "🔍 Checking service health..."

# Free AI Service (Port 8016)
if curl -s http://localhost:8016/health > /dev/null; then
    echo "✅ Free AI Service (8016) - Ready"
else
    echo "❌ Free AI Service (8016) - Not ready"
fi

# Ollama Service (Port 11434)
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Ollama Service (11434) - Ready"
    
    # Download free models
    echo "📥 Downloading free AI models..."
    echo "   Downloading Llama 2 7B..."
    docker exec statex-platform-ollama-1 ollama pull llama2:7b
    
    echo "   Downloading Mistral 7B..."
    docker exec statex-platform-ollama-1 ollama pull mistral:7b
    
    echo "   Downloading CodeLlama 7B..."
    docker exec statex-platform-ollama-1 ollama pull codellama:7b
    
    echo "✅ AI models downloaded successfully"
else
    echo "❌ Ollama Service (11434) - Not ready"
fi

# Notification Service (Port 8005)
if curl -s http://localhost:8005/health > /dev/null; then
    echo "✅ Notification Service (8005) - Ready"
else
    echo "❌ Notification Service (8005) - Not ready"
fi

# Check available AI models
echo ""
echo "🤖 Available AI Models:"
curl -s http://localhost:8016/models | jq '.models' 2>/dev/null || echo "   Could not fetch model list"

echo ""
echo "🎉 Platform Free AI Services Setup Complete!"
echo ""
echo "📋 Available Services:"
echo "  • Free AI Service: http://localhost:8016"
echo "  • Ollama Service: http://localhost:11434"
echo "  • Notification Service: http://localhost:8005"
echo ""
echo "🔧 To test the workflow:"
echo "  python3 test_free_ai_workflow.py --demo"
echo ""
echo "📊 To view service status:"
echo "  docker compose ps"
echo ""
echo "🛑 To stop services:"
echo "  docker compose down"
