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
FRONTEND_URL = "http://localhost:3000"

# URL Generation Functions
def generate_customer_facing_urls(prototype_id: str) -> Dict[str, str]:
    """Generate customer-facing prototype URLs"""
    return {
        "prototype": f"http://project-{prototype_id}.localhost:3000",
        "plan": f"http://project-{prototype_id}.localhost:3000/plan",
        "offer": f"http://project-{prototype_id}.localhost:3000/offer"
    }

def generate_internal_urls(prototype_id: str) -> Dict[str, str]:
    """Generate internal prototype-results URLs"""
    return {
        "results": f"http://localhost:3000/prototype-results/{prototype_id}",
        "plan": f"http://localhost:3000/prototype-results/{prototype_id}/plan",
        "offer": f"http://localhost:3000/prototype-results/{prototype_id}/offer"
    }

def generate_all_urls(prototype_id: str) -> Dict[str, Dict[str, str]]:
    """Generate all URL patterns for a prototype"""
    return {
        "customer_facing": generate_customer_facing_urls(prototype_id),
        "internal": generate_internal_urls(prototype_id)
    }

async def test_url_accessibility(urls: Dict[str, str], timeout: int = 10) -> Dict[str, Dict[str, Any]]:
    """Test URL accessibility and return results"""
    results = {}
    
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=timeout)) as session:
        for name, url in urls.items():
            try:
                async with session.get(url) as response:
                    results[name] = {
                        "url": url,
                        "status_code": response.status,
                        "accessible": response.status == 200,
                        "content_type": response.headers.get('content-type', 'unknown'),
                        "content_length": response.headers.get('content-length', 'unknown')
                    }
                    
                    # Check for specific content indicators
                    if response.status == 200:
                        content = await response.text()
                        if "Development Plan" in content or "Service Offer" in content:
                            results[name]["content_type_detected"] = "static_page"
                        elif "Error Loading" in content:
                            results[name]["content_type_detected"] = "error_page"
                        else:
                            results[name]["content_type_detected"] = "other"
                    else:
                        results[name]["content_type_detected"] = "unavailable"
                        
            except Exception as e:
                results[name] = {
                    "url": url,
                    "status_code": None,
                    "accessible": False,
                    "error": str(e),
                    "content_type_detected": "error"
                }
    
    return results

def print_url_test_results(all_urls: Dict[str, Dict[str, str]], test_results: Dict[str, Dict[str, Any]]) -> None:
    """Print comprehensive URL test results"""
    print("\n" + "="*80)
    print("🔗 COMPREHENSIVE URL TESTING RESULTS")
    print("="*80)
    
    # Customer-Facing URLs
    print("\n📱 CUSTOMER-FACING URLs:")
    print("-" * 40)
    for name, url in all_urls["customer_facing"].items():
        result = test_results["customer_facing"][name]
        status_emoji = "✅" if result["accessible"] else "❌"
        content_type = result.get("content_type_detected", "unknown")
        print(f"{status_emoji} {name.upper()}: {url}")
        print(f"   Status: {result.get('status_code', 'N/A')} | Content: {content_type}")
    
    # Internal URLs
    print("\n🔍 INTERNAL URLs:")
    print("-" * 40)
    for name, url in all_urls["internal"].items():
        result = test_results["internal"][name]
        status_emoji = "✅" if result["accessible"] else "❌"
        content_type = result.get("content_type_detected", "unknown")
        print(f"{status_emoji} {name.upper()}: {url}")
        print(f"   Status: {result.get('status_code', 'N/A')} | Content: {content_type}")
    
    # Summary
    total_urls = sum(len(urls) for urls in all_urls.values())
    accessible_urls = sum(
        sum(1 for result in results.values() if result["accessible"])
        for results in test_results.values()
    )
    
    print(f"\n📊 SUMMARY: {accessible_urls}/{total_urls} URLs accessible")
    print("="*80)

async def test_all_prototype_urls(prototype_id: str) -> None:
    """Test all prototype URL patterns"""
    print(f"\n🧪 Testing all URLs for prototype ID: {prototype_id}")
    
    # Generate all URLs
    all_urls = generate_all_urls(prototype_id)
    
    # Test customer-facing URLs
    print("\n📱 Testing customer-facing URLs...")
    customer_results = await test_url_accessibility(all_urls["customer_facing"])
    
    # Test internal URLs
    print("🔍 Testing internal URLs...")
    internal_results = await test_url_accessibility(all_urls["internal"])
    
    # Combine results
    test_results = {
        "customer_facing": customer_results,
        "internal": internal_results
    }
    
    # Print results
    print_url_test_results(all_urls, test_results)
    
    return all_urls, test_results

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
        
        # Step 4: Test prototype URLs (if prototype ID is available)
        url_test_results = None
        if ai_results.get("prototype_id"):
            self.log("\n🔗 Step 4: Testing prototype URLs")
            url_start = time.time()
            try:
                all_urls, url_test_results = await test_all_prototype_urls(ai_results["prototype_id"])
                url_duration = self.measure_time("URL Testing", url_start)
                self.log(f"✅ URL testing completed in {url_duration:.2f} seconds")
            except Exception as e:
                self.log(f"⚠️ URL testing failed: {e}", "WARNING")
                url_duration = 0
        else:
            self.log("\n⚠️ Step 4: Skipping URL testing (no prototype ID available)")
            url_duration = 0
        
        # Step 5: Summary and timing
        total_time = time.time() - self.start_time
        self.log("\n" + "=" * 70)
        self.log("🎉 Form Submission and Telegram Workflow Test Complete!")
        self.log(f"⏱️  Total Time: {total_time:.2f} seconds")
        self.log(f"📧 Initial Confirmation: {confirmation_duration:.2f} seconds")
        self.log(f"🧠 AI Analysis: {ai_duration:.2f} seconds")
        self.log(f"📱 Analysis Results: {analysis_duration:.2f} seconds")
        if url_duration > 0:
            self.log(f"🔗 URL Testing: {url_duration:.2f} seconds")
        self.log(f"✅ Status: Success - Check your Telegram channel!")
        
        # Store results
        self.results = {
            "session_id": self.session_id,
            "total_time": total_time,
            "confirmation_duration": confirmation_duration,
            "ai_duration": ai_duration,
            "analysis_duration": analysis_duration,
            "url_duration": url_duration,
            "ai_results": ai_results,
            "confirmation_result": confirmation_result,
            "analysis_result": analysis_result,
            "url_test_results": url_test_results,
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
            if results.get('url_duration', 0) > 0:
                print(f"   URL Testing: {results['url_duration']:.2f} seconds")
            print(f"   Status: ✅ Success - Check your Telegram channel!")
            
            # Show URL testing results if available
            if results.get('url_test_results'):
                print(f"\n🔗 URL Testing Results:")
                url_results = results['url_test_results']
                if 'customer_facing' in url_results and 'internal' in url_results:
                    customer_accessible = sum(1 for r in url_results['customer_facing'].values() if r.get('accessible', False))
                    internal_accessible = sum(1 for r in url_results['internal'].values() if r.get('accessible', False))
                    print(f"   Customer-Facing URLs: {customer_accessible}/{len(url_results['customer_facing'])} accessible")
                    print(f"   Internal URLs: {internal_accessible}/{len(url_results['internal'])} accessible")
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
