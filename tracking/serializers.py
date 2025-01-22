from rest_framework import serializers
from .models import TrackingEntry

class TrackingEntrySerializer(serializers.ModelSerializer):
    money_earned = serializers.FloatField()
    mileage = serializers.FloatField()

    class Meta:
        model = TrackingEntry
        fields = '__all__'

