#!/usr/bin/env python3
"""
StateX Service Management Dashboard
A comprehensive dashboard for managing microservices in both development and container modes.
"""

import asyncio
import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
import docker
import psutil
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import uvicorn

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent.parent
LOG_DIR = PROJECT_ROOT / "logs"
PID_DIR = PROJECT_ROOT / "pids"

# Service configurations
SERVICES = {
    # Infrastructure Services (always in Docker)
    "postgres": {
        "name": "PostgreSQL Database",
        "category": "infrastructure",
        "modes": ["container"],
        "container_compose": "statex-infrastructure/docker-compose.dev.yml",
        "container_service": "postgres",
        "port": 5432,
        "description": "PostgreSQL database server"
    },
    "redis": {
        "name": "Redis Cache",
        "category": "infrastructure",
        "modes": ["container"],
        "container_compose": "statex-infrastructure/docker-compose.dev.yml",
        "container_service": "redis",
        "port": 6379,
        "description": "Redis in-memory cache"
    },
    "rabbitmq": {
        "name": "RabbitMQ Message Queue",
        "category": "infrastructure",
        "modes": ["container"],
        "container_compose": "statex-infrastructure/docker-compose.dev.yml",
        "container_service": "rabbitmq",
        "port": 5672,
        "description": "RabbitMQ message broker"
    },
    "minio": {
        "name": "MinIO Object Storage",
        "category": "infrastructure",
        "modes": ["container"],
        "container_compose": "statex-infrastructure/docker-compose.dev.yml",
        "container_service": "minio",
        "port": 9000,
        "description": "MinIO S3-compatible object storage"
    },
    "nginx": {
        "name": "Nginx Reverse Proxy",
        "category": "infrastructure",
        "modes": ["container"],
        "container_compose": "statex-infrastructure/docker-compose.dev.yml",
        "container_service": "nginx",
        "port": 80,
        "description": "Nginx reverse proxy and load balancer"
    },
    "elasticsearch": {
        "name": "Elasticsearch",
        "category": "infrastructure",
        "modes": ["container"],
        "container_compose": "statex-infrastructure/docker-compose.dev.yml",
        "container_service": "elasticsearch",
        "port": 9200,
        "description": "Elasticsearch search engine"
    },
    "ollama": {
        "name": "Ollama AI Service",
        "category": "infrastructure",
        "modes": ["container"],
        "container_compose": "statex-infrastructure/docker-compose.dev.yml",
        "container_service": "ollama",
        "port": 11434,
        "description": "Ollama local AI model server"
    },
    
    # Platform Services
    "platform-management": {
        "name": "Platform Management",
        "category": "platform",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn services.platform-management.main:app --reload --host 0.0.0.0 --port 8000",
        "dev_working_dir": "statex-platform",
        "dev_port": 8000,
        "container_compose": "statex-platform/docker-compose.dev.yml",
        "container_service": "platform-management",
        "description": "Central platform orchestration and management"
    },
    "api-gateway": {
        "name": "API Gateway",
        "category": "platform",
        "modes": ["container"],
        "container_compose": "statex-platform/docker-compose.dev.yml",
        "container_service": "api-gateway",
        "dev_port": 8001,
        "description": "Central API routing and gateway"
    },
    
    # AI Services
    "ai-orchestrator": {
        "name": "AI Orchestrator",
        "category": "ai",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8010",
        "dev_working_dir": "statex-ai/services/ai-orchestrator",
        "dev_port": 8010,
        "container_compose": "statex-ai/docker-compose.dev.yml",
        "container_service": "ai-orchestrator",
        "description": "Central AI coordination and orchestration"
    },
    "nlp-service": {
        "name": "NLP Service",
        "category": "ai",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8011",
        "dev_working_dir": "statex-ai/services/nlp-service",
        "dev_port": 8011,
        "container_compose": "statex-ai/docker-compose.dev.yml",
        "container_service": "nlp-service",
        "description": "Natural Language Processing"
    },
    "asr-service": {
        "name": "ASR Service",
        "category": "ai",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8012",
        "dev_working_dir": "statex-ai/services/asr-service",
        "dev_port": 8012,
        "container_compose": "statex-ai/docker-compose.dev.yml",
        "container_service": "asr-service",
        "description": "Automatic Speech Recognition"
    },
    "document-ai": {
        "name": "Document AI",
        "category": "ai",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8013",
        "dev_working_dir": "statex-ai/services/document-ai",
        "dev_port": 8013,
        "container_compose": "statex-ai/docker-compose.dev.yml",
        "container_service": "document-ai",
        "description": "Document analysis and processing"
    },
    "prototype-generator": {
        "name": "Prototype Generator",
        "category": "ai",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8014",
        "dev_working_dir": "statex-ai/services/prototype-generator",
        "dev_port": 8014,
        "container_compose": "statex-ai/docker-compose.dev.yml",
        "container_service": "prototype-generator",
        "description": "Code and prototype generation"
    },
    "template-repository": {
        "name": "Template Repository",
        "category": "ai",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8015",
        "dev_working_dir": "statex-ai/services/template-repository",
        "dev_port": 8015,
        "container_compose": "statex-ai/docker-compose.dev.yml",
        "container_service": "template-repository",
        "description": "Template management and repository"
    },
    "free-ai-service": {
        "name": "Free AI Service",
        "category": "ai",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8016",
        "dev_working_dir": "statex-ai/services/free-ai-service",
        "dev_port": 8016,
        "container_compose": "statex-ai/docker-compose.dev.yml",
        "container_service": "free-ai-service",
        "description": "Free AI models (Ollama, Hugging Face)"
    },
    "ai-workers": {
        "name": "AI Workers",
        "category": "ai",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8017",
        "dev_working_dir": "statex-ai/services/ai-workers",
        "dev_port": 8017,
        "container_compose": "statex-ai/docker-compose.dev.yml",
        "container_service": "ai-workers",
        "description": "AI processing workers and agents"
    },
    
    # Website Services
    "submission-service": {
        "name": "Submission Service",
        "category": "website",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8002",
        "dev_working_dir": "statex-website/services/submission-service",
        "dev_port": 8002,
        "container_compose": "statex-website/docker-compose.dev.yml",
        "container_service": "submission-service",
        "description": "Form submission and processing"
    },
    "user-portal": {
        "name": "User Portal",
        "category": "website",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8006",
        "dev_working_dir": "statex-website/user-portal",
        "dev_port": 8006,
        "container_compose": "statex-website/docker-compose.dev.yml",
        "container_service": "user-portal",
        "description": "User management and portal"
    },
    "content-service": {
        "name": "Content Service",
        "category": "website",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8009",
        "dev_working_dir": "statex-website/content-service",
        "dev_port": 8009,
        "container_compose": "statex-website/docker-compose.dev.yml",
        "container_service": "content-service",
        "description": "Content management and search"
    },
    "frontend": {
        "name": "Website Frontend",
        "category": "website",
        "modes": ["dev", "container"],
        "dev_command": "npm run dev",
        "dev_working_dir": "statex-website/frontend",
        "dev_port": 3000,
        "container_compose": "statex-website/docker-compose.dev.yml",
        "container_service": "frontend",
        "description": "React frontend application"
    },
    
    # Communication Services
    "notification-service": {
        "name": "Notification Service",
        "category": "communication",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8005",
        "dev_working_dir": "statex-notification-service",
        "dev_port": 8005,
        "container_compose": "statex-notification-service/docker-compose.dev.yml",
        "container_service": "notification-service",
        "description": "Email and notification management"
    },
    "dns-service": {
        "name": "DNS Service",
        "category": "communication",
        "modes": ["dev", "container"],
        "dev_command": "npm start",
        "dev_working_dir": "statex-dns-service",
        "dev_port": 8053,
        "container_compose": "statex-dns-service/docker-compose.yml",
        "container_service": "dns-service",
        "description": "Dynamic DNS and subdomain management"
    },
    
    # Monitoring Services
    "monitoring-service": {
        "name": "Monitoring Service",
        "category": "monitoring",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8007",
        "dev_working_dir": "statex-monitoring/monitoring-service",
        "dev_port": 8007,
        "container_compose": "statex-monitoring/docker-compose.dev.yml",
        "container_service": "monitoring-service",
        "description": "System monitoring and metrics"
    },
    "logging-service": {
        "name": "Logging Service",
        "category": "monitoring",
        "modes": ["dev", "container"],
        "dev_command": "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8008",
        "dev_working_dir": "statex-monitoring/logging-service",
        "dev_port": 8008,
        "container_compose": "statex-monitoring/docker-compose.dev.yml",
        "container_service": "logging-service",
        "description": "Centralized logging and log analysis"
    }
}

# Pydantic models
class ServiceAction(BaseModel):
    service_id: str
    action: str  # start, stop, restart
    mode: str    # dev, container

class ServiceStatus(BaseModel):
    service_id: str
    name: str
    category: str
    status: str  # running, stopped, starting, stopping, error
    mode: Optional[str] = None
    port: Optional[int] = None
    pid: Optional[int] = None
    uptime: Optional[str] = None
    last_updated: str

class ServiceConfig(BaseModel):
    service_id: str
    name: str
    category: str
    modes: List[str]
    description: str
    current_mode: Optional[str] = None

# Initialize FastAPI app
app = FastAPI(
    title="StateX Service Management Dashboard",
    description="Comprehensive dashboard for managing microservices in development and container modes",
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

# Docker client
docker_client = None
try:
    # Try different Docker socket paths for macOS
    import os
    docker_socket_paths = [
        '/Users/sergiystashok/.docker/run/docker.sock',
        '/var/run/docker.sock',
        'unix:///Users/sergiystashok/.docker/run/docker.sock',
        'unix:///var/run/docker.sock'
    ]
    
    for socket_path in docker_socket_paths:
        try:
            if socket_path.startswith('unix://'):
                docker_client = docker.from_env()
            else:
                os.environ['DOCKER_HOST'] = f'unix://{socket_path}'
                docker_client = docker.from_env()
            # Test the connection
            docker_client.ping()
            print(f"Successfully connected to Docker at {socket_path}")
            break
        except Exception as e:
            print(f"Failed to connect to Docker at {socket_path}: {e}")
            continue
    
    if not docker_client:
        print("Warning: Could not connect to Docker daemon")
        
except Exception as e:
    print(f"Warning: Docker client not available: {e}")

# WebSocket connections
websocket_connections: List[WebSocket] = []

# Service management functions
def get_docker_containers():
    """Get running Docker containers using subprocess"""
    try:
        import subprocess
        
        # Try different Docker commands
        docker_commands = [
            ['docker', 'ps', '--format', '{{.Names}}|{{.Status}}|{{.Image}}'],
            ['docker', 'container', 'ls', '--format', '{{.Names}}|{{.Status}}|{{.Image}}'],
            ['/usr/local/bin/docker', 'ps', '--format', '{{.Names}}|{{.Status}}|{{.Image}}']
        ]
        
        for cmd in docker_commands:
            try:
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
                if result.returncode == 0:
                    print(f"Successfully executed: {' '.join(cmd)}")
                    break
            except Exception as e:
                print(f"Failed to execute {' '.join(cmd)}: {e}")
                continue
        else:
            print("All Docker commands failed")
            return {}
        
        if result.returncode != 0:
            print(f"Docker ps failed with return code {result.returncode}: {result.stderr}")
            return {}
        
        containers = {}
        for line in result.stdout.strip().split('\n'):
            if line.strip():
                parts = line.split('|')
                if len(parts) >= 3:
                    name, status, image = parts[0], parts[1], parts[2]
                    # Extract just the status word and normalize it
                    status_word = status.split()[0].lower()
                    # Handle different status formats
                    if status_word in ['up', 'running']:
                        normalized_status = 'running'
                    else:
                        normalized_status = status_word
                    
                    containers[name] = {
                        "id": name,
                        "status": normalized_status,
                        "image": image,
                        "ports": {},
                        "raw_status": status  # Keep original for debugging
                    }
        print(f"Found Docker containers: {list(containers.keys())}")
        return containers
    except Exception as e:
        print(f"Error getting Docker containers: {e}")
        return {}

def get_process_by_port(port: int):
    """Check if port is in use using socket connection"""
    try:
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex(('localhost', port))
        sock.close()
        
        if result == 0:
            # Port is in use, return a generic process info
            return {
                "pid": None,
                "name": "unknown",
                "cmdline": f"process on port {port}",
                "create_time": None
            }
    except Exception:
        # Silently fail to avoid spam in logs
        pass
    return None

async def get_service_status(service_id: str) -> ServiceStatus:
    """Get current status of a service"""
    service_config = SERVICES.get(service_id)
    if not service_config:
        raise HTTPException(status_code=404, detail="Service not found")
    
    current_time = datetime.now().isoformat()
    
    # Check if running in development mode
    dev_port = service_config.get("dev_port") or service_config.get("port")
    dev_process = None
    if dev_port:
        dev_process = get_process_by_port(dev_port)
    
    # Check if running in container mode
    container_status = None
    if service_config.get("container_service"):
        containers = get_docker_containers()
        container_name = f"statex_{service_config['container_service']}_dev"
        container_status = containers.get(container_name)
        print(f"Checking container {container_name}: {container_status}")
    
    # Determine overall status
    # For infrastructure services, prioritize container status over dev status
    if container_status and container_status["status"] in ["running", "up"]:
        status = "running"
        mode = "container"
        pid = None
        uptime = None
    elif dev_process and container_status and container_status["status"] in ["running", "up"]:
        status = "running"
        mode = "both"
        pid = dev_process["pid"]
        uptime = datetime.fromtimestamp(dev_process["create_time"]).isoformat() if dev_process.get("create_time") else None
    elif dev_process:
        status = "running"
        mode = "dev"
        pid = dev_process["pid"]
        uptime = datetime.fromtimestamp(dev_process["create_time"]).isoformat() if dev_process.get("create_time") else None
    else:
        status = "stopped"
        mode = None
        pid = None
        uptime = None
    
    return ServiceStatus(
        service_id=service_id,
        name=service_config["name"],
        category=service_config["category"],
        status=status,
        mode=mode,
        port=dev_port,
        pid=pid,
        uptime=uptime,
        last_updated=current_time
    )

def start_service_dev(service_id: str) -> bool:
    """Start service in development mode"""
    service_config = SERVICES.get(service_id)
    if not service_config or "dev" not in service_config["modes"]:
        return False
    
    try:
        working_dir = PROJECT_ROOT / service_config["dev_working_dir"]
        log_file = LOG_DIR / f"{service_id}.log"
        pid_file = PID_DIR / f"{service_id}.pid"
        
        # Create virtual environment if needed
        venv_dir = working_dir / "venv"
        if not venv_dir.exists() and service_config["dev_command"].startswith("python"):
            subprocess.run([
                "python3", "-m", "venv", str(venv_dir)
            ], cwd=str(working_dir), check=True)
            
            # Install requirements
            pip_cmd = str(venv_dir / "bin" / "pip")
            subprocess.run([pip_cmd, "install", "-r", "requirements.txt"], 
                         cwd=str(working_dir), check=True)
        
        # Start service
        if service_config["dev_command"].startswith("python"):
            cmd = f"source {venv_dir}/bin/activate && {service_config['dev_command']}"
        else:
            cmd = service_config["dev_command"]
        
        # Start in background
        process = subprocess.Popen(
            ["bash", "-c", cmd],
            cwd=str(working_dir),
            stdout=open(log_file, "w"),
            stderr=subprocess.STDOUT,
            preexec_fn=os.setsid
        )
        
        # Save PID
        with open(pid_file, "w") as f:
            f.write(str(process.pid))
        
        return True
    except Exception as e:
        print(f"Error starting {service_id} in dev mode: {e}")
        return False

def stop_service_dev(service_id: str) -> bool:
    """Stop service in development mode"""
    try:
        pid_file = PID_DIR / f"{service_id}.pid"
        if pid_file.exists():
            with open(pid_file, "r") as f:
                pid = int(f.read().strip())
            
            # Kill process
            os.killpg(os.getpgid(pid), 9)
            pid_file.unlink()
        
        # Also kill by port
        service_config = SERVICES.get(service_id)
        if service_config and service_config.get("dev_port"):
            port = service_config["dev_port"]
            process = get_process_by_port(port)
            if process:
                os.kill(process["pid"], 9)
        
        return True
    except Exception as e:
        print(f"Error stopping {service_id} in dev mode: {e}")
        return False

def start_service_container(service_id: str) -> bool:
    """Start service in container mode"""
    service_config = SERVICES.get(service_id)
    if not service_config or "container" not in service_config["modes"]:
        return False
    
    try:
        compose_file = PROJECT_ROOT / service_config["container_compose"]
        service_name = service_config["container_service"]
        
        # Start specific service
        subprocess.run([
            "docker", "compose", "-f", str(compose_file), "up", "-d", service_name
        ], cwd=str(PROJECT_ROOT), check=True)
        
        return True
    except Exception as e:
        print(f"Error starting {service_id} in container mode: {e}")
        return False

def stop_service_container(service_id: str) -> bool:
    """Stop service in container mode"""
    service_config = SERVICES.get(service_id)
    if not service_config or "container" not in service_config["modes"]:
        return False
    
    try:
        compose_file = PROJECT_ROOT / service_config["container_compose"]
        service_name = service_config["container_service"]
        
        # Stop specific service
        subprocess.run([
            "docker", "compose", "-f", str(compose_file), "down", service_name
        ], cwd=str(PROJECT_ROOT), check=True)
        
        return True
    except Exception as e:
        print(f"Error stopping {service_id} in container mode: {e}")
        return False

# API Routes
@app.get("/")
async def root():
    """Serve the dashboard frontend"""
    return HTMLResponse(open("static/index.html").read())

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/services", response_model=List[ServiceConfig])
async def get_services():
    """Get all available services"""
    return [
        ServiceConfig(
            service_id=service_id,
            name=config["name"],
            category=config["category"],
            modes=config["modes"],
            description=config["description"]
        )
        for service_id, config in SERVICES.items()
    ]

@app.get("/api/services/{service_id}/status", response_model=ServiceStatus)
async def get_service_status_endpoint(service_id: str):
    """Get status of a specific service"""
    return await get_service_status(service_id)

@app.get("/api/services/status", response_model=List[ServiceStatus])
async def get_all_services_status():
    """Get status of all services"""
    return [await get_service_status(service_id) for service_id in SERVICES.keys()]

@app.post("/api/services/{service_id}/action")
async def service_action(service_id: str, action: ServiceAction):
    """Perform action on a service"""
    if action.service_id != service_id:
        raise HTTPException(status_code=400, detail="Service ID mismatch")
    
    success = False
    
    if action.action == "start":
        if action.mode == "dev":
            success = start_service_dev(service_id)
        elif action.mode == "container":
            success = start_service_container(service_id)
    elif action.action == "stop":
        if action.mode == "dev":
            success = stop_service_dev(service_id)
        elif action.mode == "container":
            success = stop_service_container(service_id)
    elif action.action == "restart":
        # Stop first
        if action.mode == "dev":
            stop_service_dev(service_id)
            success = start_service_dev(service_id)
        elif action.mode == "container":
            stop_service_container(service_id)
            success = start_service_container(service_id)
    
    if not success:
        raise HTTPException(status_code=500, detail=f"Failed to {action.action} service {service_id}")
    
    return {"message": f"Service {service_id} {action.action}ed successfully"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await websocket.accept()
    websocket_connections.append(websocket)
    
    try:
        while True:
            # Send periodic status updates
            statuses = []
            for service_id in SERVICES.keys():
                try:
                    status = await get_service_status(service_id)
                    statuses.append(status)
                except Exception as e:
                    print(f"Error getting status for {service_id}: {e}")
                    import traceback
                    traceback.print_exc()
                    # Create a default stopped status
                    service_config = SERVICES.get(service_id)
                    if service_config:
                        statuses.append(ServiceStatus(
                            service_id=service_id,
                            name=service_config["name"],
                            category=service_config["category"],
                            status="error",
                            mode=None,
                            port=service_config.get("dev_port"),
                            pid=None,
                            uptime=None,
                            last_updated=datetime.now().isoformat()
                        ))
            
            await websocket.send_json([status.model_dump() for status in statuses])
            await asyncio.sleep(5)  # Update every 5 seconds
    except WebSocketDisconnect:
        websocket_connections.remove(websocket)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8020)
