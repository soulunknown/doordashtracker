from django.contrib import admin
from django.urls import path, include
from .views import home_view

urlpatterns = [
    path('', home_view, name='home'),  # Root URL
    path('admin/', admin.site.urls),
    path('api/', include('tracking.urls')),  # API routes
]
