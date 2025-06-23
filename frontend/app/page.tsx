'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { EventCard } from '@/components/EventCard';
import { EventForm } from '@/components/EventForm';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create event');
      }

      const newEvent = await response.json();
      setEvents(prev => [...prev, newEvent]);
      setIsCreateDialogOpen(false);
      toast.success('Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create event');
    }
  };

  const handleUpdateEvent = async (id: string, eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update event');
      }

      const updatedEvent = await response.json();
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      setEditingEvent(null);
      toast.success('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete event');
      }

      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete event');
    }
  };

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.date) < new Date());

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              Event Manager
            </h1>
            <p className="text-gray-600">Organize and manage your events with ease</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <EventForm onSubmit={handleCreateEvent} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search events by title, description, or venue..."
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Venues</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(events.map(e => e.venue)).size}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? 'No events found' : 'No events yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? 'Try adjusting your search criteria' 
                : 'Create your first event to get started'
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-emerald-600" />
                  Upcoming Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={setEditingEvent}
                      onDelete={handleDeleteEvent}
                      isUpcoming={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-gray-600" />
                  Past Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={setEditingEvent}
                      onDelete={handleDeleteEvent}
                      isUpcoming={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            {editingEvent && (
              <EventForm
                initialData={editingEvent}
                onSubmit={(data) => handleUpdateEvent(editingEvent.id, data)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}