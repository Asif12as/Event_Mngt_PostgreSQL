from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint for events that allows CRUD operations
    """
    queryset = Event.objects.all().order_by('date', 'time')
    serializer_class = EventSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Event deleted successfully"}, status=status.HTTP_200_OK)
