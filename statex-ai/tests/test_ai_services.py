#!/usr/bin/env python3
"""
Debug script to check AI services and workflow
"""

import asyncio
import httpx
import json

async def check_services():
    """Check if AI services are running"""
    
    services = {
        "AI Orchestrator": "http://localhost:8010",
        "Website": "http://localhost:3000",
        "Prototype Generator": "http://localhost:8014",
        "NLP Service": "http://localhost:8011",
        "ASR Service": "http://localhost:8012",
        "Document AI": "http://localhost:8013"
    }
    
    print("🔍 Checking AI Services Status")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        for name, url in services.items():
            try:
                response = await client.get(f"{url}/health", timeout=5.0)
                if response.status_code == 200:
                    print(f"✅ {name}: {url} - Running")
                else:
                    print(f"⚠️ {name}: {url} - Status {response.status_code}")
            except Exception as e:
                print(f"❌ {name}: {url} - Not accessible ({e})")

async def test_simple_submission():
    """Test a simple submission to see the workflow"""
    
    print("\n🧪 Testing Simple Submission")
    print("=" * 50)
    
    test_data = {
        "user_id": "debug-user-123",
        "submission_type": "text",
        "text_content": "Create a simple website for my business",
        "requirements": "Generate a basic business website",
        "contact_info": {
            "name": "Debug User",
            "email": "debug@test.com"
        }
    }
    
    try:
        async with httpx.AsyncClient() as client:
            # Submit to AI orchestrator
            response = await client.post(
                "http://localhost:8010/api/process-submission",
                json=test_data,
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                submission_id = result["submission_id"]
                print(f"✅ Submission created: {submission_id}")
                
                # Wait a bit for processing
                await asyncio.sleep(3)
                
                # Check status
                status_response = await client.get(
                    f"http://localhost:8010/api/status/{submission_id}",
                    timeout=10.0
                )
                
                if status_response.status_code == 200:
                    status = status_response.json()
                    print(f"✅ Status: {status['status']}")
                    print(f"📊 Progress: {status['progress']:.1f}%")
                    
                    print("\n📋 Workflow Steps:")
                    for i, step in enumerate(status.get("workflow_steps", []), 1):
                        status_icon = "✅" if step["status"] == "completed" else "⏳" if step["status"] == "processing" else "❌"
                        print(f"   {i}. {status_icon} {step['step_id']} ({step['service']}) - {step['status']}")
                        if step.get("error_message"):
                            print(f"      Error: {step['error_message']}")
                    
                    # Check if prototype_id is set
                    if "prototype_id" in status:
                        print(f"\n🎯 Prototype ID: {status['prototype_id']}")
                    else:
                        print("\n⚠️ Prototype ID not found in status")
                    
                    # Check if results page URL is set
                    if "results_page_url" in status:
                        print(f"🌐 Results Page URL: {status['results_page_url']}")
                    else:
                        print("⚠️ Results Page URL not found")
                        
                else:
                    print(f"❌ Status check failed: {status_response.status_code}")
                    
            else:
                print(f"❌ Submission failed: {response.status_code}")
                print(f"Error: {response.text}")
                
    except Exception as e:
        print(f"❌ Test failed: {e}")

async def main():
    """Run debug checks"""
    
    await check_services()
    await test_simple_submission()
    
    print("\n" + "=" * 50)
    print("🔧 Debug Summary:")
    print("1. Check which services are running")
    print("2. Verify workflow execution")
    print("3. Identify where the process fails")
    print("4. Check error messages in workflow steps")

if __name__ == "__main__":
    asyncio.run(main())
