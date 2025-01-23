from django.urls import path
from . import views
from . import auth
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # user profile endpoints
    path('', views.UserProfileListCreateAPIView.as_view()),
    path('<int:pk>/', views.UserProfileDetailAPIView.as_view()),
    
    # user handler endpoints
    path('userhandlers/', views.UserHandlerListCreateAPIView.as_view()),
    path('userhandlers/<int:pk>/', views.UserHandlerDetailAPIView.as_view()),
        
    path('userhandlers/viewhandler/', views.IndividualStatsRetrieveAPIView.as_view()),
    
    path('user/userhandlers/<int:user_id>', views.UserHandlerofUserAPIView.as_view()),
    
    # update stats endpoint
    path('userhandlers/update-stats/', views.UpdateStatsAPIView.as_view()),
    
    # authentication endpoints
    path('auth/register/', auth.RegisterView.as_view(), name='register'),
    path('auth/login/', auth.LoginView.as_view(), name='login'),
    path('auth/logout/', auth.LogoutView.as_view(), name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]