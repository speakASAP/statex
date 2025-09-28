"""
StateX AI Orchestrator Service

Central coordination hub for all AI operations.
Manages workflow, routes requests, and combines results from AI agents.
Enhanced with multi-agent workflow orchestration framework.
"""

import os
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from enum import Enum
import uvicorn
import uuid
import asyncio
import httpx
from datetime import datetime
import logging
import time

# Import new multi-agent components
from .multi_agent_orchestrator import (
    MultiAgentOrchestrator, MultiAgentRequest, WorkflowResult,
    multi_agent_orchestrator
)
from .agent_coordination import agent_coordinator
from .workflow_engine import WorkflowState, TaskStatus, WorkflowStatus
from .workflow_persistence import workflow_persistence
from .workflow_recovery import workflow_recovery_manager, RecoveryStrategy
from .error_handling import error_recovery_manager
from .project_url_generator import project_url_generator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="StateX AI Orchestrator",
    description="Central coordination hub for AI operations",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://statex.cz",
        "https://www.statex.cz",
        os.getenv("CORS_ORIGIN", "http://localhost:3000"),
        "http://localhost:3002",
        f"https://localhost:{os.getenv('FRONTEND_PORT', '3000')}",
        "https://localhost:3002",
        f"http://127.0.0.1:{os.getenv('FRONTEND_PORT', '3000')}",
        "http://127.0.0.1:3002",
        f"https://127.0.0.1:{os.getenv('FRONTEND_PORT', '3000')}",
        "https://127.0.0.1:3002"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs
NLP_SERVICE_URL = os.getenv("NLP_SERVICE_URL", "http://localhost:8011")
ASR_SERVICE_URL = os.getenv("ASR_SERVICE_URL", "http://localhost:8012")
DOCUMENT_AI_URL = os.getenv("DOCUMENT_AI_URL", "http://localhost:8013")
PROTOTYPE_GENERATOR_URL = os.getenv("PROTOTYPE_GENERATOR_URL", "http://localhost:8014")
# TEMPLATE_REPOSITORY_URL removed - Template Repository functionality disabled
NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8005")

# In-memory storage for demo (replace with database in production)
submissions_db: Dict[str, Dict[str, Any]] = {}
workflows_db: Dict[str, Dict[str, Any]] = {}

class SubmissionType(str, Enum):
    TEXT = "text"
    VOICE = "voice"
    FILE = "file"
    MIXED = "mixed"

class SubmissionStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    AI_ANALYSIS = "ai_analysis"
    COMPLETED = "completed"
    FAILED = "failed"

class SubmissionRequest(BaseModel):
    submission_id: Optional[str] = None
    user_id: str
    submission_type: SubmissionType
    text_content: Optional[str] = None
    voice_file_url: Optional[str] = None
    file_urls: Optional[List[str]] = None
    requirements: Optional[str] = None
    contact_info: Dict[str, Any] = {}

class AIAnalysisResult(BaseModel):
    service: str
    status: str
    result: Dict[str, Any]
    confidence: float
    processing_time: float

class WorkflowStep(BaseModel):
    step_id: str
    service: str
    status: str
    input_data: Dict[str, Any]
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    processing_time: Optional[float] = None

class SubmissionResponse(BaseModel):
    submission_id: str
    status: SubmissionStatus
    message: str
    estimated_completion_time: Optional[str] = None

class SubmissionStatusResponse(BaseModel):
    submission_id: str
    status: SubmissionStatus
    progress: float
    current_step: str
    workflow_steps: List[WorkflowStep]
    results: Optional[Dict[str, Any]] = None
    prototype_id: Optional[str] = None
    results_page_url: Optional[str] = None
    created_at: str
    updated_at: str

@app.on_event("startup")
async def startup_event():
    """Initialize multi-agent system on startup"""
    try:
        # Connect to Redis for workflow persistence
        await workflow_persistence.connect()
        
        # Start agent health monitoring
        await agent_coordinator.start_monitoring()
        
        # Register prototype workflow
        from .workflows.prototype_workflow import register_prototype_workflow
        register_prototype_workflow(multi_agent_orchestrator.workflow_engine)
        
        # Note: Agent registration with coordinator will be handled separately
        # to avoid startup issues
        
        # Recover any interrupted workflows using the enhanced recovery manager
        recovered_workflows = await workflow_recovery_manager.auto_recover_interrupted_workflows()
        if recovered_workflows:
            logger.info(f"Auto-recovered {len(recovered_workflows)} interrupted workflows")
        
        logger.info("Multi-agent orchestrator initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize multi-agent system: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    try:
        await agent_coordinator.stop_monitoring()
        logger.info("Multi-agent orchestrator shutdown complete")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")

@app.get("/health")
async def health_check():
    """Health check endpoint with multi-agent system status"""
    system_health = agent_coordinator.get_system_health_summary()
    
    return {
        "status": "healthy" if system_health.get("overall_health") != "critical" else "degraded",
        "service": "ai-orchestrator",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "multi_agent_system": system_health
    }

@app.post("/api/multi-agent/process", response_model=Dict[str, Any])
async def process_multi_agent_request(request: MultiAgentRequest, background_tasks: BackgroundTasks):
    """Process request through multi-agent workflow system"""
    try:
        # Start multi-agent processing in background
        background_tasks.add_task(execute_multi_agent_workflow, request)
        
        return {
            "submission_id": request.submission_id,
            "status": "processing",
            "message": "Multi-agent workflow started",
            "workflow_type": request.workflow_type,
            "estimated_completion_time": "2-5 minutes"
        }
        
    except Exception as e:
        logger.error(f"Error starting multi-agent workflow: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start workflow: {str(e)}")

async def execute_multi_agent_workflow(request: MultiAgentRequest):
    """Execute multi-agent workflow in background"""
    try:
        result = await multi_agent_orchestrator.process_multi_agent_request(request)
        logger.info(f"Multi-agent workflow completed for {request.submission_id}")
        
        # Update the submission in the legacy system if it exists
        if request.submission_id in submissions_db:
            submission = submissions_db[request.submission_id]
            submission["status"] = SubmissionStatus.COMPLETED
            submission["results"]["multi_agent_analysis"] = result.dict()
            submission["updated_at"] = datetime.now().isoformat()
        
    except Exception as e:
        logger.error(f"Multi-agent workflow failed for {request.submission_id}: {e}")
        
        # Update submission status to failed
        if request.submission_id in submissions_db:
            submission = submissions_db[request.submission_id]
            submission["status"] = SubmissionStatus.FAILED
            submission["updated_at"] = datetime.now().isoformat()

@app.get("/api/multi-agent/workflow/{workflow_id}")
async def get_workflow_status(workflow_id: str):
    """Get status of a multi-agent workflow"""
    try:
        workflow_state = await multi_agent_orchestrator.get_workflow_status(workflow_id)
        
        if not workflow_state:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        return {
            "workflow_id": workflow_state.workflow_id,
            "submission_id": workflow_state.submission_id,
            "status": workflow_state.status.value,
            "progress": workflow_state.progress,
            "current_step": workflow_state.current_step,
            "completed_tasks": len(workflow_state.completed_tasks),
            "failed_tasks": len(workflow_state.failed_tasks),
            "total_tasks": len(workflow_state.agent_results),
            "start_time": workflow_state.start_time.isoformat(),
            "end_time": workflow_state.end_time.isoformat() if workflow_state.end_time else None,
            "agent_results": {
                task_id: {
                    "agent_name": result.agent_name,
                    "status": result.status.value,
                    "processing_time": result.processing_time,
                    "confidence_score": result.confidence_score
                }
                for task_id, result in workflow_state.agent_results.items()
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting workflow status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/multi-agent/workflow/{workflow_id}/cancel")
async def cancel_workflow(workflow_id: str):
    """Cancel a running workflow"""
    try:
        success = await multi_agent_orchestrator.cancel_workflow(workflow_id)
        
        if success:
            return {"message": f"Workflow {workflow_id} cancelled successfully"}
        else:
            raise HTTPException(status_code=400, detail="Workflow not found or cannot be cancelled")
            
    except Exception as e:
        logger.error(f"Error cancelling workflow: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/multi-agent/agents/health")
async def get_agents_health():
    """Get health status of all agents"""
    try:
        metrics = agent_coordinator.get_agent_metrics()
        system_health = agent_coordinator.get_system_health_summary()
        
        return {
            "system_health": system_health,
            "agent_metrics": {
                agent_type: {
                    "agent_name": metric.agent_name,
                    "health_status": metric.health_status.value,
                    "total_tasks": metric.total_tasks,
                    "success_rate": (metric.successful_tasks / metric.total_tasks * 100) if metric.total_tasks > 0 else 0,
                    "avg_processing_time": metric.avg_processing_time,
                    "consecutive_failures": metric.consecutive_failures,
                    "last_success": metric.last_success.isoformat() if metric.last_success else None,
                    "last_failure": metric.last_failure.isoformat() if metric.last_failure else None,
                    "uptime_percentage": metric.uptime_percentage
                }
                for agent_type, metric in metrics.items()
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting agent health: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/multi-agent/agents/{agent_type}/failures")
async def get_agent_failures(agent_type: str):
    """Get failure patterns for a specific agent"""
    try:
        failure_patterns = agent_coordinator.get_failure_patterns(agent_type)
        
        if agent_type not in failure_patterns:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        return {
            "agent_type": agent_type,
            "failure_patterns": [
                {
                    "failure_type": pattern.failure_type.value,
                    "count": pattern.count,
                    "first_occurrence": pattern.first_occurrence.isoformat(),
                    "last_occurrence": pattern.last_occurrence.isoformat()
                }
                for pattern in failure_patterns[agent_type]
            ]
        }
        
    except Exception as e:
        logger.error(f"Error getting agent failures: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/error-handling/statistics")
async def get_error_statistics():
    """Get comprehensive error statistics"""
    try:
        error_stats = error_recovery_manager.get_error_statistics()
        workflow_stats = await workflow_persistence.get_workflow_statistics()
        
        return {
            "error_statistics": error_stats,
            "workflow_statistics": workflow_stats,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting error statistics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/workflow/{workflow_id}/recover")
async def recover_workflow(workflow_id: str, strategy: Optional[str] = None):
    """Manually trigger workflow recovery"""
    try:
        recovery_strategy = None
        if strategy:
            try:
                recovery_strategy = RecoveryStrategy(strategy)
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid recovery strategy: {strategy}")
        
        recovered_state = await workflow_recovery_manager.recover_workflow(
            workflow_id, recovery_strategy
        )
        
        if recovered_state:
            return {
                "workflow_id": workflow_id,
                "recovery_status": "success",
                "new_status": recovered_state.status.value,
                "recovery_strategy": recovery_strategy.value if recovery_strategy else "auto",
                "message": "Workflow recovered successfully"
            }
        else:
            return {
                "workflow_id": workflow_id,
                "recovery_status": "failed",
                "message": "Workflow recovery failed"
            }
            
    except Exception as e:
        logger.error(f"Error recovering workflow {workflow_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/workflow/{workflow_id}/resume")
async def resume_workflow(workflow_id: str, from_checkpoint: Optional[str] = None):
    """Resume a paused or failed workflow"""
    try:
        resumed_state = await workflow_recovery_manager.resume_workflow(
            workflow_id, from_checkpoint
        )
        
        if resumed_state:
            return {
                "workflow_id": workflow_id,
                "resume_status": "success",
                "new_status": resumed_state.status.value,
                "from_checkpoint": from_checkpoint,
                "message": "Workflow resumed successfully"
            }
        else:
            return {
                "workflow_id": workflow_id,
                "resume_status": "failed",
                "message": "Workflow resume failed"
            }
            
    except Exception as e:
        logger.error(f"Error resuming workflow {workflow_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/workflow/{workflow_id}/recovery-status")
async def get_workflow_recovery_status(workflow_id: str):
    """Get recovery status and options for a workflow"""
    try:
        recovery_status = await workflow_recovery_manager.get_recovery_status(workflow_id)
        return recovery_status
        
    except Exception as e:
        logger.error(f"Error getting recovery status for {workflow_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/maintenance/cleanup-stale-workflows")
async def cleanup_stale_workflows(max_age_hours: int = 24, auto_recover: bool = True):
    """Clean up stale workflows with optional auto-recovery"""
    try:
        cleanup_stats = await workflow_recovery_manager.cleanup_stale_workflows(
            max_age_hours, auto_recover
        )
        
        return {
            "cleanup_completed": True,
            "statistics": cleanup_stats,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error during stale workflow cleanup: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/maintenance/auto-recover-workflows")
async def auto_recover_workflows():
    """Manually trigger auto-recovery of interrupted workflows"""
    try:
        recovered_workflows = await workflow_recovery_manager.auto_recover_interrupted_workflows()
        
        return {
            "recovery_completed": True,
            "recovered_workflows": recovered_workflows,
            "total_recovered": len(recovered_workflows),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error during auto-recovery: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process-submission", response_model=SubmissionResponse)
async def process_submission(submission: SubmissionRequest, background_tasks: BackgroundTasks):
    """Process a new user submission"""
    try:
        # Use provided submission_id or generate new one if not provided
        submission_id = submission.submission_id or str(uuid.uuid4())
        
        # Create submission record
        submission_record = {
            "submission_id": submission_id,
            "user_id": submission.user_id,
            "submission_type": submission.submission_type,
            "text_content": submission.text_content,
            "voice_file_url": submission.voice_file_url,
            "file_urls": submission.file_urls or [],
            "requirements": submission.requirements,
            "contact_info": submission.contact_info,
            "status": SubmissionStatus.PENDING,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "workflow_steps": [],
            "results": {},
            # Extract user information from contact_info for notification service
            "user_name": submission.contact_info.get("name", "Unknown User"),
            "contact_type": "telegram",  # Always use telegram for individual agent notifications
            "contact_value": submission.contact_info.get("email", "694579866")  # email field contains telegram ID
        }
        
        submissions_db[submission_id] = submission_record
        
        # Check if multi-agent processing is enabled
        use_multi_agent = os.getenv("USE_MULTI_AGENT_WORKFLOW", "false").lower() == "true"
        
        if use_multi_agent:
            # Use new multi-agent workflow system
            multi_agent_request = MultiAgentRequest(
                submission_id=submission_id,
                user_id=submission.user_id,
                text_content=submission.text_content,
                voice_file_url=submission.voice_file_url,
                file_urls=submission.file_urls or [],
                contact_info=submission.contact_info,
                workflow_type="business_analysis"
            )
            background_tasks.add_task(execute_multi_agent_workflow, multi_agent_request)
        else:
            # Use legacy workflow system
            background_tasks.add_task(process_submission_workflow, submission_id)
        
        return SubmissionResponse(
            submission_id=submission_id,
            status=SubmissionStatus.PENDING,
            message="Submission received and processing started",
            estimated_completion_time="5-10 minutes"
        )
        
    except Exception as e:
        logger.error(f"Error processing submission: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process submission: {str(e)}")

async def process_submission_workflow(submission_id: str):
    """Process submission through AI workflow"""
    try:
        submission = submissions_db[submission_id]
        submission["status"] = SubmissionStatus.PROCESSING
        submission["updated_at"] = datetime.now().isoformat()
        
        logger.info(f"Starting workflow for submission {submission_id}")
        
        # Step 1: Process voice files (if any)
        if submission["voice_file_url"]:
            await process_voice_content(submission_id)
        
        # Step 2: Process document files (if any)
        if submission["file_urls"]:
            await process_document_files(submission_id)
        
        # Step 3: Analyze text content with NLP
        if submission["text_content"] or submission["voice_file_url"] or submission["file_urls"]:
            await process_nlp_analysis(submission_id)
        
        # Step 4: Generate prototype (if applicable)
        await generate_prototype(submission_id)
        
        # Step 5: Create results page
        await create_results_page(submission_id)
        
        # Step 6: Send notification to user
        await send_notification(submission_id)
        
        # Step 7: Mark as completed
        submission["status"] = SubmissionStatus.COMPLETED
        submission["updated_at"] = datetime.now().isoformat()
        
        logger.info(f"Workflow completed for submission {submission_id}")
        
    except Exception as e:
        logger.error(f"Error in workflow for submission {submission_id}: {e}")
        submission = submissions_db[submission_id]
        submission["status"] = SubmissionStatus.FAILED
        submission["updated_at"] = datetime.now().isoformat()

async def process_voice_content(submission_id: str):
    """Process voice content through ASR service"""
    submission = submissions_db[submission_id]
    
    step = WorkflowStep(
        step_id="asr_processing",
        service="asr-service",
        status="processing",
        input_data={"voice_file_url": submission["voice_file_url"]}
    )
    
    submission["workflow_steps"].append(step.dict())
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{ASR_SERVICE_URL}/api/transcribe",
                json={"voice_file_url": submission["voice_file_url"]}
            )
            
            if response.status_code == 200:
                result = response.json()
                # Update the step in the workflow_steps list
                for i, workflow_step in enumerate(submission["workflow_steps"]):
                    if workflow_step["step_id"] == step.step_id:
                        submission["workflow_steps"][i]["status"] = "completed"
                        submission["workflow_steps"][i]["output_data"] = result
                        submission["workflow_steps"][i]["processing_time"] = result.get("processing_time", 0)
                        break
                
                # Add transcribed text to submission
                submission["text_content"] = (submission["text_content"] or "") + "\n" + result.get("transcript", "")
                
                # Send individual agent notification
                await send_agent_notification(
                    submission_id=submission_id,
                    agent_name="ASR Service",
                    service_name="asr-service",
                    input_data={"voice_file_url": submission["voice_file_url"]},
                    output_data=result,
                    processing_time=result.get("processing_time", 0)
                )
            else:
                # Update the step in the workflow_steps list
                for i, workflow_step in enumerate(submission["workflow_steps"]):
                    if workflow_step["step_id"] == step.step_id:
                        submission["workflow_steps"][i]["status"] = "failed"
                        submission["workflow_steps"][i]["error_message"] = f"ASR service error: {response.status_code}"
                        break
                
    except Exception as e:
        # Update the step in the workflow_steps list
        for i, workflow_step in enumerate(submission["workflow_steps"]):
            if workflow_step["step_id"] == step.step_id:
                submission["workflow_steps"][i]["status"] = "failed"
                submission["workflow_steps"][i]["error_message"] = str(e)
                break
        logger.error(f"ASR processing error for {submission_id}: {e}")

async def process_document_files(submission_id: str):
    """Process document files through Document AI service"""
    submission = submissions_db[submission_id]
    
    step = WorkflowStep(
        step_id="document_processing",
        service="document-ai",
        status="processing",
        input_data={"file_urls": submission["file_urls"]}
    )
    
    submission["workflow_steps"].append(step.dict())
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{DOCUMENT_AI_URL}/api/analyze-documents",
                json={"file_urls": submission["file_urls"]}
            )
            
            if response.status_code == 200:
                result = response.json()
                # Update the step in the workflow_steps list
                for i, workflow_step in enumerate(submission["workflow_steps"]):
                    if workflow_step["step_id"] == step.step_id:
                        submission["workflow_steps"][i]["status"] = "completed"
                        submission["workflow_steps"][i]["output_data"] = result
                        submission["workflow_steps"][i]["processing_time"] = result.get("processing_time", 0)
                        break
                
                # Add extracted text to submission
                extracted_text = result.get("extracted_text", "")
                submission["text_content"] = (submission["text_content"] or "") + "\n" + extracted_text
                
                # Send individual agent notification
                await send_agent_notification(
                    submission_id=submission_id,
                    agent_name="Document AI",
                    service_name="document-ai",
                    input_data={"file_urls": submission["file_urls"]},
                    output_data=result,
                    processing_time=result.get("processing_time", 0)
                )
            else:
                step.status = "failed"
                step.error_message = f"Document AI service error: {response.status_code}"
                
    except Exception as e:
        step.status = "failed"
        step.error_message = str(e)
        logger.error(f"Document processing error for {submission_id}: {e}")

async def process_nlp_analysis(submission_id: str):
    """Process text content through NLP service"""
    submission = submissions_db[submission_id]
    
    step = WorkflowStep(
        step_id="nlp_analysis",
        service="nlp-service",
        status="processing",
        input_data={"text_content": submission["text_content"]}
    )
    
    submission["workflow_steps"].append(step.dict())
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{NLP_SERVICE_URL}/api/analyze",
                json={
                    "text_content": submission["text_content"],
                    "requirements": submission["requirements"]
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                # Update the step in the workflow_steps list
                for i, workflow_step in enumerate(submission["workflow_steps"]):
                    if workflow_step["step_id"] == step.step_id:
                        submission["workflow_steps"][i]["status"] = "completed"
                        submission["workflow_steps"][i]["output_data"] = result
                        submission["workflow_steps"][i]["processing_time"] = result.get("processing_time", 0)
                        break
                
                # Store NLP results
                submission["results"]["nlp_analysis"] = result
                
                # Send individual agent notification
                await send_agent_notification(
                    submission_id=submission_id,
                    agent_name="NLP Analysis",
                    service_name="nlp-service",
                    input_data={"text_content": submission["text_content"], "requirements": submission["requirements"]},
                    output_data=result,
                    processing_time=result.get("processing_time", 0)
                )
            else:
                step.status = "failed"
                step.error_message = f"NLP service error: {response.status_code}"
                
    except Exception as e:
        step.status = "failed"
        step.error_message = str(e)
        logger.error(f"NLP processing error for {submission_id}: {e}")

async def create_results_page(submission_id: str):
    """Create results page for prototype"""
    submission = submissions_db[submission_id]
    
    step = WorkflowStep(
        step_id="results_page_creation",
        service="results-storage",
        status="processing",
        input_data={"prototype_id": submission.get("prototype_id", f"proto_{submission_id}")}
    )
    
    submission["workflow_steps"].append(step.dict())
    
    try:
        # Prepare results data for storage
        results_data = {
            "prototype_id": submission.get("prototype_id", f"proto_{submission_id}"),
            "form_data": {
                "text_content": submission["text_content"],
                "voice_file_url": submission.get("voice_file_url"),
                "file_urls": submission.get("file_urls", []),
                "contact_info": submission["contact_info"],
                "requirements": submission["requirements"]
            },
            "workflow_steps": submission["workflow_steps"],
            "ai_analysis": submission["results"],
            "prototype_info": submission["results"].get("prototype", {}),
            "summary": {
                "total_steps": len(submission["workflow_steps"]),
                "completed_steps": len([s for s in submission["workflow_steps"] if s.get("status") == "completed"]),
                "total_processing_time": sum([s.get("processing_time", 0) or 0 for s in submission["workflow_steps"]]),
                "created_at": submission["created_at"],
                "updated_at": submission["updated_at"]
            }
        }
        
        # Store results (for now, we'll store in the submission record)
        # In production, this would call a dedicated results storage service
        submission["results_page_data"] = results_data
        prototype_id = submission.get('prototype_id', f"proto_{submission_id}")
        submission["results_page_url"] = f"http://localhost:3000/prototype-results/{prototype_id}"
        
        # Update the step in the workflow_steps list
        for i, workflow_step in enumerate(submission["workflow_steps"]):
            if workflow_step["step_id"] == step.step_id:
                submission["workflow_steps"][i]["status"] = "completed"
                submission["workflow_steps"][i]["output_data"] = {
                    "results_page_url": submission["results_page_url"],
                    "status": "created"
                }
                submission["workflow_steps"][i]["processing_time"] = 0.1
                break
        
        # Send individual agent notification
        await send_agent_notification(
            submission_id=submission_id,
            agent_name="Results Page Creator",
            service_name="results-storage",
            input_data={"prototype_id": submission.get("prototype_id", f"proto_{submission_id}")},
            output_data={"results_page_url": submission["results_page_url"]},
            processing_time=0.1
        )
        
    except Exception as e:
        # Update the step in the workflow_steps list
        for i, workflow_step in enumerate(submission["workflow_steps"]):
            if workflow_step["step_id"] == step.step_id:
                submission["workflow_steps"][i]["status"] = "failed"
                submission["workflow_steps"][i]["error_message"] = str(e)
                break
        logger.error(f"Results page creation error for {submission_id}: {e}")

async def generate_prototype(submission_id: str):
    """Generate prototype through Prototype Generator service"""
    submission = submissions_db[submission_id]
    
    step = WorkflowStep(
        step_id="prototype_generation",
        service="prototype-generator",
        status="processing",
        input_data={
            "requirements": submission["requirements"],
            "nlp_analysis": submission["results"].get("nlp_analysis", {})
        }
    )
    
    submission["workflow_steps"].append(step.dict())
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{PROTOTYPE_GENERATOR_URL}/api/generate-prototype",
                json={
                    "requirements": submission["requirements"],
                    "analysis": submission["results"].get("nlp_analysis", {})
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                # Update the step in the workflow_steps list
                for i, workflow_step in enumerate(submission["workflow_steps"]):
                    if workflow_step["step_id"] == step.step_id:
                        submission["workflow_steps"][i]["status"] = "completed"
                        submission["workflow_steps"][i]["output_data"] = result
                        submission["workflow_steps"][i]["processing_time"] = result.get("processing_time", 0)
                        break
                
                # Store prototype results
                submission["results"]["prototype"] = result
                
                # Generate proper project URLs
                try:
                    project_urls = await project_url_generator.create_and_validate_project_urls(
                        submission_id=submission_id,
                        user_id=submission.get("user_id", "anonymous")
                    )
                    submission["prototype_id"] = project_urls.project_id
                    submission["project_urls"] = {
                        "plan_url": project_urls.plan_url,
                        "offer_url": project_urls.offer_url,
                        "is_accessible": project_urls.is_accessible,
                        "validation_results": project_urls.validation_results
                    }
                except Exception as e:
                    logger.error(f"Error generating project URLs: {e}")
                    # Fallback to simple ID
                    submission["prototype_id"] = result.get("prototype_id", f"proto_{int(time.time())}")
                
                # Send individual agent notification
                await send_agent_notification(
                    submission_id=submission_id,
                    agent_name="Prototype Generator",
                    service_name="prototype-generator",
                    input_data={
                        "requirements": submission["requirements"],
                        "nlp_analysis": submission["results"].get("nlp_analysis", {})
                    },
                    output_data=result,
                    processing_time=result.get("processing_time", 0)
                )
            else:
                step.status = "failed"
                step.error_message = f"Prototype generator error: {response.status_code}"
                
    except Exception as e:
        step.status = "failed"
        step.error_message = str(e)
        logger.error(f"Prototype generation error for {submission_id}: {e}")

async def send_agent_notification(submission_id: str, agent_name: str, service_name: str, input_data: dict, output_data: dict, processing_time: float = 0, status: str = "completed"):
    """Send individual Telegram notification for each AI agent"""
    try:
        submission = submissions_db[submission_id]
        # Format the message for the specific agent
        message_parts = []
        message_parts.append(f"🤖 **{agent_name} Agent Report**")
        message_parts.append(f"📋 Service: {service_name}")
        message_parts.append(f"⏱️ Processing Time: {processing_time:.2f}s")
        message_parts.append(f"✅ Status: {status.upper()}")
        message_parts.append("")
        
        # Add input data
        message_parts.append("📥 **Input Data:**")
        for key, value in input_data.items():
            if isinstance(value, str) and len(value) > 100:
                message_parts.append(f"• {key}: {value[:100]}...")
            else:
                message_parts.append(f"• {key}: {value}")
        message_parts.append("")
        
        # Add output data
        message_parts.append("📤 **Output Data:**")
        
        # Special handling for Prototype Generator to show results page URL instead of deployment URL
        if service_name == "prototype-generator" and "results" in output_data:
            # Show prototype info but replace deployment URL with results page URL
            for key, value in output_data.items():
                if key == "results" and isinstance(value, dict):
                    message_parts.append(f"• {key}: {len(value)} items")
                    for sub_key, sub_value in value.items():
                        if sub_key == "deployment" and isinstance(sub_value, dict):
                            # Replace deployment URL with results page URL
                            prototype_id = submission.get('prototype_id', f"proto_{submission_id}")
                            results_page_url = submission.get("results_page_url", f"http://localhost:3000/prototype-results/{prototype_id}")
                            message_parts.append(f"  - {sub_key}: {{'url': '[View Prototype Results]({results_page_url})', 'status': 'ready', 'deploymenttime': '2-3 minutes'}}")
                        elif isinstance(sub_value, str) and len(sub_value) > 50:
                            message_parts.append(f"  - {sub_key}: {sub_value[:50]}...")
                        elif isinstance(sub_value, list):
                            message_parts.append(f"  - {sub_key}: {len(sub_value)} items")
                        else:
                            message_parts.append(f"  - {sub_key}: {sub_value}")
                else:
                    if isinstance(value, str) and len(value) > 100:
                        message_parts.append(f"• {key}: {value[:100]}...")
                    else:
                        message_parts.append(f"• {key}: {value}")
        else:
            # Default handling for other agents
            for key, value in output_data.items():
                if isinstance(value, str) and len(value) > 100:
                    message_parts.append(f"• {key}: {value[:100]}...")
                elif isinstance(value, dict):
                    message_parts.append(f"• {key}: {len(value)} items")
                    # Show key details for important fields
                    if key == "results" and isinstance(value, dict):
                        for sub_key, sub_value in value.items():
                            if isinstance(sub_value, str) and len(sub_value) > 50:
                                message_parts.append(f"  - {sub_key}: {sub_value[:50]}...")
                            elif isinstance(sub_value, list):
                                message_parts.append(f"  - {sub_key}: {len(sub_value)} items")
                            else:
                                message_parts.append(f"  - {sub_key}: {sub_value}")
                elif isinstance(value, list):
                    message_parts.append(f"• {key}: {len(value)} items")
                    # Show first few items if it's a short list
                    if len(value) <= 3 and value:
                        for i, item in enumerate(value):
                            if isinstance(item, dict):
                                message_parts.append(f"  {i+1}. {item.get('name', 'Item')} (Score: {item.get('score', 'N/A')})")
                            else:
                                message_parts.append(f"  {i+1}. {item}")
                else:
                    message_parts.append(f"• {key}: {value}")
        
        agent_message = "\n".join(message_parts)
        
        # Send notification
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{NOTIFICATION_SERVICE_URL}/api/notifications",
                json={
                    "user_id": submission["user_id"],
                    "type": "agent_completion",
                    "title": f"🤖 {agent_name} Agent Completed",
                    "message": agent_message,
                    "contact_type": submission["contact_type"],
                    "contact_value": submission["contact_value"],
                    "user_name": submission["user_name"]
                }
            )
            
            if response.status_code == 200:
                logger.info(f"Agent notification sent for {agent_name} in submission {submission_id}")
            else:
                logger.error(f"Failed to send agent notification for {agent_name}: {response.status_code}")
                
    except Exception as e:
        logger.error(f"Error sending agent notification for {agent_name}: {e}")

async def send_notification(submission_id: str):
    """Send notification to user via notification service"""
    submission = submissions_db[submission_id]
    
    step = WorkflowStep(
        step_id="notification",
        service="notification-service",
        status="processing",
        input_data={
            "user_name": submission["user_name"],
            "contact_type": submission["contact_type"],
            "contact_value": submission["contact_value"]
        }
    )
    
    submission["workflow_steps"].append(step.dict())
    
    try:
        # Prepare notification message with comprehensive results from all agents
        results = submission["results"]
        message_parts = []
        
        # Add comprehensive AI analysis results
        message_parts.append("🤖 **COMPREHENSIVE AI ANALYSIS RESULTS**")
        message_parts.append("=" * 50)
        message_parts.append("")
        
        # Add Document AI results
        if "document_analysis" in results:
            doc_ai = results["document_analysis"]
            message_parts.append("📄 **Document AI Analysis:**")
            message_parts.append(f"• Status: {doc_ai.get('status', 'N/A')}")
            message_parts.append(f"• Analysis ID: {doc_ai.get('analysis_id', 'N/A')}")
            if doc_ai.get('results'):
                message_parts.append(f"• Extracted Text: {str(doc_ai['results'])[:200]}...")
            message_parts.append(f"• Processing Time: {doc_ai.get('processing_time', 0):.3f}s")
            message_parts.append("")
        
        # Add NLP analysis results
        if "nlp_analysis" in results:
            nlp = results["nlp_analysis"]
            message_parts.append("🧠 **NLP Analysis Results:**")
            message_parts.append(f"• Status: {nlp.get('status', 'N/A')}")
            if nlp.get('results'):
                nlp_results = nlp['results']
                message_parts.append(f"• Text Summary: {nlp_results.get('text_summary', 'N/A')[:200]}...")
                message_parts.append(f"• Key Insights: {', '.join(nlp_results.get('key_insights', [])[:3])}")
                message_parts.append(f"• Sentiment: {nlp_results.get('sentiment_analysis', {}).get('overall_sentiment', 'N/A')}")
                message_parts.append(f"• Topics: {', '.join(nlp_results.get('topic_categorization', [])[:5])}")
            message_parts.append(f"• Processing Time: {nlp.get('processing_time', 0):.3f}s")
            message_parts.append("")
        
        # Add Results Page information
        if "results_page_url" in submission:
            message_parts.append("📄 **Results Page Created:**")
            message_parts.append(f"• URL: {submission['results_page_url']}")
            message_parts.append(f"• Status: Available")
            message_parts.append("• View your comprehensive analysis results at the link above")
            message_parts.append("")
        
        # Add Prototype Generator results
        if "prototype" in results:
            prototype = results["prototype"]
            message_parts.append("🚀 **Prototype Generator Results:**")
            message_parts.append(f"• Status: {prototype.get('status', 'N/A')}")
            message_parts.append(f"• Generation ID: {prototype.get('generation_id', 'N/A')}")
            if prototype.get('results'):
                proto_results = prototype['results']
                message_parts.append(f"• Type: {proto_results.get('type', 'N/A')}")
                message_parts.append(f"• Complexity: {proto_results.get('complexity', 'N/A')}")
                message_parts.append(f"• Estimated Time: {proto_results.get('estimated_time', 'N/A')}")
                message_parts.append(f"• Tech Stack: {', '.join(proto_results.get('tech_stack', [])[:5])}")
            message_parts.append(f"• Processing Time: {prototype.get('processing_time', 0):.3f}s")
            message_parts.append("")
        
        # Add workflow summary
        workflow_steps = submission.get("workflow_steps", [])
        completed_steps = [step for step in workflow_steps if step.get("status") == "completed"]
        message_parts.append("📊 **Workflow Summary:**")
        message_parts.append(f"• Total Steps: {len(workflow_steps)}")
        message_parts.append(f"• Completed: {len(completed_steps)}")
        message_parts.append(f"• Success Rate: {len(completed_steps)/len(workflow_steps)*100:.1f}%")
        message_parts.append("")
        
        # Add prototype results URL
        if submission.get("results_page_url"):
            results_page_url = submission["results_page_url"]
            message_parts.append("🔗 **View Your Prototype Results:**")
            message_parts.append(f"[Click here to view your prototype results]({results_page_url})")
            message_parts.append("")
        
        message_parts.append("✅ **Your comprehensive analysis is complete! We'll contact you soon with next steps.**")
        
        notification_message = "\n".join(message_parts)
        
        # Send notification
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{NOTIFICATION_SERVICE_URL}/api/notifications",
                json={
                    "user_id": submission["user_id"],
                    "type": "prototype_ready",
                    "title": "🚀 Your StateX Prototype is Ready!",
                    "message": notification_message,
                    "contact_type": submission["contact_type"],
                    "contact_value": submission["contact_value"],
                    "user_name": submission["user_name"],
                    "prototype_id": submission.get("prototype_id", f"proto_{submission_id}"),
                    "results_page_url": submission.get("results_page_url", f"http://localhost:3000/prototype-results/proto_{submission_id}")
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                step.status = "completed"
                step.output_data = result
                step.processing_time = 0  # Notification is usually instant
                
                logger.info(f"Notification sent successfully for submission {submission_id}")
                
                # Send individual agent notification for notification service
                await send_agent_notification(
                    submission_id=submission_id,
                    agent_name="Notification Service",
                    service_name="notification-service",
                    input_data={
                        "user_name": submission["user_name"],
                        "contact_type": submission["contact_type"],
                        "contact_value": submission["contact_value"]
                    },
                    output_data=result,
                    processing_time=0
                )
            else:
                step.status = "failed"
                step.error_message = f"Notification service error: {response.status_code}"
                logger.error(f"Notification failed for submission {submission_id}: {response.status_code}")
                
    except Exception as e:
        step.status = "failed"
        step.error_message = str(e)
        logger.error(f"Notification error for submission {submission_id}: {e}")

@app.get("/api/status/{submission_id}", response_model=SubmissionStatusResponse)
@app.head("/api/status/{submission_id}")
async def get_submission_status(submission_id: str):
    """Get the status of a submission"""
    if submission_id not in submissions_db:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    submission = submissions_db[submission_id]
    
    # Calculate progress
    total_steps = len(submission["workflow_steps"])
    completed_steps = len([step for step in submission["workflow_steps"] if step.get("status") == "completed"])
    progress = (completed_steps / total_steps * 100) if total_steps > 0 else 0
    
    # Get current step
    current_step = "pending"
    for step in submission["workflow_steps"]:
        if step.get("status") == "processing":
            current_step = step.get("step_id", "unknown")
            break
        elif step.get("status") == "completed":
            current_step = step.get("step_id", "unknown")
    
    return SubmissionStatusResponse(
        submission_id=submission_id,
        status=submission["status"],
        progress=progress,
        current_step=current_step,
        workflow_steps=[WorkflowStep(**step) for step in submission["workflow_steps"]],
        results=submission["results"] if submission["status"] == SubmissionStatus.COMPLETED else None,
        prototype_id=submission.get("prototype_id"),
        results_page_url=submission.get("results_page_url"),
        created_at=submission["created_at"],
        updated_at=submission["updated_at"]
    )

@app.get("/api/results/{submission_id}")
@app.head("/api/results/{submission_id}")
async def get_submission_results(submission_id: str):
    """Get the final results of a submission"""
    if submission_id not in submissions_db:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    submission = submissions_db[submission_id]
    
    if submission["status"] != SubmissionStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Submission not ready for results")
    
    return {
        "submission_id": submission_id,
        "status": submission["status"],
        "results": submission["results"],
        "workflow_steps": submission["workflow_steps"],
        "prototype_id": submission.get("prototype_id"),
        "results_page_url": submission.get("results_page_url"),
        "created_at": submission["created_at"],
        "updated_at": submission["updated_at"]
    }

@app.get("/api/results/prototype/{prototype_id}")
async def get_results_by_prototype_id(prototype_id: str):
    """Get results by prototype ID"""
    # Find submission by prototype_id
    matching_submission = None
    for submission_id, submission in submissions_db.items():
        if submission.get("prototype_id") == prototype_id:
            matching_submission = submission
            break
    
    if not matching_submission:
        raise HTTPException(status_code=404, detail="Prototype not found")
    
    # Return the full submission data for the results page
    return {
        "submission_id": list(submissions_db.keys())[list(submissions_db.values()).index(matching_submission)],
        "prototype_id": prototype_id,
        "status": matching_submission["status"],
        "text_content": matching_submission.get("text_content", ""),
        "voice_file_url": matching_submission.get("voice_file_url"),
        "file_urls": matching_submission.get("file_urls", []),
        "contact_info": matching_submission.get("contact_info", {}),
        "requirements": matching_submission.get("requirements", ""),
        "results": matching_submission["results"],
        "workflow_steps": matching_submission["workflow_steps"],
        "results_page_data": matching_submission.get("results_page_data"),
        "results_page_url": matching_submission.get("results_page_url"),
        "created_at": matching_submission["created_at"],
        "updated_at": matching_submission["updated_at"]
    }

@app.get("/api/submissions")
async def get_all_submissions():
    """Get all submissions (for admin panel)"""
    return {
        "submissions": list(submissions_db.values()),
        "total": len(submissions_db)
    }

class PrototypeGenerationRequest(BaseModel):
    """Request model for prototype generation"""
    user_id: str
    submission_id: str
    description: str
    analysis: Dict[str, Any] = {}
    prototype_type: str = "website"
    customization_level: str = "basic"

@app.post("/api/prototype/generate")
async def generate_prototype_endpoint(request: PrototypeGenerationRequest, background_tasks: BackgroundTasks):
    """Generate a website prototype using AI workflow"""
    try:
        logger.info(f"Starting prototype generation for user {request.user_id}")
        
        # Create workflow
        workflow = await multi_agent_orchestrator.workflow_engine.create_workflow(
            submission_id=request.submission_id,
            workflow_type="prototype_generation",
            input_data={
                "user_id": request.user_id,
                "submission_id": request.submission_id,
                "description": request.description,
                "analysis": request.analysis,
                "prototype_type": request.prototype_type,
                "customization_level": request.customization_level
            }
        )
        
        # Execute workflow in background
        background_tasks.add_task(
            multi_agent_orchestrator.workflow_engine.execute_workflow,
            workflow.workflow_id
        )
        
        return {
            "success": True,
            "workflow_id": workflow.workflow_id,
            "submission_id": request.submission_id,
            "status": "queued",
            "message": "Prototype generation started",
            "estimated_completion_time": "2-5 minutes"
        }
        
    except Exception as e:
        logger.error(f"Error starting prototype generation: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start prototype generation: {str(e)}")

@app.get("/api/prototype/status/{workflow_id}")
async def get_prototype_status(workflow_id: str):
    """Get status of prototype generation workflow"""
    try:
        workflow_state = await multi_agent_orchestrator.workflow_engine.get_workflow_status(workflow_id)
        
        if not workflow_state:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        # Extract prototype results from agent results
        prototype_results = {}
        for task_id, result in workflow_state.agent_results.items():
            if result.agent_type == "workflow-coordinator" and result.status.value == "completed":
                prototype_results = result.result_data or {}
                break
        
        return {
            "workflow_id": workflow_id,
            "status": workflow_state.status.value,
            "progress": workflow_state.progress,
            "prototype_results": prototype_results,
            "created_at": workflow_state.start_time.isoformat(),
            "updated_at": workflow_state.end_time.isoformat() if workflow_state.end_time else None
        }
        
    except Exception as e:
        logger.error(f"Error getting prototype status: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get prototype status: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
