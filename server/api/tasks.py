from celery import shared_task
from .views import UpdateStatsAPIView
from rest_framework.test import APIRequestFactory
from datetime import datetime

@shared_task
def update_stats():
    # Create a dummy request to pass to the view
    factory = APIRequestFactory()
    request = factory.get('/')
    
    view = UpdateStatsAPIView.as_view()
    response = view(request)
    
    return response