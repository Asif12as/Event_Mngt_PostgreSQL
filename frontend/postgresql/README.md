# PostgreSQL Database Configuration

This directory contains the PostgreSQL database schema and migration files for the Event Management System.

## Migration Files

- `migrations/20250623163931_yellow_scene.sql`: Initial database schema with events table, indexes, and triggers.

## How to Apply Migrations

1. Ensure PostgreSQL is installed and running on your system.
2. Create a database named `event_management`:
   ```sql
   CREATE DATABASE event_management;
   ```
3. Apply the migration script:
   ```bash
   psql -U postgres -d event_management -f migrations/20250623163931_yellow_scene.sql
   ```

## Database Schema

### Events Table

- `id`: UUID, primary key
- `title`: VARCHAR(255), not null
- `description`: TEXT, not null
- `venue`: VARCHAR(255), not null
- `date`: DATE, not null
- `time`: TIME, not null
- `created_at`: TIMESTAMP WITH TIME ZONE, default NOW()
- `updated_at`: TIMESTAMP WITH TIME ZONE, default NOW()

### Indexes

- `idx_events_date`: Index on the date column for better query performance
- `idx_events_title`: Index on the title column for search functionality

### Triggers

- `update_events_updated_at`: Automatically updates the `updated_at` column when a record is modified