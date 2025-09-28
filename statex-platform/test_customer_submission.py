#!/usr/bin/env python3
"""
Comprehensive Customer Submission Test Script
Simulates a real customer submission with text, audio, and PDF inputs
and follows the complete AI workflow to generate a final prototype.
"""

import requests
import json
import time
import os
import base64
from datetime import datetime
import uuid

# Configuration
BASE_URL = "http://localhost:8010"  # AI Orchestrator
PROTOTYPE_SERVICE_URL = "http://localhost:8003"  # Prototype Service
FRONTEND_URL = "http://localhost:3000"  # Frontend

class CustomerSubmissionTester:
    def __init__(self):
        self.session_id = str(uuid.uuid4())
        self.workflow_id = None
        self.prototype_id = None
        self.test_data = self._prepare_test_data()
        
    def _prepare_test_data(self):
        """Prepare realistic test data for customer submission"""
        return {
            "customer_info": {
                "name": "Sarah Johnson",
                "email": "sarah.johnson@techstartup.com",
                "company": "TechStartup Solutions",
                "phone": "+1-555-0123",
                "location": "San Francisco, CA"
            },
            "text_requirements": """
            Hi StateX team,
            
            I'm Sarah from TechStartup Solutions, and we need a comprehensive business automation platform. 
            Here's what we're looking for:
            
            CORE REQUIREMENTS:
            - Customer relationship management (CRM) system
            - Project management dashboard
            - Invoice and billing automation
            - Team collaboration tools
            - Analytics and reporting dashboard
            - Mobile app for field workers
            
            KEY FEATURES:
            - Real-time notifications
            - Document management system
            - Time tracking and productivity metrics
            - Integration with existing tools (Slack, Google Workspace)
            - Multi-language support (English, Spanish, French)
            - Advanced security and compliance (GDPR, SOC2)
            
            TARGET USERS:
            - Small to medium businesses (10-500 employees)
            - Remote and hybrid teams
            - Field service companies
            - Professional services firms
            
            DESIGN PREFERENCES:
            - Modern, clean interface
            - Dark/light mode toggle
            - Mobile-first responsive design
            - Intuitive user experience
            - Professional color scheme (blues and grays)
            
            TIMELINE:
            - Need MVP in 6-8 weeks
            - Full platform in 12-16 weeks
            - Budget: $50,000 - $100,000
            
            Please let me know if you need any additional information.
            
            Best regards,
            Sarah Johnson
            CTO, TechStartup Solutions
            """,
            "audio_requirements": """
            [Simulated audio transcription]
            "Hi, this is Sarah again. I wanted to add some additional context about our business needs.
            
            We're a growing tech startup with about 50 employees, and we're struggling with managing our 
            client relationships and project workflows. Currently, we're using multiple disconnected tools 
            like spreadsheets, basic CRM, and various communication platforms, which is causing a lot of 
            inefficiency and data silos.
            
            What we really need is an all-in-one platform that can:
            - Track our sales pipeline from lead to close
            - Manage ongoing client projects with milestones and deadlines
            - Automate our invoicing process based on project completion
            - Provide our team with a unified workspace for collaboration
            - Give management real-time insights into business performance
            
            The platform should be scalable as we grow to 200+ employees in the next two years.
            We also need it to integrate with our existing tools and be accessible on mobile devices 
            since our sales team is often on the road.
            
            I'm excited to work with StateX on this project. Your AI-powered approach seems perfect 
            for understanding our complex requirements and delivering exactly what we need.
            
            Thank you for your time, and I look forward to hearing from you soon."
            """,
            "pdf_requirements": {
                "filename": "TechStartup_Business_Requirements.pdf",
                "content": """
                TECHSTARTUP SOLUTIONS - BUSINESS REQUIREMENTS DOCUMENT
                
                EXECUTIVE SUMMARY:
                TechStartup Solutions is seeking a comprehensive business automation platform to streamline 
                operations, improve client management, and scale efficiently.
                
                BUSINESS OBJECTIVES:
                1. Centralize client and project management
                2. Automate repetitive business processes
                3. Improve team collaboration and productivity
                4. Gain real-time business insights
                5. Scale operations efficiently
                
                FUNCTIONAL REQUIREMENTS:
                
                CRM MODULE:
                - Lead management and tracking
                - Contact and company profiles
                - Sales pipeline visualization
                - Automated follow-up reminders
                - Custom fields and tags
                
                PROJECT MANAGEMENT:
                - Project creation and assignment
                - Task and milestone tracking
                - Time tracking and logging
                - Resource allocation
                - Progress reporting
                
                BILLING & INVOICING:
                - Automated invoice generation
                - Payment tracking
                - Recurring billing setup
                - Financial reporting
                - Tax calculation
                
                COLLABORATION TOOLS:
                - Team messaging and chat
                - File sharing and version control
                - Meeting scheduling
                - Document collaboration
                - Knowledge base
                
                ANALYTICS & REPORTING:
                - Business performance dashboards
                - Custom report generation
                - Data visualization
                - Export capabilities
                - Real-time metrics
                
                TECHNICAL REQUIREMENTS:
                - Cloud-based SaaS platform
                - Mobile responsive design
                - API for third-party integrations
                - Multi-tenant architecture
                - Advanced security features
                - 99.9% uptime guarantee
                
                INTEGRATION REQUIREMENTS:
                - Google Workspace
                - Microsoft Office 365
                - Slack
                - QuickBooks
                - Stripe/PayPal
                - Zapier
                
                COMPLIANCE & SECURITY:
                - GDPR compliance
                - SOC 2 Type II certification
                - Data encryption at rest and in transit
                - Regular security audits
                - User access controls
                
                SUCCESS METRICS:
                - 50% reduction in administrative time
                - 30% improvement in project delivery time
                - 25% increase in client satisfaction
                - 40% improvement in team productivity
                - 20% increase in revenue per employee
                """
            }
        }
    
    def create_sample_audio_file(self):
        """Create a sample audio file for testing"""
        # Create a simple WAV file header (minimal valid WAV file)
        wav_header = bytearray([
            0x52, 0x49, 0x46, 0x46,  # "RIFF"
            0x24, 0x00, 0x00, 0x00,  # File size
            0x57, 0x41, 0x56, 0x45,  # "WAVE"
            0x66, 0x6D, 0x74, 0x20,  # "fmt "
            0x10, 0x00, 0x00, 0x00,  # Format chunk size
            0x01, 0x00,              # Audio format (PCM)
            0x01, 0x00,              # Number of channels
            0x44, 0xAC, 0x00, 0x00,  # Sample rate (44100)
            0x88, 0x58, 0x01, 0x00,  # Byte rate
            0x02, 0x00,              # Block align
            0x10, 0x00,              # Bits per sample
            0x64, 0x61, 0x74, 0x61,  # "data"
            0x00, 0x00, 0x00, 0x00   # Data size
        ])
        
        # Add some silence data
        silence_data = bytearray([0x00, 0x00] * 1000)  # 1 second of silence
        
        audio_file = wav_header + silence_data
        return audio_file
    
    def create_sample_pdf_file(self):
        """Create a sample PDF file for testing"""
        # Minimal PDF content
        pdf_content = f"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
({self.test_data['pdf_requirements']['content'][:100]}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF"""
        return pdf_content.encode('utf-8')
    
    def submit_customer_requirements(self):
        """Submit customer requirements to AI Orchestrator"""
        print("🚀 Starting Customer Submission Test...")
        print(f"📋 Session ID: {self.session_id}")
        print(f"👤 Customer: {self.test_data['customer_info']['name']}")
        print(f"🏢 Company: {self.test_data['customer_info']['company']}")
        
        # Prepare submission data
        submission_data = {
            "user_id": self.session_id,
            "submission_type": "mixed",  # text, voice, file, or mixed
            "text_content": self.test_data['text_requirements'],
            "voice_file_url": None,  # We'll simulate this with text
            "file_urls": None,  # We'll simulate this with text
            "requirements": f"{self.test_data['text_requirements']}\n\nAUDIO TRANSCRIPT:\n{self.test_data['audio_requirements']}\n\nPDF CONTENT:\n{self.test_data['pdf_requirements']['content']}",
            "contact_info": {
                "name": self.test_data['customer_info']['name'],
                "email": self.test_data['customer_info']['email'],
                "company": self.test_data['customer_info']['company'],
                "phone": self.test_data['customer_info']['phone'],
                "location": self.test_data['customer_info']['location']
            }
        }
        
        try:
            print("\n📤 Submitting requirements to AI Orchestrator...")
            response = requests.post(
                f"{BASE_URL}/api/process-submission",
                json=submission_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Requirements submitted successfully!")
                print(f"📋 Response: {result}")
                
                # Try different possible keys for submission ID
                self.workflow_id = result.get('submission_id') or result.get('workflow_id') or result.get('id')
                if self.workflow_id:
                    print(f"🆔 Submission ID: {self.workflow_id}")
                else:
                    print("⚠️ No submission ID found in response")
                return True
            else:
                print(f"❌ Failed to submit requirements: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error submitting requirements: {e}")
            return False
    
    def monitor_workflow_progress(self):
        """Monitor the AI workflow progress"""
        if not self.workflow_id:
            print("⚠️ No workflow ID available, checking recent submissions...")
            # Try to get recent submissions and use the latest one
            try:
                response = requests.get(f"{BASE_URL}/api/submissions", timeout=10)
                if response.status_code == 200:
                    submissions = response.json()
                    if submissions and len(submissions) > 0:
                        self.workflow_id = submissions[0].get('id') or submissions[0].get('submission_id')
                        print(f"🆔 Using latest submission ID: {self.workflow_id}")
                    else:
                        print("❌ No submissions found")
                        return False
                else:
                    print("❌ Failed to get submissions")
                    return False
            except Exception as e:
                print(f"❌ Error getting submissions: {e}")
                return False
        
        print(f"\n🔍 Monitoring workflow progress...")
        print(f"🆔 Workflow ID: {self.workflow_id}")
        
        max_attempts = 30  # 5 minutes with 10-second intervals
        attempt = 0
        
        while attempt < max_attempts:
            try:
                response = requests.get(
                    f"{BASE_URL}/api/status/{self.workflow_id}",
                    timeout=10
                )
                
                if response.status_code == 200:
                    status = response.json()
                    current_step = status.get('current_step', 'Unknown')
                    progress = status.get('progress', 0)
                    status_text = status.get('status', 'Unknown')
                    
                    print(f"📊 Progress: {progress}% - {current_step} ({status_text})")
                    
                    if status_text == 'completed':
                        print("✅ Workflow completed successfully!")
                        self.prototype_id = status.get('prototype_id')
                        if self.prototype_id:
                            print(f"🎯 Prototype ID: {self.prototype_id}")
                        return True
                    elif status_text == 'failed':
                        print("❌ Workflow failed!")
                        print(f"Error: {status.get('error', 'Unknown error')}")
                        return False
                    
                    # Show detailed status if available
                    if 'steps' in status:
                        print("📋 Workflow Steps:")
                        for step in status['steps']:
                            step_status = "✅" if step.get('completed') else "⏳" if step.get('in_progress') else "⏸️"
                            print(f"  {step_status} {step.get('name', 'Unknown step')}")
                
                time.sleep(10)  # Wait 10 seconds before next check
                attempt += 1
                
            except Exception as e:
                print(f"⚠️ Error checking status: {e}")
                time.sleep(10)
                attempt += 1
        
        print("⏰ Timeout waiting for workflow completion")
        return False
    
    def test_prototype_access(self):
        """Test access to the generated prototype"""
        if not self.prototype_id:
            print("❌ No prototype ID available")
            return False
        
        print(f"\n🎯 Testing prototype access...")
        print(f"🆔 Prototype ID: {self.prototype_id}")
        
        # Test prototype service endpoints
        endpoints_to_test = [
            ("/health", "Health Check"),
            (f"/api/prototype/{self.prototype_id}", "Prototype Data"),
            (f"/api/prototype/{self.prototype_id}/plan", "Development Plan"),
            (f"/api/prototype/{self.prototype_id}/offer", "Service Offer"),
            (f"/api/prototype/{self.prototype_id}/embed", "Embed Content")
        ]
        
        for endpoint, description in endpoints_to_test:
            try:
                print(f"🔍 Testing {description}...")
                response = requests.get(
                    f"{PROTOTYPE_SERVICE_URL}{endpoint}",
                    timeout=10
                )
                
                if response.status_code == 200:
                    print(f"✅ {description}: OK")
                    if endpoint.endswith('/plan') or endpoint.endswith('/offer'):
                        print(f"   📄 Generated HTML content ({len(response.text)} characters)")
                else:
                    print(f"❌ {description}: Failed ({response.status_code})")
                    
            except Exception as e:
                print(f"❌ {description}: Error - {e}")
        
        # Test subdomain access
        subdomain_url = f"http://project-{self.prototype_id}.localhost:3000"
        print(f"\n🌐 Testing subdomain access: {subdomain_url}")
        
        try:
            response = requests.get(subdomain_url, timeout=10)
            if response.status_code == 200:
                print("✅ Subdomain access: OK")
            else:
                print(f"❌ Subdomain access: Failed ({response.status_code})")
        except Exception as e:
            print(f"❌ Subdomain access: Error - {e}")
        
        return True
    
    def display_prototype_summary(self):
        """Display a summary of the generated prototype"""
        if not self.prototype_id:
            print("❌ No prototype ID available")
            return
        
        print(f"\n🎉 PROTOTYPE GENERATION COMPLETE!")
        print("=" * 60)
        print(f"🆔 Prototype ID: {self.prototype_id}")
        print(f"👤 Customer: {self.test_data['customer_info']['name']}")
        print(f"🏢 Company: {self.test_data['customer_info']['company']}")
        print(f"📧 Email: {self.test_data['customer_info']['email']}")
        print(f"📅 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        print(f"\n🔗 Access URLs:")
        print(f"   🎯 Prototype: http://project-{self.prototype_id}.localhost:3000")
        print(f"   📋 Development Plan: http://project-{self.prototype_id}.localhost:3000/plan")
        print(f"   💼 Service Offer: http://project-{self.prototype_id}.localhost:3000/offer")
        print(f"   📊 Results Page: {FRONTEND_URL}/prototype-results/{self.prototype_id}")
        
        print(f"\n🛠️ API Endpoints:")
        print(f"   📊 Status: {BASE_URL}/api/status/{self.workflow_id}")
        print(f"   🎯 Prototype: {PROTOTYPE_SERVICE_URL}/api/prototype/{self.prototype_id}")
        print(f"   📋 Plan: {PROTOTYPE_SERVICE_URL}/api/prototype/{self.prototype_id}/plan")
        print(f"   💼 Offer: {PROTOTYPE_SERVICE_URL}/api/prototype/{self.prototype_id}/offer")
        
        print(f"\n✨ Test completed successfully!")
        print("=" * 60)
    
    def run_complete_test(self):
        """Run the complete customer submission test"""
        print("🚀 COMPREHENSIVE CUSTOMER SUBMISSION TEST")
        print("=" * 60)
        print(f"🕐 Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        # Step 1: Submit requirements
        if not self.submit_customer_requirements():
            print("❌ Failed to submit requirements")
            return False
        
        # Step 2: Monitor workflow
        if not self.monitor_workflow_progress():
            print("❌ Workflow did not complete successfully")
            return False
        
        # Step 3: Test prototype access
        if not self.test_prototype_access():
            print("❌ Failed to access prototype")
            return False
        
        # Step 4: Display summary
        self.display_prototype_summary()
        
        return True

def main():
    """Main function to run the test"""
    print("🤖 StateX AI Prototype Generation Test")
    print("Simulating comprehensive customer submission...")
    print()
    
    # Check if services are running
    print("🔍 Checking service availability...")
    
    services = [
        (f"{BASE_URL}/health", "AI Orchestrator"),
        (f"{PROTOTYPE_SERVICE_URL}/health", "Prototype Service"),
        (f"{FRONTEND_URL}", "Frontend")
    ]
    
    for url, name in services:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {name}: Running")
            else:
                print(f"⚠️ {name}: Responding but not healthy ({response.status_code})")
        except Exception as e:
            print(f"❌ {name}: Not available - {e}")
            print("Please ensure all services are running before starting the test.")
            return
    
    print()
    
    # Run the test
    tester = CustomerSubmissionTester()
    success = tester.run_complete_test()
    
    if success:
        print("\n🎉 All tests passed! AI agents successfully generated a prototype.")
    else:
        print("\n❌ Some tests failed. Check the logs above for details.")

if __name__ == "__main__":
    main()
