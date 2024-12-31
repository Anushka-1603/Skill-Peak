from django.urls import path
from . import views

urlpatterns = [
    # user profile endpoints
    path('users/', views.UserProfileListCreateAPIView.as_view()),
    path('users/<int:pk>/', views.UserProfileDetailAPIView.as_view()),
    
    # user handler endpoints
    path('users/userhandlers/', views.UserHandlerListCreateAPIView.as_view()),
    path('users/userhandlers/<int:pk>/', views.UserHandlerDetailAPIView.as_view()),
    
    # get individual stats endpoint
    path('users/userhandlers/stats/<int:pk>/', views.IndividualStatsRetrieveAPIView.as_view()),
]