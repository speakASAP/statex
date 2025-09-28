"""
StateX NLP Service
Natural Language Processing service for business requirement analysis.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="StateX NLP Service",
    description="Natural Language Processing service for business requirement analysis",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class AnalysisRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    sentiment: str
    topics: List[str]
    industry: str
    requirements: List[str]
    confidence: float

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "nlp-service"}

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_text(request: AnalysisRequest):
    """Analyze text content for business requirements"""
    try:
        text = request.text.lower()
        
        # Simple sentiment analysis
        positive_words = ["good", "great", "excellent", "amazing", "wonderful", "fantastic", "love", "like", "best"]
        negative_words = ["bad", "terrible", "awful", "hate", "worst", "problem", "issue", "difficult"]
        
        positive_count = sum(1 for word in positive_words if word in text)
        negative_count = sum(1 for word in negative_words if word in text)
        
        if positive_count > negative_count:
            sentiment = "positive"
        elif negative_count > positive_count:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        # Extract topics
        topics = []
        topic_keywords = {
            "business": ["business", "company", "enterprise", "organization"],
            "technology": ["technology", "tech", "software", "digital", "ai", "automation"],
            "website": ["website", "web", "site", "online", "internet"],
            "ecommerce": ["ecommerce", "e-commerce", "shop", "store", "selling", "buy", "sell"],
            "mobile": ["mobile", "app", "smartphone", "ios", "android"],
            "data": ["data", "analytics", "database", "information"],
            "marketing": ["marketing", "advertising", "promotion", "brand", "social media"]
        }
        
        for topic, keywords in topic_keywords.items():
            if any(keyword in text for keyword in keywords):
                topics.append(topic)
        
        # Detect industry
        industry_keywords = {
            "automotive": ["car", "auto", "vehicle", "repair", "garage", "mechanic"],
            "healthcare": ["health", "medical", "clinic", "doctor", "patient", "hospital"],
            "retail": ["store", "shop", "retail", "ecommerce", "inventory", "sales"],
            "education": ["school", "education", "learning", "course", "training", "student"],
            "finance": ["bank", "finance", "money", "investment", "trading", "loan"],
            "technology": ["tech", "software", "digital", "ai", "automation", "development"]
        }
        
        industry = "general"
        for ind, keywords in industry_keywords.items():
            if any(keyword in text for keyword in keywords):
                industry = ind
                break
        
        # Extract requirements
        requirements = []
        requirement_keywords = {
            "website": ["website", "web", "site", "online"],
            "mobile_app": ["mobile", "app", "smartphone"],
            "ecommerce": ["ecommerce", "shop", "store", "selling"],
            "database": ["database", "data", "storage"],
            "api": ["api", "integration", "connect"],
            "security": ["security", "secure", "protection"],
            "scalability": ["scalable", "scale", "growth"],
            "performance": ["fast", "speed", "performance", "optimization"]
        }
        
        for req, keywords in requirement_keywords.items():
            if any(keyword in text for keyword in keywords):
                requirements.append(req)
        
        # Calculate confidence
        confidence = min(0.9, 0.5 + (len(topics) * 0.1) + (len(requirements) * 0.05))
        
        return AnalysisResponse(
            sentiment=sentiment,
            topics=topics,
            industry=industry,
            requirements=requirements,
            confidence=confidence
        )
        
    except Exception as e:
        logger.error(f"Error analyzing text: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
