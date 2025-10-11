-- StateX Database Initialization Script
-- Creates the necessary tables for the submission service

-- Create the submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    session_id VARCHAR NOT NULL,
    submission_type VARCHAR NOT NULL,
    text_content TEXT,
    voice_file_url VARCHAR,
    file_urls JSON,
    requirements TEXT,
    contact_info JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the filename_mappings table
CREATE TABLE IF NOT EXISTS filename_mappings (
    id VARCHAR PRIMARY KEY,
    submission_id VARCHAR REFERENCES submissions(id) ON DELETE CASCADE,
    session_id VARCHAR NOT NULL,
    original_name VARCHAR NOT NULL,
    stored_name VARCHAR NOT NULL,
    file_type VARCHAR NOT NULL,
    file_size INTEGER NOT NULL,
    content_type VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_session_id ON submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_filename_mappings_session_id ON filename_mappings(session_id);
CREATE INDEX IF NOT EXISTS idx_filename_mappings_submission_id ON filename_mappings(submission_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_submissions_updated_at 
    BEFORE UPDATE ON submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- INSERT INTO submissions (id, user_id, session_id, submission_type, text_content, requirements, contact_info) 
-- VALUES ('sample-1', 'user-123', 'sess-456', 'text', 'Sample submission', 'Type: contact, Priority: normal', '{"email": "test@example.com", "name": "Test User"}');
