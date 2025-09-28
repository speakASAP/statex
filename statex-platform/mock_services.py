#!/usr/bin/env python3
"""
Mock Services for StateX Platform
Provides mock endpoints for AI service (8010) and Notification service (8005)
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uuid
import uvicorn
import threading
import time

# Mock AI Service (Port 8010)
ai_app = FastAPI(title="Mock AI Service", version="1.0.0")

# CORS middleware for AI service
ai_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@ai_app.get("/health")
async def ai_health_check():
    return {"status": "healthy", "service": "mock-ai-service", "timestamp": datetime.now().isoformat()}

@ai_app.post("/api/process-submission")
async def process_submission(request: Request):
    """Mock AI processing endpoint"""
    try:
        data = await request.json()
        
        # Generate mock response
        analysis_id = str(uuid.uuid4())
        
        mock_response = {
            "success": True,
            "analysis_id": analysis_id,
            "status": "completed",
            "analysis": {
                "summary": "Mock AI analysis completed successfully",
                "requirements": [
                    "User wants to create a web application",
                    "Focus on user experience and modern design",
                    "Integration with external APIs required"
                ],
                "recommendations": [
                    "Use React/Next.js for frontend",
                    "Implement responsive design",
                    "Add authentication system"
                ],
                "complexity": "medium",
                "estimated_development_time": "2-3 weeks",
                "technologies": ["React", "Node.js", "PostgreSQL"]
            },
            "prototype_info": {
                "status": "ready",
                "url": f"https://mock-prototype-{analysis_id}.statex.cz",
                "features": ["User authentication", "Dashboard", "API integration"]
            },
            "timestamp": datetime.now().isoformat()
        }
        
        return JSONResponse(status_code=200, content=mock_response)
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": f"AI processing failed: {str(e)}"}
        )

# Mock Notification Service (Port 8005)
notification_app = FastAPI(title="Mock Notification Service", version="1.0.0")

# CORS middleware for notification service
notification_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@notification_app.get("/health")
async def notification_health_check():
    return {"status": "healthy", "service": "mock-notification-service", "timestamp": datetime.now().isoformat()}

@notification_app.post("/api/notifications")
async def send_notification(request: Request):
    """Mock notification endpoint"""
    try:
        data = await request.json()
        
        # Generate mock response
        notification_id = str(uuid.uuid4())
        
        mock_response = {
            "success": True,
            "message": f"Mock notification sent successfully via {data.get('contact_type', 'unknown')}",
            "notification_id": notification_id,
            "status": "sent",
            "channel": data.get('contact_type', 'unknown'),
            "timestamp": datetime.now().isoformat()
        }
        
        return JSONResponse(status_code=200, content=mock_response)
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": f"Notification failed: {str(e)}"}
        )

def run_ai_service():
    """Run AI service on port 8010"""
    print("🤖 Starting Mock AI Service on port 8010...")
    uvicorn.run(ai_app, host="0.0.0.0", port=8010, log_level="info")

def run_notification_service():
    """Run Notification service on port 8005"""
    print("📧 Starting Mock Notification Service on port 8005...")
    uvicorn.run(notification_app, host="0.0.0.0", port=8005, log_level="info")

if __name__ == "__main__":
    print("🚀 Starting Mock StateX Services...")
    print("AI Service: http://localhost:8010")
    print("Notification Service: http://localhost:8005")
    print("Health checks:")
    print("  - AI: http://localhost:8010/health")
    print("  - Notification: http://localhost:8005/health")
    print()
    
    # Start both services in separate threads
    ai_thread = threading.Thread(target=run_ai_service, daemon=True)
    notification_thread = threading.Thread(target=run_notification_service, daemon=True)
    
    ai_thread.start()
    time.sleep(1)  # Small delay between starts
    notification_thread.start()
    
    try:
        # Keep main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down mock services...")
