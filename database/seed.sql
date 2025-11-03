-- Sample data for development/testing
-- WARNING: This will insert test data. Only use in development.

-- Note: Passwords are hashed with bcrypt. These are example hashes for "password123"
-- In production, always use proper password hashing

-- Insert sample users (passwords are "password123")
-- Password hash: $2a$10$rOzJqX8kYQzXqXqXqXqXqOqXqXqXqXqXqXqXqXqXqXqXqXqXqXq

-- Uncomment and modify as needed for testing:
/*
INSERT INTO users (username, email, password_hash) VALUES
('testuser1', 'test1@example.com', '$2a$10$rOzJqX8kYQzXqXqXqXqXqOqXqXqXqXqXqXqXqXqXqXqXqXqXqXq'),
('testuser2', 'test2@example.com', '$2a$10$rOzJqX8kYQzXqXqXqXqXqOqXqXqXqXqXqXqXqXqXqXqXqXqXqXq');
*/

-- This file is intentionally mostly empty. 
-- Use the application's registration endpoints to create users with properly hashed passwords.

