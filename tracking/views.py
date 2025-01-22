from rest_framework import viewsets
from .models import TrackingEntry
from .serializers import TrackingEntrySerializer
from rest_framework.response import Response

class TrackingEntryViewSet(viewsets.ModelViewSet):
    queryset = TrackingEntry.objects.all()
    serializer_class = TrackingEntrySerializer

    def create(self, request, *args, **kwargs):
        # Check if the request data is a list (multiple entries)
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Ensure the response is always a list
        if isinstance(request.data, list):
            return Response(serializer.data, status=201)
        else:
            return Response([serializer.data], status=201)  # Wrap single entry in a list
