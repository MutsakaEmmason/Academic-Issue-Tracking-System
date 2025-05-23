from django.http import HttpResponse
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from django.conf import settings
from django.conf.urls.static import static
from issues.views import GetCSRFToken,CustomTokenObtainPairView

def home(request):
    return HttpResponse("Welcome to the Academic Issue Tracking System!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('issues.urls')),  # Including your app's URLs here
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Token Obtain
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Token Refresh
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),  # Token Verify
    path('api/csrf-token/', GetCSRFToken.as_view(), name='csrf-token'),
    
    path('', TemplateView.as_view(template_name="index.html")),
    
]

# Add static files serving

