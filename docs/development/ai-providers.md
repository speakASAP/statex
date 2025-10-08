# AI Providers Configuration

This document describes how to configure and use different AI providers in the StateX AI Platform.

## Overview

The StateX AI Platform supports multiple AI providers through a unified interface, with automatic fallback mechanisms to ensure reliability. The system prioritizes providers based on availability and performance.

## Supported Providers

### 1. OpenRouter (Primary)

- **Description**: Unified API access to multiple AI models from various providers
- **Status**: Primary provider (highest priority)
- **Models**: Google, Claude, GPT, Gemini, Llama, and many more
- **Pricing**: free tier options

### 2. Ollama (Local)

- **Description**: Local AI models running on your infrastructure
- **Status**: Secondary provider
- **Models**: Llama, Mistral, CodeLlama, and others
- **Pricing**: Free (runs locally)

### 3. Hugging Face

- **Description**: Open-source AI models via Hugging Face Inference API
- **Status**: Tertiary provider
- **Models**: Various open-source models
- **Pricing**: Pay-per-use with free tier

### 4. Mock AI (Fallback)

- **Description**: Realistic simulation for testing and development
- **Status**: Always available fallback
- **Models**: Mock responses
- **Pricing**: Free

## Provider Priority

The system uses the following priority order:

1. **OpenRouter** (if API key provided)
2. **Ollama** (if service available)
3. **Hugging Face** (if API key provided)
4. **Mock AI** (always available)

## Configuration

### Environment Variables

#### OpenRouter Configuration

```bash
# Required
OPENROUTER_API_KEY=your-openrouter-api-key

# Optional (defaults shown)
OPENROUTER_API_BASE=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
OPENROUTER_TIMEOUT=60
```

#### Ollama Configuration

```bash
# Optional (defaults shown)
OLLAMA_URL=http://ollama:11434
```

#### Hugging Face Configuration

```bash
# Required for Hugging Face
HUGGINGFACE_API_KEY=your-huggingface-api-key
```

### Model Selection

#### OpenRouter Models

**Free Models:**

- `google/gemini-2.0-flash-exp:free` - Google Gemini 2.0 Flash (Free)
- `meta-llama/llama-3.1-8b-instruct:free` - Meta Llama 3.1 8B (Free)
- `microsoft/phi-3-mini-128k-instruct:free` - Microsoft Phi-3 Mini (Free)

**Paid Models:**

- `anthropic/claude-3.5-sonnet` - Anthropic Claude 3.5 Sonnet
- `openai/gpt-4o` - OpenAI GPT-4o
- `openai/gpt-4o-mini` - OpenAI GPT-4o Mini
- `meta-llama/llama-3.1-70b-instruct` - Meta Llama 3.1 70B
- `google/gemini-2.0-flash-exp` - Google Gemini 2.0 Flash

**Browse all models**: Visit [OpenRouter Models](https://openrouter.ai/models)

#### Changing Models

To use a different model, update the `OPENROUTER_MODEL` environment variable:

```bash
# For Claude 3.5 Sonnet
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# For GPT-4o
OPENROUTER_MODEL=openai/gpt-4o

# For free Gemini
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

## Service Configuration

### Free AI Service

The `free-ai-service` handles all AI provider interactions and provides a unified interface.

**Endpoints:**

- `POST /analyze` - Main analysis endpoint
- `POST /api/analyze-text` - Compatibility endpoint for NLP Agent
- `GET /health` - Service health check
- `GET /models` - Available models by provider

**Configuration Files:**

- `statex-ai/services/free-ai-service/env.example`
- `statex-ai/docker-compose.dev.yml`

### Multi-Agent Workflow

The AI orchestrator uses the free-ai-service for all AI operations in the multi-agent workflow.

**Workflow Order:**

1. **ASR Agent** (if voice file present)
2. **Document Agent** (if files present)
3. **NLP Agent** (always runs)
4. **Summarizer Agent** (depends on ASR + Document + NLP)
5. **Prototype Agent** (depends on Summarizer Agent)

## Usage Examples

### Testing AI Providers

```bash
# Check service health
curl http://localhost:8016/health

# List available models
curl http://localhost:8016/models

# Test analysis with specific model
curl -X POST http://localhost:8016/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{
    "text_content": "I want to build a web application",
    "analysis_type": "business_analysis"
  }'
```

### Statex Multi-Agent Workflow

```bash
# Start multi-agent analysis
curl -X POST http://localhost:8010/api/multi-agent/process \
  -H "Content-Type: application/json" \
  -d '{
    "submission_id": "test-123",
    "user_id": "user-456",
    "requirements": "I want to build a web application for managing customer orders",
    "analysis_type": "business_analysis"
  }'
```

## Troubleshooting

### Common Issues

1. **OpenRouter Unavailable**
   - Check API key is set correctly
   - Verify API key has sufficient credits
   - Check network connectivity

2. **Model Not Found**
   - Verify model name is correct
   - Check if model is available in your OpenRouter plan
   - Try a different model

3. **Service Unhealthy**
   - Check container logs: `docker compose logs free-ai-service`
   - Verify environment variables are set
   - Restart service: `docker compose restart free-ai-service`

### Debug Commands

```bash
# Check service status
docker compose ps

# View service logs
docker compose logs free-ai-service

# Test provider availability
curl http://localhost:8016/health | jq '.providers'

# Check environment variables
docker compose exec free-ai-service env | grep OPENROUTER
```

## Security Considerations

1. **API Keys**: Never commit real API keys to version control
2. **Environment Files**: Use `.env` files for local development
3. **Production**: Use secure secrets management (Kubernetes Secrets, AWS Secrets Manager, etc.)
4. **Rate Limiting**: Be aware of provider rate limits and costs

## Cost Management

1. **Free Models**: Use free models for development and testing
2. **Paid Models**: Use paid models for production workloads
3. **Monitoring**: Monitor usage and costs through provider dashboards
4. **Fallbacks**: Configure appropriate fallback providers to avoid service interruptions

## Best Practices

1. **Model Selection**: Choose models based on task requirements and budget
2. **Error Handling**: Implement proper error handling and fallbacks
3. **Monitoring**: Monitor service health and performance
4. **Testing**: Test with different models to find optimal performance
5. **Documentation**: Document model choices and reasoning for team members
