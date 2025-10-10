#!/bin/bash

# StateX AI Free AI Services Setup Script
# This script sets up free AI services in the statex-ai microservice

echo "🆓 Setting up StateX AI Free AI Services..."

# Check if we're in the statex-ai directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the statex-ai directory"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

echo "🐳 Starting AI services with free AI..."

# Start the AI services
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 20

# Check service health
echo "🔍 Checking service health..."

# AI Orchestrator (Port 8010)
if curl -s http://localhost:8010/health > /dev/null; then
    echo "✅ AI Orchestrator (8010) - Ready"
else
    echo "❌ AI Orchestrator (8010) - Not ready"
fi

# Free AI Service (Port 8016)
if curl -s http://localhost:8016/health > /dev/null; then
    echo "✅ Free AI Service (8016) - Ready"
else
    echo "❌ Free AI Service (8016) - Not ready"
fi

# Ollama Service (Port 11434) - DISABLED
# if curl -s http://localhost:11434/api/tags > /dev/null; then
#     echo "✅ Ollama Service (11434) - Ready"
#     
#     # Download free models
#     echo "📥 Downloading free AI models..."
#     echo "   Downloading Llama 2 7B..."
#     docker exec statex-ai-ollama-1 ollama pull llama2:7b
#     
#     echo "   Downloading Mistral 7B..."
#     docker exec statex-ai-ollama-1 ollama pull mistral:7b
#     
#     echo "   Downloading CodeLlama 7B..."
#     docker exec statex-ai-ollama-1 ollama pull codellama:7b
#     
#     echo "✅ AI models downloaded successfully"
# else
#     echo "❌ Ollama Service (11434) - Not ready"
# fi

# NLP Service (Port 8011)
if curl -s http://localhost:8011/health > /dev/null; then
    echo "✅ NLP Service (8011) - Ready"
else
    echo "❌ NLP Service (8011) - Not ready"
fi

# ASR Service (Port 8012)
if curl -s http://localhost:8012/health > /dev/null; then
    echo "✅ ASR Service (8012) - Ready"
else
    echo "❌ ASR Service (8012) - Not ready"
fi

# Document AI Service (Port 8013)
if curl -s http://localhost:8013/health > /dev/null; then
    echo "✅ Document AI Service (8013) - Ready"
else
    echo "❌ Document AI Service (8013) - Not ready"
fi

# Prototype Generator (Port 8014)
if curl -s http://localhost:8014/health > /dev/null; then
    echo "✅ Prototype Generator (8014) - Ready"
else
    echo "❌ Prototype Generator (8014) - Not ready"
fi

# Template Repository (Port 8015)
if curl -s http://localhost:8015/health > /dev/null; then
    echo "✅ Template Repository (8015) - Ready"
else
    echo "❌ Template Repository (8015) - Not ready"
fi

# Check available AI models
echo ""
echo "🤖 Available AI Models:"
curl -s http://localhost:8016/models | jq '.models' 2>/dev/null || echo "   Could not fetch model list"

echo ""
echo "🎉 StateX AI Free AI Services Setup Complete!"
echo ""
echo "📋 Available AI Services:"
echo "  • AI Orchestrator: http://localhost:8010"
echo "  • Free AI Service: http://localhost:8016"
echo "  • NLP Service: http://localhost:8011"
echo "  • ASR Service: http://localhost:8012"
echo "  • Document AI: http://localhost:8013"
echo "  • Prototype Generator: http://localhost:8014"
echo "  • Template Repository: http://localhost:8015"
echo "  • Ollama Service: http://localhost:11434"
echo ""
echo "🔧 To test the AI services:"
echo "  curl http://localhost:8016/health"
echo "  curl http://localhost:8016/models"
echo ""
echo "🧪 To test real AI agents performance:"
echo "  python3 test_real_ai_agents.py --demo"
echo ""
echo "📊 To view service status:"
echo "  docker compose ps"
echo ""
echo "🛑 To stop services:"
echo "  docker compose down"
