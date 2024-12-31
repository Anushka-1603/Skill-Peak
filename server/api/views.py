from django.shortcuts import render
from .models import UserProfile, UserHandler, IndividualStats
from .serializers import UserProfileSerializer, UserHandlerSerializer, IndividualStatsSerializer
from rest_framework import generics

class UserProfileDetailAPIView(generics.RetrieveAPIView):
    """ Get details of a single user """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'pk'

class UserProfileListCreateAPIView(generics.ListCreateAPIView):
    """ Get list of all users or create a new user """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    
class UserHandlerDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """ Get, add, or delete details of a single user handler """
    queryset = UserHandler.objects.all()
    serializer_class = UserHandlerSerializer
    lookup_field = 'pk'

class UserHandlerListCreateAPIView(generics.ListCreateAPIView):
    """ Get list of all user handlers or create a new user handler """
    queryset = UserHandler.objects.all()
    serializer_class = UserHandlerSerializer
    
class IndividualStatsRetrieveAPIView(generics.RetrieveAPIView):
    """ Get stats associated with a single user handler """
    queryset = IndividualStats.objects.all()
    serializer_class = IndividualStatsSerializer
    lookup_field = 'pk'