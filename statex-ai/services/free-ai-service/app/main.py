#!/usr/bin/env python3
"""
StateX Free AI Service

This service provides access to free AI models:
1. Ollama (Local LLM) - Llama 2, Mistral, CodeLlama
2. Hugging Face Inference API - Various open-source models
3. Mock AI Service - For testing and development

Port: 8016
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import asyncio
import aiohttp
import json
import ssl
import time
import logging
from datetime import datetime
from enum import Enum
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="StateX Free AI Service",
    description="Free AI models service using Ollama, Hugging Face, and Mock AI",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
import os
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://ollama:11434")
HUGGINGFACE_URL = "https://api-inference.huggingface.co/models"
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_API_BASE = os.getenv("OPENROUTER_API_BASE", "https://openrouter.ai/api/v1")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "anthropic/claude-3.5-sonnet")

# Prometheus metrics
REQUEST_COUNT = Counter('ai_requests_total', 'Total AI requests', ['provider', 'status'])
REQUEST_DURATION = Histogram('ai_request_duration_seconds', 'AI request duration', ['provider'])
ACTIVE_REQUESTS = Gauge('ai_active_requests', 'Active AI requests')
AI_AGENT_STATUS = Gauge('ai_agent_status', 'AI agent status', ['agent_name'])

class AIProvider(str, Enum):
    OLLAMA = "ollama"
    HUGGINGFACE = "huggingface"
    OPENROUTER = "openrouter"
    MOCK = "mock"

class AnalysisType(str, Enum):
    BUSINESS_ANALYSIS = "business_analysis"
    TECHNICAL_ANALYSIS = "technical_analysis"
    CONTENT_GENERATION = "content_generation"
    SENTIMENT_ANALYSIS = "sentiment_analysis"

class AIAnalysisRequest(BaseModel):
    text_content: str
    analysis_type: AnalysisType = AnalysisType.BUSINESS_ANALYSIS
    user_name: str = "User"
    provider: Optional[AIProvider] = None  # Auto-detect if not specified
    model: Optional[str] = None  # Specific model to use

class AIAnalysisResponse(BaseModel):
    success: bool
    analysis: Dict[str, Any]
    provider_used: str
    model_used: str
    processing_time: float
    confidence: float
    error: Optional[str] = None

class AIModelInfo(BaseModel):
    name: str
    provider: str
    description: str
    capabilities: List[str]
    status: str  # available, unavailable, loading

class FreeAIService:
    def __init__(self):
        self.available_models = {}
        self.provider_status = {}
        self.model_preferences = {
            AnalysisType.BUSINESS_ANALYSIS: {
                "openrouter": ["google/gemini-2.0-flash-exp:free", "openai/gpt-oss-20b:free", "anthropic/claude-3.5-sonnet", "openai/gpt-4o", "meta-llama/llama-3.1-70b-instruct"],
                "ollama": ["llama2:7b", "mistral:7b"],
                "huggingface": ["microsoft/DialoGPT-medium", "gpt2", "facebook/blenderbot-400M-distill"]
            },
            AnalysisType.TECHNICAL_ANALYSIS: {
                "openrouter": ["google/gemini-2.0-flash-exp:free", "openai/gpt-oss-20b:free", "anthropic/claude-3.5-sonnet", "openai/gpt-4o", "meta-llama/llama-3.1-70b-instruct"],
                "ollama": ["codellama:7b", "mistral:7b", "llama2:7b"],
                "huggingface": ["microsoft/CodeBERT-base", "gpt2", "microsoft/DialoGPT-medium"]
            },
            AnalysisType.CONTENT_GENERATION: {
                "openrouter": ["google/gemini-2.0-flash-exp:free", "openai/gpt-oss-20b:free", "anthropic/claude-3.5-sonnet", "openai/gpt-4o", "meta-llama/llama-3.1-70b-instruct"],
                "ollama": ["llama2:7b", "mistral:7b"],
                "huggingface": ["gpt2", "microsoft/DialoGPT-medium"]
            },
            AnalysisType.SENTIMENT_ANALYSIS: {
                "openrouter": ["google/gemini-2.0-flash-exp:free", "openai/gpt-oss-20b:free", "anthropic/claude-3.5-sonnet", "openai/gpt-4o"],
                "ollama": ["llama2:7b"],
                "huggingface": ["cardiffnlp/twitter-roberta-base-sentiment-latest", "distilbert-base-uncased"]
            }
        }
        
    async def check_providers(self):
        """Check which AI providers are available"""
        logger.info("🔍 Checking AI providers availability...")
        
        # Check Ollama
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{OLLAMA_URL}/api/tags", timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        models_data = await response.json()
                        available_models = models_data.get("models", [])
                        
                        if available_models:
                            self.provider_status["ollama"] = "available"
                            self.available_models["ollama"] = []
                            
                            # Add actually available models
                            for model in available_models:
                                model_name = model.get("name", "")
                                if "llama2" in model_name:
                                    self.available_models["ollama"].append({
                                        "name": model_name, 
                                        "description": "Llama 2 - General purpose AI model"
                                    })
                                elif "mistral" in model_name:
                                    self.available_models["ollama"].append({
                                        "name": model_name, 
                                        "description": "Mistral - Efficient AI model for analysis"
                                    })
                                elif "codellama" in model_name:
                                    self.available_models["ollama"].append({
                                        "name": model_name, 
                                        "description": "CodeLlama - Code-focused AI model"
                                    })
                            
                            # If no specific models found, add defaults
                            if not self.available_models["ollama"]:
                                self.available_models["ollama"] = [
                                    {"name": "llama2:7b", "description": "Llama 2 7B - General purpose"},
                                    {"name": "mistral:7b", "description": "Mistral 7B - Code and analysis"},
                                    {"name": "codellama:7b", "description": "CodeLlama 7B - Technical analysis"}
                                ]
                            
                            logger.info(f"✅ Ollama is available with {len(self.available_models['ollama'])} models")
                        else:
                            self.provider_status["ollama"] = "no_models"
                            logger.warning("⚠️ Ollama is running but no models are available")
                    else:
                        self.provider_status["ollama"] = "unavailable"
                        logger.warning(f"❌ Ollama returned status {response.status}")
        except Exception as e:
            logger.warning(f"❌ Ollama not available: {e}")
            self.provider_status["ollama"] = "unavailable"
        
        # Check Hugging Face
        try:
            headers = {}
            if HUGGINGFACE_API_KEY:
                headers["Authorization"] = f"Bearer {HUGGINGFACE_API_KEY}"
            
            async with aiohttp.ClientSession() as session:
                # Test with a simple model that's likely to be available
                async with session.get(
                    f"{HUGGINGFACE_URL}/gpt2", 
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        self.provider_status["huggingface"] = "available"
                        self.available_models["huggingface"] = [
                            {"name": "microsoft/DialoGPT-medium", "description": "DialoGPT - Conversational AI"},
                            {"name": "gpt2", "description": "GPT-2 - Text generation"},
                            {"name": "distilbert-base-uncased", "description": "DistilBERT - Text classification"},
                            {"name": "facebook/blenderbot-400M-distill", "description": "BlenderBot - Conversational AI"}
                        ]
                        logger.info("✅ Hugging Face API is available")
                    elif response.status == 503:
                        # Model is loading
                        self.provider_status["huggingface"] = "loading"
                        logger.info("⏳ Hugging Face API is available but model is loading")
                    else:
                        self.provider_status["huggingface"] = "unavailable"
                        logger.warning(f"❌ Hugging Face API returned status {response.status}")
        except Exception as e:
            logger.warning(f"❌ Hugging Face API not available: {e}")
            self.provider_status["huggingface"] = "unavailable"
        
        # Check OpenRouter
        try:
            if OPENROUTER_API_KEY:
                # Test with a simple request to check if API key is valid
                headers = {"Authorization": f"Bearer {OPENROUTER_API_KEY}"}
                # Create SSL context that doesn't verify certificates for testing
                ssl_context = ssl.create_default_context()
                ssl_context.check_hostname = False
                ssl_context.verify_mode = ssl.CERT_NONE
                
                connector = aiohttp.TCPConnector(ssl=ssl_context)
                async with aiohttp.ClientSession(connector=connector) as session:
                    async with session.get(
                        f"{OPENROUTER_API_BASE}/models",
                        headers=headers,
                        timeout=aiohttp.ClientTimeout(total=10)
                    ) as response:
                        if response.status == 200:
                            self.provider_status["openrouter"] = "available"
                            self.available_models["openrouter"] = [
                                {"name": "google/gemini-2.0-flash-exp:free", "description": "Google: Gemini 2.0 Flash Experimental (free)"},
                                {"name": "openai/gpt-oss-20b:free", "description": "OpenAI: gpt-oss-20b (free)"},   
                                {"name": "anthropic/claude-3.5-sonnet", "description": "Claude 3.5 Sonnet - Advanced reasoning"},
                                {"name": "openai/gpt-4o", "description": "GPT-4o - Multimodal AI model"},
                                {"name": "meta-llama/llama-3.1-70b-instruct", "description": "Llama 3.1 70B - Large language model"}
                            ]
                            logger.info("✅ OpenRouter API is available")
                        else:
                            self.provider_status["openrouter"] = "unavailable"
                            logger.warning(f"❌ OpenRouter API returned status {response.status}")
            else:
                self.provider_status["openrouter"] = "unavailable"
                logger.warning("❌ OpenRouter API key not provided")
        except Exception as e:
            logger.warning(f"❌ OpenRouter API not available: {e}")
            self.provider_status["openrouter"] = "unavailable"
        
        # Mock AI is always available
        self.provider_status["mock"] = "available"
        self.available_models["mock"] = [
            {"name": "mock-ai", "description": "Mock AI - Realistic simulation for testing"}
        ]
        logger.info("✅ Mock AI is available")
    
    def get_best_model(self, analysis_type: AnalysisType, provider: str = None) -> tuple[str, str]:
        """Get the best available model for the given analysis type and provider"""
        
        if provider and provider in self.provider_status and self.provider_status[provider] == "available":
            # Use specific provider
            preferred_models = self.model_preferences.get(analysis_type, {}).get(provider, [])
            available_models = [m["name"] for m in self.available_models.get(provider, [])]
            
            for model in preferred_models:
                if model in available_models or provider == "ollama":  # Ollama models might not be in the list yet
                    return provider, model
            
            # Fallback to first available model for this provider
            if available_models:
                return provider, available_models[0]
        
        # Auto-select best provider and model
        provider_priority = ["openrouter", "ollama", "huggingface", "mock"]
        
        for prov in provider_priority:
            if self.provider_status.get(prov) == "available":
                preferred_models = self.model_preferences.get(analysis_type, {}).get(prov, [])
                available_models = [m["name"] for m in self.available_models.get(prov, [])]
                
                for model in preferred_models:
                    if model in available_models or prov == "ollama":
                        return prov, model
                
                # Fallback to first available model
                if available_models:
                    return prov, available_models[0]
                elif prov == "mock":
                    return prov, "mock-ai"
        
        # Ultimate fallback
        return "mock", "mock-ai"
    
    async def analyze_with_fallback(self, request: AIAnalysisRequest) -> Dict[str, Any]:
        """Analyze with automatic fallback between providers"""
        
        # Determine provider and model
        provider, model = self.get_best_model(request.analysis_type, request.provider)
        
        # Override model if specified in request
        if request.model:
            model = request.model
        
        logger.info(f"🎯 Selected provider: {provider}, model: {model}")
        
        # Try primary provider
        try:
            if provider == "openrouter":
                request.model = model
                return await self.analyze_with_openrouter(request)
            elif provider == "ollama":
                request.model = model
                return await self.analyze_with_ollama(request)
            elif provider == "huggingface":
                request.model = model
                return await self.analyze_with_huggingface(request)
            else:
                return self.analyze_with_mock(request)
        except Exception as e:
            logger.warning(f"⚠️ Primary provider {provider} failed: {e}")
            
            # Try fallback providers
            fallback_providers = ["openrouter", "ollama", "huggingface", "mock"]
            fallback_providers = [p for p in fallback_providers if p != provider]
            
            for fallback_provider in fallback_providers:
                if self.provider_status.get(fallback_provider) == "available":
                    try:
                        logger.info(f"🔄 Trying fallback provider: {fallback_provider}")
                        fallback_provider_name, fallback_model = self.get_best_model(request.analysis_type, fallback_provider)
                        
                        if fallback_provider == "openrouter":
                            request.model = fallback_model
                            return await self.analyze_with_openrouter(request)
                        elif fallback_provider == "ollama":
                            request.model = fallback_model
                            return await self.analyze_with_ollama(request)
                        elif fallback_provider == "huggingface":
                            request.model = fallback_model
                            return await self.analyze_with_huggingface(request)
                        else:
                            return self.analyze_with_mock(request)
                    except Exception as fallback_error:
                        logger.warning(f"⚠️ Fallback provider {fallback_provider} also failed: {fallback_error}")
                        continue
            
            # Ultimate fallback to mock
            logger.info("🔄 Using mock AI as ultimate fallback")
            return self.analyze_with_mock(request)
    
    async def analyze_with_ollama(self, request: AIAnalysisRequest) -> Dict[str, Any]:
        """Analyze using Ollama (Local LLM)"""
        logger.info(f"🤖 Analyzing with Ollama: {request.model or 'llama2:7b'}")
        
        model = request.model or "llama2:7b"
        
        # Create a comprehensive prompt based on analysis type
        if request.analysis_type == AnalysisType.BUSINESS_ANALYSIS:
            prompt = f"""Analyze this business request and provide a comprehensive business analysis:

User: {request.user_name}
Request: {request.text_content}

Please provide a JSON response with these fields:
- business_type: The type of business
- pain_points: Array of current pain points
- opportunities: Array of business opportunities with name, description, potential, timeline
- technical_recommendations: Object with frontend, backend, integrations arrays
- next_steps: Array of action items with action, priority, timeline
- budget_estimate: Object with development, infrastructure, maintenance costs
- confidence: Float between 0 and 1
- summary: String summary of the analysis
"""
        elif request.analysis_type == AnalysisType.TECHNICAL_ANALYSIS:
            prompt = f"""Provide a technical analysis for this request:

User: {request.user_name}
Request: {request.text_content}

Please provide a JSON response with:
- technical_requirements: Object with frontend, backend, database, infrastructure
- architecture_recommendations: Object with patterns, technologies, scalability
- implementation_phases: Array of phases with name, description, timeline
- technology_stack: Object with recommended technologies
- confidence: Float between 0 and 1
- summary: String summary
"""
        else:
            prompt = f"""Analyze this request and provide insights:

User: {request.user_name}
Request: {request.text_content}

Please provide a JSON response with:
- key_insights: Array of insights
- recommendations: Array of recommendations
- next_steps: Array of next steps
- confidence: Float between 0 and 1
- summary: String summary
"""
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "num_predict": 1000
                    }
                }
                
                async with session.post(
                    f"{OLLAMA_URL}/api/generate",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        ai_response = result.get("response", "")
                        
                        # Try to parse JSON response
                        try:
                            json_start = ai_response.find('{')
                            json_end = ai_response.rfind('}') + 1
                            if json_start != -1 and json_end != -1:
                                json_str = ai_response[json_start:json_end]
                                analysis = json.loads(json_str)
                            else:
                                analysis = self._parse_text_response(ai_response, request.user_name, request.analysis_type)
                        except:
                            analysis = self._parse_text_response(ai_response, request.user_name, request.analysis_type)
                        
                        analysis["ai_service"] = "Ollama"
                        analysis["model_used"] = model
                        return analysis
                    else:
                        error_text = await response.text()
                        raise Exception(f"Ollama API error: {response.status} - {error_text}")
        except Exception as e:
            logger.error(f"Ollama analysis failed: {e}")
            raise e
    
    async def analyze_with_huggingface(self, request: AIAnalysisRequest) -> Dict[str, Any]:
        """Analyze using Hugging Face API"""
        logger.info(f"🤖 Analyzing with Hugging Face: {request.model or 'gpt2'}")
        
        model = request.model or "gpt2"
        
        try:
            headers = {"Content-Type": "application/json"}
            if HUGGINGFACE_API_KEY:
                headers["Authorization"] = f"Bearer {HUGGINGFACE_API_KEY}"
            
            # Create a focused prompt for business analysis
            prompt = f"Business Analysis Request from {request.user_name}: {request.text_content[:400]}"
            
            async with aiohttp.ClientSession() as session:
                payload = {
                    "inputs": prompt,
                    "parameters": {
                        "max_new_tokens": 150,
                        "temperature": 0.7,
                        "do_sample": True,
                        "return_full_text": False
                    }
                }
                
                async with session.post(
                    f"{HUGGINGFACE_URL}/{model}",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        
                        # Handle different response formats
                        ai_response = ""
                        if isinstance(result, list) and len(result) > 0:
                            if "generated_text" in result[0]:
                                ai_response = result[0]["generated_text"]
                            elif "text" in result[0]:
                                ai_response = result[0]["text"]
                        elif isinstance(result, dict):
                            ai_response = result.get("generated_text", result.get("text", ""))
                        
                        analysis = self._parse_text_response(ai_response, request.user_name, request.analysis_type)
                        analysis["ai_service"] = "Hugging Face"
                        analysis["model_used"] = model
                        return analysis
                    elif response.status == 503:
                        # Model is loading, wait and retry once
                        logger.info("⏳ Model is loading, waiting 10 seconds...")
                        await asyncio.sleep(10)
                        
                        async with session.post(
                            f"{HUGGINGFACE_URL}/{model}",
                            json=payload,
                            headers=headers,
                            timeout=aiohttp.ClientTimeout(total=60)
                        ) as retry_response:
                            if retry_response.status == 200:
                                result = await retry_response.json()
                                ai_response = result[0].get("generated_text", "") if isinstance(result, list) else ""
                                analysis = self._parse_text_response(ai_response, request.user_name, request.analysis_type)
                                analysis["ai_service"] = "Hugging Face"
                                analysis["model_used"] = model
                                return analysis
                            else:
                                error_text = await retry_response.text()
                                raise Exception(f"Hugging Face API error after retry: {retry_response.status} - {error_text}")
                    else:
                        error_text = await response.text()
                        raise Exception(f"Hugging Face API error: {response.status} - {error_text}")
        except Exception as e:
            logger.error(f"Hugging Face analysis failed: {e}")
            raise e
    
    async def analyze_with_openrouter(self, request: AIAnalysisRequest) -> Dict[str, Any]:
        """Analyze using OpenRouter API"""
        logger.info(f"🤖 Analyzing with OpenRouter: {request.model or OPENROUTER_MODEL}")
        
        model = request.model or OPENROUTER_MODEL
        
        # Create a comprehensive prompt based on analysis type
        if request.analysis_type == AnalysisType.BUSINESS_ANALYSIS:
            prompt = f"""Analyze this business request and provide a comprehensive business analysis:

User: {request.user_name}
Request: {request.text_content}

Please provide a JSON response with these fields:
- business_type: The type of business
- pain_points: Array of current pain points
- opportunities: Array of business opportunities with name, description, potential, timeline
- technical_recommendations: Object with frontend, backend, integrations arrays
- next_steps: Array of action items with action, priority, timeline
- budget_estimate: Object with development, infrastructure, maintenance costs
- confidence: Float between 0 and 1
- summary: String summary of the analysis
"""
        elif request.analysis_type == AnalysisType.TECHNICAL_ANALYSIS:
            prompt = f"""Provide a technical analysis for this request:

User: {request.user_name}
Request: {request.text_content}

Please provide a JSON response with:
- technical_requirements: Object with frontend, backend, database, infrastructure
- architecture_recommendations: Object with patterns, technologies, scalability
- implementation_phases: Array of phases with name, description, timeline
- technology_stack: Object with recommended technologies
- confidence: Float between 0 and 1
- summary: String summary
"""
        else:
            prompt = f"""Analyze this request and provide insights:

User: {request.user_name}
Request: {request.text_content}

Please provide a JSON response with:
- key_insights: Array of insights
- recommendations: Array of recommendations
- next_steps: Array of next steps
- confidence: Float between 0 and 1
- summary: String summary
"""
        
        try:
            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://statex.cz",
                "X-Title": "StateX AI Platform"
            }
            
            # Create SSL context that doesn't verify certificates for testing
            ssl_context = ssl.create_default_context()
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE
            
            connector = aiohttp.TCPConnector(ssl=ssl_context)
            async with aiohttp.ClientSession(connector=connector) as session:
                payload = {
                    "model": model,
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000
                }
                
                async with session.post(
                    f"{OPENROUTER_API_BASE}/chat/completions",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        ai_response = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                        
                        # Try to parse JSON response
                        try:
                            json_start = ai_response.find('{')
                            json_end = ai_response.rfind('}') + 1
                            if json_start != -1 and json_end != -1:
                                json_str = ai_response[json_start:json_end]
                                analysis = json.loads(json_str)
                            else:
                                analysis = self._parse_text_response(ai_response, request.user_name, request.analysis_type)
                        except:
                            analysis = self._parse_text_response(ai_response, request.user_name, request.analysis_type)
                        
                        analysis["ai_service"] = "OpenRouter"
                        analysis["model_used"] = model
                        return analysis
                    else:
                        error_text = await response.text()
                        raise Exception(f"OpenRouter API error: {response.status} - {error_text}")
        except Exception as e:
            logger.error(f"OpenRouter analysis failed: {e}")
            raise e
    
    def analyze_with_mock(self, request: AIAnalysisRequest) -> Dict[str, Any]:
        """Mock AI analysis for testing"""
        logger.info("🤖 Using mock AI analysis...")
        
        # Simulate processing time
        time.sleep(2)
        
        # Generate realistic analysis based on content and type
        if request.analysis_type == AnalysisType.BUSINESS_ANALYSIS:
            return self._generate_business_analysis(request)
        elif request.analysis_type == AnalysisType.TECHNICAL_ANALYSIS:
            return self._generate_technical_analysis(request)
        else:
            return self._generate_general_analysis(request)
    
    def _generate_business_analysis(self, request: AIAnalysisRequest) -> Dict[str, Any]:
        """Generate mock business analysis"""
        business_keywords = {
            "auto": ["automotive", "car", "vehicle", "repair", "garage", "mechanic"],
            "restaurant": ["restaurant", "food", "dining", "kitchen", "menu", "chef"],
            "retail": ["store", "shop", "retail", "ecommerce", "inventory", "sales"],
            "healthcare": ["medical", "health", "clinic", "doctor", "patient", "treatment"],
            "fitness": ["gym", "fitness", "workout", "training", "exercise", "health"],
            "education": ["school", "education", "learning", "course", "training", "student"]
        }
        
        detected_business = "general"
        for business_type, keywords in business_keywords.items():
            if any(keyword in request.text_content.lower() for keyword in keywords):
                detected_business = business_type
                break
        
        return {
            "business_type": detected_business,
            "summary": f"User {request.user_name} wants to create a digital solution for their {detected_business} business, focusing on automation and customer experience.",
            "pain_points": [
                "Manual processes and workflows",
                "Customer communication challenges",
                "Data management and tracking",
                "Integration between systems"
            ],
            "opportunities": [
                {
                    "name": "Digital Platform Development",
                    "description": f"Comprehensive {detected_business} management platform",
                    "potential": "High",
                    "timeline": "3-6 months"
                },
                {
                    "name": "Mobile Application",
                    "description": "Native mobile app for staff and customers",
                    "potential": "High",
                    "timeline": "2-4 months"
                },
                {
                    "name": "Process Automation",
                    "description": "Automate manual processes and workflows",
                    "potential": "Medium",
                    "timeline": "1-3 months"
                }
            ],
            "technical_recommendations": {
                "frontend": ["React/Next.js", "TypeScript", "Responsive design"],
                "backend": ["Node.js/Python", "PostgreSQL", "RESTful API"],
                "integrations": ["Payment processing", "SMS/Email", "Calendar sync", "Analytics"]
            },
            "next_steps": [
                {
                    "action": f"Conduct {detected_business} market research",
                    "priority": "High",
                    "timeline": "1-2 weeks"
                },
                {
                    "action": "Develop MVP prototype",
                    "priority": "High",
                    "timeline": "4-8 weeks"
                },
                {
                    "action": "Create technical architecture",
                    "priority": "Medium",
                    "timeline": "2-3 weeks"
                }
            ],
            "budget_estimate": {
                "development": "$15,000 - $35,000",
                "infrastructure": "$200 - $500/month",
                "maintenance": "$1,000 - $2,000/month"
            },
            "confidence": 0.85,
            "ai_service": "Mock AI Service",
            "model_used": "mock-ai"
        }
    
    def _generate_technical_analysis(self, request: AIAnalysisRequest) -> Dict[str, Any]:
        """Generate mock technical analysis"""
        return {
            "technical_requirements": {
                "frontend": ["React/Next.js", "TypeScript", "Tailwind CSS"],
                "backend": ["Node.js", "Express", "PostgreSQL"],
                "database": ["PostgreSQL", "Redis", "MongoDB"],
                "infrastructure": ["Docker", "AWS/Azure", "CI/CD"]
            },
            "architecture_recommendations": {
                "patterns": ["Microservices", "API Gateway", "Event-driven"],
                "technologies": ["Docker", "Kubernetes", "Message Queue"],
                "scalability": ["Horizontal scaling", "Load balancing", "Caching"]
            },
            "implementation_phases": [
                {
                    "name": "Phase 1: MVP",
                    "description": "Core functionality development",
                    "timeline": "4-6 weeks"
                },
                {
                    "name": "Phase 2: Enhancement",
                    "description": "Advanced features and optimization",
                    "timeline": "2-4 weeks"
                },
                {
                    "name": "Phase 3: Production",
                    "description": "Deployment and monitoring",
                    "timeline": "1-2 weeks"
                }
            ],
            "technology_stack": {
                "frontend": "React/Next.js",
                "backend": "Node.js/Python",
                "database": "PostgreSQL",
                "deployment": "Docker"
            },
            "confidence": 0.8,
            "ai_service": "Mock AI Service",
            "model_used": "mock-ai"
        }
    
    def _generate_general_analysis(self, request: AIAnalysisRequest) -> Dict[str, Any]:
        """Generate mock general analysis"""
        return {
            "key_insights": [
                "User needs digital transformation",
                "Focus on customer experience",
                "Requires multi-platform solution",
                "Integration challenges identified"
            ],
            "recommendations": [
                "Start with MVP development",
                "Implement user feedback loop",
                "Plan for scalability",
                "Consider security requirements"
            ],
            "next_steps": [
                "Conduct requirements analysis",
                "Create technical specification",
                "Develop prototype",
                "Plan testing strategy"
            ],
            "confidence": 0.75,
            "ai_service": "Mock AI Service",
            "model_used": "mock-ai"
        }
    
    def _parse_text_response(self, text: str, user_name: str, analysis_type: AnalysisType) -> Dict[str, Any]:
        """Parse text response from AI into structured format"""
        return {
            "summary": f"AI Analysis for {user_name}: {text[:200]}...",
            "key_insights": ["AI-generated insight 1", "AI-generated insight 2"],
            "recommendations": ["AI-generated recommendation 1", "AI-generated recommendation 2"],
            "confidence": 0.8,
            "ai_service": "Text Parser",
            "model_used": "text-parser"
        }

# Initialize service
free_ai_service = FreeAIService()

@app.on_event("startup")
async def startup_event():
    """Initialize the service on startup"""
    await free_ai_service.check_providers()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "free-ai-service",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "providers": free_ai_service.provider_status
    }

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    from fastapi import Response
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/models")
async def get_available_models():
    """Get list of available AI models"""
    return {
        "models": free_ai_service.available_models,
        "providers": free_ai_service.provider_status
    }

@app.post("/analyze", response_model=AIAnalysisResponse)
async def analyze_text(request: AIAnalysisRequest):
    """Analyze text using free AI services"""
    start_time = time.time()
    ACTIVE_REQUESTS.inc()  # Increment active requests
    
    try:
        # Use the new fallback analysis method
        analysis = await free_ai_service.analyze_with_fallback(request)
        provider = analysis.get("ai_service", "unknown").lower()
        
        processing_time = time.time() - start_time
        
        # Update metrics
        provider_name = provider if isinstance(provider, str) else provider.value
        REQUEST_COUNT.labels(provider=provider_name, status="success").inc()
        REQUEST_DURATION.labels(provider=provider_name).observe(processing_time)
        ACTIVE_REQUESTS.dec()  # Decrement active requests
        AI_AGENT_STATUS.labels(agent_name="free-ai-service").set(1)
        
        return AIAnalysisResponse(
            success=True,
            analysis=analysis,
            provider_used=analysis.get("ai_service", "unknown"),
            model_used=analysis.get("model_used", "unknown"),
            processing_time=processing_time,
            confidence=analysis.get("confidence", 0.8)
        )
        
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        processing_time = time.time() - start_time
        
        # Update metrics for error case
        REQUEST_COUNT.labels(provider="error", status="failed").inc()
        REQUEST_DURATION.labels(provider="error").observe(processing_time)
        ACTIVE_REQUESTS.dec()  # Decrement active requests
        AI_AGENT_STATUS.labels(agent_name="free-ai-service").set(0)
        
        return AIAnalysisResponse(
            success=False,
            analysis={},
            provider_used="error",
            model_used="none",
            processing_time=processing_time,
            confidence=0.0,
            error=str(e)
        )

@app.post("/api/analyze-text")
async def analyze_text_compatibility(request: AIAnalysisRequest):
    """Compatibility endpoint for NLP Agent - proxies to /analyze with business analysis"""
    # Override analysis type to business analysis for NLP compatibility
    request.analysis_type = AnalysisType.BUSINESS_ANALYSIS
    return await analyze_text(request)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "StateX Free AI Service",
        "version": "1.0.0",
        "description": "Free AI models service using Ollama, Hugging Face, OpenRouter, and Mock AI",
        "endpoints": {
            "health": "/health",
            "models": "/models",
            "analyze": "/analyze",
            "analyze_text": "/api/analyze-text",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("FREE_AI_SERVICE_PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
