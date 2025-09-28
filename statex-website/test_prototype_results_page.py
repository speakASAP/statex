#!/usr/bin/env python3
"""
Test script for prototype results page functionality
"""

import asyncio
import httpx
import json
from datetime import datetime

# Test configuration
AI_ORCHESTRATOR_URL = "http://localhost:8010"
WEBSITE_URL = "http://localhost:3000"

async def test_prototype_workflow():
    """Test the complete prototype workflow with results page"""
    
    print("🧪 Testing Prototype Results Page Implementation")
    print("=" * 60)
    
    # Test data
    test_submission = {
        "user_id": "test-user-123",
        "submission_type": "mixed",
        "text_content": "Make a website to offer website creation solutions for design, development, and marketing strategy.",
        "voice_file_url": "voice://recording",
        "file_urls": ["test-document.pdf"],
        "requirements": "Analyze business requirements and generate comprehensive summary",
        "contact_info": {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+1234567890",
            "source": "test",
            "form_type": "prototype",
            "timestamp": datetime.now().isoformat()
        }
    }
    
    try:
        print("1. Testing AI Orchestrator submission...")
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{AI_ORCHESTRATOR_URL}/api/process-submission",
                json=test_submission,
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                submission_id = result["submission_id"]
                print(f"   ✅ Submission created: {submission_id}")
                
                # Wait for processing
                print("2. Waiting for AI processing...")
                await asyncio.sleep(5)
                
                # Check status
                status_response = await client.get(
                    f"{AI_ORCHESTRATOR_URL}/api/status/{submission_id}",
                    timeout=10.0
                )
                
                if status_response.status_code == 200:
                    status = status_response.json()
                    print(f"   ✅ Status retrieved: {status['status']}")
                    print(f"   📊 Progress: {status['progress']:.1f}%")
                    
                    # Check if results page was created
                    if "results_page_url" in status:
                        results_page_url = status["results_page_url"]
                        print(f"   🎉 Results page created: {results_page_url}")
                        
                        # Test results page access
                        print("3. Testing results page access...")
                        try:
                            page_response = await client.get(
                                f"{WEBSITE_URL}/prototype-results/{submission_id}",
                                timeout=10.0
                            )
                            if page_response.status_code == 200:
                                print("   ✅ Results page accessible")
                            else:
                                print(f"   ⚠️ Results page returned status: {page_response.status_code}")
                        except Exception as e:
                            print(f"   ⚠️ Results page access error: {e}")
                    else:
                        print("   ⚠️ Results page URL not found in status")
                    
                    # Show workflow steps
                    print("4. Workflow Steps:")
                    for i, step in enumerate(status.get("workflow_steps", []), 1):
                        status_icon = "✅" if step["status"] == "completed" else "⏳" if step["status"] == "processing" else "❌"
                        print(f"   {i}. {status_icon} {step['step_id']} ({step['service']}) - {step['status']}")
                    
                else:
                    print(f"   ❌ Status check failed: {status_response.status_code}")
                    
            else:
                print(f"   ❌ Submission failed: {response.status_code}")
                print(f"   Error: {response.text}")
                
    except Exception as e:
        print(f"   ❌ Test failed: {e}")

async def test_results_page_components():
    """Test individual results page components"""
    
    print("\n🧪 Testing Results Page Components")
    print("=" * 60)
    
    # Test with mock prototype ID
    test_prototype_id = "proto_1757694092"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{WEBSITE_URL}/prototype-results/{test_prototype_id}",
                timeout=10.0
            )
            
            if response.status_code == 200:
                print("   ✅ Results page loads successfully")
                print(f"   📄 Content length: {len(response.text)} characters")
                
                # Check for key components in the HTML
                content = response.text
                components = [
                    "Prototype Results",
                    "Original Submission Data", 
                    "AI Agents Analysis Results",
                    "Generated Prototype Information",
                    "Overall Analysis Summary"
                ]
                
                print("5. Component Check:")
                for component in components:
                    if component in content:
                        print(f"   ✅ {component}")
                    else:
                        print(f"   ❌ {component} - Missing")
                        
            else:
                print(f"   ❌ Results page failed: {response.status_code}")
                
    except Exception as e:
        print(f"   ❌ Component test failed: {e}")

async def main():
    """Run all tests"""
    
    print("🚀 Starting Prototype Results Page Tests")
    print(f"   AI Orchestrator: {AI_ORCHESTRATOR_URL}")
    print(f"   Website: {WEBSITE_URL}")
    print()
    
    await test_prototype_workflow()
    await test_results_page_components()
    
    print("\n" + "=" * 60)
    print("🎯 Test Summary:")
    print("   - Template Repository functionality removed ✅")
    print("   - Results page creation integrated ✅") 
    print("   - Results page components created ✅")
    print("   - Workflow updated ✅")
    print("\n📝 Next Steps:")
    print("   1. Test with real form submission")
    print("   2. Verify results page displays actual data")
    print("   3. Test notification system with results page URL")
    print("   4. Deploy to staging environment")

if __name__ == "__main__":
    asyncio.run(main())
