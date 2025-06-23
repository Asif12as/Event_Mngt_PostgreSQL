-- Event Management System Database Schema
-- Run this SQL script in your PostgreSQL database

-- Create the events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    venue VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on date for better query performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Create an index on title for search functionality
CREATE INDEX IF NOT EXISTS idx_events_title ON events(title);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop the trigger if it exists and create a new one
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO events (title, description, venue, date, time) VALUES
('Tech Conference 2024', 'Annual technology conference featuring the latest innovations', 'Convention Center', '2024-03-15', '09:00:00'),
('Team Building Workshop', 'Interactive workshop to improve team collaboration', 'Office Conference Room', '2024-02-20', '14:00:00'),
('Product Launch Event', 'Launch event for our new product line', 'Grand Hotel Ballroom', '2024-04-10', '18:30:00')
ON CONFLICT DO NOTHING;