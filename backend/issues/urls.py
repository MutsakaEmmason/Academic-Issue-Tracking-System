# backend/backend/urls.py
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    # Your existing URLs
    path('api/', include('authentication.urls')),
    path('api/', include('issues.urls')),
    
    # Add these redirects for direct access to endpoints
    path('register/', RedirectView.as_view(url='/api/register/', permanent=False)),
    path('token/', RedirectView.as_view(url='/api/token/', permanent=False)),
    path('lecturer/register/', RedirectView.as_view(url='/api/lecturer/register/', permanent=False)),
    path('lecturer/login/', RedirectView.as_view(url='/api/lecturer/login/', permanent=False)),
    path('student-profile/', RedirectView.as_view(url='/api/student-profile/', permanent=False)),
    path('lecturer/details/', RedirectView.as_view(url='/api/lecturer/details/', permanent=False)),
    path('registrar/signup/', RedirectView.as_view(url='/api/registrar/signup/', permanent=False)),
    path('registrar-profile/', RedirectView.as_view(url='/api/registrar-profile/', permanent=False)),
    
    # Add a catch-all redirect for any other API paths
    path('issues/', RedirectView.as_view(url='/api/issues/', permanent=False)),
    path('comments/', RedirectView.as_view(url='/api/comments/', permanent=False)),
    path('notifications/', RedirectView.as_view(url='/api/notifications/', permanent=False)),
    path('audit-logs/', RedirectView.as_view(url='/api/audit-logs/', permanent=False)),
    path('attachments/', RedirectView.as_view(url='/api/attachments/', permanent=False)),
    
    # Redirect for the proxy
    path('127.0.0.1:8000/api/<path:path>', RedirectView.as_view(url='/api/%(path)s', permanent=False)),
]
