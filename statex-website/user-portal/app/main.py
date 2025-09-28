import os
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
import uuid
import hashlib
import time
from datetime import datetime, timedelta
import json

app = FastAPI(title="User Portal Service", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("CORS_ORIGIN", "http://localhost:3000"),
        "http://localhost:3002",
        f"https://localhost:{os.getenv('FRONTEND_PORT', '3000')}",
        "https://localhost:3002",
        f"http://127.0.0.1:{os.getenv('FRONTEND_PORT', '3000')}",
        "http://127.0.0.1:3002",
        f"https://127.0.0.1:{os.getenv('FRONTEND_PORT', '3000')}",
        "https://127.0.0.1:3002",
        "https://statex.cz",
        "https://www.statex.cz"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo (replace with database in production)
users_db: Dict[str, Dict[str, Any]] = {}
sessions_db: Dict[str, Dict[str, Any]] = {}
submissions_db: Dict[str, List[Dict[str, Any]]] = {}

# Pydantic models
class ContactInfo(BaseModel):
    type: str  # email, whatsapp, telegram, linkedin
    value: str
    is_primary: bool = False

class UserRegistration(BaseModel):
    name: str
    contact_info: List[ContactInfo]
    source: str  # free-prototype, contact, homepage
    session_id: Optional[str] = None

class SimpleUserRegistration(BaseModel):
    name: str
    contact_type: str  # email, whatsapp, telegram, linkedin
    contact_value: str
    source: str = "homepage"
    session_id: Optional[str] = None

class UserProfile(BaseModel):
    user_id: str
    name: str
    contact_info: List[ContactInfo]
    created_at: datetime
    last_activity: datetime
    total_submissions: int = 0

class Submission(BaseModel):
    submission_id: str
    user_id: str
    page_type: str  # homepage, free-prototype, contact
    description: str
    files: List[Dict[str, Any]] = []
    voice_recording: Optional[Dict[str, Any]] = None
    created_at: datetime
    status: str = "pending"  # pending, in_progress, completed, delivered

class ContactCollectionRequest(BaseModel):
    session_id: str
    name: str
    contact_type: str
    contact_value: str
    source: str

class ConfirmationRequest(BaseModel):
    contact_type: str

# Utility functions
def generate_user_id() -> str:
    return str(uuid.uuid4())

def generate_session_id() -> str:
    return str(uuid.uuid4())

def hash_contact_value(contact_type: str, value: str) -> str:
    """Create a hash for contact matching"""
    return hashlib.sha256(f"{contact_type}:{value.lower()}".encode()).hexdigest()

def find_user_by_contact(contact_type: str, contact_value: str) -> Optional[str]:
    """Find existing user by contact information"""
    contact_hash = hash_contact_value(contact_type, contact_value)
    
    for user_id, user_data in users_db.items():
        for contact in user_data.get('contact_info', []):
            if hash_contact_value(contact['type'], contact['value']) == contact_hash:
                return user_id
    return None

def create_user_session(user_id: str, source: str) -> str:
    """Create a new session for user"""
    session_id = generate_session_id()
    sessions_db[session_id] = {
        'user_id': user_id,
        'source': source,
        'created_at': datetime.now(),
        'last_activity': datetime.now(),
        'is_active': True
    }
    return session_id

# API Endpoints

@app.get("/")
async def root():
    return {"message": "User Portal Service", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/users/register")
async def register_user(user_data: UserRegistration):
    """Register a new user or update existing user"""
    try:
        # Check if user already exists by contact info
        existing_user_id = None
        for contact in user_data.contact_info:
            user_id = find_user_by_contact(contact.type, contact.value)
            if user_id:
                existing_user_id = user_id
                break
        
        if existing_user_id:
            # Update existing user
            user = users_db[existing_user_id]
            
            # Add new contact info if not already present
            for new_contact in user_data.contact_info:
                contact_exists = any(
                    hash_contact_value(c['type'], c['value']) == hash_contact_value(new_contact.type, new_contact.value)
                    for c in user['contact_info']
                )
                if not contact_exists:
                    user['contact_info'].append(new_contact.dict())
            
            user['last_activity'] = datetime.now()
            user['total_submissions'] = user.get('total_submissions', 0)
            
            # Create session
            session_id = create_user_session(existing_user_id, user_data.source)
            
            return {
                "success": True,
                "user_id": existing_user_id,
                "session_id": session_id,
                "message": "User profile updated",
                "is_new_user": False
            }
        else:
            # Create new user
            user_id = generate_user_id()
            user = {
                "user_id": user_id,
                "name": user_data.name,
                "contact_info": [contact.dict() for contact in user_data.contact_info],
                "created_at": datetime.now(),
                "last_activity": datetime.now(),
                "total_submissions": 0
            }
            
            users_db[user_id] = user
            submissions_db[user_id] = []
            
            # Create session
            session_id = create_user_session(user_id, user_data.source)
            
            return {
                "success": True,
                "user_id": user_id,
                "session_id": session_id,
                "message": "User registered successfully",
                "is_new_user": True
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/users/register-simple")
async def register_user_simple(user_data: SimpleUserRegistration):
    """Register a new user with simple contact info"""
    try:
        # Convert simple format to full format
        contact_info = ContactInfo(
            type=user_data.contact_type,
            value=user_data.contact_value,
            is_primary=True
        )
        
        full_user_data = UserRegistration(
            name=user_data.name,
            contact_info=[contact_info],
            source=user_data.source,
            session_id=user_data.session_id
        )
        
        return await register_user(full_user_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simple registration failed: {str(e)}")

@app.post("/api/users/collect-contact")
async def collect_contact_info(request: ContactCollectionRequest):
    """Collect contact information after form submission"""
    try:
        # Check if session exists
        if request.session_id not in sessions_db:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = sessions_db[request.session_id]
        user_id = session['user_id']
        
        # Check if user already exists by contact info
        existing_user_id = find_user_by_contact(request.contact_type, request.contact_value)
        
        if existing_user_id and existing_user_id != user_id:
            # Merge sessions - user already exists with different session
            # Transfer submissions from current session to existing user
            if user_id in submissions_db:
                existing_submissions = submissions_db.get(existing_user_id, [])
                existing_submissions.extend(submissions_db[user_id])
                submissions_db[existing_user_id] = existing_submissions
                del submissions_db[user_id]
            
            # Update session to point to existing user
            session['user_id'] = existing_user_id
            user_id = existing_user_id
        
        # Get or create user
        if user_id not in users_db:
            # Create new user
            user_id = generate_user_id()
            users_db[user_id] = {
                "user_id": user_id,
                "name": request.name,
                "contact_info": [],
                "created_at": datetime.now(),
                "last_activity": datetime.now(),
                "total_submissions": 0
            }
            submissions_db[user_id] = []
        
        user = users_db[user_id]
        
        # Add contact info if not already present
        contact_exists = any(
            hash_contact_value(c['type'], c['value']) == hash_contact_value(request.contact_type, request.contact_value)
            for c in user['contact_info']
        )
        
        if not contact_exists:
            user['contact_info'].append({
                "type": request.contact_type,
                "value": request.contact_value,
                "is_primary": len(user['contact_info']) == 0  # First contact is primary
            })
        
        user['last_activity'] = datetime.now()
        
        # Update session
        session['user_id'] = user_id
        session['last_activity'] = datetime.now()
        
        return {
            "success": True,
            "user_id": user_id,
            "message": "Contact information collected successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to collect contact info: {str(e)}")

@app.post("/api/users/{user_id}/submissions")
async def create_submission(user_id: str, submission: Submission):
    """Create a new submission for a user"""
    try:
        if user_id not in users_db:
            raise HTTPException(status_code=404, detail="User not found")
        
        submission_data = submission.dict()
        submission_data['created_at'] = datetime.now()
        
        if user_id not in submissions_db:
            submissions_db[user_id] = []
        
        submissions_db[user_id].append(submission_data)
        
        # Update user's submission count
        users_db[user_id]['total_submissions'] = len(submissions_db[user_id])
        users_db[user_id]['last_activity'] = datetime.now()
        
        return {
            "success": True,
            "submission_id": submission.submission_id,
            "message": "Submission created successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create submission: {str(e)}")

@app.get("/api/users/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile and submission history"""
    try:
        if user_id not in users_db:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = users_db[user_id]
        submissions = submissions_db.get(user_id, [])
        
        return {
            "success": True,
            "user": user,
            "submissions": submissions,
            "total_submissions": len(submissions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user profile: {str(e)}")

@app.get("/api/users/{user_id}/submissions")
async def get_user_submissions(user_id: str):
    """Get all submissions for a user"""
    try:
        if user_id not in users_db:
            raise HTTPException(status_code=404, detail="User not found")
        
        submissions = submissions_db.get(user_id, [])
        
        return {
            "success": True,
            "submissions": submissions,
            "total": len(submissions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get submissions: {str(e)}")

@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str):
    """Get session information"""
    try:
        if session_id not in sessions_db:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = sessions_db[session_id]
        user = users_db.get(session['user_id'])
        
        return {
            "success": True,
            "session": session,
            "user": user
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get session: {str(e)}")

@app.post("/api/users/{user_id}/send-confirmation")
async def send_confirmation(user_id: str, request: ConfirmationRequest):
    """Send confirmation message to user"""
    try:
        if user_id not in users_db:
            raise HTTPException(status_code=404, detail="User not found")
        
        contact_type = request.contact_type
        
        user = users_db[user_id]
        
        # Find the contact info for the specified type
        contact_info = next(
            (c for c in user['contact_info'] if c['type'] == contact_type), 
            None
        )
        
        if not contact_info:
            raise HTTPException(status_code=404, detail=f"Contact info for {contact_type} not found")
        
        # In a real implementation, this would send actual emails/messages
        confirmation_message = {
            "to": contact_info['value'],
            "type": contact_type,
            "message": f"Thank you for your submission! We've received your request and will get back to you within 24 hours.",
            "user_name": user['name'],
            "submission_count": user['total_submissions']
        }
        
        return {
            "success": True,
            "message": "Confirmation sent successfully",
            "confirmation": confirmation_message
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send confirmation: {str(e)}")

@app.get("/api/stats")
async def get_service_stats():
    """Get service statistics"""
    try:
        total_users = len(users_db)
        total_sessions = len(sessions_db)
        total_submissions = sum(len(submissions) for submissions in submissions_db.values())
        
        return {
            "success": True,
            "stats": {
                "total_users": total_users,
                "total_sessions": total_sessions,
                "total_submissions": total_submissions,
                "active_sessions": len([s for s in sessions_db.values() if s['is_active']])
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006)