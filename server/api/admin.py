from django.contrib import admin
from .models import UserProfile, UserHandler, IndividualStats

admin.site.register(UserProfile)
admin.site.register(UserHandler)
admin.site.register(IndividualStats)