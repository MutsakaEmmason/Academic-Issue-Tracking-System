# authentication/urls.py
from django.urls import path
# Correct the import statement to use UserRegistrationView
from .views import UserRegistrationView, LoginView # <-- Changed from RegisterView

urlpatterns = [
    # Map 'register/' to UserRegistrationView
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]
