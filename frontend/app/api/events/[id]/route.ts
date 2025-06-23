import { NextRequest, NextResponse } from 'next/server';

// GET /api/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`http://localhost:8000/api/events/${params.id}/`);
    
    if (response.status === 404) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const response = await fetch(`http://localhost:8000/api/events/${params.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, venue, date, time }),
    });

    if (response.status === 404) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update event');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`http://localhost:8000/api/events/${params.id}/`, {
      method: 'DELETE',
    });

    if (response.status === 404) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}