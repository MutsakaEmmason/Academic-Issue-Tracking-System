# backend/issues/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

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
    GetCSRFToken,
    CustomTokenObtainPairView, # Use your custom token obtain view
    UserProfileView,
    # AssignIssueView,  # These are NO LONGER in views.py, so they MUST NOT be imported
    # ResolveIssueView  # These are NO LONGER in views.py, so they MUST NOT be imported
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
    # Include the router URLs (this handles /api/issues/{id}/resolve/ and /api/issues/{id}/assign_to_lecturer/)
    path('', include(router.urls)),

    # --- Authentication & Registration Endpoints (Adjusted for Frontend Expectations) ---

    # CSRF Token endpoint (Important for frontend)
    path('csrf/', GetCSRFToken.as_view(), name='csrf_token'),

    # Standard JWT Token Endpoints
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Registration Endpoints
    # The frontend is hitting /lecturer-register and /registrar-signup directly
    path('lecturer-register/', LecturerRegistrationView.as_view(), name='lecturer-registration'), # Matches screenshot URL
    path('registrar-signup/', RegistrarSignupView.as_view(), name='registrar-signup'), # Matches screenshot URL
    path('register/', StudentRegistrationView.as_view(), name='student-registration'), # General/student registration if needed

    # Login Endpoints (based on frontend attempts)
    # The frontend seems to be trying /lecturer/login/
    # If CustomTokenObtainPairView is handling all logins, you might need a redirect or proxy,
    # or ensure your frontend always hits '/token/'. For now, let's add specific path:
    # If the frontend hits 'lecturer/login/', you might need to map it to the token view.
    # **CONSIDER:** If all logins go to /token/, remove these custom login paths from frontend/backend.
    path('lecturer/login/', CustomTokenObtainPairView.as_view(), name='lecturer-login'), # Map to general token view
    path('registrar/login/', CustomTokenObtainPairView.as_view(), name='registrar-login'), # Map to general token view

    # --- Profile & Details Endpoints ---
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('student-profile/', StudentProfileView.as_view(), name='student-profile'),
    path('lecturer-details/', LecturerDetailsView.as_view(), name='lecturer-details'),
    path('registrar-profile/', RegistrarProfileView.as_view(), name='registrar-profile'),

    # REMOVED: These explicit paths are no longer needed for assign/resolve
    # They are handled by the IssueViewSet's @action decorators and the DefaultRouter.
    # Frontend should now call /api/issues/{id}/assign_to_lecturer/
    # and /api/issues/{id}/resolve/
]
