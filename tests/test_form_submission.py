#!/usr/bin/env python3
"""
Test script to simulate the frontend form submission workflow
"""

import requests
import json
import time
import sys

def test_form_submission():
    """Test the complete form submission workflow"""
    
    print("🧪 Testing StateX Form Submission Workflow")
    print("=" * 50)
    
    # Test data
    test_data = {
        "text": "I want to create a mobile app for food delivery with user authentication and payment integration",
        "files": [],
        "voiceRecording": None,
        "context": {
            "formType": "contact",
            "userInfo": {
                "name": "Test User",
                "contactType": "email",
                "contactValue": "test@example.com"
            }
        }
    }
    
    # Step 1: Test AI service connection
    print("\n1️⃣ Testing AI service connection...")
    try:
        response = requests.get("http://localhost:8010/health", timeout=5)
        if response.status_code == 200:
            print("✅ AI Orchestrator is healthy")
        else:
            print("❌ AI Orchestrator health check failed")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to AI Orchestrator: {e}")
        return False
    
    # Step 2: Submit form data
    print("\n2️⃣ Submitting form data...")
    try:
        response = requests.post(
            "http://localhost:8010/api/process-submission",
            json={
                "submission_id": f"test_form_{int(time.time())}",
                "user_id": "test_user",
                "submission_type": "text",
                "text_content": test_data["text"],
                "requirements": "Mobile app with authentication and payment integration",
                "contact_info": {
                    "name": test_data["context"]["userInfo"]["name"],
                    "email": test_data["context"]["userInfo"]["contactValue"],
                    "phone": None,
                    "source": "website_contact_form",
                    "form_type": test_data["context"]["formType"],
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
                }
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            submission_id = result["submission_id"]
            print(f"✅ Form submitted successfully: {submission_id}")
            print(f"   Status: {result['status']}")
            print(f"   Message: {result['message']}")
        else:
            print(f"❌ Form submission failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Form submission error: {e}")
        return False
    
    # Step 3: Poll for results
    print("\n3️⃣ Polling for results...")
    max_attempts = 30
    attempt = 0
    completed = False
    
    while attempt < max_attempts:
        try:
            # Check status
            status_response = requests.get(
                f"http://localhost:8010/api/status/{submission_id}",
                timeout=5
            )
            
            if status_response.status_code == 200:
                status_data = status_response.json()
                print(f"   Attempt {attempt + 1}: Status = {status_data['status']}, Progress = {status_data.get('progress', 0):.1%}")
                
                if status_data["status"] == "completed":
                    print("✅ Processing completed!")
                    completed = True
                    break
                elif status_data["status"] == "failed":
                    print("❌ Processing failed!")
                    return False
                else:
                    print(f"   Still processing... (attempt {attempt + 1}/{max_attempts})")
            else:
                print(f"   Status check failed: {status_response.status_code}")
            
        except Exception as e:
            print(f"   Error during polling: {e}")
        
        attempt += 1
        time.sleep(2)
    
    if not completed:
        print("❌ Timeout waiting for completion")
        return False
    
    # Step 4: Get results
    print("\n4️⃣ Getting results...")
    try:
        results_response = requests.get(
            f"http://localhost:8010/api/results/{submission_id}",
            timeout=5
        )
        
        if results_response.status_code == 200:
            results_data = results_response.json()
            print("✅ Results available!")
            print(f"   Results page URL: {results_data.get('results_page_url', 'N/A')}")
            print(f"   Prototype ID: {results_data.get('prototype_id', 'N/A')}")
            
            # Show workflow steps
            workflow_steps = results_data.get('workflow_steps', [])
            print(f"   Workflow steps completed: {len(workflow_steps)}")
            for i, step in enumerate(workflow_steps):
                status_icon = "✅" if step.get('status') == 'completed' else "⏳" if step.get('status') == 'processing' else "❌"
                print(f"     {i+1}. {status_icon} {step.get('step_id', 'Unknown')} - {step.get('status', 'Unknown')}")
            
            return True
        else:
            print(f"❌ Results check failed: {results_response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error getting results: {e}")
        return False

if __name__ == "__main__":
    success = test_form_submission()
    if success:
        print("\n🎉 Form submission test completed successfully!")
        sys.exit(0)
    else:
        print("\n💥 Form submission test failed!")
        sys.exit(1)
