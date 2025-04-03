from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Academic Issue Tracking System!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('issues.urls')),  # Includes the issues app URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT token obtain endpoint
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # JWT token refresh endpoint
    path('', home),  # Home page route
    
]
