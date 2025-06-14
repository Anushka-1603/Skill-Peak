from django.shortcuts import render
from .models import UserProfile, UserHandler, IndividualStats
from .serializers import UserProfileSerializer, UserHandlerSerializer, IndividualStatsSerializer
from rest_framework import generics
from rest_framework import permissions, authentication
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, PermissionDenied
from .scrapers import scrape_leetcode, scrape_github
import datetime
import json
from rest_framework import status
from django.utils import timezone
from datetime import timedelta

class UserProfileDetailAPIView(generics.RetrieveAPIView):
    """ Get details of a single user """
    
    permission_classes = [permissions.IsAdminUser]
    
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'pk'

class UserProfileListCreateAPIView(generics.ListCreateAPIView):
    """ Get list of all users or create a new user """
    
    permission_classes = [permissions.IsAdminUser]
    
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    
class UserHandlerDetailAPIView(generics.RetrieveAPIView, generics.DestroyAPIView):
    """ Get or delete details of a single user handler """
    
    permission_classes = [permissions.IsAuthenticated]
    
    queryset = UserHandler.objects.all()
    serializer_class = UserHandlerSerializer
    
    def get(self, request, *args, **kwargs):
        user = request.user
        data = request.data
        
        try:
            user_handler = UserHandler.objects.get(handlerid=data['handlerid'], platform=data['platform'])
        except UserHandler.DoesNotExist:
            raise NotFound(f"{str(data['platform'])} handler with id {str(data['handlerid'])} does not exist.")
        
        if user_handler.user != user and not user.is_staff:
            raise PermissionDenied(f"You do not have permission to access {str(user_handler.handlername)}.")
        
        serializer = self.get_serializer(user_handler)
        return Response(serializer.data)
    
    def delete(self, request, *args, **kwargs):
        user = request.user
        data = request.data
        
        try:
            user_handler = UserHandler.objects.get(handlerid=data['handlerid'], platform=data['platform'], user=user)
        except UserHandler.DoesNotExist:
            raise NotFound(f"{str(data['platform'])} handler with id {str(data['handlerid'])} does not exist.")
        
        if user_handler.user != user and not user.is_staff:
            raise PermissionDenied(f"You do not have permission to delete {str(user_handler.handlername)}")
        
        user_handler.delete()
        return Response({'message':'User Handler deleted successfully'})
        
class UserHandlerListCreateAPIView(generics.ListCreateAPIView):
    """ Get list of all user handlers or create a new user handler """
    
    permission_classes = [permissions.IsAuthenticated]
    
    queryset = UserHandler.objects.all()
    serializer_class = UserHandlerSerializer

    def get_queryset(self):
        # a logged in user can view only the user handlers he has added
        user_profile = self.request.user
        if user_profile.is_staff:
            res = UserHandler.objects.all()
        res = UserHandler.objects.filter(user=user_profile)
        return res
    
    def post(self, request, *args, **kwargs):
        data = request.data
        user = request.user
        data['user'] = user.id
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except Exception as e:
                if 'unique_user_platform_handlerid' in str(e) or 'UNIQUE constraint failed' in str(e):
                    return Response(
                        {"detail": f"This handler ({data.get('platform')}: {data.get('handlerid')}) already exists for your account."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                return Response({"detail": "A database integrity error occurred."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class IndividualStatsRetrieveAPIView(generics.RetrieveAPIView):
    """ Get stats associated with a single user handler for any given number of days"""
    queryset = IndividualStats.objects.all()
    serializer_class = IndividualStatsSerializer
    permission_classes = [permissions.IsAuthenticated]
        
    def get(self, request, *args, **kwargs):
        # Get parameters from query string
        handlerid = request.GET.get('handlerid')
        days = request.GET.get('days', 7)  # Default to 7 days if not specified
        platform = request.GET.get('platform')
        
        if not handlerid or not platform:
            return Response(
                {'error': 'handlerid and platform are required parameters'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            days = int(days)
        except (TypeError, ValueError):
            return Response(
                {'error': 'days must be a valid number'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_handler = UserHandler.objects.get(
                handlerid=handlerid,
                platform=UserHandler.GITHUB if platform == 'github' else UserHandler.LEETCODE,
                user=request.user
            )
            if user_handler.user != request.user and not request.user.is_staff:
                raise PermissionDenied("You do not have permission to access this handler's data.")
        except UserHandler.DoesNotExist:
            return Response(
                {'error': f'No handler found with ID {handlerid} for your account'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if platform == 'leetcode':
            submissions = scrape_leetcode(handlerid, days)
            return Response({'Leetcode submissions': submissions})
        elif platform == 'github':
            contributions = scrape_github(handlerid, days)
            return Response({'Github contributions': contributions})
        else:
            return Response(
                {'error': 'Invalid platform. Must be either leetcode or github'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
    
class UpdateStatsAPIView(generics.UpdateAPIView, generics.CreateAPIView):
    """ Update stats or create new stat associated with a single user handler """
    queryset = IndividualStats.objects.all()
    serializer_class = IndividualStatsSerializer
    permission_classes = [permissions.IsAdminUser]
    
    
    def get(self, request):
        return self.update_stats(request)

    def update_stats(self, request=None, *args, **kwargs):
        userHandlers = UserHandler.objects.all()
        
        for userHandler in userHandlers:
            if userHandler.platform == userHandler.LEETCODE:
                submissions = scrape_leetcode(userHandler.handlerid,7)
                contributions = 0
                
            elif userHandler.platform == userHandler.GITHUB:
                contributions = scrape_github(userHandler.handlerid,7)
                submissions = 0
            
            # if individual stats already exist, create it, else create new
            indiv_stat, created = IndividualStats.objects.update_or_create(
                handlerid = userHandler, 
                defaults = { 
                    'contributions': contributions, 
                    'submissions': submissions, 
                    'recorded_at': datetime.datetime.now() 
                }
            )
            
        # finding top 3 coders of the week
        leetcode_top_coders = self.get_queryset().filter(handlerid__platform=UserHandler.LEETCODE).order_by('-submissions')[:3]
        github_top_coders = self.get_queryset().filter(handlerid__platform=UserHandler.GITHUB).order_by('-contributions')[:3]
        
        leetcode_serializer = self.get_serializer(leetcode_top_coders, many=True, context={'request': request})
        github_serializer = self.get_serializer(github_top_coders, many=True, context={'request': request})
        
        return Response(
            {
                'leetcode': leetcode_serializer.data,
                'github': github_serializer.data
            }
        )
        
class UserDashboardStatsAPIView(generics.ListAPIView):
    """ Get top 10 user handlers for the authenticated user for a specified number of days. """
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserHandlerSerializer # placeholder, will be replaced
    
    def list(self, request, *args, **kwargs):
        user = request.user
        try:
            days = int(request.query_params.get('days', 7))
            if days <= 0:
                days = 7
        except ValueError:
            days = 7
        
        user_handlers = UserHandler.objects.filter(user=user)
        
        leetcode_performers = []
        github_performers = []
        
        for handler in user_handlers:
            try:
                if handler.platform == UserHandler.LEETCODE:
                    submissions = scrape_leetcode(handler.handlerid, days)
                    contributions = 0
                    leetcode_performers.append({
                        'id': handler.id,
                        'handlername': handler.handlername,
                        'handlerid_platform': handler.handlerid, # actual platform id
                        'platform': 'LeetCode',
                        'score': submissions,
                        'metric_name': 'submissions'
                    })
                elif handler.platform == UserHandler.GITHUB:
                    contributions = scrape_github(handler.handlerid, days)
                    submissions = 0
                    if contributions > 0: # Only add if there's activity
                        github_performers.append({
                            'id': handler.id,
                            'handlername': handler.handlername,
                            'handlerid_platform': handler.handlerid, # actual platform id
                            'platform': 'GitHub',
                            'score': contributions,
                            'metric_name': 'contributions'
                        })
            
            except Exception as e:
                print(f"Error scraping for {handler.handlername} ({handler.platform}): {e}")
                continue
            
        # Sort by score (submissions/contributions) in descending order
        leetcode_performers.sort(key=lambda x: x['score'], reverse=True)
        github_performers.sort(key=lambda x: x['score'], reverse=True)

        return Response({
            'leetcode': leetcode_performers[:10],
            'github': github_performers[:10],
            'days_period': days
        }, status=status.HTTP_200_OK)
    

class WeeklyLeaderboardAPIView(generics.ListAPIView):
    """ Get the latest weekly top performers for LeetCode and GitHub for the authenticated user"""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = IndividualStatsSerializer
    
    def get_queryset(self):
        user = self.request.user
        user_handler_ids = UserHandler.objects.filter(user=user).values_list('id', flat=True)
        return IndividualStats.objects.filter(handlerid__in=user_handler_ids)


    def list(self, request, *args, **kwargs):
        user = request.user
        
        # Get all handlers for the current user
        user_handlers = UserHandler.objects.filter(user=user)
        if not user_handlers.exists():
            return Response({
                'message': 'No handlers added by the user.',
                'leetcode_top': [],
                'github_top': [],
                'last_updated_at': None,
                'next_update_at': self.get_next_update_timestamp()
            }, status=status.HTTP_200_OK)

        user_handler_ids = user_handlers.values_list('id', flat=True)


        latest_stat_entry = IndividualStats.objects.filter(
            handlerid__in=user_handler_ids
        ).order_by('-recorded_at').first()

        if not latest_stat_entry:
            return Response({
                'message': 'No weekly stats found for your handlers yet.',
                'leetcode_top': [],
                'github_top': [],
                'last_updated_at': None,
                'next_update_at': self.get_next_update_timestamp()
            }, status=status.HTTP_200_OK)

        # Consider stats recorded within a small window (e.g., 1 day) of the latest entry
        # to ensure we capture all stats from the same batch update.
        # This helps if tasks for different handlers finish slightly apart.
        latest_update_time = latest_stat_entry.recorded_at
        time_threshold = latest_update_time - timedelta(hours=12) # Consider stats updated in the last 12h from latest

        base_query = IndividualStats.objects.filter(
            handlerid__in=user_handler_ids,
            recorded_at__gte=time_threshold, # Get stats from the most recent batch
            recorded_at__lte=latest_update_time + timedelta(minutes=5) # Add a small buffer
        )

        leetcode_top_coders = base_query.filter(
            handlerid__platform=UserHandler.LEETCODE
        ).order_by('-submissions')[:3] # Top 3
        
        github_top_coders = base_query.filter(
            handlerid__platform=UserHandler.GITHUB
        ).order_by('-contributions')[:3] # Top 3
        
        # Serialize the data
        # The serializer_class is IndividualStatsSerializer, so this will work.
        # However, it expects a queryset. We have lists of objects.
        # The context must be passed to the serializer if it relies on `request`.
        # Your IndividualStatsSerializer is simple so it might not need context.
        context = {'request': request}
        leetcode_serializer = self.get_serializer(leetcode_top_coders, many=True, context=context)
        github_serializer = self.get_serializer(github_top_coders, many=True, context=context)
        
        return Response({
            'leetcode_top': leetcode_serializer.data,
            'github_top': github_serializer.data,
            'last_updated_at': latest_update_time,
            'next_update_at': self.get_next_update_timestamp()
        }, status=status.HTTP_200_OK)

    def get_next_update_timestamp(self):
        # Calculate next Saturday midnight (Asia/Calcutta or your CELERY_TIMEZONE)
        # Your celery.py uses crontab(hour=0, minute=0, day_of_week=6) (Saturday)
        # TIME_ZONE = 'Asia/Calcutta' in settings.py
        
        # This is a simplified calculation. For robust timezone handling,
        # use pytz or Django's timezone utilities carefully.
        now = timezone.now() # This is timezone-aware if USE_TZ=True
        
        # day_of_week: Monday is 0 and Sunday is 6 for weekday()
        # crontab: day_of_week=6 means Saturday (0-6, Sunday=0 or 7)
        # Python's weekday(): Monday is 0, Sunday is 6. Saturday is 5.
        
        days_until_saturday = (5 - now.weekday() + 7) % 7
        
        next_saturday = now + timedelta(days=days_until_saturday)
        next_saturday_midnight = next_saturday.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # If today is Saturday and past midnight, next update is next week's Saturday
        if next_saturday_midnight < now :
             next_saturday_midnight += timedelta(days=7)
        return next_saturday_midnight    


class UserHandlersAllAPIView(generics.ListAPIView):
    """ Get all Userhandlers """
    
    permission_classes = [permissions.IsAdminUser]
    
    queryset = UserHandler.objects.all()
    serializer_class = UserHandlerSerializer