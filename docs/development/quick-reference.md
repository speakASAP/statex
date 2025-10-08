# Quick Reference Guide

This guide provides quick access to common tasks and configurations in the StateX AI Platform.

## AI Provider Quick Setup

### OpenRouter (Recommended)

```bash
# 1. Get API key from https://openrouter.ai/
# 2. Set environment variables
export OPENROUTER_API_KEY="your-api-key"
export OPENROUTER_MODEL="google/gemini-2.0-flash-exp:free"

# 3. Restart services
docker compose -f statex-ai/docker-compose.dev.yml restart free-ai-service
```

### Model Selection

```bash
# Free models
OPENROUTER_MODEL="google/gemini-2.0-flash-exp:free"
OPENROUTER_MODEL="meta-llama/llama-3.1-8b-instruct:free"

# Paid models
OPENROUTER_MODEL="anthropic/claude-3.5-sonnet"
OPENROUTER_MODEL="openai/gpt-4o"
```

## Multi-Agent Workflow

### Start Workflow

```bash
curl -X POST http://localhost:8010/api/multi-agent/process \
  -H "Content-Type: application/json" \
  -d '{
    "submission_id": "test-123",
    "user_id": "user-456",
    "requirements": "I want to build a web application",
    "analysis_type": "business_analysis"
  }'
```

### Check Status

```bash
curl http://localhost:8010/api/multi-agent/workflow/test-123
```

### Check Agent Health

```bash
curl http://localhost:8010/api/multi-agent/agents/health
```

## Service Health Checks

```bash
# AI Orchestrator
curl http://localhost:8010/health

# Free AI Service
curl http://localhost:8016/health

# All AI Services
curl http://localhost:8016/models
```

## Common Commands

### Docker Management

```bash
# Start all services
docker compose -f statex-ai/docker-compose.dev.yml up -d

# Restart specific service
docker compose -f statex-ai/docker-compose.dev.yml restart free-ai-service

# View logs
docker compose -f statex-ai/docker-compose.dev.yml logs free-ai-service

# Check status
docker compose -f statex-ai/docker-compose.dev.yml ps
```

### Environment Setup

```bash
# Copy environment templates
cp statex-ai/env.example statex-ai/.env
cp statex-ai/services/free-ai-service/env.example statex-ai/services/free-ai-service/.env

# Edit with your API keys
nano statex-ai/.env
```

## Troubleshooting

### Service Not Starting

```bash
# Check logs
docker compose logs service-name

# Check environment variables
docker compose exec service-name env | grep OPENROUTER

# Restart with rebuild
docker compose up --build service-name
```

### Workflow Issues

```bash
# Check orchestrator logs
docker compose logs ai-orchestrator | grep "workflow"

# Check agent health
curl http://localhost:8010/api/multi-agent/agents/health

# Restart orchestrator
docker compose restart ai-orchestrator
```

### AI Provider Issues

```bash
# Test AI service
curl -X POST http://localhost:8016/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"text_content": "test", "analysis_type": "business_analysis"}'

# Check provider status
curl http://localhost:8016/health | jq '.providers'
```

## Configuration Files

### Key Files

- `statex-ai/.env` - Main AI services configuration
- `statex-ai/docker-compose.dev.yml` - Docker services configuration
- `statex-ai/services/free-ai-service/.env` - Free AI service configuration

### Environment Variables

```bash
# Multi-Agent Workflow
USE_MULTI_AGENT_WORKFLOW=true

# OpenRouter
OPENROUTER_API_KEY=your-api-key
OPENROUTER_API_BASE=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free

# Service URLs
AI_ORCHESTRATOR_URL=http://ai-orchestrator:8000
SUBMISSION_SERVICE_URL=http://submission-service:8002
```

## API Endpoints

### Statex Multi-Agent Workflow

- `POST /api/multi-agent/process` - Start workflow
- `GET /api/multi-agent/workflow/{id}` - Check status
- `GET /api/multi-agent/agents/health` - Agent health

### Free AI Service

- `POST /analyze` - Main analysis endpoint
- `POST /api/analyze-text` - NLP compatibility
- `GET /health` - Service health
- `GET /models` - Available models

### Submission Service

- `POST /api/submissions/{id}/summary` - Save summary
- `GET /api/submissions/{id}` - Get submission

## Workflow Order

1. **ASR Agent** (if voice file)
2. **Document Agent** (if files)
3. **NLP Agent** (always)
4. **Summarizer Agent** (depends on 1-3)
5. **Prototype Agent** (depends on 4)

## File Locations

### Summary Files

- Location: `statex-website/services/submission-service/data/uploads/{user_id}/sess_{timestamp}_{session_id}/`
- Files: `form_data.md`, `summary.md`

### Logs

- AI Orchestrator: `docker compose logs ai-orchestrator`
- Free AI Service: `docker compose logs free-ai-service`
- All Services: `docker compose logs`

## Performance Tips

1. **Use Free Models** for development and testing
2. **Monitor Resource Usage** with `docker stats`
3. **Check Service Health** regularly
4. **Use Appropriate Timeouts** for different agents
5. **Implement Caching** for repeated operations

## Security Notes

1. **Never commit API keys** to version control
2. **Use environment files** for local development
3. **Use secrets management** for production
4. **Monitor API usage** and costs
5. **Implement rate limiting** for production use
