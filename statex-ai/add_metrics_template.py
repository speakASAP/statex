#!/usr/bin/env python3
"""
Template for adding Prometheus metrics to AI services
"""

# Add to imports:
METRICS_IMPORTS = """
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
"""

# Add after configuration:
METRICS_DEFINITIONS = """
# Prometheus metrics
SERVICE_REQUEST_COUNT = Counter('{service}_requests_total', 'Total {service} requests', ['provider', 'status'])
SERVICE_REQUEST_DURATION = Histogram('{service}_request_duration_seconds', '{service} request duration', ['provider'])
SERVICE_ACTIVE_REQUESTS = Gauge('{service}_active_requests', 'Active {service} requests')
SERVICE_AGENT_STATUS = Gauge('{service}_agent_status', '{service} agent status', ['agent_name'])
SERVICE_TOKEN_COUNT = Counter('{service}_tokens_total', 'Total tokens processed', ['provider', 'type'])
"""

# Add to main function start:
FUNCTION_START = """
    start_time = time.time()
    {SERVICE}_ACTIVE_REQUESTS.inc()
"""

# Add to success case:
SUCCESS_METRICS = """
        # Update metrics
        {SERVICE}_REQUEST_COUNT.labels(provider="openai", status="success").inc()
        {SERVICE}_REQUEST_DURATION.labels(provider="openai").observe(processing_time)
        {SERVICE}_ACTIVE_REQUESTS.dec()
        {SERVICE}_AGENT_STATUS.labels(agent_name="{service}-service").set(1)
        {SERVICE}_TOKEN_COUNT.labels(provider="openai", type="input").inc(len(request.text_content.split()))
"""

# Add to error case:
ERROR_METRICS = """
        # Update metrics for error case
        {SERVICE}_REQUEST_COUNT.labels(provider="error", status="failed").inc()
        {SERVICE}_REQUEST_DURATION.labels(provider="error").observe(processing_time)
        {SERVICE}_ACTIVE_REQUESTS.dec()
        {SERVICE}_AGENT_STATUS.labels(agent_name="{service}-service").set(0)
"""

# Add metrics endpoint:
METRICS_ENDPOINT = """
@app.get("/metrics")
async def metrics():
    \"\"\"Prometheus metrics endpoint\"\"\"
    from fastapi import Response
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
"""

# Add to requirements.txt:
REQUIREMENTS_ADDITION = """
prometheus-client==0.19.0
"""

SERVICES = [
    {"name": "asr", "service": "asr-service", "port": 8012},
    {"name": "document", "service": "document-ai", "port": 8013},
    {"name": "orchestrator", "service": "ai-orchestrator", "port": 8010},
    {"name": "prototype", "service": "prototype-generator", "port": 8014},
    {"name": "template", "service": "template-repository", "port": 8015}
]

print("Template created for adding metrics to AI services")
print("Services to update:", [s["service"] for s in SERVICES])
