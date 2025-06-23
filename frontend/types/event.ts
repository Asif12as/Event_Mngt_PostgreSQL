export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  created_at: Date;
  updated_at: Date;
}

export interface EventFormData {
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
}