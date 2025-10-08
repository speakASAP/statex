"""
StateX Submission Service

Handles form submissions and file uploads for the StateX platform.
"""

import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
import sys
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib
import re
import json
from pathlib import Path

# Add shared directory to path dynamically
current_dir = Path(__file__).parent.resolve()
shared_dir = current_dir.parent.parent / "shared"
sys.path.append(str(shared_dir))
from http_clients import ServiceOrchestrator  # type: ignore
from storage.disk_storage import (
    get_base_dir,
    generate_user_and_session,
    ensure_session_dirs,
    write_form_markdown,
    save_upload_file,
    move_temp_files_from_metadata,
)

# Pydantic models for JSON API
class FileInfo(BaseModel):
    fileId: str
    originalName: str
    fileSize: int
    type: str
    tempSessionId: str

class VoiceRecording(BaseModel):
    fileId: str
    originalName: str
    fileSize: int
    recordingTime: int
    tempSessionId: str

class FormSubmissionRequest(BaseModel):
    name: Optional[str] = None
    contactType: str = "email"
    contactValue: str
    description: str
    hasRecording: bool = False
    recordingTime: int = 0
    files: List[FileInfo] = []
    voiceRecording: Optional[VoiceRecording] = None

class SummaryRequest(BaseModel):
    summary: str
    model_used: Optional[str] = None
    tokens_used: Optional[int] = None
    processing_time: Optional[float] = None

class AgentResultRequest(BaseModel):
    agent_type: str
    result_data: dict
    model_used: Optional[str] = None
    tokens_used: Optional[int] = None
    processing_time: Optional[float] = None

# Initialize FastAPI app
app = FastAPI(
    title="StateX Submission Service",
    description="Handles form submissions and file uploads for the StateX platform",
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

# In-memory storage for demo purposes
submissions_db = {}
files_db = {}

# Security configuration
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_EXTENSIONS = {'.pdf', '.txt', '.md', '.doc', '.docx', '.wav', '.mp3', '.webm', '.ogg'}
ALLOWED_MIME_TYPES = {
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'audio/wav',
    'audio/mpeg',
    'audio/webm',
    'audio/ogg'
}

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent directory traversal and other attacks"""
    # Remove path components
    filename = Path(filename).name
    # Remove or replace dangerous characters
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Limit length
    filename = filename[:100]
    return filename

def validate_file(file: UploadFile) -> tuple[bool, str]:
    """Validate uploaded file for security and size"""
    if not file.filename:
        return False, "No filename provided"
    
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        return False, f"File type {file_ext} not allowed"
    
    # Check MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        return False, f"MIME type {file.content_type} not allowed"
    
    # Note: File size check would be done during upload in production
    # For now, we'll trust the client size info
    
    return True, "Valid file"

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "submission-service",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0"
    }

@app.get("/health/external")
async def external_services_health():
    """Check health of all external services"""
    try:
        orchestrator = ServiceOrchestrator()
        health_status = await orchestrator.check_all_services_health()
        return {
            "status": "healthy",
            "service": "submission-service",
            "external_services": health_status,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "submission-service",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

@app.get("/health/ready")
async def readiness_check():
    """Readiness check endpoint"""
    return {
        "status": "ready",
        "service": "submission-service",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/api/submissions/")
async def create_submission(
    request: Request,
    user_email: str = Form(...),
    user_name: str = Form(...),
    request_type: str = Form(...),
    description: str = Form(...),
    priority: str = Form("normal"),
    contact_type: str = Form("email"),
    contact_value: str = Form(None),
    recording_time: str = Form("0"),
    voice_file: UploadFile = File(None),
    files: List[UploadFile] = File(None)
):
    """
    Create a new submission with optional file uploads
    """
    try:
        # Generate submission ID
        submission_id = str(uuid.uuid4())
        
        # Create submission record
        submission = {
            "id": submission_id,
            "user_email": user_email,
            "user_name": user_name,
            "request_type": request_type,
            "description": description,
            "priority": priority,
            "status": "submitted",
            "file_urls": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Prepare disk persistence
        base_dir = get_base_dir()
        user_id, session_id = generate_user_and_session(user_email, request)
        session_path, files_path = ensure_session_dirs(base_dir, user_id, session_id)
        saved_files = []

        # Handle voice file upload if present
        if voice_file and voice_file.filename:
            is_valid, error_msg = validate_file(voice_file)
            if not is_valid:
                raise HTTPException(status_code=400, detail=f"Invalid voice file: {error_msg}")
            
            # Sanitize filename
            safe_filename = sanitize_filename(voice_file.filename)
            
            # Generate file ID
            file_id = str(uuid.uuid4())
            file_extension = Path(safe_filename).suffix
            file_name = f"{file_id}{file_extension}"
            
            # Store file info
            file_info = {
                "id": file_id,
                "original_name": safe_filename,
                "stored_name": file_name,
                "content_type": voice_file.content_type,
                "size": 0,  # Would be calculated from actual file
                "submission_id": submission_id,
                "type": "voice",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            files_db[file_id] = file_info
            submission["file_urls"].append(f"/files/{file_id}")
            # Persist voice file to disk
            saved_meta = await save_upload_file(files_path, voice_file)
            saved_meta["id"] = file_id
            saved_meta["type"] = "voice"
            saved_files.append(saved_meta)

        # Handle file uploads if present
        if files:
            for file in files:
                if file.filename:
                    is_valid, error_msg = validate_file(file)
                    if not is_valid:
                        raise HTTPException(status_code=400, detail=f"Invalid file: {error_msg}")
                    
                    # Sanitize filename
                    safe_filename = sanitize_filename(file.filename)
                    
                    # Generate file ID
                    file_id = str(uuid.uuid4())
                    file_extension = Path(safe_filename).suffix
                    file_name = f"{file_id}{file_extension}"
                    
                    # Store file info (in production, this would be saved to MinIO/S3)
                    file_info = {
                        "id": file_id,
                        "original_name": safe_filename,
                        "stored_name": file_name,
                        "content_type": file.content_type,
                        "size": 0,  # Would be calculated from actual file
                        "submission_id": submission_id,
                        "type": "attachment",
                        "created_at": datetime.now(timezone.utc).isoformat()
                    }
                    
                    files_db[file_id] = file_info
                    submission["file_urls"].append(f"/files/{file_id}")
                    # Persist attachment to disk
                    saved_meta = await save_upload_file(files_path, file)
                    saved_meta["id"] = file_id
                    saved_meta["type"] = "attachment"
                    saved_files.append(saved_meta)
        
        # After saving files, write form markdown with file metadata
        write_form_markdown(
            session_path,
            {
                "request_type": request_type,
                "user_name": user_name,
                "user_email": user_email,
                "contact_type": contact_type,
                "contact_value": contact_value or user_email,
                "description": description,
                "has_voice": any(f.get("type") == "voice" for f in saved_files),
                "recording_time": int(recording_time) if recording_time.isdigit() else 0,
                "saved_files": saved_files,
                "form_url": request.headers.get("referer") or None,
                "session_id": session_id,
                "disk_path": str(session_path),
            },
        )

        # Store submission
        submissions_db[submission_id] = submission
        
        # Process submission through external services
        orchestrator = ServiceOrchestrator()
        ai_submission_data = {
            "user_id": submission_id,
            "submission_type": "text",
            "text_content": description,
            "requirements": f"Type: {request_type}, Priority: {priority}",
            "contact_info": {
                "email": user_email,
                "name": user_name
            },
            "contact_type": contact_type,
            "contact_value": contact_value or user_email,
            "user_name": user_name
        }
        
        # Process through AI services and send notifications
        ai_result = await orchestrator.process_user_submission(ai_submission_data)
        
        return JSONResponse(
            status_code=200,
            content={
                "id": submission_id,
                "status": "submitted",
                "message": "Submission received successfully and is being processed by AI agents",
                "file_urls": submission["file_urls"],
                "created_at": submission["created_at"],
                "ai_submission_id": ai_result.get("submission_id"),
                "estimated_completion_time": ai_result.get("estimated_completion_time"),
                # Disk persistence details for observability
                "disk_path": str(session_path),
                "user_id": user_id,
                "session_id": session_id,
                "saved_files": saved_files,
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create submission: {str(e)}")

@app.post("/api/submissions/json")
async def create_submission_json(request: FormSubmissionRequest):
    """
    Create a new submission using JSON format
    """
    try:
        # Generate submission ID
        submission_id = str(uuid.uuid4())
        
        # Determine request type based on form data
        request_type = "prototype" if "prototype" in request.description.lower() else "contact"
        
        # Create submission record
        submission = {
            "id": submission_id,
            "user_email": request.contactValue,
            "user_name": request.name or "Unknown",
            "request_type": request_type,
            "description": request.description,
            "priority": "normal",
            "status": "submitted",
            "file_urls": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Handle file URLs from uploaded files
        if request.files:
            for file_info in request.files:
                file_url = f"/files/{file_info.fileId}"
                submission["file_urls"].append(file_url)
        
        # Prepare disk persistence
        base_dir = get_base_dir()
        user_id, session_id = generate_user_and_session(request.contactValue, None)
        session_path, files_path = ensure_session_dirs(base_dir, user_id, session_id)
        
        # Move temp files to final location
        saved_files = move_temp_files_from_metadata(
            base_dir, user_id, session_id, 
            request.files, request.voiceRecording
        )
        
        # Write form markdown to disk including file metadata
        write_form_markdown(
            session_path,
            {
                "request_type": request_type,
                "user_name": request.name or "Unknown",
                "user_email": request.contactValue,
                "contact_type": request.contactType,
                "contact_value": request.contactValue,
                "description": request.description,
                "has_voice": bool(request.voiceRecording),
                "recording_time": request.voiceRecording.recordingTime if request.voiceRecording else 0,
                "saved_files": saved_files,
                "form_url": None,
            },
        )
        
        # Store submission
        submissions_db[submission_id] = submission
        
        # Process submission through external services
        orchestrator = ServiceOrchestrator()
        ai_submission_data = {
            "user_id": submission_id,
            "submission_type": "text",
            "text_content": request.description,
            "voice_file_url": f"/files/{request.voiceRecording.fileId}" if request.voiceRecording else None,
            "file_urls": submission["file_urls"],
            "requirements": f"Type: {request_type}, Priority: normal",
            "contact_info": {
                "name": request.name or "Unknown",
                "email": request.contactValue,
                "phone": None,
                "source": "website_contact_form",
                "form_type": request_type,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
        
        # Process through AI services and send notifications
        ai_result = await orchestrator.process_user_submission(ai_submission_data)
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "id": submission_id,
                "status": "submitted",
                "message": "Submission received successfully and is being processed by AI agents",
                "file_urls": submission["file_urls"],
                "created_at": submission["created_at"],
                "ai_submission_id": ai_result.get("submission_id"),
                "estimated_completion_time": ai_result.get("estimated_completion_time"),
                "disk_path": f"/app/data/uploads/{user_id}/{session_id}",
                "user_id": user_id,
                "session_id": session_id,
                "saved_files": saved_files
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create submission: {str(e)}")

@app.get("/api/submissions/{submission_id}")
async def get_submission(submission_id: str):
    """
    Get submission details by ID
    """
    if submission_id not in submissions_db:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return submissions_db[submission_id]

@app.get("/api/submissions/")
async def list_submissions(skip: int = 0, limit: int = 100):
    """
    List all submissions with pagination
    """
    submissions = list(submissions_db.values())
    return {
        "submissions": submissions[skip:skip + limit],
        "total": len(submissions),
        "skip": skip,
        "limit": limit
    }

@app.get("/files/{file_id}")
async def get_file(file_id: str):
    """
    Get file information by ID
    """
    if file_id not in files_db:
        raise HTTPException(status_code=404, detail="File not found")
    
    return files_db[file_id]

@app.delete("/api/submissions/{submission_id}")
async def delete_submission(submission_id: str):
    """
    Delete submission by ID
    """
    if submission_id not in submissions_db:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Remove associated files
    submission = submissions_db[submission_id]
    for file_url in submission["file_urls"]:
        file_id = file_url.split("/")[-1]
        if file_id in files_db:
            del files_db[file_id]
    
    # Remove submission
    del submissions_db[submission_id]
    
    return {"message": "Submission deleted successfully"}

@app.post("/api/submissions/{submission_id}/summary")
async def save_submission_summary(submission_id: str, request: SummaryRequest):
    """
    Save AI-generated summary for a submission
    """
    if submission_id not in submissions_db:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    try:
        # Get submission data to find the session path
        submission = submissions_db[submission_id]
        
        # Extract user_id and session_id from submission metadata if available
        # For now, we'll use a simple approach to find the session directory
        base_dir = get_base_dir()
        
        # Try to find the session directory by looking for form_data.md files
        # This is a simplified approach - in production, you'd want to store this info
        # Use contact_value if available, otherwise fall back to user_email
        contact_value = submission.get("contact_value", submission.get("user_email", "unknown"))
        user_id = hashlib.md5(contact_value.encode()).hexdigest()
        
        # Look for the most recent session for this user
        user_dir = base_dir / user_id
        if user_dir.exists():
            # Find the most recent session directory
            session_dirs = [d for d in user_dir.iterdir() if d.is_dir() and d.name.startswith("sess_")]
            if session_dirs:
                # Sort by modification time and get the most recent
                latest_session = max(session_dirs, key=lambda x: x.stat().st_mtime)
                session_path = latest_session
                
                # Write summary.md to the session directory
                summary_file = session_path / "summary.md"
                with open(summary_file, 'w', encoding='utf-8') as f:
                    f.write(f"# AI Analysis Summary\n\n")
                    f.write(f"**Generated:** {datetime.now(timezone.utc).isoformat()}\n\n")
                    f.write(f"**Submission ID:** {submission_id}\n\n")
                    if request.model_used:
                        f.write(f"**Model Used:** {request.model_used}\n\n")
                    if request.tokens_used:
                        f.write(f"**Tokens Used:** {request.tokens_used}\n\n")
                    if request.processing_time:
                        f.write(f"**Processing Time:** {request.processing_time:.2f} seconds\n\n")
                    f.write(f"## Summary\n\n{request.summary}\n\n")
                    f.write(f"## Performance Analysis\n\n")
                    f.write(f"This analysis was completed using AI models with the following performance characteristics:\n\n")
                    f.write(f"- **Model Performance:** {request.model_used if request.model_used else 'Unknown'}\n")
                    f.write(f"- **Total Processing Time:** {request.processing_time:.2f} seconds\n")
                    f.write(f"- **Token Efficiency:** {request.tokens_used if request.tokens_used else 'Unknown'} tokens used\n")
                    f.write(f"- **Cost per Token:** Available in individual agent result files\n\n")
                    f.write(f"*For detailed performance metrics of each agent, see the individual result files (nlp.md, voicerecording.md, attachments.md, prototype.md).*\n")
                
                return JSONResponse(
                    status_code=200,
                    content={
                        "success": True,
                        "message": "Summary saved successfully",
                        "summary_file": str(summary_file),
                        "submission_id": submission_id
                    }
                )
        
        # Fallback: create a new session directory
        user_id, session_id = generate_user_and_session(contact_value, None)
        session_path, files_path = ensure_session_dirs(base_dir, user_id, session_id)
        
        # Write summary.md to the session directory
        summary_file = session_path / "summary.md"
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write(f"# AI Analysis Summary\n\n")
            f.write(f"**Generated:** {datetime.now(timezone.utc).isoformat()}\n\n")
            f.write(f"**Submission ID:** {submission_id}\n\n")
            if request.model_used:
                f.write(f"**Model Used:** {request.model_used}\n\n")
            if request.tokens_used:
                f.write(f"**Tokens Used:** {request.tokens_used}\n\n")
            if request.processing_time:
                f.write(f"**Processing Time:** {request.processing_time:.2f} seconds\n\n")
            f.write(f"## Summary\n\n{request.summary}\n\n")
            f.write(f"## Performance Analysis\n\n")
            f.write(f"This analysis was completed using AI models with the following performance characteristics:\n\n")
            f.write(f"- **Model Performance:** {request.model_used if request.model_used else 'Unknown'}\n")
            f.write(f"- **Total Processing Time:** {request.processing_time:.2f} seconds\n")
            f.write(f"- **Token Efficiency:** {request.tokens_used if request.tokens_used else 'Unknown'} tokens used\n")
            f.write(f"- **Cost per Token:** Available in individual agent result files\n\n")
            f.write(f"*For detailed performance metrics of each agent, see the individual result files (nlp.md, voicerecording.md, attachments.md, prototype.md).*\n")
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Summary saved successfully",
                "summary_file": str(summary_file),
                "submission_id": submission_id
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save summary: {str(e)}")

@app.post("/api/submissions/{submission_id}/agent-result")
async def save_agent_result(submission_id: str, request: AgentResultRequest):
    """
    Save individual agent result to a specific .md file
    """
    if submission_id not in submissions_db:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    try:
        # Get submission data to find the session path
        submission = submissions_db[submission_id]
        
        # Extract user_id and session_id from submission metadata
        base_dir = get_base_dir()
        contact_value = submission.get("contact_value", submission.get("user_email", "unknown"))
        user_id = hashlib.md5(contact_value.encode()).hexdigest()
        
        # Look for the most recent session for this user
        user_dir = base_dir / user_id
        if user_dir.exists():
            # Find the most recent session directory
            session_dirs = [d for d in user_dir.iterdir() if d.is_dir() and d.name.startswith("sess_")]
            if session_dirs:
                # Sort by modification time and get the most recent
                latest_session = max(session_dirs, key=lambda x: x.stat().st_mtime)
                session_path = latest_session
                
                # Determine filename based on agent type
                filename_map = {
                    "nlp": "nlp.md",
                    "asr": "voicerecording.md", 
                    "document": "attachments.md",
                    "prototype": "prototype.md"
                }
                filename = filename_map.get(request.agent_type, f"{request.agent_type}.md")
                
                # Write agent result to the session directory
                result_file = session_path / filename
                with open(result_file, 'w', encoding='utf-8') as f:
                    f.write(f"# {request.agent_type.upper()} Agent Results\n\n")
                    f.write(f"**Generated:** {datetime.now(timezone.utc).isoformat()}\n\n")
                    f.write(f"**Submission ID:** {submission_id}\n\n")
                    f.write(f"**Agent Type:** {request.agent_type}\n\n")
                    if request.model_used:
                        f.write(f"**Model Used:** {request.model_used}\n\n")
                    if request.tokens_used:
                        f.write(f"**Tokens Used:** {request.tokens_used}\n\n")
                    if request.processing_time:
                        f.write(f"**Processing Time:** {request.processing_time:.2f} seconds\n\n")
                    f.write(f"## Results\n\n")
                    f.write(f"```json\n{json.dumps(request.result_data, indent=2)}\n```\n")
                
                return JSONResponse(
                    status_code=200,
                    content={
                        "success": True,
                        "message": f"{request.agent_type} result saved successfully",
                        "result_file": str(result_file),
                        "submission_id": submission_id
                    }
                )
        
        # Fallback: create a new session directory
        user_id, session_id = generate_user_and_session(contact_value, None)
        session_path, files_path = ensure_session_dirs(base_dir, user_id, session_id)
        
        # Determine filename based on agent type
        filename_map = {
            "nlp": "nlp.md",
            "asr": "voicerecording.md",
            "document": "attachments.md", 
            "prototype": "prototype.md"
        }
        filename = filename_map.get(request.agent_type, f"{request.agent_type}.md")
        
        # Write agent result to the session directory
        result_file = session_path / filename
        with open(result_file, 'w', encoding='utf-8') as f:
            f.write(f"# {request.agent_type.upper()} Agent Results\n\n")
            f.write(f"**Generated:** {datetime.now(timezone.utc).isoformat()}\n\n")
            f.write(f"**Submission ID:** {submission_id}\n\n")
            f.write(f"**Agent Type:** {request.agent_type}\n\n")
            if request.model_used:
                f.write(f"**Model Used:** {request.model_used}\n\n")
            if request.tokens_used:
                f.write(f"**Tokens Used:** {request.tokens_used}\n\n")
            if request.processing_time:
                f.write(f"**Processing Time:** {request.processing_time:.2f} seconds\n\n")
            f.write(f"## Results\n\n")
            f.write(f"```json\n{json.dumps(request.result_data, indent=2)}\n```\n")
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": f"{request.agent_type} result saved successfully",
                "result_file": str(result_file),
                "submission_id": submission_id
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save agent result: {str(e)}")

# Forms API endpoints for website integration
@app.post("/api/forms/upload-files")
async def upload_files(request: Request, file: UploadFile = File(...)):
    """
    Handle file uploads for the prototype form
    """
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        # Get client IP and user agent for session management
        ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        
        # Generate user ID and session ID based on IP and user agent
        user_identifier = f"{ip}_{user_agent}"
        user_id = hashlib.md5(user_identifier.encode()).hexdigest()
        session_id = f"temp_{user_id}"
        
        # Generate file ID and store file info
        file_id = str(uuid.uuid4())
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
        stored_name = f"{file_id}.{file_extension}"
        
        # Read file content (in production, this would be saved to MinIO/S3)
        file_content = await file.read()
        file_size = len(file_content)
        
        # Store file info
        file_info = {
            "id": file_id,
            "original_name": file.filename,
            "stored_name": stored_name,
            "content_type": file.content_type,
            "size": file_size,
            "user_id": user_id,
            "session_id": session_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        files_db[file_id] = file_info
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "File uploaded successfully",
                "fileId": stored_name,
                "originalName": file.filename,
                "fileSize": file_size,
                "tempSessionId": session_id
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@app.post("/api/forms/upload-voice")
async def upload_voice(request: Request, file: UploadFile = File(...)):
    """
    Handle voice recording uploads
    """
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No voice recording uploaded")
        
        # Get client IP and user agent for session management
        ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        
        # Generate user ID and session ID based on IP and user agent
        user_identifier = f"{ip}_{user_agent}"
        user_id = hashlib.md5(user_identifier.encode()).hexdigest()
        session_id = f"temp_{user_id}"
        
        # Generate file ID and store file info
        file_id = str(uuid.uuid4())
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'webm'
        stored_name = f"{file_id}.{file_extension}"
        
        # Read file content (in production, this would be saved to MinIO/S3)
        file_content = await file.read()
        file_size = len(file_content)
        
        # Store file info
        file_info = {
            "id": file_id,
            "original_name": file.filename,
            "stored_name": stored_name,
            "content_type": file.content_type,
            "size": file_size,
            "user_id": user_id,
            "session_id": session_id,
            "type": "voice",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        files_db[file_id] = file_info
        
        # Estimate recording time based on file size (rough approximation)
        recording_time = max(1, file_size // 16000)  # Rough estimate for audio
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Voice recording uploaded successfully",
                "fileId": stored_name,
                "originalName": file.filename,
                "fileSize": file_size,
                "recordingTime": recording_time,
                "tempSessionId": session_id
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload voice recording: {str(e)}")

@app.get("/api/forms/user-sessions/{user_id}")
async def get_user_sessions(user_id: str):
    """
    Get user sessions (for admin/debug purposes)
    """
    try:
        # Find all files for this user
        user_files = [file_info for file_info in files_db.values() if file_info.get("user_id") == user_id]
        
        # Group by session
        sessions = {}
        for file_info in user_files:
            session_id = file_info.get("session_id", "unknown")
            if session_id not in sessions:
                sessions[session_id] = {
                    "session_id": session_id,
                    "user_id": user_id,
                    "files": [],
                    "created_at": file_info["created_at"]
                }
            sessions[session_id]["files"].append(file_info)
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "sessions": list(sessions.values())
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user sessions: {str(e)}")

@app.post("/api/forms/cleanup-sessions")
async def cleanup_sessions():
    """
    Clean up old temporary sessions
    """
    try:
        # In a real implementation, this would clean up old sessions
        # For now, we'll just return success
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Sessions cleaned up successfully"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to cleanup sessions: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )
