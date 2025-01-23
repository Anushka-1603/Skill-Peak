from rest_framework import serializers
from .models import UserProfile, UserHandler, IndividualStats

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'password']

class UserHandlerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHandler
        fields = '__all__'
        
class IndividualStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualStats
        fields = '__all__'