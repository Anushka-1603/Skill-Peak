from celery import shared_task
from .views import UpdateStatsAPIView
from rest_framework.test import APIRequestFactory
from datetime import datetime
from django.core.mail import send_mail
from .models import UserProfile


@shared_task
def update_stats():
    # Create a dummy request to pass to the view
    factory = APIRequestFactory()
    request = factory.get('/')
    
    view = UpdateStatsAPIView.as_view()
    response = view(request)
    
    return response

@shared_task
def send_weekly_email():
    users = UserProfile.objects.all()
    
    for user in users:
        user_handlers = UserHandler.objects.filter(user=user)
        
        leetcode_top_coders = IndividualStats.objects.filter(
            handlerid__platform=UserHandler.LEETCODE,
            handlerid__in=user_handlers
        ).order_by('-submissions')[:3]
        
        github_top_coders = IndividualStats.objects.filter(
            handlerid__platform=UserHandler.GITHUB,
            handlerid__in=user_handlers
        ).order_by('-contributions')[:3]
        
        subject = "Weekly Top Performers"
        body = "<h1>Weekly Top Performers</h1>"
        body += "<h2>GitHub</h2><ol>"

        for user in github_top_coders:
            body += f"<li>{user.handlerid.username}: {user.contributions} contributions</li>"
        
        body += "</ol><h2>LeetCode</h2><ol>"
        for user in leetcode_top_coders:
            body += f"<li>{user.handlerid.username}: {user.submissions} submissions</li>"
        body += "</ol>"
        
        send_mail(
            subject='Weekly Top Coders Report',
            message=body,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )