#!/usr/bin/env python3
"""
Test script for Ollama integration with StateX Free AI Service
"""

import asyncio
import aiohttp
import json
import time
from typing import Dict, Any

# Configuration
OLLAMA_URL = "http://localhost:11434"
FREE_AI_SERVICE_URL = "http://localhost:8016"

async def test_ollama_direct():
    """Test direct connection to Ollama"""
    print("🧪 Testing direct Ollama connection...")
    
    try:
        async with aiohttp.ClientSession() as session:
            # Check if Ollama is running
            async with session.get(f"{OLLAMA_URL}/api/tags") as response:
                if response.status == 200:
                    models = await response.json()
                    print(f"✅ Ollama is running with {len(models.get('models', []))} models")
                    
                    for model in models.get('models', []):
                        print(f"   - {model.get('name', 'Unknown')}")
                    
                    return True
                else:
                    print(f"❌ Ollama returned status {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Failed to connect to Ollama: {e}")
        return False

async def test_ollama_generation():
    """Test text generation with Ollama"""
    print("\n🧪 Testing Ollama text generation...")
    
    try:
        async with aiohttp.ClientSession() as session:
            payload = {
                "model": "llama2:7b",
                "prompt": "Analyze this business request: I want to create a restaurant management system with online ordering.",
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 200
                }
            }
            
            start_time = time.time()
            async with session.post(f"{OLLAMA_URL}/api/generate", json=payload) as response:
                if response.status == 200:
                    result = await response.json()
                    processing_time = time.time() - start_time
                    
                    print(f"✅ Generation successful in {processing_time:.2f}s")
                    print(f"Response: {result.get('response', '')[:200]}...")
                    return True
                else:
                    error_text = await response.text()
                    print(f"❌ Generation failed: {response.status} - {error_text}")
                    return False
    except Exception as e:
        print(f"❌ Generation test failed: {e}")
        return False

async def test_free_ai_service():
    """Test Free AI Service integration"""
    print("\n🧪 Testing Free AI Service...")
    
    try:
        async with aiohttp.ClientSession() as session:
            # Check health
            async with session.get(f"{FREE_AI_SERVICE_URL}/health") as response:
                if response.status == 200:
                    health = await response.json()
                    print(f"✅ Free AI Service is healthy")
                    print(f"Providers: {health.get('providers', {})}")
                else:
                    print(f"❌ Free AI Service health check failed: {response.status}")
                    return False
            
            # Check available models
            async with session.get(f"{FREE_AI_SERVICE_URL}/models") as response:
                if response.status == 200:
                    models = await response.json()
                    print(f"✅ Available models retrieved")
                    for provider, provider_models in models.get('models', {}).items():
                        print(f"   {provider}: {len(provider_models)} models")
                else:
                    print(f"❌ Failed to get models: {response.status}")
                    return False
            
            return True
    except Exception as e:
        print(f"❌ Free AI Service test failed: {e}")
        return False

async def test_ai_analysis():
    """Test AI analysis through Free AI Service"""
    print("\n🧪 Testing AI analysis...")
    
    try:
        async with aiohttp.ClientSession() as session:
            payload = {
                "text_content": "I want to create a restaurant management system with online ordering, inventory tracking, and customer management.",
                "analysis_type": "business_analysis",
                "user_name": "Test User",
                "provider": "ollama"
            }
            
            start_time = time.time()
            async with session.post(f"{FREE_AI_SERVICE_URL}/analyze", json=payload) as response:
                if response.status == 200:
                    result = await response.json()
                    processing_time = time.time() - start_time
                    
                    print(f"✅ Analysis successful in {processing_time:.2f}s")
                    print(f"Provider used: {result.get('provider_used')}")
                    print(f"Model used: {result.get('model_used')}")
                    print(f"Confidence: {result.get('confidence')}")
                    
                    analysis = result.get('analysis', {})
                    if 'summary' in analysis:
                        print(f"Summary: {analysis['summary'][:150]}...")
                    
                    return True
                else:
                    error_text = await response.text()
                    print(f"❌ Analysis failed: {response.status} - {error_text}")
                    return False
    except Exception as e:
        print(f"❌ Analysis test failed: {e}")
        return False

async def test_fallback_behavior():
    """Test fallback from Ollama to other providers"""
    print("\n🧪 Testing fallback behavior...")
    
    try:
        async with aiohttp.ClientSession() as session:
            # Test with non-existent model to trigger fallback
            payload = {
                "text_content": "Test fallback behavior",
                "analysis_type": "business_analysis",
                "user_name": "Test User",
                "provider": "ollama",
                "model": "non-existent-model"
            }
            
            async with session.post(f"{FREE_AI_SERVICE_URL}/analyze", json=payload) as response:
                if response.status == 200:
                    result = await response.json()
                    print(f"✅ Fallback successful")
                    print(f"Provider used: {result.get('provider_used')}")
                    print(f"Success: {result.get('success')}")
                    return True
                else:
                    print(f"❌ Fallback test failed: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Fallback test failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("🚀 Starting Ollama Integration Tests\n")
    
    tests = [
        ("Direct Ollama Connection", test_ollama_direct),
        ("Ollama Text Generation", test_ollama_generation),
        ("Free AI Service Health", test_free_ai_service),
        ("AI Analysis", test_ai_analysis),
        ("Fallback Behavior", test_fallback_behavior)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = await test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*50)
    print("📊 TEST RESULTS SUMMARY")
    print("="*50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\nTotal: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! Ollama integration is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")

if __name__ == "__main__":
    asyncio.run(main())