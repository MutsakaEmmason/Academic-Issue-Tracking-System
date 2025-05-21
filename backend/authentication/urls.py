# authentication/urls.py
from django.urls import path
# Make sure this imports RegisterView, not UserRegistrationView
from .views import RegisterView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]
