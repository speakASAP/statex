#!/usr/bin/env python3
"""
Database initialization script for StateX Submission Service

This script creates the necessary database tables for the submission service.
Run this before starting the service for the first time.
"""

import os
import sys
from pathlib import Path

# Add current directory to Python path
current_dir = Path(__file__).parent.resolve()
sys.path.append(str(current_dir))

from database import create_tables, engine
from sqlalchemy import text

def init_database():
    """Initialize the database with required tables"""
    try:
        print("Creating database tables...")
        create_tables()
        print("✅ Database tables created successfully!")
        
        # Test database connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection test successful!")
        
        return True
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

if __name__ == "__main__":
    success = init_database()
    sys.exit(0 if success else 1)
