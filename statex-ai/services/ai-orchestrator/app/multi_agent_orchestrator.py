"""
Multi-Agent AI Orchestrator

Enhanced orchestrator that integrates with the workflow engine to coordinate
multiple AI agents for business analysis and offer generation.
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union
import httpx
import os
from pydantic import BaseModel

from .workflow_engine import (
    WorkflowEngine, AgentTask, AgentResult, AgentInterface, 
    WorkflowState, TaskStatus, WorkflowStatus, workflow_engine
)
from .workflow_persistence import workflow_persistence
from .workflow_recovery import workflow_recovery_manager, CheckpointType
from .error_handling import (
    ErrorContext, ErrorRecoveryManager, error_recovery_manager,
    ErrorType, ErrorSeverity, RetryStrategy
)
from .business_analysis_aggregator import business_analysis_aggregator, BusinessAnalysisResult
from .project_url_generator import project_url_generator, ProjectURLs
from .offer_formatter import offer_formatter, FormattedOffer

logger = logging.getLogger(__name__)

class MultiAgentRequest(BaseModel):
    """Request for multi-agent processing"""
    submission_id: str
    user_id: str
    text_content: Optional[str] = None
    voice_file_url: Optional[str] = None
    file_urls: List[str] = []
    contact_info: Dict[str, Any] = {}
    workflow_type: str = "business_analysis"
    priority: int = 1

class BusinessAnalysis(BaseModel):
    """Comprehensive business analysis result"""
    project_scope: str = ""
    technology_stack: List[str] = []
    timeline_estimate: str = ""
    budget_range: str = ""
    risk_factors: List[str] = []
    market_insights: str = ""
    recommendations: List[str] = []
    confidence_score: float = 0.0

class OfferDetails(BaseModel):
    """Business offer details"""
    project_id: str
    plan_url: str
    offer_url: str
    pricing_tiers: List[Dict[str, Any]] = []
    implementation_phases: List[Dict[str, Any]] = []
    deliverables: List[str] = []
    next_steps: List[str] = []

class WorkflowResult(BaseModel):
    """Complete workflow execution result"""
    submission_id: str
    workflow_id: str
    total_agents: int
    successful_agents: int
    failed_agents: int
    processing_time: float
    business_analysis: BusinessAnalysisResult
    offer_details: OfferDetails
    agent_results: Dict[str, AgentResult] = {}

# AI Agent Implementations
class NLPAgent(AgentInterface):
    """NLP Analysis Agent"""
    
    def __init__(self):
        super().__init__("NLP Analysis Agent", "nlp")
        self.service_url = os.getenv("NLP_SERVICE_URL", "http://localhost:8011")
    
    async def execute_task(self, task: AgentTask) -> AgentResult:
        """Execute NLP analysis task with error handling and recovery"""
        context = ErrorContext(
            submission_id=task.input_data.get("submission_id", "unknown"),
            agent_type=self.agent_type,
            task_id=task.task_id,
            service_url=self.service_url,
            operation="nlp_analysis",
            input_data=task.input_data
        )
        
        async def nlp_operation():
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.service_url}/api/analyze-text",
                    json=task.input_data
                )
                
                if response.status_code == 200:
                    result_data = response.json()
                    
                    # Save agent result to file
                    await self._save_agent_result(task, result_data)
                    
                    return AgentResult(
                        task_id=task.task_id,
                        agent_type=self.agent_type,
                        agent_name=self.agent_name,
                        status=TaskStatus.COMPLETED,
                        result_data=result_data,
                        confidence_score=result_data.get("confidence", 0.8),
                        processing_time=result_data.get("processing_time", 0)
                    )
                else:
                    raise httpx.HTTPStatusError(
                        f"NLP service error: {response.status_code}",
                        request=response.request,
                        response=response
                    )
        
        try:
            # Execute the operation directly
            return await nlp_operation()
        except Exception as e:
            # If all recovery attempts fail, return failed result
            return AgentResult(
                task_id=task.task_id,
                agent_type=self.agent_type,
                agent_name=self.agent_name,
                status=TaskStatus.FAILED,
                error_message=str(e)
            )
    
    async def health_check(self) -> bool:
        """Check NLP service health"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.service_url}/health")
                return response.status_code == 200
        except:
            return False

class ASRAgent(AgentInterface):
    """Automatic Speech Recognition Agent"""
    
    def __init__(self):
        super().__init__("ASR Agent", "asr")
        self.service_url = os.getenv("ASR_SERVICE_URL", "http://localhost:8012")
    
    async def execute_task(self, task: AgentTask) -> AgentResult:
        """Execute ASR transcription task with error handling and recovery"""
        context = ErrorContext(
            submission_id=task.input_data.get("submission_id", "unknown"),
            agent_type=self.agent_type,
            task_id=task.task_id,
            service_url=self.service_url,
            operation="asr_transcription",
            input_data=task.input_data
        )
        
        async def asr_operation():
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.service_url}/api/transcribe",
                    json=task.input_data
                )
                
                if response.status_code == 200:
                    result_data = response.json()
                    
                    # Save agent result to file
                    await self._save_agent_result(task, result_data)
                    
                    return AgentResult(
                        task_id=task.task_id,
                        agent_type=self.agent_type,
                        agent_name=self.agent_name,
                        status=TaskStatus.COMPLETED,
                        result_data=result_data,
                        confidence_score=result_data.get("confidence", 0.7),
                        processing_time=result_data.get("processing_time", 0)
                    )
                else:
                    raise httpx.HTTPStatusError(
                        f"ASR service error: {response.status_code}",
                        request=response.request,
                        response=response
                    )
        
        try:
            # Execute the operation directly
            return await asr_operation()
        except Exception as e:
            # If all recovery attempts fail, return failed result
            return AgentResult(
                task_id=task.task_id,
                agent_type=self.agent_type,
                agent_name=self.agent_name,
                status=TaskStatus.FAILED,
                error_message=str(e)
            )
    
    async def health_check(self) -> bool:
        """Check ASR service health"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.service_url}/health")
                return response.status_code == 200
        except:
            return False

class DocumentAgent(AgentInterface):
    """Document Analysis Agent"""
    
    def __init__(self):
        super().__init__("Document AI Agent", "document")
        self.service_url = os.getenv("DOCUMENT_AI_URL", "http://localhost:8013")
    
    async def execute_task(self, task: AgentTask) -> AgentResult:
        """Execute document analysis task"""
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.service_url}/api/analyze-documents",
                    json=task.input_data
                )
                
                if response.status_code == 200:
                    result_data = response.json()
                    
                    # Save agent result to file
                    await self._save_agent_result(task, result_data)
                    
                    return AgentResult(
                        task_id=task.task_id,
                        agent_type=self.agent_type,
                        agent_name=self.agent_name,
                        status=TaskStatus.COMPLETED,
                        result_data=result_data,
                        confidence_score=result_data.get("confidence", 0.6),
                        processing_time=result_data.get("processing_time", 0)
                    )
                else:
                    return AgentResult(
                        task_id=task.task_id,
                        agent_type=self.agent_type,
                        agent_name=self.agent_name,
                        status=TaskStatus.FAILED,
                        error_message=f"Document AI service error: {response.status_code}"
                    )
                    
        except Exception as e:
            return AgentResult(
                task_id=task.task_id,
                agent_type=self.agent_type,
                agent_name=self.agent_name,
                status=TaskStatus.FAILED,
                error_message=str(e)
            )
    
    async def health_check(self) -> bool:
        """Check Document AI service health"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.service_url}/health")
                return response.status_code == 200
        except:
            return False

class PrototypeAgent(AgentInterface):
    """Prototype Generation Agent"""
    
    def __init__(self):
        super().__init__("Prototype Generator Agent", "prototype")
        self.service_url = os.getenv("PROTOTYPE_GENERATOR_URL", "http://localhost:8014")
    
    async def execute_task(self, task: AgentTask) -> AgentResult:
        """Execute prototype generation task"""
        try:
            async with httpx.AsyncClient(timeout=180.0) as client:
                response = await client.post(
                    f"{self.service_url}/api/generate-prototype",
                    json=task.input_data
                )
                
                if response.status_code == 200:
                    result_data = response.json()
                    
                    # Save agent result to file
                    await self._save_agent_result(task, result_data)
                    
                    return AgentResult(
                        task_id=task.task_id,
                        agent_type=self.agent_type,
                        agent_name=self.agent_name,
                        status=TaskStatus.COMPLETED,
                        result_data=result_data,
                        confidence_score=result_data.get("confidence", 0.9),
                        processing_time=result_data.get("processing_time", 0)
                    )
                else:
                    return AgentResult(
                        task_id=task.task_id,
                        agent_type=self.agent_type,
                        agent_name=self.agent_name,
                        status=TaskStatus.FAILED,
                        error_message=f"Prototype service error: {response.status_code}"
                    )
                    
        except Exception as e:
            return AgentResult(
                task_id=task.task_id,
                agent_type=self.agent_type,
                agent_name=self.agent_name,
                status=TaskStatus.FAILED,
                error_message=str(e)
            )
    
    async def health_check(self) -> bool:
        """Check Prototype Generator service health"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.service_url}/health")
                return response.status_code == 200
        except:
            return False

class SummarizerAgent(AgentInterface):
    """Summarizer Agent - Aggregates all analysis results into a comprehensive summary"""
    
    def __init__(self):
        super().__init__("Summarizer Agent", "summarizer")
        self.service_url = os.getenv("NLP_SERVICE_URL", "http://localhost:8011")
    
    async def execute_task(self, task: AgentTask) -> AgentResult:
        """Execute summarization task"""
        try:
            # Read individual agent result files
            collected_data = await self._read_agent_result_files(task)
            
            # Create a comprehensive summary prompt
            summary_prompt = self._create_summary_prompt(collected_data)
            
            # Use the NLP service (which now points to free-ai-service) for summarization
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.service_url}/api/analyze-text",
                    json={
                        "text_content": summary_prompt,
                        "analysis_type": "business_analysis",
                        "user_name": "AI Summarizer"
                    }
                )
                
                if response.status_code == 200:
                    result_data = response.json()
                    
                    # Extract the summary from the analysis result
                    analysis = result_data.get("analysis", {})
                    summary_text = analysis.get("summary", "No summary available")
                    
                    # Create a structured summary result
                    summary_result = {
                        "summary_text": summary_text,
                        "tokens_used": result_data.get("tokens_used", 0),
                        "model_used": analysis.get("model_used", "unknown"),
                        "ai_service": analysis.get("ai_service", "unknown"),
                        "confidence": analysis.get("confidence", 0.8),
                        "processing_time": result_data.get("processing_time", 0),
                        "collected_insights": {
                            "nlp_analysis": collected_data.get("nlp_analysis", {}),
                            "asr_transcript": collected_data.get("asr_transcript", ""),
                            "document_analysis": collected_data.get("document_analysis", {})
                        }
                    }
                    
                    # Save agent result to file
                    await self._save_agent_result(task, summary_result)
                    
                    return AgentResult(
                        task_id=task.task_id,
                        agent_type=self.agent_type,
                        agent_name=self.agent_name,
                        status=TaskStatus.COMPLETED,
                        result_data=summary_result,
                        confidence_score=analysis.get("confidence", 0.8),
                        processing_time=result_data.get("processing_time", 0)
                    )
                else:
                    return AgentResult(
                        task_id=task.task_id,
                        agent_type=self.agent_type,
                        agent_name=self.agent_name,
                        status=TaskStatus.FAILED,
                        error_message=f"Summarizer service error: {response.status_code}"
                    )
                    
        except Exception as e:
            return AgentResult(
                task_id=task.task_id,
                agent_type=self.agent_type,
                agent_name=self.agent_name,
                status=TaskStatus.FAILED,
                error_message=str(e)
            )
    
    async def _read_agent_result_files(self, task: AgentTask) -> Dict[str, Any]:
        """Read individual agent result files from the session directory"""
        collected_data = {}
        
        try:
            # Get submission ID from task context
            submission_id = task.input_data.get("submission_id")
            if not submission_id:
                logger.warning("No submission_id found in task input_data")
                return collected_data
            
            # Get submission service URL
            submission_service_url = os.getenv("SUBMISSION_SERVICE_URL", "http://submission-service:8002")
            
            # Read each agent result file
            agent_files = {
                "nlp": "nlp.md",
                "asr": "voicerecording.md", 
                "document": "attachments.md",
                "prototype": "prototype.md"
            }
            
            for agent_type, filename in agent_files.items():
                try:
                    # Make a request to get the agent result file content
                    async with httpx.AsyncClient(timeout=30.0) as client:
                        # For now, we'll use a simple approach - in production, you'd want a proper file API
                        # This is a placeholder - the actual implementation would depend on your file storage system
                        logger.info(f"Reading {agent_type} result file for submission {submission_id}")
                        
                        # For now, return empty data - in production, implement proper file reading
                        collected_data[f"{agent_type}_analysis"] = {}
                        
                except Exception as e:
                    logger.warning(f"Failed to read {agent_type} result file: {e}")
                    collected_data[f"{agent_type}_analysis"] = {}
            
            return collected_data
            
        except Exception as e:
            logger.error(f"Error reading agent result files: {e}")
            return collected_data
    
    def _create_summary_prompt(self, collected_data: Dict[str, Any]) -> str:
        """Create a comprehensive summary prompt from collected analysis data"""
        prompt_parts = []
        prompt_parts.append("Please create a comprehensive summary of the following AI analysis results:")
        prompt_parts.append("")
        
        # Add NLP analysis
        if collected_data.get("nlp_analysis"):
            nlp = collected_data["nlp_analysis"]
            prompt_parts.append("## NLP Analysis Results:")
            prompt_parts.append(f"- Summary: {nlp.get('summary', 'N/A')}")
            prompt_parts.append(f"- Key Insights: {', '.join(nlp.get('key_insights', []))}")
            prompt_parts.append(f"- Recommendations: {', '.join(nlp.get('recommendations', []))}")
            prompt_parts.append("")
        
        # Add ASR transcript
        if collected_data.get("asr_transcript"):
            prompt_parts.append("## Voice Recording Transcript:")
            prompt_parts.append(collected_data["asr_transcript"])
            prompt_parts.append("")
        
        # Add document analysis
        if collected_data.get("document_analysis"):
            doc = collected_data["document_analysis"]
            prompt_parts.append("## Document Analysis Results:")
            prompt_parts.append(f"- Extracted Text: {doc.get('extracted_text', 'N/A')[:500]}...")
            prompt_parts.append(f"- Analysis: {doc.get('analysis', 'N/A')}")
            prompt_parts.append("")
        
        prompt_parts.append("Please provide a comprehensive summary that:")
        prompt_parts.append("1. Synthesizes all the analysis results into a coherent overview")
        prompt_parts.append("2. Highlights the key findings and recommendations")
        prompt_parts.append("3. Provides actionable next steps for the user")
        prompt_parts.append("4. Maintains a professional and clear tone")
        prompt_parts.append("5. Keeps the summary concise but comprehensive (2-3 paragraphs)")
        prompt_parts.append("6. Focuses on the business requirements and technical approach for prototype development")
        
        return "\n".join(prompt_parts)
    
    async def health_check(self) -> bool:
        """Check Summarizer service health"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.service_url}/health")
                return response.status_code == 200
        except:
            return False

class MultiAgentOrchestrator:
    """Enhanced orchestrator for multi-agent workflows"""
    
    def __init__(self):
        self.workflow_engine = workflow_engine
        self.persistence = workflow_persistence
        self.notification_service_url = os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8005")
        
        # Register agents
        self._register_agents()
        
        # Register workflow definitions
        self._register_workflows()
    
    def _register_agents(self):
        """Register all AI agents with the workflow engine"""
        agents = [
            NLPAgent(),
            ASRAgent(),
            DocumentAgent(),
            PrototypeAgent(),
            SummarizerAgent()
        ]
        
        for agent in agents:
            self.workflow_engine.register_agent(agent)
    
    def _register_workflows(self):
        """Register workflow definitions"""
        self.workflow_engine.register_workflow("business_analysis", self._business_analysis_workflow)
        self.workflow_engine.register_workflow("document_processing", self._document_processing_workflow)
        self.workflow_engine.register_workflow("voice_analysis", self._voice_analysis_workflow)
        self.workflow_engine.register_workflow("prototype_generation", self._prototype_generation_workflow)
    
    async def process_multi_agent_request(self, request: MultiAgentRequest) -> WorkflowResult:
        """Process a multi-agent request through the workflow engine with comprehensive error handling"""
        workflow_state = None
        try:
            # Connect to persistence if not already connected
            if not self.persistence.redis_client:
                await self.persistence.connect()
            
            # Create workflow
            workflow_state = await self.workflow_engine.create_workflow(
                submission_id=request.submission_id,
                workflow_type=request.workflow_type,
                input_data=request.dict()
            )
            
            # Save initial state and create initial checkpoint
            await self.persistence.save_workflow_state(workflow_state)
            await workflow_recovery_manager.create_checkpoint(
                workflow_state,
                CheckpointType.WORKFLOW_PHASE,
                {"phase": "workflow_started", "request_type": request.workflow_type}
            )
            
            # Execute workflow with error handling
            start_time = datetime.now()
            
            try:
                completed_workflow = await self.workflow_engine.execute_workflow(workflow_state.workflow_id)
                processing_time = (datetime.now() - start_time).total_seconds()
                
                # Create completion checkpoint
                await workflow_recovery_manager.create_checkpoint(
                    completed_workflow,
                    CheckpointType.WORKFLOW_PHASE,
                    {"phase": "workflow_completed", "processing_time": processing_time}
                )
                
            except Exception as workflow_error:
                # Handle workflow execution errors
                logger.error(f"Workflow execution failed for {request.submission_id}: {workflow_error}")
                
                # Try to recover the workflow
                context = ErrorContext(
                    submission_id=request.submission_id,
                    workflow_id=workflow_state.workflow_id,
                    operation="workflow_execution",
                    input_data=request.dict()
                )
                
                try:
                    # Attempt workflow recovery
                    recovered_workflow = await workflow_recovery_manager.recover_workflow(
                        workflow_state.workflow_id
                    )
                    
                    if recovered_workflow:
                        completed_workflow = recovered_workflow
                        processing_time = (datetime.now() - start_time).total_seconds()
                        logger.info(f"Successfully recovered workflow {workflow_state.workflow_id}")
                    else:
                        raise workflow_error
                        
                except Exception as recovery_error:
                    logger.error(f"Workflow recovery failed: {recovery_error}")
                    raise workflow_error
            
            # Save final state
            await self.persistence.save_workflow_state(completed_workflow)
            
            # Generate business analysis and offer with error handling
            try:
                business_analysis_result = await self._generate_business_analysis(completed_workflow)
                offer_details = await self._generate_offer_details(request.submission_id, business_analysis_result)
            except Exception as analysis_error:
                logger.error(f"Business analysis generation failed: {analysis_error}")
                # Use fallback analysis
                business_analysis_result = await business_analysis_aggregator._create_fallback_analysis(completed_workflow)
                offer_details = await self._generate_simple_offer_fallback(request.submission_id, business_analysis_result)
            
            # Create result
            successful_agents = len([r for r in completed_workflow.agent_results.values() 
                                  if r.status == TaskStatus.COMPLETED])
            failed_agents = len([r for r in completed_workflow.agent_results.values() 
                               if r.status == TaskStatus.FAILED])
            
            result = WorkflowResult(
                submission_id=request.submission_id,
                workflow_id=completed_workflow.workflow_id,
                total_agents=len(completed_workflow.agent_results),
                successful_agents=successful_agents,
                failed_agents=failed_agents,
                processing_time=processing_time,
                business_analysis=business_analysis_result,
                offer_details=offer_details,
                agent_results=completed_workflow.agent_results
            )
            
            # Send notifications for each agent result
            try:
                await self._send_agent_notifications(request, completed_workflow)
            except Exception as notification_error:
                logger.error(f"Failed to send agent notifications: {notification_error}")
                # Don't fail the entire workflow for notification errors
            
            # Persist summary if summarizer agent completed successfully
            try:
                await self._persist_summary_if_available(request, completed_workflow)
            except Exception as summary_error:
                logger.error(f"Failed to persist summary: {summary_error}")
                # Don't fail the entire workflow for summary persistence errors
            
            return result
            
        except Exception as e:
            logger.error(f"Multi-agent processing failed for {request.submission_id}: {e}")
            
            # Mark workflow as failed if we have a workflow state
            if workflow_state:
                workflow_state.status = WorkflowStatus.FAILED
                workflow_state.end_time = datetime.now()
                await self.persistence.save_workflow_state(workflow_state)
                
                # Create failure checkpoint
                await workflow_recovery_manager.create_checkpoint(
                    workflow_state,
                    CheckpointType.ERROR_RECOVERY,
                    {"error": str(e), "failure_reason": "multi_agent_processing_failed"}
                )
            
            raise
    
    async def _business_analysis_workflow(self, input_data: Dict[str, Any]) -> List[AgentTask]:
        """Define the business analysis workflow tasks"""
        tasks = []
        
        # Task 1: Process voice if available
        if input_data.get("voice_file_url"):
            asr_task = AgentTask(
                agent_type="asr",
                agent_name="ASR Agent",
                input_data={"voice_file_url": input_data["voice_file_url"]},
                priority=2,
                timeout=60
            )
            tasks.append(asr_task)
        
        # Task 2: Process documents if available
        if input_data.get("file_urls"):
            doc_task = AgentTask(
                agent_type="document",
                agent_name="Document AI Agent",
                input_data={"file_urls": input_data["file_urls"]},
                priority=2,
                timeout=120
            )
            tasks.append(doc_task)
        
        # Task 3: NLP analysis (depends on ASR if voice is present)
        nlp_dependencies = []
        if input_data.get("voice_file_url") and tasks:
            nlp_dependencies.append(tasks[0].task_id)  # ASR task
        
        nlp_task = AgentTask(
            agent_type="nlp",
            agent_name="NLP Analysis Agent",
            input_data={
                "text_content": input_data.get("text_content", ""),
                "requirements": input_data.get("requirements", "")
            },
            priority=1,
            timeout=45,
            dependencies=nlp_dependencies
        )
        tasks.append(nlp_task)
        
        # Task 4: Summarizer (depends on all analysis tasks)
        summarizer_dependencies = [nlp_task.task_id]
        if input_data.get("voice_file_url") and tasks:
            summarizer_dependencies.append(tasks[0].task_id)  # ASR task
        if input_data.get("file_urls") and len(tasks) > 1:
            summarizer_dependencies.append(tasks[1].task_id)  # Document task
        
        summarizer_task = AgentTask(
            agent_type="summarizer",
            agent_name="Summarizer Agent",
            input_data={
                "collected_data": {
                    "nlp_analysis": {},  # Will be filled from NLP results
                    "asr_transcript": "",  # Will be filled from ASR results
                    "document_analysis": {},  # Will be filled from Document results
                }
            },
            priority=1,
            timeout=120,
            dependencies=summarizer_dependencies
        )
        tasks.append(summarizer_task)
        
        # Task 5: Prototype generation (depends on Summarizer)
        prototype_task = AgentTask(
            agent_type="prototype",
            agent_name="Prototype Generator Agent",
            input_data={
                "requirements": input_data.get("requirements", ""),
                "analysis": {},  # Will be filled from NLP results
                "summary": {}  # Will be filled from Summarizer results
            },
            priority=1,
            timeout=180,
            dependencies=[summarizer_task.task_id]
        )
        tasks.append(prototype_task)
        
        return tasks
    
    async def _document_processing_workflow(self, input_data: Dict[str, Any]) -> List[AgentTask]:
        """Define document-focused workflow"""
        tasks = []
        
        if input_data.get("file_urls"):
            doc_task = AgentTask(
                agent_type="document",
                agent_name="Document AI Agent",
                input_data={"file_urls": input_data["file_urls"]},
                priority=1,
                timeout=120
            )
            tasks.append(doc_task)
            
            # Follow up with NLP analysis of extracted text
            nlp_task = AgentTask(
                agent_type="nlp",
                agent_name="NLP Analysis Agent",
                input_data={
                    "text_content": "",  # Will be filled from document results
                    "requirements": input_data.get("requirements", "")
                },
                priority=1,
                timeout=45,
                dependencies=[doc_task.task_id]
            )
            tasks.append(nlp_task)
        
        return tasks
    
    async def _voice_analysis_workflow(self, input_data: Dict[str, Any]) -> List[AgentTask]:
        """Define voice-focused workflow"""
        tasks = []
        
        if input_data.get("voice_file_url"):
            asr_task = AgentTask(
                agent_type="asr",
                agent_name="ASR Agent",
                input_data={"voice_file_url": input_data["voice_file_url"]},
                priority=1,
                timeout=60
            )
            tasks.append(asr_task)
            
            # Follow up with NLP analysis of transcription
            nlp_task = AgentTask(
                agent_type="nlp",
                agent_name="NLP Analysis Agent",
                input_data={
                    "text_content": "",  # Will be filled from ASR results
                    "requirements": input_data.get("requirements", "")
                },
                priority=1,
                timeout=45,
                dependencies=[asr_task.task_id]
            )
            tasks.append(nlp_task)
        
        return tasks
    
    async def _prototype_generation_workflow(self, input_data: Dict[str, Any]) -> List[AgentTask]:
        """Define prototype generation workflow tasks"""
        tasks = []
        
        # Task 1: Generate prototype using prototype generator
        prototype_task = AgentTask(
            agent_type="prototype_generator",
            agent_name="Prototype Generator Agent",
            input_data={
                "project_id": input_data.get("project_id"),
                "description": input_data.get("description"),
                "requirements": input_data.get("requirements"),
                "ai_analysis": input_data.get("ai_analysis", {}),
                "user_id": input_data.get("user_id"),
                "submission_id": input_data.get("submission_id")
            },
            priority=1,
            timeout=300  # 5 minutes for prototype generation
        )
        tasks.append(prototype_task)
        
        return tasks
    
    async def _generate_business_analysis(self, workflow_state: WorkflowState) -> BusinessAnalysisResult:
        """Generate comprehensive business analysis from agent results using the aggregator"""
        try:
            # Use the comprehensive business analysis aggregator
            analysis_result = await business_analysis_aggregator.aggregate_business_analysis(workflow_state)
            return analysis_result
        except Exception as e:
            logger.error(f"Failed to generate business analysis: {e}")
            # Fallback to basic analysis
            return await business_analysis_aggregator._create_fallback_analysis(workflow_state)
    
    async def _generate_offer_details(self, submission_id: str, analysis: BusinessAnalysisResult) -> OfferDetails:
        """Generate detailed business offer with comprehensive formatting"""
        try:
            # Generate unique project ID and URLs
            project_urls = await project_url_generator.create_and_validate_project_urls(
                submission_id=submission_id,
                user_id=submission_id  # Use submission_id as user_id for now
            )
            
            # Create comprehensive formatted offer
            formatted_offer = offer_formatter.format_comprehensive_offer(
                analysis=analysis,
                project_urls={
                    "plan_url": project_urls.plan_url,
                    "offer_url": project_urls.offer_url
                }
            )
            
            # Convert formatted offer to OfferDetails for compatibility
            pricing_tiers = []
            for tier in formatted_offer.pricing_tiers:
                pricing_tiers.append({
                    "name": tier.name,
                    "price": tier.price_range,
                    "features": tier.features,
                    "description": tier.description,
                    "timeline": tier.timeline,
                    "support_level": tier.support_level,
                    "recommended": tier.recommended
                })
            
            # Convert deliverables to simple list for compatibility
            deliverables = []
            for category in formatted_offer.deliverables:
                deliverables.extend(category.items)
            
            # Convert next steps to simple list
            next_steps = [step.action for step in formatted_offer.next_steps]
            
            offer = OfferDetails(
                project_id=project_urls.project_id,
                plan_url=project_urls.plan_url,
                offer_url=project_urls.offer_url,
                pricing_tiers=pricing_tiers,
                implementation_phases=formatted_offer.implementation_phases,
                deliverables=deliverables,
                next_steps=next_steps
            )
            
            return offer
        except Exception as e:
            logger.error(f"Error generating comprehensive offer: {e}")
            # Fallback to simple offer generation
            return await self._generate_simple_offer_fallback(submission_id, analysis)
    
    async def _generate_simple_offer_fallback(self, submission_id: str, analysis: BusinessAnalysisResult) -> OfferDetails:
        """Generate simple offer as fallback when comprehensive formatting fails"""
        try:
            project_urls = await project_url_generator.create_and_validate_project_urls(
                submission_id=submission_id,
                user_id=submission_id
            )
            
            return OfferDetails(
                project_id=project_urls.project_id,
                plan_url=project_urls.plan_url,
                offer_url=project_urls.offer_url,
                pricing_tiers=[{
                    "name": "Standard",
                    "price": analysis.budget_range,
                    "features": ["Complete solution", "Full support"],
                    "recommended": True
                }],
                implementation_phases=[{
                    "phase": "Development",
                    "duration": analysis.timeline_estimate,
                    "deliverables": ["Working software", "Documentation"]
                }],
                deliverables=[
                    "Complete source code",
                    "Technical documentation",
                    "3 months support"
                ],
                next_steps=[
                    "Schedule consultation",
                    "Review requirements",
                    "Begin development"
                ]
            )
        except Exception as e:
            logger.error(f"Error in fallback offer generation: {e}")
            raise
            
    
    async def _send_agent_notifications(self, request: MultiAgentRequest, workflow_state: WorkflowState):
        """Send individual notifications for each agent result"""
        try:
            for task_id, result in workflow_state.agent_results.items():
                await self._send_single_agent_notification(request, result)
        except Exception as e:
            logger.error(f"Failed to send agent notifications: {e}")
    
    async def _send_single_agent_notification(self, request: MultiAgentRequest, result: AgentResult):
        """Send notification for a single agent result"""
        try:
            message_parts = []
            message_parts.append(f"🤖 **{result.agent_name} Report**")
            message_parts.append(f"📋 Service: {result.agent_type}")
            message_parts.append(f"⏱️ Processing Time: {result.processing_time:.2f}s")
            message_parts.append(f"✅ Status: {result.status.value.upper()}")
            message_parts.append(f"🎯 Confidence: {result.confidence_score:.1%}")
            message_parts.append("")
            
            if result.status == TaskStatus.COMPLETED and result.result_data:
                message_parts.append("📤 **Results:**")
                for key, value in result.result_data.items():
                    if isinstance(value, str) and len(value) > 100:
                        message_parts.append(f"• {key}: {value[:100]}...")
                    elif isinstance(value, dict):
                        message_parts.append(f"• {key}: {len(value)} items")
                    elif isinstance(value, list):
                        message_parts.append(f"• {key}: {len(value)} items")
                    else:
                        message_parts.append(f"• {key}: {value}")
            
            if result.error_message:
                message_parts.append(f"❌ **Error:** {result.error_message}")
            
            notification_message = "\n".join(message_parts)
            
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{self.notification_service_url}/api/notifications",
                    json={
                        "user_id": request.user_id,
                        "type": "agent_completion",
                        "title": f"🤖 {result.agent_name} Completed",
                        "message": notification_message,
                        "contact_type": "telegram",
                        "contact_value": request.contact_info.get("email", "694579866"),
                        "user_name": request.contact_info.get("name", "User")
                    }
                )
                
        except Exception as e:
            logger.error(f"Failed to send notification for {result.agent_name}: {e}")
    
    async def get_workflow_status(self, workflow_id: str) -> Optional[WorkflowState]:
        """Get workflow status"""
        return await self.workflow_engine.get_workflow_status(workflow_id)
    
    async def cancel_workflow(self, workflow_id: str) -> bool:
        """Cancel a running workflow"""
        return await self.workflow_engine.cancel_workflow(workflow_id)
    
    async def _persist_summary_if_available(self, request: MultiAgentRequest, workflow_state: WorkflowState):
        """Persist summary to submission service if summarizer agent completed successfully"""
        # Find summarizer agent result
        summarizer_result = None
        for task_id, result in workflow_state.agent_results.items():
            if result.agent_type == "summarizer" and result.status == TaskStatus.COMPLETED:
                summarizer_result = result
                break
        
        if not summarizer_result:
            logger.info(f"No summarizer result found for submission {request.submission_id}")
            return
        
        # Extract summary text and model information from the result
        summary_text = summarizer_result.result_data.get("summary_text", "")
        if not summary_text:
            logger.warning(f"No summary text found in summarizer result for submission {request.submission_id}")
            return
        
        model_used = summarizer_result.result_data.get("model_used", "unknown")
        tokens_used = summarizer_result.result_data.get("tokens_used", 0)
        processing_time = summarizer_result.result_data.get("processing_time", 0)
        
        # Call submission service to persist the summary
        submission_service_url = os.getenv("SUBMISSION_SERVICE_URL", "http://submission-service:8002")
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{submission_service_url}/api/submissions/{request.submission_id}/summary",
                    json={
                        "summary": summary_text,
                        "model_used": model_used,
                        "tokens_used": tokens_used,
                        "processing_time": processing_time
                    }
                )
                response.raise_for_status()
                logger.info(f"Successfully persisted summary for submission {request.submission_id} using model {model_used}")
        except Exception as e:
            logger.error(f"Failed to persist summary for submission {request.submission_id}: {e}")
            raise

# Global orchestrator instance
multi_agent_orchestrator = MultiAgentOrchestrator()