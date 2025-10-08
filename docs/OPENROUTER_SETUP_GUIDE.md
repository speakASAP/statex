# OpenRouter Integration Setup Guide

## Overview

This guide explains how to set up and configure OpenRouter as an AI provider in the StateX platform. OpenRouter provides access to multiple AI models through a unified API, including Claude, GPT-4, and other advanced models.

> **Note**: For comprehensive AI provider documentation, see [AI Providers Configuration](development/ai-providers.md)  
> **Note**: For multi-agent workflow details, see [Multi-Agent Workflow System](development/multi-agent-workflow.md)

## Prerequisites

1. OpenRouter account and API key
2. StateX platform running in development or production mode
3. Access to environment configuration files

## Getting Your OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to the API Keys section in your dashboard
4. Generate a new API key
5. Copy the API key for configuration

## Environment Configuration

### 1. AI Services Environment

Add the following variables to your AI services environment file:

```bash
# OpenRouter Configuration
OPENROUTER_API_KEY=your-openrouter-api-key-here
OPENROUTER_API_BASE=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
OPENROUTER_TIMEOUT=60
```

**Model Selection:**
You can change `OPENROUTER_MODEL` to any model supported by OpenRouter:

- **Free Models**: `google/gemini-2.0-flash-exp:free`, `meta-llama/llama-3.1-8b-instruct:free`
- **Paid Models**: `anthropic/claude-3.5-sonnet`, `openai/gpt-4o`, `openai/gpt-4o-mini`
- **Browse all models**: Visit [OpenRouter Models](https://openrouter.ai/models) for the complete list

### 2. Docker Compose Configuration

For Docker-based deployments, add these environment variables to your `docker-compose.dev.yml`:

```yaml
services:
  free-ai-service:
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - OPENROUTER_API_BASE=${OPENROUTER_API_BASE:-https://openrouter.ai/api/v1}
      - OPENROUTER_MODEL=${OPENROUTER_MODEL:-anthropic/claude-3.5-sonnet}
```

### 3. Local Development

For local development, create a `.env` file in the `statex-ai` directory:

```bash
# Copy from env.example and update with your actual values
cp statex-ai/env.example statex-ai/.env
```

Then edit the `.env` file with your OpenRouter credentials.

## Available Models

The following models are configured and available through OpenRouter:

### Business Analysis

- `anthropic/claude-3.5-sonnet` (Default)
- `openai/gpt-4o`
- `meta-llama/llama-3.1-70b-instruct`

### Technical Analysis

- `anthropic/claude-3.5-sonnet` (Default)
- `openai/gpt-4o`
- `meta-llama/llama-3.1-70b-instruct`

### Content Generation

- `anthropic/claude-3.5-sonnet` (Default)
- `openai/gpt-4o`
- `meta-llama/llama-3.1-70b-instruct`

### Sentiment Analysis

- `anthropic/claude-3.5-sonnet` (Default)
- `openai/gpt-4o`

## Model Selection

You can specify a different model by setting the `OPENROUTER_MODEL` environment variable:

```bash
# Use GPT-4o instead of Claude
OPENROUTER_MODEL=openai/gpt-4o

# Use Llama 3.1 70B
OPENROUTER_MODEL=meta-llama/llama-3.1-70b-instruct
```

## Provider Priority

The system uses the following priority order for AI providers:

1. **OpenRouter** (if API key is provided)
2. **Ollama** (local models)
3. **Hugging Face** (free models)
4. **Mock AI** (fallback for testing)

## Testing the Integration

### 1. Health Check

Verify that OpenRouter is available:

```bash
curl http://localhost:8016/health
```

### 2. Model List

Check available models:

```bash
curl http://localhost:8016/models
```

### 3. Test Analysis

Test the OpenRouter integration:

```bash
curl -X POST http://localhost:8016/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text_content": "I want to build a web application for my business",
    "analysis_type": "business_analysis",
    "user_name": "Test User",
    "provider": "openrouter"
  }'
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the API key is correct
   - Check that the key has sufficient credits
   - Ensure the key is not expired

2. **Model Not Available**
   - Check if the model name is correct
   - Verify the model is available in your OpenRouter plan
   - Try a different model from the available list

3. **Rate Limiting**
   - OpenRouter has rate limits based on your plan
   - The system will automatically fall back to other providers
   - Consider upgrading your OpenRouter plan for higher limits

4. **Timeout Issues**
   - Increase `OPENROUTER_TIMEOUT` if requests are timing out
   - Check your network connection
   - Verify OpenRouter service status

### Debug Mode

Enable debug logging to troubleshoot issues:

```bash
LOG_LEVEL=DEBUG
```

## Security Considerations

1. **API Key Protection**
   - Never commit API keys to version control
   - Use environment variables for all sensitive data
   - Rotate API keys regularly

2. **Network Security**
   - Use HTTPS in production
   - Consider using a VPN for additional security
   - Monitor API usage for unusual patterns

## Cost Management

1. **Monitor Usage**
   - Check your OpenRouter dashboard regularly
   - Set up billing alerts
   - Monitor token usage in logs

2. **Optimize Requests**
   - Use appropriate model sizes for tasks
   - Implement request caching where possible
   - Consider using local models for simple tasks

## Production Deployment

For production deployment:

1. Set up proper environment variable management
2. Use a secrets management system
3. Configure monitoring and alerting
4. Set up proper logging and audit trails
5. Implement rate limiting and request queuing

## Support

For issues related to:

- **OpenRouter API**: Contact OpenRouter support
- **StateX Integration**: Check the logs and documentation
- **Model Performance**: Try different models or adjust parameters

## Example Configuration Files

### Complete .env Example

```bash
# StateX AI Platform Environment Configuration

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/statex_ai

# Redis
REDIS_URL=redis://localhost:6379

# AI Services
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# OpenRouter Configuration
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_API_BASE=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free

# Multi-Agent Workflow
USE_MULTI_AGENT_WORKFLOW=true

# Service URLs
NLP_SERVICE_URL=http://localhost:8011
ASR_SERVICE_URL=http://localhost:8012
DOCUMENT_AI_URL=http://localhost:8013
PROTOTYPE_GENERATOR_URL=http://localhost:8014
TEMPLATE_REPOSITORY_URL=http://localhost:8015
SUBMISSION_SERVICE_URL=http://localhost:8002
FREE_AI_SERVICE_URL=http://localhost:8016

# Storage
S3_ENDPOINT=your-s3-endpoint
S3_ACCESS_KEY=your-s3-access-key
S3_SECRET_KEY=your-s3-secret-key
S3_BUCKET=statex-ai-files

# Template Repository
TEMPLATE_GIT_REPO=https://github.com/speakASAP/statex-templates.git

# Deployment
DEPLOYMENT_URL=https://prototypes.statex.cz

# Admin Panel
NEXT_PUBLIC_API_URL=http://localhost:8010
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:8010
```

This completes the OpenRouter integration setup. The system will now use OpenRouter as the primary AI provider when available, with automatic fallback to other providers if needed.
