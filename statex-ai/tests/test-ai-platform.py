#!/usr/bin/env python3
"""
Test script for StateX AI Platform
Tests all AI services to ensure they're working correctly
"""

import requests
import json
import time
from datetime import datetime

# Service URLs
AI_ORCHESTRATOR_URL = "http://localhost:8010"
NLP_SERVICE_URL = "http://localhost:8011"
ASR_SERVICE_URL = "http://localhost:8012"
DOCUMENT_AI_URL = "http://localhost:8013"
PROTOTYPE_GENERATOR_URL = "http://localhost:8014"
TEMPLATE_REPOSITORY_URL = "http://localhost:8015"

def test_service_health(service_name, url):
    """Test if a service is healthy"""
    try:
        response = requests.get(f"{url}/health", timeout=5)
        if response.status_code == 200:
            print(f"✅ {service_name} is healthy")
            return True
        else:
            print(f"❌ {service_name} returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ {service_name} is not responding: {e}")
        return False

def test_ai_orchestrator():
    """Test AI Orchestrator service"""
    print("\n🧠 Testing AI Orchestrator...")
    
    # Test health
    if not test_service_health("AI Orchestrator", AI_ORCHESTRATOR_URL):
        return False
    
    # Test submission processing
    try:
        submission_data = {
            "user_id": "test_user_123",
            "submission_type": "text",
            "text_content": "I want to create a mobile app for inventory management for small businesses. I need help with the technical development and business planning.",
            "requirements": "Mobile app, inventory management, small business focus",
            "contact_info": {
                "email": "test@example.com",
                "name": "Test User"
            }
        }
        
        response = requests.post(
            f"{AI_ORCHESTRATOR_URL}/api/process-submission",
            json=submission_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Submission created: {result['submission_id']}")
            return result['submission_id']
        else:
            print(f"❌ Submission failed: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error testing AI Orchestrator: {e}")
        return None

def test_nlp_service():
    """Test NLP Service"""
    print("\n📝 Testing NLP Service...")
    
    if not test_service_health("NLP Service", NLP_SERVICE_URL):
        return False
    
    try:
        text_data = {
            "text_content": "I want to create a mobile app for inventory management for small businesses.",
            "requirements": "Mobile app, inventory management, small business focus",
            "analysis_type": "comprehensive"
        }
        
        response = requests.post(
            f"{NLP_SERVICE_URL}/api/analyze-text",
            json=text_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Text analysis completed: {result['analysis_id']}")
            print(f"   Confidence: {result['confidence']}")
            print(f"   Processing time: {result['processing_time']:.2f}s")
            return True
        else:
            print(f"❌ NLP analysis failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing NLP Service: {e}")
        return False

def test_asr_service():
    """Test ASR Service"""
    print("\n🎤 Testing ASR Service...")
    
    if not test_service_health("ASR Service", ASR_SERVICE_URL):
        return False
    
    try:
        transcription_data = {
            "voice_file_url": "https://example.com/test-audio.wav",
            "language": "en",
            "model": "whisper-1"
        }
        
        response = requests.post(
            f"{ASR_SERVICE_URL}/api/transcribe",
            json=transcription_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Transcription completed: {result['transcription_id']}")
            print(f"   Confidence: {result['confidence']}")
            print(f"   Word count: {result['word_count']}")
            return True
        else:
            print(f"❌ Transcription failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing ASR Service: {e}")
        return False

def test_document_ai():
    """Test Document AI Service"""
    print("\n📄 Testing Document AI Service...")
    
    if not test_service_health("Document AI", DOCUMENT_AI_URL):
        return False
    
    try:
        document_data = {
            "file_urls": ["https://example.com/test-document.pdf"],
            "analysis_type": "comprehensive",
            "extract_text": True,
            "extract_metadata": True
        }
        
        response = requests.post(
            f"{DOCUMENT_AI_URL}/api/analyze-documents",
            json=document_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Document analysis completed: {result['analysis_id']}")
            print(f"   Processing time: {result['processing_time']:.2f}s")
            return True
        else:
            print(f"❌ Document analysis failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing Document AI: {e}")
        return False

def test_prototype_generator():
    """Test Prototype Generator Service"""
    print("\n🏗️ Testing Prototype Generator Service...")
    
    if not test_service_health("Prototype Generator", PROTOTYPE_GENERATOR_URL):
        return False
    
    try:
        prototype_data = {
            "requirements": "Mobile app for inventory management",
            "templates": {},
            "analysis": {"business_type": "mobile_app"},
            "prototype_type": "app",
            "customization_level": "medium"
        }
        
        response = requests.post(
            f"{PROTOTYPE_GENERATOR_URL}/api/generate-prototype",
            json=prototype_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Prototype generated: {result['prototype_id']}")
            print(f"   Processing time: {result['processing_time']:.2f}s")
            return True
        else:
            print(f"❌ Prototype generation failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing Prototype Generator: {e}")
        return False

def test_template_repository():
    """Test Template Repository Service"""
    print("\n📚 Testing Template Repository Service...")
    
    if not test_service_health("Template Repository", TEMPLATE_REPOSITORY_URL):
        return False
    
    try:
        template_data = {
            "requirements": "Mobile app for inventory management",
            "analysis": {"business_type": "mobile_app"},
            "template_type": "app",
            "industry": "technology"
        }
        
        response = requests.post(
            f"{TEMPLATE_REPOSITORY_URL}/api/find-templates",
            json=template_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Template search completed: {result['search_id']}")
            print(f"   Found {len(result['matches'])} templates")
            return True
        else:
            print(f"❌ Template search failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing Template Repository: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 StateX AI Platform Test Suite")
    print("=" * 50)
    
    # Test all services
    services_healthy = 0
    total_services = 6
    
    # Test individual services
    if test_nlp_service():
        services_healthy += 1
    
    if test_asr_service():
        services_healthy += 1
    
    if test_document_ai():
        services_healthy += 1
    
    if test_prototype_generator():
        services_healthy += 1
    
    if test_template_repository():
        services_healthy += 1
    
    # Test AI Orchestrator (main service)
    submission_id = test_ai_orchestrator()
    if submission_id:
        services_healthy += 1
        
        # Test submission status
        print(f"\n📊 Testing submission status for {submission_id}...")
        try:
            response = requests.get(f"{AI_ORCHESTRATOR_URL}/api/status/{submission_id}")
            if response.status_code == 200:
                status = response.json()
                print(f"✅ Submission status: {status['status']}")
                print(f"   Progress: {status['progress']:.1f}%")
                print(f"   Current step: {status['current_step']}")
            else:
                print(f"❌ Status check failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Error checking status: {e}")
    
    # Summary
    print("\n" + "=" * 50)
    print(f"📈 Test Results: {services_healthy}/{total_services} services healthy")
    
    if services_healthy == total_services:
        print("🎉 All tests passed! StateX AI Platform is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the logs above for details.")
    
    print(f"\n⏰ Test completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
