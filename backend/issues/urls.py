# backend/issues/urls.py
from django.urls import path, include
# Remove RedirectView import if no longer used
# from django.views.decorators.csrf import ensure_csrf_cookie # Keep if get_csrf_token is here
# from django.http import JsonResponse # Keep if get_csrf_token is here

from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, IssueViewSet, CommentViewSet, NotificationViewSet, AuditLogViewSet
from .views import IssueAttachmentViewSet, StudentRegistrationView, StudentProfileView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView # Include if used


# Initialize the router
router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'issues', IssueViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'attachments', IssueAttachmentViewSet)


urlpatterns = [
    # All paths defined here will automatically have the '/api/' prefix
    # because of path('api/', include('issues.urls')) in backend/urls.py

    # Include the router URLs
    path('', include(router.urls)),

    # Direct API endpoints (no 'api/' prefix here)
    path('register/', StudentRegistrationView.as_view(), name='student-registration'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # This is the correct way
    path('student-profile/', StudentProfileView.as_view(), name='student-profile'),

    # Add other specific views like lecturer/registrar if they exist
    # path('lecturer/register/', YourLecturerRegistrationView.as_view(), name='lecturer-registration'),
    # path('lecturer/login/', YourLecturerLoginView.as_view(), name='lecturer-login'),
    # path('lecturer/details/', YourLecturerDetailsView.as_view(), name='lecturer-details'),
    # path('registrar/signup/', YourRegistrarSignupView.as_view(), name='registrar-signup'),
    # path('registrar-profile/', YourRegistrarProfileView.as_view(), name='registrar-profile'),

    # IMPORTANT: The csrf-token path should be in backend/urls.py, not here if it's already there.
    # If GetCSRFToken is an issue-specific view and you need it within /api/, keep it:
    # path('csrf-token/', GetCSRFToken.as_view(), name='csrf-token'), # Example if specific to issues app
]
