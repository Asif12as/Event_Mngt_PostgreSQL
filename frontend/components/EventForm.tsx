'use client';

import { useState } from 'react';
import { Event, EventFormData } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, FileText, Tag } from 'lucide-react';

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => void;
}

export function EventForm({ initialData, onSubmit }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    venue: initialData?.venue || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
            <Tag className="h-4 w-4 text-blue-500" />
            Event Title
          </Label>
          <Input
            id="title"
            placeholder="Enter event title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4 text-emerald-500" />
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your event"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className={`resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue" className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-orange-500" />
            Venue
          </Label>
          <Input
            id="venue"
            placeholder="Event venue or location"
            value={formData.venue}
            onChange={(e) => handleInputChange('venue', e.target.value)}
            className={`${errors.venue ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.venue && (
            <p className="text-red-500 text-sm">{errors.venue}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-purple-500" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`${errors.date ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-indigo-500" />
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className={`${errors.time ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.time && (
              <p className="text-red-500 text-sm">{errors.time}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Event' : 'Create Event')}
        </Button>
      </div>
    </form>
  );
}