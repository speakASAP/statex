#!/usr/bin/env python3
"""
StateX Platform Management Service
Central orchestration and coordination hub
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import os
import logging
import httpx
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models for API requests
class NotificationRequest(BaseModel):
    user_id: str
    type: str
    title: str
    message: str
    contact_type: str
    contact_value: str
    user_name: str

class PrototypeRequest(BaseModel):
    name: Optional[str] = None
    contactType: str
    contactValue: str
    description: str
    hasRecording: bool = False
    recordingTime: int = 0
    files: List[Dict[str, Any]] = []
    voiceRecording: Optional[Dict[str, Any]] = None
    userId: Optional[str] = None
    submissionId: Optional[str] = None

class NotificationResponse(BaseModel):
    success: bool
    notificationId: Optional[str] = None
    message: str
    error: Optional[str] = None

# Configuration
NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8005")
NOTIFICATION_SERVICE_API_KEY = os.getenv("NOTIFICATION_SERVICE_API_KEY", "dev-notification-api-key")

# Create FastAPI app
app = FastAPI(
    title="StateX Platform Management",
    description="Central orchestration and coordination hub for StateX services",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "StateX Platform Management",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "platform-management",
        "port": 8000
    }

@app.get("/status")
async def get_status():
    """Get platform status"""
    return {
        "platform": "StateX",
        "status": "operational",
        "services": {
            "platform-management": "running",
            "api-gateway": "running"
        }
    }

# Notification endpoints
@app.post("/api/notifications", response_model=NotificationResponse)
async def send_notification(notification: NotificationRequest):
    """Send notification via notification service"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{NOTIFICATION_SERVICE_URL}/api/notifications",
                json={
                    "user_id": notification.user_id,
                    "type": notification.type,
                    "title": notification.title,
                    "message": notification.message,
                    "contact_type": notification.contact_type,
                    "contact_value": notification.contact_value,
                    "user_name": notification.user_name
                },
                headers={
                    "Authorization": f"Bearer {NOTIFICATION_SERVICE_API_KEY}",
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                result = response.json()
                return NotificationResponse(
                    success=True,
                    notificationId=result.get("id"),
                    message="Notification sent successfully"
                )
            else:
                return NotificationResponse(
                    success=False,
                    message=f"Notification service error: {response.status_code}",
                    error=f"HTTP {response.status_code}"
                )
                
    except Exception as e:
        logger.error(f"Failed to send notification: {e}")
        return NotificationResponse(
            success=False,
            message="Failed to send notification",
            error=str(e)
        )

@app.post("/api/notifications/prototype-request", response_model=NotificationResponse)
async def send_prototype_request(request: PrototypeRequest):
    """Send prototype request notification with enhanced formatting"""
    try:
        # Format the notification message similar to the frontend service
        file_details = ""
        if request.files:
            file_details = "\n📁 *Attached Files:*\n"
            for i, file in enumerate(request.files, 1):
                file_size = file.get('fileSize', file.get('size', 0))
                file_size_kb = round(file_size / 1024) if file_size else 0
                file_details += f"{i}. {file.get('originalName', file.get('name', 'Unknown'))} ({file_size_kb}KB, {file.get('type', 'unknown')})\n"

        voice_details = ""
        if request.voiceRecording and request.hasRecording:
            voice_size = request.voiceRecording.get('size', 0)
            voice_size_kb = round(voice_size / 1024) if voice_size else 0
            voice_details = f"\n🎤 *Voice Recording:*\nDuration: {request.recordingTime}s, Size: {voice_size_kb}KB, Type: {request.voiceRecording.get('type', 'undefined')}\n"

        disk_info = ""
        if request.submissionId:
            disk_info = f"\n💾 *Saved to Disk:*\nSession: {request.submissionId}\nPath: data/uploads/{request.submissionId}\n"

        message = f"""🚀 *New Prototype Request Received*

👤 *Customer:* {request.name or 'Not provided'}
📞 *Contact:* {request.contactValue} ({request.contactType})
📝 *Description:* {request.description}
{file_details}{voice_details}{disk_info}

We'll contact you via {request.contactType} for updates on your prototype.

Best regards,
The Statex Team"""

        # Send notification
        notification_request = NotificationRequest(
            user_id=request.userId or "frontend-user",
            type="prototype_request",
            title="New Prototype Request - StateX",
            message=message,
            contact_type=request.contactType,
            contact_value=request.contactValue,
            user_name=request.name or "User"
        )
        
        return await send_notification(notification_request)
        
    except Exception as e:
        logger.error(f"Failed to send prototype request notification: {e}")
        return NotificationResponse(
            success=False,
            message="Failed to send prototype request notification",
            error=str(e)
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
