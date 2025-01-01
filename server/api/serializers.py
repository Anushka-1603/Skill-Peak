from rest_framework import serializers
from .models import UserProfile, UserHandler, IndividualStats

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserHandlerSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.name')
    class Meta:
        model = UserHandler
        fields = '__all__'
        
class IndividualStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualStats
        fields = '__all__'