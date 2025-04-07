from django.http import HttpResponse
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView  # Add TokenVerifyView

def home(request):
    return HttpResponse("Welcome to the Academic Issue Tracking System!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('issues.urls')),  # Including your app's URLs here
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Token Obtain
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Token Refresh
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),  # Token Verify (added)
    path('', home),  # Home page route
]


