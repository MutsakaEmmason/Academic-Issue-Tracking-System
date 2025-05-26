# backend/issues/urls.py
from django.urls import path, include
# Remove RedirectView import if no longer used
# from django.views.decorators.csrf import ensure_csrf_cookie # Keep if get_csrf_token is here
# from django.http import JsonResponse # Keep if get_csrf_token is here

from rest_framework.routers import DefaultRouter
from .views import (
    CustomUserViewSet,
    IssueViewSet,
    CommentViewSet,
    NotificationViewSet,
    AuditLogViewSet,
    IssueAttachmentViewSet,
    StudentRegistrationView,
    StudentProfileView,
    # Corrected imports for views you have defined:
    LecturerRegistrationView,  # Correct name
    LecturerDetailsView,        # Correct name
    RegistrarSignupView,        # Correct name
    RegistrarProfileView,      # Correct name
    AssignIssueView,
    LecturerListView,# Correct name
    ResolveIssueView)
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
    path('lecturer/register/', LecturerRegistrationView.as_view(), name='lecturer-registration'),
    # path('lecturer/login/', LecturerLoginView.as_view(), name='lecturer-login'),
    path('lecturer/details/', LecturerDetailsView.as_view(), name='lecturer-details'),
    path('lecturers/', LecturerListView.as_view(), name='lecturer-list'),
    path('registrar/signup/', RegistrarSignupView.as_view(), name='registrar-signup'),
    path('registrar-profile/', RegistrarProfileView.as_view(), name='registrar-profile'),
    path('issues/<int:issue_id>/assign/', AssignIssueView.as_view(), name='issue-assign'),
    path('resolve-issue/<int:issue_id>/', ResolveIssueView.as_view(), name='issue-resolve'), # This matches your frontend call


    # IMPORTANT: The csrf-token path should be in backend/urls.py, not here if it's already there.
    # If GetCSRFToken is an issue-specific view and you need it within /api/, keep it:
    # path('csrf-token/', GetCSRFToken.as_view(), name='csrf-token'), # Example if specific to issues app
]
