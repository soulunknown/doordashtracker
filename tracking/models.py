from django.db import models

class TrackingEntry(models.Model):
    date = models.DateField(null=True, blank=True)               # Allow manual date entry
    mileage = models.DecimalField(max_digits=6, decimal_places=2)  # Mileage driven
    money_earned = models.DecimalField(max_digits=8, decimal_places=2)  # Money earned
    store = models.CharField(max_length=255)               # store name
  
    time_of_day = models.CharField(max_length=50)               # Time of day
    comments = models.TextField(blank=True)                     # Optional comments

    def __str__(self):
        return f"Entry on {self.date} - {self.store}"
