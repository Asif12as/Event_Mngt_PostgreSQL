# Event Management System - Django Backend

This is the Django REST Framework backend for the Event Management System. It provides a robust API for managing events with PostgreSQL database integration.

## Features

- Complete CRUD operations for events
- PostgreSQL database integration
- RESTful API endpoints
- CORS enabled for frontend access
- Comprehensive error handling

## Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Virtual environment (recommended)

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE event_management;
```

### 2. Environment Configuration

The `.env` file contains the necessary environment variables. Update it with your PostgreSQL credentials if needed.

### 3. Installation & Development

```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events/` | Get all events |
| POST | `/api/events/` | Create a new event |
| GET | `/api/events/{id}/` | Get a specific event |
| PUT | `/api/events/{id}/` | Update an event |
| DELETE | `/api/events/{id}/` | Delete an event |

## API Request/Response Examples

### Create Event (POST /api/events/)

**Request:**
```json
{
  "title": "Tech Conference 2024",
  "description": "Annual technology conference featuring the latest innovations",
  "venue": "Convention Center",
  "date": "2024-03-15",
  "time": "09:00:00"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Tech Conference 2024",
  "description": "Annual technology conference featuring the latest innovations",
  "venue": "Convention Center",
  "date": "2024-03-15",
  "time": "09:00:00",
  "created_at": "2024-06-23T16:39:31.123456Z",
  "updated_at": "2024-06-23T16:39:31.123456Z"
}
```

## Integration with Next.js Frontend

The Django backend is designed to work seamlessly with the Next.js frontend. The frontend makes API calls to these endpoints to perform CRUD operations on events.