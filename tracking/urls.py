from rest_framework.routers import DefaultRouter
from .views import TrackingEntryViewSet

router = DefaultRouter()
router.register(r'entries', TrackingEntryViewSet, basename='trackingentry')

urlpatterns = router.urls

