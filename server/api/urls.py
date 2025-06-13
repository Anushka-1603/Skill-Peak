from django.urls import path
from . import views
from . import auth
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('', views.UserProfileListCreateAPIView.as_view()),
    path('<int:pk>/', views.UserProfileDetailAPIView.as_view()),
    path('userhandlers/', views.UserHandlerListCreateAPIView.as_view()),
    path('userhandler/', views.UserHandlerDetailAPIView.as_view()),
    path('userhandlers/viewhandler/', views.IndividualStatsRetrieveAPIView.as_view()),
    path('userhandlers/all/', views.UserHandlersAllAPIView.as_view()),    
    path('userhandlers/update-stats/', views.UpdateStatsAPIView.as_view()),
    path('dashboard-stats/', views.UserDashboardStatsAPIView.as_view()),
    path('auth/register/', auth.RegisterView.as_view(), name='register'),
    path('auth/login/', auth.LoginView.as_view(), name='login'),
    path('auth/logout/', auth.LogoutView.as_view(), name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]