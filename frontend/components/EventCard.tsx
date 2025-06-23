'use client';

import { Event } from '@/types/event';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Calendar, Clock, MapPin, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  isUpcoming: boolean;
}

export function EventCard({ event, onEdit, onDelete, isUpcoming }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
    }
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 border-l-4 ${
      isUpcoming 
        ? 'border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50/30' 
        : 'border-l-gray-400 bg-gradient-to-br from-white to-gray-50/30'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {event.title}
            </CardTitle>
            <div className="flex items-center gap-1 mt-2">
              <Badge 
                variant={isUpcoming ? "default" : "secondary"}
                className={`${
                  isUpcoming 
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isUpcoming ? 'Upcoming' : 'Past'}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(event)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-gray-600 text-sm line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="font-medium">
              {format(eventDate, 'MMMM d, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span className="font-medium">{event.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="font-medium truncate">{event.venue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}