# Multi-Agent Workflow System

This document describes the multi-agent workflow system in the StateX AI Platform, including agent types, workflow orchestration, and implementation details.

## Overview

The multi-agent workflow system processes customer requests through specialized AI agents that work together to provide comprehensive analysis and solutions. Each agent has a specific role and the system orchestrates their execution based on dependencies and data availability.

## Architecture

### Core Components

1. **AI Orchestrator**: Central coordinator that manages workflow execution
2. **Agent Interface**: Standardized interface for all AI agents
3. **Workflow Engine**: Handles task scheduling and dependency management
4. **Service Integration**: HTTP-based communication between services

### Agent Types

#### 1. ASR Agent (Automatic Speech Recognition)

- **Purpose**: Converts voice files to text
- **Dependencies**: None
- **Input**: Voice file URL
- **Output**: Transcript text
- **Service**: `asr-service:8012`

#### 2. Document Agent

- **Purpose**: Analyzes uploaded documents
- **Dependencies**: None
- **Input**: Document file URLs
- **Output**: Extracted text and analysis
- **Service**: `document-ai:8013`

#### 3. NLP Agent (Natural Language Processing)

- **Purpose**: Analyzes text content for business insights
- **Dependencies**: None
- **Input**: Text content
- **Output**: Business analysis, recommendations, technical specs
- **Service**: `free-ai-service:8016` (via `/api/analyze-text`)

#### 4. Summarizer Agent

- **Purpose**: Aggregates all analysis results into comprehensive summary
- **Dependencies**: ASR + Document + NLP agents
- **Input**: Collected data from all previous agents
- **Output**: Summary text and insights
- **Service**: `free-ai-service:8016` (via NLP service)

#### 5. Prototype Agent

- **Purpose**: Generates prototype based on analysis and summary
- **Dependencies**: Summarizer Agent
- **Input**: Requirements + Summary + Analysis
- **Output**: Prototype code and documentation
- **Service**: `prototype-generator:8014`

## Workflow Execution

### Business Analysis Workflow

The primary workflow for processing customer requests follows this sequence:

```text
1. ASR Agent (if voice file) ──┐
2. Document Agent (if files) ──┼
3. NLP Agent (always) ─────────┘
4. Summarizer Agent
5. Prototype Agent
```

### Workflow Phases

#### Phase 1: Data Collection

- ASR Agent processes voice files
- Document Agent extracts text from documents
- NLP Agent analyzes text requirements

#### Phase 2: Analysis Synthesis

- Summarizer Agent aggregates all findings
- Creates comprehensive summary of requirements and insights
- Identifies key technical and business recommendations

#### Phase 3: Solution Generation

- Prototype Agent uses summary to generate solution
- Creates code, documentation, and implementation plan
- Provides actionable next steps

## Configuration

### Environment Variables

```bash
# Multi-Agent Workflow
USE_MULTI_AGENT_WORKFLOW=true

# Service URLs
AI_ORCHESTRATOR_URL=http://ai-orchestrator:8000
SUBMISSION_SERVICE_URL=http://submission-service:8002
NLP_SERVICE_URL=http://free-ai-service:8016
ASR_SERVICE_URL=http://asr-service:8012
DOCUMENT_SERVICE_URL=http://document-ai:8013
PROTOTYPE_SERVICE_URL=http://prototype-generator:8014
```

### Service Dependencies

```yaml
# docker-compose.dev.yml
services:
  ai-orchestrator:
    depends_on:
      - free-ai-service
      - asr-service
      - document-ai
      - prototype-generator
      - submission-service
```

## API Endpoints

### Multi-Agent Workflow

#### Start Workflow

```http
POST /api/multi-agent/process
Content-Type: application/json

{
  "submission_id": "string",
  "user_id": "string",
  "requirements": "string",
  "analysis_type": "business_analysis",
  "voice_file_url": "string (optional)",
  "file_urls": ["string"] (optional)
}
```

**Response:**

```json
{
  "submission_id": "string",
  "status": "processing",
  "message": "Multi-agent workflow started",
  "workflow_type": "business_analysis",
  "estimated_completion_time": "2-5 minutes"
}
```

#### Check Workflow Status

```http
GET /api/multi-agent/workflow/{workflow_id}
```

**Response:**

```json
{
  "workflow_id": "string",
  "status": "completed|processing|failed",
  "progress": 85,
  "current_task": "Summarizer Agent",
  "completed_tasks": ["ASR Agent", "Document Agent", "NLP Agent"],
  "results": {
    "summary": "string",
    "prototype": "string",
    "recommendations": ["string"]
  }
}
```

### Agent Health Check

```http
GET /api/multi-agent/agents/health
```

**Response:**

```json
{
  "total_agents": 5,
  "healthy_agents": 5,
  "degraded_agents": 0,
  "offline_agents": 0,
  "overall_health": "healthy",
  "agents": {
    "asr": "healthy",
    "document": "healthy",
    "nlp": "healthy",
    "summarizer": "healthy",
    "prototype": "healthy"
  }
}
```

## Data Flow

### Input Processing

1. Customer submits form with requirements
2. Files are uploaded and stored
3. Submission service triggers AI orchestrator
4. Orchestrator creates workflow tasks

### Agent Execution

1. Tasks are queued based on dependencies
2. Agents process their assigned tasks
3. Results are collected and stored
4. Dependencies are resolved automatically

### Output Generation

1. Summarizer creates comprehensive summary
2. Summary is persisted to `summary.md`
3. Prototype Agent generates solution
4. Final results are returned to user

## Error Handling

### Agent Failures

- Individual agent failures don't stop the workflow
- Failed agents are retried with exponential backoff
- Fallback mechanisms ensure workflow completion
- Error details are logged and reported

### Workflow Recovery

- Workflow state is checkpointed regularly
- Failed workflows can be resumed from last checkpoint
- Manual recovery endpoints available
- Automatic cleanup of stale workflows

### Monitoring

- Real-time workflow status tracking
- Agent health monitoring
- Performance metrics collection
- Error rate tracking and alerting

## Implementation Details

### Agent Interface

```python
class AgentInterface:
    def __init__(self, agent_name: str, agent_type: str):
        self.agent_name = agent_name
        self.agent_type = agent_type
    
    async def execute_task(self, task: AgentTask) -> AgentResult:
        """Execute the agent's specific task"""
        pass
    
    async def health_check(self) -> bool:
        """Check if the agent service is healthy"""
        pass
```

### Task Dependencies

```python
# Example task with dependencies
task = AgentTask(
    agent_type="summarizer",
    agent_name="Summarizer Agent",
    input_data={"collected_data": {}},
    priority=1,
    timeout=120,
    dependencies=["nlp_task_id", "asr_task_id", "document_task_id"]
)
```

### Result Persistence

```python
# Summary persistence
await orchestrator.persist_summary(
    submission_id="submission_123",
    summary_text="Comprehensive analysis summary..."
)
```

## Testing

### Unit Tests

- Individual agent functionality
- Workflow orchestration logic
- Error handling scenarios
- Data validation

### Integration Tests

- End-to-end workflow execution
- Service communication
- Data persistence
- Performance benchmarks

### Load Testing

- Concurrent workflow execution
- Resource utilization
- Scalability limits
- Failure recovery

## Monitoring and Observability

### Metrics

- Workflow completion rate
- Agent response times
- Error rates by agent
- Resource utilization

### Logging

- Structured logging with correlation IDs
- Agent execution traces
- Error details and stack traces
- Performance timing data

### Alerting

- Agent health degradation
- Workflow failures
- Performance thresholds
- Resource exhaustion

## Best Practices

### Development

1. **Agent Design**: Keep agents focused and single-purpose
2. **Error Handling**: Implement comprehensive error handling
3. **Testing**: Write tests for all agent functionality
4. **Documentation**: Document agent interfaces and behaviors

### Operations

1. **Monitoring**: Set up comprehensive monitoring
2. **Scaling**: Plan for horizontal scaling of agents
3. **Recovery**: Implement robust recovery mechanisms
4. **Security**: Secure agent communications and data

### Performance

1. **Optimization**: Optimize agent response times
2. **Caching**: Implement appropriate caching strategies
3. **Resource Management**: Monitor and manage resource usage
4. **Load Balancing**: Distribute load across agent instances

## Troubleshooting

### Common Issues

1. **Agent Timeout**
   - Check agent service health
   - Verify input data format
   - Increase timeout if needed

2. **Dependency Resolution**
   - Verify dependency task IDs
   - Check task completion status
   - Review dependency logic

3. **Workflow Stuck**
   - Check agent health status
   - Review workflow logs
   - Use recovery endpoints

### Debug Commands

```bash
# Check orchestrator health
curl http://localhost:8010/health

# Check agent health
curl http://localhost:8010/api/multi-agent/agents/health

# View workflow status
curl http://localhost:8010/api/multi-agent/workflow/{workflow_id}

# Check service logs
docker compose logs ai-orchestrator
```
