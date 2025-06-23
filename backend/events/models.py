import uuid
from django.db import models

class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    venue = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'events'
        indexes = [
            models.Index(fields=['date'], name='idx_events_date'),
            models.Index(fields=['title'], name='idx_events_title'),
        ]
    
    def __str__(self):
        return self.title
