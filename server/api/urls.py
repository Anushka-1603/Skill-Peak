from django.urls import path
from . import views

urlpatterns = [
    # user profile endpoints
    path('users/', views.UserProfileListCreateAPIView.as_view()),
    path('users/<int:pk>/', views.UserProfileDetailAPIView.as_view()),
]