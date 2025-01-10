from django.contrib import admin
from .models import UserProfile, UserHandler, IndividualStats

class AdminUserProfile(admin.ModelAdmin):
    list_display = ['name', 'email', 'created_at']
    
class AdminUserHandler(admin.ModelAdmin):
    list_display = ['handlername', 'handlerid', 'user', 'platform', 'created_at']
    
class AdminIndividualStats(admin.ModelAdmin):
    list_display = ['handlerid', 'contributions', 'submissions', 'recorded_at']

admin.site.register(UserProfile, AdminUserProfile)
admin.site.register(UserHandler, AdminUserHandler)
admin.site.register(IndividualStats, AdminIndividualStats)