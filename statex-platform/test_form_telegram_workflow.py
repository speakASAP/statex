#!/usr/bin/env python3
"""
StateX Form Submission and Telegram Notification Test

This script tests the complete workflow:
1. Form submission simulation
2. Initial confirmation notification via Telegram
3. AI analysis simulation
4. Final results notification via Telegram

Usage:
    python3 test_form_telegram_workflow.py                    # Interactive mode
    python3 test_form_telegram_workflow.py --default          # Use default test data
    python3 test_form_telegram_workflow.py --demo             # Run demo with sample data
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
NOTIFICATION_SERVICE_URL = "http://localhost:8005"
TELEGRAM_CHAT_ID = "694579866"  # Your Telegram chat ID

# Default test data
DEFAULT_TEST_DATA = {
    "user_name": "Sergej",
    "email": "ssfskype@gmail.com",
    "phone": "+420774287541",
    "telegram_chat_id": TELEGRAM_CHAT_ID,
    "project_description": "I want to create a comprehensive digital solution for my auto repair business. The system should include online booking, customer management, service tracking, payment processing, and a mobile app for technicians. I need something that can handle appointments 24/7, send reminders, track service history, and process payments online.",
    "business_type": "Auto Repair Shop",
    "expected_features": [
        "Online booking system with real-time availability",
        "Customer management with service history",
        "Mobile app for technicians",
        "Payment processing integration",
        "SMS/Email notifications",
        "Inventory management"
    ],
    "timeline": "3-6 months",
    "budget_range": "€10,000 - €25,000"
}

class FormTelegramWorkflowTester:
    def __init__(self):
        self.session_id = str(uuid.uuid4())
        self.start_time = None
        self.results = {}
        
    def log(self, message: str, level: str = "INFO"):
        """Log message with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def measure_time(self, operation: str, start_time: float):
        """Measure and log operation time"""
        duration = time.time() - start_time
        self.log(f"{operation} completed in {duration:.2f} seconds")
        return duration
        
    async def send_telegram_notification(self, message: str, user_name: str) -> Dict[str, Any]:
        """Send Telegram notification"""
        self.log(f"📱 Sending Telegram notification to {user_name}")
        
        notification_data = {
            "user_id": self.session_id,
            "type": "form_submission",
            "title": "🚀 StateX Form Submission",
            "message": message,
            "contact_type": "telegram",
            "contact_value": TELEGRAM_CHAT_ID,
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
                        self.log("✅ Telegram notification sent successfully")
                        return result
                    else:
                        error_text = await response.text()
                        self.log(f"❌ Telegram notification failed: {response.status} - {error_text}", "ERROR")
                        return {"success": False, "error": error_text}
        except Exception as e:
            self.log(f"❌ Telegram notification error: {str(e)}", "ERROR")
            return {"success": False, "error": str(e)}
    
    def simulate_ai_analysis(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate AI analysis of form submission"""
        self.log("🤖 Simulating AI analysis of form submission...")
        
        # Simulate processing time
        time.sleep(3)
        
        # Generate realistic analysis results
        analysis_results = {
            "project_summary": f"User {form_data['user_name']} wants to create a comprehensive digital solution for their {form_data['business_type']}. The project involves building a multi-platform system with online booking, customer management, and mobile app functionality.",
            "technical_analysis": {
                "complexity": "High",
                "estimated_development_time": "4-6 months",
                "team_size_recommended": "3-5 developers",
                "technology_stack": {
                    "frontend": ["React/Next.js", "React Native", "TypeScript"],
                    "backend": ["Node.js/Python", "PostgreSQL", "Redis"],
                    "mobile": ["React Native", "Expo"],
                    "integrations": ["Payment Gateway", "SMS/Email APIs", "Calendar APIs"]
                }
            },
            "business_opportunities": [
                {
                    "opportunity": "Online Booking System",
                    "description": "24/7 appointment scheduling with real-time availability",
                    "priority": "High",
                    "estimated_value": "€15,000"
                },
                {
                    "opportunity": "Customer Management Portal",
                    "description": "Comprehensive customer profiles with service history",
                    "priority": "High",
                    "estimated_value": "€12,000"
                },
                {
                    "opportunity": "Mobile Technician App",
                    "description": "Field management app for technicians",
                    "priority": "Medium",
                    "estimated_value": "€18,000"
                },
                {
                    "opportunity": "Payment Processing",
                    "description": "Integrated payment system with invoicing",
                    "priority": "Medium",
                    "estimated_value": "€8,000"
                }
            ],
            "recommended_phases": [
                {
                    "phase": "Phase 1: Core Booking System",
                    "duration": "6-8 weeks",
                    "features": ["Online booking", "Basic customer management", "Email notifications"],
                    "cost": "€8,000 - €12,000"
                },
                {
                    "phase": "Phase 2: Advanced Features",
                    "duration": "4-6 weeks",
                    "features": ["Service history", "Payment processing", "SMS notifications"],
                    "cost": "€6,000 - €10,000"
                },
                {
                    "phase": "Phase 3: Mobile App",
                    "duration": "8-10 weeks",
                    "features": ["Technician mobile app", "Real-time updates", "Advanced reporting"],
                    "cost": "€12,000 - €18,000"
                }
            ],
            "next_steps": [
                "Schedule a detailed requirements analysis call",
                "Prepare technical architecture proposal",
                "Create project timeline and milestones",
                "Set up development environment and CI/CD pipeline"
            ],
            "confidence": 0.92,
            "processing_time": 3.2
        }
        
        self.log("✅ AI analysis simulation completed")
        return analysis_results
    
    def generate_initial_confirmation(self, form_data: Dict[str, Any]) -> str:
        """Generate initial confirmation message"""
        return f"""🎉 *Form Submission Received!*

Hello {form_data['user_name']}! 

Thank you for submitting your project details to StateX. We've received your request for a *{form_data['business_type']}* digital solution.

📋 *Project Summary:*
• Business Type: {form_data['business_type']}
• Timeline: {form_data['timeline']}
• Budget Range: {form_data['budget_range']}
• Key Features: {len(form_data['expected_features'])} features requested

🤖 *What's Happening Now:*
Our AI agents are analyzing your requirements and will provide a detailed technical analysis within the next few minutes.

📱 *Next Steps:*
1. You'll receive a comprehensive analysis via Telegram
2. We'll schedule a call to discuss your project in detail
3. You'll receive a working prototype within 24-48 hours

⏱️ *Processing Time:* Usually 2-5 minutes

We'll keep you updated via Telegram throughout the process!

Best regards,
The StateX Team 🚀"""
    
    def generate_ai_analysis_summary(self, analysis_results: Dict[str, Any], form_data: Dict[str, Any]) -> str:
        """Generate AI analysis summary for Telegram"""
        summary = f"""🤖 *AI Analysis Complete for {form_data['user_name']}*

📊 *Project Analysis:*
{analysis_results['project_summary']}

🔍 *Technical Assessment:*
• Complexity: {analysis_results['technical_analysis']['complexity']}
• Development Time: {analysis_results['technical_analysis']['estimated_development_time']}
• Team Size: {analysis_results['technical_analysis']['team_size_recommended']} developers

💰 *Business Opportunities:*
"""
        
        # Add business opportunities
        for i, opp in enumerate(analysis_results['business_opportunities'], 1):
            summary += f"{i}. *{opp['opportunity']}* - {opp['priority']} priority\n   Value: {opp['estimated_value']}\n   {opp['description']}\n\n"
        
        # Add recommended phases
        summary += f"📅 *Recommended Development Phases:*\n"
        for i, phase in enumerate(analysis_results['recommended_phases'], 1):
            summary += f"{i}. *{phase['phase']}*\n   Duration: {phase['duration']}\n   Cost: {phase['cost']}\n\n"
        
        # Add next steps
        summary += f"🎯 *Immediate Next Steps:*\n"
        for i, step in enumerate(analysis_results['next_steps'], 1):
            summary += f"{i}. {step}\n"
        
        summary += f"\n⏱️ *Analysis Time:* {analysis_results['processing_time']:.1f} seconds"
        summary += f"\n🎯 *Confidence Level:* {analysis_results['confidence']:.1%}"
        summary += f"\n\n📞 *Ready to discuss your project?* Reply to this message or contact us directly!"
        
        return summary
    
    async def run_complete_workflow(self, form_data: Dict[str, Any]):
        """Run the complete form submission and Telegram workflow test"""
        self.start_time = time.time()
        self.log("🚀 Starting StateX Form Submission and Telegram Workflow Test")
        self.log("=" * 70)
        
        # Step 1: Send initial confirmation
        self.log("📝 Step 1: Sending initial form submission confirmation")
        confirmation_message = self.generate_initial_confirmation(form_data)
        
        confirmation_start = time.time()
        confirmation_result = await self.send_telegram_notification(confirmation_message, form_data["user_name"])
        confirmation_duration = self.measure_time("Initial Confirmation", confirmation_start)
        
        if not confirmation_result.get("success", False):
            self.log("❌ Initial confirmation failed!", "ERROR")
            return {"success": False, "error": "Initial confirmation failed"}
        
        # Step 2: Simulate AI analysis
        self.log("\n🤖 Step 2: Simulating AI analysis")
        ai_start = time.time()
        ai_results = self.simulate_ai_analysis(form_data)
        ai_duration = self.measure_time("AI Analysis", ai_start)
        
        # Step 3: Generate and send AI analysis summary
        self.log("\n📊 Step 3: Generating and sending AI analysis results")
        ai_summary = self.generate_ai_analysis_summary(ai_results, form_data)
        
        analysis_start = time.time()
        analysis_result = await self.send_telegram_notification(ai_summary, form_data["user_name"])
        analysis_duration = self.measure_time("AI Analysis Results", analysis_start)
        
        if not analysis_result.get("success", False):
            self.log("❌ AI analysis results failed!", "ERROR")
            return {"success": False, "error": "AI analysis results failed"}
        
        # Step 4: Summary and timing
        total_time = time.time() - self.start_time
        self.log("\n" + "=" * 70)
        self.log("🎉 Form Submission and Telegram Workflow Test Complete!")
        self.log(f"⏱️  Total Time: {total_time:.2f} seconds")
        self.log(f"📧 Initial Confirmation: {confirmation_duration:.2f} seconds")
        self.log(f"🧠 AI Analysis: {ai_duration:.2f} seconds")
        self.log(f"📱 Analysis Results: {analysis_duration:.2f} seconds")
        self.log(f"✅ Status: Success - Check your Telegram channel!")
        
        # Store results
        self.results = {
            "session_id": self.session_id,
            "total_time": total_time,
            "confirmation_duration": confirmation_duration,
            "ai_duration": ai_duration,
            "analysis_duration": analysis_duration,
            "ai_results": ai_results,
            "confirmation_result": confirmation_result,
            "analysis_result": analysis_result,
            "success": True
        }
        
        return self.results

def get_user_input():
    """Get user input for test data"""
    print("\n🚀 StateX Form Submission and Telegram Workflow Test")
    print("=" * 60)
    print("This test simulates the complete form submission workflow with Telegram notifications.")
    print("\nPlease provide your test information:")
    print("(Press Enter to use default values)")
    
    user_name = input(f"\n👤 Your name [{DEFAULT_TEST_DATA['user_name']}]: ").strip() or DEFAULT_TEST_DATA['user_name']
    email = input(f"📧 Email address [{DEFAULT_TEST_DATA['email']}]: ").strip() or DEFAULT_TEST_DATA['email']
    phone = input(f"📱 Phone number [{DEFAULT_TEST_DATA['phone']}]: ").strip() or DEFAULT_TEST_DATA['phone']
    telegram_chat_id = input(f"✈️ Telegram Chat ID [{DEFAULT_TEST_DATA['telegram_chat_id']}]: ").strip() or DEFAULT_TEST_DATA['telegram_chat_id']
    
    print(f"\n📝 Project details:")
    print(f"Current: {DEFAULT_TEST_DATA['project_description'][:100]}...")
    use_default_project = input("Use default project description? (y/n) [y]: ").strip().lower() or "y"
    
    if use_default_project == "y":
        form_data = DEFAULT_TEST_DATA.copy()
        form_data.update({
            "user_name": user_name,
            "email": email,
            "phone": phone,
            "telegram_chat_id": telegram_chat_id
        })
    else:
        project_description = input("Enter your project description: ").strip()
        business_type = input("Enter your business type: ").strip()
        timeline = input("Enter your timeline: ").strip()
        budget_range = input("Enter your budget range: ").strip()
        
        form_data = {
            "user_name": user_name,
            "email": email,
            "phone": phone,
            "telegram_chat_id": telegram_chat_id,
            "project_description": project_description,
            "business_type": business_type,
            "timeline": timeline,
            "budget_range": budget_range,
            "expected_features": ["Custom features based on your description"]
        }
    
    return form_data

async def main():
    """Main function"""
    tester = FormTelegramWorkflowTester()
    
    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "--default":
            print("🚀 Using default test data...")
            form_data = DEFAULT_TEST_DATA
        elif sys.argv[1] == "--demo":
            print("🚀 Running demo with sample data...")
            form_data = DEFAULT_TEST_DATA
        else:
            print("Usage: python3 test_form_telegram_workflow.py [--default|--demo]")
            sys.exit(1)
    else:
        form_data = get_user_input()
    
    # Run the complete workflow
    try:
        results = await tester.run_complete_workflow(form_data)
        
        if results.get("success", False):
            print(f"\n📊 Test Results Summary:")
            print(f"   Session ID: {results['session_id']}")
            print(f"   Total Time: {results['total_time']:.2f} seconds")
            print(f"   Confirmation: {results['confirmation_duration']:.2f} seconds")
            print(f"   AI Analysis: {results['ai_duration']:.2f} seconds")
            print(f"   Analysis Results: {results['analysis_duration']:.2f} seconds")
            print(f"   Status: ✅ Success - Check your Telegram channel!")
        else:
            print(f"\n❌ Test failed: {results.get('error', 'Unknown error')}")
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
