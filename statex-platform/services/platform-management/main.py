#!/usr/bin/env python3
"""
StateX Platform Management Service
Central orchestration and coordination hub
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
