# backend/issues/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from .views import (
    CustomUserViewSet,
    IssueViewSet,
    CommentViewSet,
    NotificationViewSet,
    AuditLogViewSet,
    IssueAttachmentViewSet,
    StudentRegistrationView,
    StudentProfileView,
    LecturerRegistrationView,
    LecturerDetailsView,
    RegistrarSignupView,
    RegistrarProfileView,
    # REMOVED: AssignIssueView,  <-- REMOVE THIS LINE
    # REMOVED: ResolveIssueView  <-- REMOVE THIS LINE
    GetCSRFToken, # Assuming you want to expose this via /api/csrf/
    CustomTokenObtainPairView, # Use your custom token view if it's CustomTokenObtainPairView
    UserProfileView, # From your views.py, if you use it for a general profile
)


# Initialize the router
router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'issues', IssueViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'attachments', IssueAttachmentViewSet)


urlpatterns = [
    # Include the router URLs (this handles /api/issues/{id}/resolve/ and /api/issues/{id}/assign/)
    path('', include(router.urls)),

    # Direct API endpoints
    path('csrf/', GetCSRFToken.as_view(), name='csrf_token'), # Corrected name as GetCSRFToken
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), # Use your custom one
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Make sure to include refresh
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'), # Make sure to include verify

    path('register/', StudentRegistrationView.as_view(), name='student-registration'), # General user registration
    path('register/lecturer/', LecturerRegistrationView.as_view(), name='lecturer-registration'),
    path('register/registrar/', RegistrarSignupView.as_view(), name='registrar-signup'),

    path('profile/', UserProfileView.as_view(), name='user_profile'), # General user profile
    path('student-profile/', StudentProfileView.as_view(), name='student-profile'),
    path('lecturer-details/', LecturerDetailsView.as_view(), name='lecturer-details'),
    path('registrar-profile/', RegistrarProfileView.as_view(), name='registrar-profile'),

    # REMOVED: These are now handled by the IssueViewSet actions via the router
    # path('issues/<int:issue_id>/assign/', AssignIssueView.as_view(), name='issue-assign'),
    # path('resolve-issue/<int:issue_id>/', ResolveIssueView.as_view(), name='issue-resolve'),
]
