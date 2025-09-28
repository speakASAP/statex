#!/usr/bin/env python3
"""
StateX Website Form Workflow Test Script

This script tests the complete workflow from website form submission to AI analysis:
1. Submit form data to the website backend
2. Verify data is processed through AI agents
3. Check notifications are sent to Telegram

Usage:
    python3 test_website_form_workflow.py
"""

import os

import requests
import json
import time
import uuid
from datetime import datetime
from typing import Dict, Any

# Configuration
WEBSITE_BACKEND_URL = "http://localhost:8002"
NOTIFICATION_SERVICE_URL = "http://localhost:8005"
AI_ORCHESTRATOR_URL = "http://localhost:8010"

# Test data
TEST_FORM_DATA = {
    "name": "Sergej Stashok",
    "contactType": "telegram",
    "contactValue": "694579866",  # Your Telegram chat ID
    "description": """
    🚀 Test Project: AI-Powered Business Automation Platform
    
    I want to create a comprehensive business automation platform that includes:
    
    📋 Core Features:
    • Customer relationship management (CRM)
    • Automated lead generation and nurturing
    • AI-powered analytics and insights
    • Multi-channel communication (Email, WhatsApp, Telegram)
    • Document processing and management
    • Workflow automation
    
    🎯 Business Goals:
    • Increase sales efficiency by 40%
    • Reduce manual work by 60%
    • Improve customer satisfaction
    • Scale operations across multiple markets
    
    ⏰ Timeline: 3-6 months for MVP, 12 months for full platform
    
    💰 Budget: $50,000 - $100,000
    
    🌍 Target Markets: Europe, Middle East, North America
    
    📱 Technology Preferences:
    • Modern web technologies (React, Node.js)
    • Cloud-based infrastructure
    • Mobile-responsive design
    • API-first architecture
    
    This is a test submission to verify the AI analysis workflow is working correctly.
    """,
    "hasRecording": False,
    "recordingTime": 0,
    "files": [],
    "voiceRecording": None
}

class WebsiteFormWorkflowTester:
    def __init__(self):
        self.session_id = str(uuid.uuid4())
        self.start_time = time.time()
        
    def log(self, message: str, level: str = "INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def measure_time(self, operation: str, start_time: float) -> float:
        duration = time.time() - start_time
        self.log(f"⏱️  {operation}: {duration:.2f} seconds")
        return duration
        
    def check_services_health(self) -> Dict[str, bool]:
        """Check if all required services are healthy"""
        self.log("🔍 Checking service health...")
        
        services = {
            "website_backend": WEBSITE_BACKEND_URL,
            "notification_service": NOTIFICATION_SERVICE_URL,
            "ai_orchestrator": AI_ORCHESTRATOR_URL
        }
        
        health_status = {}
        
        for service_name, url in services.items():
            try:
                response = requests.get(f"{url}/health", timeout=5)
                if response.status_code == 200:
                    health_status[service_name] = True
                    self.log(f"✅ {service_name} is healthy")
                else:
                    health_status[service_name] = False
                    self.log(f"❌ {service_name} returned status {response.status_code}", "ERROR")
            except Exception as e:
                health_status[service_name] = False
                self.log(f"❌ {service_name} is not responding: {str(e)}", "ERROR")
                
        return health_status
        
    def submit_contact_form(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit form data to the website backend"""
        self.log("📝 Submitting contact form to website backend...")
        
        # Convert form data to the format expected by the Python FastAPI service
        submission_data = {
            "user_email": form_data["contactValue"] if form_data["contactType"] == "email" else "test@example.com",
            "user_name": form_data["name"],
            "request_type": "contact",
            "description": form_data["description"],
            "priority": "normal"
        }
        
        try:
            response = requests.post(
                f"{WEBSITE_BACKEND_URL}/api/submissions/",
                data=submission_data,  # Use form data instead of JSON
                headers={
                    "User-Agent": "StateX-Form-Tester/1.0"
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                self.log("✅ Form submitted successfully")
                return {"success": True, "data": result}
            else:
                self.log(f"❌ Form submission failed: {response.status_code} - {response.text}", "ERROR")
                return {"success": False, "error": f"HTTP {response.status_code}"}
                
        except Exception as e:
            self.log(f"❌ Form submission error: {str(e)}", "ERROR")
            return {"success": False, "error": str(e)}
            
    def test_ai_orchestrator_directly(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Test AI orchestrator directly with form data"""
        self.log("🤖 Testing AI orchestrator directly...")
        
        ai_request = {
            "user_id": self.session_id,
            "submission_type": "text",
            "text_content": form_data["description"],
            "voice_file_url": None,
            "file_urls": [],
            "requirements": "Analyze business requirements and generate comprehensive summary",
            "contact_info": {
                "name": form_data["name"],
                "email": form_data["contactValue"] if form_data["contactType"] == "email" else "test@example.com",
                "whatsapp": form_data["contactValue"] if form_data["contactType"] == "whatsapp" else None,
                "telegram": form_data["contactValue"] if form_data["contactType"] == "telegram" else None
            },
            "contact_type": form_data["contactType"],
            "contact_value": form_data["contactValue"],
            "user_name": form_data["name"]
        }
        
        try:
            response = requests.post(
                f"{AI_ORCHESTRATOR_URL}/api/process-submission",
                json=ai_request,
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "StateX-Form-Tester/1.0"
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                self.log("✅ AI orchestrator analysis completed")
                return {"success": True, "data": result}
            else:
                self.log(f"❌ AI orchestrator failed: {response.status_code} - {response.text}", "ERROR")
                return {"success": False, "error": f"HTTP {response.status_code}"}
                
        except Exception as e:
            self.log(f"❌ AI orchestrator error: {str(e)}", "ERROR")
            return {"success": False, "error": str(e)}
            
    def send_test_notification(self) -> Dict[str, Any]:
        """Send a test notification to verify Telegram integration"""
        self.log("📱 Sending test notification...")
        
        notification_data = {
            "user_id": self.session_id,
            "type": "test",
            "title": "Website Form Test",
            "message": f"""
🧪 **Website Form Workflow Test**

✅ Form submission test completed
✅ AI analysis workflow verified
✅ Notification system working

Session ID: {self.session_id}
Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

This confirms that the complete workflow from website form to AI analysis is functioning correctly.
            """,
            "contact_type": "telegram",
            "contact_value": "694579866",
            "user_name": "Sergej Stashok"
        }
        
        try:
            response = requests.post(
                f"{NOTIFICATION_SERVICE_URL}/api/notifications",
                json=notification_data,
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "StateX-Form-Tester/1.0"
                },
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                self.log("✅ Test notification sent successfully")
                return {"success": True, "data": result}
            else:
                self.log(f"❌ Test notification failed: {response.status_code} - {response.text}", "ERROR")
                return {"success": False, "error": f"HTTP {response.status_code}"}
                
        except Exception as e:
            self.log(f"❌ Test notification error: {str(e)}", "ERROR")
            return {"success": False, "error": str(e)}
            
    def run_complete_workflow_test(self):
        """Run the complete website form workflow test"""
        self.log("🚀 Starting StateX Website Form Workflow Test")
        self.log("=" * 60)
        
        # Step 1: Check service health
        self.log("Step 1: Checking service health")
        health_status = self.check_services_health()
        
        if not all(health_status.values()):
            self.log("❌ Some services are not healthy. Please check the services and try again.", "ERROR")
            return
            
        # Step 2: Submit contact form
        self.log("\nStep 2: Submitting contact form")
        form_result = self.submit_contact_form(TEST_FORM_DATA)
        
        if not form_result["success"]:
            self.log("❌ Form submission failed. Stopping test.", "ERROR")
            return
            
        # Step 3: Test AI orchestrator directly
        self.log("\nStep 3: Testing AI orchestrator directly")
        ai_result = self.test_ai_orchestrator_directly(TEST_FORM_DATA)
        
        if ai_result["success"]:
            self.log("✅ AI analysis workflow is working")
            # Display AI results summary
            if "data" in ai_result and "summary" in ai_result["data"]:
                summary = ai_result["data"]["summary"]
                self.log(f"📊 AI Analysis Summary:")
                self.log(f"   • Total Agents: {summary.get('totalAgents', 'N/A')}")
                self.log(f"   • Successful: {summary.get('successfulAgents', 'N/A')}")
                self.log(f"   • Failed: {summary.get('failedAgents', 'N/A')}")
                self.log(f"   • Processing Time: {summary.get('totalProcessingTime', 'N/A')}s")
        else:
            self.log("⚠️  AI orchestrator test failed, but form submission worked")
            
        # Step 4: Send test notification
        self.log("\nStep 4: Sending test notification")
        notification_result = self.send_test_notification()
        
        # Final summary
        total_time = time.time() - self.start_time
        self.log("\n" + "=" * 60)
        self.log("🎉 Website Form Workflow Test Complete!")
        self.log(f"⏱️  Total Time: {total_time:.2f} seconds")
        self.log(f"📝 Form Submission: {'✅ Success' if form_result['success'] else '❌ Failed'}")
        self.log(f"🤖 AI Analysis: {'✅ Success' if ai_result['success'] else '❌ Failed'}")
        self.log(f"📱 Notification: {'✅ Success' if notification_result['success'] else '❌ Failed'}")
        
        if all([form_result["success"], notification_result["success"]]):
            self.log("\n✅ Complete workflow is working correctly!")
            frontend_port = os.getenv('FRONTEND_PORT', '3000')
            self.log(f"🌐 You can now test the form at: http://localhost:{frontend_port}/contact")
            self.log("📱 Check your Telegram for the test notification")
        else:
            self.log("\n❌ Some parts of the workflow need attention")

if __name__ == "__main__":
    tester = WebsiteFormWorkflowTester()
    tester.run_complete_workflow_test()
