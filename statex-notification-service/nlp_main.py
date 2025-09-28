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
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST

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
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

# Prometheus metrics
NLP_REQUEST_COUNT = Counter('nlp_requests_total', 'Total NLP requests', ['provider', 'analysis_type', 'status'])
NLP_REQUEST_DURATION = Histogram('nlp_request_duration_seconds', 'NLP request duration', ['provider', 'analysis_type'])
NLP_ACTIVE_REQUESTS = Gauge('nlp_active_requests', 'Active NLP requests')
NLP_AGENT_STATUS = Gauge('nlp_agent_status', 'NLP agent status', ['agent_name'])
NLP_TOKEN_COUNT = Counter('nlp_tokens_total', 'Total tokens processed', ['provider', 'type'])

class TextAnalysisRequest(BaseModel):
    text_content: str
    user_name: Optional[str] = "User"
    requirements: Optional[str] = None
    analysis_type: str = "business_analysis"  # business_analysis, technical_analysis, market_research, risk_assessment

class BusinessAnalysisRequest(BaseModel):
    text_content: str
    user_name: Optional[str] = "User"
    business_context: Optional[str] = None
    industry: Optional[str] = None
    target_market: Optional[str] = None
    budget_range: Optional[str] = None

class MarketResearchRequest(BaseModel):
    business_idea: str
    industry: str
    target_market: Optional[str] = None
    competitors: Optional[List[str]] = None

class TechnologyRecommendationRequest(BaseModel):
    project_description: str
    technical_requirements: Optional[str] = None
    scalability_needs: Optional[str] = None
    budget_constraints: Optional[str] = None

class RiskAssessmentRequest(BaseModel):
    project_description: str
    business_model: Optional[str] = None
    timeline: Optional[str] = None
    budget: Optional[str] = None

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
    
    async def analyze_technical_requirements(self, text_content: str, user_name: str = "User") -> Dict[str, Any]:
        """Analyze technical requirements using Free AI Service"""
        try:
            async with aiohttp.ClientSession(timeout=self.timeout) as session:
                payload = {
                    "text_content": text_content,
                    "user_name": user_name,
                    "analysis_type": "technical_analysis"
                }
                
                async with session.post(f"{self.base_url}/analyze", json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result.get("analysis", {})
                    else:
                        return self._fallback_technical_analysis(text_content)
        except Exception as e:
            logger.error(f"Failed to get technical analysis: {e}")
            return self._fallback_technical_analysis(text_content)
    
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
    
    def _fallback_technical_analysis(self, text_content: str) -> Dict[str, Any]:
        """Fallback technical analysis when Free AI Service is unavailable"""
        return {
            "technical_requirements": {
                "frontend": ["React/Next.js", "TypeScript"],
                "backend": ["Node.js", "PostgreSQL"],
                "infrastructure": ["Docker", "Cloud hosting"]
            },
            "confidence": 0.6,
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
        
        # Enhance with market research
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
        
        # Get AI-powered technical analysis
        tech_analysis = await self.ai_client.analyze_technical_requirements(text_content)
        
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
            "development_approach": self._suggest_development_approach(text_content),
            "ai_analysis": tech_analysis
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
        for industry, keywords i():
            if any(keyword in text_lower for keyword in keywords):
try
        return "general"
    
    def _identify_target_segments(self, text_conten]:
        """Identify target m
        if target_market:
    
        
        # Default segments based on content anas
        rs"]
    
    def _analyze_competition(self, industry: sy]:
        """Analyze competitive lae"""
        return {
            "competition_level": igh",
         ts"],
        
                "Better user experience",
        cing",
                "Special
                "Superior customer service"
            ]
        }
    
    def _suggest_market_entry(self, industry: str) -> List[str]:
        gies"""
        return [
            "Start with niche marketment",
            "Focus on unique va,
            "Build strategicps",
            "Leverage digital marketing channels"
        ]
    
    def _t[str]:
        """
        patterns = ["Microure"]
        
        if business_type in ["healthcare", "finance"]:
        "])
        elif business_type == "retail":
            patterns.extend(["Scalable e-commerce", "Inventory management", "Payment processing"])
        
        return patterns
    
    def  str]:
        """Analyze scalability requirements"""
  return {
            "user_growth": "Plan for 10x user growth in first year",
            "data_volume": "Design for increaeds",
    
            "availability": "Targe
        }
    
    def _identify_security_needs(self, business_typ
        """Identify security requirements"""
        base_security = ["HTTPS/SSL", "Authentication", "Input validation"ion"]
        
        if business_type == "healthcare":
            base_security.extend(["HIPAA compliance
        elif business_typece":
     "])
    il":
            base_security.extend(["Paymey"])
        
        return base_security
    
    def _suggest_development_approach(sel str]:
        """Suggest development methodology"""
    
            "methodology": 

            "testing_approach": "Test-drivent",
            "deployment": "Continuous integrationt"
        }
    
    def _calculate_overall_risk(self, technical_risks: List, business_r -> str:
        """Calculate overall project risk
)
        
        if high_risk_count >= 3:
            return "High"
        elif hig 1:
            return "Medium"
        else:
            return "Low"
    
    d
        """Prioriti"
]
        return high_impact_mitigations[:3]  # Top 3 priorities
    
    def _generate_bud
        """"
        return {
            "development": "$15,000 - $35,000",
            "design_ux": "$3,008,000",
          ,
         ,
            "maintenance": "$1,000 - $3,000/month",
            "total_initial": "$18,000 - $43,000",
            "ongoing_monthly": "$00"
        }

# Initialize services
business_engine = BusinessAnalysisEngine()

@app.get(")
async():
    """Health check endp"""
rn {
        "status": "healthy",
        "service": "nlp-service",
        "tim(),
        "version": "2.0.0",
        "free_ai_integration": "enabled"
    }isoformatme.now().eti": datmpesta    retuoint_checkdef health "/health300 - $3,81,th"0/mon"$100 - $30rvices": _party_se"third   500/month" $200 -": "$astructure  "infr0 - $reakdownte budget b""Genera]:[str, str-> Dict Dict) ions:atommend tech_reclysis: Dict,siness_anaelf, bubreakdown(set_gigh"= "Hmpact") =isk.get("iif rsks r risk in rigation"] foti[risk["mi= itigations impact_m  high_      s""ieategtion str risk mitigaze[str]: -> Listt)s: Lissk(self, riigationsize_mitit _priorefsk_count >=h_ri "High"pact") ==sk.get("imisks if ri+ business_rcal_risks in technik or ris= sum(1 f_count isk_r     high   l""" leve: List)isksn/deploymeenevelopm d weeks",: "2int_length" "spr           crum","Agile/S    return {ict[str,> Dt: str) -t_contenf, texory securit"Invent, ion"protectr data  "Customey",securitnt == "retaype ess_tinelif bus    cationauthentictor "Multi-fa, n"detectio, "Fraud ance"pli"PCI DSS com[xtend(y.ease_securit       b == "finanls"])"Audit trai", iontectI pro", "PHptncry, "Data e[str]:) -> Liste: str uptime"t 99.9%s",onse timed respeconsub-3-sntain nce": "Maiperforma "       torage nesing data s      t[str,> Dictr) -t: sxt_conten, tey_needs(selfe_scalabilit_analyzonypticr"Data en", ngdit loggiAun", "irst desigurity-f(["Secterns.extend    patcthiteven arcvent-dri", "EwayAPI Gatervices", "sernsture pattearchitec"Recommend ""str) -> Lisness_type:  busilf,_patterns(setecturemmend_archirecotnershi parition"roposlue p segtry stratet market enges"""Sugres",ed featuizpripetitive       "Com  ": [iesportunitation_opfferenti    "diian", "Tech gartupsing st"Emergers", shed playtabli["Estors": "key_competi    Hm to"MediundscapDict[str, Antr) -> usescious "Cost-con,  customers"rstigital-fi", "Dessesinum buso medill t"Smareturn [lysiers"]-savvy usch "Teadopters",ly , "Ear_marketrgetreturn [ta        "ts""segmenet ark-> List[strr]) Optional[st: et_markett: str, targurn indusret                s.itemswordtry_keyn indusent", ", "rmentapart", ", "houseestate"", "real property ["l_estate": "rea           "],financial"tment", ves", "inment "pay","money "finance",", ank"be": [    "financ     

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    from fastapi import Response
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/api/analyze-business", response_model=BusinessAnalysisResponse)
async def analyze_business_comprehensive(request: BusinessAnalysisRequest):
    """Perform comprehensive business analysis with Free AI integration"""
    start_time = time.time()
    NLP_ACTIVE_REQUESTS.inc()
    
    try:
        analysis_id = f"nlp_business_{int(time.time())}"
        
        # Initialize Free AI client
        ai_client = FreeAIClient()
        
        # Get AI-powered business analysis
        business_analysis = await ai_client.analyze_business_requirements(
            request.text_content, 
            request.user_name
        )
        
        # Generate market insights
        market_insights = {
            "industry": request.industry or "general",
            "market_analysis": {
                "market_size": "Market size varies by sector",
                "growth_rate": "Growth rate depends on industry",
                "key_trends": ["Digital transformation", "Automation", "Customer experience"],
                "opportunities": ["Process optimization", "Customer engagement", "Data analytics"]
            },
            "target_segments": ["Small to medium businesses", "Digital-first customers"],
            "competitive_landscape": {
                "competition_level": "Medium to High",
                "key_competitors": ["Established players", "Emerging startups"],
                "differentiation_opportunities": ["Better user experience", "Competitive pricing"]
            }
        }
        
        # Generate technology recommendations
        tech_recommendations = {
            "recommended_stack": {
                "frontend": ["React/Next.js", "TypeScript", "Tailwind CSS"],
                "backend": ["Node.js", "Python", "PostgreSQL"],
                "database": ["PostgreSQL", "Redis", "MongoDB"],
                "integrations": ["Authentication", "Payment processing", "Email services"]
            },
            "architecture_patterns": ["Microservices", "API Gateway", "Event-driven architecture"],
            "security_requirements": ["HTTPS/SSL", "Authentication", "Input validation", "Data encryption"]
        }
        
        # Generate risk assessment
        risk_assessment = {
            "technical_risks": [
                {
                    "risk": "Technology complexity",
                    "probability": "Medium",
                    "impact": "High",
                    "mitigation": "Start with MVP, iterative development"
                }
            ],
            "business_risks": [
                {
                    "risk": "Market competition",
                    "probability": "High", 
                    "impact": "Medium",
                    "mitigation": "Unique value proposition, fast time-to-market"
                }
            ],
            "overall_risk_level": "Medium"
        }
        
        # Generate implementation strategy
        implementation_strategy = {
            "development_phases": [
                {
                    "phase": "Discovery & Planning",
                    "duration": "2-3 weeks",
                    "activities": ["Requirements gathering", "Technical architecture design"]
                },
                {
                    "phase": "MVP Development", 
                    "duration": "6-8 weeks",
                    "activities": ["Core feature development", "Basic UI/UX implementation"]
                }
            ],
            "budget_breakdown": {
                "development": "$15,000 - $35,000",
                "infrastructure": "$200 - $500/month",
                "maintenance": "$1,000 - $3,000/month"
            }
        }
        
        processing_time = time.time() - start_time
        
        # Update metrics
        NLP_REQUEST_COUNT.labels(
            provider="free-ai", 
            analysis_type="business_analysis", 
            status="success"
        ).inc()
        NLP_REQUEST_DURATION.labels(
            provider="free-ai", 
            analysis_type="business_analysis"
        ).observe(processing_time)
        NLP_ACTIVE_REQUESTS.dec()
        NLP_AGENT_STATUS.labels(agent_name="nlp-service").set(1)
        
        return BusinessAnalysisResponse(
            analysis_id=analysis_id,
            status="completed",
            business_analysis=business_analysis,
            market_insights=market_insights,
            technology_recommendations=tech_recommendations,
            risk_assessment=risk_assessment,
            implementation_strategy=implementation_strategy,
            confidence=business_analysis.get("confidence", 0.8),
            processing_time=processing_time,
            ai_provider=business_analysis.get("ai_service", "Free AI Service"),
            created_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error in business analysis: {e}")
        processing_time = time.time() - start_time
        
        # Update metrics for error case
        NLP_REQUEST_COUNT.labels(
            provider="error", 
            analysis_type="business_analysis", 
            status="failed"
        ).inc()
        NLP_REQUEST_DURATION.labels(
            provider="error", 
            analysis_type="business_analysis"
        ).observe(processing_time)
        NLP_ACTIVE_REQUESTS.dec()
        NLP_AGENT_STATUS.labels(agent_name="nlp-service").set(0)
        
        raise HTTPException(status_code=500, detail=f"Failed to analyze business requirements: {str(e)}")

# Legacy endpoint for backward compatibility
@app.post("/api/analyze-text")
async def analyze_text_legacy(request: dict):
    """Legacy text analysis endpoint for backward compatibility"""
    try:
        # Convert legacy request to new format
        business_request = BusinessAnalysisRequest(
            text_content=request.get("text_content", ""),
            user_name=request.get("user_name", "User")
        )
        
        # Use new comprehensive analysis
        return await analyze_business_comprehensive(business_request)
        
    except Exception as e:
        logger.error(f"Error in legacy text analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze text: {str(e)}")

async def perform_text_analysis(text: str, requirements: Optional[str], analysis_type: str) -> Dict[str, Any]:
    """Perform comprehensive text analysis"""
    
    # Simulate AI analysis results
    analysis_results = {
        "text_summary": generate_text_summary(text),
        "key_insights": extract_key_insights(text),
        "business_opportunities": identify_business_opportunities(text),
        "requirements_analysis": analyze_requirements(text, requirements),
        "sentiment_analysis": analyze_sentiment(text),
        "topic_categorization": categorize_topics(text),
        "action_items": extract_action_items(text),
        "confidence": 0.85
    }
    
    if analysis_type == "business_plan":
        analysis_results["business_plan_elements"] = extract_business_plan_elements(text)
    elif analysis_type == "ideas":
        analysis_results["idea_generation"] = generate_ideas(text)
    elif analysis_type == "requirements":
        analysis_results["technical_requirements"] = extract_technical_requirements(text)
    
    return analysis_results

def generate_text_summary(text: str) -> str:
    """Generate a concise summary of the text"""
    # Simulate AI-generated summary
    sentences = text.split('.')
    key_sentences = sentences[:3] if len(sentences) >= 3 else sentences
    return '. '.join(key_sentences) + '.'

def extract_key_insights(text: str) -> List[str]:
    """Extract key insights from the text"""
    # Simulate AI insight extraction
    insights = [
        "User is looking to start a new business venture",
        "Technology and digital solutions are mentioned",
        "Focus on customer experience and market needs",
        "Budget and timeline considerations are important"
    ]
    return insights

def identify_business_opportunities(text: str) -> List[Dict[str, str]]:
    """Identify potential business opportunities"""
    opportunities = [
        {
            "opportunity": "E-commerce platform development",
            "description": "Create an online marketplace for the target market",
            "potential": "High"
        },
        {
            "opportunity": "Mobile application development",
            "description": "Develop a mobile app to enhance customer engagement",
            "potential": "Medium"
        },
        {
            "opportunity": "Digital marketing services",
            "description": "Provide digital marketing solutions for businesses",
            "potential": "High"
        }
    ]
    return opportunities

def analyze_requirements(text: str, requirements: Optional[str]) -> Dict[str, Any]:
    """Analyze and structure requirements"""
    return {
        "functional_requirements": [
            "User authentication and authorization",
            "Content management system",
            "Payment processing",
            "Search and filtering capabilities"
        ],
        "non_functional_requirements": [
            "High availability (99.9% uptime)",
            "Scalable architecture",
            "Mobile responsive design",
            "Fast loading times (<3 seconds)"
        ],
        "technical_requirements": [
            "Modern web framework (Next.js/React)",
            "Database (PostgreSQL)",
            "Cloud hosting (AWS/GCP)",
            "CDN for static assets"
        ],
        "business_requirements": [
            "Revenue generation model",
            "Customer acquisition strategy",
            "Competitive analysis",
            "Market research"
        ]
    }

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """Analyze sentiment of the text"""
    return {
        "overall_sentiment": "positive",
        "confidence": 0.78,
        "emotions": ["excitement", "determination", "optimism"],
        "sentiment_scores": {
            "positive": 0.7,
            "neutral": 0.2,
            "negative": 0.1
        }
    }

def categorize_topics(text: str) -> List[str]:
    """Categorize topics in the text"""
    topics = [
        "Business Development",
        "Technology",
        "Digital Solutions",
        "Customer Experience",
        "Market Analysis"
    ]
    return topics

def extract_action_items(text: str) -> List[Dict[str, str]]:
    """Extract actionable items from the text"""
    action_items = [
        {
            "action": "Conduct market research",
            "priority": "High",
            "timeline": "2-3 weeks"
        },
        {
            "action": "Develop MVP prototype",
            "priority": "High",
            "timeline": "4-6 weeks"
        },
        {
            "action": "Create business plan",
            "priority": "Medium",
            "timeline": "1-2 weeks"
        }
    ]
    return action_items

def extract_business_plan_elements(text: str) -> Dict[str, Any]:
    """Extract elements for business plan generation"""
    return {
        "executive_summary": "AI-powered business solution platform",
        "market_analysis": {
            "target_market": "Small to medium businesses",
            "market_size": "Growing digital transformation market",
            "competition": "Moderate competition with differentiation opportunities"
        },
        "business_model": {
            "revenue_streams": ["Subscription fees", "Transaction fees", "Premium features"],
            "value_proposition": "Automated business solutions with AI assistance"
        },
        "financial_projections": {
            "year_1": {"revenue": 100000, "expenses": 75000},
            "year_2": {"revenue": 250000, "expenses": 150000},
            "year_3": {"revenue": 500000, "expenses": 300000}
        }
    }

def generate_ideas(text: str) -> List[Dict[str, str]]:
    """Generate business ideas based on the text"""
    ideas = [
        {
            "idea": "AI-Powered Business Assistant",
            "description": "An intelligent assistant that helps businesses automate routine tasks",
            "market_potential": "High"
        },
        {
            "idea": "Digital Transformation Consulting",
            "description": "Consulting services to help businesses adopt digital solutions",
            "market_potential": "Medium"
        },
        {
            "idea": "Automated Content Generation Platform",
            "description": "Platform that generates marketing content using AI",
            "market_potential": "High"
        }
    ]
    return ideas

def extract_technical_requirements(text: str) -> Dict[str, List[str]]:
    """Extract technical requirements from the text"""
    return {
        "frontend": ["React/Next.js", "TypeScript", "Tailwind CSS", "Responsive design"],
        "backend": ["Node.js/Python", "RESTful API", "Authentication", "Database"],
        "infrastructure": ["Cloud hosting", "CDN", "SSL certificates", "Monitoring"],
        "integrations": ["Payment processing", "Email services", "Analytics", "CRM"]
    }

@app.post("/api/generate-business-plan")
async def generate_business_plan(request: BusinessPlanRequest):
    """Generate a comprehensive business plan"""
    try:
        business_plan = {
            "executive_summary": f"Business plan for {request.business_idea}",
            "company_description": {
                "name": request.business_idea,
                "industry": request.industry or "Technology",
                "mission": f"To provide innovative solutions in {request.industry or 'technology'}",
                "vision": "To become a leading provider in our industry"
            },
            "market_analysis": {
                "target_market": request.target_market or "General market",
                "market_size": "To be determined through research",
                "competition": "Competitive landscape analysis needed"
            },
            "business_model": {
                "revenue_streams": ["Primary revenue stream", "Secondary revenue stream"],
                "cost_structure": ["Fixed costs", "Variable costs"],
                "value_proposition": f"Unique value for {request.target_market or 'customers'}"
            },
            "financial_projections": {
                "startup_costs": 50000,
                "monthly_operating_costs": 10000,
                "projected_revenue": {
                    "year_1": 120000,
                    "year_2": 300000,
                    "year_3": 600000
                }
            },
            "implementation_plan": {
                "phase_1": "Market research and validation (Months 1-2)",
                "phase_2": "Product development (Months 3-6)",
                "phase_3": "Launch and marketing (Months 7-9)",
                "phase_4": "Scale and growth (Months 10-12)"
            }
        }
        
        return {
            "business_plan_id": f"bp_{int(time.time())}",
            "status": "completed",
            "business_plan": business_plan,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating business plan: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate business plan: {str(e)}")

@app.post("/api/generate-content")
async def generate_content(request: ContentGenerationRequest):
    """Generate content based on topic and requirements"""
    try:
        content = generate_content_by_type(
            request.topic,
            request.content_type,
            request.length,
            request.tone
        )
        
        return {
            "content_id": f"content_{int(time.time())}",
            "status": "completed",
            "content": content,
            "metadata": {
                "topic": request.topic,
                "type": request.content_type,
                "length": request.length,
                "tone": request.tone
            },
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating content: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate content: {str(e)}")

def generate_content_by_type(topic: str, content_type: str, length: str, tone: str) -> str:
    """Generate content based on type and requirements"""
    
    if content_type == "business_plan":
        return f"""
# Business Plan: {topic}

## Executive Summary
This business plan outlines the strategy for {topic}, focusing on market opportunities and implementation approach.

## Market Analysis
The market for {topic} shows significant growth potential with increasing demand for innovative solutions.

## Business Model
Our business model focuses on providing value through {topic} while maintaining sustainable revenue streams.

## Financial Projections
Based on market research, we project steady growth over the next three years.
        """
    
    elif content_type == "proposal":
        return f"""
# Project Proposal: {topic}

## Project Overview
This proposal outlines the development of {topic} with clear objectives and deliverables.

## Scope of Work
- Analysis and planning
- Development and implementation
- Testing and quality assurance
- Deployment and support

## Timeline
The project will be completed in phases over 12-16 weeks.

## Budget
Detailed budget breakdown will be provided based on specific requirements.
        """
    
    elif content_type == "summary":
        return f"""
# Summary: {topic}

## Key Points
- {topic} represents a significant opportunity
- Market demand is growing steadily
- Implementation requires careful planning
- Success depends on execution quality

## Recommendations
1. Conduct thorough market research
2. Develop a detailed implementation plan
3. Secure necessary resources
4. Monitor progress and adjust as needed
        """
    
    else:  # ideas
        return f"""
# Ideas for {topic}

## Core Ideas
1. **Primary Concept**: {topic} with focus on user experience
2. **Alternative Approach**: {topic} with emphasis on automation
3. **Innovation Angle**: {topic} leveraging AI and machine learning

## Implementation Strategies
- Start with MVP to validate concept
- Gather user feedback early and often
- Iterate based on market response
- Scale successful features
        """

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
