from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile, UserHandler, IndividualStats

class AdminUserProfile(UserAdmin):
    fieldsets = UserAdmin.fieldsets
    list_display = ['username', 'first_name', 'last_name', 'email', 'date_joined']
    
class AdminUserHandler(admin.ModelAdmin):
    list_display = ['handlername', 'handlerid', 'user', 'platform', 'created_at']
    
class AdminIndividualStats(admin.ModelAdmin):
    list_display = ['handlerid', 'contributions', 'submissions', 'recorded_at']

admin.site.register(UserProfile, AdminUserProfile)
admin.site.register(UserHandler, AdminUserHandler)
admin.site.register(IndividualStats, AdminIndividualStats)