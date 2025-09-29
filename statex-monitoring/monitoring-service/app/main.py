#!/usr/bin/env python3
"""
StateX Monitoring Service

This service provides comprehensive monitoring for all StateX microservices,
with special focus on AI agent performance, message queues, and system health.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import asyncio
import aiohttp
import time
import json
import os
from datetime import datetime, timedelta
import logging
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from prometheus_client.core import CollectorRegistry
# import docker  # Disabled due to API compatibility issues
import psutil

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="StateX Monitoring Service",
    description="Comprehensive monitoring for StateX microservices and AI agents",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus metrics
registry = CollectorRegistry()

# AI Agent Metrics
ai_agent_requests_total = Counter(
    'ai_agent_requests_total',
    'Total AI agent requests',
    ['agent_name', 'status'],
    registry=registry
)

ai_agent_processing_duration = Histogram(
    'ai_agent_processing_duration_seconds',
    'AI agent processing duration',
    ['agent_name'],
    registry=registry
)

ai_agent_success_rate = Gauge(
    'ai_agent_success_rate',
    'AI agent success rate',
    ['agent_name'],
    registry=registry
)

ai_agent_queue_size = Gauge(
    'ai_agent_queue_size',
    'AI agent queue size',
    ['agent_name'],
    registry=registry
)

# System Metrics
service_health = Gauge(
    'service_health',
    'Service health status (1=healthy, 0=unhealthy)',
    ['service_name', 'service_type'],
    registry=registry
)

service_response_time = Histogram(
    'service_response_time_seconds',
    'Service response time',
    ['service_name', 'endpoint'],
    registry=registry
)

# Message Queue Metrics
queue_messages_total = Gauge(
    'queue_messages_total',
    'Total messages in queue',
    ['queue_name'],
    registry=registry
)

queue_processing_rate = Gauge(
    'queue_processing_rate_per_second',
    'Queue processing rate',
    ['queue_name'],
    registry=registry
)

# Configuration
PROMETHEUS_URL = os.getenv("PROMETHEUS_URL", "http://prometheus:9090")
GRAFANA_URL = os.getenv("GRAFANA_URL", f"http://grafana:{os.getenv('GRAFANA_PORT', '3000')}")
LOKI_URL = os.getenv("LOKI_URL", "http://loki:3100")
JAEGER_URL = os.getenv("JAEGER_URL", "http://jaeger:16686")

# Service URLs
AI_SERVICES_URL = os.getenv("AI_SERVICES_URL", os.getenv("AI_ORCHESTRATOR_URL", "http://ai-orchestrator:8000"))
NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://host.docker.internal:8005")
PLATFORM_URL = os.getenv("PLATFORM_URL", "http://host.docker.internal:8000")

# AI Agent Configuration
AI_AGENTS = {
    "ai_orchestrator": {
        "url": f"{AI_SERVICES_URL}",
        "port": 8010,
        "type": "orchestrator",
        "description": "Central AI coordination service"
    },
    "free_ai_service": {
        "url": f"{AI_SERVICES_URL.replace('8010', '8016')}",
        "port": 8016,
        "type": "ai_agent",
        "description": "Free AI models (Ollama, Hugging Face)"
    },
    "nlp_service": {
        "url": f"{AI_SERVICES_URL.replace('8010', '8011')}",
        "port": 8011,
        "type": "ai_agent",
        "description": "Natural language processing"
    },
    "asr_service": {
        "url": f"{AI_SERVICES_URL.replace('8010', '8012')}",
        "port": 8012,
        "type": "ai_agent",
        "description": "Speech-to-text conversion"
    },
    "document_ai": {
        "url": f"{AI_SERVICES_URL.replace('8010', '8013')}",
        "port": 8013,
        "type": "ai_agent",
        "description": "Document analysis and OCR"
    },
    "prototype_generator": {
        "url": f"{AI_SERVICES_URL.replace('8010', '8014')}",
        "port": 8014,
        "type": "ai_agent",
        "description": "Website and app prototype generation"
    },
    "template_repository": {
        "url": f"{AI_SERVICES_URL.replace('8010', '8015')}",
        "port": 8015,
        "type": "ai_agent",
        "description": "Template management and optimization"
    }
}

# Core Services
CORE_SERVICES = {
    "statex_platform": {
        "url": PLATFORM_URL,
        "port": 8000,
        "type": "platform",
        "description": "Central platform service"
    },
    "notification_service": {
        "url": NOTIFICATION_SERVICE_URL,
        "port": 8005,
        "type": "service",
        "description": "Multi-channel notification service"
    }
}

# Docker client - disabled for now due to API compatibility issues
# docker_client = docker.from_env()

class ServiceStatus(BaseModel):
    name: str
    status: str
    response_time: float
    last_check: datetime
    error_message: Optional[str] = None
    metrics: Dict[str, Any] = {}

class AIAgentStatus(BaseModel):
    name: str
    status: str
    processing_time: float
    success_rate: float
    queue_size: int
    last_activity: datetime
    model_info: Dict[str, Any] = {}
    performance_metrics: Dict[str, Any] = {}

class SystemHealth(BaseModel):
    timestamp: datetime
    overall_status: str
    services: List[ServiceStatus]
    ai_agents: List[AIAgentStatus]
    system_metrics: Dict[str, Any]
    alerts: List[str] = []

# Global state
monitoring_data = {
    "services": {},
    "ai_agents": {},
    "system_metrics": {},
    "alerts": []
}

@app.get("/")
async def root():
    """Root endpoint - redirect to docs"""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/docs")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "statex-monitoring-service"}

@app.get("/metrics")
async def get_metrics():
    """Prometheus metrics endpoint"""
    return generate_latest(registry)

@app.get("/api/status")
async def get_system_status():
    """Get overall system status"""
    return monitoring_data

@app.get("/api/services")
async def get_services_status():
    """Get status of all services"""
    return monitoring_data["services"]

@app.get("/api/ai-agents")
async def get_ai_agents_status():
    """Get status of all AI agents"""
    return monitoring_data["ai_agents"]

@app.get("/api/system-metrics")
async def get_system_metrics():
    """Get system metrics"""
    return monitoring_data["system_metrics"]

@app.get("/api/alerts")
async def get_alerts():
    """Get current alerts"""
    return monitoring_data["alerts"]

@app.post("/api/alerts")
async def receive_alertmanager_webhook(alert_data: Dict[str, Any]):
    """Receive webhook notifications from AlertManager"""
    try:
        logger.info(f"Received AlertManager webhook: {alert_data}")
        
        # Process the alert data
        if "alerts" in alert_data:
            for alert in alert_data["alerts"]:
                alert_name = alert.get("labels", {}).get("alertname", "Unknown")
                alert_status = alert.get("status", "Unknown")
                alert_severity = alert.get("labels", {}).get("severity", "Unknown")
                
                # Add to monitoring data
                alert_message = f"[{alert_severity}] {alert_name}: {alert.get('annotations', {}).get('summary', 'No description')}"
                if alert_message not in monitoring_data["alerts"]:
                    monitoring_data["alerts"].append(alert_message)
                
                logger.info(f"Processed alert: {alert_message}")
        
        return {"status": "success", "message": "Alert processed successfully"}
        
    except Exception as e:
        logger.error(f"Error processing AlertManager webhook: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing alert: {str(e)}")

async def check_service_health(service_name: str, service_config: Dict[str, Any]) -> ServiceStatus:
    """Check health of a single service"""
    start_time = time.time()
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{service_config['url']}/health",
                timeout=aiohttp.ClientTimeout(total=5)
            ) as response:
                response_time = time.time() - start_time
                
                if response.status == 200:
                    data = await response.json()
                    return ServiceStatus(
                        name=service_name,
                        status="healthy",
                        response_time=response_time,
                        last_check=datetime.now(),
                        metrics=data
                    )
                else:
                    return ServiceStatus(
                        name=service_name,
                        status="unhealthy",
                        response_time=response_time,
                        last_check=datetime.now(),
                        error_message=f"HTTP {response.status}"
                    )
    except Exception as e:
        response_time = time.time() - start_time
        return ServiceStatus(
            name=service_name,
            status="unhealthy",
            response_time=response_time,
            last_check=datetime.now(),
            error_message=str(e)
        )

async def check_ai_agent_performance(agent_name: str, agent_config: Dict[str, Any]) -> AIAgentStatus:
    """Check performance of an AI agent"""
    start_time = time.time()
    
    try:
        async with aiohttp.ClientSession() as session:
            # Check health
            async with session.get(
                f"{agent_config['url']}/health",
                timeout=aiohttp.ClientTimeout(total=5)
            ) as response:
                response_time = time.time() - start_time
                
                if response.status == 200:
                    health_data = await response.json()
                    
                    # Get performance metrics if available
                    performance_metrics = {}
                    try:
                        async with session.get(
                            f"{agent_config['url']}/metrics",
                            timeout=aiohttp.ClientTimeout(total=5)
                        ) as metrics_response:
                            if metrics_response.status == 200:
                                performance_metrics = await metrics_response.json()
                    except:
                        pass
                    
                    # Get model info if available
                    model_info = {}
                    try:
                        async with session.get(
                            f"{agent_config['url']}/models",
                            timeout=aiohttp.ClientTimeout(total=5)
                        ) as models_response:
                            if models_response.status == 200:
                                model_info = await models_response.json()
                    except:
                        pass
                    
                    return AIAgentStatus(
                        name=agent_name,
                        status="healthy",
                        processing_time=response_time,
                        success_rate=0.95,  # This would come from actual metrics
                        queue_size=0,  # This would come from actual queue monitoring
                        last_activity=datetime.now(),
                        model_info=model_info,
                        performance_metrics=performance_metrics
                    )
                else:
                    return AIAgentStatus(
                        name=agent_name,
                        status="unhealthy",
                        processing_time=response_time,
                        success_rate=0.0,
                        queue_size=0,
                        last_activity=datetime.now(),
                        model_info={},
                        performance_metrics={}
                    )
    except Exception as e:
        response_time = time.time() - start_time
        return AIAgentStatus(
            name=agent_name,
            status="unhealthy",
            processing_time=response_time,
            success_rate=0.0,
            queue_size=0,
            last_activity=datetime.now(),
            model_info={},
            performance_metrics={}
        )

async def get_system_metrics() -> Dict[str, Any]:
    """Get system-level metrics"""
    try:
        # CPU usage
        cpu_percent = psutil.cpu_percent(interval=1)
        
        # Memory usage
        memory = psutil.virtual_memory()
        
        # Disk usage
        disk = psutil.disk_usage('/')
        
        # Docker container stats
        container_stats = {}
        try:
            # containers = docker_client.containers.list()  # Disabled due to API compatibility
            containers = []  # Mock empty list for now
            for container in containers:
                if container.name.startswith('statex-'):
                    stats = container.stats(stream=False)
                    container_stats[container.name] = {
                        "cpu_percent": stats['cpu_stats']['cpu_usage']['total_usage'] / stats['cpu_stats']['system_cpu_usage'] * 100,
                        "memory_usage": stats['memory_stats']['usage'],
                        "memory_limit": stats['memory_stats']['limit'],
                        "status": container.status
                    }
        except Exception as e:
            logger.warning(f"Could not get Docker stats: {e}")
        
        return {
            "cpu_percent": cpu_percent,
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "percent": memory.percent,
                "used": memory.used
            },
            "disk": {
                "total": disk.total,
                "used": disk.used,
                "free": disk.free,
                "percent": (disk.used / disk.total) * 100
            },
            "containers": container_stats,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting system metrics: {e}")
        return {}

async def update_prometheus_metrics():
    """Update Prometheus metrics based on current monitoring data"""
    # Update AI agent metrics
    for agent_name, agent_data in monitoring_data["ai_agents"].items():
        status = 1 if agent_data["status"] == "healthy" else 0
        ai_agent_requests_total.labels(agent_name=agent_name, status=agent_data["status"]).inc()
        ai_agent_processing_duration.labels(agent_name=agent_name).observe(agent_data["processing_time"])
        ai_agent_success_rate.labels(agent_name=agent_name).set(agent_data["success_rate"])
        ai_agent_queue_size.labels(agent_name=agent_name).set(agent_data["queue_size"])
    
    # Update service health metrics
    for service_name, service_data in monitoring_data["services"].items():
        status = 1 if service_data["status"] == "healthy" else 0
        service_health.labels(service_name=service_name, service_type=service_data.get("type", "unknown")).set(status)
        service_response_time.labels(service_name=service_name, endpoint="health").observe(service_data["response_time"])

async def monitor_services():
    """Main monitoring loop"""
    logger.info("Starting service monitoring...")
    
    while True:
        try:
            # Check core services
            service_tasks = []
            for service_name, service_config in CORE_SERVICES.items():
                task = check_service_health(service_name, service_config)
                service_tasks.append((service_name, task))
            
            # Check AI agents
            ai_agent_tasks = []
            for agent_name, agent_config in AI_AGENTS.items():
                task = check_ai_agent_performance(agent_name, agent_config)
                ai_agent_tasks.append((agent_name, task))
            
            # Execute all checks in parallel
            service_results = await asyncio.gather(*[task for _, task in service_tasks], return_exceptions=True)
            ai_agent_results = await asyncio.gather(*[task for _, task in ai_agent_tasks], return_exceptions=True)
            
            # Update monitoring data
            for i, (service_name, _) in enumerate(service_tasks):
                result = service_results[i]
                if isinstance(result, Exception):
                    monitoring_data["services"][service_name] = {
                        "status": "error",
                        "response_time": 0.0,
                        "last_check": datetime.now().isoformat(),
                        "error_message": str(result),
                        "type": CORE_SERVICES[service_name]["type"]
                    }
                else:
                    monitoring_data["services"][service_name] = {
                        "status": result.status,
                        "response_time": result.response_time,
                        "last_check": result.last_check.isoformat(),
                        "error_message": result.error_message,
                        "type": CORE_SERVICES[service_name]["type"],
                        "metrics": result.metrics
                    }
            
            for i, (agent_name, _) in enumerate(ai_agent_tasks):
                result = ai_agent_results[i]
                if isinstance(result, Exception):
                    monitoring_data["ai_agents"][agent_name] = {
                        "status": "error",
                        "processing_time": 0.0,
                        "success_rate": 0.0,
                        "queue_size": 0,
                        "last_activity": datetime.now().isoformat(),
                        "model_info": {},
                        "performance_metrics": {}
                    }
                else:
                    monitoring_data["ai_agents"][agent_name] = {
                        "status": result.status,
                        "processing_time": result.processing_time,
                        "success_rate": result.success_rate,
                        "queue_size": result.queue_size,
                        "last_activity": result.last_activity.isoformat(),
                        "model_info": result.model_info,
                        "performance_metrics": result.performance_metrics
                    }
            
            # Update system metrics
            monitoring_data["system_metrics"] = await get_system_metrics()
            
            # Update Prometheus metrics
            await update_prometheus_metrics()
            
            # Check for alerts
            alerts = []
            for service_name, service_data in monitoring_data["services"].items():
                if service_data["status"] != "healthy":
                    alerts.append(f"Service {service_name} is {service_data['status']}")
            
            for agent_name, agent_data in monitoring_data["ai_agents"].items():
                if agent_data["status"] != "healthy":
                    alerts.append(f"AI Agent {agent_name} is {agent_data['status']}")
            
            monitoring_data["alerts"] = alerts
            
            logger.info(f"Monitoring update completed. Services: {len(monitoring_data['services'])}, AI Agents: {len(monitoring_data['ai_agents'])}")
            
        except Exception as e:
            logger.error(f"Error in monitoring loop: {e}")
        
        # Wait before next check
        await asyncio.sleep(30)  # Check every 30 seconds

@app.on_event("startup")
async def startup_event():
    """Start monitoring on startup"""
    asyncio.create_task(monitor_services())
    logger.info("StateX Monitoring Service started")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
