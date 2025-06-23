import { NextRequest, NextResponse } from 'next/server';

// GET /api/events - Get all events
export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/api/events/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, venue, date, time } = body;

    // Validation
    if (!title || !description || !venue || !date || !time) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const response = await fetch('http://localhost:8000/api/events/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, venue, date, time }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create event');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}