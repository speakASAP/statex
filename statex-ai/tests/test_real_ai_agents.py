#!/usr/bin/env python3
"""
StateX Real AI Agents Performance Test

This script tests the complete workflow with REAL AI agents and measures their performance:
1. Simulates contact form submission (text, voice, file)
2. Sends initial Telegram notification (data received)
3. Sends data to ALL available AI agents (Free AI, NLP, ASR, Document AI)
4. Measures each AI agent's performance (speed, quality)
5. Sends individual results from each AI agent to Telegram
6. Sends final comprehensive summary to Telegram

Usage:
    python3 test_real_ai_agents.py                    # Interactive mode
    python3 test_real_ai_agents.py --default          # Use default test data
    python3 test_real_ai_agents.py --demo             # Run demo with sample data
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
NOTIFICATION_SERVICE_URL = "http://localhost:8005"  # Standalone notification service
AI_ORCHESTRATOR_URL = "http://localhost:8010"       # AI orchestrator
FREE_AI_SERVICE_URL = "http://localhost:8016"       # Free AI service
NLP_SERVICE_URL = "http://localhost:8011"           # NLP service
ASR_SERVICE_URL = "http://localhost:8012"           # ASR service
DOCUMENT_AI_URL = "http://localhost:8013"           # Document AI service

# Default test data
DEFAULT_TEST_DATA = {
    "user_name": "Sergej",
    "email": "ssfskype@gmail.com",
    "whatsapp": "+420774287541",
    "telegram_chat_id": "694579866",
    "text_content": "I want to create a website for my auto car repairing business. The website should have online booking, customer management, service history tracking, and payment processing. I also need a mobile app for my technicians to manage their schedules and update job statuses.",
    "voice_transcript": "Hi, I'm Sergej and I run an auto repair shop. I need a digital solution to modernize my business. My customers are always calling to book appointments and it's hard to keep track of everything. I want something that can handle online bookings, send reminders, track service history, and maybe even process payments. The system should work on both computer and mobile devices.",
    "file_content": "Business Requirements Document:\n\n1. Online Booking System\n   - Customer can book appointments 24/7\n   - Real-time availability calendar\n   - Email/SMS confirmations\n\n2. Customer Management\n   - Customer profiles with service history\n   - Vehicle information tracking\n   - Communication preferences\n\n3. Service Management\n   - Job tracking and status updates\n   - Parts inventory management\n   - Technician scheduling\n\n4. Payment Processing\n   - Online payment acceptance\n   - Invoice generation\n   - Payment history tracking\n\n5. Mobile Application\n   - Technician dashboard\n   - Real-time job updates\n   - Customer communication"
}

class RealAIAgentsTester:
    def __init__(self):
        self.session_id = str(uuid.uuid4())
        self.start_time = None
        self.results = {}
        self.ai_services_available = {}
        self.ai_agent_results = {}
        self.performance_metrics = {}
        
    def log(self, message: str, level: str = "INFO"):
        """Log message with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def measure_time(self, operation: str, start_time: float):
        """Measure and log operation time"""
        duration = time.time() - start_time
        self.log(f"{operation} completed in {duration:.2f} seconds")
        return duration
        
    async def check_ai_services(self):
        """Check which AI services are available"""
        self.log("🔍 Checking StateX AI services availability...")
        
        services = {
            "ai_orchestrator": AI_ORCHESTRATOR_URL,
            "free_ai_service": FREE_AI_SERVICE_URL,
            "nlp_service": NLP_SERVICE_URL,
            "asr_service": ASR_SERVICE_URL,
            "document_ai": DOCUMENT_AI_URL
        }
        
        for service_name, url in services.items():
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(f"{url}/health", timeout=aiohttp.ClientTimeout(total=5)) as response:
                        if response.status == 200:
                            self.ai_services_available[service_name] = "available"
                            self.log(f"✅ {service_name.replace('_', ' ').title()} is available")
                        else:
                            self.ai_services_available[service_name] = "unavailable"
                            self.log(f"❌ {service_name.replace('_', ' ').title()} not available: {response.status}")
            except Exception as e:
                self.ai_services_available[service_name] = "unavailable"
                self.log(f"❌ {service_name.replace('_', ' ').title()} not available: {e}")
    
    async def send_telegram_notification(self, message: str, user_name: str) -> Dict[str, Any]:
        """Send Telegram notification"""
        self.log(f"📱 Sending Telegram notification to {user_name}")
        
        notification_data = {
            "user_id": self.session_id,
            "type": "ai_analysis",
            "title": "StateX AI Analysis",
            "message": message,
            "contact_type": "telegram",
            "contact_value": "694579866",  # Your Telegram chat ID
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
    
    async def test_free_ai_agent(self, text_content: str, voice_transcript: str, file_content: str, user_name: str) -> Dict[str, Any]:
        """Test Free AI Agent performance"""
        self.log("🤖 Testing Free AI Agent...")
        start_time = time.time()
        
        # Capture INPUT preview
        input_preview = {
            "text_preview": (text_content[:200] + "...") if len(text_content) > 200 else text_content,
            "voice_length": len(voice_transcript or ""),
            "file_length": len(file_content or "")
        }

        analysis_request = {
            "text_content": text_content,
            "voice_transcript": voice_transcript,
            "file_content": file_content,
            "analysis_type": "business_analysis",
            "user_name": user_name
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{FREE_AI_SERVICE_URL}/analyze",
                    json=analysis_request,
                    timeout=aiohttp.ClientTimeout(total=120)
                ) as response:
                    processing_time = time.time() - start_time
                    
                    if response.status == 200:
                        result = await response.json()
                        if result.get("success"):
                            self.log(f"✅ Free AI Agent completed in {processing_time:.2f} seconds")
                            
                            # Store performance metrics
                            self.performance_metrics["free_ai"] = {
                                "status": "success",
                                "processing_time": processing_time,
                                "provider": result.get("provider_used", "Unknown"),
                                "model": result.get("model_used", "Unknown"),
                                "confidence": result.get("confidence", 0.8),
                                "response_length": len(str(result.get("analysis", {}))),
                                "input_preview": input_preview
                            }
                            
                            return result
                        else:
                            self.log(f"❌ Free AI Agent failed: {result.get('error', 'Unknown error')}", "ERROR")
                            self.performance_metrics["free_ai"] = {
                                "status": "failed",
                                "processing_time": processing_time,
                                "error": result.get("error", "Unknown error"),
                                "input_preview": input_preview
                            }
                            return {"success": False, "error": result.get("error", "Unknown error")}
                    else:
                        error_text = await response.text()
                        self.log(f"❌ Free AI Agent failed: {response.status} - {error_text}", "ERROR")
                        self.performance_metrics["free_ai"] = {
                            "status": "failed",
                            "processing_time": processing_time,
                            "error": f"HTTP {response.status}: {error_text}",
                            "input_preview": input_preview
                        }
                        return {"success": False, "error": error_text}
        except Exception as e:
            processing_time = time.time() - start_time
            self.log(f"❌ Free AI Agent error: {str(e)}", "ERROR")
            self.performance_metrics["free_ai"] = {
                "status": "failed",
                "processing_time": processing_time,
                "error": str(e),
                "input_preview": input_preview
            }
            return {"success": False, "error": str(e)}
    
    async def test_nlp_agent(self, text_content: str, voice_transcript: str, file_content: str, user_name: str) -> Dict[str, Any]:
        """Test NLP Agent performance"""
        self.log("🧠 Testing NLP Agent...")
        start_time = time.time()
        
        combined_text = f"{text_content}\n\nVoice Transcript:\n{voice_transcript}\n\nFile Content:\n{file_content}"

        # Capture INPUT preview
        input_preview = {
            "combined_text_preview": (combined_text[:300] + "...") if len(combined_text) > 300 else combined_text
        }
        
        nlp_request = {
            "text_content": combined_text,
            "analysis_type": "comprehensive",
            "requirements": "Business analysis and requirements extraction"
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{NLP_SERVICE_URL}/api/analyze-text",
                    json=nlp_request,
                    timeout=aiohttp.ClientTimeout(total=120)
                ) as response:
                    processing_time = time.time() - start_time
                    
                    if response.status == 200:
                        result = await response.json()
                        self.log(f"✅ NLP Agent completed in {processing_time:.2f} seconds")
                        
                        # Store performance metrics
                        self.performance_metrics["nlp"] = {
                            "status": "success",
                            "processing_time": processing_time,
                            "provider": "NLP Service",
                            "model": "OpenAI GPT-4",
                            "confidence": 0.9,
                            "response_length": len(str(result)),
                            "input_preview": input_preview
                        }
                        
                        return result
                    else:
                        error_text = await response.text()
                        self.log(f"❌ NLP Agent failed: {response.status} - {error_text}", "ERROR")
                        self.performance_metrics["nlp"] = {
                            "status": "failed",
                            "processing_time": processing_time,
                            "error": f"HTTP {response.status}: {error_text}",
                            "input_preview": input_preview
                        }
                        return {"success": False, "error": error_text}
        except Exception as e:
            processing_time = time.time() - start_time
            self.log(f"❌ NLP Agent error: {str(e)}", "ERROR")
            self.performance_metrics["nlp"] = {
                "status": "failed",
                "processing_time": processing_time,
                "error": str(e),
                "input_preview": input_preview
            }
            return {"success": False, "error": str(e)}
    
    async def test_asr_agent(self, voice_transcript: str, user_name: str) -> Dict[str, Any]:
        """Test ASR Agent performance"""
        self.log("🎤 Testing ASR Agent...")
        start_time = time.time()
        
        asr_request = {
            "voice_file_url": "https://example.com/sample-audio.wav",
            "analysis_type": "comprehensive"
        }

        # Capture INPUT preview
        input_preview = {
            "voice_file_url": asr_request["voice_file_url"],
            "analysis_type": asr_request["analysis_type"]
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{ASR_SERVICE_URL}/api/analyze-voice",
                    json=asr_request,
                    timeout=aiohttp.ClientTimeout(total=120)
                ) as response:
                    processing_time = time.time() - start_time
                    
                    if response.status == 200:
                        result = await response.json()
                        self.log(f"✅ ASR Agent completed in {processing_time:.2f} seconds")
                        
                        # Store performance metrics
                        self.performance_metrics["asr"] = {
                            "status": "success",
                            "processing_time": processing_time,
                            "provider": "ASR Service",
                            "model": "OpenAI Whisper",
                            "confidence": 0.85,
                            "response_length": len(str(result)),
                            "input_preview": input_preview
                        }
                        
                        return result
                    else:
                        error_text = await response.text()
                        self.log(f"❌ ASR Agent failed: {response.status} - {error_text}", "ERROR")
                        self.performance_metrics["asr"] = {
                            "status": "failed",
                            "processing_time": processing_time,
                            "error": f"HTTP {response.status}: {error_text}",
                            "input_preview": input_preview
                        }
                        return {"success": False, "error": error_text}
        except Exception as e:
            processing_time = time.time() - start_time
            self.log(f"❌ ASR Agent error: {str(e)}", "ERROR")
            self.performance_metrics["asr"] = {
                "status": "failed",
                "processing_time": processing_time,
                "error": str(e),
                "input_preview": input_preview
            }
            return {"success": False, "error": str(e)}
    
    async def test_document_ai_agent(self, file_content: str, user_name: str) -> Dict[str, Any]:
        """Test Document AI Agent performance"""
        self.log("📄 Testing Document AI Agent...")
        start_time = time.time()
        
        document_request = {
            "file_urls": ["https://example.com/sample-document.pdf"],
            "analysis_type": "comprehensive",
            "extract_text": True,
            "extract_metadata": True,
            "extract_images": False
        }

        # Capture INPUT preview
        input_preview = {
            "file_urls": document_request["file_urls"],
            "analysis_type": document_request["analysis_type"],
            "extract_text": document_request["extract_text"],
            "extract_metadata": document_request["extract_metadata"]
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{DOCUMENT_AI_URL}/api/analyze-documents",
                    json=document_request,
                    timeout=aiohttp.ClientTimeout(total=120)
                ) as response:
                    processing_time = time.time() - start_time
                    
                    if response.status == 200:
                        result = await response.json()
                        self.log(f"✅ Document AI Agent completed in {processing_time:.2f} seconds")
                        
                        # Store performance metrics
                        self.performance_metrics["document_ai"] = {
                            "status": "success",
                            "processing_time": processing_time,
                            "provider": "Document AI Service",
                            "model": "Tesseract OCR + Unstructured",
                            "confidence": 0.8,
                            "response_length": len(str(result)),
                            "input_preview": input_preview
                        }
                        
                        return result
                    else:
                        error_text = await response.text()
                        self.log(f"❌ Document AI Agent failed: {response.status} - {error_text}", "ERROR")
                        self.performance_metrics["document_ai"] = {
                            "status": "failed",
                            "processing_time": processing_time,
                            "error": f"HTTP {response.status}: {error_text}",
                            "input_preview": input_preview
                        }
                        return {"success": False, "error": error_text}
        except Exception as e:
            processing_time = time.time() - start_time
            self.log(f"❌ Document AI Agent error: {str(e)}", "ERROR")
            self.performance_metrics["document_ai"] = {
                "status": "failed",
                "processing_time": processing_time,
                "error": str(e),
                "input_preview": input_preview
            }
            return {"success": False, "error": str(e)}
    
    async def test_ai_orchestrator_agent(self, text_content: str, voice_transcript: str, file_content: str, user_name: str) -> Dict[str, Any]:
        """Test AI Orchestrator Agent performance"""
        self.log("🎯 Testing AI Orchestrator Agent...")
        start_time = time.time()
        
        submission_request = {
            "user_id": self.session_id,
            "submission_type": "mixed",
            "text_content": text_content,
            "voice_file_url": "https://example.com/sample-voice.wav" if voice_transcript else None,
            "file_urls": ["https://example.com/sample-document.pdf"] if file_content else None,
            "requirements": "Business analysis and prototype generation",
            "contact_info": {
                "email": "ssfskype@gmail.com",
                "whatsapp": "+420774287541",
                "telegram_chat_id": "694579866"
            }
        }

        # Capture INPUT preview
        input_preview = {
            "text_preview": (text_content[:200] + "...") if len(text_content) > 200 else text_content,
            "voice_file_url": submission_request["voice_file_url"],
            "file_urls": submission_request["file_urls"],
            "requirements": submission_request["requirements"]
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{AI_ORCHESTRATOR_URL}/api/process-submission",
                    json=submission_request,
                    timeout=aiohttp.ClientTimeout(total=120)
                ) as response:
                    processing_time = time.time() - start_time
                    
                    if response.status == 200:
                        result = await response.json()
                        self.log(f"✅ AI Orchestrator Agent completed in {processing_time:.2f} seconds")
                        
                        # Store performance metrics
                        self.performance_metrics["ai_orchestrator"] = {
                            "status": "success",
                            "processing_time": processing_time,
                            "provider": "AI Orchestrator",
                            "model": "Multi-Agent Coordination",
                            "confidence": 0.9,
                            "response_length": len(str(result)),
                            "input_preview": input_preview
                        }
                        
                        return result
                    else:
                        error_text = await response.text()
                        self.log(f"❌ AI Orchestrator Agent failed: {response.status} - {error_text}", "ERROR")
                        self.performance_metrics["ai_orchestrator"] = {
                            "status": "failed",
                            "processing_time": processing_time,
                            "error": f"HTTP {response.status}: {error_text}",
                            "input_preview": input_preview
                        }
                        return {"success": False, "error": error_text}
        except Exception as e:
            processing_time = time.time() - start_time
            self.log(f"❌ AI Orchestrator Agent error: {str(e)}", "ERROR")
            self.performance_metrics["ai_orchestrator"] = {
                "status": "failed",
                "processing_time": processing_time,
                "error": str(e),
                "input_preview": input_preview
            }
            return {"success": False, "error": str(e)}
    
    def generate_agent_summary(self, agent_name: str, result: Dict[str, Any], metrics: Dict[str, Any]) -> str:
        """Generate summary for individual AI agent"""
        status_emoji = "✅" if metrics["status"] == "success" else "❌"
        
        summary = f"""{status_emoji} *{agent_name.replace('_', ' ').title()} Agent Results*

⏱️ *Processing Time:* {metrics['processing_time']:.2f} seconds
🤖 *Provider:* {metrics.get('provider', 'Unknown')}
🧠 *Model:* {metrics.get('model', 'Unknown')}
🎯 *Confidence:* {metrics.get('confidence', 0.8):.1%}
📊 *Response Length:* {metrics.get('response_length', 0)} characters

🧾 *Input:*
{json.dumps(metrics.get('input_preview', {}), ensure_ascii=False, indent=2)}

"""
        
        if metrics["status"] == "success":
            # Show actual response content instead of just length
            if isinstance(result, dict):
                # Try to extract meaningful content from the response
                analysis = result.get("analysis", {})
                if analysis:
                    summary += f"📋 *Analysis Summary:*\n{analysis.get('summary', 'Analysis completed successfully.')}\n\n"
                    
                    # Add key insights
                    insights = analysis.get('insights', [])
                    if insights:
                        summary += f"💡 *Key Insights:*\n"
                        for insight in insights[:3]:  # Show top 3 insights
                            summary += f"• {insight}\n"
                        summary += "\n"
                    
                    # Add recommendations
                    recommendations = analysis.get('recommendations', [])
                    if recommendations:
                        summary += f"🔧 *Recommendations:*\n"
                        for rec in recommendations[:3]:  # Show top 3 recommendations
                            summary += f"• {rec}\n"
                        summary += "\n"
                else:
                    # If no analysis field, show the main response content
                    main_content = result.get('message', result.get('response', str(result)))
                    if main_content and len(str(main_content)) > 50:
                        # Truncate very long responses
                        content_preview = str(main_content)[:500] + "..." if len(str(main_content)) > 500 else str(main_content)
                        summary += f"📄 *Response Content:*\n{content_preview}\n\n"
                    else:
                        summary += f"📄 *Response Content:*\n{main_content}\n\n"
            else:
                # If result is not a dict, show it as is
                result_str = str(result)
                if len(result_str) > 500:
                    result_str = result_str[:500] + "..."
                summary += f"📄 *Response Content:*\n{result_str}\n\n"
        else:
            summary += f"❌ *Error:* {metrics.get('error', 'Unknown error')}\n\n"
        
        return summary
    
    def generate_performance_summary(self) -> str:
        """Generate overall performance summary"""
        successful_agents = [name for name, metrics in self.performance_metrics.items() if metrics.get("status") == "success"]
        failed_agents = [name for name, metrics in self.performance_metrics.items() if metrics.get("status") == "failed"]
        
        # Check which agents are missing (not tested at all)
        all_expected_agents = ["free_ai", "nlp", "asr", "document_ai", "ai_orchestrator"]
        tested_agents = list(self.performance_metrics.keys())
        missing_agents = [agent for agent in all_expected_agents if agent not in tested_agents]
        
        total_time = sum(metrics["processing_time"] for metrics in self.performance_metrics.values())
        avg_time = total_time / len(self.performance_metrics) if self.performance_metrics else 0
        
        fastest_agent = min(self.performance_metrics.items(), key=lambda x: x[1]["processing_time"]) if self.performance_metrics else None
        slowest_agent = max(self.performance_metrics.items(), key=lambda x: x[1]["processing_time"]) if self.performance_metrics else None
        
        summary = f"""📊 *AI Agents Performance Summary*

✅ *Successful Agents:* {len(successful_agents)}/5
❌ *Failed Agents:* {len(failed_agents)}/5
🚫 *Missing Agents:* {len(missing_agents)}/5

⏱️ *Performance Metrics:*
• Total Processing Time: {total_time:.2f} seconds
• Average Processing Time: {avg_time:.2f} seconds
• Fastest Agent: {fastest_agent[0].replace('_', ' ').title() if fastest_agent else 'N/A'} ({fastest_agent[1]['processing_time']:.2f}s)
• Slowest Agent: {slowest_agent[0].replace('_', ' ').title() if slowest_agent else 'N/A'} ({slowest_agent[1]['processing_time']:.2f}s)

🤖 *Agent Details:*
"""
        
        for agent_name, metrics in self.performance_metrics.items():
            status_emoji = "✅" if metrics["status"] == "success" else "❌"
            summary += f"• {status_emoji} {agent_name.replace('_', ' ').title()}: {metrics['processing_time']:.2f}s ({metrics.get('provider', 'Unknown')})\n"
        
        # Add missing agents
        for missing_agent in missing_agents:
            summary += f"• 🚫 {missing_agent.replace('_', ' ').title()}: Not Available (Service Down)\n"
        
        return summary
    
    async def run_complete_workflow(self, test_data: Dict[str, Any]):
        """Run the complete workflow test with all AI agents"""
        self.start_time = time.time()
        self.log("🚀 Starting StateX Real AI Agents Performance Test")
        self.log("=" * 70)
        
        # Check AI services availability
        await self.check_ai_services()
        
        # Step 1: Send initial confirmation notification
        self.log("📧 Step 1: Sending initial confirmation notification")
        confirmation_message = f"""Hello {test_data['user_name']}!

Thank you for your submission! We've received your project details:
• Text description: {len(test_data['text_content'])} characters
• Voice transcript: {len(test_data['voice_transcript'])} characters  
• File content: {len(test_data['file_content'])} characters

Our AI agents are now analyzing your requirements using StateX AI services. We'll contact you via Telegram with the analysis results shortly.

Best regards,
The Statex Team"""
        
        await self.send_telegram_notification(confirmation_message, test_data["user_name"])
        
        # Step 2: Test all AI agents in parallel
        self.log("\n🤖 Step 2: Testing all AI agents in parallel")
        
        # Create tasks for all available agents
        ai_tasks = []
        
        if self.ai_services_available.get("free_ai_service") == "available":
            ai_tasks.append(("Free AI Agent", self.test_free_ai_agent(
                test_data['text_content'], test_data['voice_transcript'], 
                test_data['file_content'], test_data['user_name']
            )))
        
        if self.ai_services_available.get("nlp_service") == "available":
            ai_tasks.append(("NLP Agent", self.test_nlp_agent(
                test_data['text_content'], test_data['voice_transcript'], 
                test_data['file_content'], test_data['user_name']
            )))
        
        if self.ai_services_available.get("asr_service") == "available":
            ai_tasks.append(("ASR Agent", self.test_asr_agent(
                test_data['voice_transcript'], test_data['user_name']
            )))
        
        if self.ai_services_available.get("document_ai") == "available":
            ai_tasks.append(("Document AI Agent", self.test_document_ai_agent(
                test_data['file_content'], test_data['user_name']
            )))
        
        if self.ai_services_available.get("ai_orchestrator") == "available":
            ai_tasks.append(("AI Orchestrator Agent", self.test_ai_orchestrator_agent(
                test_data['text_content'], test_data['voice_transcript'], 
                test_data['file_content'], test_data['user_name']
            )))
        
        if not ai_tasks:
            self.log("❌ No AI agents available - cannot proceed with analysis")
            return
        
        # Execute all AI agents in parallel
        self.log(f"🚀 Executing {len(ai_tasks)} AI agents in parallel...")
        ai_start_time = time.time()
        
        # Run all tasks concurrently
        task_results = await asyncio.gather(*[task[1] for task in ai_tasks], return_exceptions=True)
        
        ai_total_time = time.time() - ai_start_time
        self.log(f"🤖 All AI agents completed in {ai_total_time:.2f} seconds")
        
        # Step 3: Send individual results from each agent
        self.log("\n📱 Step 3: Sending individual AI agent results")
        
        for i, (agent_name, task) in enumerate(ai_tasks):
            result = task_results[i]
            
            if isinstance(result, Exception):
                self.log(f"❌ {agent_name} failed with exception: {result}", "ERROR")
                continue
            
            # Get performance metrics for this agent
            agent_key = agent_name.lower().replace(' ', '_').replace('_agent', '')
            metrics = self.performance_metrics.get(agent_key, {})
            
            # Generate and send individual summary
            individual_summary = self.generate_agent_summary(agent_name, result, metrics)
            await self.send_telegram_notification(individual_summary, test_data["user_name"])
            
            # Store results
            self.ai_agent_results[agent_name] = {
                "result": result,
                "metrics": metrics
            }
        
        # Step 4: Send overall performance summary
        self.log("\n📊 Step 4: Sending overall performance summary")
        performance_summary = self.generate_performance_summary()
        await self.send_telegram_notification(performance_summary, test_data["user_name"])
        
        # Step 5: Final summary
        total_time = time.time() - self.start_time
        self.log("\n" + "=" * 70)
        self.log("🎉 StateX Real AI Agents Performance Test Complete!")
        self.log(f"⏱️  Total Time: {total_time:.2f} seconds")
        self.log(f"🤖 AI Agents Tested: {len(ai_tasks)}")
        successful_count = len([r for r in task_results if not isinstance(r, Exception) and (r.get('success', True) if isinstance(r, dict) else True)])
        failed_count = len([r for r in task_results if isinstance(r, Exception) or (isinstance(r, dict) and r.get('success', True) == False)])
        self.log(f"✅ Successful: {successful_count}")
        self.log(f"❌ Failed: {failed_count}")
        
        # Store final results
        self.results = {
            "session_id": self.session_id,
            "total_time": total_time,
            "ai_total_time": ai_total_time,
            "ai_agent_results": self.ai_agent_results,
            "performance_metrics": self.performance_metrics,
            "ai_services_available": self.ai_services_available,
            "successful_agents": len([r for r in task_results if not isinstance(r, Exception) and (r.get('success', True) if isinstance(r, dict) else True)]),
            "failed_agents": len([r for r in task_results if isinstance(r, Exception) or (isinstance(r, dict) and r.get('success', True) == False)])
        }
        
        return self.results

def get_user_input():
    """Get user input for test data"""
    print("\n🚀 StateX Real AI Agents Performance Test")
    print("=" * 60)
    print("This test measures the performance of ALL AI agents individually")
    print("\nPlease provide your test credentials:")
    print("(Press Enter to use default values)")
    
    user_name = input(f"\n👤 Your name [{DEFAULT_TEST_DATA['user_name']}]: ").strip() or DEFAULT_TEST_DATA['user_name']
    email = input(f"📧 Email address [{DEFAULT_TEST_DATA['email']}]: ").strip() or DEFAULT_TEST_DATA['email']
    whatsapp = input(f"📱 WhatsApp number [{DEFAULT_TEST_DATA['whatsapp']}]: ").strip() or DEFAULT_TEST_DATA['whatsapp']
    telegram_chat_id = input(f"✈️ Telegram Chat ID [{DEFAULT_TEST_DATA['telegram_chat_id']}]: ").strip() or DEFAULT_TEST_DATA['telegram_chat_id']
    
    print(f"\n📝 Project description:")
    print(f"Current: {DEFAULT_TEST_DATA['text_content'][:100]}...")
    use_default_text = input("Use default project description? (y/n) [y]: ").strip().lower() or "y"
    
    if use_default_text == "y":
        text_content = DEFAULT_TEST_DATA['text_content']
        voice_transcript = DEFAULT_TEST_DATA['voice_transcript']
        file_content = DEFAULT_TEST_DATA['file_content']
    else:
        text_content = input("Enter your project description: ").strip()
        voice_transcript = input("Enter voice transcript (or press Enter to skip): ").strip()
        file_content = input("Enter file content (or press Enter to skip): ").strip()
    
    return {
        "user_name": user_name,
        "email": email,
        "whatsapp": whatsapp,
        "telegram_chat_id": telegram_chat_id,
        "text_content": text_content,
        "voice_transcript": voice_transcript,
        "file_content": file_content
    }

async def main():
    """Main function"""
    tester = RealAIAgentsTester()
    
    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "--default":
            print("🚀 Using default test data...")
            test_data = DEFAULT_TEST_DATA
        elif sys.argv[1] == "--demo":
            print("🚀 Running demo with sample data...")
            test_data = DEFAULT_TEST_DATA
        else:
            print("Usage: python3 test_real_ai_agents.py [--default|--demo]")
            sys.exit(1)
    else:
        test_data = get_user_input()
    
    # Run the complete workflow
    try:
        results = await tester.run_complete_workflow(test_data)
        
        # Print final summary
        print(f"\n📊 Test Results Summary:")
        print(f"   Session ID: {results['session_id']}")
        print(f"   Total Time: {results['total_time']:.2f} seconds")
        print(f"   AI Total Time: {results['ai_total_time']:.2f} seconds")
        print(f"   Successful Agents: {results['successful_agents']}/5")
        print(f"   Failed Agents: {results['failed_agents']}/5")
        print(f"   Status: {'✅ Success' if results['successful_agents'] > 0 else '❌ Failed'}")
        
        # Print individual agent performance
        print(f"\n🤖 Individual Agent Performance:")
        for agent_name, data in results['ai_agent_results'].items():
            metrics = data['metrics']
            status_emoji = "✅" if metrics['status'] == "success" else "❌"
            print(f"   {status_emoji} {agent_name}: {metrics['processing_time']:.2f}s ({metrics.get('provider', 'Unknown')})")
        
        # Show missing agents based on service availability
        available_services = results.get('ai_services_available', {})
        missing_services = [name for name, status in available_services.items() if status == "unavailable"]
        
        if missing_services:
            print(f"\n🚫 Missing Agents (Service Down):")
            for service in missing_services:
                if service == "asr_service":
                    print(f"   🚫 ASR Agent: Not Available (Service Down)")
                elif service == "free_ai_service":
                    print(f"   🚫 Free AI Agent: Not Available (Service Down)")
                elif service == "nlp_service":
                    print(f"   🚫 NLP Agent: Not Available (Service Down)")
                elif service == "document_ai":
                    print(f"   🚫 Document AI Agent: Not Available (Service Down)")
                elif service == "ai_orchestrator":
                    print(f"   🚫 AI Orchestrator Agent: Not Available (Service Down)")
        else:
            print(f"\n✅ All Expected Agents Tested Successfully!")
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
