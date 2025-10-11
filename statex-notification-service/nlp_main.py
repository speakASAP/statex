"""
StateX NLP Service - Enhanced Version

Enhanced natural language processing service with Free AI integration.
Handles business analysis, market research, technology recommendations, and risk assessment.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import uvicorn
import os
import time
import logging
import asyncio
import aiohttp
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="StateX NLP Service",
    description="Natural language processing and content generation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Configuration
FREE_AI_SERVICE_URL = os.getenv("FREE_AI_SERVICE_URL", "http://free-ai-service:8016")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

class TextAnalysisRequest(BaseModel):
    text_content: str
    user_name: Optional[str] = "User"
    requirements: Optional[str] = None
    analysis_type: str = "business_analysis"

class BusinessAnalysisRequest(BaseModel):
    text_content: str
    user_name: Optional[str] = "User"
    business_context: Optional[str] = None
    industry: Optional[str] = None
    target_market: Optional[str] = None
    budget_range: Optional[str] = None

class BusinessAnalysisResponse(BaseModel):
    analysis_id: str
    status: str
    business_analysis: Dict[str, Any]
    market_insights: Dict[str, Any]
    technology_recommendations: Dict[str, Any]
    risk_assessment: Dict[str, Any]
    implementation_strategy: Dict[str, Any]
    confidence: float
    processing_time: float
    ai_provider: str
    created_at: str

class FreeAIClient:
    """Client for Free AI Service integration"""
    
    def __init__(self):
        self.base_url = FREE_AI_SERVICE_URL
        self.timeout = aiohttp.ClientTimeout(total=60)
    
    async def analyze_business_requirements(self, text_content: str, user_name: str = "User") -> Dict[str, Any]:
        """Analyze business requirements using Free AI Service"""
        try:
            async with aiohttp.ClientSession(timeout=self.timeout) as session:
                payload = {
                    "text_content": text_content,
                    "user_name": user_name,
                    "analysis_type": "business_analysis"
                }
                
                async with session.post(f"{self.base_url}/analyze", json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result.get("analysis", {})
                    else:
                        error_text = await response.text()
                        logger.error(f"Free AI Service error: {response.status} - {error_text}")
                        return self._fallback_business_analysis(text_content, user_name)
        except Exception as e:
            logger.error(f"Failed to connect to Free AI Service: {e}")
            return self._fallback_business_analysis(text_content, user_name)
    
    def _fallback_business_analysis(self, text_content: str, user_name: str) -> Dict[str, Any]:
        """Fallback business analysis when Free AI Service is unavailable"""
        return {
            "business_type": "general",
            "summary": f"Business analysis for {user_name} based on provided requirements",
            "pain_points": [
                "Manual processes requiring automation",
                "Customer communication challenges", 
                "Data management inefficiencies"
            ],
            "opportunities": [
                {
                    "name": "Digital Platform Development",
                    "description": "Comprehensive business management platform",
                    "potential": "High",
                    "timeline": "3-6 months"
                }
            ],
            "confidence": 0.7,
            "ai_service": "Fallback Analysis"
        }

class BusinessAnalysisEngine:
    """Enhanced business analysis engine with Free AI integration"""
    
    def __init__(self):
        self.ai_client = FreeAIClient()
    
    async def perform_comprehensive_analysis(self, request: BusinessAnalysisRequest) -> Dict[str, Any]:
        """Perform comprehensive business analysis"""
        
        # Get AI-powered business analysis
        business_analysis = await self.ai_client.analyze_business_requirements(
            request.text_content, 
            request.user_name
        )
        
        # Generate market insights
        market_insights = await self.generate_market_insights(
            request.text_content,
            request.industry,
            request.target_market
        )
        
        # Get technology recommendations
        tech_recommendations = await self.generate_technology_recommendations(
            request.text_content,
            business_analysis.get("business_type", "general")
        )
        
        # Perform risk assessment
        risk_assessment = await self.assess_project_risks(
            request.text_content,
            request.budget_range
        )
        
        # Generate implementation strategy
        implementation_strategy = self.generate_implementation_strategy(
            business_analysis,
            tech_recommendations,
            risk_assessment
        )
        
        return {
            "business_analysis": business_analysis,
            "market_insights": market_insights,
            "technology_recommendations": tech_recommendations,
            "risk_assessment": risk_assessment,
            "implementation_strategy": implementation_strategy
        }
    
    async def generate_market_insights(self, text_content: str, industry: Optional[str], target_market: Optional[str]) -> Dict[str, Any]:
        """Generate market research insights"""
        
        # Industry-specific insights
        industry_insights = {
            "automotive": {
                "market_size": "$2.7 trillion globally",
                "growth_rate": "3-5% annually",
                "key_trends": ["Electric vehicles", "Autonomous driving", "Connected cars"],
                "opportunities": ["EV charging solutions", "Fleet management", "Predictive maintenance"]
            },
            "healthcare": {
                "market_size": "$4.5 trillion globally",
                "growth_rate": "7-9% annually",
                "key_trends": ["Telemedicine", "AI diagnostics", "Personalized medicine"],
                "opportunities": ["Remote monitoring", "Health apps", "Medical AI"]
            },
            "retail": {
                "market_size": "$25 trillion globally",
                "growth_rate": "4-6% annually",
                "key_trends": ["E-commerce", "Omnichannel", "Personalization"],
                "opportunities": ["Online marketplaces", "AR/VR shopping", "Supply chain optimization"]
            },
            "education": {
                "market_size": "$6 trillion globally",
                "growth_rate": "8-10% annually",
                "key_trends": ["Online learning", "EdTech", "Personalized education"],
                "opportunities": ["Learning platforms", "Skill assessment", "Virtual classrooms"]
            }
        }
        
        detected_industry = industry or self._detect_industry(text_content)
        insights = industry_insights.get(detected_industry, {
            "market_size": "Market size varies by sector",
            "growth_rate": "Growth rate depends on industry",
            "key_trends": ["Digital transformation", "Automation", "Customer experience"],
            "opportunities": ["Process optimization", "Customer engagement", "Data analytics"]
        })
        
        return {
            "industry": detected_industry,
            "market_analysis": insights,
            "target_segments": self._identify_target_segments(text_content, target_market),
            "competitive_landscape": self._analyze_competition(detected_industry),
            "market_entry_strategy": self._suggest_market_entry(detected_industry)
        }
    
    async def generate_technology_recommendations(self, text_content: str, business_type: str) -> Dict[str, Any]:
        """Generate technology stack recommendations"""
        
        # Business-specific technology recommendations
        tech_stacks = {
            "automotive": {
                "frontend": ["React Native", "Flutter", "Progressive Web App"],
                "backend": ["Node.js", "Python Django", "Java Spring"],
                "database": ["PostgreSQL", "MongoDB", "Redis"],
                "integrations": ["IoT sensors", "GPS tracking", "Payment gateways", "OBD-II APIs"],
                "specialized": ["Telematics APIs", "Vehicle data platforms", "Mapping services"]
            },
            "healthcare": {
                "frontend": ["React", "Vue.js", "Angular"],
                "backend": ["Python Django", "Node.js", "Ruby on Rails"],
                "database": ["PostgreSQL", "MongoDB", "HIPAA-compliant storage"],
                "integrations": ["HL7 FHIR", "EMR systems", "Telehealth APIs", "Medical devices"],
                "specialized": ["HIPAA compliance", "Medical imaging", "Appointment scheduling"]
            },
            "retail": {
                "frontend": ["Next.js", "React", "Vue.js"],
                "backend": ["Node.js", "Python", "PHP Laravel"],
                "database": ["PostgreSQL", "MongoDB", "Elasticsearch"],
                "integrations": ["Payment processors", "Inventory systems", "Shipping APIs", "CRM"],
                "specialized": ["E-commerce platforms", "POS systems", "Analytics tools"]
            },
            "general": {
                "frontend": ["React/Next.js", "TypeScript", "Tailwind CSS"],
                "backend": ["Node.js", "Python", "PostgreSQL"],
                "database": ["PostgreSQL", "Redis", "MongoDB"],
                "integrations": ["Authentication", "Payment processing", "Email services"],
                "specialized": ["API development", "Cloud deployment", "Monitoring"]
            }
        }
        
        recommended_stack = tech_stacks.get(business_type, tech_stacks["general"])
        
        return {
            "recommended_stack": recommended_stack,
            "architecture_patterns": self._recommend_architecture_patterns(business_type),
            "scalability_considerations": self._analyze_scalability_needs(text_content),
            "security_requirements": self._identify_security_needs(business_type),
            "development_approach": self._suggest_development_approach(text_content)
        }
    
    async def assess_project_risks(self, text_content: str, budget_range: Optional[str]) -> Dict[str, Any]:
        """Assess project risks and mitigation strategies"""
        
        # Common risk categories
        technical_risks = [
            {
                "risk": "Technology complexity",
                "probability": "Medium",
                "impact": "High",
                "mitigation": "Start with MVP, iterative development"
            },
            {
                "risk": "Integration challenges",
                "probability": "Medium",
                "impact": "Medium",
                "mitigation": "API-first design, thorough testing"
            },
            {
                "risk": "Scalability issues",
                "probability": "Low",
                "impact": "High",
                "mitigation": "Cloud-native architecture, load testing"
            }
        ]
        
        business_risks = [
            {
                "risk": "Market competition",
                "probability": "High",
                "impact": "Medium",
                "mitigation": "Unique value proposition, fast time-to-market"
            },
            {
                "risk": "User adoption",
                "probability": "Medium",
                "impact": "High",
                "mitigation": "User research, beta testing, feedback loops"
            },
            {
                "risk": "Budget overrun",
                "probability": "Medium",
                "impact": "High",
                "mitigation": "Phased development, regular budget reviews"
            }
        ]
        
        # Budget-specific risks
        budget_risks = []
        if budget_range:
            if "low" in budget_range.lower() or any(amount in budget_range for amount in ["5000", "10000"]):
                budget_risks.append({
                    "risk": "Limited feature scope",
                    "probability": "High",
                    "impact": "Medium",
                    "mitigation": "Focus on core features, phased rollout"
                })
        
        return {
            "technical_risks": technical_risks,
            "business_risks": business_risks,
            "budget_risks": budget_risks,
            "overall_risk_level": self._calculate_overall_risk(technical_risks, business_risks),
            "mitigation_priorities": self._prioritize_mitigations(technical_risks + business_risks),
            "success_factors": [
                "Clear requirements definition",
                "Regular stakeholder communication",
                "Agile development methodology",
                "Continuous user feedback"
            ]
        }
    
    def generate_implementation_strategy(self, business_analysis: Dict, tech_recommendations: Dict, risk_assessment: Dict) -> Dict[str, Any]:
        """Generate comprehensive implementation strategy"""
        
        return {
            "development_phases": [
                {
                    "phase": "Discovery & Planning",
                    "duration": "2-3 weeks",
                    "activities": [
                        "Requirements gathering",
                        "Technical architecture design",
                        "Risk assessment",
                        "Project planning"
                    ],
                    "deliverables": ["Requirements document", "Technical specification", "Project plan"]
                },
                {
                    "phase": "MVP Development",
                    "duration": "6-8 weeks",
                    "activities": [
                        "Core feature development",
                        "Basic UI/UX implementation",
                        "Essential integrations",
                        "Initial testing"
                    ],
                    "deliverables": ["Working MVP", "Test results", "User documentation"]
                },
                {
                    "phase": "Enhancement & Testing",
                    "duration": "4-6 weeks",
                    "activities": [
                        "Advanced features",
                        "Performance optimization",
                        "Security implementation",
                        "Comprehensive testing"
                    ],
                    "deliverables": ["Enhanced product", "Security audit", "Performance report"]
                },
                {
                    "phase": "Deployment & Launch",
                    "duration": "2-3 weeks",
                    "activities": [
                        "Production deployment",
                        "User training",
                        "Go-live support",
                        "Monitoring setup"
                    ],
                    "deliverables": ["Live system", "Training materials", "Support documentation"]
                }
            ],
            "resource_requirements": {
                "team_size": "3-5 developers",
                "key_roles": ["Full-stack developer", "UI/UX designer", "DevOps engineer"],
                "estimated_hours": "400-600 hours",
                "timeline": "12-16 weeks"
            },
            "budget_breakdown": self._generate_budget_breakdown(business_analysis, tech_recommendations),
            "success_metrics": [
                "User adoption rate > 70%",
                "System uptime > 99.5%",
                "Page load time < 3 seconds",
                "Customer satisfaction > 4.5/5"
            ],
            "next_steps": [
                {
                    "step": "Stakeholder alignment meeting",
                    "timeline": "Week 1",
                    "priority": "High"
                },
                {
                    "step": "Technical architecture review",
                    "timeline": "Week 1-2",
                    "priority": "High"
                },
                {
                    "step": "Development team assembly",
                    "timeline": "Week 2-3",
                    "priority": "Medium"
                }
            ]
        }
    
    def _detect_industry(self, text_content: str) -> str:
        """Detect industry from text content"""
        industry_keywords = {
            "automotive": ["car", "auto", "vehicle", "repair", "garage", "mechanic", "automotive"],
            "healthcare": ["health", "medical", "clinic", "doctor", "patient", "hospital", "healthcare"],
            "retail": ["store", "shop", "retail", "ecommerce", "inventory", "sales", "customer"],
            "education": ["school", "education", "learning", "course", "training", "student", "teacher"],
            "finance": ["bank", "finance", "money", "investment", "trading", "loan", "credit", "buy"]
        }
        
        text_lower = text_content.lower()
        for industry, keywords in industry_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                return industry
        return "general"
    
    def _identify_target_segments(self, text_content: str, target_market: Optional[str]) -> List[str]:
        """Identify target market segments"""
        if target_market:
            return [target_market]
        
        # Default segments based on content analysis
        return ["Small to medium businesses", "Digital-first customers"]
    
    def _analyze_competition(self, industry: str) -> Dict[str, Any]:
        """Analyze competitive landscape"""
        return {
            "competition_level": "Medium to High",
            "key_competitors": ["Established players", "Emerging startups"],
            "differentiation_opportunities": [
                "Better user experience",
                "Competitive pricing",
                "Specialized features",
                "Superior customer service"
            ]
        }
    
    def _suggest_market_entry(self, industry: str) -> List[str]:
        """Suggest market entry strategies"""
        return [
            "Start with niche market segment",
            "Focus on unique value proposition",
            "Build strategic partnerships",
            "Leverage digital marketing channels"
        ]
    
    def _recommend_architecture_patterns(self, business_type: str) -> List[str]:
        """Recommend architecture patterns"""
        patterns = ["Microservices", "API Gateway", "Event-driven architecture"]
        
        if business_type in ["healthcare", "finance"]:
            patterns.extend(["Security-first design", "Audit logging", "Compliance patterns"])
        elif business_type == "retail":
            patterns.extend(["Scalable e-commerce", "Inventory management", "Payment processing"])
        
        return patterns
    
    def _analyze_scalability_needs(self, text_content: str) -> Dict[str, str]:
        """Analyze scalability requirements"""
        return {
            "user_growth": "Plan for 10x user growth in first year",
            "data_volume": "Design for increasing data volume",
            "performance": "Target sub-3-second response times",
            "availability": "Target 99.9% uptime"
        }
    
    def _identify_security_needs(self, business_type: str) -> List[str]:
        """Identify security requirements"""
        base_security = ["HTTPS/SSL", "Authentication", "Input validation", "Data encryption"]
        
        if business_type == "healthcare":
            base_security.extend(["HIPAA compliance", "Audit trails", "Data protection"])
        elif business_type == "finance":
            base_security.extend(["PCI DSS compliance", "Fraud detection", "Multi-factor authentication"])
        elif business_type == "retail":
            base_security.extend(["Payment security", "Customer data protection"])
        
        return base_security
    
    def _suggest_development_approach(self, text_content: str) -> Dict[str, str]:
        """Suggest development methodology"""
        return {
            "methodology": "Agile/Scrum",
            "testing_approach": "Test-driven development",
            "deployment": "Continuous integration/deployment"
        }
    
    def _calculate_overall_risk(self, technical_risks: List, business_risks: List) -> str:
        """Calculate overall project risk level"""
        high_risk_count = sum(1 for risk in technical_risks + business_risks if risk.get("impact") == "High")
        
        if high_risk_count >= 3:
            return "High"
        elif high_risk_count >= 1:
            return "Medium"
        else:
            return "Low"
    
    def _prioritize_mitigations(self, risks: List) -> List[str]:
        """Prioritize risk mitigation strategies"""
        high_impact_mitigations = [risk["mitigation"] for risk in risks if risk.get("impact") == "High"]
        return high_impact_mitigations[:3]  # Top 3 priorities
    
    def _generate_budget_breakdown(self, business_analysis: Dict, tech_recommendations: Dict) -> Dict[str, str]:
        """Generate budget breakdown"""
        return {
            "development": "$15,000 - $35,000",
            "design_ux": "$3,000 - $8,000",
            "infrastructure": "$200 - $500/month",
            "maintenance": "$1,000 - $3,000/month",
            "total_initial": "$18,000 - $43,000",
            "ongoing_monthly": "$1,200 - $3,500"
        }

# Initialize services
business_engine = BusinessAnalysisEngine()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "nlp-service",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "free_ai_integration": "enabled"
    }

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    from fastapi import Response
    return Response("", media_type="text/plain")

@app.post("/api/analyze", response_model=BusinessAnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    """Analyze text using AI services"""
    start_time = time.time()
    
    try:
        analysis_id = f"nlp_analysis_{int(time.time())}"
        
        # Convert to business analysis request
        business_request = BusinessAnalysisRequest(
            text_content=request.text_content,
            user_name=request.user_name,
            analysis_type=request.analysis_type
        )
        
        # Perform comprehensive analysis
        analysis_result = await business_engine.perform_comprehensive_analysis(business_request)
        
        processing_time = time.time() - start_time
        
        return BusinessAnalysisResponse(
            analysis_id=analysis_id,
            status="completed",
            business_analysis=analysis_result["business_analysis"],
            market_insights=analysis_result["market_insights"],
            technology_recommendations=analysis_result["technology_recommendations"],
            risk_assessment=analysis_result["risk_assessment"],
            implementation_strategy=analysis_result["implementation_strategy"],
            confidence=analysis_result["business_analysis"].get("confidence", 0.8),
            processing_time=processing_time,
            ai_provider=analysis_result["business_analysis"].get("ai_service", "Free AI Service"),
            created_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error in text analysis: {e}")
        processing_time = time.time() - start_time
        
        raise HTTPException(status_code=500, detail=f"Failed to analyze text: {str(e)}")

@app.post("/api/analyze-business", response_model=BusinessAnalysisResponse)
async def analyze_business_comprehensive(request: BusinessAnalysisRequest):
    """Perform comprehensive business analysis with Free AI integration"""
    start_time = time.time()
    
    try:
        analysis_id = f"nlp_business_{int(time.time())}"
        
        # Perform comprehensive analysis
        analysis_result = await business_engine.perform_comprehensive_analysis(request)
        
        processing_time = time.time() - start_time
        
        return BusinessAnalysisResponse(
            analysis_id=analysis_id,
            status="completed",
            business_analysis=analysis_result["business_analysis"],
            market_insights=analysis_result["market_insights"],
            technology_recommendations=analysis_result["technology_recommendations"],
            risk_assessment=analysis_result["risk_assessment"],
            implementation_strategy=analysis_result["implementation_strategy"],
            confidence=analysis_result["business_analysis"].get("confidence", 0.8),
            processing_time=processing_time,
            ai_provider=analysis_result["business_analysis"].get("ai_service", "Free AI Service"),
            created_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error in business analysis: {e}")
        processing_time = time.time() - start_time
        
        raise HTTPException(status_code=500, detail=f"Failed to analyze business requirements: {str(e)}")

# Legacy endpoint for backward compatibility
@app.post("/api/analyze-text")
async def analyze_text_legacy(request: dict):
    """Legacy text analysis endpoint for backward compatibility"""
    try:
        # Convert legacy request to new format
        text_request = TextAnalysisRequest(
            text_content=request.get("text_content", ""),
            user_name=request.get("user_name", "User"),
            analysis_type=request.get("analysis_type", "business_analysis")
        )
        
        # Use new comprehensive analysis
        return await analyze_text(text_request)
        
    except Exception as e:
        logger.error(f"Error in legacy text analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze text: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8011)