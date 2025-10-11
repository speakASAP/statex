"""
Database module for StateX Submission Service

Handles database operations for submissions and filename mappings.
Uses SQLAlchemy with PostgreSQL for production-ready data persistence.
"""

import os
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# Create database engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Submission(Base):
    """Submission model for storing form submissions"""
    __tablename__ = "submissions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    session_id = Column(String, nullable=False, index=True)
    submission_type = Column(String, nullable=False)
    text_content = Column(Text)
    voice_file_url = Column(String)
    file_urls = Column(JSON)  # List of file URLs
    requirements = Column(Text)
    contact_info = Column(JSON)  # Contact information
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationship to filename mappings
    filename_mappings = relationship("FilenameMapping", back_populates="submission", cascade="all, delete-orphan")

class FilenameMapping(Base):
    """Filename mapping model for storing original to stored filename mappings"""
    __tablename__ = "filename_mappings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    submission_id = Column(String, ForeignKey("submissions.id"), nullable=False, index=True)
    session_id = Column(String, nullable=False, index=True)
    original_name = Column(String, nullable=False)
    stored_name = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    content_type = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationship to submission
    submission = relationship("Submission", back_populates="filename_mappings")

def get_db() -> Session:
    """Get database session"""
    db = SessionLocal()
    try:
        return db
    finally:
        pass  # Session will be closed by the caller

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

class DatabaseManager:
    """Database manager for submission service operations"""
    
    def __init__(self):
        self.engine = engine
        self.SessionLocal = SessionLocal
    
    def create_submission(self, submission_data: Dict[str, Any]) -> str:
        """Create a new submission and return submission ID"""
        db = self.SessionLocal()
        try:
            submission = Submission(
                user_id=submission_data["user_id"],
                session_id=submission_data["session_id"],
                submission_type=submission_data["submission_type"],
                text_content=submission_data.get("text_content"),
                voice_file_url=submission_data.get("voice_file_url"),
                file_urls=submission_data.get("file_urls", []),
                requirements=submission_data.get("requirements"),
                contact_info=submission_data.get("contact_info", {})
            )
            db.add(submission)
            db.commit()
            db.refresh(submission)
            return submission.id
        finally:
            db.close()
    
    def save_filename_mappings(self, session_id: str, submission_id: str, mappings: List[Dict[str, Any]]) -> bool:
        """Save filename mappings for a session and submission"""
        db = self.SessionLocal()
        try:
            # Delete existing mappings for this session
            db.query(FilenameMapping).filter(FilenameMapping.session_id == session_id).delete()
            
            # Insert new mappings
            for mapping_data in mappings:
                mapping = FilenameMapping(
                    submission_id=submission_id,
                    session_id=session_id,
                    original_name=mapping_data["original_name"],
                    stored_name=mapping_data["stored_name"],
                    file_type=mapping_data["file_type"],
                    file_size=mapping_data["file_size"],
                    content_type=mapping_data["content_type"]
                )
                db.add(mapping)
            
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()
    
    def get_filename_mappings(self, session_id: str) -> List[Dict[str, Any]]:
        """Get filename mappings for a session"""
        db = self.SessionLocal()
        try:
            mappings = db.query(FilenameMapping).filter(FilenameMapping.session_id == session_id).all()
            return [
                {
                    "original_name": mapping.original_name,
                    "stored_name": mapping.stored_name,
                    "file_type": mapping.file_type,
                    "file_size": mapping.file_size,
                    "content_type": mapping.content_type
                }
                for mapping in mappings
            ]
        finally:
            db.close()
    
    def get_submission_by_id(self, submission_id: str) -> Optional[Dict[str, Any]]:
        """Get submission by ID"""
        db = self.SessionLocal()
        try:
            submission = db.query(Submission).filter(Submission.id == submission_id).first()
            if submission:
                return {
                    "id": submission.id,
                    "user_id": submission.user_id,
                    "session_id": submission.session_id,
                    "submission_type": submission.submission_type,
                    "text_content": submission.text_content,
                    "voice_file_url": submission.voice_file_url,
                    "file_urls": submission.file_urls,
                    "requirements": submission.requirements,
                    "contact_info": submission.contact_info,
                    "created_at": submission.created_at.isoformat(),
                    "updated_at": submission.updated_at.isoformat()
                }
            return None
        finally:
            db.close()
    
    def get_submissions_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all submissions for a user"""
        db = self.SessionLocal()
        try:
            submissions = db.query(Submission).filter(Submission.user_id == user_id).all()
            return [
                {
                    "id": submission.id,
                    "user_id": submission.user_id,
                    "session_id": submission.session_id,
                    "submission_type": submission.submission_type,
                    "text_content": submission.text_content,
                    "voice_file_url": submission.voice_file_url,
                    "file_urls": submission.file_urls,
                    "requirements": submission.requirements,
                    "contact_info": submission.contact_info,
                    "created_at": submission.created_at.isoformat(),
                    "updated_at": submission.updated_at.isoformat()
                }
                for submission in submissions
            ]
        finally:
            db.close()
    
    def get_submission_by_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get submission by session_id"""
        db = self.SessionLocal()
        try:
            submission = db.query(Submission).filter(Submission.session_id == session_id).first()
            if submission:
                return {
                    "id": submission.id,
                    "user_id": submission.user_id,
                    "session_id": submission.session_id,
                    "submission_type": submission.submission_type,
                    "text_content": submission.text_content,
                    "voice_file_url": submission.voice_file_url,
                    "file_urls": submission.file_urls,
                    "requirements": submission.requirements,
                    "contact_info": submission.contact_info,
                    "created_at": submission.created_at.isoformat(),
                    "updated_at": submission.updated_at.isoformat()
                }
            return None
        finally:
            db.close()
    
    def delete_submission(self, submission_id: str) -> bool:
        """Delete a submission and its filename mappings"""
        db = self.SessionLocal()
        try:
            # Delete filename mappings first (cascade should handle this, but being explicit)
            db.query(FilenameMapping).filter(FilenameMapping.submission_id == submission_id).delete()
            
            # Delete submission
            result = db.query(Submission).filter(Submission.id == submission_id).delete()
            db.commit()
            return result > 0
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

# Initialize database manager
db_manager = DatabaseManager()
