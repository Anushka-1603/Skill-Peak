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
            user_handler = UserHandler.objects.get(handlerid=data['handlerid'], platform=data['platform'])
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
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
class IndividualStatsRetrieveAPIView(generics.RetrieveAPIView):
    """ Get stats associated with a single user handler for any given number of days"""
    queryset = IndividualStats.objects.all()
    serializer_class = IndividualStatsSerializer
    permission_classes = [permissions.IsAuthenticated]
        
    def get(self, request, *args, **kwargs):
        data = request.data
        # data = json.loads(request.body)
        handlerid = data.get('handlerid')
        days = data.get('days')
        platform = data.get('platform')        
        
        # Check if the UserHandler is associated with the logged-in user's UserProfile
        try:
            user_handler = UserHandler.objects.get(handlerid=handlerid, user=request.user)
        except UserHandler.DoesNotExist:
            raise PermissionDenied("You do not have permission to access this resource.")
        
        if platform == 'leetcode':
            submissions = scrape_leetcode(handlerid,days)
            contributions = 0
            return Response({'Leetcode submissions':submissions})
        elif platform == 'github':
            contributions = scrape_github(handlerid,days)
            submissions = 0
            return Response({'Github contributions':contributions})
        else:
            return Response({'message':'Invalid platform'})
            
    
class UpdateStatsAPIView(generics.UpdateAPIView, generics.CreateAPIView):
    """ Update stats or create new stat associated with a single user handler """
    queryset = IndividualStats.objects.all()
    serializer_class = IndividualStatsSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request, *args, **kwargs):
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
        
        leetcode_serializer = self.get_serializer(leetcode_top_coders, many=True)
        github_serializer = self.get_serializer(github_top_coders, many=True)
        
        return Response(
            {
                'leetcode': leetcode_serializer.data,
                'github': github_serializer.data
            }
        )
        
class UserHandlersAllAPIView(generics.ListAPIView):
    """ Get all Userhandlers """
    
    permission_classes = [permissions.IsAdminUser]
    
    queryset = UserHandler.objects.all()
    serializer_class = UserHandlerSerializer