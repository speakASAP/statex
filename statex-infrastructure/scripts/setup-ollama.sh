#!/bin/bash

# StateX Ollama Setup Script
# This script pulls and configures the required Ollama models for development

set -e

echo "🚀 Setting up Ollama for StateX AI Services..."

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama service to be ready..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "✅ Ollama service is ready!"
        break
    fi
    
    attempt=$((attempt + 1))
    echo "   Attempt $attempt/$max_attempts - waiting for Ollama..."
    sleep 5
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ Ollama service failed to start within timeout"
    exit 1
fi

# Function to pull model with retry
pull_model() {
    local model=$1
    local max_retries=3
    local retry=0
    
    echo "📥 Pulling model: $model"
    
    while [ $retry -lt $max_retries ]; do
        if curl -X POST http://localhost:11434/api/pull \
            -H "Content-Type: application/json" \
            -d "{\"name\": \"$model\"}" \
            --max-time 1800; then  # 30 minute timeout
            echo "✅ Successfully pulled $model"
            return 0
        fi
        
        retry=$((retry + 1))
        echo "⚠️  Failed to pull $model (attempt $retry/$max_retries)"
        
        if [ $retry -lt $max_retries ]; then
            echo "   Retrying in 10 seconds..."
            sleep 10
        fi
    done
    
    echo "❌ Failed to pull $model after $max_retries attempts"
    return 1
}

# Pull required models
echo "📦 Pulling required AI models..."

# Llama 2 7B - General purpose model
pull_model "llama2:7b"

# Mistral 7B - Efficient and capable model
pull_model "mistral:7b"

# CodeLlama 7B - Code-focused model
pull_model "codellama:7b"

# Verify models are available
echo "🔍 Verifying installed models..."
if curl -s http://localhost:11434/api/tags | grep -q "llama2:7b"; then
    echo "✅ llama2:7b is available"
else
    echo "❌ llama2:7b is not available"
fi

if curl -s http://localhost:11434/api/tags | grep -q "mistral:7b"; then
    echo "✅ mistral:7b is available"
else
    echo "❌ mistral:7b is not available"
fi

if curl -s http://localhost:11434/api/tags | grep -q "codellama:7b"; then
    echo "✅ codellama:7b is available"
else
    echo "❌ codellama:7b is not available"
fi

# Test basic functionality
echo "🧪 Testing Ollama functionality..."
test_response=$(curl -s -X POST http://localhost:11434/api/generate \
    -H "Content-Type: application/json" \
    -d '{
        "model": "llama2:7b",
        "prompt": "Hello, how are you?",
        "stream": false,
        "options": {
            "num_predict": 50
        }
    }')

if echo "$test_response" | grep -q "response"; then
    echo "✅ Ollama is working correctly!"
else
    echo "❌ Ollama test failed"
    echo "Response: $test_response"
fi

echo "🎉 Ollama setup completed successfully!"
echo ""
echo "Available models:"
curl -s http://localhost:11434/api/tags | jq '.models[].name' 2>/dev/null || echo "Install jq to see formatted model list"
echo ""
echo "You can now use Ollama at http://localhost:11434"