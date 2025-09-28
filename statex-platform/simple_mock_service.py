#!/usr/bin/env python3
"""
Simple Mock Service for StateX Platform
Handles all missing endpoints in one service
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uuid
import uvicorn

app = FastAPI(title="Mock StateX Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "mock-statex-service", "timestamp": datetime.now().isoformat()}

# AI Service endpoints (port 8010)
@app.post("/api/process-submission")
async def process_submission(request: Request):
    """Mock AI processing endpoint"""
    try:
        data = await request.json()
        analysis_id = str(uuid.uuid4())
        
        return JSONResponse(status_code=200, content={
            "success": True,
            "analysis_id": analysis_id,
            "status": "completed",
            "analysis": {
                "summary": "Mock AI analysis completed successfully",
                "requirements": ["User wants to create a web application"],
                "recommendations": ["Use React/Next.js for frontend"],
                "complexity": "medium",
                "estimated_development_time": "2-3 weeks"
            },
            "prototype_info": {
                "status": "ready",
                "url": f"https://mock-prototype-{analysis_id}.statex.cz"
            },
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

# Notification Service endpoints (port 8005)
@app.post("/api/notifications")
async def send_notification(request: Request):
    """Mock notification endpoint"""
    try:
        data = await request.json()
        notification_id = str(uuid.uuid4())
        
        return JSONResponse(status_code=200, content={
            "success": True,
            "message": f"Mock notification sent successfully via {data.get('contact_type', 'unknown')}",
            "notification_id": notification_id,
            "status": "sent",
            "channel": data.get('contact_type', 'unknown'),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

if __name__ == "__main__":
    print("🚀 Starting Simple Mock StateX Service...")
    print("Running on port 8010 (AI service)")
    print("Health check: http://localhost:8010/health")
    print("AI endpoint: http://localhost:8010/api/process-submission")
    print("Notification endpoint: http://localhost:8010/api/notifications")
    print()
    
    uvicorn.run(app, host="0.0.0.0", port=8010, log_level="info")
