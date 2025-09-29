"""
StateX Platform HTTP Clients

HTTP clients for communicating with external microservices.
Provides unified interface for service-to-service communication.
"""

import httpx
import asyncio
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
import os

logger = logging.getLogger(__name__)

class BaseServiceClient:
    """Base class for service HTTP clients"""
    
    def __init__(self, base_url: str, timeout: int = 30, retries: int = 3):
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.retries = retries
        self.client = None
    
    async def __aenter__(self):
        self.client = httpx.AsyncClient(timeout=self.timeout)
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.client:
            await self.client.aclose()
    
    async def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Make HTTP request with retry logic"""
        url = f"{self.base_url}{endpoint}"
        
        for attempt in range(self.retries):
            try:
                response = await self.client.request(method, url, **kwargs)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                logger.warning(f"HTTP request failed (attempt {attempt + 1}/{self.retries}): {e}")
                if attempt == self.retries - 1:
                    raise
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
        
        raise Exception("All retry attempts failed")

class AIServiceClient(BaseServiceClient):
    """Client for communicating with StateX AI services"""
    
    def __init__(self):
        ai_base_url = os.getenv("AI_SERVICES_BASE_URL", os.getenv("AI_ORCHESTRATOR_URL", "http://ai-orchestrator:8000"))
        super().__init__(ai_base_url)
    
    async def process_submission(self, submission_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process user submission through AI services"""
        return await self._make_request("POST", "/api/process-submission", json=submission_data)
    
    async def get_submission_status(self, submission_id: str) -> Dict[str, Any]:
        """Get submission processing status"""
        return await self._make_request("GET", f"/api/status/{submission_id}")
    
    async def get_submission_results(self, submission_id: str) -> Dict[str, Any]:
        """Get final submission results"""
        return await self._make_request("GET", f"/api/results/{submission_id}")
    
    async def health_check(self) -> Dict[str, Any]:
        """Check AI services health"""
        return await self._make_request("GET", "/health")

class NotificationServiceClient(BaseServiceClient):
    """Client for communicating with StateX Notification Service"""
    
    def __init__(self):
        notification_base_url = os.getenv("NOTIFICATION_SERVICE_URL", "http://notification-service:8005")
        super().__init__(notification_base_url)
    
    async def send_notification(self, notification_data: Dict[str, Any]) -> Dict[str, Any]:
        """Send notification via external notification service"""
        return await self._make_request("POST", "/api/notifications", json=notification_data)
    
    async def get_notification_status(self, notification_id: str) -> Dict[str, Any]:
        """Get notification status"""
        return await self._make_request("GET", f"/api/notifications/{notification_id}")
    
    async def health_check(self) -> Dict[str, Any]:
        """Check notification service health"""
        return await self._make_request("GET", "/health")

class WebsiteServiceClient(BaseServiceClient):
    """Client for communicating with StateX Website services"""
    
    def __init__(self):
        website_base_url = os.getenv("WEBSITE_SERVICES_URL", "http://user-portal:8006")
        super().__init__(website_base_url)
    
    async def get_user_portal_data(self, user_id: str) -> Dict[str, Any]:
        """Get user portal data"""
        return await self._make_request("GET", f"/api/users/{user_id}")
    
    async def get_content_data(self, content_id: str) -> Dict[str, Any]:
        """Get content data"""
        content_url = os.getenv("CONTENT_SERVICE_URL", "http://content-service:8009")
        async with BaseServiceClient(content_url) as client:
            return await client._make_request("GET", f"/api/content/{content_id}")
    
    async def health_check(self) -> Dict[str, Any]:
        """Check website services health"""
        return await self._make_request("GET", "/health")

class MonitoringServiceClient(BaseServiceClient):
    """Client for communicating with StateX Monitoring services"""
    
    def __init__(self):
        monitoring_base_url = os.getenv("MONITORING_SERVICE_URL", "http://monitoring-service:8007")
        super().__init__(monitoring_base_url)
    
    async def send_metrics(self, metrics_data: Dict[str, Any]) -> Dict[str, Any]:
        """Send metrics to monitoring service"""
        return await self._make_request("POST", "/metrics", json=metrics_data)
    
    async def send_logs(self, log_data: Dict[str, Any]) -> Dict[str, Any]:
        """Send logs to monitoring service"""
        logging_url = os.getenv("LOGGING_SERVICE_URL", "http://logging-service:8008")
        async with BaseServiceClient(logging_url) as client:
            return await client._make_request("POST", "/api/logs", json=log_data)
    
    async def get_system_status(self) -> Dict[str, Any]:
        """Get overall system status"""
        return await self._make_request("GET", "/api/status")
    
    async def health_check(self) -> Dict[str, Any]:
        """Check monitoring services health"""
        return await self._make_request("GET", "/health")

class ServiceOrchestrator:
    """Orchestrator for managing all external service communications"""
    
    def __init__(self):
        self.ai_client = AIServiceClient()
        self.notification_client = NotificationServiceClient()
        self.website_client = WebsiteServiceClient()
        self.monitoring_client = MonitoringServiceClient()
    
    async def process_user_submission(self, submission_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process user submission through all relevant services"""
        try:
            # Start AI processing
            async with self.ai_client as ai:
                ai_result = await ai.process_submission(submission_data)
            
            # Send initial notification
            async with self.notification_client as notification:
                notification_data = {
                    "user_id": submission_data.get("user_id"),
                    "type": "confirmation",
                    "title": "Submission Received",
                    "message": "Your submission is being processed by our AI agents.",
                    "contact_type": submission_data.get("contact_type", "email"),
                    "contact_value": submission_data.get("contact_value"),
                    "user_name": submission_data.get("user_name")
                }
                await notification.send_notification(notification_data)
            
            # Send metrics
            async with self.monitoring_client as monitoring:
                metrics_data = {
                    "service": "submission-service",
                    "event": "submission_processed",
                    "timestamp": datetime.now().isoformat(),
                    "data": {"submission_id": ai_result.get("submission_id")}
                }
                await monitoring.send_metrics(metrics_data)
            
            return ai_result
            
        except Exception as e:
            logger.error(f"Error processing submission: {e}")
            # Send error notification
            try:
                async with self.notification_client as notification:
                    error_notification = {
                        "user_id": submission_data.get("user_id"),
                        "type": "error",
                        "title": "Processing Error",
                        "message": "There was an error processing your submission. Please try again.",
                        "contact_type": submission_data.get("contact_type", "email"),
                        "contact_value": submission_data.get("contact_value"),
                        "user_name": submission_data.get("user_name")
                    }
                    await notification.send_notification(error_notification)
            except Exception as notification_error:
                logger.error(f"Failed to send error notification: {notification_error}")
            
            raise
    
    async def check_all_services_health(self) -> Dict[str, Any]:
        """Check health of all external services"""
        health_status = {}
        
        try:
            async with self.ai_client as ai:
                health_status["ai_services"] = await ai.health_check()
        except Exception as e:
            health_status["ai_services"] = {"status": "unhealthy", "error": str(e)}
        
        try:
            async with self.notification_client as notification:
                health_status["notification_service"] = await notification.health_check()
        except Exception as e:
            health_status["notification_service"] = {"status": "unhealthy", "error": str(e)}
        
        try:
            async with self.website_client as website:
                health_status["website_services"] = await website.health_check()
        except Exception as e:
            health_status["website_services"] = {"status": "unhealthy", "error": str(e)}
        
        try:
            async with self.monitoring_client as monitoring:
                health_status["monitoring_services"] = await monitoring.health_check()
        except Exception as e:
            health_status["monitoring_services"] = {"status": "unhealthy", "error": str(e)}
        
        return health_status
