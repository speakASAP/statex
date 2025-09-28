"""
StateX Prototype Service

Handles prototype management, subdomain routing, and prototype-specific operations.
Manages the lifecycle of AI-generated prototypes and provides access control.
"""

from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import uvicorn
import os
import time
import logging
from datetime import datetime
import httpx
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="StateX Prototype Service",
    description="Prototype management and subdomain routing",
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

# Service URLs
AI_ORCHESTRATOR_URL = os.getenv("AI_ORCHESTRATOR_URL", "http://localhost:8010")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# In-memory storage for prototypes (replace with database in production)
prototypes_db: Dict[str, Dict[str, Any]] = {}

class PrototypeInfo(BaseModel):
    prototype_id: str
    name: str
    description: str
    type: str
    status: str
    created_at: str
    updated_at: str
    subdomain: str
    url: str

class PrototypeAccessRequest(BaseModel):
    prototype_id: str
    access_type: str = "view"  # view, edit, admin

class PrototypeResponse(BaseModel):
    prototype_id: str
    status: str
    data: Dict[str, Any]
    access_url: str
    created_at: str

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "prototype-service",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/")
async def get_prototype_home(request: Request):
    """Serve prototype home page based on subdomain"""
    host = request.headers.get("host", "")
    
    # Extract prototype ID from subdomain
    if "project-" in host and ".localhost" in host:
        prototype_id = host.split("project-")[1].split(".localhost")[0]
        
        # Get prototype data
        if prototype_id in prototypes_db:
            prototype = prototypes_db[prototype_id]
            return HTMLResponse(content=generate_prototype_home_html(prototype_id, prototype))
        else:
            return HTMLResponse(content=generate_prototype_not_found_html(prototype_id))
    else:
        return HTMLResponse(content=generate_default_home_html())

@app.get("/plan")
async def get_plan_page(request: Request):
    """Serve development plan page"""
    host = request.headers.get("host", "")
    
    if "project-" in host and ".localhost" in host:
        prototype_id = host.split("project-")[1].split(".localhost")[0]
        return await get_development_plan(prototype_id)
    else:
        return HTMLResponse(content=generate_default_home_html())

@app.get("/offer")
async def get_offer_page(request: Request):
    """Serve service offer page"""
    host = request.headers.get("host", "")
    
    if "project-" in host and ".localhost" in host:
        prototype_id = host.split("project-")[1].split(".localhost")[0]
        return await get_service_offer(prototype_id)
    else:
        return HTMLResponse(content=generate_default_home_html())

@app.get("/api/prototype/{prototype_id}")
async def get_prototype(prototype_id: str):
    """Get prototype information by ID"""
    if prototype_id not in prototypes_db:
        raise HTTPException(status_code=404, detail="Prototype not found")
    
    prototype = prototypes_db[prototype_id]
    return {
        "prototype_id": prototype_id,
        "status": "active",
        "data": prototype,
        "access_url": f"http://project-{prototype_id}.localhost:3000",
        "created_at": prototype.get("created_at", datetime.now().isoformat())
    }

@app.post("/api/prototype/create")
async def create_prototype(prototype_data: Dict[str, Any]):
    """Create a new prototype entry"""
    try:
        prototype_id = prototype_data.get("prototype_id", f"proto_{int(time.time())}")
        
        # Store prototype data
        prototype_entry = {
            "prototype_id": prototype_id,
            "name": prototype_data.get("name", "AI Generated Prototype"),
            "description": prototype_data.get("description", "AI-generated prototype"),
            "type": prototype_data.get("type", "website"),
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "subdomain": f"project-{prototype_id}",
            "url": f"http://project-{prototype_id}.localhost:3000",
            "data": prototype_data
        }
        
        prototypes_db[prototype_id] = prototype_entry
        
        return PrototypeResponse(
            prototype_id=prototype_id,
            status="created",
            data=prototype_entry,
            access_url=f"http://project-{prototype_id}.localhost:3000",
            created_at=prototype_entry["created_at"]
        )
        
    except Exception as e:
        logger.error(f"Error creating prototype: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create prototype: {str(e)}")

@app.get("/api/prototype/{prototype_id}/access")
async def check_prototype_access(prototype_id: str, request: Request):
    """Check if prototype is accessible and return appropriate response"""
    if prototype_id not in prototypes_db:
        # Return 404 page for non-existent prototypes
        return HTMLResponse(
            content="""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Prototype Not Found - StateX</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .error { color: #e74c3c; }
                    .back-link { margin-top: 20px; }
                    .back-link a { color: #3498db; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1 class="error">Prototype Not Found</h1>
                <p>The prototype you're looking for doesn't exist or has been removed.</p>
                <div class="back-link">
                    <a href="http://localhost:3000">← Back to StateX</a>
                </div>
            </body>
            </html>
            """,
            status_code=404
        )
    
    prototype = prototypes_db[prototype_id]
    
    # Return prototype information
    return {
        "prototype_id": prototype_id,
        "status": "active",
        "name": prototype["name"],
        "description": prototype["description"],
        "type": prototype["type"],
        "created_at": prototype["created_at"],
        "access_url": f"http://project-{prototype_id}.localhost:3000"
    }

@app.get("/api/prototype/{prototype_id}/plan")
async def get_development_plan(prototype_id: str):
    """Get development plan for prototype"""
    if prototype_id not in prototypes_db:
        raise HTTPException(status_code=404, detail="Prototype not found")
    
    prototype = prototypes_db[prototype_id]
    
    # Generate development plan HTML
    plan_html = generate_development_plan_html(prototype_id, prototype)
    return HTMLResponse(content=plan_html)

@app.get("/api/prototype/{prototype_id}/offer")
async def get_service_offer(prototype_id: str):
    """Get service offer for prototype"""
    if prototype_id not in prototypes_db:
        raise HTTPException(status_code=404, detail="Prototype not found")
    
    prototype = prototypes_db[prototype_id]
    
    # Generate service offer HTML
    offer_html = generate_service_offer_html(prototype_id, prototype)
    return HTMLResponse(content=offer_html)

@app.get("/api/prototype/{prototype_id}/embed")
async def get_prototype_embed(prototype_id: str):
    """Get embeddable prototype content"""
    if prototype_id not in prototypes_db:
        raise HTTPException(status_code=404, detail="Prototype not found")
    
    prototype = prototypes_db[prototype_id]
    
    # Generate embeddable HTML
    embed_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{prototype['name']} - StateX Prototype</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }}
            .container {{
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }}
            .content {{
                padding: 40px;
            }}
            .prototype-info {{
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
            }}
            .status-badge {{
                display: inline-block;
                background: #28a745;
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }}
            .features {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 30px;
            }}
            .feature {{
                background: white;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e9ecef;
                text-align: center;
            }}
            .feature-icon {{
                font-size: 2em;
                margin-bottom: 10px;
            }}
            .cta {{
                text-align: center;
                margin-top: 40px;
            }}
            .btn {{
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                transition: background 0.3s;
            }}
            .btn:hover {{
                background: #5a6fd8;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>{prototype['name']}</h1>
                <p>{prototype['description']}</p>
                <span class="status-badge">Active</span>
            </div>
            <div class="content">
                <div class="prototype-info">
                    <h3>Prototype Information</h3>
                    <p><strong>Type:</strong> {prototype['type'].title()}</p>
                    <p><strong>Created:</strong> {prototype['created_at']}</p>
                    <p><strong>Prototype ID:</strong> {prototype_id}</p>
                </div>
                
                <div class="features">
                    <div class="feature">
                        <div class="feature-icon">🚀</div>
                        <h4>AI Generated</h4>
                        <p>Created using advanced AI algorithms</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">📱</div>
                        <h4>Responsive Design</h4>
                        <p>Optimized for all devices</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">⚡</div>
                        <h4>Fast Loading</h4>
                        <p>Optimized for performance</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🔧</div>
                        <h4>Customizable</h4>
                        <p>Easy to modify and extend</p>
                    </div>
                </div>
                
                <div class="cta">
                    <a href="http://project-{prototype_id}.localhost:3000" class="btn">
                        View Full Prototype
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    return HTMLResponse(content=embed_html)

@app.get("/api/prototypes")
async def list_prototypes():
    """List all prototypes"""
    return {
        "prototypes": list(prototypes_db.values()),
        "total": len(prototypes_db)
    }

@app.delete("/api/prototype/{prototype_id}")
async def delete_prototype(prototype_id: str):
    """Delete a prototype"""
    if prototype_id not in prototypes_db:
        raise HTTPException(status_code=404, detail="Prototype not found")
    
    del prototypes_db[prototype_id]
    return {"message": "Prototype deleted successfully"}

@app.post("/api/prototype/{prototype_id}/sync")
async def sync_prototype_from_ai(prototype_id: str):
    """Sync prototype data from AI Orchestrator"""
    try:
        # Get prototype data from AI Orchestrator
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{AI_ORCHESTRATOR_URL}/api/results/prototype/{prototype_id}")
            
            if response.status_code == 200:
                ai_data = response.json()
                
                # Update prototype in our database
                if prototype_id in prototypes_db:
                    prototypes_db[prototype_id]["data"] = ai_data
                    prototypes_db[prototype_id]["updated_at"] = datetime.now().isoformat()
                
                return {"message": "Prototype synced successfully", "data": ai_data}
            else:
                raise HTTPException(status_code=404, detail="Prototype not found in AI system")
                
    except Exception as e:
        logger.error(f"Error syncing prototype {prototype_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to sync prototype: {str(e)}")

@app.get("/{path:path}")
async def get_prototype_page(path: str, request: Request):
    """Serve prototype pages based on subdomain and path"""
    host = request.headers.get("host", "")
    
    # Extract prototype ID from subdomain
    if "project-" in host and ".localhost" in host:
        prototype_id = host.split("project-")[1].split(".localhost")[0]
        
        # Get prototype data
        if prototype_id in prototypes_db:
            prototype = prototypes_db[prototype_id]
            return HTMLResponse(content=generate_prototype_page_html(prototype_id, prototype, path))
        else:
            return HTMLResponse(content=generate_prototype_not_found_html(prototype_id))
    else:
        return HTMLResponse(content=generate_default_home_html())

def generate_development_plan_html(prototype_id: str, prototype: dict) -> str:
    """Generate comprehensive development plan HTML"""
    data = prototype.get("data", {})
    ai_analysis = data.get("ai_analysis", {})
    technical_specs = data.get("technical_specs", {})
    features = data.get("features", [])
    
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Development Plan - {ai_analysis.get('project_name', 'AI Prototype')}</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }}
            .container {{
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px;
                text-align: center;
            }}
            .content {{
                padding: 40px;
            }}
            .section {{
                margin-bottom: 40px;
                padding: 30px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }}
            .section h2 {{
                color: #333;
                margin-bottom: 20px;
                font-size: 24px;
            }}
            .section h3 {{
                color: #555;
                margin-bottom: 15px;
                font-size: 18px;
            }}
            .tech-stack {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }}
            .tech-item {{
                background: white;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                border: 1px solid #e9ecef;
            }}
            .feature-list {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }}
            .feature-item {{
                background: white;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }}
            .timeline {{
                display: flex;
                flex-direction: column;
                gap: 20px;
            }}
            .timeline-item {{
                display: flex;
                align-items: center;
                padding: 20px;
                background: white;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }}
            .timeline-number {{
                background: #667eea;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-right: 20px;
                flex-shrink: 0;
            }}
            .cta {{
                text-align: center;
                margin-top: 40px;
            }}
            .btn {{
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                transition: background 0.3s;
                margin: 0 10px;
            }}
            .btn:hover {{
                background: #5a6fd8;
            }}
            .btn-secondary {{
                background: #6c757d;
            }}
            .btn-secondary:hover {{
                background: #5a6268;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📋 Development Plan</h1>
                <p>{ai_analysis.get('project_name', 'AI Generated Project')}</p>
                <p>Project ID: {prototype_id}</p>
            </div>
            
            <div class="content">
                <!-- Project Overview -->
                <div class="section">
                    <h2>🎯 Project Overview</h2>
                    <p><strong>Project Name:</strong> {ai_analysis.get('project_name', 'AI Generated Project')}</p>
                    <p><strong>Description:</strong> {ai_analysis.get('project_description', 'AI-generated prototype based on requirements')}</p>
                    <p><strong>Target Audience:</strong> {ai_analysis.get('target_audience', 'General users')}</p>
                    <p><strong>Complexity Level:</strong> {ai_analysis.get('complexity_level', 'medium').title()}</p>
                    <p><strong>AI Confidence:</strong> {ai_analysis.get('confidence', 0.85) * 100:.1f}%</p>
                </div>

                <!-- Technical Architecture -->
                <div class="section">
                    <h2>🏗️ Technical Architecture</h2>
                    <div class="tech-stack">
                        <div class="tech-item">
                            <strong>Framework</strong><br>
                            {technical_specs.get('framework', 'Next.js 14')}
                        </div>
                        <div class="tech-item">
                            <strong>Language</strong><br>
                            {technical_specs.get('language', 'TypeScript')}
                        </div>
                        <div class="tech-item">
                            <strong>Styling</strong><br>
                            {technical_specs.get('styling', 'Tailwind CSS')}
                        </div>
                        <div class="tech-item">
                            <strong>Database</strong><br>
                            {technical_specs.get('database', 'PostgreSQL')}
                        </div>
                        <div class="tech-item">
                            <strong>Authentication</strong><br>
                            {technical_specs.get('authentication', 'NextAuth.js')}
                        </div>
                        <div class="tech-item">
                            <strong>Deployment</strong><br>
                            {technical_specs.get('deployment', 'Vercel')}
                        </div>
                    </div>
                </div>

                <!-- Features & Functionality -->
                <div class="section">
                    <h2>⚡ Features & Functionality</h2>
                    <div class="feature-list">
                        {''.join([f'''
                        <div class="feature-item">
                            <h3>{feature.get('name', 'Feature')}</h3>
                            <p>{feature.get('description', 'Feature description')}</p>
                            <p><strong>Priority:</strong> {feature.get('priority', 'medium').title()}</p>
                            <p><strong>Implementation:</strong> {feature.get('implementation', 'Standard implementation')}</p>
                        </div>
                        ''' for feature in features])}
                    </div>
                </div>

                <!-- Development Timeline -->
                <div class="section">
                    <h2>📅 Development Timeline</h2>
                    <div class="timeline">
                        <div class="timeline-item">
                            <div class="timeline-number">1</div>
                            <div>
                                <h3>Week 1-2: Design & Architecture</h3>
                                <p>UI/UX design, technical architecture planning, and project setup</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-number">2</div>
                            <div>
                                <h3>Week 3-4: Core Development</h3>
                                <p>Frontend development, component implementation, and basic functionality</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-number">3</div>
                            <div>
                                <h3>Week 5-6: Testing & Deployment</h3>
                                <p>Quality assurance, testing, optimization, and deployment</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AI Insights -->
                <div class="section">
                    <h2>🤖 AI Analysis Insights</h2>
                    <ul>
                        {''.join([f'<li>{insight}</li>' for insight in ai_analysis.get('ai_insights', [])])}
                    </ul>
                </div>

                <!-- Next Steps -->
                <div class="section">
                    <h2>🚀 Next Steps</h2>
                    <ol>
                        <li>Review and approve the development plan</li>
                        <li>Schedule a detailed consultation to discuss requirements</li>
                        <li>Finalize project scope and timeline</li>
                        <li>Begin full development and implementation</li>
                        <li>Regular progress updates and milestone reviews</li>
                    </ol>
                </div>

                <div class="cta">
                    <a href="http://project-{prototype_id}.localhost:3000" class="btn">View Prototype</a>
                    <a href="http://project-{prototype_id}.localhost:3000/offer" class="btn btn-secondary">View Service Offer</a>
                    <a href="http://localhost:3000/prototype-results/{prototype_id}" class="btn btn-secondary">View Results</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

def generate_service_offer_html(prototype_id: str, prototype: dict) -> str:
    """Generate service offer HTML"""
    data = prototype.get("data", {})
    ai_analysis = data.get("ai_analysis", {})
    technical_specs = data.get("technical_specs", {})
    features = data.get("features", [])
    
    # Calculate pricing based on complexity and features
    complexity = ai_analysis.get('complexity_level', 'medium')
    base_prices = {'low': 5000, 'medium': 15000, 'high': 35000}
    base_price = base_prices.get(complexity, 15000)
    
    # Add pricing for additional features
    feature_count = len(features)
    feature_price = feature_count * 2000
    
    total_price = base_price + feature_price
    
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Offer - {ai_analysis.get('project_name', 'AI Prototype')}</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }}
            .container {{
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px;
                text-align: center;
            }}
            .content {{
                padding: 40px;
            }}
            .section {{
                margin-bottom: 40px;
                padding: 30px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }}
            .section h2 {{
                color: #333;
                margin-bottom: 20px;
                font-size: 24px;
            }}
            .pricing-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }}
            .pricing-card {{
                background: white;
                padding: 30px;
                border-radius: 8px;
                border: 2px solid #e9ecef;
                text-align: center;
                position: relative;
            }}
            .pricing-card.featured {{
                border-color: #667eea;
                transform: scale(1.05);
            }}
            .pricing-card.featured::before {{
                content: "RECOMMENDED";
                position: absolute;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                background: #667eea;
                color: white;
                padding: 5px 20px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
            }}
            .price {{
                font-size: 36px;
                font-weight: bold;
                color: #667eea;
                margin: 20px 0;
            }}
            .service-list {{
                list-style: none;
                padding: 0;
                margin: 20px 0;
            }}
            .service-list li {{
                padding: 10px 0;
                border-bottom: 1px solid #e9ecef;
            }}
            .service-list li:before {{
                content: "✓";
                color: #28a745;
                font-weight: bold;
                margin-right: 10px;
            }}
            .cta {{
                text-align: center;
                margin-top: 40px;
            }}
            .btn {{
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                transition: background 0.3s;
                margin: 0 10px;
            }}
            .btn:hover {{
                background: #5a6fd8;
            }}
            .btn-secondary {{
                background: #6c757d;
            }}
            .btn-secondary:hover {{
                background: #5a6268;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💼 Service Offer</h1>
                <p>{ai_analysis.get('project_name', 'AI Generated Project')}</p>
                <p>Customized solution for your business needs</p>
            </div>
            
            <div class="content">
                <!-- Project Summary -->
                <div class="section">
                    <h2>📋 Project Summary</h2>
                    <p><strong>Project:</strong> {ai_analysis.get('project_name', 'AI Generated Project')}</p>
                    <p><strong>Type:</strong> {prototype.get('type', 'website').title()}</p>
                    <p><strong>Complexity:</strong> {ai_analysis.get('complexity_level', 'medium').title()}</p>
                    <p><strong>Features:</strong> {len(features)} key features identified</p>
                    <p><strong>Technology Stack:</strong> {technical_specs.get('framework', 'Next.js 14')} + {technical_specs.get('styling', 'Tailwind CSS')}</p>
                </div>

                <!-- Service Packages -->
                <div class="section">
                    <h2>📦 Service Packages</h2>
                    <div class="pricing-grid">
                        <!-- Basic Package -->
                        <div class="pricing-card">
                            <h3>Basic Development</h3>
                            <div class="price">€{base_price:,}</div>
                            <ul class="service-list">
                                <li>Core functionality implementation</li>
                                <li>Responsive design</li>
                                <li>Basic SEO optimization</li>
                                <li>Contact form integration</li>
                                <li>2 weeks development time</li>
                                <li>Basic testing and deployment</li>
                            </ul>
                        </div>

                        <!-- Complete Package -->
                        <div class="pricing-card featured">
                            <h3>Complete Solution</h3>
                            <div class="price">€{total_price:,}</div>
                            <ul class="service-list">
                                <li>All features from Basic package</li>
                                <li>Advanced functionality ({len(features)} features)</li>
                                <li>Performance optimization</li>
                                <li>Advanced SEO and analytics</li>
                                <li>User authentication system</li>
                                <li>Database integration</li>
                                <li>4-6 weeks development time</li>
                                <li>Comprehensive testing</li>
                                <li>3 months support included</li>
                            </ul>
                        </div>

                        <!-- Premium Package -->
                        <div class="pricing-card">
                            <h3>Premium Enterprise</h3>
                            <div class="price">€{total_price + 10000:,}+</div>
                            <ul class="service-list">
                                <li>All features from Complete package</li>
                                <li>Custom integrations</li>
                                <li>Advanced security features</li>
                                <li>Scalability optimization</li>
                                <li>Custom domain setup</li>
                                <li>6-8 weeks development time</li>
                                <li>6 months support included</li>
                                <li>Priority maintenance</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Additional Services -->
                <div class="section">
                    <h2>🔧 Additional Services</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                            <h4>🚀 Performance Optimization</h4>
                            <p>€2,000 - Speed optimization and performance tuning</p>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                            <h4>🔒 Security Enhancement</h4>
                            <p>€3,000 - Advanced security features and compliance</p>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                            <h4>📱 Mobile App Development</h4>
                            <p>€15,000+ - Native mobile application</p>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                            <h4>🔧 Maintenance & Support</h4>
                            <p>€500/month - Ongoing maintenance and updates</p>
                        </div>
                    </div>
                </div>

                <!-- Timeline -->
                <div class="section">
                    <h2>⏰ Development Timeline</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e9ecef;">
                            <h4>Week 1-2</h4>
                            <p>Design & Planning</p>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e9ecef;">
                            <h4>Week 3-4</h4>
                            <p>Core Development</p>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e9ecef;">
                            <h4>Week 5-6</h4>
                            <p>Testing & Deployment</p>
                        </div>
                    </div>
                </div>

                <!-- Why Choose Us -->
                <div class="section">
                    <h2>🌟 Why Choose StateX?</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                        <div>
                            <h4>🤖 AI-Powered Development</h4>
                            <p>Leverage cutting-edge AI technology for faster, more efficient development</p>
                        </div>
                        <div>
                            <h4>⚡ Rapid Prototyping</h4>
                            <p>Get your prototype ready in days, not months</p>
                        </div>
                        <div>
                            <h4>🎯 Custom Solutions</h4>
                            <p>Tailored to your specific business needs and requirements</p>
                        </div>
                        <div>
                            <h4>🔧 Modern Technology</h4>
                            <p>Built with the latest frameworks and best practices</p>
                        </div>
                    </div>
                </div>

                <div class="cta">
                    <a href="mailto:contact@statex.cz?subject=Service Offer - {prototype_id}" class="btn">Get Started Now</a>
                    <a href="http://project-{prototype_id}.localhost:3000" class="btn btn-secondary">View Prototype</a>
                    <a href="http://project-{prototype_id}.localhost:3000/plan" class="btn btn-secondary">View Development Plan</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

def generate_prototype_home_html(prototype_id: str, prototype: dict) -> str:
    """Generate prototype home page HTML"""
    data = prototype.get("data", {})
    ai_analysis = data.get("ai_analysis", {})
    technical_specs = data.get("technical_specs", {})
    pages = data.get("pages", [])
    features = data.get("features", [])
    
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{ai_analysis.get('project_name', 'AI Prototype')} - StateX</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }}
            .container {{
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: white;
                border-radius: 10px;
                padding: 30px;
                margin-bottom: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }}
            .prototype-title {{
                font-size: 2.5em;
                color: #333;
                margin-bottom: 10px;
            }}
            .prototype-description {{
                font-size: 1.2em;
                color: #666;
                margin-bottom: 20px;
            }}
            .tech-stack {{
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin: 20px 0;
            }}
            .tech-badge {{
                background: #667eea;
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9em;
            }}
            .sections {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }}
            .section {{
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }}
            .section h3 {{
                color: #333;
                margin-bottom: 15px;
                font-size: 1.3em;
            }}
            .feature-list {{
                list-style: none;
                padding: 0;
            }}
            .feature-list li {{
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }}
            .feature-list li:before {{
                content: "✓";
                color: #28a745;
                font-weight: bold;
                margin-right: 10px;
            }}
            .cta-buttons {{
                text-align: center;
                margin: 30px 0;
            }}
            .btn {{
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 0 10px;
                transition: background 0.3s;
            }}
            .btn:hover {{
                background: #5a6fd8;
            }}
            .btn-secondary {{
                background: #6c757d;
            }}
            .btn-secondary:hover {{
                background: #5a6268;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="prototype-title">{ai_analysis.get('project_name', 'AI Generated Prototype')}</h1>
                <p class="prototype-description">{ai_analysis.get('project_description', 'AI-generated prototype based on requirements')}</p>
                
                <div class="tech-stack">
                    <span class="tech-badge">{technical_specs.get('framework', 'Next.js 14')}</span>
                    <span class="tech-badge">{technical_specs.get('language', 'TypeScript')}</span>
                    <span class="tech-badge">{technical_specs.get('styling', 'Tailwind CSS')}</span>
                    <span class="tech-badge">{technical_specs.get('database', 'PostgreSQL')}</span>
                    <span class="tech-badge">{technical_specs.get('deployment', 'Vercel')}</span>
                </div>
            </div>
            
            <div class="sections">
                <div class="section">
                    <h3>📄 Pages</h3>
                    <ul class="feature-list">
                        {''.join([f'<li>{page.get("name", "Page")} - {page.get("description", "")}</li>' for page in pages])}
                    </ul>
                </div>
                
                <div class="section">
                    <h3>⚡ Features</h3>
                    <ul class="feature-list">
                        {''.join([f'<li>{feature.get("name", "Feature")} - {feature.get("description", "")}</li>' for feature in features])}
                    </ul>
                </div>
                
                <div class="section">
                    <h3>🎯 Target Audience</h3>
                    <p>{ai_analysis.get('target_audience', 'General users')}</p>
                </div>
                
                <div class="section">
                    <h3>🔧 Complexity Level</h3>
                    <p>{ai_analysis.get('complexity_level', 'medium').title()}</p>
                </div>
            </div>
            
            <div class="cta-buttons">
                <a href="/plan" class="btn">📋 Development Plan</a>
                <a href="/offer" class="btn btn-secondary">💼 Service Offer</a>
                <a href="http://localhost:3000/prototype-results/{prototype_id}" class="btn btn-secondary">📊 View Results</a>
            </div>
        </div>
    </body>
    </html>
    """

def generate_prototype_page_html(prototype_id: str, prototype: dict, path: str) -> str:
    """Generate prototype page HTML"""
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Page: {path} - StateX Prototype</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }}
            .container {{
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }}
            .page-title {{
                font-size: 2em;
                color: #333;
                margin-bottom: 20px;
            }}
            .page-content {{
                font-size: 1.1em;
                line-height: 1.6;
                color: #666;
            }}
            .back-link {{
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="page-title">Page: {path}</h1>
            <div class="page-content">
                <p>This is a placeholder page for the <strong>{path}</strong> route.</p>
                <p>In a full implementation, this would contain the actual page content for your prototype.</p>
                <p>Prototype ID: <code>{prototype_id}</code></p>
            </div>
            <a href="/" class="back-link">← Back to Home</a>
        </div>
    </body>
    </html>
    """

def generate_prototype_not_found_html(prototype_id: str) -> str:
    """Generate prototype not found HTML"""
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prototype Not Found - StateX</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }}
            .container {{
                text-align: center;
                background: white;
                border-radius: 10px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }}
            .error-title {{
                font-size: 2.5em;
                color: #e74c3c;
                margin-bottom: 20px;
            }}
            .error-message {{
                font-size: 1.2em;
                color: #666;
                margin-bottom: 30px;
            }}
            .prototype-id {{
                background: #f8f9fa;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                color: #333;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="error-title">🚫 Prototype Not Found</h1>
            <p class="error-message">The prototype you're looking for doesn't exist or has been removed.</p>
            <div class="prototype-id">Prototype ID: {prototype_id}</div>
        </div>
    </body>
    </html>
    """

def generate_default_home_html() -> str:
    """Generate default home page HTML"""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StateX Prototype Service</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                text-align: center;
                background: white;
                border-radius: 10px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .title {
                font-size: 2.5em;
                color: #333;
                margin-bottom: 20px;
            }
            .message {
                font-size: 1.2em;
                color: #666;
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">🚀 StateX Prototype Service</h1>
            <p class="message">Access prototypes via subdomain: project-{id}.localhost:3000</p>
        </div>
    </body>
    </html>
    """

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
