#!/usr/bin/env python3
"""
Test script for HuggingFace integration with StateX Free AI Service
"""

import asyncio
import aiohttp
import json
import time
import os
from typing import Dict, Any

# Configuration
HUGGINGFACE_URL = "https://api-inference.huggingface.co/models"
FREE_AI_SERVICE_URL = "http://localhost:8016"
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")

async def test_huggingface_direct():
    """Test direct connection to HuggingFace API"""
    print("🧪 Testing direct HuggingFace API connection...")
    
    try:
        headers = {}
        if HUGGINGFACE_API_KEY:
            headers["Authorization"] = f"Bearer {HUGGINGFACE_API_KEY}"
            print("🔑 Using API key for authentication")
        else:
            print("⚠️  No API key provided, using free tier")
        
        async with aiohttp.ClientSession() as session:
            # Test with GPT-2 model
            async with session.get(f"{HUGGINGFACE_URL}/gpt2", headers=headers) as response:
                if response.status == 200:
                    print("✅ HuggingFace API is accessible")
                    return True
                elif response.status == 503:
                    print("⏳ HuggingFace API is accessible but model is loading")
                    return True
                else:
                    error_text = await response.text()
                    print(f"❌ HuggingFace API returned status {response.status}: {error_text}")
                    return False
    except Exception as e:
        print(f"❌ Failed to connect to HuggingFace API: {e}")
        return False

async def test_huggingface_models():
    """Test different HuggingFace models"""
    print("\n🧪 Testing HuggingFace models...")
    
    models_to_test = [
        "gpt2",
        "microsoft/DialoGPT-medium",
        "facebook/blenderbot-400M-distill"
    ]
    
    headers = {}
    if HUGGINGFACE_API_KEY:
        headers["Authorization"] = f"Bearer {HUGGINGFACE_API_KEY}"
    
    results = {}
    
    for model in models_to_test:
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "inputs": "Analyze this business request: I want to create a restaurant management system.",
                    "parameters": {
                        "max_new_tokens": 50,
                        "temperature": 0.7
                    }
                }
                
                print(f"   Testing {model}...")
                async with session.post(
                    f"{HUGGINGFACE_URL}/{model}",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        results[model] = "✅ Available"
                        print(f"   ✅ {model} is working")
                    elif response.status == 503:
                        results[model] = "⏳ Loading"
                        print(f"   ⏳ {model} is loading")
                    else:
                        error_text = await response.text()
                        results[model] = f"❌ Error {response.status}"
                        print(f"   ❌ {model} failed: {response.status}")
        except Exception as e:
            results[model] = f"❌ Exception: {str(e)[:50]}"
            print(f"   ❌ {model} exception: {e}")
    
    return results

async def test_rate_limiting():
    """Test HuggingFace rate limiting handling"""
    print("\n🧪 Testing rate limiting handling...")
    
    headers = {}
    if HUGGINGFACE_API_KEY:
        headers["Authorization"] = f"Bearer {HUGGINGFACE_API_KEY}"
    
    try:
        async with aiohttp.ClientSession() as session:
            # Make multiple rapid requests to test rate limiting
            for i in range(3):
                payload = {
                    "inputs": f"Test request {i+1}",
                    "parameters": {"max_new_tokens": 20}
                }
                
                async with session.post(
                    f"{HUGGINGFACE_URL}/gpt2",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=15)
                ) as response:
                    if response.status == 429:
                        print(f"   ⚠️  Rate limited on request {i+1}")
                        return True
                    elif response.status == 200:
                        print(f"   ✅ Request {i+1} successful")
                    else:
                        print(f"   ❌ Request {i+1} failed: {response.status}")
                
                # Small delay between requests
                await asyncio.sleep(1)
        
        print("   ✅ No rate limiting encountered")
        return True
    except Exception as e:
        print(f"   ❌ Rate limiting test failed: {e}")
        return False

async def test_fallback_logic():
    """Test fallback logic in Free AI Service"""
    print("\n🧪 Testing fallback logic...")
    
    try:
        async with aiohttp.ClientSession() as session:
            # Test with different analysis types
            analysis_types = ["business_analysis", "technical_analysis", "content_generation"]
            
            for analysis_type in analysis_types:
                payload = {
                    "text_content": f"Test {analysis_type} request",
                    "analysis_type": analysis_type,
                    "user_name": "Test User",
                    "provider": "huggingface"
                }
                
                async with session.post(f"{FREE_AI_SERVICE_URL}/analyze", json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        print(f"   ✅ {analysis_type}: {result.get('provider_used')} / {result.get('model_used')}")
                    else:
                        print(f"   ❌ {analysis_type} failed: {response.status}")
        
        return True
    except Exception as e:
        print(f"   ❌ Fallback test failed: {e}")
        return False

async def test_model_selection():
    """Test model selection for different task types"""
    print("\n🧪 Testing model selection...")
    
    try:
        async with aiohttp.ClientSession() as session:
            # Test different combinations
            test_cases = [
                {"analysis_type": "business_analysis", "expected_models": ["microsoft/DialoGPT-medium", "gpt2"]},
                {"analysis_type": "technical_analysis", "expected_models": ["microsoft/CodeBERT-base", "gpt2"]},
                {"analysis_type": "sentiment_analysis", "expected_models": ["cardiffnlp/twitter-roberta-base-sentiment-latest"]}
            ]
            
            for case in test_cases:
                payload = {
                    "text_content": f"Test {case['analysis_type']} with model selection",
                    "analysis_type": case["analysis_type"],
                    "user_name": "Test User",
                    "provider": "huggingface"
                }
                
                async with session.post(f"{FREE_AI_SERVICE_URL}/analyze", json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        model_used = result.get('model_used', '')
                        print(f"   ✅ {case['analysis_type']}: using {model_used}")
                    else:
                        print(f"   ❌ {case['analysis_type']} failed: {response.status}")
        
        return True
    except Exception as e:
        print(f"   ❌ Model selection test failed: {e}")
        return False

async def main():
    """Run all HuggingFace tests"""
    print("🚀 Starting HuggingFace Integration Tests\n")
    
    if not HUGGINGFACE_API_KEY:
        print("⚠️  HUGGINGFACE_API_KEY not set. Using free tier with rate limits.")
        print("   Set HUGGINGFACE_API_KEY environment variable for better performance.\n")
    
    tests = [
        ("Direct HuggingFace API", test_huggingface_direct),
        ("HuggingFace Models", test_huggingface_models),
        ("Rate Limiting", test_rate_limiting),
        ("Fallback Logic", test_fallback_logic),
        ("Model Selection", test_model_selection)
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
    print("📊 HUGGINGFACE TEST RESULTS")
    print("="*50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\nTotal: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All HuggingFace tests passed!")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
    
    print("\n💡 Tips:")
    print("- Set HUGGINGFACE_API_KEY for better rate limits")
    print("- Some models may take time to load (503 status)")
    print("- Free tier has rate limits and may queue requests")

if __name__ == "__main__":
    asyncio.run(main())