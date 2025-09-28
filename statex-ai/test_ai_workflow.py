#!/usr/bin/env python3
"""
StateX AI Workflow Test

This script tests the complete AI workflow using the statex-ai microservice:
1. User submits contact form with text, voice, and file data
2. System sends initial confirmation notification
3. AI services analyze the submission (Free AI, NLP, ASR, Document AI)
4. System sends final AI analysis results notification

Usage:
    python3 test_ai_workflow.py                    # Interactive mode
    python3 test_ai_workflow.py --default          # Use default test data
    python3 test_ai_workflow.py --demo             # Run demo with sample data
"""

import requests
import json
import time
import uuid
import os
import sys
from datetime import datetime
from typing import Dict, Any, Optional, List
import asyncio
import aiohttp

# Configuration
NOTIFICATION_SERVICE_URL = "http://localhost:8005"  # Standalone notification service
AI_ORCHESTRATOR_URL = "http://localhost:8010"       # AI orchestrator
FREE_AI_SERVICE_URL = "http://localhost:8016"       # Free AI service
NLP_SERVICE_URL = "http://localhost:8011"           # NLP service
ASR_SERVICE_URL = "http://localhost:8012"           # ASR service
DOCUMENT_AI_URL = "http://localhost:8013"           # Document AI service

# Default test data
DEFAULT_TEST_DATA = {
    "user_name": "Sergej",
    "email": "ssfskype@gmail.com",
    "whatsapp": "+420774287541",
    "telegram_chat_id": "694579866",
    "text_content": "I want to create a website for my auto car repairing business. The website should have online booking, customer management, service history tracking, and payment processing. I also need a mobile app for my technicians to manage their schedules and update job statuses.",
    "voice_transcript": "Hi, I'm Sergej and I run an auto repair shop. I need a digital solution to modernize my business. My customers are always calling to book appointments and it's hard to keep track of everything. I want something that can handle online bookings, send reminders, track service history, and maybe even process payments. The system should work on both computer and mobile devices.",
    "file_content": "Business Requirements Document:\n\n1. Online Booking System\n   - Customer can book appointments 24/7\n   - Real-time availability calendar\n   - Email/SMS confirmations\n\n2. Customer Management\n   - Customer profiles with service history\n   - Vehicle information tracking\n   - Communication preferences\n\n3. Service Management\n   - Job tracking and status updates\n   - Parts inventory management\n   - Technician scheduling\n\n4. Payment Processing\n   - Online payment acceptance\n   - Invoice generation\n   - Payment history tracking\n\n5. Mobile Application\n   - Technician dashboard\n   - Real-time job updates\n   - Customer communication"
}

class StateXAIWorkflowTester:
    def __init__(self):
        self.session_id = str(uuid.uuid4())
        self.start_time = None
        self.results = {}
        self.ai_services_available = {}
        
    def log(self, message: str, level: str = "INFO"):
        """Log message with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def measure_time(self, operation: str, start_time: float):
        """Measure and log operation time"""
        duration = time.time() - start_time
        self.log(f"{operation} completed in {duration:.2f} seconds")
        return duration
        
    async def check_ai_services(self):
        """Check which AI services are available"""
        self.log("🔍 Checking StateX AI services availability...")
        
        services = {
            "ai_orchestrator": AI_ORCHESTRATOR_URL,
            "free_ai_service": FREE_AI_SERVICE_URL,
            "nlp_service": NLP_SERVICE_URL,
            "asr_service": ASR_SERVICE_URL,
            "document_ai": DOCUMENT_AI_URL
        }
        
        for service_name, url in services.items():
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(f"{url}/health", timeout=aiohttp.ClientTimeout(total=5)) as response:
                        if response.status == 200:
                            self.ai_services_available[service_name] = "available"
                            self.log(f"✅ {service_name.replace('_', ' ').title()} is available")
                        else:
                            self.ai_services_available[service_name] = "unavailable"
                            self.log(f"❌ {service_name.replace('_', ' ').title()} not available: {response.status}")
            except Exception as e:
                self.ai_services_available[service_name] = "unavailable"
                self.log(f"❌ {service_name.replace('_', ' ').title()} not available: {e}")
    
    async def test_notification_service(self, contact_type: str, contact_value: str, user_name: str, message: str) -> Dict[str, Any]:
        """Test notification service"""
        self.log(f"Testing {contact_type} notification to {contact_value}")
        
        notification_data = {
            "user_id": self.session_id,
            "type": "confirmation",
            "title": "StateX Submission Received",
            "message": message,
            "contact_type": contact_type,
            "contact_value": contact_value,
            "user_name": user_name
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{NOTIFICATION_SERVICE_URL}/api/notifications",
                    json=notification_data,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        self.log(f"✅ {contact_type.title()} notification sent successfully")
                        return result
                    else:
                        error_text = await response.text()
                        self.log(f"❌ {contact_type.title()} notification failed: {response.status} - {error_text}", "ERROR")
                        return {"success": False, "error": error_text}
        except Exception as e:
            self.log(f"❌ {contact_type.title()} notification error: {str(e)}", "ERROR")
            return {"success": False, "error": str(e)}
    
    async def analyze_with_free_ai(self, text_content: str, user_name: str) -> Dict[str, Any]:
        """Analyze using Free AI Service"""
        self.log("🤖 Analyzing with Free AI Service...")
        
        analysis_request = {
            "text_content": text_content,
            "analysis_type": "business_analysis",
            "user_name": user_name
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{FREE_AI_SERVICE_URL}/analyze",
                    json=analysis_request,
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        if result.get("success"):
                            self.log("✅ Free AI analysis completed")
                            return result
                        else:
                            self.log(f"❌ Free AI analysis failed: {result.get('error', 'Unknown error')}", "ERROR")
                            return {"success": False, "error": result.get("error", "Unknown error")}
                    else:
                        error_text = await response.text()
                        self.log(f"❌ Free AI service failed: {response.status} - {error_text}", "ERROR")
                        return {"success": False, "error": error_text}
        except Exception as e:
            self.log(f"❌ Free AI service error: {str(e)}", "ERROR")
            return {"success": False, "error": str(e)}
    
    async def analyze_with_nlp_service(self, text_content: str, user_name: str) -> Dict[str, Any]:
        """Analyze using NLP Service"""
        self.log("🧠 Analyzing with NLP Service...")
        
        nlp_request = {
            "text": text_content,
            "analysis_type": "comprehensive",
            "user_name": user_name
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{NLP_SERVICE_URL}/api/analyze-text",
                    json=nlp_request,
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        self.log("✅ NLP analysis completed")
                        return result
                    else:
                        error_text = await response.text()
                        self.log(f"❌ NLP service failed: {response.status} - {error_text}", "ERROR")
                        return {"success": False, "error": error_text}
        except Exception as e:
            self.log(f"❌ NLP service error: {str(e)}", "ERROR")
            return {"success": False, "error": str(e)}
    
    async def process_with_ai_orchestrator(self, text_content: str, voice_transcript: str, file_content: str, user_name: str) -> Dict[str, Any]:
        """Process using AI Orchestrator"""
        self.log("🎯 Processing with AI Orchestrator...")
        
        submission_request = {
            "submission_id": self.session_id,
            "user_name": user_name,
            "text_content": text_content,
            "voice_transcript": voice_transcript,
            "file_content": file_content,
            "contact_info": {
                "email": "ssfskype@gmail.com",
                "whatsapp": "+420774287541",
                "telegram_chat_id": "694579866"
            }
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{AI_ORCHESTRATOR_URL}/api/process-submission",
                    json=submission_request,
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        self.log("✅ AI Orchestrator processing completed")
                        return result
                    else:
                        error_text = await response.text()
                        self.log(f"❌ AI Orchestrator failed: {response.status} - {error_text}", "ERROR")
                        return {"success": False, "error": error_text}
        except Exception as e:
            self.log(f"❌ AI Orchestrator error: {str(e)}", "ERROR")
            return {"success": False, "error": str(e)}
    
    def generate_ai_summary(self, analysis_results: Dict[str, Any], user_name: str) -> str:
        """Generate AI analysis summary for notification"""
        analysis = analysis_results.get("analysis", {})
        provider = analysis_results.get("provider_used", "Unknown")
        model = analysis_results.get("model_used", "Unknown")
        confidence = analysis_results.get("confidence", 0.8)
        processing_time = analysis_results.get("processing_time", 0)
        
        summary = f"""🤖 *AI Analysis Complete for {user_name}*

📋 *Project Summary:*
{analysis.get('summary', 'AI analysis completed successfully.')}

🔍 *Business Type:*
{analysis.get('business_type', 'General').title()}

⚠️ *Current Pain Points:*
"""
        
        # Add pain points
        pain_points = analysis.get('pain_points', [])
        if pain_points:
            for point in pain_points:
                summary += f"• {point}\n"
        else:
            summary += "• No specific pain points identified\n"
        
        # Add business opportunities
        opportunities = analysis.get('opportunities', [])
        if opportunities:
            summary += f"\n💡 *Business Opportunities:*\n"
            for opp in opportunities:
                summary += f"• {opp.get('name', 'Opportunity')} - {opp.get('potential', 'Medium')} potential ({opp.get('timeline', 'TBD')})\n"
        
        # Add technical recommendations
        tech_recs = analysis.get('technical_recommendations', {})
        if tech_recs:
            summary += f"\n🔧 *Technical Recommendations:*\n"
            if tech_recs.get('frontend'):
                summary += f"• Frontend: {', '.join(tech_recs['frontend'])}\n"
            if tech_recs.get('backend'):
                summary += f"• Backend: {', '.join(tech_recs['backend'])}\n"
            if tech_recs.get('integrations'):
                summary += f"• Integrations: {', '.join(tech_recs['integrations'])}\n"
        
        # Add action items
        next_steps = analysis.get('next_steps', [])
        if next_steps:
            summary += f"\n📝 *Next Steps:*\n"
            for item in next_steps:
                summary += f"• {item.get('action', 'Action item')} ({item.get('timeline', 'TBD')})\n"
        
        # Add budget estimate
        budget = analysis.get('budget_estimate', {})
        if budget:
            summary += f"\n💰 *Budget Estimate:*\n"
            if budget.get('development'):
                summary += f"• Development: {budget['development']}\n"
            if budget.get('infrastructure'):
                summary += f"• Infrastructure: {budget['infrastructure']}\n"
            if budget.get('maintenance'):
                summary += f"• Maintenance: {budget['maintenance']}\n"
        
        summary += f"\n🎯 *Confidence:* {confidence:.1%}"
        summary += f"\n🤖 *AI Provider:* {provider.upper()}"
        summary += f"\n🧠 *Model:* {model}"
        summary += f"\n⏱️ *Processing Time:* {processing_time:.2f} seconds"
        
        return summary
    
    async def run_complete_workflow(self, test_data: Dict[str, Any]):
        """Run the complete workflow test"""
        self.start_time = time.time()
        self.log("🚀 Starting StateX AI Workflow Test")
        self.log("=" * 60)
        
        # Check AI services availability
        await self.check_ai_services()
        
        # Step 1: Send initial confirmation notifications
        self.log("📧 Step 1: Sending initial confirmation notifications")
        confirmation_message = f"""Hello {test_data['user_name']}!

Thank you for your submission! We've received your project details:
• Text description: {len(test_data['text_content'])} characters
• Voice transcript: {len(test_data['voice_transcript'])} characters  
• File content: {len(test_data['file_content'])} characters

Our AI agents are now analyzing your requirements using StateX AI services. We'll contact you via Telegram with the analysis results shortly.

Best regards,
The Statex Team"""
        
        # Test all notification channels
        notification_tasks = []
        for contact_type, contact_value in [
            ("email", test_data["email"]),
            ("whatsapp", test_data["whatsapp"]),
            ("telegram", test_data["telegram_chat_id"])
        ]:
            task = self.test_notification_service(
                contact_type, contact_value, test_data["user_name"], confirmation_message
            )
            notification_tasks.append(task)
        
        notification_results = await asyncio.gather(*notification_tasks, return_exceptions=True)
        
        # Log notification results
        successful_notifications = 0
        for i, result in enumerate(notification_results):
            if isinstance(result, Exception):
                self.log(f"❌ Notification {i+1} failed with exception: {result}", "ERROR")
            elif result.get("success", False):
                successful_notifications += 1
            else:
                self.log(f"❌ Notification {i+1} failed: {result.get('error', 'Unknown error')}", "ERROR")
        
        self.log(f"📊 Notifications sent: {successful_notifications}/3")
        
        # Step 2: AI Analysis
        self.log("\n🤖 Step 2: AI Analysis using StateX AI Services")
        combined_text = f"{test_data['text_content']}\n\nVoice Transcript:\n{test_data['voice_transcript']}\n\nFile Content:\n{test_data['file_content']}"
        
        ai_start = time.time()
        
        # Try different AI services based on availability
        ai_results = None
        
        if self.ai_services_available.get("free_ai_service") == "available":
            ai_results = await self.analyze_with_free_ai(combined_text, test_data["user_name"])
        elif self.ai_services_available.get("nlp_service") == "available":
            ai_results = await self.analyze_with_nlp_service(combined_text, test_data["user_name"])
        elif self.ai_services_available.get("ai_orchestrator") == "available":
            ai_results = await self.process_with_ai_orchestrator(
                test_data['text_content'],
                test_data['voice_transcript'],
                test_data['file_content'],
                test_data['user_name']
            )
        else:
            self.log("❌ No AI services available - cannot proceed with analysis")
            return
        
        if not ai_results or not ai_results.get("success", True):
            self.log("❌ AI analysis failed - cannot proceed")
            return
        
        ai_duration = self.measure_time("AI Analysis", ai_start)
        
        # Step 3: Generate and send AI summary
        self.log("\n📊 Step 3: Generating AI analysis summary")
        ai_summary = self.generate_ai_summary(ai_results, test_data["user_name"])
        
        # Send final notification with AI results
        self.log("📱 Step 4: Sending AI analysis results")
        final_notification_tasks = []
        for contact_type, contact_value in [
            ("email", test_data["email"]),
            ("whatsapp", test_data["whatsapp"]),
            ("telegram", test_data["telegram_chat_id"])
        ]:
            task = self.test_notification_service(
                contact_type, contact_value, test_data["user_name"], ai_summary
            )
            final_notification_tasks.append(task)
        
        final_results = await asyncio.gather(*final_notification_tasks, return_exceptions=True)
        
        # Count successful final notifications
        successful_final = 0
        for result in final_results:
            if not isinstance(result, Exception) and result.get("success", False):
                successful_final += 1
        
        # Step 4: Summary and timing
        total_time = time.time() - self.start_time
        self.log("\n" + "=" * 60)
        self.log("🎉 StateX AI Workflow Test Complete!")
        self.log(f"⏱️  Total Time: {total_time:.2f} seconds")
        self.log(f"🧠 AI Analysis Time: {ai_duration:.2f} seconds")
        self.log(f"🤖 AI Services Used: {', '.join([k for k, v in self.ai_services_available.items() if v == 'available'])}")
        self.log(f"📧 Initial Notifications: {successful_notifications}/3")
        self.log(f"📱 Final Notifications: {successful_final}/3")
        
        # Store results
        self.results = {
            "session_id": self.session_id,
            "total_time": total_time,
            "ai_duration": ai_duration,
            "ai_results": ai_results,
            "ai_services_available": self.ai_services_available,
            "notification_results": notification_results,
            "final_results": final_results,
            "successful_notifications": successful_notifications,
            "successful_final": successful_final
        }
        
        return self.results

def get_user_input():
    """Get user input for test data"""
    print("\n🚀 StateX AI Workflow Test")
    print("=" * 50)
    print("This test uses the StateX AI microservice (Free AI, NLP, ASR, Document AI)")
    print("\nPlease provide your test credentials:")
    print("(Press Enter to use default values)")
    
    user_name = input(f"\n👤 Your name [{DEFAULT_TEST_DATA['user_name']}]: ").strip() or DEFAULT_TEST_DATA['user_name']
    email = input(f"📧 Email address [{DEFAULT_TEST_DATA['email']}]: ").strip() or DEFAULT_TEST_DATA['email']
    whatsapp = input(f"📱 WhatsApp number [{DEFAULT_TEST_DATA['whatsapp']}]: ").strip() or DEFAULT_TEST_DATA['whatsapp']
    telegram_chat_id = input(f"✈️ Telegram Chat ID [{DEFAULT_TEST_DATA['telegram_chat_id']}]: ").strip() or DEFAULT_TEST_DATA['telegram_chat_id']
    
    print(f"\n📝 Project description:")
    print(f"Current: {DEFAULT_TEST_DATA['text_content'][:100]}...")
    use_default_text = input("Use default project description? (y/n) [y]: ").strip().lower() or "y"
    
    if use_default_text == "y":
        text_content = DEFAULT_TEST_DATA['text_content']
        voice_transcript = DEFAULT_TEST_DATA['voice_transcript']
        file_content = DEFAULT_TEST_DATA['file_content']
    else:
        text_content = input("Enter your project description: ").strip()
        voice_transcript = input("Enter voice transcript (or press Enter to skip): ").strip()
        file_content = input("Enter file content (or press Enter to skip): ").strip()
    
    return {
        "user_name": user_name,
        "email": email,
        "whatsapp": whatsapp,
        "telegram_chat_id": telegram_chat_id,
        "text_content": text_content,
        "voice_transcript": voice_transcript,
        "file_content": file_content
    }

async def main():
    """Main function"""
    tester = StateXAIWorkflowTester()
    
    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "--default":
            print("🚀 Using default test data...")
            test_data = DEFAULT_TEST_DATA
        elif sys.argv[1] == "--demo":
            print("🚀 Running demo with sample data...")
            test_data = DEFAULT_TEST_DATA
        else:
            print("Usage: python3 test_ai_workflow.py [--default|--demo]")
            sys.exit(1)
    else:
        test_data = get_user_input()
    
    # Run the complete workflow
    try:
        results = await tester.run_complete_workflow(test_data)
        
        # Print final summary
        print(f"\n📊 Test Results Summary:")
        print(f"   Session ID: {results['session_id']}")
        print(f"   Total Time: {results['total_time']:.2f} seconds")
        print(f"   AI Analysis: {results['ai_duration']:.2f} seconds")
        print(f"   AI Services: {', '.join([k for k, v in results['ai_services_available'].items() if v == 'available'])}")
        print(f"   Initial Notifications: {results['successful_notifications']}/3")
        print(f"   Final Notifications: {results['successful_final']}/3")
        print(f"   Status: {'✅ Success' if results['successful_final'] > 0 else '❌ Failed'}")
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
