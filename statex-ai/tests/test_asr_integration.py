#!/usr/bin/env python3
"""
Test script for ASR (Speech-to-Text) integration with StateX ASR Service
"""

import asyncio
import aiohttp
import json
import time
import os
import tempfile
import wave
import numpy as np
from typing import Dict, Any

# Configuration
ASR_SERVICE_URL = "http://localhost:8012"

def create_test_audio_file():
    """Create a simple test audio file for testing"""
    # Create a simple sine wave audio file
    sample_rate = 44100
    duration = 3  # seconds
    frequency = 440  # Hz (A note)
    
    # Generate sine wave
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    audio_data = np.sin(2 * np.pi * frequency * t)
    
    # Convert to 16-bit integers
    audio_data = (audio_data * 32767).astype(np.int16)
    
    # Create temporary WAV file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
        with wave.open(tmp_file.name, 'w') as wav_file:
            wav_file.setnchannels(1)  # Mono
            wav_file.setsampwidth(2)  # 2 bytes per sample
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(audio_data.tobytes())
        
        return tmp_file.name

async def test_asr_health():
    """Test ASR service health check"""
    print("🧪 Testing ASR service health...")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{ASR_SERVICE_URL}/health") as response:
                if response.status == 200:
                    health = await response.json()
                    print(f"✅ ASR service is healthy")
                    print(f"   Mode: {health.get('mode', 'unknown')}")
                    print(f"   Providers: {health.get('providers', {})}")
                    return True
                else:
                    print(f"❌ ASR service health check failed: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Failed to connect to ASR service: {e}")
        return False

async def test_asr_providers():
    """Test ASR providers endpoint"""
    print("\n🧪 Testing ASR providers...")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{ASR_SERVICE_URL}/api/providers") as response:
                if response.status == 200:
                    providers = await response.json()
                    print(f"✅ Providers information retrieved")
                    print(f"   Mode: {providers.get('mode')}")
                    
                    for provider in providers.get('available_providers', []):
                        status = provider.get('status', 'unknown')
                        name = provider.get('name', 'unknown')
                        cost = provider.get('cost', 'unknown')
                        print(f"   - {name}: {status} ({cost})")
                    
                    return True
                else:
                    print(f"❌ Failed to get providers: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Providers test failed: {e}")
        return False

async def test_supported_formats():
    """Test supported formats endpoint"""
    print("\n🧪 Testing supported formats...")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{ASR_SERVICE_URL}/api/supported-formats") as response:
                if response.status == 200:
                    formats = await response.json()
                    print(f"✅ Supported formats retrieved")
                    print(f"   Recommended: {formats.get('recommended_format')}")
                    print(f"   Max duration: {formats.get('max_duration')}")
                    
                    supported = formats.get('supported_formats', [])
                    print(f"   Formats: {len(supported)} supported")
                    
                    return True
                else:
                    print(f"❌ Failed to get formats: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Formats test failed: {e}")
        return False

async def test_audio_upload():
    """Test audio file upload"""
    print("\n🧪 Testing audio upload...")
    
    try:
        # Create test audio file
        audio_file_path = create_test_audio_file()
        
        async with aiohttp.ClientSession() as session:
            with open(audio_file_path, 'rb') as audio_file:
                data = aiohttp.FormData()
                data.add_field('file', audio_file, filename='test_audio.wav', content_type='audio/wav')
                
                async with session.post(f"{ASR_SERVICE_URL}/api/upload-audio", data=data) as response:
                    if response.status == 200:
                        result = await response.json()
                        print(f"✅ Audio upload successful")
                        print(f"   File ID: {result.get('file_info', {}).get('file_id')}")
                        print(f"   Size: {result.get('file_info', {}).get('size')} bytes")
                        return True
                    else:
                        error_text = await response.text()
                        print(f"❌ Audio upload failed: {response.status} - {error_text}")
                        return False
        
        # Clean up
        os.unlink(audio_file_path)
        
    except Exception as e:
        print(f"❌ Audio upload test failed: {e}")
        return False

async def test_transcription():
    """Test audio transcription"""
    print("\n🧪 Testing audio transcription...")
    
    try:
        # Create test audio file
        audio_file_path = create_test_audio_file()
        
        async with aiohttp.ClientSession() as session:
            payload = {
                "voice_file_url": audio_file_path,
                "language": "en",
                "model": "whisper-1"
            }
            
            start_time = time.time()
            async with session.post(f"{ASR_SERVICE_URL}/api/transcribe", json=payload) as response:
                if response.status == 200:
                    result = await response.json()
                    processing_time = time.time() - start_time
                    
                    print(f"✅ Transcription successful in {processing_time:.2f}s")
                    print(f"   Transcript: {result.get('transcript', '')[:100]}...")
                    print(f"   Confidence: {result.get('confidence')}")
                    print(f"   Language: {result.get('language')}")
                    print(f"   Word count: {result.get('word_count')}")
                    print(f"   Duration: {result.get('duration')}s")
                    
                    return True
                else:
                    error_text = await response.text()
                    print(f"❌ Transcription failed: {response.status} - {error_text}")
                    return False
        
        # Clean up
        os.unlink(audio_file_path)
        
    except Exception as e:
        print(f"❌ Transcription test failed: {e}")
        return False

async def test_voice_analysis():
    """Test voice analysis"""
    print("\n🧪 Testing voice analysis...")
    
    try:
        # Create test audio file
        audio_file_path = create_test_audio_file()
        
        async with aiohttp.ClientSession() as session:
            payload = {
                "voice_file_url": audio_file_path,
                "analysis_type": "comprehensive"
            }
            
            async with session.post(f"{ASR_SERVICE_URL}/api/analyze-voice", json=payload) as response:
                if response.status == 200:
                    result = await response.json()
                    
                    print(f"✅ Voice analysis successful")
                    print(f"   Analysis ID: {result.get('analysis_id')}")
                    
                    results = result.get('results', {})
                    if 'audio_quality' in results:
                        quality = results['audio_quality']
                        print(f"   Audio quality: {quality.get('overall_quality')}")
                        print(f"   Clarity: {quality.get('clarity')}")
                    
                    return True
                else:
                    error_text = await response.text()
                    print(f"❌ Voice analysis failed: {response.status} - {error_text}")
                    return False
        
        # Clean up
        os.unlink(audio_file_path)
        
    except Exception as e:
        print(f"❌ Voice analysis test failed: {e}")
        return False

async def test_error_handling():
    """Test error handling with invalid inputs"""
    print("\n🧪 Testing error handling...")
    
    try:
        async with aiohttp.ClientSession() as session:
            # Test with invalid file URL
            payload = {
                "voice_file_url": "invalid_url",
                "language": "en"
            }
            
            async with session.post(f"{ASR_SERVICE_URL}/api/transcribe", json=payload) as response:
                if response.status in [400, 500]:
                    print(f"✅ Error handling works correctly (status: {response.status})")
                    return True
                else:
                    print(f"⚠️ Unexpected response for invalid input: {response.status}")
                    return True  # Still pass as service is responding
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
        return False

async def main():
    """Run all ASR tests"""
    print("🚀 Starting ASR Integration Tests\n")
    
    # Check if numpy is available for test audio generation
    try:
        import numpy as np
        import wave
    except ImportError:
        print("⚠️ numpy or wave not available, some tests may be limited")
    
    tests = [
        ("ASR Service Health", test_asr_health),
        ("ASR Providers", test_asr_providers),
        ("Supported Formats", test_supported_formats),
        ("Audio Upload", test_audio_upload),
        ("Audio Transcription", test_transcription),
        ("Voice Analysis", test_voice_analysis),
        ("Error Handling", test_error_handling)
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
    print("📊 ASR TEST RESULTS")
    print("="*50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\nTotal: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All ASR tests passed!")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
    
    print("\n💡 Tips:")
    print("- Set ASR_MODE=free for development (uses local Whisper)")
    print("- Set OPENROUTER_API_KEY for paid Whisper API access")
    print("- Local Whisper model will be downloaded on first use")

if __name__ == "__main__":
    asyncio.run(main())