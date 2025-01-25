from celery import shared_task
from .views import UpdateStatsAPIView
from rest_framework.test import APIRequestFactory
from rest_framework.response import Response
from datetime import datetime
from django.core.mail import send_mail
from .models import UserProfile, UserHandler, IndividualStats
from django.conf import settings

@shared_task
def update_stats():
    # Create a dummy request to pass to the view
    factory = APIRequestFactory()
    request = factory.get('/')
    view = UpdateStatsAPIView()
    view.request = request
    view.format_kwarg = None
    response = view.update_stats(request)

@shared_task
def send_weekly_email():
    users = UserProfile.objects.filter(is_staff=False)
    
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
        body = """
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #333;">Weekly Top Performers</h1>
            
            <div style="margin: 20px 0;">
                <h2 style="color: #444;">GitHub Top Performers</h2>
                <ol style="margin-left: 20px;">
        """
        
        for coder in github_top_coders:
            body += f'<li style="margin: 10px 0;">{coder.handlerid.handlername}: {coder.contributions} contributions</li>'
        
        body += """
                </ol>
            </div>
            
            <div style="margin: 20px 0;">
                <h2 style="color: #444;">LeetCode Top Performers</h2>
                <ol style="margin-left: 20px;">
        """
        
        for coder in leetcode_top_coders:
            body += f'<li style="margin: 10px 0;">{coder.handlerid.handlername}: {coder.submissions} submissions</li>'
        
        body += """
                </ol>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""Weekly Top Performers\n\nGitHub Top Performers:\n"""
        for coder in github_top_coders:
            text_body += f"- {coder.handlerid.handlername}: {coder.contributions} contributions\n"
        
        text_body += f"\nLeetCode Top Performers:\n"
        for coder in leetcode_top_coders:
            text_body += f"- {coder.handlerid.handlername}: {coder.submissions} submissions\n"
        
        send_mail(
            subject='Weekly Top Coders Report',
            message=text_body,
            html_message=body,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )