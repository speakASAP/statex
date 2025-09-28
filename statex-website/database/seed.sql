-- Seed data for Statex development database
-- This provides sample data for development and testing

-- Insert sample users
INSERT INTO users (id, email, name, "createdAt", "updatedAt") VALUES
('clp1a2b3c4d5e6f7g8h9i0j1k', 'john.doe@example.com', 'John Doe', NOW(), NOW()),
('clp2b3c4d5e6f7g8h9i0j1k2l', 'jane.smith@example.com', 'Jane Smith', NOW(), NOW()),
('clp3c4d5e6f7g8h9i0j1k2l3m', 'test@statex.cz', 'Test User', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample prototypes
INSERT INTO prototypes (id, title, description, status, "userId", "createdAt", "updatedAt") VALUES
('clp4d5e6f7g8h9i0j1k2l3m4n', 'E-commerce Platform', 'Modern e-commerce solution with AI recommendations', 'pending', 'clp1a2b3c4d5e6f7g8h9i0j1k', NOW(), NOW()),
('clp5e6f7g8h9i0j1k2l3m4n5o', 'CRM System', 'Customer relationship management system', 'in_progress', 'clp2b3c4d5e6f7g8h9i0j1k2l', NOW(), NOW()),
('clp6f7g8h9i0j1k2l3m4n5o6p', 'Mobile App', 'Cross-platform mobile application', 'completed', 'clp3c4d5e6f7g8h9i0j1k2l3m', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample contacts
INSERT INTO contacts (id, name, email, message, "createdAt") VALUES
('clp7g8h9i0j1k2l3m4n5o6p7q', 'Alice Johnson', 'alice@company.com', 'Interested in AI automation services', NOW()),
('clp8h9i0j1k2l3m4n5o6p7q8r', 'Bob Wilson', 'bob@startup.com', 'Need help with system modernization', NOW()),
('clp9i0j1k2l3m4n5o6p7q8r9s', 'Carol Brown', 'carol@enterprise.com', 'Looking for custom software development', NOW())
ON CONFLICT (id) DO NOTHING; 