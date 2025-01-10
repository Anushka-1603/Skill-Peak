from django.shortcuts import render
from .models import UserProfile, UserHandler, IndividualStats
from .serializers import UserProfileSerializer, UserHandlerSerializer, IndividualStatsSerializer
from rest_framework import generics
from rest_framework.response import Response
from .scrapers import scrape_leetcode, scrape_github
import datetime

class UserProfileDetailAPIView(generics.RetrieveAPIView):
    """ Get details of a single user """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'pk'

class UserProfileListCreateAPIView(generics.ListCreateAPIView):
    """ Get list of all users or create a new user """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    
class UserHandlerDetailAPIView(generics.RetrieveAPIView, generics.DestroyAPIView):
    """ Get or delete details of a single user handler """
    queryset = UserHandler.objects.all()
    serializer_class = UserHandlerSerializer
    lookup_field = 'pk'

class UserHandlerListCreateAPIView(generics.ListCreateAPIView):
    """ Get list of all user handlers or create a new user handler """
    queryset = UserHandler.objects.all()
    serializer_class = UserHandlerSerializer
    # permission_classes = [IsAuthenticated]
    
    # def get_queryset(self):
    #     # a logged in user can view only the user handlers he has added
    #     print(self.request.user.email)
    #     user_profile = UserProfile.objects.get(email=self.request.user.email)
    #     # print(user_profile)
    #     res = UserHandler.objects.filter(user=user_profile)
    #     # print(res)
    #     return res
    
    # def perform_create(self, serializer):
    #     # Automatically associate the handler with the logged-in user's profile
    #     user_profile = UserProfile.objects.get(email=self.request.user.email)
    #     serializer.save(user=user_profile)

class IndividualStatsRetrieveAPIView(generics.RetrieveAPIView):
    """ Get stats associated with a single user handler """
    queryset = IndividualStats.objects.all()
    serializer_class = IndividualStatsSerializer
    lookup_field = 'pk'
    
class UpdateStatsAPIView(generics.UpdateAPIView, generics.CreateAPIView):
    """ Update stats or create new stat associated with a single user handler """
    queryset = IndividualStats.objects.all()
    serializer_class = IndividualStatsSerializer
    
    def get(self, request, *args, **kwargs):
        userHandlers = UserHandler.objects.all()
        
        for userHandler in userHandlers:
            if userHandler.platform == userHandler.LEETCODE:
                submissions = scrape_leetcode(userHandler.handlerid)
                contributions = 0
                
            elif userHandler.platform == userHandler.GITHUB:
                contributions = scrape_github(userHandler.handlerid)
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